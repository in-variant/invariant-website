import { useState } from 'react'
import { Link } from 'react-router-dom'
import DatasetCitation from '../components/DatasetCitation'
import { ResourceArrow } from '../components/ResourceCards'
import { DATA_CATALOG, ORG_SCHEMA, SITE_URL, Seo, breadcrumbSchema } from '../components/Seo'
import { articleSearchWords } from '../data/blogSearch'
import { RESEARCH_DATASETS } from '../data/resources'
import './Resources.css'
import './Datasets.css'

const { name: title, url: canonical } = DATA_CATALOG
const description = 'Download and cite the data behind Invariant’s research on land, grid upgrades, property risk, lending and fleet charging.'
const formats = [...new Set(RESEARCH_DATASETS.flatMap(({ dataset }) => dataset.downloads.map(file => file.format)))].sort()
const searchIndex = RESEARCH_DATASETS.map(entry => {
  const { dataset } = entry
  return {
    ...entry,
    searchWords: new Set(articleSearchWords([
      dataset.name, dataset.description, dataset.spatialCoverage, dataset.temporalCoverage,
      entry.title, entry.region, entry.topic, ...dataset.downloads.map(file => `${file.label} ${file.format}`),
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
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState('')
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
            <p>{description} Each guide links to the original sources and explains the analysis.</p>
            <Link className="dataset-method" to="/blog/physical-world-data-by-use-case">Browse data guides by use case <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </header>
      <div className="resource-container datasets-list">
        <div className="dataset-controls">
          <label>
            <span>Search datasets</span>
            <input type="search" placeholder="Flood, lending, grid capacity…" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
          <label>
            <span>File format</span>
            <select value={format} onChange={event => setFormat(event.target.value)}>
              <option value="">All formats</option>
              {formats.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
        <div className="dataset-list-meta">
          <p role="status">{matches.length} {matches.length === 1 ? 'dataset' : 'datasets'}</p>
          <a href="/datasets.json" download>Download catalog (JSON) <span aria-hidden="true">↓</span></a>
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
              <h2>{dataset.name}</h2>
              <p>{dataset.description}</p>
              {dataset.spatialCoverage && <p className="dataset-place">{dataset.spatialCoverage}</p>}
              <Link to={notesPath} className="dataset-method" aria-label={`Read dataset notes for ${dataset.name}`}>
                Dataset notes <ResourceArrow diagonal />
              </Link>
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
      </div>
    </div>
  )
}
