import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const CALENDAR_URL = 'https://calendar.app.google/mZPkSD8mPEpFCNh89'

const STATUSES = [
  { text: 'Agent drafting', active: true },
  { text: 'Engineer review', active: true },
  { text: 'Filed, with the regulator', active: false },
  { text: 'Question received, answer drafted', active: true },
  { text: 'Monitoring', active: false },
  { text: 'Queued', active: false },
]

/**
 * Closing bridge: the generated plan, shown as it would look as a live
 * workspace. Rows are the user's actual filings; statuses are illustrative.
 */
export default function PlatformBridge({
  companyName,
  filingNames,
}: {
  companyName: string | null
  filingNames: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const mailSubject = encodeURIComponent(
    companyName ? `Regulatory timeline for ${companyName}` : 'Regulatory timeline review'
  )
  const mailBody = encodeURIComponent(
    'I ran the mission timeline on invariant-ai.com and would like to walk through the plan with an engineer.'
  )
  const rows = filingNames.slice(0, 6)

  return (
    <section ref={ref} className="bg-paper px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
            From plan to filings
          </div>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-ink md:text-5xl">
            This chart becomes a live workspace.
          </h2>
          <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-ink/65">
            Every bar becomes a tracked filing: drafted by agents against the current text of the
            regulation, signed off by a licensing engineer, every deadline on a calendar. You watch
            the plan execute instead of chasing it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 font-sans text-[15px] font-medium text-cloud transition-colors hover:bg-copper"
            >
              Walk through your plan
            </a>
            <a
              href={`mailto:founders@invariant-ai.com?subject=${mailSubject}&body=${mailBody}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 px-6 font-sans text-[15px] font-medium text-ink transition-colors hover:border-ink/40"
            >
              Email the founders
            </a>
          </div>
          <p className="mt-4 font-sans text-[12px] text-ink/45">
            A 30-minute call with an engineer, not a sales deck.
          </p>
        </motion.div>

        {/* Mock workspace, built from the user's own plan. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_16px_48px_-24px_rgba(27,36,54,0.35)]">
            <div className="flex items-center gap-2 border-b border-ink/10 bg-ink px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-cloud/25" />
              <span className="h-2 w-2 rounded-full bg-cloud/25" />
              <span className="h-2 w-2 rounded-full bg-cloud/25" />
              <span className="ml-2 font-sans text-[11px] tracking-wide text-cloud/70">
                Invariant · {companyName ? `${companyName} mission` : 'Mission workspace'}
              </span>
            </div>
            <div>
              {rows.map((name, i) => {
                const s = STATUSES[i % STATUSES.length]
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + i * 0.09, ease: EASE }}
                    className="flex items-center gap-3 border-b border-ink/[0.06] px-4 py-3 last:border-0"
                  >
                    {s.active ? (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
                      </span>
                    ) : (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-ink/20" />
                    )}
                    <span className="min-w-0 flex-1 truncate font-sans text-[13px] text-ink/85">
                      {name}
                    </span>
                    <span
                      className={`shrink-0 font-sans text-[11px] ${s.active ? 'text-copper' : 'text-ink/40'}`}
                    >
                      {s.text}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <p className="mt-3 text-center font-sans text-[11px] text-ink/35">
            Illustrative view of a mission workspace.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
