import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BlockReveal from './BlockReveal'
import BrandHeading from './BrandHeading'
import FigmaLowerSections from './FigmaLowerSections'
import FigmaType from './FigmaType'
import DitherMorph from './DitherMorph'
import DitherTint from './DitherTint'
import useDitherHover from './useDitherHover'
import FigmaSmoothScroll, { scrollFigmaTo } from './FigmaSmoothScroll'
import { smallViewportHeight } from './screenHeight'
import InvariantGlobeHero from './InvariantGlobeHero'
import '../styles/figma-fonts.css'
import './FigmaHomepage.css'
import './FigmaMicroInteractions.css'

const asset = (name: string) => `/figma/${name}`
const revealGradient = ['#fb4d03', '#fffaf2', '#80a8c6', '#071b35']

function Corners() {
  return <span className="figma-corners" aria-hidden="true">{['tl', 'tr', 'bl', 'br'].map(corner => <img key={corner} className={corner} src={asset('imgGroup127.svg')} alt="" />)}</span>
}

function Problem() {
  return <div className="figma-problem-track">
    <section className="figma-problem" data-reveal-stage aria-labelledby="figma-problem-title">
    <div className="figma-problem-copy" data-reveal-stage-content>
      <p className="figma-label">The problem</p>
      <BlockReveal as="h2" id="figma-problem-title" className="figma-heading" gradient={revealGradient} mode="scroll" scrollTrack=".figma-problem-track">
        <FigmaType node="6424" live>Satellites, power plants, and data centers can be ready to build while approvals are still unresolved. Across the physical economy, fragmented requirements and scattered evidence leave teams piecing together the path forward.</FigmaType>
      </BlockReveal>
    </div>
    </section>
  </div>
}

const platformSteps = [
  { name: 'Ingest', icon: 'imgArrowsInput.svg', image: 'imgImage60.png', description: 'Bring together your mission data, applicable jurisdictions, regulatory requirements, and existing documentation into one structured foundation.' },
  { name: 'Orchestrate', icon: 'imgAccountTree.svg', image: 'platform-orchestrate.png', description: 'Coordinate the back and forth between regulators, teams, and stakeholders, keeping every step aligned and moving forward.' },
  { name: 'Execute', icon: 'imgArrowOutward.svg', image: 'platform-orchestrate.png', description: 'Turn requirements into action by generating, managing, and filing the regulatory work required for each program.' },
  { name: 'Approve', icon: 'imgDoneAll.svg', image: 'platform-orchestrate.png', description: 'Bring evidence, documentation, and expert oversight together into a clear path toward regulatory approval.' },
]

const platformFrames = [
  { src: asset('imgImage60.png') },
  { src: asset('platform-orchestrate.png'), crop: { width: 255.57, height: 170.4, left: -142.68, top: 7.85 } },
  { src: asset('platform-orchestrate.png'), crop: { width: 255.57, height: 170.4, left: -17.85, top: -74.11 } },
  { src: asset('platform-orchestrate.png'), crop: { width: 266.71, height: 177.83, left: -147.74, top: -81.66 } },
]

function Solution() {
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState(0)
  const [pinned, setPinned] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let pinTop = 0
    let travel = 1
    const measure = () => {
      const mobile = window.innerWidth < 1024
      const header = mobile ? 78 : 0
      const clearance = mobile ? header + 28 : 48
      section.dataset.stageSize = mobile && stage.clientHeight < 520 ? 'short' : 'regular'
      // Two separate questions. Does the stage's content fit the box the
      // stylesheet gave it, and does that box fit the screen? On a phone the box
      // is sized in svh, so it is measured against svh; measuring it against
      // window.innerHeight instead left exactly one pixel of margin, and a
      // retracting address bar moves that number by far more than a pixel.
      const screen = mobile ? smallViewportHeight(section) : window.innerHeight
      const contentFits = stage.scrollHeight <= stage.clientHeight + 1
      const stageFits = stage.getBoundingClientRect().height + clearance <= screen + 1
      const canPin = !preference.matches && contentFits && stageFits
      section.dataset.pinned = String(canPin)
      setPinned(canPin)
      pinTop = mobile ? header + 12 : Math.max(24, Math.min(window.innerHeight * .07, (window.innerHeight - stage.offsetHeight) / 2))
      section.style.setProperty('--platform-pin-top', `${pinTop}px`)
      travel = Math.max(1, section.clientHeight - stage.offsetHeight - parseFloat(getComputedStyle(section).paddingBottom))
    }
    const update = () => {
      frame = 0
      if (section.dataset.pinned !== 'true') return
      const bounds = section.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (pinTop - bounds.top) / travel))
      const rawPosition = progress * (platformSteps.length - 1)
      // Account for browser scroll rounding at each exact illustration endpoint.
      const nextPosition = Math.abs(rawPosition - Math.round(rawPosition)) < .002 ? Math.round(rawPosition) : rawPosition
      setPosition(nextPosition)
      setActive(previous => {
        const next = Math.round(nextPosition)
        // Only the copy has a small deadband; the artwork follows every scroll pixel.
        if (next > previous && nextPosition < previous + .55) return previous
        if (next < previous && nextPosition > previous - .55) return previous
        return next
      })
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const resize = () => { measure(); scroll() }
    measure()
    update()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    stage.querySelectorAll('.figma-section-intro, .figma-platform-mobile-summary').forEach(element => observer.observe(element))
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', resize)
    preference.addEventListener('change', resize)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', resize); preference.removeEventListener('change', resize) }
  }, [])
  const select = (index: number) => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (section?.dataset.pinned === 'true' && stage) {
      const top = parseFloat(section.style.getPropertyValue('--platform-pin-top'))
      const travel = Math.max(1, section.clientHeight - stage.offsetHeight - parseFloat(getComputedStyle(section).paddingBottom))
      const destination = section.getBoundingClientRect().top + window.scrollY - top + index / (platformSteps.length - 1) * travel
      scrollFigmaTo(destination)
    } else {
      setActive(index)
      setPosition(index)
    }
  }
  return <section ref={sectionRef} className="figma-solution figma-container" id="platform" aria-labelledby="figma-solution-title">
    <div className="figma-solution-stage" ref={stageRef}>
    <div className="figma-section-intro">
      <div><p className="figma-label">The solution</p><BlockReveal as="h2" id="figma-solution-title" className="figma-heading" gradient={revealGradient} lineStagger={.16}><BrandHeading names={['solution-requirements', 'solution-action']} /></BlockReveal></div>
      <p className="figma-body">Invariant connects your project data, regulatory requirements, evidence, and filings in one workflow, with expert oversight from the first determination through approval.</p>
    </div>
    <div className="figma-platform" data-active={active}>
      <div className="figma-platform-grid figma-platform-grid-left" aria-hidden="true" />
      <div className="figma-platform-grid figma-platform-grid-right" aria-hidden="true" />
      <div className="figma-platform-art" aria-hidden="true"><DitherMorph frames={platformFrames} active={active} position={pinned ? position : undefined} /></div>
      <div className="figma-platform-mobile-summary">
        {platformSteps.map((step, index) => <div key={step.name} id={`platform-mobile-description-${index}`} className={`figma-platform-mobile-description ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index}>
          <div className="figma-platform-mobile-heading"><img src={asset(step.icon)} alt="" width="24" height="24" /><h3 className="figma-card-heading">{step.name}</h3><span className="figma-label">0{index + 1} / 04</span></div>
          <p className="figma-body">{step.description}</p>
        </div>)}
      </div>
      {platformSteps.map((step, index) => <button type="button" key={step.name} className={`figma-platform-step figma-platform-step-${index} ${active === index ? 'is-active' : ''}`} aria-expanded={active === index} aria-controls={`platform-description-${index} platform-mobile-description-${index}`} onClick={() => select(index)}>
        {active === index && <Corners />}
        <img className="figma-platform-icon" src={asset(step.icon)} alt="" width="40" height="40" />
        <span className="figma-card-heading"><FigmaType node={(['6479', '6501', '6489', '6510'] as const)[index]}>{step.name}</FigmaType></span>
        <span className="figma-body" id={`platform-description-${index}`} hidden={active !== index}>{step.description}</span>
      </button>)}
    </div>
    </div>
  </section>
}

// Each entry carries its own heading outline and its own window onto the shared
// artwork sheet, so the cards can be reordered without the art drifting.
const audiences = [
  { label: 'Space', title: 'From Ground to Orbit', description: 'Navigate complex regulatory requirements across missions, systems, and launch operations.', href: '/space-compliance', crop: 'space', node: '6562', frame: { width: 191.49, height: 201.85, left: 0, top: 0 }, alt: 'Blue dithered satellite in orbit' },
  { label: 'Data Centers', title: 'Always-On Infrastructure', description: 'Keep critical infrastructure compliant across systems, operations, and evolving regulations.', href: '/data-center-compliance', crop: 'data', node: '6538', frame: { width: 191.49, height: 201.85, left: -5.24, top: -92.44 }, alt: 'Blue dithered data center server racks' },
  { label: 'Energy', title: 'Safety by Design', description: 'Manage rigorous compliance requirements with traceable evidence and expert oversight.', href: '/nuclear-compliance', crop: 'nuclear', node: '6570', frame: { width: 191.49, height: 201.85, left: -91.42, top: 0 }, alt: 'Blue dithered nuclear power station' },
  { label: 'Oil & Gas', title: 'Built for High Stakes', description: 'Coordinate regulatory requirements across complex assets, operations, and safety-critical environments.', href: '/oil-gas-compliance', crop: 'oil', node: '6545', frame: { width: 191.49, height: 201.85, left: -91.57, top: -92.44 }, alt: 'Blue dithered offshore oil platform' },
] as const

function AudienceCard({ audience }: { audience: typeof audiences[number] }) {
  const hover = useDitherHover()
  return <Link to={audience.href} className={`figma-audience-card figma-audience-${audience.crop}`} {...hover.bind}>
    <Corners />
    <p className="figma-label">{audience.label}</p>
    <h3 className="figma-card-heading"><FigmaType node={audience.node} live={audience.crop === 'space'}>{audience.title}</FigmaType></h3>
    <p className="figma-body">{audience.description}</p>
    <div className="figma-audience-art dither-tint-host">
      <img src={asset('imgAudiencevisualsUpdate2.png')} alt={audience.alt} loading="lazy" />
      <DitherTint src={asset('imgAudiencevisualsUpdate2.png')} crop={audience.frame} active={hover.active} />
    </div>
  </Link>
}

function Audience() {
  return <section className="figma-audience figma-container" id="capabilities" aria-labelledby="figma-audience-title">
    <div className="figma-audience-intro">
      <p className="figma-label">The audience</p>
      <BlockReveal as="h2" id="figma-audience-title" className="figma-heading" gradient={revealGradient}><FigmaType node="6532">Built for the work<br />that cannot afford to fail.</FigmaType></BlockReveal>
      <p className="figma-body">For the teams building and operating the physical economy, from satellites and power plants to data centers and industrial infrastructure.</p>
    </div>
    <div className="figma-audience-grid">
      {audiences.map(audience => <AudienceCard key={audience.label} audience={audience} />)}
    </div>
  </section>
}

export default function FigmaHomepage() {
  return <div className="figma-home" id="top">
    <FigmaSmoothScroll />
    <a className="figma-skip-link" href="#platform">Skip to content</a>
    <InvariantGlobeHero />
    <Problem />
    <Solution />
    <Audience />
    <FigmaLowerSections />
  </div>
}
