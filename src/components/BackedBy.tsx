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
    <section className="bg-ink px-6 pb-8 pt-4 md:px-12 md:py-10 lg:px-20">
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
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:flex-nowrap sm:gap-x-9">
          <img
            src="/logos/transpose-platform.svg"
            alt="Transpose Platform"
            className="h-3.5 w-auto max-w-[38vw] object-contain opacity-75 sm:h-4 sm:max-w-none"
            width={249}
            height={32}
            loading="lazy"
          />
          <span aria-hidden="true" className="hidden h-4 w-px bg-cloud/20 sm:block" />
          <img
            src="/logos/entrepreneurs-first.svg"
            alt="Entrepreneurs First"
            className="h-2 w-auto max-w-[38vw] object-contain opacity-75 sm:h-[9px] sm:max-w-none"
            width={173}
            height={12}
            loading="lazy"
          />
          <span aria-hidden="true" className="hidden h-4 w-px bg-cloud/20 sm:block" />
          <img
            src="/logos/nvidia-inception.svg"
            alt="NVIDIA Inception Program"
            className="h-5 w-auto max-w-[38vw] object-contain opacity-75 sm:h-6 sm:max-w-none"
            width={200}
            height={48}
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  )
}
