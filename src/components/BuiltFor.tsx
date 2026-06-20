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
    <section ref={ref} className="bg-paper px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-ink/45"
        >
          Built for businesses where compliance matters
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
          {PARTNERS.map((p, i) => (
            <motion.img
              key={p.name}
              src={p.logo}
              alt={p.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="h-7 w-auto object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-8"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
