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
    <section className="bg-ink px-4 pb-14 pt-10 text-cloud sm:px-6 sm:pb-16 sm:pt-12 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-center font-display text-[1.5rem] leading-tight tracking-tight sm:text-[1.875rem]">
          File a satellite authorization, hands on.
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-center font-sans text-[15px] leading-relaxed text-cloud/70">
          Click through the real product: an FCC space station application
          drafted field by field, every answer cited back to the rule.
        </p>

        <div className="mt-7 overflow-hidden rounded-2xl border border-cloud/10 bg-cloud/[0.03] p-2 shadow-2xl backdrop-blur-md">
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
