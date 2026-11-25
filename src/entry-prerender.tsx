import { Suspense } from 'react'
import { renderToString } from 'react-dom/server'
import { Route, Routes, StaticRouter } from 'react-router-dom'
import Layout from './components/Layout'
import { PrerenderSeo, type SeoProps } from './components/Seo'
import { contentRouteSources, loadContentPage } from './contentRoutes'
import { glossaryLoader, glossaryModulePath } from './data/glossaryEntries'
import { articleLoader, articleModulePath } from './data/industryArticles'
import { INDUSTRY_HUBS } from './data/industryHubs'
import GlossaryEntryPage from './pages/GlossaryEntryPage'
import IndustryHub from './pages/IndustryHub'
import IndustryArticle from './pages/blog/IndustryArticle'
import NotFound from './pages/NotFound'

export { clientOnlyPaths } from './contentRoutes'

async function pageFor(path: string) {
  if (path === '/404.html') {
    return { page: <NotFound />, source: './pages/NotFound.tsx' }
  }
  const source = contentRouteSources[path as keyof typeof contentRouteSources]
  if (source) {
    const { default: Page } = await loadContentPage(source)
    return { page: <Page />, source }
  }
  if (path.startsWith('/glossary/')) {
    const slug = path.slice('/glossary/'.length)
    const load = glossaryLoader(slug)
    if (!load) throw new Error(`Missing glossary entry for ${path}`)
    return {
      page: <GlossaryEntryPage entry={await load()} />,
      source: './pages/GlossaryEntryPage.tsx',
      dataSources: [glossaryModulePath(slug).slice(1), 'src/data/glossaryEntries.ts'],
    }
  }
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length)
    const load = articleLoader(slug)
    if (!load) throw new Error(`Missing industry article for ${path}`)
    return {
      page: <IndustryArticle article={await load()} />,
      source: './pages/blog/IndustryArticle.tsx',
      dataSources: [articleModulePath(slug).slice(1)],
    }
  }
  if (INDUSTRY_HUBS.some(hub => path === `/${hub.slug}`)) {
    return { page: <IndustryHub slug={path.slice(1)} />, source: './pages/IndustryHub.tsx' }
  }
  throw new Error(`No public route for ${path}`)
}

export async function renderPublicRoute(path: string) {
  const { page, source, dataSources } = await pageFor(path)
  const hydrate = path === '/datasets' ? 'catalog'
    : source === './pages/blog/IndustryArticle.tsx' ? 'article'
    : undefined
  const metadata: SeoProps[] = []
  const routes = (
    <Routes>
      <Route element={<Layout />}>
        <Route path={path} element={page} />
      </Route>
    </Routes>
  )
  const body = renderToString(
    <StaticRouter location={path}>
      <PrerenderSeo.Provider value={props => metadata.push(props)}>
        {hydrate ? <Suspense>{routes}</Suspense> : routes}
      </PrerenderSeo.Provider>
    </StaticRouter>,
  )
  if (metadata.length !== 1) throw new Error(`Expected one set of SEO metadata for ${path}, got ${metadata.length}`)
  return { body, seo: metadata[0], source: `src${source.slice(1)}`, dataSources, hydrate }
}
