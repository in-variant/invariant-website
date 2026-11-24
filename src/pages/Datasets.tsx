import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DatasetCitation from '../components/DatasetCitation'
import { ResourceArrow } from '../components/ResourceCards'
import { DATA_CATALOG, ORG_SCHEMA, SITE_URL, Seo, breadcrumbSchema } from '../components/Seo'
import { articleSearchWords } from '../data/blogSearch'
import { DATA_USE_CASES_PATH } from '../data/blogCollections'
import { RESEARCH_DATASETS } from '../data/resources'
import featuredResearch from '../data/featured-research-datasets.json'
import './Resources.css'
import './Datasets.css'

const { name: title, url: canonical } = DATA_CATALOG
const description = 'Download dated, source-linked research on site selection, power, property risk, lending and mobility.'
const featured = featuredResearch.flatMap(study => RESEARCH_DATASETS
  .filter(entry => entry.id === study.slug)
  .map(({ image, notesPath }) => ({ ...study, image, notesPath })),
)
const formats = [...new Set(RESEARCH_DATASETS.flatMap(({ dataset }) => dataset.downloads.map(file => file.format)))].sort()
const searchIndex = RESEARCH_DATASETS.map(entry => {
  const { dataset } = entry
  return {
    ...entry,
    searchWords: new Set(articleSearchWords([
      dataset.name, dataset.description, dataset.spatialCoverage, dataset.temporalCoverage,
      entry.title, entry.region, entry.topic, ...dataset.downloads.map(file => `${file.label} ${file.format}`),
      ...dataset.sourceDetails.map(({ publisher, title, url }) => `${publisher} ${title} ${new URL(url).hostname}`),
    ].join(' '))),
  }
})

const catalog = {
  '@context': 'https://schema.org',
  ...DATA_CATALOG,
  description,
  publisher: { '@id': `${SITE_URL}/#organization` },
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
  useEffect(() => setSearchReady(true), [])
  const terms = articleSearchWords(query)
  const matches = searchIndex.filter(({ searchWords, dataset }) =>
    terms.every((term, index) => searchWords.has(term) || (
      index === terms.length - 1 && term.length >= 3 && [...searchWords].some(word => word.startsWith(term))
    )) &&
    (!format || dataset.downloads.some(file => file.format === format)),
  )

  return (
    <div className="resources-page datasets-page">
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        markdown="/datasets.md"
        jsonLd={[ORG_SCHEMA, catalog, catalogPage, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: title, url: canonical }])]}
      />
      <header className="resource-container resources-intro">
        <div className="resources-intro-grid">
          <h1>{title}</h1>
          <div>
            <p>{description} To check your own location, start with the Invariant Earth API.</p>
            <nav aria-label="Research library and API" className="resources-data-links">
              <Link className="dataset-api-button" to="/product">Explore the Earth API <ResourceArrow diagonal /></Link>
              <a className="dataset-method" href="#dataset-search">Search the library</a>
            </nav>
          </div>
        </div>
      </header>
      <section className="resource-container dataset-featured" aria-labelledby="featured-studies-title">
        <div className="dataset-featured-heading">
          <h2 id="featured-studies-title">Featured studies</h2>
          <Link className="dataset-method" to={DATA_USE_CASES_PATH}>Browse guides by use case <ResourceArrow diagonal /></Link>
        </div>
        <ul>
          {featured.map(({ slug, title, summary, image, notesPath, workflow }) => (
            <li key={slug}>
              <Link to={notesPath} className="dataset-featured-link">
                <img src={image} alt="" width="1600" height="900" loading="lazy" decoding="async" />
                <div className="dataset-featured-copy">
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <span className="dataset-featured-notes">Read the study <ResourceArrow diagonal /></span>
                </div>
              </Link>
              <a className="dataset-featured-workflow" href={workflow.url}>{workflow.label} <ResourceArrow diagonal /></a>
            </li>
          ))}
        </ul>
      </section>
      <section className="resource-container datasets-list" aria-labelledby="dataset-search">
        <h2 id="dataset-search" tabIndex={-1}>All research datasets</h2>
        <div className="dataset-controls">
          <label>
            <span>Search datasets</span>
            <input type="search" placeholder="EPA, lending, grid capacity…" disabled={!searchReady} value={query} onChange={event => setQuery(event.target.value)} />
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
          <p role="status">{matches.length} {matches.length === 1 ? 'dataset' : 'datasets'}</p>
          <div className="dataset-catalog-downloads">
            <a href="/datasets.csl.json" download>Download citations (CSL JSON) <span aria-hidden="true">↓</span></a>
            <a href="/datasets.json" download>Download catalog (JSON) <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        {matches.length === 0 && (
          <div className="dataset-empty">
            <p>No datasets match your search.</p>
            <button type="button" onClick={() => { setQuery(''); setFormat('') }}>Clear filters</button>
          </div>
        )}
        {matches.map(({ id, notesPath, datePublished, image, dataset }) => (
          <article className="dataset-row" key={id} id={id}>
            <img src={image} alt="" width="1600" height="900" loading="lazy" decoding="async" />
            <div className="dataset-copy">
              <h3>{dataset.name}</h3>
              <p>{dataset.description}</p>
              {dataset.spatialCoverage && <p className="dataset-place">{dataset.spatialCoverage}</p>}
              <Link to={notesPath} className="dataset-method" aria-label={`Read dataset notes for ${dataset.name}`}>
                Dataset notes <ResourceArrow diagonal />
              </Link>
              <details className="dataset-sources">
                <summary>Source records ({dataset.sourceDetails.length})</summary>
                <ul>
                  {dataset.sourceDetails.map(source => (
                    <li key={`${source.url}:${source.title}`}>
                      <a href={source.url}>{source.title}</a>
                      <span>{source.publisher}</span>
                    </li>
                  ))}
                </ul>
              </details>
              <DatasetCitation name={dataset.name} datePublished={datePublished} url={`${SITE_URL}${notesPath}`} />
            </div>
            <div className="dataset-downloads">
              {dataset.downloads.map(file => (
                <a key={file.path} href={file.path} download aria-label={`${file.label} (${file.format})`}>
                  {file.format} <span aria-hidden="true">↓</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
