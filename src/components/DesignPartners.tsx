import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PARTNERS = [
  {
    name: 'InTomes Technical Services',
    description: 'Nuclear technical services and licensing consulting',
    url: 'https://intomes.com',
    urlLabel: 'intomes.com',
    logo: `${import.meta.env.BASE_URL}logos/intomes.png`,
  },
  {
    name: 'Akashalabdhi',
    description: 'Space technology company advancing modular space habitats',
    url: 'https://akashalabdhi.space',
    urlLabel: 'akashalabdhi.space',
    logo: `${import.meta.env.BASE_URL}logos/akashalabdhi_logoX2x.png`,
  },
]

export default function DesignPartners() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-ink/50 mb-8">
          Design Partners
        </p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-16"
        >
          Built alongside practitioners.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 mb-5"
              />
              <h3 className="font-serif text-xl md:text-2xl font-medium text-ink mb-2">
                {partner.name}
              </h3>
              <p className="font-mono text-base text-ink/60">
                {partner.description}{' · '}
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/75 hover:text-ink transition-colors underline underline-offset-2 decoration-ink/25 hover:decoration-ink/50"
                >
                  {partner.urlLabel}
                </a>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
