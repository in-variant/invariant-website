import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Seo, SITE_URL, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import '../styles/figma-fonts.css'
import './Charter.css'

export default function Charter() {
  const progressRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let frame = 0
    const update = () => {
      frame = 0
      const travel = document.documentElement.scrollHeight - innerHeight
      progressRef.current?.style.setProperty('--read-progress', String(travel > 0 ? scrollY / travel : 0))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [])

  return <div className="invariant-charter">
    <Seo title="Why Invariant AI Builds Data Infrastructure for the Physical World"
      description="A letter from Invariant AI’s founders on building source-linked data for properties, infrastructure and power, with dates and evidence people can verify."
      canonical={`${SITE_URL}/charter`} jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Why we exist', url: `${SITE_URL}/charter` }])]} ogType="article" ogImage={`${SITE_URL}/og/invariant-data-layer.jpg`} />
    {typeof document !== 'undefined' && createPortal(<div ref={progressRef} className="charter-reading-progress" aria-hidden="true" />, document.body)}
    <div id="charter-content">
      <header className="charter-heading">
        <div className="charter-hero-copy">
          <p className="charter-eyebrow">Why we exist</p>
          <h1>Data you can trace to the source</h1>
          <p className="charter-hero-description">We build data infrastructure for decisions about land, buildings, infrastructure and power.</p>
        </div>
        <figure className="charter-hero-art">
          <img src="/figma/charter/earth.png" width="1536" height="1024" alt="A blue dithered Earth with paths connecting the globe" fetchPriority="high" />
        </figure>
        <span className="charter-frame-corners" aria-hidden="true">
          <img className="charter-corner-tl" src="/figma/charter/corner-left.svg" width="16" height="16" alt="" />
          <img className="charter-corner-bl" src="/figma/charter/corner-left.svg" width="16" height="16" alt="" />
          <img className="charter-corner-tr" src="/figma/charter/corner-right.svg" width="16" height="16" alt="" />
          <img className="charter-corner-br" src="/figma/charter/corner-right.svg" width="16" height="16" alt="" />
          <img className="charter-corner-mtl" src="/figma/charter/corner-center.svg" width="16" height="16" alt="" />
          <img className="charter-corner-mtr" src="/figma/charter/corner-left.svg" width="16" height="16" alt="" />
          <img className="charter-corner-mbl" src="/figma/charter/corner-center.svg" width="16" height="16" alt="" />
          <img className="charter-corner-mbr" src="/figma/charter/corner-left.svg" width="16" height="16" alt="" />
        </span>
      </header>

      <div className="charter-layout">
        <aside className="charter-margin" aria-label="In this letter">
          <span className="charter-eyebrow">What we believe</span>
          <nav>
            <a href="#the-distance">The records behind a decision</a>
            <a href="#our-start">Why we started</a>
            <a href="#the-work">What we are building</a>
            <a href="#our-commitment">What you should be able to verify</a>
          </nav>
        </aside>

        <article className="charter-story">
          <section id="the-distance" aria-label="The records behind a decision">
            <p className="charter-lead">Before a team can build on a site, someone has to establish what is true about the land, the buildings and the infrastructure that serves it.</p>
            <p>The records are scattered across assessors, utilities, regulators and operators. They change on different schedules. Even two records with the same street address can describe different buildings or different dates.</p>
            <p>Those differences decide whether a buyer spends another week on a site, an underwriter asks for an inspection, or a utility needs to study a different connection.</p>
          </section>

          <section id="our-start" aria-labelledby="charter-origin-heading">
            <h2 id="charter-origin-heading">Why we started</h2>
            <p>We came to the problem through engineering, compliance and insurance. In each, the people accountable for a decision spend hours checking whether a number came from the right property, whether the source still applies, and what changed since the last review.</p>
            <p>We started Invariant to make those checks easier to repeat and to give teams a record they can hand to the next person.</p>
          </section>

          <section id="the-work" aria-labelledby="charter-work-heading">
            <h2 id="charter-work-heading">What we are building</h2>
            <p>Invariant Earth gives people and software a common way to query U.S. property and infrastructure data. A result can carry its source and date. Where a source supports history, teams should be able to compare versions and see when a boundary or record changed.</p>
            <p>At Brooklyn Army Terminal, a tax lot went through a split and a later merger. Tracking the dated parcel records lets a team reconstruct the boundary that applied to an earlier decision. <Link to="/blog/historical-parcel-boundaries-api">Read the parcel history example.</Link></p>
            <p>For power decisions, our site work traces a proposed service connection, the equipment that can constrain it and the documents the utility has issued. A study can test a proposed load under different conditions. The service terms and delivery schedule come from the serving utility. <Link to="/blog/utility-grade-power-study">See what a power study can show.</Link></p>
          </section>

          <section id="our-commitment" aria-labelledby="charter-commitment-heading">
            <h2 id="charter-commitment-heading">What you should be able to verify</h2>
            <p>A record should tell you who published it, which place and date it covers, and how the value was obtained. A model should show its inputs and assumptions. When coverage is missing, the result should say so.</p>
            <p>Those details let an engineer, lender, underwriter or software agent check the same evidence and explain what would change the decision. We measure progress by how much of that work customers can do with a record they can reuse.</p>
            <p className="charter-closing"><Link to="/product">Explore Invariant Earth.</Link></p>
          </section>

          <footer className="charter-signature">
            <div className="charter-founder-portraits">
              <div className="charter-founder-portrait"><img src="/founders/parthiv.jpg" width="1066" height="1600" alt="Parthiv, co-founder of Invariant" loading="lazy" decoding="async" /></div>
              <div className="charter-founder-portrait"><img src="/founders/pranav.jpg" width="1064" height="1600" alt="Pranav, co-founder of Invariant" loading="lazy" decoding="async" /></div>
            </div>
            <span className="charter-signature-names">Parthiv &amp; Pranav</span>
            <span className="charter-eyebrow">Co-founders, Invariant</span>
            <Link to="/contact" className="charter-invitation"><FigmaScrambleLabel>Build with us</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
          </footer>
        </article>
      </div>
    </div>
  </div>
}
