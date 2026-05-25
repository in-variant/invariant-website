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
    <section ref={ref} className="border-t border-ink/[0.06] bg-white px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="inline-flex rounded-full bg-ink/[0.05] px-3 py-1 font-grotesk text-xs font-medium tracking-wide text-ink/60">
            Who we serve
          </span>
          <h2 className="mt-5 font-sans text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-ink md:text-4xl">
            We work with teams building the hardest things in the most regulated industries.
          </h2>
          <p className="mt-4 max-w-md font-sans text-lg leading-relaxed text-ink/55">
            Where compliance isn't optional, and failure isn't abstract.
          </p>
        </div>

        <div className="divide-y divide-ink/[0.08] lg:pt-2">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="py-5 first:pt-0"
            >
              <h3 className="font-sans text-base font-semibold text-ink">{v.name}</h3>
              <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/55">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
