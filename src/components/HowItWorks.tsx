import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Thin proof-stats strip. Dark (ink) to alternate from CustomerStories
 * (paper) above and into Advisors (paper) below.
 */

const STATS = [
  { value: '0.9693', label: 'nDCG@10', sub: 'FermiBench state of the art (Helion-512)' },
  { value: '10×', label: 'faster filings', sub: 'engineers plus agents, weeks become days' },
  { value: '20+', label: 'regulators tracked', sub: 'NRC, FAA, FCC, IN-SPACe, and more across the US and India' },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-ink px-6 py-20 text-cloud md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-display text-5xl font-normal tracking-[-0.02em] text-cloud md:text-6xl lg:text-7xl">
                {s.value}
              </p>
              <p className="mt-3 font-sans text-sm font-medium text-cloud">{s.label}</p>
              <p className="mt-1 max-w-xs font-sans text-xs leading-relaxed text-cloud/55">
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
