import { Link } from 'react-router-dom'
import DatasetCitation from '../components/DatasetCitation'
import { ResourceArrow } from '../components/ResourceCards'
import { DATA_CATALOG_ID, ORG_SCHEMA, SITE_URL, Seo, breadcrumbSchema } from '../components/Seo'
import { RESEARCH_DATASETS } from '../data/resources'
import './Resources.css'
import './Datasets.css'

const title = 'Research datasets'
const description = 'Download and cite the data behind Invariant’s research on land, grid upgrades, property risk, lending and fleet charging.'
const canonical = `${SITE_URL}/datasets`

const catalog = {
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  '@id': DATA_CATALOG_ID,
  name: title,
  description,
  url: canonical,
  publisher: { '@id': `${SITE_URL}/#organization` },
  dataset: RESEARCH_DATASETS.map(({ slug }) => ({ '@id': `${SITE_URL}/blog/${slug}#dataset` })),
}

export default function Datasets() {
  return (
    <div className="resources-page datasets-page">
      <Seo
        title={title}
        description={description}
        canonical={canonical}
        jsonLd={[ORG_SCHEMA, catalog, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: title, url: canonical }])]}
      />
      <header className="resource-container resources-intro">
        <div className="resources-intro-grid">
          <h1>{title}</h1>
          <p>{description} Each guide links to the original sources and explains the analysis.</p>
        </div>
      </header>
      <div className="resource-container datasets-list">
        {RESEARCH_DATASETS.map(({ slug, dateTime, image, dataset }) => (
          <article className="dataset-row" key={slug} id={slug}>
            <img src={image} alt="" width="1600" height="900" loading="lazy" decoding="async" />
            <div className="dataset-copy">
              <h2>{dataset.name}</h2>
              <p>{dataset.description}</p>
              <Link to={`/blog/${slug}#dataset`} className="dataset-method" aria-label={`Read dataset notes for ${dataset.name}`}>
                Dataset notes <ResourceArrow diagonal />
              </Link>
              <DatasetCitation name={dataset.name} datePublished={dateTime} url={`${SITE_URL}/blog/${slug}#dataset`} />
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
