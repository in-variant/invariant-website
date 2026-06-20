import { motion } from 'framer-motion'

/**
 * Hero, structured exactly to Pax's spec.
 *
 *   - Section: min-h-[100svh] sm:min-h-[760px] lg:min-h-[800px], -mt-16 so it
 *     pulls up under the fixed nav (which sits transparent on top).
 *   - Single dark overlay (bg-ink/60), no multi-layer gradients.
 *   - Content stack centered in max-w-[46rem] container.
 *   - Explicit <span class="block sm:whitespace-nowrap"> line breaks on both
 *     headline and subhead so wrap is predictable, not text-balance roulette.
 *   - Headline uses clamp() like Pax for fluid sizing across the breakpoints.
 *   - CTA matches Pax exactly: h-11, px-4, text-[15px], leading-6.
 *   - Font: Fraunces (closest free analog to Pax's commercial "SeasonMix")
 *     with display optical-size and slightly elevated grade for authority.
 */
export default function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-ink sm:min-h-[820px] md:min-h-[880px] lg:min-h-[920px]">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Single dark overlay, exactly like Pax */}
      <div aria-hidden="true" className="absolute inset-0 z-20 bg-ink/60" />

      {/* Content stack, with pt-16 to clear the fixed nav */}
      <div className="relative z-30 flex flex-1 flex-col pt-16">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-16">
          {/* Inner container biased toward the lower third of the hero */}
          <div className="mx-auto mt-[20vh] flex w-full max-w-[46rem] flex-col items-center sm:mt-[24vh] md:mt-[28vh]">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              // SeasonMix is single-weight (400) — no font-variation-settings needed.
              // Fraunces fallback still receives the variation if SeasonMix fails to load.
              style={{ fontVariationSettings: '"opsz" 144, "GRAD" 0, "SOFT" 0, "wght" 400' }}
              className="font-display text-cloud text-[clamp(1.75rem,7vw,2.5rem)] leading-[1.1] tracking-[-0.02em] sm:text-[clamp(2.5rem,5.5vw,3.25rem)] sm:leading-[1.05] md:text-[clamp(3rem,5vw,3.75rem)]"
            >
              <span className="block sm:whitespace-nowrap">The new standard for space</span>
              <span className="block sm:whitespace-nowrap">and nuclear compliance.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-cloud text-[clamp(0.75rem,3.5vw,1rem)] leading-[1.5] sm:text-[18px]"
            >
              <span className="block sm:whitespace-nowrap">Autonomous agents that accelerate compliance</span>
              <span className="block sm:whitespace-nowrap">in mission-critical industries.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex justify-center"
            >
              <a
                href="mailto:founders@invariant-ai.com?subject=Invariant%20conversation"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 bg-cloud px-4 font-sans text-[15px] font-medium leading-6 text-ink transition-colors hover:bg-mineral"
              >
                Talk to an expert
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
