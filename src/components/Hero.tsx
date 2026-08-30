import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/** Speaker glyph, crossed out when the film is muted. */
/** Windows, in seconds of film, where the copy is on screen.
 *
 *  The opening shots carry themselves, so nothing appears until 17s; the film
 *  has its own business between 25s and 36s that the type would fight, so it
 *  steps out and comes back. All of it is measured against the video's own
 *  clock rather than page load, so the sequence repeats on every loop. */
const COPY_WINDOWS: readonly (readonly [number, number])[] = [
  [17, 25],
  [36, Number.POSITIVE_INFINITY],
]

const copyVisibleAt = (t: number) =>
  COPY_WINDOWS.some(([from, to]) => t >= from && t < to)

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
      <path
        d="M4 7.5h2.6L10.5 4v12L6.6 12.5H4z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {on ? (
        <>
          <path d="M13.4 7.2a3.8 3.8 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M15.6 5a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      ) : (
        <path d="M13.5 7.5l4 5m0-5l-4 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      )}
    </svg>
  )
}

/**
 * Hero: the film, with the type seated lower-left.
 *
 * The centred stack, the CTA and the investor row have moved off this frame —
 * the video is the hero, and anything laid over the middle of it fights the
 * picture. Backers now sit in their own strip below the fold.
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
  const videoRef = useRef<HTMLVideoElement>(null)
  // Muted by default and stays muted until the visitor asks for sound.
  // Autoplay with audio is blocked by browsers anyway, and unprompted audio
  // on a landing page is hostile.
  const [muted, setMuted] = useState(true)
  const [copyIn, setCopyIn] = useState(false)
  const reduced = useReducedMotion()

  // Tie the copy to the film's clock rather than to mount. On a mount-time
  // delay the type appeared once and then stayed through every loop; driving
  // it off currentTime means it clears when the film restarts and returns on
  // the same beat each time round.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setCopyIn(copyVisibleAt(v.currentTime))
    v.addEventListener('timeupdate', onTime)
    // If the film never plays — blocked, failed to load, no source — the hero
    // must not be left wordless, so reveal the copy anyway.
    const fallback = window.setTimeout(
      () => {
        const el = videoRef.current
        if (!el || el.paused || el.readyState < 2) setCopyIn(true)
      },
      (COPY_WINDOWS[0][0] + 2) * 1000,
    )
    return () => {
      v.removeEventListener('timeupdate', onTime)
      window.clearTimeout(fallback)
    }
  }, [])

  const toggleSound = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const next = !v.muted
    v.muted = next
    if (!next) v.volume = 1
    setMuted(next)
    void v.play().catch(() => {})
  }, [])

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-film-poster.jpg"
          aria-label="Invariant film"
        >
          <source src="/video/hero-film.webm" type="video/webm" media="(min-width: 768px)" />
          <source src="/video/hero-film.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/video/hero-film-mobile.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scrims. Light — the film carries the frame; we only darken enough
          at the foot to seat the headline and at the head to hold the nav. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        style={{
          background: [
            'linear-gradient(to bottom, rgba(10,16,28,0.40) 0%, rgba(10,16,28,0.12) 20%, rgba(10,16,28,0) 38%)',
            'linear-gradient(to top, rgba(10,16,28,0.55) 0%, rgba(10,16,28,0.22) 20%, rgba(10,16,28,0) 44%)',
          ].join(','),
        }}
      />

      {/* Corner scrim, arriving with the copy so the frame stays clean until
          the type does. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        initial={false}
        animate={{ opacity: copyIn ? 1 : 0 }}
        transition={{ duration: reduced ? 0.01 : copyIn ? 1.6 : 0.6, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(115% 85% at 0% 100%, rgba(10,16,28,0.72) 0%, rgba(10,16,28,0.34) 40%, rgba(10,16,28,0) 70%)',
        }}
      />

      {/* Dot weave + grain. A fine screen over the picture, the way a
          broadcast frame reads off a CRT, plus a drifting grain plate. Both
          are pure CSS so they stay crisp at any resolution and cost the video
          nothing in bitrate. */}
      <div aria-hidden="true" className="hero-mesh absolute inset-0 z-20" />
      <div aria-hidden="true" className="hero-grain absolute inset-0 z-20" />

      {/* Content: seated lower-left. The film is the hero, so the type sits
          out of the centre of frame rather than on top of the subject. */}
      <div className="relative z-30 flex flex-1 flex-col justify-end px-6 pb-10 pt-16 sm:px-10 sm:pb-12 lg:px-24">
        <div className="w-full">
          <motion.h1
            initial={false}
            animate={{ opacity: copyIn ? 1 : 0 }}
            transition={{ duration: reduced ? 0.01 : copyIn ? 1.5 : 0.6, ease: 'easeOut' }}
            style={{ fontVariationSettings: '"opsz" 144, "GRAD" 0, "SOFT" 0, "wght" 400' }}
            className="font-display text-cloud text-[clamp(1.85rem,3.9vw,3.1rem)] leading-[1.08] tracking-[-0.02em]"
          >
            <span className="block">The new standard for</span>
            <span className="block">mission critical compliance.</span>
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: copyIn ? 1 : 0 }}
            transition={{
              duration: reduced ? 0.01 : copyIn ? 1.5 : 0.6,
              delay: reduced || !copyIn ? 0 : 0.45,
              ease: 'easeOut',
            }}
            className="mt-4 font-sans text-[15px] leading-relaxed text-cloud/70 sm:whitespace-nowrap"
          >
            Autonomous agents that accelerate compliance in space and nuclear.
          </motion.p>
        </div>
      </div>

      {/* Sound control. Sits on the right edge, clear of the centred
          content stack, and always reports the true state. */}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        className="absolute bottom-5 right-5 z-40 inline-flex items-center gap-1.5 rounded-full border border-cloud/25 bg-ink/30 px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-cloud/85 backdrop-blur-sm transition-colors hover:border-cloud/60 hover:bg-cloud hover:text-ink sm:bottom-7 sm:right-8 lg:right-12"
      >
        <SoundIcon on={!muted} />
        <span className="hidden sm:inline">{muted ? 'Sound off' : 'Sound on'}</span>
      </button>

    </section>
  )
}
