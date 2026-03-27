import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  render: () => React.ReactNode
}

function SlideShell({
  children,
  dark,
  align = 'center',
}: {
  children: React.ReactNode
  dark?: boolean
  /** `start` keeps tall slides (e.g. training flow) scrollable from the top */
  align?: 'center' | 'start'
}) {
  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col px-12 md:px-20 lg:px-32 xl:px-40 py-16 ${
        align === 'start' ? 'justify-start' : 'justify-center'
      } ${dark ? 'bg-ink text-white' : 'bg-white text-ink'}`}
    >
      {children}
    </div>
  )
}

function SlideLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-8 ${
        dark ? 'text-white/50' : 'text-ink/50'
      }`}
    >
      {children}
    </p>
  )
}

const INDUSTRIES = [
  { name: 'Nuclear', color: '#C4820E', frameworks: '10 CFR · NRC SRP · NUREG' },
  { name: 'Aerospace', color: '#5C6370', frameworks: 'DO-178C · DO-254 · FAA / EASA' },
  { name: 'Drones', color: '#2A9D8F', frameworks: 'DGCA CAR · Type Certification' },
  { name: 'Maritime', color: '#3A7CA5', frameworks: 'IMO SOLAS · DNV · Lloyd\'s' },
]

const CAPABILITIES = [
  {
    title: 'Design-Phase Guidance',
    description: 'Surfaces regulatory constraints during early engineering, before they become costly rework.',
  },
  {
    title: 'Citation Integrity',
    description: 'Every claim traces back to a source. The daisy-chain of references is verified, not assumed.',
  },
  {
    title: 'Regulatory Fluency',
    description: 'Trained on the acceptance criteria for your domain, not just the words in the standard.',
  },
  {
    title: 'Review-Readiness',
    description: 'Output is structured to survive regulatory scrutiny, not just pass a human read.',
  },
]

const COST_FACTS = [
  { figure: '$1.1B', label: 'Vogtle Units 3 & 4 cost overrun driven by licensing delays' },
  { figure: '$20B+', label: 'Boeing 737 MAX return-to-service documentation rework' },
  { figure: '7 years', label: 'NRC\'s first advanced reactor design certification review' },
  { figure: '3,000+', label: 'Pages in a standard Preliminary Safety Analysis Report' },
]

const AUDIENCES = [
  { label: 'Engineering Teams', description: 'Regulatory awareness from first sketch to final submission.' },
  { label: 'Licensing Consultants', description: 'Author safety cases and compliance documentation faster.' },
  { label: 'Program Leadership', description: 'Manage the intersection of engineering and regulatory timelines.' },
]

interface PipelineStage {
  label: string
  color: string
  body: string
  tags: readonly string[]
  highlight?: boolean
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    label: 'Corpus',
    color: '#C4820E',
    body: 'CFR, NUREG, review guides, PSAR patterns, and customer design-basis docs — with version and jurisdiction metadata.',
    tags: ['10 CFR', 'NUREG', 'RG 1.157'],
  },
  {
    label: 'Ingest & Structure',
    color: '#C4820E',
    body: 'Every chunk maps to a document, section, and revision. No anonymous paragraphs.',
    tags: ['Provenance', 'Chunking'],
  },
  {
    label: 'Expert Grounding',
    color: '#3A7CA5',
    body: 'SME review, citation verification, acceptance-criteria alignment — humans in the loop.',
    tags: ['SME review', 'Citation QA'],
  },
  {
    label: 'Training',
    color: '#2A9D8F',
    body: 'SFT and preference optimisation — outputs tuned for defensibility over fluency.',
    tags: ['SFT', 'Preferences', 'Citations'],
    highlight: true,
  },
  {
    label: 'Evaluation',
    color: '#5C6370',
    body: 'Hallucination and citation-integrity suites, domain benchmarks, regression gates.',
    tags: ['Benchmarks', 'Regression'],
  },
  {
    label: 'Ship',
    color: '#5C6370',
    body: 'RAG inference, policy guardrails, and drift monitoring in production.',
    tags: ['RAG', 'Guardrails', 'Drift QA'],
  },
]

function TrainingFlowDiagram() {
  return (
    <div className="w-full flex items-stretch gap-0 select-none">
      {PIPELINE_STAGES.map((stage, i) => (
        <div key={stage.label} className="flex items-stretch flex-1 min-w-0">
          {/* Card */}
          <div
            className="flex-1 rounded-lg border flex flex-col px-3 py-4 md:px-4 md:py-5 gap-3 min-w-0"
            style={{
              borderColor: `${stage.color}${stage.highlight ? '70' : '35'}`,
              backgroundColor: `${stage.color}${stage.highlight ? '10' : '07'}`,
            }}
          >
            {/* Divider-rail header — same visual language as Hero */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-px flex-1 min-w-0" style={{ backgroundColor: `${stage.color}45` }} />
              <span
                className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-medium shrink-0 leading-none text-center"
                style={{ color: stage.color }}
              >
                {stage.label}
              </span>
              <div className="h-px flex-1 min-w-0" style={{ backgroundColor: `${stage.color}45` }} />
            </div>

            <p className="font-mono text-[10px] md:text-xs leading-relaxed text-ink/65 flex-1 min-w-0">
              {stage.body}
            </p>

            <div className="flex flex-wrap gap-1 mt-auto">
              {stage.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] md:text-[10px] tracking-wide uppercase px-1.5 md:px-2 py-0.5 rounded-sm font-medium"
                  style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right-pointing arrow between stages */}
          {i < PIPELINE_STAGES.length - 1 && (
            <div className="flex items-center justify-center w-5 md:w-6 shrink-0">
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                style={{ color: `${stage.color}55` }}
                aria-hidden
              >
                <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <polyline
                  points="9,2 16,7 9,12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const slides: Slide[] = [
  {
    id: 'title',
    render: () => (
      <SlideShell dark>
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="font-mono text-sm tracking-[0.25em] uppercase text-white/40 mb-4">
              Confidential
            </p>
          </div>
          <div>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] font-medium tracking-[-0.04em] text-white mb-8">
              Invariant
            </h1>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white/70 leading-tight tracking-[-0.02em] max-w-2xl">
              Engineering certification,<br />at the speed of design.
            </p>
          </div>
          <div className="flex items-center gap-6 mt-auto pt-16">
            <span className="font-mono text-sm text-white/40">Backed by</span>
            <span className="font-mono text-sm text-white/60 font-medium">Entrepreneurs First</span>
          </div>
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'problem',
    render: () => (
      <SlideShell>
        <SlideLabel>The Problem</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-10 max-w-4xl">
          Regulation touches every phase of engineering. The tools haven't kept up.
        </h2>
        <p className="body-technical max-w-2xl mb-16">
          Regulations don't just gate the final approval. They shape design decisions, constrain material choices, and dictate testing protocols from day one. Yet the tools engineers use to navigate this complexity haven't changed in decades.
        </p>
        <p className="font-serif text-xl md:text-2xl text-ink/60 italic max-w-2xl">
          The documentation is not the afterthought. It is the program.
        </p>
      </SlideShell>
    ),
  },
  {
    id: 'cost',
    render: () => (
      <SlideShell>
        <SlideLabel>The Cost of the Status Quo</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-16 max-w-3xl">
          Billions lost to documentation rework and licensing delays.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-4xl">
          {COST_FACTS.map((fact) => (
            <div key={fact.figure}>
              <p className="font-serif text-4xl md:text-5xl font-medium tracking-[-0.03em] text-ink mb-3">
                {fact.figure}
              </p>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/60">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'solution',
    render: () => (
      <SlideShell dark>
        <SlideLabel dark>The Solution</SlideLabel>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.02em] text-white mb-10 max-w-4xl">
          Language models trained on engineering regulations.
        </h2>
        <p className="font-mono text-base md:text-lg leading-relaxed text-white/60 max-w-2xl mb-16" style={{ fontWeight: 350 }}>
          Invariant builds domain-specific AI that works alongside your team from early R&D through certification. Not a summarizer — an author.
        </p>
        <div className="flex flex-wrap gap-4">
          {['Learning', 'Reasoning', 'Authoring'].map((cap) => (
            <span
              key={cap}
              className="font-mono text-sm tracking-[0.15em] uppercase px-5 py-2.5 rounded border border-white/20 text-white/80"
            >
              {cap}
            </span>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'training',
    render: () => (
      <SlideShell>
        <SlideLabel>How We Train</SlideLabel>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10">
          <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl max-w-xl">
            From corpus to production —<br className="hidden md:block" /> one accountable pipeline.
          </h2>
          <p className="font-mono text-xs md:text-sm text-ink/45 max-w-xs shrink-0 leading-relaxed">
            Sources flow in, experts shape the signal,<br />the model trains with citation discipline.
          </p>
        </div>
        <TrainingFlowDiagram />
      </SlideShell>
    ),
  },
  {
    id: 'prototype',
    render: () => (
      <SlideShell>
        <SlideLabel>Prototype</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8 max-w-4xl">
          A certification workspace, not a chat window.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl items-start">
          <div className="space-y-6">
            <p className="body-technical">
              The live prototype mirrors how licensing teams actually work: structured chapters aligned to NUREG-style
              expectations, an editor with traceable regulatory references, and a copilot that answers from your uploaded
              corpus — not from memory.
            </p>
            <p className="body-technical">
              Inline review threads, chapter status, and file trees tie design basis documents to the narrative under
              construction. The goal is review-ready output, not a one-off summary.
            </p>
          </div>
          <div className="rounded-lg border border-ink/12 bg-ink/[0.02] p-6 md:p-8 space-y-6">
            <div>
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-ink/50 mb-3">In the demo</h3>
              <ul className="font-mono text-sm md:text-base leading-relaxed text-ink/70 space-y-3 list-none">
                <li className="pl-4 border-l-2 border-ink/15">PSAR-style chapter shell with progress and status</li>
                <li className="pl-4 border-l-2 border-ink/15">Rich-text section drafting with inline comments</li>
                <li className="pl-4 border-l-2 border-ink/15">Copilot grounded in CFR / NUREG uploads</li>
                <li className="pl-4 border-l-2 border-ink/15">Design-basis file tree and citation-first responses</li>
              </ul>
            </div>
            <a
              href="/prototype"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wide text-ink border border-ink/20 px-5 py-3 rounded hover:bg-ink/[0.04] transition-colors"
            >
              Open interactive prototype
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'capabilities',
    render: () => (
      <SlideShell>
        <SlideLabel>Capabilities</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-16 max-w-3xl">
          Not a summarizer.<br />An author.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="border-t border-ink/10 pt-6">
              <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-3">
                {cap.title}
              </h3>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/65">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'approach',
    render: () => (
      <SlideShell>
        <SlideLabel>The Approach</SlideLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-5xl">
          <div>
            <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8">
              Grounded in the design. Calibrated to the standard.
            </h2>
          </div>
          <div className="space-y-6 lg:pt-4">
            <p className="body-technical">
              The model ingests design inputs and regulatory frameworks from the start of R&D, not just at the documentation phase. It reasons about which design decisions trigger which regulatory requirements.
            </p>
            <p className="body-technical">
              No hallucination tolerance. No invented citations. The standard is not "helpful." It is "defensible."
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'industries',
    render: () => (
      <SlideShell>
        <SlideLabel>Industries</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-16 max-w-4xl">
          Regulatory intelligence across the engineering lifecycle.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.name}
              className="rounded-lg px-6 py-6 border"
              style={{
                borderColor: `${ind.color}40`,
                backgroundColor: `${ind.color}0A`,
              }}
            >
              <h3
                className="font-mono text-sm tracking-[0.2em] uppercase font-medium mb-3"
                style={{ color: ind.color }}
              >
                {ind.name}
              </h3>
              <p className="font-mono text-sm text-ink/60">
                {ind.frameworks}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'who',
    render: () => (
      <SlideShell>
        <SlideLabel>Who It's For</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-16 max-w-4xl">
          Built for teams where regulation shapes the engineering.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-4xl">
          {AUDIENCES.map((a) => (
            <div key={a.label}>
              <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-4">
                {a.label}
              </h3>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/65">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'traction',
    render: () => (
      <SlideShell>
        <SlideLabel>Traction</SlideLabel>
        <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-16 max-w-3xl">
          Built alongside practitioners.
        </h2>
        <div className="space-y-10 max-w-3xl">
          <div className="border-t border-ink/10 pt-6">
            <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-2">
              Design Partners
            </h3>
            <p className="font-mono text-base text-ink/60">
              InTomes Technical Services · Nuclear technical services and licensing consulting
            </p>
            <p className="font-mono text-base text-ink/60 mt-2">
              Leher · Agricultural drone manufacturer navigating regulatory certification
            </p>
          </div>
          <div className="border-t border-ink/10 pt-6">
            <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-2">
              Advisors
            </h3>
            <p className="font-mono text-base text-ink/60">
              Charles Keller · Nuclear licensing and advanced reactor deployment
            </p>
            <p className="font-mono text-base text-ink/60 mt-2">
              Vivin Rana · Co-Founder @ Leher | Building Drone Spraying Intelligence
            </p>
          </div>
          <div className="border-t border-ink/10 pt-6">
            <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-2">
              Backed By
            </h3>
            <p className="font-mono text-base text-ink/60">
              Entrepreneurs First
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },
  {
    id: 'close',
    render: () => (
      <SlideShell dark>
        <div className="flex flex-col justify-between h-full">
          <div />
          <div>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-[7rem] font-medium tracking-[-0.04em] text-white mb-8">
              Invariant
            </h2>
            <p className="font-serif text-2xl md:text-3xl text-white/60 leading-tight tracking-[-0.02em] max-w-xl mb-12">
              From first design to final approval.
            </p>
            <a
              href="mailto:founders@invariant-ai.com?subject=Partnership Inquiry"
              className="inline-block px-8 py-4 border border-white/30 text-white font-mono text-base tracking-wide hover:bg-white/10 transition-colors"
            >
              founders@invariant-ai.com
            </a>
          </div>
          <div className="flex items-center gap-6 mt-auto pt-16">
            <span className="font-mono text-sm text-white/30">invariant-ai.com</span>
          </div>
        </div>
      </SlideShell>
    ),
  },
]

export default function Deck() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const total = slides.length

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total || next === current) return
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current, total],
  )

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      }
      if (e.key === 'End') {
        e.preventDefault()
        go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next()
        else prev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, prev])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white select-none relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SLIDE_TRANSITION}
          className="absolute inset-0"
        >
          {slides[current].render()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 disabled:opacity-20 transition-opacity"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink/50"
              />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            className="p-2 disabled:opacity-20 transition-opacity"
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink/50"
              />
            </svg>
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-ink/70'
                  : 'w-2 bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>

        <span className="font-mono text-xs text-ink/40 tabular-nums min-w-[3rem] text-right">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  )
}
