import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/**
 * "Introducing Invariant" — the headline row, then the stack.
 *
 * The four illustrated cards that used to sit here restated the headline four
 * times, so they are gone. The per-stage heading is gone too — the index on
 * the left already names the stage — but the one-line description sits under
 * the drawing, where it reads as a caption rather than a restatement. In their place each stage gets its own drawing
 * (public/art/stage/1..6) and they cross-fade as you scroll. A generic
 * exploded "platform stack" was tried first and said nothing about Evidence
 * or Filing specifically — these are drawn for the stage they belong to.
 */

const STAGES = [
  {
    k: 'Mission',
    d: 'Orbit, payload, spectrum, hardware, operations. The technical profile that decides which rules apply at all.',
    alt: 'An Invariant engineer looking up at a satellite in orbit around a wireframe globe',
  },
  {
    k: 'Requirements',
    d: 'What applies across every agency and jurisdiction, each obligation mapped back to the thing that triggered it.',
    alt: 'An engineer working through a branching requirements tree beside a ring binder',
  },
  {
    k: 'Evidence',
    d: 'The technical record behind each requirement: test data, specifications, engineering documents, mission data.',
    alt: 'An engineer at a structural test rig, reading the chart recorder output',
  },
  {
    k: 'Documentation',
    d: 'Submission-ready drafts written against the requirements they answer, with the gaps that still need answers flagged.',
    alt: 'An engineer checking a tablet against an open bound submission volume',
  },
  {
    k: 'Filing',
    d: 'The package assembled, checked against its own requirements and evidence, and put in front of an engineer before it goes.',
    alt: 'An engineer setting a tied document wallet down beside an inbox tray',
  },
  {
    k: 'Regulator response',
    d: 'Questions, revisions and follow-ups carried back into the record, and the path kept moving until the work is closed.',
    alt: 'An engineer reading a regulator letter outside a government building',
  },
]

const VH_PER_STAGE = 56

function StackBuild() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smoothed = useSpring(scrollYProgress, { stiffness: 150, damping: 34, mass: 0.35 })
  const p = reduced ? scrollYProgress : smoothed

  useLayoutEffect(
    () =>
      p.on('change', (v) => {
        const i = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)))
        setActive((prev) => (prev === i ? prev : i))
      }),
    [p],
  )

  const current = STAGES[active]

  const goTo = useCallback((i: number) => {
    const el = ref.current
    if (!el) return
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({
      top: el.offsetTop + span * ((i + 0.5) / STAGES.length),
      behavior: reducedRef.current ? 'auto' : 'smooth',
    })
  }, [])


  return (
    <section
      ref={ref}
      className="relative bg-paper"
      style={{ height: `${STAGES.length * (reduced ? 24 : VH_PER_STAGE)}vh` }}
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center overflow-hidden px-6 md:px-12 lg:px-20">
        {/* Half and half: the index on one side, the drawing on the other. */}
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ol>
            {STAGES.map((s, i) => {
              const on = i === active
              const done = i < active
              return (
                <li key={s.k}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on ? 'step' : undefined}
                    className={`grid w-full grid-cols-[auto_1fr] items-center gap-4 border-t py-4 text-left transition-colors duration-300 last:border-b ${
                      on ? 'border-ink/35' : 'border-ink/10'
                    }`}
                  >
                    <span
                      className={`font-sans text-[11px] tabular-nums transition-colors duration-300 ${
                        on || done ? 'text-ink/70' : 'text-ink/30'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-sans text-[15px] transition-colors duration-300 ${
                        on ? 'font-semibold text-ink' : done ? 'text-ink/65' : 'text-ink/35'
                      }`}
                    >
                      {s.k}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Every plate is padded to the same 3:2 frame, so this box matches
              the asset and nothing letterboxes or resizes between stages. */}
          <div className="mx-auto w-full max-w-[400px]">
            <div className="relative aspect-[3/2] w-full">
            {STAGES.map((s, i) => (
              <motion.img
                key={s.k}
                src={`/art/stage/${i + 1}.webp`}
                alt={i === active ? s.alt : ''}
                aria-hidden={i !== active}
                width={1200}
                height={800}
                loading={i === 0 ? 'eager' : 'lazy'}
                initial={false}
                animate={
                  reduced
                    ? { opacity: i === active ? 1 : 0 }
                    : {
                        opacity: i === active ? 1 : 0,
                        y: i === active ? 0 : 12,
                        scale: i === active ? 1 : 0.97,
                      }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 size-full object-contain"
              />
            ))}
            </div>

            {/* Caption, not a heading. */}
            <motion.p
              key={current.k}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-sans text-[15px] leading-relaxed text-ink/60"
            >
              {current.d}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function IntroducingInvariant() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <>
      <section ref={ref} className="bg-paper px-6 pb-0 pt-24 md:px-12 md:pt-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-x-20">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl lg:text-[3.5rem]"
            >
              Every filing between you and launch. Agents draft it, an engineer
              owns it.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md font-sans text-base leading-relaxed text-ink/65"
            >
              Invariant prepares and ships FAA, FCC, NOAA, ITU, and export-control
              filings for space teams. Agents draft the documents, trace every
              answer to its source rule, and watch for regulatory changes; a
              forward-deployed licensing engineer owns the work end to end. The
              same model runs our nuclear practice.
            </motion.p>
          </div>
        </div>
      </section>

      <StackBuild />
    </>
  )
}
