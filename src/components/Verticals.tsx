import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const VERTICALS = [
  { name: 'Space', body: 'Launch licensing, IN-SPACe and FAA authorization, spectrum, and environmental qualification for satellites and launch vehicles.' },
  { name: 'Aerospace', body: 'Type certification, airworthiness, and Part 21/23/25 paperwork for crewed and unmanned aviation systems.' },
  { name: 'Nuclear', body: 'Safety analysis reports, license applications, and NRC submissions for advanced reactor developers.' },
]

export default function Verticals() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-midnight px-6 py-24 text-cloud md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="inline-flex rounded-full bg-cloud/10 px-3 py-1 font-sans text-xs font-medium tracking-wide text-cloud/70">
            Who we serve
          </span>
          <h2 className="mt-5 max-w-md font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-cloud md:text-5xl">
            We work with teams building the hardest things in mission-critical industries.
          </h2>
          <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-cloud/60">
            Where compliance isn't optional, and failure isn't abstract.
          </p>
        </div>

        <div className="divide-y divide-cloud/15 lg:pt-2">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="py-6 first:pt-0"
            >
              <h3 className="font-sans text-lg font-medium text-cloud">{v.name}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-cloud/55">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
