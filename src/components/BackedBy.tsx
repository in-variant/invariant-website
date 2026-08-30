import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Backer strip.
 *
 * Moved off the hero: the film is the hero, and a logo row sitting on top of
 * it read as a second CTA. Here it is a credential line under the fold, at
 * wordmark heights that optically match each other rather than at matched
 * pixel widths.
 */
export default function BackedBy() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-ink px-6 py-8 md:px-12 md:py-10 lg:px-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-7xl flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10"
      >
        <span className="font-sans text-[11px] uppercase leading-none tracking-[0.14em] text-cloud/45">
          Backed by
        </span>
        <div className="flex items-center gap-6 sm:gap-9">
          <img
            src="/logos/transpose-platform.svg"
            alt="Transpose Platform"
            className="h-4 w-auto opacity-75"
            width={249}
            height={32}
            loading="lazy"
          />
          <span aria-hidden="true" className="h-4 w-px bg-cloud/20" />
          <img
            src="/logos/entrepreneurs-first.svg"
            alt="Entrepreneurs First"
            className="h-[9px] w-auto opacity-75"
            width={173}
            height={12}
            loading="lazy"
          />
          <span aria-hidden="true" className="h-4 w-px bg-cloud/20" />
          <img
            src="/logos/nvidia-inception.svg"
            alt="NVIDIA Inception Program"
            className="h-6 w-auto opacity-75"
            width={200}
            height={48}
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  )
}
