import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Seo, SITE_URL } from '../components/Seo'
import CharterFilm from '../components/CharterFilm'
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
    <Seo title="Why We Exist | Invariant" description="Why we are building Invariant: a clear path from engineering breakthroughs to approved missions. A letter from Parthiv and Pranav." canonical={`${SITE_URL}/charter`} ogType="article" />
    {createPortal(<div ref={progressRef} className="charter-reading-progress" aria-hidden="true" />, document.body)}
    <div id="charter-content">
      <header className="charter-heading">
        <div className="charter-heading-meta"><span className="charter-eyebrow">Why we exist</span><span>A letter from the founders</span></div>
        <h1>Great engineering<br />should reach the world.</h1>
        <div className="charter-byline"><span>Parthiv &amp; Pranav</span><span>Co-founders, Invariant</span></div>
      </header>

      <div className="charter-layout">
        <aside className="charter-margin" aria-label="In this letter">
          <span className="charter-eyebrow">What we believe</span>
          <nav>
            <a href="#the-distance">The distance to deployment</a>
            <a href="#our-start">Why we started</a>
            <a href="#the-work">The work ahead</a>
            <a href="#our-commitment">What we owe the mission</a>
          </nav>
          <span className="charter-margin-note">Written for the people<br />building what comes next.</span>
        </aside>

        <article className="charter-story">
          <section id="the-distance" aria-label="The distance to deployment">
            <p className="charter-lead">Rockets return from space and fly again. Teams are designing new reactors, building satellite constellations, and expanding the infrastructure on which the next generation of computing depends.</p>
            <p>Yet the next milestone for many of these teams is an approval. A launch authorisation, an operating licence, a permit to build. Technical progress can run far ahead of the work needed to put it into service.</p>
            <p>In 2024, Elon Musk described the frustration:</p>
            <blockquote>
              <p>“It really should not be possible to build a giant rocket faster than the paper can move from one desk to another.”</p>
              <cite><a href="https://www.youtube.com/watch?v=pSFvOUswFwA" target="_blank" rel="noreferrer">Elon Musk · All-In Summit 2024 <span aria-hidden="true">↗</span></a></cite>
            </blockquote>
            <p>The work between a successful test and an approved mission deserves the same engineering attention as the machine itself. That is where we are putting ours.</p>
          </section>

          <div className="charter-film-placement"><CharterFilm /></div>

          <section id="our-start" aria-labelledby="charter-origin-heading">
            <h2 id="charter-origin-heading">Why we started.</h2>
            <p>At school, Pranav worked on a satellite that could not fly because the necessary regulatory approvals were not in place. A project meant for space stayed on the ground.</p>
            <p>He is now chairing the development of American Nuclear Society criteria for applying computer vision and machine learning to nuclear plant inspection and monitoring. Parthiv came to this work through enterprise AI, building agents for compliance and insurance.</p>
          </section>

          <section id="the-work" aria-labelledby="charter-work-heading">
            <h2 id="charter-work-heading">The work has to hold together.</h2>
            <p>A compliance requirement is rarely finished when somebody finds the right paragraph. It has to be interpreted against a particular design, supported by evidence, reflected consistently across documents, and kept current when the design changes.</p>
            <p>Much of that continuity lives in people’s heads. An engineer remembers why a number changed. A specialist knows which earlier decision matters. A programme lead keeps the dependencies straight in a spreadsheet. When someone moves on or a question comes back, the next person has to reconstruct the reasoning before the work can continue.</p>
            <p>Generating another document helps only if it moves that whole process forward.</p>
            <p>We are building autonomous agents that carry context through the life of a mission: connecting technical information to requirements, evidence, documents, and the people responsible for the next decision.</p>
            <p>An engineer revising a satellite’s mission should be able to see which obligations and filings need attention. A reviewer should be able to follow a claim back to the test or decision that supports it. A team should know what stands between today and its next approval, without piecing the answer together from a dozen inboxes.</p>
            <p>We have to build this alongside the engineers and regulatory specialists who make those decisions.</p>
          </section>

          <section id="our-commitment" aria-labelledby="charter-commitment-heading">
            <h2 id="charter-commitment-heading">What we owe the mission.</h2>
            <p>A launch, a reactor, or an industrial facility affects people far beyond the team that built it. Demonstrating that it can operate responsibly is part of the work. Clear evidence, consistent submissions, and assumptions surfaced early give reviewers a firmer basis for their decisions.</p>
            <p>Our agents must be able to show their sources. Uncertainty must be visible. Sensitive data must stay within its proper boundaries. As preparation and coordination become automated, expert judgement and responsibility must remain clear.</p>
            <p>We are starting with space and nuclear, where the work demands depth. The same problem reaches into data centres, oil and gas, and the infrastructure around them. We will earn the right to serve those teams by doing the work thoroughly.</p>
            <p>We will measure our progress by what our customers can put into operation: missions that fly, energy that reaches the grid, infrastructure that goes into service.</p>
            <p className="charter-closing">The next team should not have to discover this bottleneck with a satellite waiting on the ground. We are building Invariant so the work of approval can advance alongside the engineering.</p>
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
