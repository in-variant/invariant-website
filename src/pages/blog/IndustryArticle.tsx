import { Link, useParams } from 'react-router-dom'
import BlogArticleHeader, { BlogRelatedReading } from '../../components/BlogArticleHeader'
import { Seo, SITE_URL, ORG_SCHEMA, EDITORIAL_TEAM, articleSchema, breadcrumbSchema, faqSchema } from '../../components/Seo'
import { INDUSTRY_ARTICLES, articleImage, industryPath, BOOKING_URL, SITES_PHONE, SITES_PHONE_DISPLAY, type IndustryArticle as Article, type ArticleBlock } from '../../data/industryArticles'
import './IndustryArticle.css'

function Citations({ ids, article }: { ids?: string[]; article: Article }) {
  if (!ids?.length) return null
  return <span className="industry-citations">{ids.map(id => {
    const source = article.sources.find(item => item.id === id)
    return source ? <a key={id} href={source.url} title={source.title}>{source.publisher}<span aria-hidden="true"> ↗</span></a> : null
  })}</span>
}

function Block({ block, article }: { block: ArticleBlock; article: Article }) {
  if (block.type === 'paragraph') return <p>{block.text}<Citations ids={block.sourceIds} article={article} /></p>
  if (block.type === 'list') return <div className="industry-list"><ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul><Citations ids={block.sourceIds} article={article} /></div>
  return <figure className="industry-table"><div role="region" aria-label="Comparison table" tabIndex={0}><table><thead><tr>{block.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><figcaption><Citations ids={block.sourceIds} article={article} /></figcaption></figure>
}

export function SiteBookingBanner({ variant = 'top' }: { variant?: 'top' | 'foot' }) {
  return <aside className={`industry-site-booking industry-site-booking--${variant}`} aria-label="Book a call for more powered sites">
    <p className="industry-eyebrow">{variant === 'top' ? 'Want more sites like this one?' : 'Looking for a different site?'}</p>
    <h2>{variant === 'top' ? 'To get more powered sites, book a call.' : 'Tell us the MW, the state and the date. We will send the sites that fit.'}</h2>
    <p>We track powered land, energized mining sites and AI campuses across the US and abroad. Book 30 minutes and we will walk you through the ones that match your load, timeline and budget.</p>
    <div className="industry-site-booking-actions">
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
      <a href={`tel:${SITES_PHONE}`} className="industry-site-booking-phone">Call or text {SITES_PHONE_DISPLAY}</a>
    </div>
  </aside>
}

export default function IndustryArticle({ articleSlug, renderSeo = true }: { articleSlug?: string; renderSeo?: boolean }) {
  const params = useParams()
  const article = INDUSTRY_ARTICLES.find(item => item.slug === (articleSlug ?? params.slug))
  if (!article) return <article className="industry-missing"><Seo title="Article not found" description="Explore Invariant's regulatory research and guides." noindex /><h1>Article not found.</h1><Link to="/resources">Explore resources ↗</Link></article>
  const canonical = `${SITE_URL}/blog/${article.slug}`
  const hub = industryPath(article.topic)
  return <article className="blog-article industry-article">
    {renderSeo && <Seo title={article.title} description={article.description} canonical={canonical} ogImage={`${SITE_URL}${articleImage(article.slug)}`} ogType="article" jsonLd={[
      ORG_SCHEMA, EDITORIAL_TEAM,
      articleSchema({ title: article.title, description: article.description, url: canonical, datePublished: article.date, dateModified: article.date, image: `${SITE_URL}${articleImage(article.slug)}`, articleSection: article.kind === 'site-listing' ? 'Powered land and data center sites' : article.kind === 'site-guide' ? 'Data center site selection' : `${article.topic} compliance`, spatialCoverage: [article.region ?? 'United States'] }),
      breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: `${article.topic} compliance`, url: `${SITE_URL}${hub}` }, { name: article.title, url: canonical }]),
      faqSchema(article.faqs),
    ]} />}
    <BlogArticleHeader slug={article.slug} title={article.title} subtitle={article.description} />
    <div className="industry-article-layout">
      <aside className="industry-article-rail" aria-label="In this guide">
        <Link to={hub} className="industry-hub-link">{article.topic}<br />compliance <span aria-hidden="true">↗</span></Link>
        <p>In this guide</p>
        <nav>{article.sections.map((section, i) => <a key={section.id} href={`#${section.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav>
        <a href="#sources" className="industry-sources-link">Sources and references ↗</a>
      </aside>
      <div className="industry-article-body">
        <div className="industry-byline"><Link to="/about">Invariant editorial team</Link><span>{article.readMinutes} min read</span><span>{article.region ?? 'United States'}</span></div>
        {article.kind === 'site-listing' && <SiteBookingBanner />}
        <p className="industry-lead">{article.intro}</p>
        <section className="industry-takeaways" aria-label="Before you start"><p className="industry-eyebrow">Before you start</p><ul>{article.takeaways.map(item => <li key={item}>{item}</li>)}</ul></section>
        {article.sections.map(section => <section key={section.id} id={section.id} className="industry-prose-section"><h2>{section.heading}</h2>{section.blocks.map((block, i) => <Block key={i} block={block} article={article} />)}</section>)}
        <section className="industry-prose-section industry-faq" aria-labelledby="questions"><h2 id="questions">Questions that come up.</h2>{article.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}<Citations ids={faq.sourceIds} article={article} /></p></details>)}</section>
        <section id="sources" className="industry-prose-section industry-source-list"><h2>Sources and references.</h2><p>{article.kind === 'site-listing' ? 'Site specifications are as marketed by the seller and are checked against utility documents before any introduction. Public sources checked on' : 'Primary sources checked for this guide on'} <time dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time>. The location, equipment, and operating plan determine which requirements apply to a project.</p><ol>{article.sources.map(source => <li key={source.id} id={`source-${source.id}`}><span>{source.publisher}</span><a href={source.url}>{source.title} ↗</a></li>)}</ol></section>
        {article.kind === 'site-listing' || article.kind === 'site-guide' ? <SiteBookingBanner variant="foot" /> : <div className="industry-article-contact"><p className="industry-eyebrow">Put the requirements to work</p><h2>Bring the project.<br />Map the path to approval.</h2><p>Connect the applicable requirements to the design, the evidence, and the people responsible for each decision.</p><Link to={`/contact?industry=${article.topic === 'Data Centers' ? 'data-centers' : 'oil-and-gas'}`}>Talk to an expert <span aria-hidden="true">↗</span></Link></div>}
      </div>
    </div>
    <BlogRelatedReading slug={article.slug} relatedSlugs={article.relatedSlugs} />
  </article>
}
