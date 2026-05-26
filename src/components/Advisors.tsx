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
    <section ref={ref} className="bg-midnight px-6 py-20 text-cloud md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Advisors</p>
        <h2 className="mt-5 font-serif text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-cloud md:text-4xl">
          Guided by those who've built the hardest things.
        </h2>

        <div className="mt-12 flex flex-col items-center">
          {ADVISORS.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <img src={a.photo} alt={a.name} className="h-20 w-20 rounded-full object-cover grayscale" />
              <h3 className="mt-4 font-sans text-lg font-medium text-cloud">{a.name}</h3>
              <p className="mt-1 font-sans text-sm text-cloud/55">{a.role}</p>
              <p className="font-sans text-sm text-cloud/40">{a.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
