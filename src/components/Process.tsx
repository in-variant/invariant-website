import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'

const STEPS = [
  { n: '01', title: 'Engage', body: 'Map your full compliance surface.' },
  { n: '02', title: 'Deploy', body: 'Embed engineers and lawyers in your team.' },
  { n: '03', title: 'Automate', body: 'Agentic AI drafts, cites, and reviews.' },
  { n: '04', title: 'Accelerate', body: 'Months of documentation become days.' },
  { n: '05', title: 'Done', body: 'Defensible, filed, approved.', done: true },
]

const TOTAL = STEPS.length

/** Node that fills with ink as the scroll-driven progress reaches it. */
function Dot({ progress, index, n, done }: { progress: MotionValue<number>; index: number; n: string; done?: boolean }) {
  const t = index / (TOTAL - 1)
  const fill = useTransform(progress, [t - 0.05, t + 0.02], [0, 1])
  const ink = useTransform(fill, [0, 1], ['rgba(13,13,13,0.5)', 'rgba(255,255,255,1)'])

  return (
    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-white">
      <motion.span className="absolute inset-[-1px] rounded-full bg-ink" style={{ opacity: fill, scale: fill }} />
      {done ? (
        <motion.svg viewBox="0 0 16 16" className="relative h-4 w-4" fill="none" strokeWidth="2" style={{ stroke: ink }}>
          <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      ) : (
        <motion.span className="relative font-grotesk text-sm font-medium" style={{ color: ink }}>
          {n}
        </motion.span>
      )}
    </div>
  )
}

function Heading() {
  return (
    <>
      <span className="inline-flex rounded-full bg-ink/[0.05] px-3 py-1 font-grotesk text-xs font-medium tracking-wide text-ink/60">
        How we work
      </span>
      <h2 className="mt-5 max-w-2xl font-sans text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-ink md:text-4xl">
        One engagement. End-to-end compliance.
      </h2>
      <p className="mt-4 max-w-md font-sans text-lg leading-relaxed text-ink/55">
        From first scope to regulatory sign-off.
      </p>
    </>
  )
}

export default function Process() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Smooth friction on the scroll value, then map the middle of the pinned range to 0→1
  // (buffer so the timeline settles centered before it starts and finishes before it releases).
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })
  const progress = useTransform(smooth, [0.12, 0.9], [0, 1])

  return (
    <section ref={ref} className="relative border-t border-ink/[0.06] bg-white md:h-[220vh]">
      {/* Desktop: pinned, scroll-driven horizontal timeline */}
      <div className="sticky top-0 hidden h-screen items-center px-6 md:flex md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <Heading />
          <div className="relative mt-24">
            <div className="absolute left-[10%] right-[10%] top-5 h-px bg-ink/12" />
            <motion.div
              className="absolute left-[10%] right-[10%] top-5 h-px origin-left bg-ink"
              style={{ scaleX: progress }}
            />
            <div className="grid grid-cols-5">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex flex-col items-center px-3 text-center">
                  <Dot progress={progress} index={i} n={s.n} done={s.done} />
                  <h3 className="mt-5 font-sans text-base font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/55">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: simple vertical timeline (no pin) */}
      <div className="px-6 py-24 md:hidden">
        <Heading />
        <div className="relative mt-12">
          <div className="absolute bottom-3 left-5 top-3 w-px bg-ink/15" />
          <div className="flex flex-col gap-8">
            {STEPS.map((s) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-start gap-5"
              >
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    s.done ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white text-ink/55'
                  }`}
                >
                  {s.done ? (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="font-grotesk text-sm font-medium">{s.n}</span>
                  )}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-sans text-base font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/55">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
