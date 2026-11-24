import { useState } from 'react'
import { Link } from 'react-router-dom'
import DemoVideo from '../components/DemoVideo'
import { ResourceArrow } from '../components/ResourceCards'
import { Seo, SITE_URL, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'
import product from '../data/earth-product.json'
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

const requestCode = [
  `curl ${sample.endpoint} \\`,
  '  -H "X-API-Key: $INVARIANT_API_KEY" \\',
  '  -H "Content-Type: application/json" \\',
  "  -d '" + JSON.stringify(sample.request) + "'",
].join('\n')

function ApiExample() {
  const [view, setView] = useState<'response' | 'request'>('response')
  return (
    <div className="earth-product-art">
      <section className="earth-api-example" aria-label="Invariant Earth API example">
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

function AgentSetup() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(product.setupPrompt)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
  }
  return (
    <div className="earth-agent-setup">
      <div>
        <h2>Use Earth in your coding agent</h2>
        <a href={links.mcp}>MCP setup instructions <ResourceArrow diagonal /></a>
      </div>
      <button type="button" className="earth-product-button earth-product-button-outline" onClick={copyPrompt}>
        {copyState === 'copied' ? 'Prompt copied' : 'Copy setup prompt'}
      </button>
      <p role="status" className="sr-only">
        {copyState === 'copied' ? 'Paste the setup prompt into your coding agent.' : ''}
      </p>
      {copyState === 'manual' && (
        <label>
          Select and copy the setup prompt.
          <textarea aria-label="Agent setup prompt" readOnly value={product.setupPrompt} rows={5} onFocus={event => event.currentTarget.select()} />
        </label>
      )}
    </div>
  )
}

export default function Product() {
  return (
    <div className="resources-page earth-product">
      <Seo
        title={product.title}
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
          <AgentSetup />
        </div>
        <ApiExample />
      </header>

      <section className="resource-container earth-product-section" aria-labelledby="earth-operations">
        <div className="earth-product-section-heading">
          <h2 id="earth-operations">Choose what to query</h2>
          <nav className="earth-product-workflows" aria-label="API walkthroughs">
            <a className="earth-product-link" href={links.parcelLookup}>Look up a parcel by address <ResourceArrow diagonal /></a>
            <a className="earth-product-link" href={links.quickstart}>Read the quickstart <ResourceArrow diagonal /></a>
            <a className="earth-product-link" href={links.fields}>Field reference <ResourceArrow diagonal /></a>
          </nav>
        </div>
        <div className="earth-product-operations">
          {product.operations.map(({ title, method, description, docs }) => (
            <article key={method}>
              <code>{method}</code>
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="earth-product-link" href={docs}>Read endpoint documentation <ResourceArrow diagonal /></a>
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
          <Link className="earth-product-link" to={links.datasets}>Browse research datasets <ResourceArrow diagonal /></Link>
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

      <div className="resource-container earth-product-archive">
        <details id="platform-demo">
          <summary>Earlier regulatory workspace walkthrough</summary>
          <div className="earth-product-archive-body">
            <p>See the workspace used for drafting and reviewing regulatory filings with citations.</p>
            <DemoVideo />
            <nav aria-label="Earlier regulatory resources">
              <Link className="earth-product-link" to="/compliance">Compliance guides <ResourceArrow diagonal /></Link>
              <Link className="earth-product-link" to="/how-to-write-a-psar">Safety analysis report guide <ResourceArrow diagonal /></Link>
              <Link className="earth-product-link" to="/nrc-rai-management">Regulatory questions guide <ResourceArrow diagonal /></Link>
              <Link className="earth-product-link" to="/probe">Earlier regulatory search demo <ResourceArrow diagonal /></Link>
            </nav>
          </div>
        </details>
      </div>
    </div>
  )
}
