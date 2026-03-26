import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

export default function EarlyAccess() {
  const [email, setEmail] = useState('')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§8" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-8"
          >
            We're working with a small number of design partners.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="body-technical mb-12"
          >
            If you're facing a licensing program and want to explore what AI-assisted authorship could do for your team, we'd like to talk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 px-4 py-3 font-mono text-base bg-transparent border border-ink/15 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink/40 transition-colors"
            />
            <a
              href={`mailto:hello@invariant.ai?subject=Design Partner Inquiry&body=I'd like to learn more about Invariant.`}
              className="px-6 py-3 bg-ink text-white font-mono text-base tracking-wide hover:bg-ink/85 transition-colors text-center whitespace-nowrap"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
