import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { ResourceArticleCard, ResourceArrow } from '../components/ResourceCards'
import { RESOURCE_ARTICLES, RESOURCE_REFERENCES } from '../data/resources'
import './Resources.css'

const FORMATS = ['All', 'Guides', 'Tools'] as const
type Format = typeof FORMATS[number]
const PAGE_SIZE = 8

export default function Resources() {
  const [format, setFormat] = useState<Format>('All')
  const [topic, setTopic] = useState('All topics')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const filtered = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
    return RESOURCE_REFERENCES.filter((resource) => {
      const matchesFormat = format === 'All' || `${resource.kind}s` === format
      const haystack = `${resource.title} ${resource.summary} ${resource.topic}`.toLocaleLowerCase()
      return matchesFormat && (topic === 'All topics' || resource.topic === topic) && terms.every((term) => haystack.includes(term))
    })
  }, [format, topic, query])
  const clearFilters = () => { setFormat('All'); setTopic('All topics'); setQuery(''); setVisibleCount(PAGE_SIZE) }

  return (
    <div className="resources-page">
      <Seo
        title="Resources | Research, guides, and tools for mission-critical compliance"
        description="Research, regulatory guides, and planning tools for data centers, oil and gas, space, and nuclear programs. Explore the work behind the path to approval."
        canonical={`${SITE_URL}/resources`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'Resources', url: `${SITE_URL}/resources` }])]}
      />

      <header className="resources-intro resource-container">
        <p className="resource-eyebrow">Resources</p>
        <div className="resources-intro-grid">
          <h1>Clarity for<br />what comes next.</h1>
          <p>Research, regulatory guides, and practical tools for the teams taking ambitious engineering through approval.</p>
        </div>
      </header>

      <section className="resource-container resources-feature-section" aria-labelledby="resources-feature-heading">
        <Link className="resources-feature" to="/blog/fermibench-sota">
          <div className="resources-feature-copy">
            <p className="resource-eyebrow">Inside our research / 001</p>
            <h2 id="resources-feature-heading">Invariant sets state of the art on FermiBench.</h2>
            <p>Finding the right evidence is foundational to regulatory work. See how Helion-512 performs on the nuclear retrieval benchmark.</p>
            <span className="resource-read-link">Read the research <ResourceArrow /></span>
          </div>
          <div className="resources-feature-visual" aria-hidden="true">
            <span className="resources-feature-model">Helion-512 / Nuclear retrieval</span>
            <img src="/figma/imgHowItWorksDither2.png" alt="" width="384" height="384" decoding="async" />
            <div className="resources-feature-score"><strong>0.97</strong><span>nDCG@10<br />FermiBench</span></div>
            <span className="resources-feature-coordinate">Evidence, retrieved.</span>
          </div>
        </Link>
      </section>

      <section className="resources-notes resource-container" aria-labelledby="resources-notes-heading">
        <div className="resources-section-heading">
          <div><p className="resource-eyebrow">From the team</p><h2 id="resources-notes-heading">A closer look.</h2></div>
          <Link to="/blog" className="resource-text-link">All articles <ResourceArrow /></Link>
        </div>
        <div className="resource-article-grid">
          {[RESOURCE_ARTICLES[0], RESOURCE_ARTICLES.find(article => article.topic === 'Oil & Gas') ?? RESOURCE_ARTICLES[1], RESOURCE_ARTICLES.find(article => article.slug === 'fermibench-sota')!].map((article) => <ResourceArticleCard key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="resources-library" aria-labelledby="resources-library-heading">
        <div className="resource-container">
          <div className="resources-section-heading">
            <div><p className="resource-eyebrow">The reference library</p><h2 id="resources-library-heading">Find your next step.</h2></div>
            <p>Licensing pathways, technical requirements,<br className="resources-desktop-break" /> and tools to help you plan the work.</p>
          </div>
          <div className="resources-library-controls">
            <div className="resource-filters" role="group" aria-label="Filter by resource format">
              {FORMATS.map((value) => <button type="button" key={value} aria-pressed={format === value} onClick={() => { setFormat(value); setVisibleCount(PAGE_SIZE) }}>{value}</button>)}
            </div>
            <div className="resources-search-controls">
              <label className="resource-topic-select"><span className="sr-only">Filter by industry</span><select value={topic} onChange={(event) => { setTopic(event.target.value); setVisibleCount(PAGE_SIZE) }}><option>All topics</option><option>Data Centers</option><option>Oil &amp; Gas</option><option>Space</option><option>Nuclear</option><option>Aerospace</option><option>Cross-industry</option></select><svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg></label>
              <label className="resource-search"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" /><path d="m12 12 4 4" /></svg><span className="sr-only">Search guides and tools</span><input type="search" value={query} placeholder="Search the library" onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE) }} /></label>
            </div>
          </div>
          <p className="resources-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{query.trim() ? ` matching “${query.trim()}”` : ''}</p>
          <div className="resources-reference-list">
            {filtered.slice(0, visibleCount).map((resource) => (
              <Link className="resources-reference" key={resource.path} to={resource.path}>
                <div className="resources-reference-meta"><span>{resource.kind}</span><span>{resource.topic}</span></div>
                <div className="resources-reference-copy"><h3>{resource.title}</h3><p>{resource.summary}</p></div>
                <ResourceArrow diagonal />
              </Link>
            ))}
          </div>
          {filtered.length === 0 && <div className="resource-empty"><h3>No matching resources.</h3><p>Try a regulator, an industry, or a broader search.</p><button type="button" className="resource-outline-button" onClick={clearFilters}>Clear filters <ResourceArrow /></button></div>}
          {filtered.length > visibleCount && <div className="resources-load-more"><span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}</span><button className="resource-outline-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show more <span aria-hidden="true">+</span></button></div>}
        </div>
      </section>

      <section className="resource-container resources-contact" aria-labelledby="resources-contact-heading">
        <div><p className="resource-eyebrow">Put it into practice</p><h2 id="resources-contact-heading">What are you building?</h2><p>Talk through the regulatory work ahead with our team.</p></div>
        <Link to="/contact" className="resource-solid-button">Talk to an expert <ResourceArrow diagonal /></Link>
      </section>
    </div>
  )
}
