import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

const AUDIENCES = [
  {
    label: 'Engineering Teams',
    description: 'Teams designing regulated systems who need regulatory awareness from first sketch to final submission.',
  },
  {
    label: 'Licensing Consultants',
    description: 'Practitioners who author safety cases, regulatory filings, and compliance documentation across industries.',
  },
  {
    label: 'Program Leadership',
    description: 'Leaders managing the intersection of engineering schedules and regulatory timelines.',
  },
]

export default function WhoItsFor() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§5" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-16"
        >
          Built for teams where regulation shapes the engineering.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {AUDIENCES.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            >
              <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-4">
                {audience.label}
              </h3>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/65">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
