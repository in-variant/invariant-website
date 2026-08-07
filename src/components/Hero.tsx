import { motion } from 'framer-motion'

/**
 * Hero, structured exactly to Pax's spec.
 *
 *   - Section: min-h-[100svh] at every breakpoint. It must always fill the
 *     viewport on first load: the nav is `fixed` (no flow space) and Layout
 *     gives home no top padding, so the hero starts at y=0 and needs no
 *     negative margin. Do not reintroduce fixed pixel heights here — a
 *     window taller than them exposes the next section beneath the video.
 *   - Dark overlay (bg-ink/60) plus a black vignette, no other gradients.
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
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
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

      {/* Flat tint, then a vignette that darkens the edges so the headline
          sits in the clean centre and the frame reads deliberate. */}
      <div aria-hidden="true" className="absolute inset-0 z-20 bg-ink/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        style={{
          // Two passes rather than one ellipse: a heavy bottom weight that
          // grounds the CTA and meets the paper section as a deliberate
          // edge, plus a lighter squeeze on the left/right. Kept off the
          // top, where the nav already lays its own gradient.
          background: [
            'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.46) 13%, rgba(0,0,0,0.14) 32%, rgba(0,0,0,0) 55%)',
            'linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.14) 15%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.14) 85%, rgba(0,0,0,0.50) 100%)',
          ].join(','),
        }}
      />

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
                href="https://calendar.app.google/mZPkSD8mPEpFCNh89"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border-0 bg-cloud px-4 font-sans text-[15px] font-medium leading-6 text-ink transition-colors hover:bg-mineral"
              >
                Talk to an expert
              </a>
            </motion.div>

            {/* Investor row. Sized well below the mockup: the logos are a
                credential, not a second CTA, so they sit at wordmark heights
                (Transpose 16px, EF 9px, NVIDIA Inception 24px two-deck lockup)
                that optically match each other rather than at matched pixel
                widths. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex flex-col items-center gap-2.5 sm:mt-8"
            >
              <span className="font-sans text-[10px] leading-none text-cloud/55 sm:text-[11px]">
                Backed by
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-[18px]">
                <img
                  src="/logos/transpose-platform.svg"
                  alt="Transpose Platform"
                  className="h-3.5 w-auto opacity-80 sm:h-4"
                  width={249}
                  height={32}
                />
                <span aria-hidden="true" className="h-3.5 w-px bg-cloud/25" />
                <img
                  src="/logos/entrepreneurs-first.svg"
                  alt="Entrepreneurs First"
                  className="h-2 w-auto opacity-80 sm:h-[9px]"
                  width={173}
                  height={12}
                />
                <span aria-hidden="true" className="h-3.5 w-px bg-cloud/25" />
                <img
                  src="/logos/nvidia-inception.svg"
                  alt="NVIDIA Inception Program"
                  className="h-[22px] w-auto opacity-80 sm:h-6"
                  width={164}
                  height={46}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
