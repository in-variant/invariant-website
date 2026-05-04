import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LOGOS = [
  { src: '/team/iisc-logo.png', alt: 'Indian Institute of Science' },
  { src: '/team/kgp-logo.png', alt: 'IIT Kharagpur' },
  { src: '/team/iitj-logo.png', alt: 'IIT Jodhpur' },
  { src: '/team/skyroot-logo.jpeg', alt: 'Skyroot Aerospace' },
  { src: '/team/wbd-logo.png', alt: 'Warner Bros. Discovery' },
  { src: '/team/galaxeye-logo.png', alt: 'GalaxEye' },
  { src: '/team/linkedin-logo.webp', alt: 'LinkedIn' },
]

export default function BuiltByTeamFrom() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section className="bg-white border-t border-ink/[0.06]">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 py-16 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="section-label text-center mb-10"
        >
          Built by team from
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14 lg:gap-x-16 max-w-4xl mx-auto"
        >
          {LOGOS.map((logo, i) => (
            <motion.img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.08,
                duration: 0.5,
                ease: 'easeOut',
              }}
              className="h-10 md:h-12 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
