import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { RESOURCE_ARTICLES, type ResourceArticle } from '../data/resources'
import collections from '../data/blog-collections.json'
import { INDIA_HUB } from '../data/industryArticles'
import './Blog.css'

const ARTICLES = [...RESOURCE_ARTICLES].sort((a, b) => b.dateTime.localeCompare(a.dateTime))
const CARD_LIMIT = 12
const TOPICS = ['All articles', 'Data & APIs', 'Data Centers', 'Oil & Gas', 'Space', 'Nuclear'] as const
const FEATURED_SLUGS = [
  'n-1-contingency-analysis-data-center',
  'data-center-for-sale',
  'fermibench-sota',
]
const FEATURED_ARTICLES = FEATURED_SLUGS.flatMap((slug) => ARTICLES.filter((article) => article.slug === slug))
const featuredSlugs = new Set(FEATURED_ARTICLES.map((article) => article.slug))

const BLOG_TITLE = 'Blog | Invariant'
const BLOG_DESCRIPTION = 'Reporting and practical guides on power, land, infrastructure, and regulation. From the Invariant team.'
const BLOG_IMAGE = `${SITE_URL}${FEATURED_ARTICLES[0].image}`
const BLOG_SCHEMA = [
  ORG_SCHEMA,
  breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Blog', url: `${SITE_URL}/blog` }]),
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Invariant Blog',
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    publisher: { '@id': `${SITE_URL}/#organization` },
    hasPart: [
      ...collections.map(collection => ({ '@type': 'CollectionPage', name: collection.title, url: `${SITE_URL}/blog/${collection.slug}` })),
      ...FEATURED_ARTICLES.map(article => ({ '@type': 'Article', headline: article.title, url: `${SITE_URL}/blog/${article.slug}` })),
    ],
  },
]

function Arrow({ size = 19 }: { size?: number }) {
  return <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
}

function BlogCard({ article, variant = 'standard' }: { article: ResourceArticle; variant?: 'lead' | 'secondary' | 'standard' }) {
  const isLead = variant === 'lead'
  return (
    <article className={`blog-index-card blog-index-card--${variant}`}>
      <Link to={`/blog/${article.slug}`} aria-labelledby={`title-${variant}-${article.slug}`}>
        <div className="blog-index-image">
          <img src={article.image} alt="" width="1440" height="960"
            loading={variant === 'standard' ? 'lazy' : undefined} fetchPriority={isLead ? 'high' : undefined} decoding="async" />
        </div>
        <div className="blog-index-card-content">
          <div className="blog-index-meta"><span>{article.topic}</span><time dateTime={article.dateTime}>{article.date}</time></div>
          <h3 id={`title-${variant}-${article.slug}`}>{article.title}</h3>
          {variant !== 'secondary' && <p>{article.summary}</p>}
          <span className="blog-index-arrow"><Arrow size={isLead ? 22 : 18} /></span>
        </div>
      </Link>
    </article>
  )
}

function normalizeSearch(value: string) {
  return value.toLowerCase()
    .replace(/(?<=\d),(?=\d{3}\b)/g, '')
    .replace(/[‐‑–—-]/g, ' ')
    .replace(/(\d)\s*(mw|gw|kw)\b/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

const POWER_VALUE = /\b(\d+(?:\.\d+)?) (kw|mw|gw)\b/g
const WATTS_PER_UNIT = { kw: 1e3, mw: 1e6, gw: 1e9 }

function powerValues(text: string) {
  return [...text.matchAll(POWER_VALUE)].map(([, amount, unit]) =>
    Number((Number(amount) * WATTS_PER_UNIT[unit as keyof typeof WATTS_PER_UNIT]).toPrecision(15)),
  )
}

function ArticleArchive({ articles, filtered }: { articles: ResourceArticle[]; filtered: boolean }) {
  if (articles.length === 0) return null

  return (
    <details className="blog-index-archive" open={filtered}>
      <summary>
        <span>{filtered ? 'More matching titles' : 'Browse earlier articles'} <span className="blog-index-archive-count">({articles.length})</span></span>
      </summary>
      <ul>
        {articles.map(article => (
          <li key={article.slug}>
            <Link to={`/blog/${article.slug}`}>
              <span>{article.title}</span>
              <time dateTime={article.dateTime}>{article.date}</time>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}

export default function Blog() {
  const [topic, setTopic] = useState<typeof TOPICS[number]>('All articles')
  const [query, setQuery] = useState('')
  const normalizedQuery = normalizeSearch(query)
  const requestedPower = powerValues(normalizedQuery)
  const terms = normalizedQuery.replace(POWER_VALUE, ' ').split(/\s+/).filter(Boolean)
  const isFiltered = topic !== 'All articles' || normalizedQuery.length > 0
  const articles = ARTICLES.filter((article) => {
    if (!isFiltered) return !featuredSlugs.has(article.slug)
    if (topic !== 'All articles' && topic !== article.topic) return false
    const searchable = normalizeSearch(`${article.title} ${article.summary} ${article.topic} ${article.region ?? ''}`)
    if (!terms.every(term => searchable.includes(term))) return false
    if (requestedPower.length === 0) return true
    const reportedPower = powerValues(searchable)
    return requestedPower.every(power => reportedPower.includes(power))
  })

  return (
    <div className="blog-index">
      <Seo title={BLOG_TITLE} description={BLOG_DESCRIPTION} canonical={`${SITE_URL}/blog`} ogImage={BLOG_IMAGE} jsonLd={BLOG_SCHEMA} />
      <div className="blog-index-inner">
        <header className="blog-index-intro">
          <h1>Blog</h1>
          <div className="blog-index-intro-copy">
            <p>{BLOG_DESCRIPTION}</p>
            <Link to="/blog/energized-data-center-sites-available-now">Find available data center sites <Arrow size={14} /></Link>
          </div>
        </header>
        <section className="blog-index-feature" aria-labelledby="blog-featured">
          <h2 id="blog-featured" className="sr-only">Featured articles</h2>
          {FEATURED_ARTICLES.map((article, i) => <BlogCard key={article.slug} article={article} variant={i === 0 ? 'lead' : 'secondary'} />)}
        </section>
        <nav className="blog-index-collections" aria-label="Guide collections">
          {collections.map(collection => (
            <Link key={collection.slug} to={`/blog/${collection.slug}`}>{collection.navLabel} <Arrow size={15} /></Link>
          ))}
          <Link to={INDIA_HUB}>Data centre approvals in India <Arrow size={15} /></Link>
        </nav>
        <section className="blog-index-library" aria-labelledby="blog-library">
          <div className="blog-index-library-top">
            <h2 id="blog-library">Browse articles</h2>
            <label className="blog-index-search">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.1" /><path d="m11.5 11.5 4 4" /></svg>
              <span className="sr-only">Search articles</span>
              <input type="search" placeholder="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
          </div>
          <div className="blog-index-controls">
              <div className="blog-index-filters" role="group" aria-label="Filter articles by topic">
              {TOPICS.map((value) => <button type="button" key={value} aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</button>)}
            </div>
            <p className="blog-index-count" role="status">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</p>
          </div>
          {articles.length > 0 && (
            <div className="blog-index-grid">
              {articles.slice(0, CARD_LIMIT).map(article => <BlogCard key={article.slug} article={article} />)}
            </div>
          )}
          <ArticleArchive key={String(isFiltered)} articles={articles.slice(CARD_LIMIT)} filtered={isFiltered} />
          {articles.length === 0 && (
            <div className="blog-index-empty"><p>No articles match your search.</p><button type="button" onClick={() => { setTopic('All articles'); setQuery('') }}>Clear filters</button></div>
          )}
        </section>
      </div>
    </div>
  )
}
