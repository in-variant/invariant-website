import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: '0.9693', label: 'nDCG@10, state of the art on FermiBench (Helion-512)' },
  { value: '10×', label: 'faster compliance documentation with agentic AI' },
  { value: '5', label: 'regulators covered, from the NRC to the DGCA' },
]

export default function Metrics() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="border-t border-ink/[0.06] bg-white px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-sans text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-4xl">
          State of the art.
          <br />
          Built to defend.
        </h2>

        <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            >
              <p className="font-sans text-5xl font-semibold tracking-[-0.03em] text-ink md:text-6xl">
                {s.value}
              </p>
              <p className="mt-3 max-w-[15rem] font-sans text-sm leading-relaxed text-ink/55">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
