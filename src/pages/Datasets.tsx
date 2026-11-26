import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DatasetCitation from '../components/DatasetCitation'
import { ResourceArrow } from '../components/ResourceCards'
import { DATA_CATALOG, DATASET_PUBLISHER, ORG_SCHEMA, SITE_URL, Seo, breadcrumbSchema } from '../components/Seo'
import { editorialSearchWords, prepareSearch, rankSearch, type ArticleSearchDetails } from '../data/blogSearch'
import { useDatasetSearchDetails } from '../lib/useArticleSearchDetails'
import { DATA_USE_CASES_PATH } from '../data/blogCollections'
import { getResearchDatasets, loadDatasetSources, type CatalogDataset, type ResourceDataset } from '../data/resources'
import featuredResearch from '../data/featured-research-datasets.json'
import researchCatalog from '../data/research-dataset-catalog.json'
import { links as earthLinks } from '../data/earth-product.json'
import posthog from '../posthog'
import './Resources.css'
import './Datasets.css'

const title = 'Physical economy research datasets'
const recentSampleCount = 8
const { url: canonical } = DATA_CATALOG
const { description, access, siteSearch, underwriting, powerStudy } = researchCatalog

function trackResearchLink(properties: {
  action: 'browse_samples' | 'study' | 'workflow' | 'sample' | 'api_coverage' | 'api_quickstart' | 'site_listings' | 'site_shortlist' | 'underwriting_flood' | 'underwriting_portfolio' | 'power_study'
  surface: 'intro' | 'buyer_paths' | 'featured' | 'catalog' | 'no_results'
  dataset?: string
  format?: string
}) {
  posthog.capture('research_catalog_link_clicked', properties, { transport: 'sendBeacon', send_instantly: true })
}

const catalog = {
  '@context': 'https://schema.org',
  ...DATA_CATALOG,
  description,
  publisher: DATASET_PUBLISHER,
}

function prepareCatalog() {
  const researchDatasets = getResearchDatasets()
  const featured = featuredResearch.flatMap(study => researchDatasets
    .filter(entry => entry.id === study.slug)
    .map(({ image, srcSet, notesPath, workflow, dataset }) => ({ ...study, image, srcSet, notesPath, workflow, sample: dataset.downloads[0] })),
  )
  const featuredQuestions = new Map(featured.map(({ slug, title, summary }) => [slug, `${title} ${summary}`]))
  const formats = [...new Set(researchDatasets.flatMap(({ dataset }) => dataset.downloads.map(file => file.format)))].sort()
  const datasetTopics = Object.entries(researchCatalog.topics).map(([label, articles]) => ({
    label,
    articles: new Set(articles),
  }))
  const catalogEntries = researchDatasets.map(entry => ({
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
  const buildSearchIndex = (searchDetails?: ArticleSearchDetails | null) => prepareSearch(catalogEntries, ({ id, dataset, title, region, topic, topics, workflow }) => ({
    title: dataset.name,
    relatedTitle: title,
    metadata: [dataset.description, dataset.spatialCoverage, dataset.temporalCoverage,
      region, topic, ...topics, workflow?.label, featuredQuestions.get(id),
      ...dataset.downloads.map(file => `${file.label} ${file.format}`),
    ].join(' '),
    details: searchDetails?.[id]?.headings,
    bodyTerms: searchDetails?.[id]?.bodyTerms,
  }))

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
      itemListElement: researchDatasets.map(({ notesPath, dataset }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: dataset.name,
        url: `${SITE_URL}${notesPath}`,
      })),
    },
  }
  return {
    featured, formats, datasetTopics, catalogEntries, topicLinks, catalogPage,
    buildSearchIndex,
  }
}

export function loadDatasetsPage() {
  const catalogView = prepareCatalog()
  return { default: () => <Datasets {...catalogView} /> }
}

function DatasetSources({ dataset, notesPath }: {
  dataset: CatalogDataset;
  notesPath: string;
}) {
  const [sources, setSources] = useState<ResourceDataset['sourceDetails'] | 'loading' | 'unavailable'>()
  const activate = useCallback((disclosure: HTMLDetailsElement | null) => {
    if (!disclosure?.open || sources !== undefined) return
    setSources('loading')
    void loadDatasetSources(dataset.sourceIndex)
      .then(setSources)
      .catch(() => setSources('unavailable'))
  }, [dataset.sourceIndex, sources])

  return (
    <details className="dataset-sources" ref={activate} onToggle={event => activate(event.currentTarget)}>
      <summary>Source records ({dataset.sourceCount})</summary>
      {dataset.sourceReuse && <p className="dataset-reuse">{dataset.sourceReuse.note} <a href={dataset.sourceReuse.policyUrl}>{dataset.sourceReuse.policyLabel}</a></p>}
      {!Array.isArray(sources) && dataset.sourceLicenses.map(({ title, license }) => (
        <p key={`${title}:${license}`} className="dataset-reuse"><a href={license}>Source license for {title}</a></p>
      ))}
      {Array.isArray(sources) ? (
        <ul>
          {sources.map(source => (
            <li key={`${source.url}:${source.title}`}>
              <a href={source.url}>{source.title}</a>
              <span>{source.publisher}</span>
              {source.license && <span><a href={source.license} aria-label={`Source license for ${source.title}`}>Source license</a></span>}
            </li>
          ))}
        </ul>
      ) : sources === 'loading' ? <p role="status">Loading source records…</p> : (
        <p><Link to={notesPath.replace(/#.*$/, '#sources')}>Open source records in the study</Link></p>
      )}
    </details>
  )
}

function Datasets({
  featured, formats, datasetTopics, catalogEntries, topicLinks, catalogPage, buildSearchIndex,
}: Awaited<ReturnType<typeof prepareCatalog>>) {
  const [searchReady, setSearchReady] = useState(false)
  const [shareResult, setShareResult] = useState<{ search: string; copied: boolean }>()
  const { search, hash } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const query = params.get('q') ?? ''
  const format = formats.find(value => value === params.get('format')) ?? ''
  const topic = datasetTopics.find(({ label }) => label === params.get('topic'))?.label ?? ''
  const searchInput = useRef<HTMLInputElement>(null)
  const archive = useRef<HTMLDetailsElement>(null)
  useEffect(() => setSearchReady(true), [])
  const deferredQuery = useDeferredValue(query)
  const terms = useMemo(() => editorialSearchWords(deferredQuery), [deferredQuery])
  const searching = terms.length > 0
  const exactDownloads = useMemo(() => {
    const value = deferredQuery.trim()
    const location = /^[a-z0-9-]+\.[a-z0-9]+$/i.test(value) ? `/blog/${value}` : value
    try {
      const url = new URL(location, SITE_URL)
      if (url.origin !== SITE_URL || !url.pathname.startsWith('/blog/')) return []
      const path = url.pathname.toLowerCase()
      return catalogEntries.filter(({ dataset }) => dataset.downloads.some(file => file.path === path))
    } catch {
      return []
    }
  }, [catalogEntries, deferredQuery])
  const searchingText = searching && !exactDownloads.length
  const { details: searchDetails, pending: searchPending } = useDatasetSearchDetails(searchingText)
  const searchIndex = useMemo(() => searchingText ? buildSearchIndex(searchDetails) : undefined,
    [searchingText, searchDetails, buildSearchIndex])
  const isFiltered = Boolean(searching || topic || format)
  const matches = useMemo(() => {
    const candidates = searchIndex
      ? rankSearch(searchIndex, terms, { numericPrefixes: true, allowPartialMatches: true, longQuestionRanking: true, requireRecordIds: true })
      : searching ? exactDownloads : catalogEntries
    if (!topic && !format) return candidates

    return candidates.filter(({ topics, dataset }) =>
      (!topic || topics.includes(topic)) &&
      (!format || dataset.downloads.some(file => file.format === format)),
    )
  }, [catalogEntries, exactDownloads, searchIndex, searching, terms, topic, format])
  useLayoutEffect(() => {
    const disclosure = archive.current
    if (!disclosure) return

    const revealSample = () => {
      const sample = document.getElementById(window.location.hash.slice(1))
      if (sample && disclosure.contains(sample)) {
        disclosure.open = true
        sample.scrollIntoView({ behavior: 'instant' })
      }
    }
    revealSample()
    window.addEventListener('hashchange', revealSample)
    return () => window.removeEventListener('hashchange', revealSample)
  }, [hash, isFiltered])

  const filterSearch = (key: 'q' | 'topic' | 'format', value: string, current = search) => {
    const next = new URLSearchParams(current)
    if (value) next.set(key, value)
    else next.delete(key)
    return next.toString()
  }

  const updateFilter = (key: 'q' | 'topic' | 'format', value: string, anchor = window.location.hash) => {
    // The browser URL reflects the previous input even while React is updating the results.
    navigate({ search: filterSearch(key, value, window.location.search), hash: anchor }, { replace: key === 'q' })
  }

  const clearFilters = () => {
    const next = new URLSearchParams(window.location.search)
    for (const key of ['q', 'topic', 'format']) next.delete(key)
    navigate({ search: next.toString(), hash: window.location.hash })
    searchInput.current?.focus()
  }

  const copySearch = async () => {
    const current = window.location.search
    const active = new URLSearchParams(current)
    const link = new URL(canonical)
    for (const key of ['q', 'topic', 'format']) {
      const value = active.get(key)?.trim()
      if (value) link.searchParams.set(key, value)
    }
    link.hash = 'dataset-search'
    try {
      await navigator.clipboard.writeText(link.href)
      setShareResult({ search: current, copied: true })
    } catch {
      setShareResult({ search: current, copied: false })
    }
  }

  const rows = useMemo(() => matches.map(({ id, notesPath, datePublished, dataset, workflow }) => (
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
        <DatasetSources dataset={dataset} notesPath={notesPath} />
        <DatasetCitation name={dataset.name} datePublished={datePublished} url={`${SITE_URL}${notesPath}`} archivedRelease={dataset.archivedRelease} onDemand />
      </div>
    </article>
  )), [matches])
  const visibleRows = isFiltered ? rows : rows.slice(0, recentSampleCount)
  const archivedRows = isFiltered ? [] : rows.slice(recentSampleCount)

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
                <Link className="dataset-coverage-button" to={earthLinks.coverage}
                  onClick={() => trackResearchLink({ action: 'api_coverage', surface: 'intro' })}>
                  Check API coverage <ResourceArrow diagonal />
                </Link>
                <a className="dataset-method" href="#dataset-search"
                  onClick={() => trackResearchLink({ action: 'browse_samples', surface: 'intro' })}>
                  Browse samples <span aria-hidden="true">↓</span>
                </a>
              </nav>
            </div>
          </div>
        </header>
        <div className="resource-container">
          <div className="dataset-buyer-paths">
            <section aria-labelledby="dataset-site-search-title">
              <h2 id="dataset-site-search-title">{siteSearch.title}</h2>
              <p>{siteSearch.description}</p>
              <div className="dataset-buyer-actions">
                <Link className="dataset-method" to={siteSearch.listingsPath}
                  onClick={() => trackResearchLink({ action: 'site_listings', surface: 'buyer_paths' })}>
                  {siteSearch.listingsLabel} <ResourceArrow diagonal />
                </Link>
                <Link className="dataset-method" to={siteSearch.requestPath}
                  onClick={() => trackResearchLink({ action: 'site_shortlist', surface: 'buyer_paths' })}>
                  {siteSearch.requestLabel} <ResourceArrow diagonal />
                </Link>
              </div>
            </section>
            <section aria-labelledby="dataset-underwriting-title">
              <h2 id="dataset-underwriting-title">{underwriting.title}</h2>
              <p>{underwriting.description}</p>
              <div className="dataset-buyer-actions">
                <a className="dataset-method" href={underwriting.floodUrl}
                  onClick={() => trackResearchLink({ action: 'underwriting_flood', surface: 'buyer_paths' })}>
                  {underwriting.floodLabel} <ResourceArrow diagonal />
                </a>
                <Link className="dataset-method" to={underwriting.portfolioPath}
                  onClick={() => trackResearchLink({ action: 'underwriting_portfolio', surface: 'buyer_paths' })}>
                  {underwriting.portfolioLabel} <ResourceArrow diagonal />
                </Link>
              </div>
            </section>
            <section aria-labelledby="dataset-power-study-title">
              <h2 id="dataset-power-study-title">{powerStudy.title}</h2>
              <p>{powerStudy.description}</p>
              <div className="dataset-buyer-actions">
                <Link className="dataset-method" to={powerStudy.path}
                  onClick={() => trackResearchLink({ action: 'power_study', surface: 'buyer_paths' })}>
                  {powerStudy.label} <ResourceArrow diagonal />
                </Link>
              </div>
            </section>
          </div>
        </div>
        <section className="resource-container dataset-featured" aria-labelledby="featured-studies-title">
          <div className="dataset-featured-heading">
            <h2 id="featured-studies-title">See what the data can answer</h2>
            <Link className="dataset-method" to={DATA_USE_CASES_PATH}>All use-case guides <ResourceArrow diagonal /></Link>
          </div>
          <ul>
            {featured.map(({ slug, title, summary, scope, evidence, image, srcSet, imageLabel, notesPath, workflow, sample, workflowLabel, workflowType }, index) => (
              <li key={slug}>
                <Link className="dataset-featured-study" to={notesPath} aria-labelledby={`featured-${slug}`}
                  onClick={() => trackResearchLink({ action: 'study', surface: 'featured', dataset: slug })}>
                  <div className="dataset-featured-image">
                    <img src={image} srcSet={srcSet}
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
                  {workflow && <div className="dataset-featured-next">
                    <span id={`workflow-type-${slug}`}>{workflowType}</span>
                    <a className="dataset-featured-workflow" href={workflow.url} aria-describedby={`workflow-type-${slug}`}
                      onClick={() => trackResearchLink({ action: 'workflow', surface: 'featured', dataset: slug })}>
                      {workflowLabel} <ResourceArrow />
                    </a>
                  </div>}
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
        <p className="dataset-scope">{access}</p>
        <nav className="dataset-catalog-api" aria-label="Use the Earth API">
          <Link className="dataset-method" to={earthLinks.coverage}
            onClick={() => trackResearchLink({ action: 'api_coverage', surface: 'catalog' })}>
            Check live API coverage <ResourceArrow diagonal />
          </Link>
          <a className="dataset-method" href={earthLinks.quickstart}
            onClick={() => trackResearchLink({ action: 'api_quickstart', surface: 'catalog' })}>
            Try the Earth API <ResourceArrow diagonal />
          </a>
        </nav>
        <noscript><p className="dataset-scope">All examples are available below. Enable JavaScript to search or filter by topic.</p></noscript>
        <details className="dataset-topic-indexes">
          <summary>See research examples by topic</summary>
          <ul>
            {Object.entries(researchCatalog.topicExamples).map(([topicName, example]) => (
              <li key={example.slug}>
                <h3>{topicName}</h3>
                <Link className="dataset-method dataset-topic-example" to={example.path}
                  onClick={() => trackResearchLink({ action: 'study', surface: 'catalog' })}>
                  {example.label} <ResourceArrow diagonal />
                </Link>
                <a className="dataset-method" href={`/llms/datasets/${example.slug}.md`}
                  aria-label={`Open Markdown index for ${topicName}`}>Topic index (Markdown)</a>
              </li>
            ))}
          </ul>
        </details>
        <nav className="dataset-topics" aria-label="Dataset topics">
          {topicLinks.map(({ label, count }) => (
            <Link key={label} to={{ search: filterSearch('topic', label), hash: '#dataset-search' }}
              rel={label ? 'nofollow' : undefined}
              onClick={event => {
                if (window.location.search === search || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                updateFilter('topic', label, '#dataset-search')
              }}
              aria-label={`${label || 'All topics'} ${count} research examples`}
              aria-current={label === topic ? 'true' : undefined}>
              {label || 'All topics'} <span aria-hidden="true">{count}</span>
            </Link>
          ))}
        </nav>
        <div className="dataset-controls">
          <label>
            <span>Search data samples</span>
            <input ref={searchInput} type="search" placeholder="Topic, address, record ID or filename" disabled={!searchReady} value={query}
              onChange={event => updateFilter('q', event.target.value)} />
          </label>
          <label className="dataset-topic-select">
            <span id="dataset-topic-label">Topic</span>
            <select aria-labelledby="dataset-topic-label" disabled={!searchReady} value={topic}
              onChange={event => updateFilter('topic', event.target.value)}>
              {topicLinks.map(({ label, count }) => <option key={label} value={label}>{label || 'All topics'} ({count})</option>)}
            </select>
          </label>
          <label>
            <span id="dataset-format-label">File format</span>
            <select aria-labelledby="dataset-format-label" disabled={!searchReady} value={format}
              onChange={event => updateFilter('format', event.target.value)}>
              <option value="">All formats</option>
              {formats.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
        <div className="dataset-list-meta">
          <div className="dataset-results" aria-busy={query !== deferredQuery || searchPending || undefined}>
            <p role="status">
              {searchPending ? 'Searching research examples…' : `${matches.length} ${isFiltered ? 'matching' : 'published'} research ${matches.length === 1 ? 'example' : 'examples'}`}
              {searchingText && searchDetails === null && ' (catalog summaries only)'}
            </p>
            {isFiltered && <div className="dataset-search-actions">
              <button type="button" className="dataset-clear" onClick={clearFilters}>Clear filters</button>
              <button type="button" className="dataset-clear" onClick={copySearch}>Copy search link</button>
              <span role="status">{shareResult?.search === search
                ? shareResult.copied ? 'Link copied' : 'Copy the address from your browser.'
                : ''}</span>
            </div>}
          </div>
          <div className="dataset-catalog-downloads">
            <a href="/datasets.csl.json" download>Download citations (CSL JSON) <span aria-hidden="true">↓</span></a>
            <a href="/datasets.json" download>Download catalog (JSON) <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        {matches.length === 0 && !searchPending && (
          <div className="dataset-empty">
            <p>No samples match your filters. The API coverage page lists available fields, including fields without a published sample.</p>
            <Link className="dataset-method" to={earthLinks.coverage}
              onClick={() => trackResearchLink({ action: 'api_coverage', surface: 'no_results' })}>
              Search API fields <ResourceArrow diagonal />
            </Link>
          </div>
        )}
        {visibleRows}
        {archivedRows.length > 0 && (
          <details className="dataset-archive" ref={archive}>
            <summary>{archivedRows.length} more samples</summary>
            {archivedRows}
          </details>
        )}
      </section>
    </div>
  )
}
