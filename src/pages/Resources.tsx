import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { ResourceArticleCard, ResourceArrow } from '../components/ResourceCards'
import { editorialSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import { coverSrcSet } from '../data/coverSrcSets'
import type { ResourceTopic } from '../data/resources'
import { FEATURED_RESOURCE_ARTICLES, RESOURCE_REFERENCES } from '../data/resource-directory'
import resourceHub from '../data/resource-hub.json'
import earthProduct from '../data/earth-product.json'
import { useArticleSearchDetails } from '../lib/useArticleSearchDetails'
import './Resources.css'

const FORMATS = ['All', 'Guides', 'Tools', 'Datasets'] as const
type Format = typeof FORMATS[number]
const PAGE_SIZE = 8
const RESOURCE_TOPICS: ResourceTopic[] = ['Data & APIs', 'Data Centers', 'Oil & Gas']
const library = RESOURCE_REFERENCES.filter(resource => RESOURCE_TOPICS.includes(resource.topic))
const { heading, intro, workflows, planningLinks } = resourceHub
const { links } = earthProduct

export default function Resources() {
  const [searchReady, setSearchReady] = useState(false)
  const [format, setFormat] = useState<Format>('All')
  const [topic, setTopic] = useState('All topics')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => setSearchReady(true), [])
  const queryWords = editorialSearchWords(query)
  const searching = queryWords.length > 0
  const searchGuides = searching && (format === 'All' || format === 'Guides')
  const { details, pending: articleSearchPending } = useArticleSearchDetails(searchGuides)
  const [directorySearch, setDirectorySearch] = useState<Record<string, string> | null>()
  const directorySearchPending = searching && directorySearch === undefined
  useEffect(() => {
    if (!directorySearchPending) return
    let active = true
    import('../data/.generated-blog-search/resource-directory-search.json').then(
      ({ default: context }) => { if (active) setDirectorySearch(context) },
      () => { if (active) setDirectorySearch(null) },
    )
    return () => { active = false }
  }, [directorySearchPending])
  const pending = articleSearchPending || directorySearchPending
  const searchIndex = useMemo(() => searching ? prepareSearch(library, resource => ({
    title: resource.title,
    relatedTitle: resource.articleSlug,
    metadata: `${resource.summary} ${resource.topic} ${resource.searchContext ?? directorySearch?.[resource.path] ?? ''}`,
    details: resource.articleSlug ? details?.[resource.articleSlug]?.headings : undefined,
    bodyTerms: resource.articleSlug ? details?.[resource.articleSlug]?.bodyTerms : undefined,
  })) : [], [searching, details, directorySearch])
  const matchesFilters = (resource: (typeof library)[number]) =>
    (format === 'All' || `${resource.kind}s` === format) && (topic === 'All topics' || resource.topic === topic)
  const filtered = searching
    ? rankSearch(searchIndex.filter(({ entry }) => matchesFilters(entry)), queryWords, { allowPartialMatches: true, longQuestionRanking: true })
    : library.filter(matchesFilters)
  const clearFilters = () => { setFormat('All'); setTopic('All topics'); setQuery(''); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="resources-page">
      <Seo
        title="Physical-World Data Resources | Invariant"
        description="Find guides, datasets, and tools for site selection, property underwriting, power, logistics, and public projects. Explore the Invariant Earth API."
        canonical={`${SITE_URL}/resources`}
        markdown="/resources.md"
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'Resources', url: `${SITE_URL}/resources` }])]}
      />

      <header className="resources-intro resource-container">
        <div className="resources-intro-grid">
          <h1>{heading}</h1>
          <p>{intro}</p>
        </div>
      </header>

      <section className="resource-container resources-data" aria-labelledby="resources-data-heading">
        <div className="resources-section-heading">
          <h2 id="resources-data-heading">Find guides by workflow</h2>
          <Link to={links.guides} className="resource-text-link">All data guides <ResourceArrow diagonal /></Link>
        </div>
        <ul className="resources-data-topics">
          {workflows.map(({ label, path, guide, slug }) => (
            <li key={path}>
              <Link className="resource-workflow-heading" to={path}>{label} <ResourceArrow diagonal /></Link>
              <Link className="resource-workflow-guide" to={`/blog/${slug}`}>{guide}</Link>
            </li>
          ))}
        </ul>
        <nav aria-label="Data downloads and API documentation" className="resources-data-links">
          <Link to={links.coverage} className="resource-text-link">API data coverage <ResourceArrow diagonal /></Link>
          <Link to={links.datasets} className="resource-text-link">Data samples <ResourceArrow diagonal /></Link>
          <Link to="/glossary#property-infrastructure" className="resource-text-link">Property and infrastructure glossary <ResourceArrow diagonal /></Link>
          <a href={links.quickstart} className="resource-text-link">Invariant Earth API quickstart <ResourceArrow diagonal /></a>
        </nav>
      </section>

      <section className="resources-notes resource-container" aria-labelledby="resources-notes-heading">
        <div className="resources-section-heading">
          <h2 id="resources-notes-heading">Featured research</h2>
          <Link to={links.research} className="resource-text-link">Explore research <ResourceArrow /></Link>
        </div>
        <div className="resource-article-grid">
          {FEATURED_RESOURCE_ARTICLES.map((article) => <ResourceArticleCard key={article.slug} article={article} srcSet={coverSrcSet(article.image)} />)}
        </div>
      </section>

      <section className="resources-library" aria-labelledby="resources-library-heading">
        <div className="resource-container">
          <div className="resources-section-heading">
            <h2 id="resources-library-heading">Browse guides, tools, and datasets</h2>
          </div>
          <nav aria-label="Research and planning resources" className="mb-7 flex flex-wrap gap-x-6 gap-y-3">
            {planningLinks.map(({ label, path }) => (
              <Link key={path} to={path} className="resource-text-link">{label} <ResourceArrow diagonal /></Link>
            ))}
          </nav>
          <div className="resources-library-controls">
            <div className="resource-filters" role="group" aria-label="Filter by resource format">
              {FORMATS.map((value) => <button type="button" key={value} disabled={!searchReady} aria-pressed={format === value} onClick={() => { setFormat(value); setVisibleCount(PAGE_SIZE) }}>{value}</button>)}
            </div>
            <div className="resources-search-controls">
              <label className="resource-topic-select"><span className="sr-only">Filter by topic</span><select disabled={!searchReady} value={topic} onChange={(event) => { setTopic(event.target.value); setVisibleCount(PAGE_SIZE) }}><option>All topics</option>{RESOURCE_TOPICS.map(value => <option key={value}>{value}</option>)}</select><svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg></label>
              <label className="resource-search"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" /><path d="m12 12 4 4" /></svg><span className="sr-only">Search guides, tools, and datasets</span><input type="search" disabled={!searchReady} value={query} placeholder="Search the library" onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE) }} /></label>
            </div>
          </div>
          <p className="resources-result-count" role="status">
            {pending ? 'Searching the library…' : `${filtered.length} ${filtered.length === 1 ? 'resource' : 'resources'}`}
            {!pending && searching && ` matching “${query.trim()}”`}
            {!pending && searching && (directorySearch === null || (searchGuides && details === null)) && ' (some search details unavailable)'}
          </p>
          <div className="resources-reference-list">
            {filtered.slice(0, visibleCount).map((resource) => (
              <Link className="resources-reference" key={resource.path} to={resource.path}>
                <div className="resources-reference-meta"><span>{resource.kind}</span><span>{resource.topic}</span></div>
                <div className="resources-reference-copy"><h3>{resource.title}</h3><p>{resource.summary}</p></div>
                <ResourceArrow diagonal />
              </Link>
            ))}
          </div>
          {filtered.length === 0 && !pending && <div className="resource-empty"><h3>No matching resources.</h3><button type="button" className="resource-outline-button" onClick={clearFilters}>Clear filters <ResourceArrow /></button></div>}
          {filtered.length > visibleCount && <div className="resources-load-more"><span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}</span><button className="resource-outline-button" type="button" disabled={!searchReady} onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show more <span aria-hidden="true">+</span></button></div>}
        </div>
      </section>

      <section className="resource-container resources-contact" aria-labelledby="resources-contact-heading">
        <div><p className="resource-eyebrow">Put it into practice</p><h2 id="resources-contact-heading">What are you building?</h2><p>Talk to our team about the site or data you need.</p></div>
        <Link to="/contact" className="resource-solid-button">Talk to an expert <ResourceArrow diagonal /></Link>
      </section>
    </div>
  )
}
