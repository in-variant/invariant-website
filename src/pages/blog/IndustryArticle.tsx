import { Link } from 'react-router-dom'
import BlogArticleHeader, { BlogRelatedReading } from '../../components/BlogArticleHeader'
import DatasetCitation from '../../components/DatasetCitation'
import { Seo, SITE_URL, ORG_SCHEMA, EDITORIAL_TEAM, articleSchema, breadcrumbSchema, datasetSchema, faqSchema, howToSchema } from '../../components/Seo'
import { INDUSTRY_HUBS, isSiteKind, DILIGENCE_PILLAR, COMPUTE_PILLAR, INDIA_PILLAR, INDIA_HUB, BOOKING_URL, SITES_PHONE, SITES_PHONE_DISPLAY, SITES_EMAIL, type IndustryArticle as Article, type ArticleBlock } from '../../data/industryArticles'
import { publishedDatasets } from '../../data/publishedDatasets'
import './IndustryArticle.css'

function Citations({ ids, article }: { ids?: string[]; article: Article }) {
  if (!ids?.length) return null
  return <span className="industry-citations">{ids.map(id => {
    const source = article.sources.find(item => item.id === id)
    return source ? <a key={id} href={source.url} title={source.title}>{source.linkLabel ?? source.publisher}<span aria-hidden="true"> ↗</span></a> : null
  })}</span>
}

type PublishedDatasets = ReturnType<typeof publishedDatasets>

function Block({ block, article, datasets }: { block: ArticleBlock; article: Article; datasets: PublishedDatasets }) {
  if (block.type === 'paragraph') return <p>{block.text}<Citations ids={block.sourceIds} article={article} /></p>
  if (block.type === 'links') return <nav className="industry-links" aria-label={block.label || "Related guides"}>{block.label && <p className="industry-eyebrow">{block.label}</p>}<ul>{block.items.map(item => {
    const path = item.path ?? `/blog/${item.slug}`
    return <li key={path}><Link to={path}>{item.label}</Link></li>
  })}</ul></nav>
  if (block.type === 'list') return <div className="industry-list"><ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul><Citations ids={block.sourceIds} article={article} /></div>
  if (block.type === 'download') {
    const entry = datasets.find(({ dataset }) => dataset.downloads[0].path === block.path)
    const workflow = entry && !entry.dataset.anchor ? entry.workflow : undefined
    return <>
      {entry && <p id={entry.anchor} className="industry-dataset-title"><Link to={`/datasets#${entry.id}`}>{entry.dataset.name}</Link></p>}
      <a className="industry-worksheet-download" href={block.path} download>{block.label} <span>{block.format}</span></a>
      {entry && <DatasetCitation name={entry.dataset.name} datePublished={entry.datePublished} url={`${SITE_URL}${entry.notesPath}`} />}
      {workflow && <p><a className="industry-dataset-workflow" href={workflow.url}>{workflow.label} <span aria-hidden="true">↗</span></a></p>}
    </>
  }
  const stackOnMobile = block.worksheet || block.stackOnMobile
  return (
    <figure className={`industry-table${block.worksheet ? ' industry-table--worksheet' : ''}${stackOnMobile ? ' industry-table--stacked' : ''}`}>
      {block.worksheet && (
        <a className="industry-worksheet-download" href={`/blog/${article.slug}.csv`} download>
          Download the worksheet <span>CSV</span>
        </a>
      )}
      <div role="region" aria-label={block.worksheet ? 'Data center site selection worksheet' : 'Comparison table'} tabIndex={0}>
        <table role="table">
          <thead role="rowgroup">
            <tr role="row">{block.columns.map(column => <th key={column} scope="col" role="columnheader">{column}</th>)}</tr>
          </thead>
          <tbody role="rowgroup">
            {block.rows.map((row, i) => (
              <tr key={i} role="row">
                {row.map((cell, j) => j === 0 ? (
                  <th key={j} scope="row" role="rowheader">{cell}</th>
                ) : (
                  <td key={j} role="cell">
                    {stackOnMobile && <span className="industry-worksheet-field" aria-hidden="true">{block.columns[j]}</span>}
                    {cell}
                    {j === row.length - 1 && <Citations ids={block.rowSourceIds?.[i]} article={article} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption><Citations ids={block.sourceIds} article={article} /></figcaption>
    </figure>
  )
}

export function articleCrumbs(article: Article, canonical: string) {
  const hub = INDUSTRY_HUBS[article.topic]
  const middle = article.kind === 'india-guide'
    ? { name: 'Data centres in India', url: `${SITE_URL}/blog/${INDIA_PILLAR}` }
    : article.kind === 'study-guide'
    ? { name: 'Site due diligence', url: `${SITE_URL}/blog/${DILIGENCE_PILLAR}` }
    : article.kind === 'compute-guide' ? { name: 'AI compute capacity', url: `${SITE_URL}/blog/${COMPUTE_PILLAR}` }
    : isSiteKind(article.kind) ? { name: 'Data center sites', url: `${SITE_URL}/blog/find-data-center-site-us` } : { name: hub.name, url: `${SITE_URL}${hub.path}` }
  return article.slug === 'find-data-center-site-us' || article.slug === DILIGENCE_PILLAR || article.slug === COMPUTE_PILLAR || article.slug === INDIA_PILLAR ? [{ name: 'Invariant', url: SITE_URL }, { name: article.title, url: canonical }] : [{ name: 'Invariant', url: SITE_URL }, middle, { name: article.title, url: canonical }]
}

const SECTION_LABEL = { 'site-listing': 'Powered land and data center sites', 'site-guide': 'Data center site selection', 'study-guide': 'Data center site due diligence', 'compute-guide': 'AI compute capacity for neoclouds and AI labs', 'india-guide': 'Data centres in India' } as const

/** Every JSON-LD block for an industry article; shared by the SPA and the prerender. */
function articleJsonLd(article: Article, canonical: string, image: string, datasets: PublishedDatasets) {
  const blocks: object[] = [
    ORG_SCHEMA, EDITORIAL_TEAM,
    articleSchema({ title: article.title, description: article.description, url: canonical, datePublished: article.date, dateModified: article.updatedDate, image, articleSection: article.kind ? SECTION_LABEL[article.kind] : article.topic === 'Data & APIs' ? article.topic : INDUSTRY_HUBS[article.topic].name, spatialCoverage: [article.region ?? 'United States'] }),
    breadcrumbSchema(articleCrumbs(article, canonical)),
    faqSchema(article.faqs),
  ]
  if (article.service) blocks.push({
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${canonical}#service`,
    name: article.service.name, serviceType: article.service.serviceType, description: article.service.description, url: canonical, image,
    provider: { '@id': `${SITE_URL}/#organization` }, areaServed: { '@type': 'Country', name: article.kind === 'india-guide' ? 'India' : 'United States' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Data center developers, investors, lenders, landowners and site brokers' },
    potentialAction: { '@type': 'ReserveAction', target: BOOKING_URL, name: article.kind === 'site-guide' ? 'Discuss a site search' : 'Book a call to scope a study' },
  })
  if (article.howTo) blocks.push(howToSchema({ name: article.howTo.name, description: article.description, url: canonical, steps: article.howTo.steps }))
  blocks.push(...datasets.map(({ dataset }) => datasetSchema(dataset, canonical, article.date)))
  return blocks
}

/** Inbound for neoclouds and AI labs: GPU count, type and date are enough to start. */
export function GpuCapacityBanner({ variant = 'top' }: { variant?: 'top' | 'foot' }) {
  const subject = encodeURIComponent('GPU capacity request')
  const body = encodeURIComponent('GPU type and count (or MW):\nRack density and cooling (air, liquid):\nDate you need power:\nRegions you would consider:\nColocation, powered shell or a site to build on:\n')
  return <aside className={`industry-site-booking industry-site-booking--${variant}`} aria-label="Request GPU capacity">
    <p className="industry-eyebrow">{variant === 'top' ? 'Need somewhere to put your GPUs?' : 'Tell us the cluster'}</p>
    <h2>{variant === 'top' ? 'Tell us the GPU count and the date. We send capacity that fits.' : 'GPU count, rack density and a date. We come back with powered options and the evidence behind each.'}</h2>
    <p>We track energized sites, built data centers and powered land across the US, from a few hundred kW to hundreds of MW, and check each one’s power against utility documents before we introduce it. For a provider or site you already have in mind, we run a power check on it so the date in your lease holds.</p>
    <div className="industry-site-booking-actions">
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}&body=${body}`}>Request capacity <span aria-hidden="true">↗</span></a>
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
      <a href={`tel:${SITES_PHONE}`} className="industry-site-booking-phone">Call or text {SITES_PHONE_DISPLAY}</a>
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}`} className="industry-site-booking-phone">Email {SITES_EMAIL}</a>
    </div>
  </aside>
}

/** Inbound for the due diligence cluster: a coordinate and a MW figure are enough to start. */
export function StudyRequestBanner({ variant = 'top' }: { variant?: 'top' | 'foot' }) {
  const subject = encodeURIComponent('Site screen or power study request')
  const body = encodeURIComponent('Site coordinates or parcel:\nTarget load (MW) and phasing:\nEnergize-by date:\nWhat you need (feasibility screen, utility-grade power study, or both):\n')
  return <aside className={`industry-site-booking industry-site-booking--${variant}`} aria-label="Request a site screen or power study">
    <p className="industry-eyebrow">{variant === 'top' ? 'Have a site in mind?' : 'Send us the site'}</p>
    <h2>{variant === 'top' ? 'Send a coordinate and a MW figure. Get a feasibility screen back.' : 'Find out how much power your site can get, and by when.'}</h2>
    <p>Step one is a feasibility screen: power at the nearest substations, flood, seismic, wetlands, airports, zoning and parcel, ending in a go or no-go. Step two is a utility-grade power study with N-1 contingency tests, upgrade paths, an indicative cost and an energization date. We work for developers, investors, landowners and brokers, and white-label for advisers.</p>
    <div className="industry-site-booking-actions">
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}&body=${body}`}>Request a site screen <span aria-hidden="true">↗</span></a>
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
      <a href={`tel:${SITES_PHONE}`} className="industry-site-booking-phone">Call or text {SITES_PHONE_DISPLAY}</a>
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}`} className="industry-site-booking-phone">Email {SITES_EMAIL}</a>
    </div>
  </aside>
}

/** Inbound for the India cluster: a state or coordinate, a MW figure and a date are enough to start. */
export function IndiaSiteBanner({ variant = 'top' }: { variant?: 'top' | 'foot' }) {
  const subject = encodeURIComponent('India data centre site or approvals')
  const body = encodeURIComponent('State and city, or site coordinates:\nTarget IT load (MW) and phasing:\nDate you need power:\nWhat you need (site screen, power path, approvals map):\n')
  return <aside className={`industry-site-booking industry-site-booking--${variant}`} aria-label="Send an India data centre site">
    <p className="industry-eyebrow">{variant === 'top' ? 'Planning a data centre in India?' : 'Send us the site'}</p>
    <h2>{variant === 'top' ? 'Send a state, a MW figure and a date. We map the power path and the approvals.' : 'Find out how the site gets power, which approvals it needs, and in what order.'}</h2>
    <p>We check the evidence behind a site’s power (the discom or transmission connection, the open access route, the nearest substations), screen seismic zone, flood history, groundwater status and airport height limits, and list the central and state approvals the project needs with the authority behind each one.</p>
    <div className="industry-site-booking-actions">
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}&body=${body}`}>Send a site <span aria-hidden="true">↗</span></a>
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}`} className="industry-site-booking-phone">Email {SITES_EMAIL}</a>
    </div>
  </aside>
}

/** Invariant Market: the gated catalogue of US data center sites (Pranav, 2026-11-19). */
export const MARKET_URL = 'https://market.invariant-ai.com'

export function SiteMarketStrip() {
  return <aside className="industry-site-market" aria-label="Find more data center sites">
    <p><span className="industry-eyebrow">More sites</span>Over 100 US powered sites, each with a free teaser, risk and power reports, are on Invariant Market.</p>
    <a href={MARKET_URL}>Find more sites at market.invariant-ai.com <span aria-hidden="true">↗</span></a>
  </aside>
}

function SiteSelectionRequestBanner({ variant = 'top' }: { variant?: 'top' | 'foot' }) {
  const subject = encodeURIComponent('Data center site selection request')
  const body = encodeURIComponent([
    'Target markets or states:',
    'Facility MW at the meter by phase:',
    'Required service dates:',
    'Buy or lease, and preferred site type:',
    'Reliability, cooling or fiber requirements:',
    'Sites already under consideration:',
  ].join('\n'))
  return <aside className={`industry-site-booking industry-site-booking--${variant}`} aria-label="Request data center site selection">
    <h2>{variant === 'top' ? 'Request a data center site search' : 'Discuss your site requirements'}</h2>
    <p>Send the facility load by phase, the markets you’re considering and the dates you need service. Include any sites you already have under review.</p>
    <div className="industry-site-booking-actions">
      <a href={`mailto:${SITES_EMAIL}?subject=${subject}&body=${body}`}>Send site requirements <span aria-hidden="true">↗</span></a>
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
    </div>
  </aside>
}

function SiteBookingBanner() {
  return <section id="site-enquiry" className="industry-site-booking industry-site-booking--foot" aria-label="Request a site shortlist" data-nosnippet="">
    <h2>Request a data center site shortlist</h2>
    <p>Tell us the load you need at the meter, where you’re looking and when you need service. We’ll walk through the sites that match your requirements and the evidence behind their reported power.</p>
    <div className="industry-site-booking-actions">
      <a href={BOOKING_URL} target="_blank" rel="noopener">Book a call <span aria-hidden="true">↗</span></a>
      <a href={MARKET_URL}>Find more sites at market.invariant-ai.com <span aria-hidden="true">↗</span></a>
      <a href={`tel:${SITES_PHONE}`} className="industry-site-booking-phone">Call or text {SITES_PHONE_DISPLAY}</a>
      <a href={`mailto:${SITES_EMAIL}?subject=${encodeURIComponent('Data center sites')}`} className="industry-site-booking-phone">Email {SITES_EMAIL}</a>
    </div>
  </section>
}

export default function IndustryArticle({ article }: { article: Article }) {
  const canonical = `${SITE_URL}/blog/${article.slug}`
  const { image: cover } = article.published
  const datasets = publishedDatasets(article.published)
  const image = `${SITE_URL}${cover}`
  const hub = INDUSTRY_HUBS[article.topic]
  const isIndiaGuide = article.kind === 'india-guide'
  const isDataGuide = article.topic === 'Data & APIs'
  const isSiteListing = article.kind === 'site-listing'
  const coverCaption = article.coverCaption ?? (isSiteListing ? 'AI-generated illustration.' : undefined)
  const isSiteSelectionService = article.kind === 'site-guide' && !!article.service
  const hasWorksheet = article.sections.some(section => section.blocks.some(block => block.type === 'table' && block.worksheet))
  const reviewedDate = article.updatedDate ?? article.date
  return <article className="blog-article industry-article">
    <Seo title={article.title} description={article.description} canonical={canonical} markdown={`/blog/${article.slug}.md`} ogImage={image} ogType="article" jsonLd={articleJsonLd(article, canonical, image, datasets)} />
    <BlogArticleHeader article={article.published} title={article.title} subtitle={isSiteListing ? article.intro : article.description} coverCaption={coverCaption} coverAlt={article.coverAlt} coverImage={article.coverImage} siteDetailsId={isSiteListing ? article.sections[0]?.id : undefined} />
    <div className="industry-article-layout">
      <aside className="industry-article-rail" aria-label="In this guide">
        {isSiteListing ? <Link to="/blog/find-data-center-site-us" className="industry-hub-link">Data center site finder <span aria-hidden="true">↗</span></Link> :
          <Link to={isIndiaGuide ? INDIA_HUB : hub.path} className="industry-hub-link">{isIndiaGuide ? 'India data centre approvals' : isDataGuide ? 'All articles' : <>{article.topic}<br />{' '}compliance</>} <span aria-hidden="true">↗</span></Link>}
        <p>In this guide</p>
        <nav>{article.sections.map((section, i) => <a key={section.id} href={`#${section.id}`}><span>{String(i + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav>
        <a href="#sources" className="industry-sources-link">Sources and references ↗</a>
      </aside>
      <div className="industry-article-body">
        <div className="industry-byline"><Link to="/about">Invariant editorial team</Link><span>{article.readMinutes} min read</span><span>{article.region ?? 'United States'}</span></div>
        {isSiteSelectionService && <SiteSelectionRequestBanner />}
        {article.kind === 'site-guide' && !isSiteSelectionService && (hasWorksheet ?
          <aside className="industry-site-market" aria-label="Site selection worksheet">
            <p>Compare candidate sites and record the evidence and next action for each check.</p>
            <a href={`/blog/${article.slug}.csv`} download>Download the worksheet (CSV) <span aria-hidden="true">↗</span></a>
          </aside> : <SiteMarketStrip />)}
        {article.kind === 'study-guide' && <StudyRequestBanner />}
        {article.kind === 'compute-guide' && <GpuCapacityBanner />}
        {isIndiaGuide && <IndiaSiteBanner />}
        {!isSiteListing && <p className="industry-lead">{article.intro}</p>}
        <section className="industry-takeaways" aria-label={isSiteListing ? 'Key site facts' : 'Before you start'}><p className="industry-eyebrow">{isSiteListing ? 'Key site facts' : 'Before you start'}</p><ul>{article.takeaways.map(item => <li key={item}>{item}</li>)}</ul></section>
        {article.sections.map(section => <section key={section.id} id={section.id} className="industry-prose-section"><h2>{section.heading}</h2>{section.blocks.map((block, i) => <Block key={i} block={block} article={article} datasets={datasets} />)}</section>)}
        <section className="industry-prose-section industry-faq" aria-labelledby="questions"><h2 id="questions">Questions that come up.</h2>{article.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}<Citations ids={faq.sourceIds} article={article} /></p></details>)}</section>
        <section id="sources" className="industry-prose-section industry-source-list"><h2>Sources and references.</h2><p>{article.kind === 'site-listing' ? 'Site specifications are as marketed by the seller and are checked against utility documents before any introduction. Public sources checked on' : 'Primary sources checked for this guide on'} <time dateTime={reviewedDate}>{new Date(`${reviewedDate}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time>.{!isDataGuide && ' The location, equipment, and operating plan determine which requirements apply to a project.'}</p><ol>{article.sources.map(source => <li key={source.id} id={`source-${source.id}`}><span>{source.publisher}</span><a href={source.url}>{source.title} ↗</a></li>)}</ol></section>
        {isDataGuide ? <div className="industry-article-contact"><h2>Try Invariant Earth on a site you know.</h2><p>Pick a US coordinate and inspect the source, dataset vintage, and status for each field.</p><a href="https://docs.invariant-ai.com/quickstart">Open the API quickstart <span aria-hidden="true">↗</span></a></div> :
        isIndiaGuide ? <IndiaSiteBanner variant="foot" /> : isSiteSelectionService ? <SiteSelectionRequestBanner variant="foot" /> : article.kind === 'study-guide' ? <StudyRequestBanner variant="foot" /> : article.kind === 'compute-guide' ? <GpuCapacityBanner variant="foot" /> : isSiteKind(article.kind) ? <SiteBookingBanner /> : <div className="industry-article-contact"><p className="industry-eyebrow">Put the requirements to work</p><h2>Bring the project.<br />Map the path to approval.</h2><p>Connect the applicable requirements to the design, the evidence, and the people responsible for each decision.</p><Link to={`/contact?industry=${article.topic === 'Data Centers' ? 'data-centers' : 'oil-and-gas'}`}>Talk to an expert <span aria-hidden="true">↗</span></Link></div>}
      </div>
    </div>
    <BlogRelatedReading articles={article.relatedReading} />
  </article>
}
