import { lazy, Suspense, type ComponentType } from 'react'
import { BrowserRouter, Routes, Route, matchRoutes, useParams } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import { contentRouteSources, deckRouteSources, loadContentPage } from './contentRoutes'
import { articleLoader } from './data/industryArticles'
import NotFound from './pages/NotFound'

const IndustryHub = lazy(() => import('./pages/IndustryHub'))
const loadArticlePage = () => import('./pages/blog/IndustryArticle')
const loadGlossaryEntryPage = () => import('./pages/GlossaryEntryPage')
const loadGlossaryEntries = () => import('./data/glossaryEntries')

const deckRoutes = Object.entries(deckRouteSources).map(([path, source]) => ({
  path,
  Page: lazy(() => loadContentPage(source)),
}))

function deferredPage(importPage: () => Promise<{ default: ComponentType }>) {
  let Loaded: ComponentType | undefined
  const load = async () => {
    const module = await importPage()
    Loaded = module.default
    return module
  }
  const LazyPage = lazy(load)
  function Page() {
    const View = Loaded ?? LazyPage
    return <View />
  }
  return { Page, load }
}

const contentRoutes = Object.entries(contentRouteSources).map(([path, source]) => ({
  path,
  ...deferredPage(() => loadContentPage(source)),
}))

type SlugPageLoader = (slug: string) => ReturnType<typeof deferredPage> | undefined

function cacheSlugPages(loadPage: SlugPageLoader): SlugPageLoader {
  const pages = new Map<string, ReturnType<typeof deferredPage>>()
  return slug => {
    const page = pages.get(slug) ?? loadPage(slug)
    if (page) pages.set(slug, page)
    return page
  }
}

const articlePage = cacheSlugPages(slug => {
  const loadArticle = articleLoader(slug)
  if (!loadArticle) return undefined

  return deferredPage(async () => {
    const [{ default: Article }, article] = await Promise.all([loadArticlePage(), loadArticle()])
    return { default: () => <Article article={article} /> }
  })
})

const glossaryPage = cacheSlugPages(slug => deferredPage(async () => {
  const [{ default: GlossaryEntry }, { glossaryLoader }] = await Promise.all([
    loadGlossaryEntryPage(),
    loadGlossaryEntries(),
  ])
  const loadEntry = glossaryLoader(slug)
  if (!loadEntry) return { default: NotFound }
  const entry = await loadEntry()
  return { default: () => <GlossaryEntry entry={entry} /> }
}))

const slugRoutes = [
  { path: '/blog/:slug', loadPage: articlePage },
  { path: '/glossary/:slug', loadPage: glossaryPage },
]
const preloadRoutes = [...contentRoutes, ...slugRoutes]

function SlugRoute({ loadPage }: { loadPage: SlugPageLoader }) {
  const { slug } = useParams()
  const Page = slug ? loadPage(slug)?.Page : undefined
  return Page ? <Page /> : <NotFound />
}

export function preloadInitialPage(pathname: string) {
  const match = matchRoutes(preloadRoutes, pathname)?.[0]
  if (!match) return undefined
  const { route, params } = match
  if ('load' in route) return route.load()
  return params.slug ? route.loadPage(params.slug)?.load() : undefined
}

function PageFallback() {
  return <div className="min-h-screen bg-paper" />
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {deckRoutes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />)}
          <Route element={<Layout />}>
            {contentRoutes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />)}
            <Route path="/data-center-compliance" element={<IndustryHub slug="data-center-compliance" />} />
            <Route path="/data-centre-compliance-india" element={<IndustryHub slug="data-centre-compliance-india" />} />
            <Route path="/oil-gas-compliance" element={<IndustryHub slug="oil-gas-compliance" />} />
            {slugRoutes.map(({ path, loadPage }) => <Route key={path} path={path} element={<SlugRoute loadPage={loadPage} />} />)}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  )
}
