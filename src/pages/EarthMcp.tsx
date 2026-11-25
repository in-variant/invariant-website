import { Link } from 'react-router-dom'
import EarthAgentSetup from '../components/EarthAgentSetup'
import { ResourceArrow } from '../components/ResourceCards'
import { ORG_SCHEMA, Seo, SITE_URL, breadcrumbSchema } from '../components/Seo'
import mcp from '../data/earth-mcp.json'
import product from '../data/earth-product.json'
import './Resources.css'
import './Product.css'
import './EarthMcp.css'

const { links } = product
const canonical = `${SITE_URL}/mcp`
const service = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${canonical}#server`,
  name: mcp.heading,
  description: mcp.description,
  url: canonical,
  serviceType: 'Geospatial data MCP server',
  areaServed: { '@type': 'Country', name: 'United States' },
  provider: { '@id': `${SITE_URL}/#organization` },
  sameAs: mcp.registryUrl,
}

export default function EarthMcp() {
  return (
    <div className="resources-page earth-product earth-mcp">
      <Seo title={mcp.title} description={mcp.description} canonical={canonical} markdown="/mcp.md"
        ogImage={`${SITE_URL}/og/invariant-data-layer.jpg`}
        jsonLd={[ORG_SCHEMA, service, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL }, { name: 'MCP server', url: canonical },
        ])]} />
      <header className="resource-container earth-product-hero">
        <div className="earth-product-intro">
          <h1>{mcp.heading}</h1>
          <p>{mcp.description}</p>
          <nav className="earth-product-actions" aria-label="MCP connection and coverage">
            <a className="earth-product-button" href={links.mcp}>Connect your agent <ResourceArrow diagonal /></a>
            <Link className="earth-product-link" to={links.coverage}>Check data coverage <ResourceArrow diagonal /></Link>
          </nav>
          <EarthAgentSetup />
        </div>
        <section className="earth-mcp-server" aria-label="Server connection details">
          <h2>Server URL</h2>
          <code>{links.mcpEndpoint}</code>
          <dl>
            <dt>Transport</dt>
            <dd>{mcp.transport}</dd>
            <dt>Authentication</dt>
            <dd>{mcp.signIn}</dd>
          </dl>
          <a href={mcp.registryUrl}>Official MCP Registry entry <ResourceArrow diagonal /></a>
        </section>
      </header>
      <section className="resource-container earth-mcp-tools" aria-labelledby="mcp-tools-heading">
        <div className="earth-mcp-section-heading">
          <h2 id="mcp-tools-heading">What your agent can query</h2>
          <a className="earth-product-link" href={mcp.toolsUrl}>Read the tool reference <ResourceArrow diagonal /></a>
        </div>
        <ul>
          {mcp.tools.map(({ name, title, description }) => (
            <li key={name}>
              <h3>{title}</h3>
              <code>{name}</code>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="resource-container earth-mcp-trial" aria-labelledby="mcp-trial-heading">
        <h2 id="mcp-trial-heading">{mcp.trial.heading}</h2>
        <div className="earth-mcp-trial-body">
          <div>
            <h3>Ask your agent</h3>
            <p>{mcp.trial.question}</p>
          </div>
          <div>
            <h3>Reference parcel</h3>
            <code>{mcp.trial.result}</code>
            <p>{mcp.trial.evidence}</p>
            <div className="earth-mcp-trial-links">
              <Link className="earth-product-link" to={mcp.trial.guide}>Read the case <ResourceArrow diagonal /></Link>
              <a className="earth-product-link" href={mcp.trial.download} download>Download reference data</a>
            </div>
          </div>
        </div>
        <Link className="earth-product-link" to={mcp.comparison}>Compare GIS MCP servers <ResourceArrow diagonal /></Link>
      </section>
    </div>
  )
}
