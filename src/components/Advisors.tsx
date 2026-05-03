import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ADVISORS = [
  {
    name: 'Charles Keller',
    description: 'Nuclear licensing and advanced reactor deployment',
    photo: `${import.meta.env.BASE_URL}advisors/charles-keller.jpg`,
  },
]

export default function Advisors() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-[#FAFAF9] border-t border-ink/[0.06]">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs tracking-[0.25em] uppercase text-ink/40 mb-4"
          >
            Advisors
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl"
          >
            Guided by those who've built the hardest things.
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-16 max-w-3xl mx-auto">
          {ADVISORS.map((advisor, i) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <img
                src={advisor.photo}
                alt={advisor.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 grayscale mb-4"
              />
              <h3 className="font-serif text-xl md:text-2xl font-medium text-ink mb-1">
                {advisor.name}
              </h3>
              <p className="font-mono text-sm text-ink/50">
                {advisor.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
