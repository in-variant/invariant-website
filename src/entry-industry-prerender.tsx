import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Nav from './components/Nav'
import Footer from './components/Footer'
import SiteCrosshair from './components/SiteCrosshair'
import IndustryArticle, { articleJsonLd } from './pages/blog/IndustryArticle'
import IndustryHub from './pages/IndustryHub'
import { INDUSTRY_ARTICLES, articleImage, versionedImage } from './data/industryArticles'
import { INDUSTRY_HUBS, hubIncludes } from './data/industryHubs'
import { SITE_URL, ORG_SCHEMA, breadcrumbSchema } from './components/Seo'
import type { ReactNode } from 'react'

function body(path: string, page: ReactNode) {
  return renderToString(<StaticRouter location={path}><HelmetProvider><div className="site-shell min-h-screen flex flex-col"><SiteCrosshair /><Nav /><main id="main-content" className="site-main flex-1 site-main--bespoke">{page}</main><Footer /></div></HelmetProvider></StaticRouter>)
}

export function industryPages() {
  return [
    ...INDUSTRY_ARTICLES.map(article => {
      const canonical = `${SITE_URL}/blog/${article.slug}`
      const ogImage = `${SITE_URL}${articleImage(article.slug)}`
      return {
        slug: `blog/${article.slug}`, title: `${article.title} | Invariant`, description: article.description, canonical, ogImage, ogType: 'article',
        source: 'src/pages/blog/IndustryArticle.tsx',
        bodyHtml: body(`/blog/${article.slug}`, <IndustryArticle articleSlug={article.slug} renderSeo={false} />),
        jsonLd: articleJsonLd(article),
      }
    }),
    ...INDUSTRY_HUBS.map(hub => ({
      slug: hub.slug, title: `${hub.title} | Invariant`, description: hub.description, canonical: `${SITE_URL}/${hub.slug}`, ogImage: `${SITE_URL}${versionedImage(hub.image)}`, ogType: 'website',
      source: 'src/pages/IndustryHub.tsx',
      bodyHtml: body(`/${hub.slug}`, <IndustryHub slug={hub.slug} renderSeo={false} />),
      jsonLd: [ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: hub.region === 'India' ? 'India data centre approvals' : `${hub.topic} compliance`, url: `${SITE_URL}/${hub.slug}` }]), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: hub.title, description: hub.description, url: `${SITE_URL}/${hub.slug}`, hasPart: INDUSTRY_ARTICLES.filter(article => hubIncludes(hub, article)).map(article => ({ '@type': 'Article', headline: article.title, url: `${SITE_URL}/blog/${article.slug}` })) }],
    })),
  ]
}
