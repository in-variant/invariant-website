import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DatasetCitation from '../components/DatasetCitation'
import { ResourceArrow } from '../components/ResourceCards'
import { DATA_CATALOG, DATASET_PUBLISHER, ORG_SCHEMA, SITE_URL, Seo, breadcrumbSchema } from '../components/Seo'
import { articleSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import { coverSrcSet } from '../data/coverSrcSets'
import { DATA_USE_CASES_PATH } from '../data/blogCollections'
import { RESEARCH_DATASETS } from '../data/resources'
import featuredResearch from '../data/featured-research-datasets.json'
import researchCatalog from '../data/research-dataset-catalog.json'
import { links as earthLinks } from '../data/earth-product.json'
import posthog from '../posthog'
import './Resources.css'
import './Datasets.css'

const title = 'Physical economy data samples'
const { url: canonical } = DATA_CATALOG
const { description, access } = researchCatalog

function trackResearchLink(properties: {
  action: 'study' | 'workflow' | 'sample' | 'api_coverage'
  surface: 'intro' | 'featured' | 'catalog'
  dataset?: string
  format?: string
}) {
  posthog.capture('research_catalog_link_clicked', properties, { transport: 'sendBeacon', send_instantly: true })
}
const featured = featuredResearch.flatMap(study => RESEARCH_DATASETS
  .filter(entry => entry.id === study.slug)
  .map(({ image, notesPath, workflow, dataset }) => ({ ...study, image, notesPath, workflow, sample: dataset.downloads[0] })),
)
const featuredQuestions = new Map(featured.map(({ slug, title, summary }) => [slug, `${title} ${summary}`]))
const formats = [...new Set(RESEARCH_DATASETS.flatMap(({ dataset }) => dataset.downloads.map(file => file.format)))].sort()
const datasetTopics = Object.entries(researchCatalog.topics).map(([label, articles]) => ({
  label,
  articles: new Set(articles),
}))
const catalogEntries = RESEARCH_DATASETS.map(entry => ({
  ...entry,
  topics: datasetTopics.filter(topic => topic.articles.has(entry.slug)).map(topic => topic.label),
}))
const topicLinks = [
  { label: '', count: catalogEntries.length },
  ...datasetTopics.map(({ label }) => ({
    label,
    count: catalogEntries.filter(entry => entry.topics.includes(label)).length,
  })),
]
const buildSearchIndex = () => prepareSearch(catalogEntries, ({ id, dataset, title, region, topic, topics, workflow }) => ({
  title: dataset.name,
  relatedTitle: title,
  metadata: [dataset.description, dataset.spatialCoverage, dataset.temporalCoverage,
    region, topic, ...topics, workflow?.label, featuredQuestions.get(id),
    ...dataset.downloads.map(file => `${file.label} ${file.format}`),
  ].join(' '),
  details: dataset.sourceDetails.map(({ publisher, title, url }) => `${publisher} ${title} ${new URL(url).hostname}`).join(' '),
}))

const catalog = {
  '@context': 'https://schema.org',
  ...DATA_CATALOG,
  description,
  publisher: DATASET_PUBLISHER,
}

const catalogPage = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': canonical,
  url: canonical,
  name: title,
  description,
  about: { '@id': DATA_CATALOG['@id'] },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: RESEARCH_DATASETS.map(({ notesPath, dataset }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: dataset.name,
      url: `${SITE_URL}${notesPath}`,
    })),
  },
}

export default function Datasets() {
  const [searchReady, setSearchReady] = useState(false)
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState('')
  const { search, hash } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const topic = datasetTopics.find(({ label }) => label === params.get('topic'))?.label ?? ''
  const searchInput = useRef<HTMLInputElement>(null)
  useEffect(() => setSearchReady(true), [])
  const terms = articleSearchWords(query)
  const searching = terms.length > 0
  const searchIndex = useMemo(() => searching ? buildSearchIndex() : null, [searching])
  const isFiltered = Boolean(searching || topic || format)
  const candidates = searchIndex ? rankSearch(searchIndex, terms, { numericPrefixes: true }) : catalogEntries
  const matches = candidates.filter(({ topics, dataset }) =>
    (!topic || topics.includes(topic)) &&
    (!format || dataset.downloads.some(file => file.format === format)),
  )

  const topicSearch = (label: string) => {
    const topicParams = new URLSearchParams(params)
    if (label) topicParams.set('topic', label)
    else topicParams.delete('topic')
    return topicParams.toString()
  }

  const clearFilters = () => {
    setQuery('')
    if (params.has('topic')) navigate({ search: topicSearch(''), hash })
    setFormat('')
    searchInput.current?.focus()
  }

  return (
    <div className="resources-page datasets-page">
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        markdown="/datasets.md"
        jsonLd={[ORG_SCHEMA, catalog, catalogPage, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: title, url: canonical }])]}
      />
      <div className="datasets-showcase">
        <header className="resource-container resources-intro">
          <div className="resources-intro-grid">
            <h1>Data samples for the physical economy</h1>
            <div>
              <p>{description}</p>
              <nav aria-label="Data samples and API" className="resources-data-links">
                <Link className="dataset-api-button" to={earthLinks.coverage}
                  onClick={() => trackResearchLink({ action: 'api_coverage', surface: 'intro' })}>
                  Check API coverage <ResourceArrow diagonal />
                </Link>
                <a className="dataset-method" href="#dataset-search">Browse all samples <span aria-hidden="true">↓</span></a>
              </nav>
            </div>
          </div>
        </header>
        <section className="resource-container dataset-featured" aria-labelledby="featured-studies-title">
          <div className="dataset-featured-heading">
            <h2 id="featured-studies-title">Explore by use case</h2>
            <Link className="dataset-method" to={DATA_USE_CASES_PATH}>All use-case guides <ResourceArrow diagonal /></Link>
          </div>
          <ul>
            {featured.map(({ slug, title, summary, scope, evidence, image, imageLabel, notesPath, workflow, sample, workflowLabel }, index) => (
              <li key={slug}>
                <Link className="dataset-featured-study" to={notesPath} aria-labelledby={`featured-${slug}`}
                  onClick={() => trackResearchLink({ action: 'study', surface: 'featured', dataset: slug })}>
                  <div className="dataset-featured-image">
                    <img src={image} srcSet={coverSrcSet(image)}
                      sizes="(max-width: 560px) calc(100vw - 48px), (max-width: 940px) 44vw, min(29vw, 524px)"
                      alt="" width="1600" height="900" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                    {imageLabel && <span>{imageLabel}</span>}
                  </div>
                  <div className="dataset-featured-copy">
                    <h3 id={`featured-${slug}`}>{title} <ResourceArrow diagonal /></h3>
                    <p>{summary}</p>
                    <p className="dataset-featured-evidence">
                      <span id={`sample-scope-${slug}`}>{scope}</span>
                      <span>{evidence}</span>
                    </p>
                  </div>
                </Link>
                <div className="dataset-featured-actions">
                  {workflow && <a className="dataset-featured-workflow" href={workflow.url}
                    onClick={() => trackResearchLink({ action: 'workflow', surface: 'featured', dataset: slug })}>
                    {workflowLabel} <ResourceArrow />
                  </a>}
                  <a className="dataset-featured-sample" href={sample.path} download aria-label={`Download ${sample.format} sample for ${title}`}
                    aria-describedby={`sample-scope-${slug}`}
                    onClick={() => trackResearchLink({ action: 'sample', surface: 'featured', dataset: slug, format: sample.format })}>
                    {sample.format} sample <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="resource-container datasets-list" aria-labelledby="dataset-search">
        <h2 id="dataset-search" tabIndex={-1}>Browse data samples</h2>
        <p className="dataset-scope">{access}{' '}
          <Link className="dataset-method" to={earthLinks.coverage}
            onClick={() => trackResearchLink({ action: 'api_coverage', surface: 'catalog' })}>
            Check API coverage <ResourceArrow diagonal />
          </Link>
        </p>
        <noscript><p className="dataset-scope">All examples are available below. Enable JavaScript to search or filter by topic.</p></noscript>
        <nav className="dataset-topics" aria-label="Dataset topics">
          {topicLinks.map(({ label, count }) => (
            <Link key={label} to={{ search: topicSearch(label), hash: '#dataset-search' }}
              aria-label={`${label || 'All topics'} ${count} research examples`}
              aria-current={label === topic ? 'true' : undefined}>
              {label || 'All topics'} <span aria-hidden="true">{count}</span>
            </Link>
          ))}
        </nav>
        <div className="dataset-controls">
          <label>
            <span>Search data samples</span>
            <input ref={searchInput} type="search" placeholder="Try flood zones, loan filings, or grid capacity" disabled={!searchReady} value={query} onChange={event => setQuery(event.target.value)} />
          </label>
          <label className="dataset-topic-select">
            <span>Topic</span>
            <select disabled={!searchReady} value={topic} onChange={event => navigate({ search: topicSearch(event.target.value), hash })}>
              {topicLinks.map(({ label, count }) => <option key={label} value={label}>{label || 'All topics'} ({count})</option>)}
            </select>
          </label>
          <label>
            <span>File format</span>
            <select disabled={!searchReady} value={format} onChange={event => setFormat(event.target.value)}>
              <option value="">All formats</option>
              {formats.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
        <div className="dataset-list-meta">
          <div className="dataset-results">
            <p role="status">{matches.length} {isFiltered ? 'matching' : 'published'} research {matches.length === 1 ? 'example' : 'examples'}</p>
            {isFiltered && <button type="button" className="dataset-clear" onClick={clearFilters}>Clear filters</button>}
          </div>
          <div className="dataset-catalog-downloads">
            <a href="/datasets.csl.json" download>Download citations (CSL JSON) <span aria-hidden="true">↓</span></a>
            <a href="/datasets.json" download>Download catalog (JSON) <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        {matches.length === 0 && (
          <p className="dataset-empty">No samples match your filters. Try a broader search or a different file format.</p>
        )}
        {matches.map(({ id, notesPath, datePublished, dataset, workflow }) => (
          <article className="dataset-row" key={id} id={id} aria-labelledby={`sample-title-${id}`}>
            <div className="dataset-copy">
              <h3 id={`sample-title-${id}`}>
                <Link className="dataset-title-link" to={notesPath}
                  onClick={() => trackResearchLink({ action: 'study', surface: 'catalog', dataset: id })}>
                  {dataset.name} <ResourceArrow diagonal />
                </Link>
              </h3>
              <p>{dataset.description}</p>
              {dataset.spatialCoverage && <p className="dataset-place">{dataset.spatialCoverage}</p>}
              {dataset.temporalCoverage && <p className="dataset-place">Record dates: {dataset.temporalCoverage.replace('/', ' to ')}</p>}
            </div>
            <div className="dataset-row-actions">
              {workflow && <a href={workflow.url} className="dataset-method dataset-row-workflow"
                onClick={() => trackResearchLink({ action: 'workflow', surface: 'catalog', dataset: id })}>
                {workflow.label} <ResourceArrow diagonal />
              </a>}
              <div className="dataset-downloads">
                {dataset.downloads.map(file => (
                  <a key={file.path} href={file.path} download aria-label={`${file.label} (${file.format})`}
                    onClick={() => trackResearchLink({ action: 'sample', surface: 'catalog', dataset: id, format: file.format })}>
                    {file.format} <span aria-hidden="true">↓</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="dataset-row-evidence">
              <details className="dataset-sources">
                <summary>Source records ({dataset.sourceDetails.length})</summary>
                {dataset.sourceReuse && <p className="dataset-reuse">{dataset.sourceReuse.note} <a href={dataset.sourceReuse.policyUrl}>{dataset.sourceReuse.policyLabel}</a></p>}
                <ul>
                  {dataset.sourceDetails.map(source => (
                    <li key={`${source.url}:${source.title}`}>
                      <a href={source.url}>{source.title}</a>
                      <span>{source.publisher}</span>
                      {source.license && <span><a href={source.license} aria-label={`Source license for ${source.title}`}>Source license</a></span>}
                    </li>
                  ))}
                </ul>
              </details>
              <DatasetCitation name={dataset.name} datePublished={datePublished} url={`${SITE_URL}${notesPath}`} />
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
