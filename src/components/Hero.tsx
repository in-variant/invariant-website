import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-ink text-cloud">
      {/* Cinematic loop: shuttle ignition, operating reactor, engineer on the drawing. */}
      <div className="relative h-[88vh] min-h-[560px] w-full md:h-screen">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero.webm" type="video/webm" media="(min-width: 768px)" />
          <source src="/video/hero.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/video/hero-mobile.mp4" type="video/mp4" />
        </video>

        {/* Readability layers: vertical darken so the headline sits clean. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/45 to-ink/75" />
        <div className="pointer-events-none absolute inset-0 bg-ink/15" />

        {/* Copy stack, vertically centered toward the bottom third. */}
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-end px-6 pb-[12vh] text-center md:pb-[10vh] md:px-12">
          <motion.a
            href="https://www.joinef.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-cloud/20 bg-cloud/10 px-4 py-1.5 font-sans text-xs text-cloud/80 backdrop-blur-sm transition hover:border-cloud/40 hover:text-cloud"
          >
            <span>Backed by <span className="text-cloud">Entrepreneurs First</span></span>
            <span aria-hidden="true" className="text-cloud/45">›</span>
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="mt-7 max-w-4xl text-balance font-serif text-[2.5rem] font-normal leading-[1.04] tracking-[-0.025em] text-cloud sm:text-5xl md:text-6xl lg:text-[5.25rem]"
          >
            The new standard for nuclear and space compliance.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="mt-5 max-w-2xl text-balance font-sans text-base leading-relaxed text-cloud/75 md:mt-6 md:text-lg"
          >
            Autonomous AI for the teams licensing the next reactor, satellite, and launch vehicle. Drafts the submission, traces every citation, and watches the rule that supports it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            className="mt-8"
          >
            <a
              href="mailto:founders@invariant-ai.com?subject=Invariant%20licensing%20conversation"
              className="inline-flex items-center gap-2 rounded-full bg-cloud px-6 py-3 font-sans text-sm font-medium text-ink transition hover:bg-copper hover:text-paper"
            >
              Talk to a licensing lead
              <span aria-hidden="true">›</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
