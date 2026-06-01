import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const STEPS = [
  { n: '01', title: 'Ingest', body: 'Agents read your designs, test data, and the regulations that apply to you.' },
  { n: '02', title: 'Trace', body: 'Every claim mapped back to the rule that supports it. No invented citations.' },
  { n: '03', title: 'Draft', body: 'Submissions, test plans, and compliance matrices written end to end.' },
  { n: '04', title: 'Review', body: 'Your team verifies the high-stakes outputs before anything ships.' },
  { n: '05', title: 'Approved', body: 'Filed, traceable, and monitored as the rules change.', done: true },
]

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Heading() {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <span className="inline-flex rounded-full bg-ink/[0.05] px-3 py-1 font-sans text-xs font-medium tracking-wide text-ink/60">How we work</span>
      <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
        One platform. End-to-end compliance.
      </h2>
      <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-ink/60">
        From data ingest to regulatory sign-off, continuously monitored.
      </p>
    </div>
  )
}

/** A single drawer row. Open state is driven by scroll, not clicks. */
function Drawer({ step, isOpen }: { step: (typeof STEPS)[number]; isOpen: boolean }) {
  return (
    <div className="border-b border-ink/12">
      <div className="flex items-center gap-4 py-5">
        <span
          className={`flex h-6 w-7 shrink-0 items-center font-mono text-sm tabular-nums transition-colors duration-300 ${
            isOpen ? 'text-copper' : 'text-ink/35'
          }`}
        >
          {step.done ? <Check /> : step.n}
        </span>
        <h3
          className={`font-sans text-lg font-medium tracking-[-0.01em] transition-colors duration-300 ${
            isOpen ? 'text-ink' : 'text-ink/50'
          }`}
        >
          {step.title}
        </h3>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-md pb-6 pl-11 font-sans text-base leading-relaxed text-ink/60">
              {step.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Process() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })
  const progress = useTransform(smooth, [0.1, 0.92], [0, 1], { clamp: true })

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)))
    setActive((prev) => (prev === idx ? prev : idx))
  })

  return (
    <section ref={ref} className="relative bg-paper md:h-[240vh]">
      {/* Desktop: pinned panel, drawers open as you scroll (and reverse) */}
      <div className="sticky top-0 hidden h-screen items-center px-6 md:flex md:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          <Heading />
          <div className="border-t border-ink/12">
            {STEPS.map((s, i) => (
              <Drawer key={s.n} step={s} isOpen={active === i} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: static stacked list */}
      <div className="px-6 py-24 md:hidden">
        <Heading />
        <div className="mt-10 border-t border-ink/12">
          {STEPS.map((s) => (
            <div key={s.n} className="border-b border-ink/12 py-5">
              <div className="flex items-center gap-4">
                <span className={`flex h-6 w-7 shrink-0 items-center font-mono text-sm tabular-nums ${s.done ? 'text-copper' : 'text-ink/40'}`}>
                  {s.done ? <Check /> : s.n}
                </span>
                <h3 className="font-sans text-lg font-medium tracking-[-0.01em] text-ink">{s.title}</h3>
              </div>
              <p className="mt-2 max-w-md pl-11 font-sans text-base leading-relaxed text-ink/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
