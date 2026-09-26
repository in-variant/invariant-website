import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BlockReveal from './BlockReveal'
import FigmaType from './FigmaType'
import FigmaScrambleLabel from './FigmaScrambleLabel'
import DitherMorph from './DitherMorph'
import CareersCallout from './CareersCallout'
import { scrollFigmaTo } from './FigmaSmoothScroll'
import './FigmaLowerSections.css'

const asset = (name: string) => `/figma/${name}`
const headingGradient = ['#fb4d03', '#fffaf2', '#80a8c6', '#071b35']
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const workflowCrops = [
  { width: 266.25, height: 140.53, left: -5.49, top: -8.08 },
  { width: 266.25, height: 140.53, left: -78.19, top: -8.08 },
  { width: 266.25, height: 140.53, left: -161.04, top: -8.08 },
]
const workflowFrames = [
  [{ src: transparentPixel }, { src: asset('imgHowItWorksDither1.png'), crop: workflowCrops[0] }],
  [{ src: transparentPixel }, { src: asset('imgHowItWorksDither2.png'), crop: workflowCrops[1] }],
  [{ src: transparentPixel }, { src: asset('imgHowItWorksDither1.png'), crop: workflowCrops[2] }],
]
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }
const frameProgress = (value: number) => value < .002 ? 0 : value > .998 ? 1 : value

/** Natural document scrolling supplies the dwell time; short screens stay unpinned. */
function useLowerScrollStage(travelVh: number, update: (progress: number, paced: boolean, motion: boolean) => void, mobileTravelVh?: number) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const callback = useRef(update)
  callback.current = update
  const [paced, setPaced] = useState(false)
  const [motion, setMotion] = useState(false)
  const [compact, setCompact] = useState(false)
  const [mobile, setMobile] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const preference = window.matchMedia(mobileTravelVh ? '(prefers-reduced-motion: no-preference)' : '(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    // svh remains stable while a phone's address bar opens or closes. Keep the
    // same geometry for fitting, sticky placement, and the scroll distance.
    const viewportProbe = document.createElement('div')
    viewportProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;contain:strict;'
    viewportProbe.setAttribute('aria-hidden', 'true')
    document.body.appendChild(viewportProbe)
    const supportsSmallViewport = CSS.supports('height', '100svh')
    let fallbackWidth = window.innerWidth
    let fallbackHeight = window.innerHeight
    let frame = 0
    let measureFrame = 0
    let stickyTop = 0
    let travel = 1
    let enabled = false

    const render = () => {
      frame = 0
      const progress = clamp((stickyTop - section.getBoundingClientRect().top) / travel)
      callback.current(progress, enabled, preference.matches)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render) }
    const measure = () => {
      measureFrame = 0
      const small = window.innerWidth < 1024
      const workflow = section.classList.contains('figma-workflow')
      if (window.innerWidth !== fallbackWidth) {
        fallbackWidth = window.innerWidth
        fallbackHeight = window.innerHeight
      }
      const viewportHeight = small
        ? (supportsSmallViewport ? viewportProbe.getBoundingClientRect().height : fallbackHeight)
        : window.innerHeight
      const topInset = small ? 90 : 8
      const availableHeight = viewportHeight - (small ? topInset : 0) - 16
      section.style.setProperty('--stage-viewport-height', `${viewportHeight}px`)
      section.dataset.stageSize = viewportHeight <= 620 ? 'short' : viewportHeight <= 740 ? 'tight' : 'regular'
      // Measure the two-slot composition, not the full accessible fallback list.
      if (workflow) section.classList.toggle('is-measuring', preference.matches)
      setMobile(small)
      let compactLayout = Boolean(mobileTravelVh && small && preference.matches)
      if (mobileTravelVh) {
        // Measure the compact composition before committing it; zoomed or short
        // screens fall back to complete cards in the normal document flow.
        section.classList.toggle('is-compact', compactLayout)
        if (compactLayout && stage.getBoundingClientRect().height > availableHeight) {
          compactLayout = false
          section.classList.remove('is-compact')
        }
      }
      const height = stage.getBoundingClientRect().height
      setCompact(compactLayout)
      enabled = preference.matches && (!small || compactLayout) && height <= availableHeight
      if (workflow) {
        section.classList.toggle('is-paced', enabled)
        section.classList.remove('is-measuring')
      }
      stickyTop = small ? topInset : Math.max(8, Math.min(64, (viewportHeight - height) / 2))
      travel = viewportHeight * (compactLayout ? mobileTravelVh! : travelVh)
      section.style.setProperty('--stage-height', `${height}px`)
      section.style.setProperty('--stage-top', `${stickyTop}px`)
      section.style.setProperty('--stage-travel', `${travel}px`)
      setPaced(enabled)
      setMotion(preference.matches)
      schedule()
    }
    const scheduleMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(stage)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    preference.addEventListener('change', scheduleMeasure)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measureFrame)
      observer.disconnect()
      viewportProbe.remove()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', scheduleMeasure)
      preference.removeEventListener('change', scheduleMeasure)
    }
  }, [travelVh, mobileTravelVh])

  return { sectionRef, stageRef, paced, motion, compact, mobile }
}

function Corners({ className = '' }: { className?: string }) {
  return (
    <span className={`figma-lower-corners ${className}`} aria-hidden="true">
      <img className="corner-tl" src={asset('imgGroup127.svg')} alt="" />
      <img className="corner-tr" src={asset('imgGroup176.svg')} alt="" />
      <img className="corner-bl" src={asset('imgGroup127.svg')} alt="" />
      <img className="corner-br" src={asset('imgGroup176.svg')} alt="" />
    </span>
  )
}

function WorkflowOutline({ progress }: { progress: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const gradientId = `workflow-outline-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [size, setSize] = useState({ width: 861, height: 355 })
  useLayoutEffect(() => {
    const card = ref.current?.parentElement
    if (!card) return
    const measure = () => {
      const { width, height } = card.getBoundingClientRect()
      setSize(previous => previous.width === width && previous.height === height ? previous : { width, height })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    measure()
    return () => observer.disconnect()
  }, [])
  return <svg ref={ref} className="figma-workflow-outline" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false" data-progress={progress}>
    <defs><linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
      {headingGradient.map((color, index) => <stop key={color} offset={`${index / (headingGradient.length - 1) * 100}%`} stopColor={color} />)}
    </linearGradient></defs>
    <path d={`M.5 .5 H${size.width - .5} V${size.height - .5} H.5 Z`} pathLength="1" stroke={`url(#${gradientId})`} strokeDasharray="1" strokeDashoffset={1 - progress} vectorEffect="non-scaling-stroke" />
  </svg>
}

const workflowItems = [
  {
    label: 'Integrate data',
    title: <FigmaType node="6818">Integrate<br />your data</FigmaType>,
    description: 'A Forward Deployed Engineer visits your office and builds integrations into your ERP, datalake, and other systems — so your data flows seamlessly into the platform.',
    image: 'imgHowItWorksDither1.png', imageClass: 'integrate',
    alt: 'Connected business systems feeding one secure platform',
    caption: 'Your systems.One secure flow.',
  },
  {
    label: 'Generate documents',
    title: <FigmaType node="6845">Generate regulatory<br />documents.</FigmaType>,
    description: 'The platform uses your integrated data to build and file regulatory documents, tailored to each program’s requirements.',
    image: 'imgHowItWorksDither2.png', imageClass: 'documents',
    alt: 'A set of generated regulatory documents',
    caption: 'From data to documents.',
  },
  {
    label: 'Orchestrate approvals',
    title: <>Orchestrate<br />approvals.</>,
    description: 'Invariant coordinates filings, responses, and expert review, keeping every requirement and decision connected as your program moves toward approval.',
    image: 'imgHowItWorksDither1.png', imageClass: 'approval',
    alt: 'Regulators, teams, documents, and review connected through Invariant',
    caption: 'One coordinated path to approval.',
  },
]

function HowItWorks() {
  const connectorGradientId = `workflow-transfer-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const stepsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)
  const [phase, setPhase] = useState('integrate')
  const [revealProgress, setRevealProgress] = useState([0, 0, 0])
  const [hidden, setHidden] = useState([false, false, false])
  const { sectionRef, stageRef, paced, motion, compact } = useLowerScrollStage(2.5, (progress, pinned, canAnimate) => {
    const steps = stepsRef.current
    if (!steps) return
    const cards = [...steps.querySelectorAll<HTMLElement>('.figma-workflow-card')]
    const compactMode = pinned && steps.closest('.figma-workflow')?.classList.contains('is-compact')
    const firstTransfer = frameProgress(clamp((progress - .16) / .14))
    const shift = ease(clamp((progress - .54) / .18))
    const finalTransfer = frameProgress(clamp((progress - .72) / .12))
    // Each phase is a pure function of scroll position, including its reversal.
    const fills = pinned
      ? [clamp(progress / .16), clamp((progress - .30) / .18), clamp((progress - .84) / .14)].map(frameProgress)
      : cards.map(card => !canAnimate ? 1 : frameProgress(clamp((innerHeight * .82 - card.getBoundingClientRect().top) / Math.max(1, Math.min(card.offsetHeight * .6, innerHeight * .4)))))
    const mobileFirst = ease(firstTransfer)
    const visibility = !pinned ? [1, 1, 1] : compactMode
      ? [1 - ease(mobileFirst * 2), ease((mobileFirst - .45) / .55) * (1 - ease(shift * 2)), ease((shift - .45) / .55)]
      : [1 - ease(shift / .18), 1, ease((shift - .18) / .62)]
    const hiddenCards = visibility.map(value => value < .002)
    cards.forEach((card, index) => {
      card.style.setProperty('--card-opacity', String(visibility[index] * (.38 + .62 * ease(fills[index]))))
      card.style.setProperty('--mobile-offset', String(index - mobileFirst - shift))
    })
    const connector = progress < .63 ? firstTransfer : finalTransfer
    const connectorOpacity = progress < .63 ? 1 - ease((progress - .52) / .045) : ease((progress - .70) / .04)
    steps.style.setProperty('--workflow-shift', String(pinned && !compactMode ? shift : 0))
    steps.style.setProperty('--connector-opacity', String(!pinned ? 1 : connectorOpacity))
    steps.style.setProperty('--connector-progress', String(!pinned ? 1 : connector))
    steps.style.setProperty('--packet-x', `${clamp(connector / .625) * 100}%`)
    steps.style.setProperty('--packet-y', `${clamp((connector - .625) / .375) * 100}%`)
    steps.style.setProperty('--packet-angle', connector < .625 ? '0deg' : '90deg')
    steps.style.setProperty('--packet-opacity', String(pinned ? clamp(connector / .035) * clamp((1 - connector) / .045) : 0))
    steps.parentElement?.style.setProperty('--workflow-progress', String(!canAnimate ? 1 : progress))
    steps.parentElement?.style.setProperty('--workflow-outbound-opacity', String(fills[2]))
    setActive(!pinned ? (fills[2] > 0 ? 2 : fills[1] > 0 ? 1 : fills[0] > 0 ? 0 : -1) : compactMode ? (shift >= .5 ? 2 : mobileFirst >= .5 ? 1 : fills[0] > 0 ? 0 : -1) : progress >= .84 ? 2 : progress >= .30 ? 1 : fills[0] > 0 ? 0 : -1)
    setPhase(progress < .16 ? 'integrate' : progress < .30 ? 'transfer-to-documents' : progress < .54 ? 'documents' : progress < .72 ? 'advance' : progress < .84 ? 'transfer-to-approval' : 'approval')
    setRevealProgress(previous => fills.every((value, index) => value === previous[index]) ? previous : fills)
    setHidden(previous => hiddenCards.every((value, index) => value === previous[index]) ? previous : hiddenCards)
  }, 3)

  const selectStep = (index: number) => {
    const section = sectionRef.current
    if (paced && section) {
      const style = getComputedStyle(section)
      const start = window.scrollY + section.getBoundingClientRect().top - parseFloat(style.getPropertyValue('--stage-top'))
      const travel = parseFloat(style.getPropertyValue('--stage-travel'))
      scrollFigmaTo(start + travel * [.16, .48, .98][index])
    }
  }

  return (
    <section ref={sectionRef} id="how-it-works" className={`figma-workflow${paced ? ' is-paced' : ''}${compact ? ' is-compact' : ''}${motion ? ' has-morph' : ''}`} data-active-step={active} data-phase={phase} aria-labelledby="workflow-heading">
      <div ref={stageRef} className="figma-lower-container figma-workflow-stage">
        <header className="figma-workflow-intro">
          <p className="figma-lower-label">How it works</p>
          <BlockReveal as="h2" id="workflow-heading" className="figma-lower-heading" gradient={headingGradient}>
            <FigmaType node="6812">From integration<br />to approval.</FigmaType>
          </BlockReveal>
          <p className="figma-lower-body">We connect your systems, generate the right documents,<br className="figma-desktop-break" /> and orchestrate the entire process — so you can focus on the mission.</p>
        </header>
        <nav className="figma-workflow-controls" aria-label="Integration to approval steps">
          {workflowItems.map((item, index) => (
            <button type="button" key={item.label} aria-current={active === index ? 'step' : undefined} aria-controls={`workflow-step-${index}`} onClick={() => selectStep(index)}>
              <span>00{index + 1}</span>{item.label}
            </button>
          ))}
          <span className="figma-workflow-mobile-track" aria-hidden="true"><i /></span>
        </nav>
        {paced && !compact && <ol className="sr-only" aria-label="From integration to approval">
          {workflowItems.map(item => <li key={item.label}><h3>{item.label}</h3><p>{item.description}</p></li>)}
        </ol>}
        <div ref={stepsRef} className="figma-workflow-steps">
          <div className="figma-workflow-track" aria-hidden={paced && !compact ? true : undefined}>
            {workflowItems.map((item, index) => <article key={item.imageClass} id={`workflow-step-${index}`} className={`figma-workflow-card figma-workflow-card-${item.imageClass}`} aria-hidden={paced && hidden[index] ? true : undefined}>
              <Corners />
              <WorkflowOutline progress={revealProgress[index]} />
              <div className="figma-workflow-copy">
                <p className="figma-lower-label">00{index + 1}</p>
                <h3 className="figma-lower-subheading">{item.title}</h3>
                <p className="figma-lower-body">{item.description}</p>
              </div>
              <figure className="figma-workflow-figure">
                <div className={`figma-workflow-image figma-workflow-image-${item.imageClass}`}>
                  <img src={asset(item.image)} alt={item.alt} loading="lazy" />
                  {motion && <DitherMorph frames={workflowFrames[index]} active={Math.round(revealProgress[index])} position={revealProgress[index]} className="figma-workflow-morph" />}
                </div>
                <figcaption>{item.caption}</figcaption>
              </figure>
            </article>)}
          </div>
          <span className="figma-workflow-connector" aria-hidden="true">
            <img className="figma-workflow-connector-track" src={asset('imgGroup284.svg')} alt="" />
            <svg className="figma-workflow-connector-progress" viewBox="0 0 432 259" preserveAspectRatio="none">
              <defs><linearGradient id={connectorGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                {headingGradient.map((color, index) => <stop key={color} offset={`${index / (headingGradient.length - 1) * 100}%`} stopColor={color} />)}
              </linearGradient></defs>
              <path d="M0 .5 H431.5 V259" pathLength="1" style={{ stroke: `url(#${connectorGradientId})` }} />
            </svg>
            <span className="figma-workflow-packet"><i /><i /><i /><i /><i /></span>
          </span>
        </div>
        <img className="figma-workflow-outbound" src={asset('imgGroup285.svg')} alt="" aria-hidden="true" />
      </div>
    </section>
  )
}

const safetyItems = [
  {
    title: <>Runs inside<br />your perimeter</>,
    description: 'Bring together your mission data, applicable jurisdictions, regulatory requirements, and existing documentation into one structured foundation.',
    image: 'imgDataSafetyDither3.png',
    imageClass: 'perimeter',
    alt: 'Secure servers contained within a private network perimeter',
    caption: 'Your VPC → No data leaves',
  },
  {
    title: <>Model-agnostic<br />by design</>,
    description: 'Run the right models for your environment. Use open-weight models inside your perimeter for export-controlled programs, or work with approved frontier models under your existing infrastructure and agreements.',
    image: 'imgDataSafetyModels.png',
    imageClass: 'models',
    alt: 'A stack of model providers inside your environment',
    caption: 'Flexible models. Your environment.',
  },
  {
    title: <>Everything<br />on record</>,
    description: 'Every action, decision, and document is captured in an immutable audit trail, giving your team complete traceability across the regulatory process.',
    image: 'imgDataSafetyAudit.png',
    imageClass: 'audit',
    alt: 'Verified documents with a complete audit record',
    caption: 'Full traceability. Built in.',
  },
]

// Normalize all three Figma crop viewports to one persistent 419 × 360 canvas.
const safetyFrames = [
  { src: asset('imgDataSafetyDither3.png'), crop: { width: 267.36, height: 132.7901, left: 0, top: -11.5578 } },
  { src: asset('imgDataSafetyModels.png'), crop: { width: 245.7565, height: 121.94, left: -68.6842, top: 0 } },
  { src: asset('imgDataSafetyAudit.png'), crop: { width: 276.8883, height: 137.45, left: -174.6443, top: -17.45 } },
]

function DataSafety() {
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  const { sectionRef, stageRef, paced, motion, compact, mobile } = useLowerScrollStage(1.5, (progress, pinned) => {
    const table = tableRef.current
    if (!table) return
    table.style.setProperty('--safety-progress', String(pinned ? Math.max(.015, progress) : (active + 1) / 3))
    if (pinned) {
      const rawPosition = progress * (safetyFrames.length - 1)
      const nearestFrame = Math.round(rawPosition)
      const nextPosition = Math.abs(rawPosition - nearestFrame) < .002 ? nearestFrame : rawPosition
      table.querySelectorAll<HTMLElement>('.figma-safety-row').forEach((row, index) => {
        // The copy fades out before the next description resolves. Both
        // directions use the same scroll value rather than a timed replay.
        row.style.setProperty('--safety-row-opacity', String(ease((.5 - Math.abs(nextPosition - index)) / .16)))
      })
      setPosition(nextPosition)
      setActive(previous => {
        // Keep the nearest image's copy readable when a trackpad settles at a
        // midpoint; the artwork itself follows every scroll update directly.
        if (Math.abs(nextPosition - previous) <= .52) return previous
        return Math.round(nextPosition)
      })
    }
  }, 2.4)
  const expandAll = mobile && !compact
  const morph = motion && (!mobile || compact)
  const scrubLayout = paced && !mobile
  const rowHeights = safetyItems.map((_, index) => 185 + 175 * Math.max(0, 1 - Math.abs(position - index)))

  useLayoutEffect(() => {
    if (!compact) return
    const focused = document.activeElement
    const departingRow = focused instanceof HTMLElement ? focused.closest('.figma-safety-row[aria-hidden="true"]') : null
    if (departingRow && tableRef.current?.contains(departingRow)) {
      sectionRef.current?.querySelector<HTMLButtonElement>('.figma-safety-controls [aria-current="step"]')?.focus({ preventScroll: true })
    }
  }, [active, compact, sectionRef])

  const selectItem = (index: number) => {
    const section = sectionRef.current
    if (paced && section) {
      const style = getComputedStyle(section)
      const start = window.scrollY + section.getBoundingClientRect().top - parseFloat(style.getPropertyValue('--stage-top'))
      const travel = parseFloat(style.getPropertyValue('--stage-travel'))
      scrollFigmaTo(start + travel * index / (safetyFrames.length - 1))
    } else {
      setActive(index)
      tableRef.current?.style.setProperty('--safety-progress', String((index + 1) / 3))
    }
  }

  return (
    <section ref={sectionRef} id="data-safety" className={`figma-safety${paced ? ' is-paced' : ''}${compact ? ' is-compact' : ''}${expandAll ? ' is-stacked' : ''}${morph ? ' has-morph' : ''}`} data-active-step={active} aria-labelledby="safety-heading">
      <div ref={stageRef} className="figma-lower-container figma-safety-stage">
        <header className="figma-safety-intro">
          <div>
            <p className="figma-lower-label">Data safety</p>
            <BlockReveal as="h2" id="safety-heading" className="figma-lower-heading" gradient={headingGradient}>
              <FigmaType node="6612">Your data stays<br />where it belongs.</FigmaType>
            </BlockReveal>
          </div>
          <p className="figma-lower-body">Secure by design. Built for the world’s most stringent environments.</p>
        </header>
        <nav className="figma-safety-controls" aria-label="Data safety principles">
          {['Perimeter', 'Models', 'Audit trail'].map((label, index) => (
            <button type="button" key={label} aria-current={active === index ? 'step' : undefined} aria-controls={`safety-panel-${index}`} onClick={() => selectItem(index)}>
              <span>00{index + 1}</span>{label}
            </button>
          ))}
        </nav>
        <div ref={tableRef} className="figma-safety-table">
          <div className="figma-safety-progress" aria-hidden="true">
            <img src={asset('imgRectangle51.png')} alt="" />
          </div>
          {safetyItems.map((item, index) => (
            <div className={`figma-safety-row${active === index ? ' is-active' : ''}`} key={item.imageClass} aria-hidden={compact && active !== index ? true : undefined} style={scrubLayout ? { height: `calc(${rowHeights[index]} * var(--u))` } : undefined}>
              <Corners />
              <h3 className="figma-safety-row-heading">
                <button
                  type="button"
                  id={`safety-trigger-${index}`}
                  className="figma-safety-trigger"
                  aria-expanded={expandAll || active === index}
                  aria-controls={`safety-panel-${index}`}
                  disabled={expandAll}
                  tabIndex={compact && active !== index ? -1 : undefined}
                  onClick={() => selectItem(index)}
                >
                  <span className="figma-lower-label">[00{index + 1}]</span>
                  <span className="figma-lower-subheading"><FigmaType node={(['6620', '6671', '6675'] as const)[index]}>{item.title}</FigmaType></span>
                </button>
              </h3>
              <div className="figma-safety-panel" id={`safety-panel-${index}`} role="region" aria-labelledby={`safety-trigger-${index}`} hidden={!compact && !expandAll && active !== index}>
                <div className="figma-safety-description">
                  <Corners className="figma-divider-corners" />
                  <p className="figma-lower-body">{item.description}</p>
                </div>
                <figure className={`figma-safety-figure figma-safety-figure-${item.imageClass}`}>
                  <Corners className="figma-divider-corners" />
                  <div className="figma-safety-image">
                    <img src={asset(item.image)} alt={item.alt} loading="lazy" />
                  </div>
                  <figcaption style={scrubLayout ? { transform: `translateY(calc(${position * 185 + 360 - rowHeights.slice(0, index + 1).reduce((total, height) => total + height, 0)} * var(--u)))` } : undefined}>{item.caption}</figcaption>
                </figure>
              </div>
            </div>
          ))}
          {morph && <div className="figma-safety-shared-art" style={{ transform: `translateY(calc(${(paced ? position : active) * 185} * var(--u)))` }} aria-hidden="true">
            <DitherMorph frames={safetyFrames} active={active} position={paced ? position : undefined} className="figma-safety-morph" />
          </div>}
        </div>
      </div>
    </section>
  )
}

const footerColumns = [
  { title: 'Platform', links: [
    ['Overview', '/product'], ['Ingest', '/product'], ['Execute', '/product'],
    ['Orchestrate', '/product'], ['Approve', '/product'], ['Security', '#data-safety'],
  ] },
  { title: 'Use cases', links: [
    ['Space', '/space-compliance'], ['Energy', '/nuclear-compliance'],
    ['Data Centers', '/data-center-compliance'], ['Oil & Gas', '/oil-gas-compliance'],
  ] },
  { title: 'Company', links: [
    ['Why we exist', '/charter'], ['About', '/about'], ['Careers', '/careers'],
    ['Resources', '/resources'], ['Contact', '/contact'],
  ] },
  { title: 'Legal', links: [
    ['Privacy', 'mailto:founders@invariant-ai.com?subject=Privacy%20policy%20request'],
    ['Terms', 'mailto:founders@invariant-ai.com?subject=Terms%20of%20service%20request'],
    ['Security', '/trust'], ['Compliance', '/compliance'],
  ] },
]

function MissionFooter() {
  return (
    <div className="figma-ending">
      <div className="figma-lower-container">
        <section className="figma-next-step" aria-labelledby="next-step-heading">
          <img className="figma-ending-topline" src={asset('imgGroup259.svg')} alt="" aria-hidden="true" />
          <div className="figma-next-step-art" aria-hidden="true">
            <img src={asset('imgImage65.png')} alt="" loading="lazy" />
          </div>
          <div className="figma-next-step-copy">
            <p className="figma-lower-label">Next step</p>
            <BlockReveal as="h2" id="next-step-heading" className="figma-next-step-heading" gradient={headingGradient}>
              <FigmaType node="6712">Build bolder<br />missions together.</FigmaType>
            </BlockReveal>
            <p className="figma-next-step-description">See how Invariant can streamline regulatory execution<br className="figma-desktop-break" /> for your most critical programs.</p>
            <div className="figma-next-step-actions">
              <Link to="/contact" className="figma-lower-button"><FigmaScrambleLabel>Take the next step</FigmaScrambleLabel></Link>
              <a href="#how-it-works" className="figma-lower-button figma-lower-button-secondary">
                <FigmaScrambleLabel>See how it works</FigmaScrambleLabel>
                <Corners />
              </a>
            </div>
          </div>
        </section>
        <CareersCallout />
        <footer className="figma-site-footer">
          <img className="figma-footer-topline" src={asset('imgGroup260.svg')} alt="" aria-hidden="true" />
          <div className="figma-footer-content">
            <div className="figma-footer-brand">
              <a href="#top" className="figma-footer-logo" aria-label="Invariant home">
                <span className="figma-footer-logomark">
                  <img src={asset('imgGroup114.svg')} alt="" />
                  <img src={asset('imgGroup114.svg')} alt="" />
                </span>
                <img className="figma-footer-wordmark" src={asset('imgInvariant1.svg')} alt="Invariant" />
              </a>
              <p>connecting mission, requirements,<br />evidence, and expert oversight<br />into a continuous path from<br />mission to approval.</p>
            </div>
            {footerColumns.map(column => (
              <nav className="figma-footer-column" key={column.title} aria-label={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith('/') ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <img className="figma-footer-bottomline" src={asset('imgGroup261.svg')} alt="" aria-hidden="true" />
        </footer>
        <p className="figma-footer-copyright">© 2026 Invariant. All rights reserved.</p>
      </div>
    </div>
  )
}

export default function FigmaLowerSections() {
  return <><HowItWorks /><DataSafety /><MissionFooter /></>
}
