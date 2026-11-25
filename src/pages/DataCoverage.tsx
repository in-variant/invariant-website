import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ResourceArrow } from '../components/ResourceCards'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { articleSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import summary from '../data/earth-coverage-summary.json'
import topics from '../data/earth-coverage-topics.json'
import examples from '../data/earth-coverage-examples.json'
import product from '../data/earth-product.json'
import './Resources.css'
import './DataCoverage.css'

const title = 'Invariant Earth API data coverage'
const description = 'Check supported US parcel and point data fields for buildings, zoning, power, hazards, infrastructure, and markets. Search field definitions, units, sources, and the endpoint that returns them.'
const canonical = `${SITE_URL}/data-coverage`
const snapshotPath = '/data-coverage-fields.json'
const checkDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(summary.checkedDate))
const operations = {
  point: { label: 'Point lookup', method: '/v1/fetch', manifest: product.links.pointFields },
  parcel: { label: 'Parcel enrichment', method: '/v1/enrich', manifest: product.links.parcelFields },
} as const
type Operation = keyof typeof operations
type Definition = { description: string; unit?: string | null; source: string; sourceUrl: string; operatorOnly?: boolean }
type Field = { name: string; label?: string; definitions: Partial<Record<Operation, Definition>> }
const exampleFields: Record<string, Field> = examples

function FieldDetails({ field, operation, compact }: { field: Field; operation?: Operation | ''; compact?: boolean }) {
  const definitions = (Object.keys(operations) as Operation[]).flatMap(key => {
    const definition = field.definitions[key]
    return definition && (!operation || key === operation) ? [{ key, definition }] : []
  })
  const restricted = definitions.every(({ definition }) => definition.operatorOnly)
  return (
    <details className="coverage-field">
      <summary>
        {field.label && <span>{field.label}</span>}
        <code className="coverage-field-name">{field.name}</code>
        {!compact && <small>{definitions.map(({ key }) => operations[key].method).join(' · ')}</small>}
        {restricted && <span className="coverage-access">Operator key</span>}
      </summary>
      <div className="coverage-definitions">
        {definitions.map(({ key, definition }) => (
          <div key={key} className="coverage-definition">
            <div className="coverage-definition-title">
              <strong>{operations[key].label}</strong>
              <code>POST {operations[key].method}</code>
              {definition.operatorOnly && !restricted && <span className="coverage-access">Operator key</span>}
            </div>
            <p>{definition.description}</p>
            <div className="coverage-definition-source">
              <a href={definition.sourceUrl}>{definition.source} <ResourceArrow diagonal /></a>
              {definition.unit && <span>Unit {definition.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </details>
  )
}

function indexFields(fields: Field[]) {
  return prepareSearch(fields, ({ name, label, definitions }) => ({
    title: name,
    relatedTitle: label,
    metadata: Object.values(definitions).map(({ source, unit }) => `${source} ${unit ?? ''}`).join(' '),
    details: Object.values(definitions).map(({ description }) => description).join(' '),
  }))
}

const pageSize = 12

export default function DataCoverage() {
  const { hash } = useLocation()
  const [query, setQuery] = useState('')
  const [operation, setOperation] = useState<Operation | ''>('')
  const [browseAll, setBrowseAll] = useState(false)
  const [count, setCount] = useState(pageSize)
  const [index, setIndex] = useState<ReturnType<typeof indexFields>>()
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const terms = articleSearchWords(query)
  const searching = terms.length > 0
  const showFields = searching || operation !== '' || browseAll

  useEffect(() => setReady(true), [])
  useEffect(() => {
    if (!showFields || index) return
    const controller = new AbortController()
    setError(false)
    fetch(snapshotPath, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Field catalog unavailable')
        return response.json() as Promise<Field[]>
      })
      .then(fields => setIndex(indexFields(fields)))
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [showFields, index, attempt])

  const matches = showFields && index
    ? (searching ? rankSearch(index, terms) : index.map(({ entry }) => entry))
        .filter(field => !operation || field.definitions[operation])
    : []

  return (
    <div className="resources-page coverage-page">
      <Seo title={title} description={description} canonical={canonical}
        markdown="/data-coverage.md" jsonLd={[ORG_SCHEMA, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL }, { name: 'Platform', url: `${SITE_URL}/product` },
          { name: 'API data coverage', url: canonical },
        ])]} />
      <header className="resource-container resources-intro">
        <div className="resources-intro-grid">
          <h1>API data coverage</h1>
          <div>
            <p>{description}</p>
            <p className="coverage-verified">Catalog checked <time dateTime={summary.checkedDate}>{checkDate}</time></p>
          </div>
        </div>
      </header>
      <section className="resource-container coverage-window" aria-labelledby="coverage-search">
        <div className="coverage-summary">
          <div><strong>{summary.distinct}</strong><span>Distinct field names</span></div>
          <a href={operations.point.manifest}><strong>{summary.point}</strong><span>Point lookup fields <ResourceArrow diagonal /></span></a>
          <a href={operations.parcel.manifest}><strong>{summary.parcel}</strong><span>Parcel enrichment fields <ResourceArrow diagonal /></span></a>
        </div>
        <p className="coverage-note">{summary.shared} field names appear in both manifests. Check the definition for the operation you plan to call. Values depend on location and API key access.</p>
        {summary.operatorOnly > 0 && <p className="coverage-note">The manifests flag operator key requirements for {summary.operatorOnly} fields.</p>}
        <h2 id="coverage-search">Find a field</h2>
        <div className="coverage-controls">
          <label>
            <span>Search by field name, topic, or source</span>
            <input type="search" placeholder="Try flood zone, substation, or FEMA" disabled={!ready}
              value={query} onChange={event => { setQuery(event.target.value); setCount(pageSize) }} />
          </label>
          <label>
            <span>API operation</span>
            <select value={operation} disabled={!ready} onChange={event => { setOperation(event.target.value as Operation | ''); setCount(pageSize) }}>
              <option value="">All operations</option>
              {Object.entries(operations).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
        </div>
        {!searching && !operation && (
          <button type="button" className="coverage-action" disabled={!ready}
            aria-expanded={browseAll} aria-controls="coverage-results"
            onClick={() => { setBrowseAll(!browseAll); setCount(pageSize) }}>
            {browseAll ? 'Hide field list' : 'Browse all fields'}
          </button>
        )}
        <div id="coverage-results">
          {showFields && (
            <p className="coverage-note" role="status">
              {error ? 'The field snapshot could not be loaded.' : index
                ? `${matches.length} ${searching ? 'matching ' : ''}${matches.length === 1 ? 'field' : 'fields'}`
                : 'Loading field definitions…'}
            </p>
          )}
          {showFields && error && <button type="button" className="coverage-action" onClick={() => setAttempt(attempt + 1)}>Try again</button>}
          {searching && index && matches.length === 0 && (
            <p className="coverage-empty">
              Try a different field name or <a href={product.links.fieldRequests}>request a data field</a>.
            </p>
          )}
          {matches.slice(0, count).map(field => <FieldDetails key={field.name} field={field} operation={operation} />)}
          {matches.length > count && <button type="button" className="coverage-action" onClick={() => setCount(count + pageSize)}>Show more fields</button>}
        </div>
      </section>

      <section className="resource-container coverage-topics" aria-labelledby="coverage-workflows">
        <h2 id="coverage-workflows">Start with your workflow</h2>
        <div>
          {topics.map(({ id, title, description, fields, guide, guideLabel, researchTopic }) => (
            <article key={id} id={id} aria-labelledby={`${id}-heading`} data-linked={hash === `#${id}` || undefined}>
              <h3 id={`${id}-heading`}>{title}</h3>
              <p>{description}</p>
              <ul>
                {fields.map(name => <li key={name}><FieldDetails field={exampleFields[name]} compact /></li>)}
              </ul>
              <div className="coverage-topic-links">
                <Link to={guide}>{guideLabel} <ResourceArrow diagonal /></Link>
                <Link to={`/datasets?${new URLSearchParams({ topic: researchTopic })}#dataset-search`}
                  aria-label={`View research samples for ${title.toLowerCase()}`}>
                  View research samples <ResourceArrow diagonal />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <nav className="resource-container coverage-next" aria-label="API access and research">
        <a href={product.links.quickstart}>Read the API quickstart <ResourceArrow diagonal /></a>
        <a href={product.links.keys}>Get an API key <ResourceArrow diagonal /></a>
        <a href={product.links.fieldRequests}>Request a data field <ResourceArrow diagonal /></a>
        <a href={snapshotPath} download>Download the field snapshot</a>
        <Link to="/datasets">Browse data samples <ResourceArrow diagonal /></Link>
      </nav>
    </div>
  )
}
