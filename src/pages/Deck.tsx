import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  render: () => React.ReactNode
}

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center
        px-5 sm:px-10 md:px-16 lg:px-20
        pt-14 pb-20 sm:pt-16 sm:pb-20 md:pt-18 md:pb-20 lg:pt-20 lg:pb-16
        bg-white text-ink"
    >
      <div className="absolute top-4 sm:top-5 left-5 sm:left-10 md:left-16 lg:left-20 z-10">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/30 font-medium">
          Invariant
        </span>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-4xl">
        {children}
      </div>
    </div>
  )
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-8 text-ink/50">
      {children}
    </p>
  )
}

const PROBLEM_CASES = [
  {
    industry: 'Drones',
    color: '#2A9D8F',
    headline: 'Built a drone. Failed compliance.',
    detail: 'You build the product, submit for type certification, fail the checklist — and can\'t ship to market. Months of engineering, grounded by paperwork.',
  },
  {
    industry: 'Space',
    color: '#5C6370',
    headline: 'Software didn\'t meet DO-178C.',
    detail: 'You build satellite launch vehicles and realise the software requirements didn\'t fulfil DO-178C criteria. Entire project delayed by 10 months.',
  },
  {
    industry: 'Nuclear',
    color: '#C4820E',
    headline: 'Design immaturity cascades.',
    detail: 'You apply for a nuclear plant construction permit and realise the design is immature. The project cascades — Vogtle-style overruns measured in billions.',
  },
]

const COMPETITORS = {
  nuclear: [
    { name: 'Atomic Canyon', detail: 'Nuclear regulatory AI', logo: '/logos/atomic_canyon_logo.jpeg', initial: 'AC', bg: '#C4820E' },
    { name: 'Everstar Inc', detail: 'Nuclear engineering software', logo: '/logos/everstar.png', initial: 'E', bg: '#2A9D8F' },
    { name: 'Nuclearn', detail: 'Nuclear knowledge management', logo: null, initial: 'N', bg: '#3A7CA5' },
  ],
  indirect: [
    { name: 'Flow Engineering', detail: 'Requirements management', logo: '/logos/flow.svg', initial: 'FE', bg: '#6366f1' },
    { name: 'Seamflow', detail: 'Systems engineering workflows', logo: '/logos/seamflow.svg', initial: 'S', bg: '#5C6370' },
    { name: 'Epsilon3', detail: 'Procedure management', logo: null, initial: 'ε3', bg: '#dc2626' },
    { name: 'Aletiq', detail: 'Product lifecycle management', logo: null, initial: 'A', bg: '#0d9488' },
  ],
}

const DESIGN_PARTNERS = [
  {
    name: 'Spantrik',
    domain: 'Space Tech',
    color: '#5C6370',
    logo: '/logos/spantrik.png',
    scope: 'Reusable Launch Vehicles — Testing Authorisation via IN-SPACe',
  },
  {
    name: 'Leher',
    domain: 'Drones',
    color: '#2A9D8F',
    logo: '/logos/leher.jpeg',
    scope: 'Agridrone Type C Certification',
  },
  {
    name: 'InTomes',
    domain: 'Nuclear',
    color: '#C4820E',
    logo: '/logos/intomes.png',
    scope: 'Development and deployment of Invariant AI for compliance with nuclear regulations, codes, and standards.',
  },
]

const PIPELINE_STEPS = [
  { label: 'Goal', color: '#2A9D8F' },
  { label: 'Requirements', color: '#3A7CA5' },
  { label: 'Design', color: '#5C6370' },
  { label: 'Implementation', color: '#6366f1' },
  { label: 'Tests', color: '#C4820E' },
  { label: 'Compliance', color: '#dc2626' },
]

function PipelineArrow({ color }: { color: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" style={{ color: `${color}55` }} aria-hidden className="shrink-0">
      <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="9,2 16,7 9,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReversePipelineArrow({ color }: { color: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" style={{ color: `${color}55` }} aria-hidden className="shrink-0">
      <line x1="17" y1="7" x2="5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="9,2 2,7 9,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const slides: Slide[] = [
  {
    id: 'title',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/40 mb-6">
            Investor Deck · Confidential
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink mb-5 md:mb-8 leading-[1.1] whitespace-nowrap">
            Go-to-market faster than ever.
          </h1>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-10 md:mb-14">
            Invariant builds AI that turns compliance from a bottleneck into a competitive advantage — across nuclear, aerospace, and drones.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ink/35 tracking-wide hidden sm:flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&larr;</kbd>
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&rarr;</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="font-mono text-xs text-ink/35 tracking-wide sm:hidden">
              Swipe to navigate
            </span>
          </div>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'problem-drones',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Problem</SlideLabel>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-ink mb-6 sm:mb-10">
            Drones.
          </h2>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-4">
            You build a drone. Check the compliance checklist. It fails. You can't ship to market.
          </p>
          <p className="font-mono text-xs sm:text-sm text-ink/35 leading-relaxed max-w-xl">
            Months of engineering, grounded by paperwork.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'problem-space',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Problem</SlideLabel>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-ink mb-6 sm:mb-10">
            Satellite Launch Vehicles.
          </h2>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-4">
            You build rockets and realise the software requirements didn't fulfil DO-178C criteria. Entire project delayed by 10 months.
          </p>
          <p className="font-mono text-xs sm:text-sm text-ink/35 leading-relaxed max-w-xl">
            One missed criteria. An entire program stalled.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'problem-nuclear',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Problem</SlideLabel>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-ink mb-6 sm:mb-10">
            Nuclear Construction Permit.
          </h2>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-4">
            You apply for a nuclear plant construction permit. Realise the design is immature. The project cascades.
          </p>
          <p className="font-mono text-xs sm:text-sm text-ink/35 leading-relaxed max-w-xl">
            Vogtle: billions in overruns, years of delay.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'cost',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Cost</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-3xl">
            The price of getting compliance wrong.
          </h2>
        </div>
        <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 max-w-5xl mx-auto items-end">
          {[
            { figure: '$1.1B', label: 'Vogtle Units 3 & 4 cost overrun from licensing delays' },
            { figure: '$20B+', label: 'Boeing 737 MAX return-to-service documentation rework' },
            { figure: '7 years', label: 'NRC\'s first advanced reactor design certification review' },
            { figure: '10 months', label: 'Typical delay when software fails DO-178C criteria' },
          ].map((fact) => (
            <div key={fact.figure} className="flex flex-col items-center text-center">
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] text-ink mb-2 md:mb-3 whitespace-nowrap">
                {fact.figure}
              </p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/50 leading-relaxed w-28 sm:w-36">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'why',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Why This Happens</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            We talked to people across US nuclear, space tech, and drone manufacturing.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            The same pattern emerged everywhere.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-6 sm:py-8">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-4">
              01
            </span>
            <h3 className="font-mono text-base sm:text-lg font-medium text-ink/80 leading-snug mb-3">
              Design Immaturity
            </h3>
            <p className="font-mono text-xs sm:text-sm text-ink/50 leading-relaxed">
              Teams don't know what the regulator expects until they submit. By then, the design is locked and rework is expensive.
            </p>
          </div>
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-6 sm:py-8">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-4">
              02
            </span>
            <h3 className="font-mono text-base sm:text-lg font-medium text-ink/80 leading-snug mb-3">
              Fragmented Operations
            </h3>
            <p className="font-mono text-xs sm:text-sm text-ink/50 leading-relaxed">
              Large project operations are spread across teams, tools, and timelines. Requirements, design, and compliance live in silos.
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'solution',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Solution</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Invariant AI: Language models built for compliance.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            Our models read your CAD designs, Ansys simulations, and test results — and tell you whether the design is compliant before you file.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-4xl mx-auto mb-10 sm:mb-14">
          {[
            { label: 'CAD Designs', color: '#3A7CA5' },
            { label: 'Ansys Simulations', color: '#6366f1' },
            { label: 'Test Results', color: '#2A9D8F' },
          ].map((src, i) => (
            <div key={src.label} className="flex items-center gap-2 sm:gap-3">
              <div
                className="rounded-lg border px-4 sm:px-5 py-2.5 sm:py-3"
                style={{ borderColor: `${src.color}35`, backgroundColor: `${src.color}08` }}
              >
                <span className="font-mono text-[10px] sm:text-xs font-medium whitespace-nowrap" style={{ color: src.color }}>
                  {src.label}
                </span>
              </div>
              {i < 2 && <span className="font-mono text-ink/20 text-xs">+</span>}
            </div>
          ))}
          <PipelineArrow color="#5C6370" />
          <div className="rounded-lg border-2 border-ink/30 bg-ink/[0.03] px-4 sm:px-5 py-2.5 sm:py-3">
            <span className="font-mono text-[10px] sm:text-xs font-semibold whitespace-nowrap text-ink/80">
              Invariant AI
            </span>
          </div>
          <PipelineArrow color="#5C6370" />
          <div className="rounded-lg border-2 border-emerald-400/50 bg-emerald-50/50 px-4 sm:px-5 py-2.5 sm:py-3">
            <span className="font-mono text-[10px] sm:text-xs font-semibold whitespace-nowrap text-emerald-700">
              Compliant / Not Compliant
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {['Learning', 'Reasoning', 'Authoring'].map((cap) => (
            <span
              key={cap}
              className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase px-5 py-2.5 rounded border border-ink/20 text-ink/70"
            >
              {cap}
            </span>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'se-workflow',
    render: () => {
      const standardSteps = PIPELINE_STEPS.filter((s) => s.label !== 'Compliance')
      return (
        <SlideShell>
          <div className="flex flex-col items-center text-center">
            <SlideLabel>Systems Engineering</SlideLabel>
            <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
              The standard workflow.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
              Compliance is completely absent. Any change in any step — its impact on compliance is invisible until it's too late.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
              {standardSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-1.5 sm:gap-2.5">
                  <div
                    className="rounded-lg border px-3.5 sm:px-5 py-2.5 sm:py-3"
                    style={{
                      borderColor: `${step.color}35`,
                      backgroundColor: `${step.color}08`,
                    }}
                  >
                    <span
                      className="font-mono text-[10px] sm:text-xs font-medium whitespace-nowrap"
                      style={{ color: step.color }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < standardSteps.length - 1 && <PipelineArrow color={step.color} />}
                </div>
              ))}

              <div className="flex items-center gap-1.5 sm:gap-2.5 ml-1 sm:ml-2">
                <div className="w-px h-8 bg-ink/10" />
                <div className="rounded-lg border-2 border-dashed border-red-300/50 bg-red-50/30 px-3.5 sm:px-5 py-2.5 sm:py-3 relative">
                  <span className="font-mono text-[10px] sm:text-xs font-medium whitespace-nowrap text-red-400/60">
                    Compliance?
                  </span>
                  <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-100 border border-red-300 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-bold leading-none">✕</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-red-200/60 bg-red-50/30 px-6 sm:px-8 py-5 sm:py-6 max-w-3xl mx-auto mt-10 sm:mt-12">
            <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-red-400/70 font-medium">Missing</span>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
              Compliance is <strong className="text-ink/80 font-medium">never part of the workflow</strong>. A requirement changes, a design shifts, a test is added — and nobody knows how it affects regulatory approval until submission day.
            </p>
          </div>
        </SlideShell>
      )
    },
  },

  {
    id: 'how-it-works',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Our Approach</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Invariant adds compliance to every step.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            The same workflow — but now compliance is woven in from the start, not bolted on at the end.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1.5 sm:gap-2.5">
                <div
                  className={`rounded-lg border-2 px-3.5 sm:px-5 py-2.5 sm:py-3 ${
                    step.label === 'Compliance' ? 'ring-2 ring-emerald-400/40 ring-offset-2' : ''
                  }`}
                  style={{
                    borderColor: step.label === 'Compliance' ? '#059669' : `${step.color}50`,
                    backgroundColor: step.label === 'Compliance' ? '#05966912' : `${step.color}0A`,
                  }}
                >
                  <span
                    className="font-mono text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                    style={{ color: step.label === 'Compliance' ? '#059669' : step.color }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && <PipelineArrow color={step.color} />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl border border-emerald-200/60 bg-emerald-50/30 px-6 sm:px-8 py-5 sm:py-6 max-w-3xl mx-auto mt-10 sm:mt-14">
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-500/70 font-medium">With Invariant</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
            Compliance is now <strong className="text-ink/80 font-medium">part of the workflow</strong>. Every requirement, design decision, and test result is checked against regulatory criteria in real time.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'competitors-direct',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Competitors · Direct</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-3xl">
            Nuclear vertical.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-xl">
            Single-vertical players. None solve end-to-end compliance across industries.
          </p>
        </div>
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {COMPETITORS.nuclear.map((c) => (
            <div key={c.name} className="rounded-lg border border-amber-200 bg-amber-50/50 px-6 py-5 flex items-center gap-4">
              {c.logo ? (
                <img src={c.logo} alt={`${c.name} logo`} className="w-11 h-11 rounded-full object-cover shrink-0" />
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: c.bg }}
                >
                  <span className="font-mono text-xs font-bold text-white">{c.initial}</span>
                </div>
              )}
              <div>
                <p className="font-mono text-sm font-medium text-ink/80 mb-0.5">{c.name}</p>
                <p className="font-mono text-xs text-ink/45">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'competitors-indirect',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Competitors · Indirect</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-3xl">
            Adjacent tools.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-xl">
            Solve workflow problems without compliance depth.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
          {COMPETITORS.indirect.map((c) => (
            <div key={c.name} className="rounded-lg border border-ink/10 bg-ink/[0.015] px-5 py-4 flex items-center gap-4">
              {c.logo ? (
                <img src={c.logo} alt={`${c.name} logo`} className="w-10 h-10 rounded-full object-contain shrink-0" />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: c.bg }}
                >
                  <span className="font-mono text-[10px] font-bold text-white">{c.initial}</span>
                </div>
              )}
              <div>
                <p className="font-mono text-sm font-medium text-ink/80 mb-0.5">{c.name}</p>
                <p className="font-mono text-xs text-ink/45">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'consultants',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>The Real Competition</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-3xl">
            Our biggest competitors are consultants.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            Today, compliance is done by armies of consultants billing by the hour. Slow, expensive, and doesn't scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-3xl mx-auto">
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-5 sm:px-6 py-5 sm:py-6 text-center">
            <p className="font-serif text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-ink mb-2">$50–600</p>
            <p className="font-mono text-[10px] sm:text-xs text-ink/45">/hour for regulatory consultants</p>
          </div>
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-5 sm:px-6 py-5 sm:py-6 text-center">
            <p className="font-serif text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-ink mb-2">Months</p>
            <p className="font-mono text-[10px] sm:text-xs text-ink/45">to produce a single compliance package</p>
          </div>
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-5 sm:px-6 py-5 sm:py-6 text-center">
            <p className="font-serif text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-ink mb-2">Zero</p>
            <p className="font-mono text-[10px] sm:text-xs text-ink/45">real-time feedback during design</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-5 sm:py-6 max-w-3xl mx-auto mt-10 sm:mt-12">
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">Invariant replaces this</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
            AI that delivers compliance insight <strong className="text-ink/80 font-medium">in seconds, not months</strong> — at a fraction of the cost.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'design-partners',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Design Partners</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Built alongside practitioners.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            Three design partners across three industries. Real compliance workflows, real regulatory submissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto w-full">
          {DESIGN_PARTNERS.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border px-5 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center"
              style={{
                borderColor: `${p.color}35`,
                backgroundColor: `${p.color}08`,
              }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.15em] uppercase font-medium mb-4"
                style={{ color: p.color }}
              >
                {p.domain}
              </span>
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg mb-5"
              />
              <h3 className="font-mono text-sm sm:text-base font-medium text-ink/80 mb-2">
                {p.name}
              </h3>
              <p className="font-mono text-[10px] sm:text-xs text-ink/50 leading-relaxed">
                {p.scope}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'close',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Let's Talk</SlideLabel>
          <h2 className="heading-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 whitespace-nowrap">
            Go-to-market faster than ever.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-xl mb-8 sm:mb-10">
            Invariant is building AI for systems engineering and compliance. We'd love to talk.
          </p>
          <div className="flex flex-col items-center gap-4 mb-8 sm:mb-12">
            <a
              href="mailto:founders@invariant-ai.com?subject=Investor Inquiry"
              className="font-mono text-sm tracking-[0.1em] uppercase bg-ink text-white px-8 py-3.5 rounded hover:bg-ink/90 transition-colors"
            >
              founders@invariant-ai.com
            </a>
            <span className="font-mono text-xs text-ink/35">invariant-ai.com</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-ink/40">Backed by</span>
            <span className="font-mono text-xs text-ink/60 font-medium">Entrepreneurs First</span>
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

      {current > 0 && (
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-sm border-t border-ink/[0.04]">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-ink/25 font-medium">
          Invariant
        </span>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-ink/60'
                  : 'w-2 bg-ink/12 hover:bg-ink/25'
              }`}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] sm:text-xs tabular-nums text-ink/30">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  )
}
