import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'
import FactCards from './FactCards'

export default function TheProblem() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const closingRef = useRef(null)
  const closingInView = useInView(closingRef, { once: true, margin: '-100px' })

  return (
    <section>
      <SectionDivider label="§1" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-12 max-w-3xl"
        >
          Regulation touches every phase of engineering. The tools haven't kept up.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <p className="body-technical">
            Regulations don't just gate the final approval — they shape design decisions, constrain material choices, and dictate testing protocols from day one. Yet the tools engineers use to navigate this complexity haven't changed in decades: manual cross-referencing, tribal knowledge, and consultants who take years to train.
          </p>
        </motion.div>
      </div>

      <FactCards />

      <div ref={closingRef} className="px-6 md:px-12 lg:px-24 xl:px-32 py-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={closingInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="font-serif text-xl md:text-2xl lg:text-3xl text-ink/70 italic max-w-3xl leading-relaxed"
        >
          The documentation is not the afterthought. It is the program.
        </motion.p>
      </div>
    </section>
  )
}
