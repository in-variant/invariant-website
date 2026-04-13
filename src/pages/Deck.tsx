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

const COMPETITORS = {
  nuclear: [
    { name: 'Atomic Canyon', detail: 'Nuclear regulatory AI', logo: '/logos/atomic_canyon_logo.jpeg', initial: 'AC', bg: '#C4820E', logoBg: undefined as string | undefined },
    { name: 'Everstar Inc', detail: 'Nuclear engineering software', logo: '/logos/everstar.png', initial: 'E', bg: '#2A9D8F', logoBg: 'white' },
    { name: 'Nuclearn', detail: 'Nuclear knowledge management', logo: '/logos/nuclearn.png', initial: 'N', bg: '#3A7CA5', logoBg: 'black' },
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

function FlowArrow({ label, color, broken }: { label: string; color: string; broken?: boolean }) {
  const c = broken ? '#ef4444' : color
  return (
    <div className="flex flex-col items-center gap-1 px-1 sm:px-2 shrink-0">
      <svg width="48" height="24" viewBox="0 0 48 24" className="shrink-0">
        <line x1="0" y1="12" x2="38" y2="12" stroke={c} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        <polyline points="34,6 44,12 34,18" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <circle cx="8" cy="12" r="2" fill={c} opacity="0.6">
          <animate attributeName="cx" values="4;40;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      <span className="font-mono text-[8px] sm:text-[9px] whitespace-nowrap" style={{ color: c, opacity: 0.6 }}>{label}</span>
    </div>
  )
}

function ArchSection({ label, color, children, broken, badge }: { label: string; color: string; children: React.ReactNode; broken?: boolean; badge?: React.ReactNode }) {
  const borderColor = broken ? '#ef4444' : `${color}40`
  const bgColor = broken ? '#fef2f208' : `${color}06`
  return (
    <div className="flex flex-col items-center shrink-0">
      <div
        className="rounded-xl border-2 px-4 sm:px-5 py-4 sm:py-5 flex flex-col items-center gap-2.5 sm:gap-3 relative transition-colors duration-500 min-w-[130px] sm:min-w-[150px]"
        style={{ borderColor, backgroundColor: bgColor }}
      >
        <span
          className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium transition-colors duration-500"
          style={{ color: broken ? '#ef4444' : `${color}99` }}
        >
          {label}
        </span>
        {children}
        {badge}
      </div>
    </div>
  )
}

function ArchItem({ text, color, broken }: { text: string; color: string; broken?: boolean }) {
  const c = broken ? '#ef4444' : color
  return (
    <div
      className="flex items-center rounded-lg border px-3 py-1.5 sm:py-2 w-full transition-colors duration-500"
      style={{ borderColor: `${c}30`, backgroundColor: `${c}08` }}
    >
      <span className="font-mono text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-500" style={{ color: c }}>{text}</span>
    </div>
  )
}

function SEWorkflowSlide() {
  const [phase, setPhase] = useState(0)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (phase < 4) {
      const t = setTimeout(() => setPhase((p) => p + 1), 800)
      return () => clearTimeout(t)
    }
    if (phase === 4 && !changed) {
      const t = setTimeout(() => setChanged(true), 1400)
      return () => clearTimeout(t)
    }
  }, [phase, changed])

  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Systems Engineering</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
          The standard workflow.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-8 sm:mb-12 max-w-2xl">
          A change in design cascades downstream — but compliance never notices.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-0 overflow-x-auto pb-2">
        {/* INPUTS */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 1 ? 1 : 0.15, x: phase >= 1 ? 0 : -20 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Inputs" color="#2A9D8F">
            <ArchItem text="Goal" color="#2A9D8F" />
            <ArchItem text="Requirement A" color="#3A7CA5" />
            <ArchItem text="Requirement B" color="#3A7CA5" />
            <ArchItem text="Requirement C" color="#3A7CA5" />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="specify" color="#3A7CA5" />
        </motion.div>

        {/* DESIGN & BUILD */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 2 ? 1 : 0.15, scale: phase >= 2 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Design & Build" color="#5C6370" broken={changed}
            badge={changed ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold">X</span>
              </motion.div>
            ) : undefined}
          >
            <ArchItem text="CAD Models" color="#5C6370" broken={changed} />
            <ArchItem text="Simulations" color="#6366f1" broken={changed} />
            <ArchItem text="Architecture" color="#5C6370" broken={changed} />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="verify" color="#5C6370" broken={changed} />
        </motion.div>

        {/* TESTS */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 3 ? 1 : 0.15, scale: phase >= 3 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Verification" color="#C4820E" broken={changed}>
            <ArchItem text="Unit Tests" color="#C4820E" broken={changed} />
            <ArchItem text="Integration" color="#C4820E" broken={changed} />
            <ArchItem text="Acceptance" color="#C4820E" broken={changed} />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="submit" color="#C4820E" broken={changed} />
        </motion.div>

        {/* COMPLIANCE — MISSING */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 4 ? 1 : 0.15, scale: phase >= 4 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-col items-center shrink-0">
            <div className="rounded-xl border-2 border-dashed border-red-300/50 bg-red-50/20 px-4 sm:px-5 py-4 sm:py-5 flex flex-col items-center gap-2.5 sm:gap-3 min-w-[130px] sm:min-w-[150px] relative">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium text-red-400/60">
                Compliance
              </span>
              <div className="flex items-center rounded-lg border border-red-200/40 bg-red-50/30 px-3 py-1.5 sm:py-2 w-full">
                <span className="font-mono text-[10px] sm:text-xs font-medium text-red-400/50">Reg. Review</span>
              </div>
              <div className="flex items-center rounded-lg border border-red-200/40 bg-red-50/30 px-3 py-1.5 sm:py-2 w-full">
                <span className="font-mono text-[10px] sm:text-xs font-medium text-red-400/50">Audit</span>
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold">X</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {changed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-xl border border-red-200/60 bg-red-50/30 px-6 sm:px-8 py-4 sm:py-5 max-w-3xl mx-auto mt-6 sm:mt-8"
        >
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-red-400/70 font-medium">No compliance check</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
            Design changed. Everything downstream is stale. <strong className="text-red-500 font-medium">Nothing flags the gap</strong> — you find out at submission.
          </p>
        </motion.div>
      )}

      <button
        onClick={() => { setPhase(0); setChanged(false); setTimeout(() => setPhase(1), 100) }}
        className="mx-auto mt-5 font-mono text-[10px] sm:text-xs text-ink/30 hover:text-ink/60 transition-colors tracking-wide uppercase"
      >
        ↻ Replay
      </button>
    </SlideShell>
  )
}

function SEWorkflowWithComplianceSlide() {
  const [phase, setPhase] = useState(0)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (phase < 4) {
      const t = setTimeout(() => setPhase((p) => p + 1), 800)
      return () => clearTimeout(t)
    }
    if (phase === 4 && !changed) {
      const t = setTimeout(() => setChanged(true), 1400)
      return () => clearTimeout(t)
    }
  }, [phase, changed])

  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>With Invariant</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
          Compliance at every step.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-8 sm:mb-12 max-w-2xl">
          Same workflow — but now every step is checked in real time.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-0 overflow-x-auto pb-2">
        {/* INPUTS */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 1 ? 1 : 0.15, x: phase >= 1 ? 0 : -20 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Inputs" color="#2A9D8F">
            <ArchItem text="Goal" color="#2A9D8F" />
            <ArchItem text="Requirement A" color="#3A7CA5" />
            <ArchItem text="Requirement B" color="#3A7CA5" />
            <ArchItem text="Requirement C" color="#3A7CA5" />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="specify" color="#3A7CA5" />
        </motion.div>

        {/* DESIGN & BUILD */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 2 ? 1 : 0.15, scale: phase >= 2 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Design & Build" color="#5C6370" broken={changed}
            badge={changed ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
                <span className="text-amber-600 text-xs font-bold">!</span>
              </motion.div>
            ) : undefined}
          >
            <ArchItem text="CAD Models" color="#5C6370" broken={changed} />
            <ArchItem text="Simulations" color="#6366f1" broken={changed} />
            <ArchItem text="Architecture" color="#5C6370" broken={changed} />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="verify" color="#5C6370" broken={changed} />
        </motion.div>

        {/* TESTS */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 3 ? 1 : 0.15, scale: phase >= 3 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <ArchSection label="Verification" color="#C4820E" broken={changed}>
            <ArchItem text="Unit Tests" color="#C4820E" broken={changed} />
            <ArchItem text="Integration" color="#C4820E" broken={changed} />
            <ArchItem text="Acceptance" color="#C4820E" broken={changed} />
          </ArchSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <FlowArrow label="check" color="#059669" />
        </motion.div>

        {/* COMPLIANCE — INVARIANT */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 4 ? 1 : 0.15, scale: phase >= 4 ? 1 : 0.9 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-col items-center shrink-0">
            <div className="rounded-xl border-2 border-emerald-400/60 bg-emerald-50/20 px-4 sm:px-5 py-4 sm:py-5 flex flex-col items-center gap-2.5 sm:gap-3 min-w-[130px] sm:min-w-[150px] relative ring-2 ring-emerald-400/30 ring-offset-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium text-emerald-600">
                Invariant AI
              </span>
              <div className="flex items-center rounded-lg border border-emerald-300/40 bg-emerald-50/50 px-3 py-1.5 sm:py-2 w-full">
                <span className="font-mono text-[10px] sm:text-xs font-medium text-emerald-700">Reg. Check</span>
              </div>
              <div className="flex items-center rounded-lg border border-emerald-300/40 bg-emerald-50/50 px-3 py-1.5 sm:py-2 w-full">
                <span className="font-mono text-[10px] sm:text-xs font-medium text-emerald-700">Doc Review</span>
              </div>
              <div className="flex items-center rounded-lg border border-emerald-300/40 bg-emerald-50/50 px-3 py-1.5 sm:py-2 w-full">
                <span className="font-mono text-[10px] sm:text-xs font-medium text-emerald-700">Gap Analysis</span>
              </div>
              {!changed && phase >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center">
                  <span className="font-mono text-emerald-600 text-[9px] font-bold leading-none">OK</span>
                </motion.div>
              )}
              {changed && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center">
                  <span className="text-amber-600 text-xs font-bold">!</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {changed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-xl border border-emerald-200/60 bg-emerald-50/30 px-6 sm:px-8 py-4 sm:py-5 max-w-3xl mx-auto mt-6 sm:mt-8"
        >
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-500/70 font-medium">Invariant catches it</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
            Design changed → Invariant <strong className="text-emerald-600 font-medium">immediately flags</strong> affected steps and re-checks against every applicable regulatory criterion.
          </p>
        </motion.div>
      )}

      <button
        onClick={() => { setPhase(0); setChanged(false); setTimeout(() => setPhase(1), 100) }}
        className="mx-auto mt-5 font-mono text-[10px] sm:text-xs text-ink/30 hover:text-ink/60 transition-colors tracking-wide uppercase"
      >
        ↻ Replay
      </button>
    </SlideShell>
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
            Nuclear.
          </h2>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-4">
            You file for an NRC construction permit. An RAI comes back — your containment analysis doesn't meet GDC 16. Redesign cascades through the entire FSAR.
          </p>
          <p className="font-mono text-xs sm:text-sm text-ink/35 leading-relaxed max-w-xl">
            Vogtle: $17 B in overruns, 7 years late.
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
            { figure: '$17B', label: 'Vogtle Units 3 & 4 cost overrun — design immaturity met NRC licensing' },
            { figure: '$20B+', label: 'Boeing 737 MAX grounding — recertification, fines & rework' },
            { figure: '42 mo', label: 'NuScale SMR design certification — first-ever NRC SMR review' },
            { figure: '18–36 mo', label: 'Typical DO-178C recertification cycle per software component' },
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
            One pattern. Every industry.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            We spoke with teams across <strong className="text-ink/80 font-medium">US nuclear</strong>, <strong className="text-ink/80 font-medium">space tech</strong>, and <strong className="text-ink/80 font-medium">drone manufacturing</strong>.
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
              You don't know what the regulator expects until you submit. By then, rework is expensive.
            </p>
          </div>
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-6 sm:py-8">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-4">
              02
            </span>
            <h3 className="font-mono text-base sm:text-lg font-medium text-ink/80 leading-snug mb-3">
              Siloed Operations
            </h3>
            <p className="font-mono text-xs sm:text-sm text-ink/50 leading-relaxed">
              Requirements, design, and compliance live in different tools, teams, and timelines.
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
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink leading-[1.1]">
            Invariant AI
          </h2>
          <p className="font-mono text-base sm:text-lg md:text-xl text-ink/50 mt-4 sm:mt-6">
            Language models built for compliance.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'helion-benchmark',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Our Model</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Helion-512 beats Fermi-512 on FermiBench.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-2xl mb-10 sm:mb-14">
            Our in-house model is the only state-of-the-art for nuclear compliance.
          </p>
        </div>

        <div className="max-w-md mx-auto w-full flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs sm:text-sm font-semibold text-ink/80">Helion-512</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600">SOTA</span>
            </div>
            <div className="w-full h-3 rounded-full bg-ink/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: '96.93%' }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-ink/30">Invariant · In-house</span>
              <span className="font-mono text-[10px] text-emerald-600 font-medium">96.93</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs sm:text-sm font-medium text-ink/60">Fermi-512</span>
              <span className="font-mono text-[10px] sm:text-xs text-ink/35">Previous SOTA</span>
            </div>
            <div className="w-full h-3 rounded-full bg-ink/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-ink/25"
                initial={{ width: 0 }}
                animate={{ width: '74%' }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-ink/30"></span>
              <span className="font-mono text-[10px] text-ink/40 font-medium">74.00</span>
            </div>
          </div>
        </div>

        <a
          href="https://huggingface.co/datasets/atomic-canyon/FermiBench"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] sm:text-xs text-ink/30 hover:text-ink/50 transition-colors text-center mt-8 sm:mt-10 underline underline-offset-2 decoration-ink/15 hover:decoration-ink/30"
        >
          FermiBench · nDCG@10 · Nuclear regulatory compliance benchmark
        </a>
      </SlideShell>
    ),
  },

  {
    id: 'se-workflow',
    render: () => <SEWorkflowSlide />,
  },

  {
    id: 'how-it-works',
    render: () => <SEWorkflowWithComplianceSlide />,
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
                <div
                  className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: c.logoBg || 'transparent' }}
                >
                  <img src={c.logo} alt={`${c.name} logo`} className="w-full h-full object-contain p-1" />
                </div>
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
