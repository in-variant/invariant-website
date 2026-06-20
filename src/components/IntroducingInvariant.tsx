import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * "Introducing Invariant" — Pax-shape headline row, four cards below.
 *
 * Each card has a deliberately different overlay treatment so the row reads
 * as four intentional cards, not a templated grid:
 *   1. Drafting        — two asymmetric data pills, bottom-left
 *   2. Citation        — centered linked pair (shrink-wrapped pills + line)
 *   3. RAI response    — two centered data pills, mid-card
 *   4. Monitoring      — convergent workflow with pulsing change indicator
 *
 * Copy uses plain notation ("PSAR 3.9.4", "Claim 3.9.4") — no section sign,
 * no AI-tell punctuation.
 */

type CardSpec = {
  image: string
  label: string
  caption: string
  overlay?: ReactNode
}

// Shared pill chrome: tight, smaller text, hairline ring for definition.
const PILL_CHROME =
  'flex h-7 items-center rounded-[3px] bg-ink/40 px-2.5 text-[11px] font-medium leading-none text-cloud shadow-[0_2px_10px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-cloud/10 backdrop-blur-md'

// ── Data pill: label + value, sized by left/right anchors ────────────────
function DataPill({
  label,
  value,
  top,
  left,
  right,
  delay = 0,
}: {
  label: string
  value: string
  top: string
  left?: string
  right?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ top, left, right }}
      className={`absolute justify-between gap-3 ${PILL_CHROME}`}
    >
      <span className="truncate text-cloud/85">{label}</span>
      <span className="shrink-0 tabular-nums text-cloud">{value}</span>
    </motion.div>
  )
}

// ── Label pill: shrink-wraps to content, centered on a cx anchor ─────────
function LabelPill({
  children,
  top,
  cx,
  delay = 0,
  withDot = false,
}: {
  children: ReactNode
  top: string
  cx: string
  delay?: number
  withDot?: boolean
}) {
  return (
    <div className="absolute -translate-x-1/2" style={{ top, left: cx }}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`gap-2 whitespace-nowrap ${PILL_CHROME}`}
      >
        {withDot && (
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cloud/70 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-cloud" />
          </span>
        )}
        <span>{children}</span>
      </motion.div>
    </div>
  )
}

// ── Overlay 1: two stacked data pills, bottom-left, asymmetric ───────────
function DraftingOverlay() {
  return (
    <>
      <DataPill
        label="PSAR 3.9.4"
        value="Drafted"
        top="62%"
        left="6%"
        right="22%"
        delay={0.25}
      />
      <DataPill
        label="Part 450 MoC"
        value="Ready"
        top="71%"
        left="14%"
        right="10%"
        delay={0.35}
      />
    </>
  )
}

// ── Overlay 2: centered linked pair, both shrink-wrapped on x=50% ────────
function CitationOverlay() {
  return (
    <>
      <LabelPill top="36%" cx="50%" delay={0.25}>
        Flight safety analysis
      </LabelPill>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="cite-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(236,234,231)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="rgb(236,234,231)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="rgb(236,234,231)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <line
          x1="50"
          y1="45"
          x2="50"
          y2="58"
          stroke="url(#cite-line)"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <LabelPill top="58%" cx="50%" delay={0.5}>
        14 CFR 450.115
      </LabelPill>
    </>
  )
}

// ── Overlay 3: centered data pills mid-card ──────────────────────────────
function RaiOverlay() {
  return (
    <>
      <DataPill
        label="RAI 3.7"
        value="Drafted"
        top="52%"
        left="15%"
        right="15%"
        delay={0.25}
      />
      <DataPill
        label="Citations"
        value="27"
        top="61%"
        left="20%"
        right="20%"
        delay={0.35}
      />
    </>
  )
}

// ── Overlay 4: convergent workflow with shrink-wrapped pills ─────────────
function MonitoringOverlay() {
  // Source pills pulled in to cx 26 / 74 (was 22 / 78 — they were touching).
  // Lines converge to the middle pill; bottom pill sits below the convergence.
  return (
    <>
      <LabelPill top="22%" cx="26%" delay={0.25}>
        NRC
      </LabelPill>
      <LabelPill top="22%" cx="74%" delay={0.3}>
        FAA
      </LabelPill>

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="mon-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(236,234,231)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(236,234,231)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path
          d="M 26 31 C 26 41, 50 41, 50 48"
          stroke="url(#mon-line)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 74 31 C 74 41, 50 41, 50 48"
          stroke="url(#mon-line)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="57"
          x2="50"
          y2="67"
          stroke="rgb(236,234,231)"
          strokeOpacity="0.75"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <LabelPill top="49%" cx="50%" delay={0.55} withDot>
        Change detected
      </LabelPill>
      <LabelPill top="68%" cx="50%" delay={0.7}>
        47 filings updated
      </LabelPill>
    </>
  )
}

const CARDS: CardSpec[] = [
  {
    image: '/cards/drafting.jpg',
    label: 'Submissions ready',
    caption: 'PSAR, RAI, MoC. Drafted by agents. Shipped by our engineer.',
    overlay: <DraftingOverlay />,
  },
  {
    image: '/cards/citation.jpg',
    label: 'Citations traced',
    caption: 'Every claim traced to its rule.',
    overlay: <CitationOverlay />,
  },
  {
    image: '/cards/rai.jpg',
    label: 'Replies drafted',
    caption: 'Agents pull the docket. Our engineer sends the reply.',
    overlay: <RaiOverlay />,
  },
  {
    image: '/cards/monitoring.jpg',
    label: 'Rules watched',
    caption: 'Every rule change, flagged in time.',
    overlay: <MonitoringOverlay />,
  },
]

export default function IntroducingInvariant() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section ref={ref} className="bg-paper px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-x-20 lg:items-start">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl lg:text-[3.5rem]"
          >
            A senior licensing engineer, on day one.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md font-sans text-base leading-relaxed text-ink/65"
          >
            Invariant ships nuclear and space filings for you. A forward-deployed
            engineer drives the work. Agents draft, cite, and monitor.
          </motion.p>
        </div>

        <div className="mt-16 h-px w-full bg-ink/10 md:mt-20" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-ink/10">
                <img
                  src={card.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                {card.overlay}
              </div>
              <h3 className="mt-5 font-sans text-base font-semibold text-ink md:text-[17px]">
                {card.label}
              </h3>
              <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/60">
                {card.caption}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
