import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  { title: 'Citation integrity', body: 'Every claim traced to the rule it satisfies. No invented citations.' },
  { title: 'Regulatory fluency', body: 'Tuned on NRC, FAA, FCC, IN-SPACe and DGCA standards.' },
  { title: 'Document automation', body: 'Draft safety analysis reports and license applications in hours.' },
  { title: 'Audit-ready trails', body: 'Every decision logged for the regulator to follow.' },
]

export default function Platform() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-paper px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="inline-flex rounded-full bg-ink/[0.05] px-3 py-1 font-sans text-xs font-medium tracking-wide text-ink/60">The platform</span>
          <h2 className="mt-5 max-w-md font-serif text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
            Compliance, drafted and defended by AI.
          </h2>
          <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-ink/60">
            Agentic systems tuned on regulatory terminology compress documentation, review, and
            submission from months into days.
          </p>
        </div>

        <div className="divide-y divide-ink/10 lg:pt-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="py-6 first:pt-0"
            >
              <h3 className="font-sans text-lg font-medium text-ink">{f.title}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-ink/60">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
