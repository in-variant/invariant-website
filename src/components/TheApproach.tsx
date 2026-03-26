import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

export default function TheApproach() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§4" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl"
          >
            Grounded in the design.<br />Calibrated to the standard.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:pt-2"
          >
            <p className="body-technical">
              The model ingests design inputs and regulatory frameworks from the start of R&amp;D — not just at the documentation phase. It reasons about which design decisions trigger which regulatory requirements, and what each deliverable must demonstrate.
            </p>
            <p className="body-technical">
              No hallucination tolerance. No invented citations. The standard is not "helpful." It is "defensible."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
