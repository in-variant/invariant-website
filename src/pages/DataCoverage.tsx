import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ResourceArrow } from '../components/ResourceCards'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { articleSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import summary from '../data/earth-coverage-summary.json'
import topics from '../data/earth-coverage-topics.json'
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
type Definition = { description: string; unit?: string | null; source: string; sourceUrl: string }
type Field = { name: string; label?: string; definitions: Partial<Record<Operation, Definition>> }

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
  const [query, setQuery] = useState('')
  const [operation, setOperation] = useState<Operation | ''>('')
  const [count, setCount] = useState(pageSize)
  const [index, setIndex] = useState<ReturnType<typeof indexFields>>()
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [ready, setReady] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const terms = articleSearchWords(query)
  const searching = terms.length > 0

  useEffect(() => setReady(true), [])
  useEffect(() => {
    if (!searching || index) return
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
  }, [searching, index, attempt])

  const matches = searching && index
    ? rankSearch(index, terms).filter(field => !operation || field.definitions[operation])
    : []

  function searchFor(name: string) {
    setQuery(name)
    setOperation('')
    setCount(pageSize)
    input.current?.focus()
  }

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
        <p className="coverage-note">{summary.shared} field names appear in both manifests. Check the definition for the operation you plan to call. A listed field can be unavailable at a given location.</p>
        <h2 id="coverage-search">Find a field</h2>
        <div className="coverage-controls">
          <label>
            <span>Search by field name, topic, or source</span>
            <input ref={input} type="search" placeholder="Try flood zone, substation, or FEMA" disabled={!ready}
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
        {searching && (
          <p className="coverage-note" role="status">
            {error ? 'The field snapshot could not be loaded.' : index
              ? `${matches.length} matching ${matches.length === 1 ? 'field' : 'fields'}`
              : 'Loading field definitions…'}
          </p>
        )}
        {searching && error && <button type="button" className="coverage-action" onClick={() => setAttempt(attempt + 1)}>Try again</button>}
        {searching && index && matches.length === 0 && <p>Try a different field name or search all operations.</p>}
        {matches.slice(0, count).map(field => (
          <details className="coverage-field" key={field.name}>
            <summary>
              {field.label && <span>{field.label}</span>}
              <code>{field.name}</code>
              <small>{Object.keys(field.definitions).map(key => operations[key as Operation].method).join(' · ')}</small>
            </summary>
            <div className="coverage-definitions">
              {Object.entries(field.definitions).filter(([key]) => !operation || key === operation).map(([key, definition]) => (
                <section key={key}>
                  <h3>{operations[key as Operation].label}</h3>
                  <p>{definition.description}</p>
                  <a href={definition.sourceUrl}>{definition.source} <ResourceArrow diagonal /></a>
                  {definition.unit && <span>Unit {definition.unit}</span>}
                </section>
              ))}
            </div>
          </details>
        ))}
        {matches.length > count && <button type="button" className="coverage-action" onClick={() => setCount(count + pageSize)}>Show more fields</button>}
      </section>

      <section className="resource-container coverage-topics" aria-labelledby="coverage-workflows">
        <h2 id="coverage-workflows">Start with your workflow</h2>
        <div>
          {topics.map(({ title, description, fields, guide, guideLabel }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                {fields.map(name => <li key={name}><button type="button" disabled={!ready} onClick={() => searchFor(name)}><code>{name}</code></button></li>)}
              </ul>
              <Link to={guide}>{guideLabel} <ResourceArrow diagonal /></Link>
            </article>
          ))}
        </div>
      </section>
      <nav className="resource-container coverage-next" aria-label="API access and research">
        <a href={product.links.quickstart}>Read the API quickstart <ResourceArrow diagonal /></a>
        <a href={product.links.keys}>Get an API key <ResourceArrow diagonal /></a>
        <a href={snapshotPath} download>Download the field snapshot</a>
        <Link to="/datasets">Browse data samples <ResourceArrow diagonal /></Link>
      </nav>
    </div>
  )
}
