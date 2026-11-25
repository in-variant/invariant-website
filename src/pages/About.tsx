import { Link } from 'react-router-dom'
import { COMPANY_LINKEDIN, Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import './About.css'

const advisors = [
  {
    name: 'Robert Lillis',
    role: 'Principal Investigator, NASA ESCAPADE. Associate Director, Planetary Group.',
    organization: 'UC Berkeley Space Sciences Laboratory',
    photo: '/advisors/robert-lillis.jpg',
  },
  {
    name: 'Charles Keller',
    role: 'Nuclear licensing & advanced reactor deployment',
    organization: 'InTomes',
    photo: '/advisors/charles-keller.jpg',
  },
]

const investors = [
  { name: 'Entrepreneurs First', url: 'https://www.joinef.com/', profile: 'https://www.joinef.com/companies/invariant-ai/?pagenum=2' },
  { name: 'Prompt Capital', url: 'https://promptcapital.com/' },
  { name: 'Founders Capital', url: 'https://founders-capital.com/' },
]

const aboutOrganization = {
  ...ORG_SCHEMA,
  founder: ['Parthiv Chandran', 'Pranav Goswami'].map(name => ({ '@type': 'Person', name })),
  funder: investors.map(({ name, url }) => ({ '@type': 'Organization', name, url })),
}
const canonical = `${SITE_URL}/about`
const description = 'Invariant AI builds the Invariant Earth API for U.S. property and infrastructure data and helps teams verify sites and power. Meet our founders and investors.'

export default function About() {
  return (
    <article className="about-page">
      <Seo title="About Invariant AI | Property and Infrastructure Data" description={description} canonical={canonical}
        ogImage={`${SITE_URL}/og/invariant-data-layer.jpg`}
        jsonLd={[aboutOrganization, {
          '@context': 'https://schema.org', '@type': 'AboutPage', '@id': canonical, url: canonical,
          name: 'About Invariant AI', description, mainEntity: { '@id': aboutOrganization['@id'] },
        }, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'About', url: canonical }])]} />
      <div className="about-container">
        <header className="about-hero">
          <div>
            <h1>About Invariant AI</h1>
            <p className="about-lead">We build Invariant Earth, an API for U.S. property and infrastructure data. We also help teams find sites, verify power delivery and understand what can be built.</p>
            <nav className="about-actions" aria-label="Learn about Invariant">
              <Link className="about-text-link" to="/product"><FigmaScrambleLabel>Explore Invariant Earth</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
              <Link className="about-text-link" to="/charter"><FigmaScrambleLabel>Read our charter</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
            </nav>
          </div>
          <img className="about-landscape" src="/media/earth/estuary.webp" width="1380" height="920" alt="" fetchPriority="high" />
        </header>

        <section className="about-story about-section" aria-labelledby="about-origin-title">
          <div className="about-section-label"><p className="about-eyebrow">What we build</p></div>
          <div className="about-story-copy">
            <h2 id="about-origin-title">Good decisions need records you can check.</h2>
            <p>A project team might need to reconcile a parcel boundary, a flood map and a utility letter before it can put a site under contract. A lender or underwriter needs to know which building each record covers and which version was in effect at the time.</p>
            <p>Invariant Earth lets teams query those kinds of records by location and inspect the source and date behind each result where available. Our site and power work goes further into the utility records and studies that determine how a project can connect.</p>
          </div>
        </section>

        <section className="about-founders about-section" aria-labelledby="about-founders-title">
          <div className="about-section-label"><p className="about-eyebrow">The founders</p></div>
          <div className="about-section-content">
            <h2 id="about-founders-title">Parthiv &amp; Pranav.</h2>
            <div className="about-founder-grid">
              <div className="about-founder">
                <div className="about-founder-portrait"><img src="/founders/parthiv.jpg" width="1066" height="1600" alt="Parthiv Chandran, co-founder and CTO of Invariant" loading="lazy" decoding="async" /></div>
                <span className="about-founder-role">Co-founder &amp; CTO</span>
                <h3>Parthiv Chandran</h3>
                <p>Parthiv was an early engineer at Aspora (YC W22), Metaforms, and Guidewire, building automation for compliance and insurance.</p>
                <p>He shipped Metaforms Voice in two weeks, closed seven-figure deals, and built Rayo.</p>
              </div>
              <div className="about-founder">
                <div className="about-founder-portrait"><img src="/founders/pranav.jpg" width="1064" height="1600" alt="Pranav Goswami, co-founder and CEO of Invariant" loading="lazy" decoding="async" /></div>
                <span className="about-founder-role">Co-founder &amp; CEO</span>
                <h3>Pranav Goswami</h3>
                <p>Pranav chairs the American Nuclear Society working group on machine learning for reactor inspection. He is the second-highest contributor to LFortran, a compiler used by NASA and supported by an €816K Sovereign Tech Agency grant.</p>
                <p>He scaled Neuralis to $700K, previously worked in machine learning at Warner Bros., and studied computer science at IIT Jodhpur.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-advisors about-section" aria-labelledby="about-advisors-title">
          <div className="about-section-content">
            <h2 id="about-advisors-title">Our advisors</h2>
            <div className="about-advisor-grid">
              {advisors.map(advisor => <div className="about-advisor" key={advisor.name}>
                <img src={advisor.photo} alt={advisor.name} loading="lazy" width="96" height="112" />
                <div>
                  <h3>{advisor.name}</h3>
                  <p>{advisor.role}</p>
                  <span>{advisor.organization}</span>
                </div>
              </div>)}
            </div>
          </div>
        </section>

        <section className="about-section about-investors" aria-labelledby="about-investors-title">
          <h2 id="about-investors-title">Backed by</h2>
          <ul>
            {investors.map(({ name, url, profile }) => (
              <li key={name}><a href={profile ?? url}>{name}<span aria-hidden="true">↗</span></a></li>
            ))}
          </ul>
        </section>

        <section className="about-invitation" aria-labelledby="about-invitation-title">
          <h2 id="about-invitation-title">Talk to Invariant</h2>
          <div className="about-invitation-action"><p>Tell us which locations, data or power questions you need to check.</p>
            <Link to="/contact" className="about-button"><FigmaScrambleLabel>Start a conversation</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
            <a className="about-text-link about-social-link" href={COMPANY_LINKEDIN}>Invariant AI on LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </div>
    </article>
  )
}
