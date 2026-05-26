import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const VERTICALS = [
  { name: 'Nuclear', body: 'From license applications to safety analysis reports, compliance for the most regulated energy sector on earth.' },
  { name: 'Space-Tech', body: 'From launch-vehicle certification to satellite licensing, purpose-built compliance for the new space economy.' },
  { name: 'Unmanned Aerial Systems', body: 'From DGCA type certification to airworthiness approvals, end-to-end compliance for drone manufacturers and their fleets.' },
]

export default function Verticals() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-cloud px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Who we serve</p>
          <h2 className="mt-5 max-w-md font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            We work with teams building the hardest things in the most regulated industries.
          </h2>
          <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-ink/60">
            Where compliance isn't optional, and failure isn't abstract.
          </p>
        </div>

        <div className="divide-y divide-ink/10 lg:pt-2">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="py-6 first:pt-0"
            >
              <h3 className="font-sans text-lg font-medium text-ink">{v.name}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-ink/60">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
