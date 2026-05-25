import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ADVISORS = [
  {
    name: 'Charles Keller',
    role: 'Nuclear licensing & advanced reactor deployment',
    org: 'InTomes Consultancy',
    photo: `${import.meta.env.BASE_URL}advisors/charles-keller.jpg`,
  },
]

export default function Advisors() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="border-t border-ink/[0.06] bg-white px-6 py-20 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex rounded-full bg-ink/[0.05] px-3 py-1 font-grotesk text-xs font-medium tracking-wide text-ink/60">
          Advisors
        </span>
        <h2 className="mt-5 font-sans text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-3xl">
          Guided by those who've built the hardest things.
        </h2>

        <div className="mt-10 flex flex-col items-center">
          {ADVISORS.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <img src={a.photo} alt={a.name} className="h-20 w-20 rounded-full object-cover grayscale" />
              <h3 className="mt-4 font-sans text-lg font-semibold text-ink">{a.name}</h3>
              <p className="mt-0.5 font-sans text-sm text-ink/55">{a.role}</p>
              <p className="font-sans text-sm text-ink/40">{a.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
