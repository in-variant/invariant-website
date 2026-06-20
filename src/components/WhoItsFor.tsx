import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AUDIENCES = [
  {
    label: 'Engineering Teams',
    description:
      'Teams building regulated systems who need compliance awareness from first sketch to final submission.',
    icon: (
      // System within a system: an L-bracket framing a smaller marked square.
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
        <path d="M10 30 L10 38 L18 38" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M38 18 L38 10 L30 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <rect x="17" y="17" width="14" height="14" stroke="currentColor" strokeWidth="1.25" />
        <line x1="24" y1="14" x2="24" y2="34" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.55" />
        <line x1="14" y1="24" x2="34" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.55" />
      </svg>
    ),
  },
  {
    label: 'Compliance Consultants',
    description:
      'Practitioners who author safety cases, regulatory filings, and compliance documentation across industries.',
    icon: (
      // A folio leaf: rules above a signature stroke.
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
        <path d="M14 10 L34 10 L34 38 L14 38 Z" stroke="currentColor" strokeWidth="1.25" />
        <line x1="18" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <line x1="18" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <line x1="18" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <path d="M18 32 C 22 30 26 34 30 32" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Program Leadership',
    description:
      'Leaders managing the intersection of engineering schedules and regulatory timelines.',
    icon: (
      // A timeline with one milestone marked.
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
        <line x1="10" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="14" y1="20" x2="14" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="1.25" />
        <line x1="34" y1="20" x2="34" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
]

export default function WhoItsFor() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-white">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-20 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-5"
          >
            Who Invariant is for.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="body-technical"
          >
            Built for teams where regulation shapes the engineering.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-4xl mx-auto">
          {AUDIENCES.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[4px] border border-ink/12 bg-paper p-3 text-copper">
                {audience.icon}
              </div>
              <h3 className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-ink/55">
                {audience.label}
              </h3>
              <p className="max-w-xs font-sans text-sm leading-relaxed text-ink/65">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
