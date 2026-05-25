import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PARTNERS = [
  { name: 'InTomes', logo: '/logos/intomes.png' },
  { name: 'Akashalabdhi', logo: '/logos/akashalabdhi_logoX2x.png' },
]

export default function BuiltFor() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl font-sans text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl"
        >
          Built for businesses where compliance matters.
        </motion.h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:mt-14 md:gap-x-16">
          {PARTNERS.map((p, i) => (
            <motion.img
              key={p.name}
              src={p.logo}
              alt={p.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="h-7 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-8"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
