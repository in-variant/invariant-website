import { Link } from 'react-router-dom'
import { ResourceArrow } from '../components/ResourceCards'
import { Seo, ORG_SCHEMA, breadcrumbSchema, SITE_URL } from '../components/Seo'
import { DATA_USE_CASES_PATH } from '../data/blogCollections'
import { coverSrcSets } from '../data/coverSrcSets'
import { RESEARCH_DATASETS } from '../data/resources'
import research from '../data/research-studies.json'
import './Resources.css'
import './Research.css'

const canonical = `${SITE_URL}/research`
const studies = research.studies.flatMap(study =>
  RESEARCH_DATASETS
    .filter(entry => entry.slug === study.slug && entry.anchor === (study.anchor ?? 'dataset'))
    .map(entry => ({ ...study, entry })),
)
const [featured, ...moreStudies] = studies
const { recordHistory } = research
const recordDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })

const collection = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': canonical,
  url: canonical,
  name: research.title,
  description: research.description,
  dateModified: research.updatedDate,
  publisher: { '@id': `${SITE_URL}/#organization` },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: studies.map(({ title, entry }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: title,
      url: `${SITE_URL}${entry.notesPath}`,
    })),
  },
}

function StudyCard({ study, featured = false }: { study: typeof studies[number]; featured?: boolean }) {
  const { title, topic, summary, chart, imageAlt, imageCredit, entry } = study
  const Heading = featured ? 'h2' : 'h3'
  return (
    <article className={featured ? 'research-study research-study--featured' : 'research-study'}>
      <figure className={chart ? 'research-image research-image--chart' : 'research-image'}>
        <div>
          <img
            src={entry.image}
            srcSet={coverSrcSets[entry.image]}
            sizes={featured
              ? '(max-width: 680px) calc(100vw - max(48px, 10.42vw)), min(864px, 49vw)'
              : '(max-width: 680px) calc(100vw - max(48px, 10.42vw)), (max-width: 1000px) 44vw, min(520px, 29vw)'}
            alt={imageAlt ?? ''}
            width="1600"
            height="900"
            loading={featured ? 'eager' : 'lazy'}
            fetchPriority={featured ? 'high' : undefined}
            decoding="async"
          />
        </div>
        {imageCredit && (
          <figcaption>
            <a href={imageCredit.source}>{imageCredit.name}</a>{', '}
            <a href={imageCredit.license}>{imageCredit.licenseName}</a>. {imageCredit.changes}
          </figcaption>
        )}
      </figure>
      <div className="research-study-copy">
        <p className="research-topic">{topic}</p>
        <Heading><Link to={`/blog/${study.slug}`}>{title}</Link></Heading>
        <p>{summary}</p>
        <div className="research-study-links">
          <Link to={entry.notesPath} aria-label={`Sources and methods for ${title}`}>
            Sources and methods <ResourceArrow diagonal />
          </Link>
          {entry.dataset.downloads.map(file => (
            <a href={file.path} download key={file.path} aria-label={`Download ${entry.dataset.name} (${file.format})`}>
              {file.format} <span aria-hidden="true">↓</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Research() {
  return (
    <div className="resources-page research-page">
      <Seo
        title={research.title}
        description={research.description}
        canonical={canonical}
        markdown="/research.md"
        ogImage={`${SITE_URL}/og/invariant-data-layer.jpg`}
        jsonLd={[
          ORG_SCHEMA,
          collection,
          breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Research', url: canonical }]),
        ]}
      />
      <header className="resource-container research-intro">
        <h1>{research.title}</h1>
        <div className="research-intro-copy">
          <p>{research.description}</p>
          <nav aria-label="Research resources">
            <Link to="/datasets" className="research-primary">Browse datasets <ResourceArrow diagonal /></Link>
            <Link to={DATA_USE_CASES_PATH}>Explore data guides <ResourceArrow diagonal /></Link>
          </nav>
        </div>
      </header>
      <div className="resource-container research-featured">
        <StudyCard study={featured} featured />
      </div>
      <section id="record-history" className="resource-container research-history" aria-labelledby="record-history-title">
        <h2 id="record-history-title">{recordHistory.heading}</h2>
        <p>{recordHistory.description}</p>
        <div className="research-history-grid">
          {recordHistory.examples.map(({ slug, anchor = 'dataset', topic, title, linkLabel, observations }) => (
            <article className="research-history-example" key={slug}>
              <p className="research-topic">{topic}</p>
              <h3>{title}</h3>
              <dl>
                {observations.map(({ date, text }) => (
                  <div key={date}>
                    <dt><time dateTime={date}>{recordDate.format(new Date(date))}</time></dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <div className="research-study-links">
                <Link to={`/blog/${slug}#${anchor}`}>{linkLabel} <ResourceArrow diagonal /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="resource-container research-library" aria-labelledby="research-library-title">
        <h2 id="research-library-title">Selected studies</h2>
        <div className="research-study-grid">
          {moreStudies.map(study => <StudyCard key={study.slug} study={study} />)}
        </div>
      </section>
      <section className="resource-container research-citations" aria-labelledby="research-citations-title">
        <div>
          <h2 id="research-citations-title">Cite the data</h2>
          <p>Open a study’s dataset for its source records and citation. Download the citation catalog to import it into a reference manager.</p>
        </div>
        <div className="research-study-links">
          <a href="/datasets.csl.json" download>Download citations <span aria-hidden="true">↓</span></a>
          <a href="mailto:founders@invariant-ai.com">Ask about a source <ResourceArrow diagonal /></a>
        </div>
      </section>
    </div>
  )
}
