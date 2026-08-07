import { useEffect, useRef } from 'react'
import posthog from '../posthog'

/**
 * ArcadeShowcase — the interactive product demo, directly below the hero.
 *
 * Harvey-style: before any pitch copy, the visitor can drive the real
 * product. The embed is an Arcade walkthrough of an FCC NGSO space station
 * authorization filing. The wrapper's padding-bottom follows Arcade's embed
 * spec (demo aspect plus a 41px chrome bar), so don't swap it for
 * aspect-video.
 */

const ARCADE_URL =
  'https://demo.arcade.software/RMcuEWfS9Isyy0LCsSjQ?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true'

export default function ArcadeShowcase() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const captured = useRef(false)

  // Clicks land inside the iframe where autocapture can't see them, so the
  // first engagement is detected via window blur with the iframe focused.
  useEffect(() => {
    const onBlur = () => {
      if (!captured.current && document.activeElement === frameRef.current) {
        captured.current = true
        posthog.capture('arcade_demo_interacted', { source: 'home_below_hero' })
      }
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [])

  return (
    <section className="bg-ink px-4 pb-20 pt-14 text-cloud sm:px-6 sm:pb-24 sm:pt-16 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="size-1 shrink-0 bg-cloud/60" />
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-cloud/60">
            See the platform
          </span>
        </div>

        <h2 className="mt-4 text-center font-display text-[1.75rem] leading-tight tracking-tight sm:text-[2.25rem]">
          File a satellite authorization, hands on.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-sans text-[15px] leading-relaxed text-cloud/70">
          Click through the real product: an FCC space station application
          drafted field by field, every answer cited back to the rule.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-cloud/10 bg-cloud/[0.03] p-2 shadow-2xl backdrop-blur-md">
          <div
            className="relative w-full overflow-hidden rounded-lg"
            style={{ paddingBottom: 'calc(54.3333% + 41px)' }}
          >
            <iframe
              ref={frameRef}
              src={ARCADE_URL}
              title="Interactive demo: submit a space station authorization filing for an FCC NGSO application"
              loading="lazy"
              allow="clipboard-write; autoplay"
              allowFullScreen
              className="absolute left-0 top-0 h-full w-full"
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
