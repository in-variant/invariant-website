import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

const CAPABILITIES = [
  {
    title: 'Design-Phase Guidance',
    description: 'Surfaces regulatory constraints during early engineering, before they become costly rework.',
  },
  {
    title: 'Citation Integrity',
    description: 'Every claim traces back to a source. The daisy-chain of references is verified, not assumed.',
  },
  {
    title: 'Regulatory Fluency',
    description: 'Trained on the acceptance criteria for your domain, not just the words in the standard.',
  },
  {
    title: 'Review-Readiness',
    description: 'Output is structured to survive regulatory scrutiny, not just pass a human read.',
  },
]

export default function TheModel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§3" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-8"
            >
              Not a tool.<br />A compliance service.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="body-technical"
            >
              Invariant delivers AI-native compliance services trained on domain-specific regulatory frameworks. They reason over your design inputs and the standards that govern them, operating across the full lifecycle — from early constraint identification to final documentation.
            </motion.p>
          </div>

          <div className="space-y-8 lg:pt-2">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="border-t border-ink/10 pt-5"
              >
                <h3 className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-ink mb-3">
                  {cap.title}
                </h3>
                <p className="font-mono text-sm md:text-base leading-relaxed text-ink/65">
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
