import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
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

export default function About() {
  return (
    <article className="about-page">
      <Seo title="About Invariant" description="Why Parthiv and Pranav are building autonomous agents for the physical economy, starting with the regulatory work behind space, energy, and infrastructure." canonical={`${SITE_URL}/about`} jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: `${SITE_URL}/` }, { name: 'About', url: `${SITE_URL}/about` }])]} />
      <div className="about-container">
        <header className="about-hero">
          <div>
            <p className="about-eyebrow">About Invariant</p>
            <h1>Engineering deserves<br />a clear path forward.</h1>
            <p className="about-lead">We build autonomous agents for the physical economy, starting with the regulatory work that determines what gets built and when.</p>
            <Link className="about-text-link" to="/charter"><FigmaScrambleLabel>Read our charter</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
          </div>
          <figure className="about-mission-art" aria-label="A blue dithered satellite in orbit">
            <div className="about-satellite"><img src="/figma/imgAudiencevisualsUpdate2.png" width="4096" height="2731" alt="" /></div>
            <figcaption><span>Built for what’s next</span><span aria-hidden="true">↗</span></figcaption>
          </figure>
        </header>

        <section className="about-story about-section" aria-labelledby="about-origin-title">
          <div className="about-section-label"><span className="about-section-number">01</span><p className="about-eyebrow">Why we started</p></div>
          <div className="about-story-copy">
            <h2 id="about-origin-title">A satellite ready for space.<br />Still on the ground.</h2>
            <p>At school, Pranav worked on a satellite that could not fly because the necessary regulatory approvals were not in place. A project meant for space stayed on the ground.</p>
            <p>The work between a successful test and an approved mission deserves the same engineering attention as the machine itself. That is where we are putting ours.</p>
            <p>We are building agents that carry context through the life of a mission: connecting technical information to requirements, evidence, documents, and the people responsible for the next decision.</p>
          </div>
        </section>

        <section className="about-founders about-section" aria-labelledby="about-founders-title">
          <div className="about-section-label"><span className="about-section-number">02</span><p className="about-eyebrow">The founders</p></div>
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
          <div className="about-section-label"><span className="about-section-number">03</span><p className="about-eyebrow">Our advisors</p></div>
          <div className="about-section-content">
            <h2 id="about-advisors-title">Experience across<br />space and nuclear.</h2>
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

        <section className="about-invitation" aria-labelledby="about-invitation-title">
          <div><p className="about-eyebrow">The work ahead</p><h2 id="about-invitation-title">Build with us.</h2></div>
          <div className="about-invitation-action"><p>Bring us the mission and the regulatory work ahead.</p><Link to="/contact" className="about-button"><FigmaScrambleLabel>Start a conversation</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link></div>
        </section>
      </div>
    </article>
  )
}
