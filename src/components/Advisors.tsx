import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Advisors. Two names, space first: the practice spans both domains, so the
 * heading has to as well.
 */

const ADVISORS = [
  {
    name: 'Robert Lillis',
    role: 'Principal Investigator, NASA ESCAPADE. Associate Director, Planetary Group.',
    org: 'UC Berkeley Space Sciences Laboratory',
    photo: `${import.meta.env.BASE_URL}advisors/robert-lillis.jpg`,
  },
  {
    name: 'Charles Keller',
    role: 'Nuclear licensing & advanced reactor deployment',
    org: 'InTomes',
    photo: `${import.meta.env.BASE_URL}advisors/charles-keller.jpg`,
  },
]

export default function Advisors() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-paper px-6 py-20 text-ink md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
          Advised by people who've flown the missions and licensed the reactors.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8">
          {ADVISORS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <img
                src={a.photo}
                alt={a.name}
                loading="lazy"
                className="h-20 w-20 rounded-full object-cover grayscale"
              />
              <h3 className="mt-4 font-sans text-lg font-medium text-ink">{a.name}</h3>
              <p className="mt-1 max-w-[30ch] font-sans text-sm leading-relaxed text-ink/65">
                {a.role}
              </p>
              <p className="mt-1 font-sans text-sm text-ink/45">{a.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
