import { Link } from 'react-router-dom'
import { KeystoneMark } from './Logo'

// Pax-tight. Three columns of what matters about Invariant. Everything
// else (guides, deep dives) lives under /compliance and /blog and is
// reachable via the nav.
const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', to: '/product' },
      { label: 'Probe', to: '/probe' },
      { label: 'Research', to: '/research' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Nuclear', to: '/nuclear-compliance' },
      { label: 'Space', to: '/space-compliance' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Trust', to: '/trust' },
      { label: 'Contact', to: 'mailto:founders@invariant-ai.com' },
    ],
  },
]

/**
 * Faint compass-arc pattern. Concentric arcs from above the footer + a
 * handful of vertical/diagonal lines, all at low opacity. Same trick Pax
 * uses to give the dark footer some depth without putting an image there.
 */
function CompassPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-cloud"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.08">
        {/* Concentric horizontal arcs centered on top */}
        <path d="M -200 240 Q 800 -120 1800 240" />
        <path d="M -200 380 Q 800 20 1800 380" />
        <path d="M -200 520 Q 800 160 1800 520" />
        <path d="M -200 660 Q 800 300 1800 660" />
        <path d="M -200 800 Q 800 440 1800 800" />
        <path d="M -200 940 Q 800 580 1800 940" />
        {/* Crossing radial-ish lines */}
        <line x1="800" y1="-100" x2="800" y2="1100" />
        <line x1="500" y1="-100" x2="1100" y2="1100" />
        <line x1="1100" y1="-100" x2="500" y2="1100" />
        <line x1="200" y1="-100" x2="1400" y2="1100" />
        <line x1="1400" y1="-100" x2="200" y2="1100" />
      </g>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cloud">
      <CompassPattern />

      {/* Closing CTA — Pax-shape */}
      <div className="relative px-6 pb-24 pt-24 text-center md:pb-32 md:pt-32 lg:pb-40 lg:pt-40">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-cloud md:text-5xl lg:text-[3.5rem]">
          From spec to launch.
          <br />
          <span className="text-cloud/45">From spec to first power.</span>
        </h2>
        <a
          href="mailto:founders@invariant-ai.com?subject=Invariant%20conversation"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-cloud px-6 font-sans text-[15px] font-medium text-ink transition-colors hover:bg-mineral md:mt-10"
        >
          Talk to an expert
        </a>
      </div>

      {/* Logo + link columns */}
      <div className="relative mx-auto max-w-6xl px-6 pb-10 md:px-12 lg:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 text-cloud">
              <KeystoneMark className="h-[20px] w-auto" />
              <span className="font-display text-[22px] font-normal leading-none tracking-[-0.015em]">Invariant</span>
            </div>
            <p className="mt-5 font-sans text-sm leading-relaxed text-cloud/55">
              Autonomous AI agents for mission-critical compliance.
            </p>
            <a
              href="mailto:founders@invariant-ai.com"
              className="mt-4 inline-block font-sans text-sm text-cloud/75 underline decoration-cloud/25 underline-offset-4 transition-colors hover:text-copper"
            >
              founders@invariant-ai.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 md:gap-x-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-cloud/45">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((lnk) => (
                    <li key={lnk.to}>
                      {lnk.to.startsWith('mailto:') || lnk.to.startsWith('http') ? (
                        <a href={lnk.to} className="font-sans text-sm text-cloud/70 transition-colors hover:text-copper">
                          {lnk.label}
                        </a>
                      ) : (
                        <Link to={lnk.to} className="font-sans text-sm text-cloud/70 transition-colors hover:text-copper">
                          {lnk.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cloud/12 pt-6 text-cloud/45 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p className="font-sans text-[11px] uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Invariant · Backed by Entrepreneurs First
          </p>
          <a href="mailto:founders@invariant-ai.com" className="font-sans text-xs transition-colors hover:text-copper">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
