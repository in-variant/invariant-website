import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

const ADVISORS = [
  {
    name: 'Charles Keller',
    description: 'Nuclear licensing and advanced reactor deployment',
    photo: '/advisors/charles-keller.jpg',
  },
  {
    name: 'Vivin Rana',
    description: 'Co-Founder @ Leher | Building Drone Spraying Intelligence',
    photo: '/advisors/vivin-rana.jpg',
  },
]

export default function Advisors() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§7" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-ink/50 mb-8">
          Advisors
        </p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-16"
        >
          Guided by those who've built the hardest things.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {ADVISORS.map((advisor, i) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="flex items-start gap-5"
            >
              <img
                src={advisor.photo}
                alt={advisor.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0 grayscale"
              />
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-medium text-ink mb-2">
                  {advisor.name}
                </h3>
                <p className="font-mono text-base text-ink/60">
                  {advisor.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
