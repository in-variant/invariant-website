import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { ResourceArticleCard, ResourceArrow } from '../components/ResourceCards'
import { articleSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import { coverSrcSet } from '../data/coverSrcSets'
import type { ResourceTopic } from '../data/resources'
import { FEATURED_RESOURCE_ARTICLES, RESOURCE_REFERENCES } from '../data/resource-directory'
import { DATA_USE_CASES_PATH, DATA_USE_CASES_SLUG, groupCollectionGuides } from '../data/blogCollections'
import blogCollections from '../data/blog-collections.json'
import { useArticleSearchDetails } from '../lib/useArticleSearchDetails'
import './Resources.css'

const FORMATS = ['All', 'Guides', 'Tools', 'Datasets'] as const
type Format = typeof FORMATS[number]
const PAGE_SIZE = 8
const RESOURCE_TOPICS: ResourceTopic[] = ['Data & APIs', 'Data Centers', 'Oil & Gas']
const library = RESOURCE_REFERENCES.filter(resource => RESOURCE_TOPICS.includes(resource.topic))
const dataUseCases = blogCollections.find(collection => collection.slug === DATA_USE_CASES_SLUG)
const dataUseCaseGroups = groupCollectionGuides(dataUseCases?.guides ?? []).filter(group => group.heading)

export default function Resources() {
  const [searchReady, setSearchReady] = useState(false)
  const [format, setFormat] = useState<Format>('All')
  const [topic, setTopic] = useState('All topics')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => setSearchReady(true), [])
  const queryWords = articleSearchWords(query)
  const searching = queryWords.length > 0
  const { details, pending } = useArticleSearchDetails(searching && (format === 'All' || format === 'Guides'))
  const searchIndex = useMemo(() => searching ? prepareSearch(library, resource => ({
    title: resource.title,
    relatedTitle: resource.articleSlug,
    metadata: `${resource.summary} ${resource.topic} ${resource.searchContext ?? ''}`,
    details: resource.articleSlug ? details?.[resource.articleSlug]?.headings : undefined,
    bodyTerms: resource.articleSlug ? details?.[resource.articleSlug]?.bodyTerms : undefined,
  })) : [], [searching, details])
  const candidates = searching ? rankSearch(searchIndex, queryWords) : library
  const filtered = candidates.filter(resource =>
    (format === 'All' || `${resource.kind}s` === format) && (topic === 'All topics' || resource.topic === topic),
  )
  const clearFilters = () => { setFormat('All'); setTopic('All topics'); setQuery(''); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="resources-page">
      <Seo
        title="Physical-World Data Resources | Invariant"
        description="Find guides, datasets, and tools for site selection, property underwriting, power, logistics, and public projects. Explore the Invariant Earth API."
        canonical={`${SITE_URL}/resources`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'Resources', url: `${SITE_URL}/resources` }])]}
      />

      <header className="resources-intro resource-container">
        <div className="resources-intro-grid">
          <h1>Research and guides</h1>
          <p>Data and tools for evaluating sites, infrastructure, and property risk.</p>
        </div>
      </header>

      <section className="resource-container resources-data" aria-labelledby="resources-data-heading">
        <div className="resources-section-heading">
          <div>
            <h2 id="resources-data-heading">Data for your next decision.</h2>
            <p>Check what the records say about a site, an asset, or a market.</p>
          </div>
          <Link to={DATA_USE_CASES_PATH} className="resource-text-link">All data guides <ResourceArrow diagonal /></Link>
        </div>
        <ul className="resources-data-topics">
          <li><Link to="/blog/site-selection-due-diligence">Site selection <ResourceArrow diagonal /></Link></li>
          {dataUseCaseGroups.map(({ heading, id }) => (
            <li key={id}><Link to={`${DATA_USE_CASES_PATH}#${id}`}>{heading} <ResourceArrow diagonal /></Link></li>
          ))}
        </ul>
        <nav aria-label="Data downloads and API documentation" className="resources-data-links">
          <Link to="/datasets" className="resource-text-link">Data samples <ResourceArrow diagonal /></Link>
          <Link to="/data-coverage" className="resource-text-link">API data coverage <ResourceArrow diagonal /></Link>
          <a href="https://docs.invariant-ai.com/quickstart" className="resource-text-link">Invariant Earth API quickstart <ResourceArrow diagonal /></a>
        </nav>
      </section>

      <section className="resources-notes resource-container" aria-labelledby="resources-notes-heading">
        <div className="resources-section-heading">
          <h2 id="resources-notes-heading">Featured research</h2>
          <Link to="/research" className="resource-text-link">Explore research <ResourceArrow /></Link>
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
            <Link to="/blog/find-data-center-site-us" className="resource-text-link">Find a data center site <ResourceArrow diagonal /></Link>
            <Link to="/blog/physical-world-data-api-evaluation" className="resource-text-link">Compare physical-world data APIs <ResourceArrow diagonal /></Link>
            <Link to="/calculators/data-center-power-delivery-schedule" className="resource-text-link">Check power delivery dates <ResourceArrow diagonal /></Link>
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
            {searching && details === null && (format === 'All' || format === 'Guides') && ' (titles and descriptions only)'}
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
