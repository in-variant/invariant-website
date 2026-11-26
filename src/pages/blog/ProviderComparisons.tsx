import { useState } from 'react'
import { Link } from 'react-router-dom'
import directory from '../../data/physical-world-provider-comparisons.json'
import { searchProviderComparisons } from '../../data/providerComparisonSearch'

export default function ProviderComparisons() {
  const [query, setQuery] = useState('')
  const { workflows, providerOnly } = searchProviderComparisons(query)

  return (
    <section className="blog-collection-comparisons" aria-labelledby="provider-comparisons">
      <h2 id="provider-comparisons">{directory.heading}</h2>
      <p>{directory.description}</p>
      <div className="blog-comparison-filter">
        <label htmlFor="provider-comparison-search">Find a provider or workflow</label>
        <input id="provider-comparison-search" type="search" value={query}
          placeholder="Try Regrid vs LightBox, underwriting or truck routing" onChange={event => setQuery(event.target.value)} />
        <span role="status">
          {workflows.length} {workflows.length === 1 ? 'workflow' : 'workflows'}
          {providerOnly && ' matching the provider names'}
        </span>
      </div>
      {workflows.length === 0 && <p>Try a shorter search or clear the field to see all workflows.</p>}
      <div className="blog-comparison-grid">
        {workflows.map(({ id, title, guide, guideAnchor, test, providers }) => (
          <details className="blog-comparison" id={`compare-${id}`} key={id}>
            <summary>{title}</summary>
            <div className="blog-comparison-body">
              <p>{test}</p>
              <Link className="blog-comparison-guide" to={`/blog/${guide}${guideAnchor ? `#${guideAnchor}` : ''}`}>Read the test and sources <span aria-hidden="true">↗</span></Link>
              <ul aria-label="Provider documentation and public data">
                {providers.map(({ name, url }) => <li key={name}><a href={url}>{name}</a></li>)}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
