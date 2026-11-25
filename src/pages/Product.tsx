import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ResourceArrow } from '../components/ResourceCards'
import EarthAgentSetup from '../components/EarthAgentSetup'
import { Seo, SITE_URL, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'
import product from '../data/earth-product.json'
import { formatEarthRequest } from '../data/formatEarthRequest.mjs'
import './Resources.css'
import './Product.css'

const { links, sample } = product
const canonical = `${SITE_URL}/product`
const service = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${canonical}#earth-api`,
  name: product.title,
  description: product.description,
  url: canonical,
  serviceType: 'Geospatial data API',
  areaServed: { '@type': 'Country', name: 'United States' },
  provider: { '@id': `${SITE_URL}/#organization` },
}

const requestCode = formatEarthRequest(sample.endpoint, sample.request)

function ApiExample() {
  const [view, setView] = useState<'response' | 'request'>('response')
  return (
    <div className="earth-product-art">
      <section id="platform-demo" className="earth-api-example" aria-label="Invariant Earth API example">
        <header className="earth-api-example-header">
          <span className="earth-api-endpoint">POST /v1/fetch</span>
          <span>{sample.location}</span>
        </header>
        <div className="earth-api-views" role="group" aria-label="API example view">
          <button type="button" aria-pressed={view === 'request'} onClick={() => setView('request')}>Request</button>
          <button type="button" aria-pressed={view === 'response'} onClick={() => setView('response')}>Response</button>
        </div>
        {view === 'request' ? (
          <pre className="earth-api-request"><code>{requestCode}</code></pre>
        ) : (
          <div className="earth-api-response">
            <p className="earth-api-field">elevation</p>
            <p className="earth-api-value"><span>{sample.field.value.toFixed(2)}</span> m</p>
            <dl>
              <dt>Source</dt>
              <dd><a href={sample.field.source_url}>USGS 3DEP <ResourceArrow diagonal /></a></dd>
              <dt>Dataset vintage</dt>
              <dd>Current edition, tile n40w078</dd>
              <dt>Retrieved</dt>
              <dd><time dateTime={sample.field.fetched_at}>Nov 22, 2026 at 03:26 UTC</time></dd>
              <dt>Confidence</dt>
              <dd>Medium</dd>
            </dl>
          </div>
        )}
        <footer className="earth-api-example-footer">
          <span>Documented example</span>
          <a href={links.responses}>Response reference <ResourceArrow diagonal /></a>
        </footer>
      </section>
    </div>
  )
}

export default function Product() {
  return (
    <div className="resources-page earth-product">
      <Seo
        title="Invariant Earth API for U.S. Property and Infrastructure Data"
        description={product.description}
        canonical={canonical}
        markdown="/product.md"
        ogImage={`${SITE_URL}/og/invariant-data-layer.jpg`}
        jsonLd={[ORG_SCHEMA, service, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Platform', url: canonical }])]}
      />
      <header className="resource-container earth-product-hero">
        <div className="earth-product-intro">
          <h1>{product.title}</h1>
          <p>{product.lede}</p>
          <div className="earth-product-actions">
            <a className="earth-product-button" href={links.keys}>Get an API key <ResourceArrow diagonal /></a>
            <Link className="earth-product-link" to={links.coverage}>Check data coverage <ResourceArrow diagonal /></Link>
          </div>
          <EarthAgentSetup linkToOverview />
        </div>
        <ApiExample />
      </header>

      <section className="resource-container earth-product-section" aria-labelledby="earth-operations">
        <div className="earth-product-section-heading">
          <h2 id="earth-operations">Choose what to query</h2>
          <nav className="earth-product-workflows" aria-label="API walkthroughs">
            <a className="earth-product-link" href={links.parcelLookup}>Look up a parcel by address <ResourceArrow diagonal /></a>
            <a className="earth-product-link" href={links.quickstart}>Read the quickstart <ResourceArrow diagonal /></a>
            <a className="earth-product-link" href={links.fields}>Geospatial API field catalog <ResourceArrow diagonal /></a>
            <a className="earth-product-link" href={links.gisTrial}>Download the Python GIS trial <ResourceArrow diagonal /></a>
          </nav>
        </div>
        <div className="earth-product-operations">
          {product.operations.map(({ title, method, description, docs, docsLabel }) => (
            <article key={method}>
              <code>{method}</code>
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="earth-product-link" href={docs}>{docsLabel} <ResourceArrow diagonal /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-container earth-product-section" aria-labelledby="earth-examples">
        <div className="earth-product-section-heading">
          <div>
            <h2 id="earth-examples">{product.examplesHeading}</h2>
            <p>{product.examplesDescription}</p>
          </div>
          <Link className="earth-product-link" to={links.datasets}>Browse research &amp; data samples <ResourceArrow diagonal /></Link>
        </div>
        <div className="earth-product-studies">
          {product.examples.map(({ audience, title, description, href, workflow }) => (
            <article key={href}>
              <p className="earth-product-audience">{audience}</p>
              <h3><Link to={href}>{title} <ResourceArrow diagonal /></Link></h3>
              <p>{description}</p>
              <a className="earth-product-link" href={workflow.href}>{workflow.label} <ResourceArrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-container earth-product-section" aria-labelledby="earth-diligence">
        <div className="earth-product-diligence">
          <div>
            <h2 id="earth-diligence">Verify a site or power plan</h2>
            <p>Compare candidate sites, review the utility records, and model how a proposed connection could affect the grid.</p>
          </div>
          <nav aria-label="Site and power diligence">
            <Link className="earth-product-link" to={links.diligence}>Site due diligence <ResourceArrow diagonal /></Link>
            <Link className="earth-product-link" to={links.power}>Power-flow studies <ResourceArrow diagonal /></Link>
          </nav>
        </div>
      </section>
    </div>
  )
}
