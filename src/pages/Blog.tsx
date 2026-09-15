import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { ResourceArticleCard, ResourceArrow } from '../components/ResourceCards'
import { RESOURCE_ARTICLES } from '../data/resources'
import './Resources.css'

const TOPICS = ['All articles', 'Data Centers', 'Oil & Gas', 'Space', 'Nuclear'] as const

export default function Blog() {
  const [topic, setTopic] = useState<typeof TOPICS[number]>('All articles')
  const [query, setQuery] = useState('')
  const articles = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
    return RESOURCE_ARTICLES.filter((article) => (topic === 'All articles' || article.topic === topic) && terms.every((term) => `${article.title} ${article.summary} ${article.topic}`.toLocaleLowerCase().includes(term)))
  }, [topic, query])

  return (
    <div className="resources-page resource-blog-page">
      <Seo
        title="Articles | Research on mission-critical compliance"
        description="Practical research on data-center, oil and gas, space, and nuclear compliance. Explore siting, permitting, operating records, and the evidence behind approvals."
        canonical={`${SITE_URL}/blog`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'Resources', url: `${SITE_URL}/resources` }, { name: 'Articles', url: `${SITE_URL}/blog` }])]}
      />
      <header className="resources-intro resource-container">
        <Link className="resource-back-link" to="/resources"><span aria-hidden="true">←</span> All resources</Link>
        <p className="resource-eyebrow">Articles</p>
        <div className="resources-intro-grid">
          <h1>A closer look<br />at the work ahead.</h1>
          <p>Research from our team on the regulations, engineering decisions, and economics behind mission-critical work.</p>
        </div>
      </header>
      <section className="resource-container resource-blog-library" aria-label="Published articles">
        <div className="resources-library-controls">
          <div className="resource-filters" role="group" aria-label="Filter articles by industry">
            {TOPICS.map((value) => <button type="button" key={value} aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</button>)}
          </div>
          <label className="resource-search"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" /><path d="m12 12 4 4" /></svg><span className="sr-only">Search articles</span><input type="search" placeholder="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        <p className="resources-result-count" role="status" aria-live="polite">{articles.length} {articles.length === 1 ? 'article' : 'articles'}{query.trim() ? ` matching “${query.trim()}”` : ''}</p>
        <div className="resource-article-grid">
          {articles.map((article) => <ResourceArticleCard key={article.slug} article={article} />)}
        </div>
        {articles.length === 0 && <div className="resource-empty"><h2>No matching articles.</h2><p>Try a different topic or search term.</p><button type="button" className="resource-outline-button" onClick={() => { setTopic('All articles'); setQuery('') }}>Clear filters <ResourceArrow /></button></div>}
      </section>
      <section className="resource-container resources-contact">
        <div><p className="resource-eyebrow">For the next step</p><h2>From reading to doing.</h2><p>Explore the regulatory guides, references, and planning tools.</p></div>
        <Link to="/resources" className="resource-solid-button">Explore resources <ResourceArrow diagonal /></Link>
      </section>
    </div>
  )
}
