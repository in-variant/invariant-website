import { useState } from 'react'
import posthog from '../posthog'

/**
 * DemoVideo — the 96s product walkthrough, click-to-play.
 *
 * Deliberately NOT autoplaying. The home hero already runs a full-bleed
 * background video and PlatformShowcase already animates its flow lines;
 * a third moving element would fight both, and the clip carries audio that
 * only means something if the viewer opted in. Click-to-play also keeps the
 * bytes off first paint (preload="none", nothing fetched until the click).
 *
 * Renders the media only. Each caller supplies its own frame so the light
 * (Product) and dark (Home) sections keep their existing chrome.
 */
export default function DemoVideo({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <video
        className={`block aspect-video w-full rounded-lg bg-ink ${className}`}
        src="/video/demo.mp4"
        poster="/video/demo-poster.jpg"
        controls
        autoPlay
        playsInline
        preload="none"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        posthog.capture('demo_video_started', { video_name: 'product_walkthrough' })
        setPlaying(true)
      }}
      aria-label="Play the Invariant product demo, 1 minute 36 seconds"
      className="group relative block aspect-video w-full overflow-hidden rounded-lg"
    >
      <img
        src="/video/demo-poster.jpg"
        alt="The Invariant workspace. A satellite authorisation form being filled field by field, each answer carrying its source citation."
        className="block size-full object-cover"
        loading="lazy"
        width="1920"
        height="1080"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/10"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cloud shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 md:size-20"
      >
        <svg viewBox="0 0 16 16" className="ml-1 size-5 fill-ink md:size-6">
          <path d="M2 1.5v13l12-6.5z" />
        </svg>
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 font-sans text-[11px] font-medium tracking-[0.04em] text-cloud backdrop-blur-sm">
        1:36
      </span>
    </button>
  )
}
