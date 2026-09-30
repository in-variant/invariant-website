import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Seo, SITE_URL } from '../components/Seo'
import BlockReveal from '../components/BlockReveal'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import '../styles/figma-fonts.css'
import './Charter.css'

const asset = (name: string) => `/figma/charter/${name}`
const revealGradient = ['#fb4d03', '#fffaf2', '#80a8c6', '#071b35']
const chapters = [
  { id: 'the-distance', label: 'The distance to deployment' },
  { id: 'our-start', label: 'Why we started' },
  { id: 'the-work', label: 'The work ahead' },
  { id: 'our-commitment', label: 'What we owe the world' },
]

function FrameCorners({ divided = false }: { divided?: boolean }) {
  return <span className="charter-frame-corners" aria-hidden="true">
    <img className="charter-corner-tl" src={asset('corner-left.svg')} width="16" height="16" alt="" />
    <img className="charter-corner-bl" src={asset('corner-left.svg')} width="16" height="16" alt="" />
    <img className="charter-corner-tr" src={asset('corner-right.svg')} width="16" height="16" alt="" />
    <img className="charter-corner-br" src={asset('corner-right.svg')} width="16" height="16" alt="" />
    {divided && <>
      <img className="charter-corner-mtl" src={asset('corner-center.svg')} width="16" height="16" alt="" />
      <img className="charter-corner-mtr" src={asset('corner-left.svg')} width="16" height="16" alt="" />
      <img className="charter-corner-mbl" src={asset('corner-center.svg')} width="16" height="16" alt="" />
      <img className="charter-corner-mbr" src={asset('corner-left.svg')} width="16" height="16" alt="" />
    </>}
  </span>
}

export default function Charter() {
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState(chapters[0].id)

  useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const travel = document.documentElement.scrollHeight - innerHeight
      progressRef.current?.style.setProperty('--read-progress', String(travel > 0 ? scrollY / travel : 0))
      let current = chapters[0].id
      for (const chapter of chapters) {
        const section = document.getElementById(chapter.id)
        if (section && section.getBoundingClientRect().top <= innerHeight * .35) current = chapter.id
      }
      setActiveChapter(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <div className="invariant-charter">
    <Seo title="Why We Exist | Invariant" description="The physical economy needs compliance that keeps pace with engineering. Why we are building Invariant, from the founders." canonical={`${SITE_URL}/charter`} ogType="article" />
    {createPortal(<div ref={progressRef} className="charter-reading-progress" aria-hidden="true" />, document.body)}
    <div id="charter-content">
      <header className="charter-heading charter-container">
        <div className="charter-hero-copy">
          <p className="charter-eyebrow">Why we exist</p>
          <BlockReveal as="h1" gradient={revealGradient}>Built for the<br />physical economy.</BlockReveal>
          <p className="charter-hero-description">We build autonomous agents for compliance, so the teams building the physical world can move from ambition to operation.</p>
        </div>
        <figure className="charter-hero-art">
          <img src={asset('earth.png')} width="1536" height="1024" alt="A blue dithered Earth with paths connecting the globe" fetchPriority="high" />
        </figure>
        <FrameCorners divided />
      </header>

      <section className="charter-opening charter-container" aria-label="The physical economy">
        <BlockReveal as="p" className="charter-opening-statement" gradient={revealGradient}>More energy. More compute. More capacity to build. The physical economy moves forward when ambitious engineering becomes working infrastructure.</BlockReveal>
        <p className="charter-opening-description">A finished design is only part of the work. Before a site can break ground or a system can enter service, teams must show how it meets the requirements that apply.</p>
      </section>

      <div className="charter-layout charter-container">
        <aside className="charter-margin" aria-label="In this letter">
          <p className="charter-eyebrow">In this letter</p>
          <nav>{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={activeChapter === chapter.id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><span>{chapter.label}</span></a>)}</nav>
          <p className="charter-margin-note">Parthiv &amp; Pranav<br />Co-founders, Invariant</p>
        </aside>

        <article className="charter-story" aria-label="A letter from the founders">
          <section id="the-distance" aria-labelledby="charter-distance-heading">
            <h2 id="charter-distance-heading">The distance to deployment.</h2>
            <p>A power plant can be designed before its permits are ready. A data center can secure a site while its air, water, and construction requirements remain unresolved. A satellite can pass its tests and still have no path to launch.</p>
            <p>Between the engineering and the operation sits a body of work: identify the requirements, establish what satisfies them, gather the evidence, and keep it all consistent as the project changes. That work runs across engineering, legal, operations, and outside specialists. Its history is often spread across documents, spreadsheets, and inboxes.</p>
            <div className="charter-conviction">
              <FrameCorners />
              <img className="charter-quote-detail-tl" src={asset('quote-top-left.svg')} width="1" height="16" alt="" aria-hidden="true" />
              <img className="charter-quote-detail-tr" src={asset('quote-top-right.svg')} width="1" height="16" alt="" aria-hidden="true" />
              <img className="charter-quote-detail-bl" src={asset('quote-bottom-left.svg')} width="1" height="16" alt="" aria-hidden="true" />
              <p>The work of compliance should advance at the pace of the engineering.</p>
              <span className="charter-eyebrow">What we believe</span>
            </div>
            <p>A change to one design can affect several obligations. A team should be able to follow those connections without rebuilding the project history by hand, every time someone needs an answer.</p>
          </section>

          <section id="our-start" aria-labelledby="charter-origin-heading">
            <h2 id="charter-origin-heading">Why we started.</h2>
            <p>At school, Pranav worked on a satellite that could not fly because the necessary regulatory approvals were not in place. A project meant for space stayed on the ground.</p>
            <p>Parthiv came to this work through enterprise AI, building agents for compliance and insurance. We started Invariant to bring those two kinds of work together: the engineering of physical systems and the engineering of agents that can carry compliance work through.</p>
            <p>Space made the problem concrete for us. It reaches much further. Energy, data centers, manufacturing, and industrial infrastructure all depend on people turning technical facts into evidence that others can assess and trust.</p>
          </section>

          <section id="the-work" aria-labelledby="charter-work-heading">
            <h2 id="charter-work-heading">The work has to stay connected.</h2>
            <p>A requirement has a source. An answer rests on assumptions. Evidence describes a particular design, under particular conditions. When any of those change, the team needs to know what else needs attention.</p>
            <p>Consider a data center that changes its backup generators. Equipment specifications, emissions calculations, permit documents, and operating procedures may all depend on that decision. The useful system is one that carries the change through the work, with the reasoning intact.</p>
            <p>We are building Invariant as the compliance layer for the physical economy. Autonomous agents connect requirements to project information, prepare and check the work, and coordinate the next steps with the people responsible. The same context should carry from an early design decision through approvals and into operation.</p>
            <p>That context extends across regulations, technical standards, and the commitments a business makes to its customers. Our focus is the underlying work: what must be true, what demonstrates it, who owns it, and what has changed.</p>
            <p>We build alongside the teams doing that work. Our engineers connect the systems they already use and help turn a fragmented process into one they can follow, review, and improve.</p>
          </section>

          <section id="our-commitment" aria-labelledby="charter-commitment-heading">
            <h2 id="charter-commitment-heading">What we owe the world.</h2>
            <p>The physical economy affects people who never chose to use the product. A facility has neighbors. A power system serves communities. Infrastructure has to earn confidence in how it is built and operated.</p>
            <p>Our agents must show their sources and make uncertainty visible. Evidence must stay traceable to the design it describes. Sensitive data must stay within its proper boundaries. Expert judgment and responsibility must remain clear as more of the preparation becomes automated.</p>
            <p>These are product requirements. They determine whether the work can be trusted when a reviewer asks a difficult question or an engineer changes a critical assumption.</p>
            <p>We will measure our progress by what our customers can put into operation: energy reaching the grid, compute coming online, systems entering service. And by whether those teams can keep demonstrating compliance as their operations evolve.</p>
            <p className="charter-closing">We want the next team with something worth building to have a clearer path to putting it into the world.</p>
          </section>

          <footer className="charter-signature">
            <h2>Built alongside the builders.</h2>
            <p>We’re building the compliance infrastructure for the physical economy, with the engineers, operators, and specialists who carry that responsibility every day.</p>
            <div className="charter-founder-portraits">
              <figure>
                <div className="charter-founder-portrait"><img src={asset('parthiv.png')} width="1066" height="1600" alt="Parthiv Chandran, co-founder and CTO of Invariant" loading="lazy" decoding="async" /></div>
                <figcaption><span>Parthiv Chandran</span><span>Co-founder, CTO</span></figcaption>
              </figure>
              <figure>
                <div className="charter-founder-portrait"><img src={asset('pranav.png')} width="1064" height="1600" alt="Pranav Goswami, co-founder and CEO of Invariant" loading="lazy" decoding="async" /></div>
                <figcaption><span>Pranav Goswami</span><span>Co-founder, CEO</span></figcaption>
              </figure>
            </div>
            <Link to="/contact" className="charter-invitation"><FigmaScrambleLabel>Build with us</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
          </footer>
        </article>
      </div>
    </div>
  </div>
}
