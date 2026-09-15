import { Link } from 'react-router-dom'
import { INDUSTRY_HUBS } from '../data/industryHubs'
import { RESOURCE_ARTICLES } from '../data/resources'
import { ResourceArticleCard } from '../components/ResourceCards'
import { Seo, SITE_URL, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import './IndustryHub.css'
import './Resources.css'

export default function IndustryHub({ slug, renderSeo = true }: { slug: string; renderSeo?: boolean }) {
  const hub = INDUSTRY_HUBS.find(item => item.slug === slug)!
  const articles = RESOURCE_ARTICLES.filter(article => article.topic === hub.topic)
  const canonical = `${SITE_URL}/${hub.slug}`
  return <article className="industry-hub">
    {renderSeo && <Seo title={hub.title} description={hub.description} canonical={canonical} ogImage={`${SITE_URL}${hub.image}`} jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: `${hub.topic} compliance`, url: canonical }]), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: hub.title, description: hub.description, url: canonical, hasPart: articles.map(article => ({ '@type': 'Article', headline: article.title, url: `${SITE_URL}/blog/${article.slug}` })) }]} />}
    <header className="industry-hub-hero industry-hub-container">
      <div className="industry-hub-heading"><p className="industry-hub-eyebrow">{hub.topic} / Compliance</p><h1>{hub.heading}</h1><p>{hub.intro}</p><a className="industry-hub-jump" href="#compliance-map">Explore the requirements <span aria-hidden="true">↓</span></a></div>
      <figure><img src={hub.image} width="1600" height="900" alt={hub.topic === 'Data Centers' ? 'Illustrative data-center campus and electrical substation at dusk' : 'Illustrative onshore oil field with a pumpjack at sunset'} fetchPriority="high" /></figure>
    </header>
    {hub.topic === 'Data Centers' && <section className="industry-register industry-hub-container" aria-labelledby="register-heading">
      <div><p className="industry-hub-eyebrow">A working document</p><h2 id="register-heading">Start your compliance register.</h2></div>
      <div><p>Ten workstreams, with fields for the exact permit condition, equipment, owner, deadline and supporting record. Use it to turn an applicability decision into work someone owns.</p><p className="industry-register-note">A starting template for U.S. facilities. Complete the jurisdiction and applicability review for your site before using it as a compliance calendar.</p><a href="/downloads/data-center-compliance-register.csv" download>Download the register <span aria-hidden="true">↗</span></a><span className="industry-register-format">CSV · 10 workstreams · No signup</span></div>
    </section>}
    <section className="industry-hub-library industry-hub-container" aria-labelledby="industry-guides"><div className="industry-hub-section-heading"><div><p className="industry-hub-eyebrow">The field guides</p><h2 id="industry-guides">Start with the next decision.</h2></div><p>Detailed explanations, working checklists and links to the authorities behind each requirement.</p></div><div className="resource-article-grid">{articles.map(article => <ResourceArticleCard key={article.slug} article={article} />)}</div></section>
    <section id="compliance-map" className="industry-compliance-map industry-hub-container"><div className="industry-hub-section-heading"><div><p className="industry-hub-eyebrow">The compliance map</p><h2>Follow the whole project.</h2></div><p>{hub.scope}</p></div><div className="industry-gates">{hub.gates.map((gate, i) => <section key={gate.title} className="industry-gate"><span className="industry-gate-number">{String(i + 1).padStart(2, '0')}</span><div><h3>{gate.title}</h3><p className="industry-gate-question">{gate.question}</p></div><div><p><span>Evidence to assemble</span>{gate.evidence}</p><p><span>Authority and scope</span>{gate.authority}</p><div className="industry-gate-links"><a href={gate.source}>Primary reference ↗</a>{gate.guide && <Link to={`/blog/${gate.guide}`}>Read the guide ↗</Link>}</div></div></section>)}</div></section>
    <section className="industry-hub-work industry-hub-container"><div><p className="industry-hub-eyebrow">Keep the record useful</p><h2>A requirement needs<br />an owner and evidence.</h2></div><div><p>For each obligation, record the authority, the design assumption, the responsible person, the evidence and the next decision. Review that record when the site layout, equipment, operating mode or jurisdiction changes.</p><p>A dated document is useful. A dated document tied to the equipment and conditions it covers is useful when the project changes.</p><Link to={`/contact?industry=${hub.topic === 'Data Centers' ? 'data-centers' : 'oil-and-gas'}`}><FigmaScrambleLabel>Talk to an expert</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link></div></section>
  </article>
}
