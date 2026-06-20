/**
 * PlatformShowcase — "What the platform does"
 *
 * The Pax-equivalent of the "Top enterprises use Pax for" section.
 *   Left column: vertical marquee of capabilities, mask-faded top/bottom.
 *   Center: thin SVG lines from each capability converging to the right
 *   panel with small bright pulse marks travelling along each line on a
 *   stagger so the section feels like data flowing.
 *   "Explore the platform" pill sits at the convergence point.
 *   Right column: actual screenshot of the Invariant platform (document
 *   editor with AI agent panel). Not a mockup — the real product.
 *
 * Marquee keyframes live in src/index.css (capability-marquee-up).
 */

// Sources that flow into the platform — the marquee + flow lines read as
// ingestion. Mix of customer artefacts a real licensing team would actually
// hand over (design basis, topicals), the regulator corpus (10 CFR, 14 CFR,
// ASME), and the live feeds we watch on their behalf (Federal Register,
// ADAMS). Anything that reads like a placeholder ("test data") was cut.
const CAPABILITIES = [
  'Design basis',
  'Topical reports',
  '10 CFR Part 50',
  '14 CFR Part 450',
  'ASME III codes',
  'NRC ADAMS',
  'Federal Register',
]

// ── SVG flow lines + animated pulses ─────────────────────────────────────
function FlowLines() {
  const positions = CAPABILITIES.map((_, i) => (i + 0.5) * (100 / CAPABILITIES.length))
  const centerIdx = Math.floor(CAPABILITIES.length / 2)
  const FLOW_MS = 2400
  const STAGGER = FLOW_MS / CAPABILITIES.length

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      {positions.map((y, i) => {
        const center = i === centerIdx
        return (
          <path
            key={`base-${i}`}
            d={`M0,${y} L40,${y} L100,50`}
            stroke="rgb(236,234,231)"
            strokeWidth={center ? 1.25 : 1}
            strokeOpacity={center ? 0.32 : 0.14}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}

      {positions.map((y, i) => {
        const delaySec = (i * STAGGER) / 1000
        const path = `M0,${y} L40,${y} L100,50`
        const center = i === centerIdx
        return (
          <g key={`pulse-${i}`} opacity="0">
            <line
              x1="-4"
              x2="4"
              y1="0"
              y2="0"
              stroke="rgb(236,234,231)"
              strokeWidth={center ? 3.4 : 3}
              strokeLinecap="round"
              strokeOpacity={center ? 0.28 : 0.18}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="-3"
              x2="3"
              y1="0"
              y2="0"
              stroke="rgb(236,234,231)"
              strokeWidth={center ? 1.4 : 1.1}
              strokeLinecap="round"
              strokeOpacity={center ? 0.95 : 0.7}
              vectorEffect="non-scaling-stroke"
            />
            <animateMotion
              path={path}
              dur={`${FLOW_MS}ms`}
              begin={`${delaySec}s`}
              repeatCount="indefinite"
              calcMode="linear"
              rotate="auto"
            />
            <animate
              attributeName="opacity"
              values="0;1;0.42;0"
              keyTimes="0;0.14;0.62;1"
              dur={`${FLOW_MS}ms`}
              begin={`${delaySec}s`}
              repeatCount="indefinite"
              calcMode="linear"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ── Section ──────────────────────────────────────────────────────────────
export default function PlatformShowcase() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-cloud sm:py-24 lg:py-28">
      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-center gap-2 lg:justify-start">
          <span aria-hidden="true" className="size-1 shrink-0 bg-cloud/60" />
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-cloud/60">
            What the platform does
          </span>
        </div>

        <div className="relative mt-6 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-0">
          {/* LEFT: capability marquee + flow lines + center button */}
          <div className="relative z-20 flex items-stretch justify-center lg:-translate-y-10 lg:justify-start">
            <div
              className="relative overflow-hidden"
              style={{
                height: 420,
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.72) 32%, #000 46%, #000 54%, rgba(0,0,0,0.72) 68%, rgba(0,0,0,0.35) 84%, transparent)',
                maskImage:
                  'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35) 16%, rgba(0,0,0,0.72) 32%, #000 46%, #000 54%, rgba(0,0,0,0.72) 68%, rgba(0,0,0,0.35) 84%, transparent)',
              }}
            >
              <ul
                className="flex transform-gpu flex-col items-center will-change-transform lg:items-start"
                style={{ animation: 'capability-marquee-up 18s linear infinite' }}
              >
                {[...CAPABILITIES, ...CAPABILITIES].map((cap, i) => (
                  <li
                    key={`${cap}-${i}`}
                    aria-hidden={i >= CAPABILITIES.length}
                    style={{ height: 60 }}
                    className="flex items-center whitespace-nowrap font-display text-[1.75rem] leading-none tracking-tight text-cloud sm:text-[2rem]"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden="true"
              className="relative hidden flex-1 lg:block"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 28%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent, black 28%, black 100%)',
              }}
            >
              <FlowLines />
            </div>

            <div className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 translate-x-1/2 lg:block">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-cloud/40 blur-lg"
              />
              <a
                href="/product"
                className="inline-flex h-[38px] shrink-0 items-center justify-center rounded-full border border-ink/10 bg-cloud px-5 text-[15px] font-medium text-ink shadow-lg transition-colors hover:bg-mineral"
              >
                Explore the platform
              </a>
            </div>
          </div>

          {/* Mobile-only CTA below the marquee */}
          <a
            href="/product"
            className="inline-flex h-11 shrink-0 items-center justify-center justify-self-center rounded-full border border-cloud/30 bg-cloud/10 px-6 text-base font-medium text-cloud transition-colors hover:bg-cloud hover:text-ink lg:hidden"
          >
            Explore the platform
          </a>

          {/* RIGHT: actual platform screenshot */}
          <div className="relative z-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(60% 60% at 55% 40%, rgba(246,242,234,0.12), transparent 70%)',
              }}
            />
            <div className="overflow-visible lg:ml-8 lg:w-[clamp(760px,68vw,1040px)] xl:ml-10">
              <div className="w-full overflow-hidden rounded-2xl border border-cloud/10 bg-cloud/[0.03] p-2 shadow-2xl backdrop-blur-md">
                <img
                  src="/platform/document-editor.jpg"
                  alt="The Invariant platform. PSAR drafting workspace with an agent generating a compliance filing."
                  className="block w-full rounded-lg"
                  loading="lazy"
                  width="2000"
                  height="1044"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
