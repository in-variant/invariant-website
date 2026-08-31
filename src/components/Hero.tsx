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
 * Hero: a short silent opener, then the film.
 *
 * Two stacked video elements. The 2.2s opener autoplays on landing and gives
 * the page something to look at while the main film buffers — and, since the
 * film carries audio, a beat before anything could make a sound. When the
 * opener ends the two cross-fade and the film takes over and loops. The
 * opener is far brighter than the film's opening shot, so it dims over its
 * last second to meet it rather than cutting from daylight to near-black.
 *
 * The film starts muted and stays muted until the control in the corner is
 * pressed. If the toggle is pressed while the opener is still running, the
 * intent is held and applied the moment the film starts.
 *
 * Copy is driven by the FILM's clock, not by mount, so it holds, steps out
 * mid-film and repeats identically on every loop.
 */
export default function Hero() {
  const introRef = useRef<HTMLVideoElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Muted by default and stays muted until the visitor asks for sound.
  // Autoplay with audio is blocked by browsers anyway, and unprompted audio
  // on a landing page is hostile.
  const [muted, setMuted] = useState(true)
  const mutedRef = useRef(true)
  const [introDone, setIntroDone] = useState(false)
  const [introDim, setIntroDim] = useState(false)
  const [copyIn, setCopyIn] = useState(false)
  const reduced = useReducedMotion()

  // The opener plays once, then hands over. Anything that goes wrong with it —
  // blocked autoplay, a missing file, a decode error — hands over immediately
  // rather than leaving the hero sitting on a still.
  useEffect(() => {
    const i = introRef.current
    if (!i) {
      setIntroDone(true)
      return
    }
    const handOver = () => setIntroDone(true)
    // The opener sits around luma 141 and the film opens near 28 — a straight
    // opacity swap between them reads as a brightness jump. Ramp the opener
    // down over its last second so the two match at the point of the cut.
    const onTime = () => {
      const d = i.duration
      if (Number.isFinite(d) && d > 0 && i.currentTime >= d - 1) setIntroDim(true)
    }
    i.addEventListener('timeupdate', onTime)
    i.addEventListener('ended', handOver)
    i.addEventListener('error', handOver)
    i.muted = true
    void i.play().catch(handOver)
    // Backstop: never sit on the opener longer than it can possibly run.
    const guard = window.setTimeout(handOver, 6000)
    return () => {
      i.removeEventListener('timeupdate', onTime)
      i.removeEventListener('ended', handOver)
      i.removeEventListener('error', handOver)
      window.clearTimeout(guard)
    }
  }, [])

  // Start the film the moment the opener is done, honouring the sound choice
  // if the visitor already made one.
  useEffect(() => {
    if (!introDone) return
    const v = videoRef.current
    if (!v) return
    v.muted = mutedRef.current
    if (!v.muted) v.volume = 1
    void v.play().catch(() => {})
  }, [introDone])

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
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    const v = videoRef.current
    if (!v) return
    v.muted = next
    if (!next) v.volume = 1
    // Only nudge playback once the film is actually the one on screen.
    if (!v.paused || introDone) void v.play().catch(() => {})
  }, [introDone])

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Opener, then the film. Both fill the frame and swap on opacity, so
          there is never a black gap between them. The film does not autoplay —
          it is started by hand once the opener hands over. */}
      <div className="absolute inset-0">
        <video
          ref={introRef}
          className="absolute inset-0 size-full object-cover"
          style={{
            opacity: introDone ? 0 : 1,
            filter: `brightness(${introDim ? 0.34 : 1})`,
            transition: 'opacity 900ms ease-out, filter 1000ms linear',
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/video/hero-intro-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/hero-intro.webm" type="video/webm" />
          <source src="/video/hero-intro.mp4" type="video/mp4" />
        </video>

        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          style={{ opacity: introDone ? 1 : 0, transition: 'opacity 900ms ease-out' }}
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
