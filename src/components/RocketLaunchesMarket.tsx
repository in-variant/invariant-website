import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Global orbital launches vs. compliance spend, 2024–2035
 * (source: rocket_launches_compliance_2024_2035.csv).
 *
 * Two independently-scaled line series share one timeline, each on its own
 * vertical axis so every curve stays readable:
 *   • Orbital launches per year   [left axis]
 *   • Compliance spend ($B)       [right axis]
 */
type Row = {
  year: number
  launches: number // orbital_launches
  compliance: number // compliance_spend_usd_b ($B)
}

const DATA: Row[] = [
  { year: 2024, launches: 259, compliance: 0.8 },
  { year: 2025, launches: 320, compliance: 1.0 },
  { year: 2026, launches: 420, compliance: 1.4 },
  { year: 2027, launches: 500, compliance: 1.9 },
  { year: 2028, launches: 565, compliance: 2.6 },
  { year: 2029, launches: 610, compliance: 3.4 },
  { year: 2030, launches: 660, compliance: 4.5 },
  { year: 2031, launches: 710, compliance: 5.9 },
  { year: 2032, launches: 760, compliance: 7.5 },
  { year: 2033, launches: 820, compliance: 9.0 },
  { year: 2034, launches: 890, compliance: 10.5 },
  { year: 2035, launches: 967, compliance: 12.0 },
]

const LAVENDER = '#2563EB' // orbital launches - blue
const COPPER = '#EA580C' // compliance spend ($B) - orange

// --- chart geometry ---
const W = 1000
const H = 500
const PAD = { left: 72, right: 132, top: 72, bottom: 52 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom
const plotRight = PAD.left + PLOT_W
const baseY = PAD.top + PLOT_H

// two independent vertical scales (one per series).
// the compliance axis is given extra headroom so the launches curve always
// rides above the compliance curve across the full timeline.
const MIN_LAUNCH = 0
const MAX_LAUNCH = 1000
const LAUNCH_TICKS = [0, 250, 500, 750, 1000]
const MIN_COMP = 0
const MAX_COMP = 15
const COMP_TICKS = [0, 5, 10, 15]

const X_TICKS = [0, 3, 6, 9, 11] // 2024, 2027, 2030, 2033, 2035

// axis x-positions: launches left, compliance right
const COMP_AXIS_X = plotRight

const n = DATA.length
const x = (i: number) => PAD.left + (i / (n - 1)) * PLOT_W
const yLaunch = (v: number) =>
  PAD.top + (1 - (v - MIN_LAUNCH) / (MAX_LAUNCH - MIN_LAUNCH)) * PLOT_H
const yComp = (v: number) => PAD.top + (1 - (v - MIN_COMP) / (MAX_COMP - MIN_COMP)) * PLOT_H

function smoothLine(pts: [number, number][]) {
  if (pts.length < 2) return ''
  const t = 0.2
  const d = [`M ${pts[0][0]} ${pts[0][1]}`]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) * t
    const c1y = p1[1] + (p2[1] - p0[1]) * t
    const c2x = p2[0] - (p3[0] - p1[0]) * t
    const c2y = p2[1] - (p3[1] - p1[1]) * t
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

function line(values: number[], scale: (v: number) => number) {
  const pts = values.map((v, i) => [x(i), scale(v)] as [number, number])
  const d = smoothLine(pts)
  // close the smooth path down to the baseline to form an area under the curve
  const area = `${d} L ${pts[n - 1][0]} ${baseY} L ${pts[0][0]} ${baseY} Z`
  return { d, area, last: pts[n - 1] }
}

const LAUNCH = line(DATA.map((d) => d.launches), yLaunch)
const COMP = line(DATA.map((d) => d.compliance), yComp)

export default function RocketLaunchesMarket() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <figure ref={ref} className="not-prose my-2 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 md:p-7">
      <div className="w-full">
        <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-x-visible sm:px-0">
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full min-w-[460px]"
            role="img"
            aria-label="Global orbital launches and compliance spend, 2024–2035: orbital launches rising 259→967 per year (left axis) and compliance spend growing $0.8B→$12B (right axis), each on its own scale."
          >
            <defs>
              <clipPath id="rl-reveal">
                <motion.rect
                  x={0}
                  y={0}
                  height={H}
                  initial={{ width: 0 }}
                  animate={inView ? { width: W } : {}}
                  transition={{ duration: 1.7, ease: [0.4, 0, 0.2, 1] }}
                />
              </clipPath>

              {/* area-under-curve gradients (fade to transparent at the baseline) */}
              <linearGradient id="rl-fill-launch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LAVENDER} stopOpacity={0.18} />
                <stop offset="100%" stopColor={LAVENDER} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rl-fill-comp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COPPER} stopOpacity={0.18} />
                <stop offset="100%" stopColor={COPPER} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* plot title (for standalone screenshots) */}
            <text
              x={W / 2}
              y={34}
              textAnchor="middle"
              className="font-serif"
              fill="#1B2436"
              fontSize={22}
            >
              Orbital Launches &amp; Compliance Spend
            </text>
            <text
              x={W / 2}
              y={54}
              textAnchor="middle"
              className="font-mono"
              fill="#1B2436"
              fillOpacity={0.45}
              fontSize={11}
              letterSpacing="0.12em"
            >
              2024–2035 · TWO INDEPENDENT SCALES
            </text>

            {/* horizontal gridlines (keyed to the launches / left axis) */}
            {LAUNCH_TICKS.map((v) => (
              <line
                key={`grid-${v}`}
                x1={PAD.left}
                y1={yLaunch(v)}
                x2={plotRight}
                y2={yLaunch(v)}
                stroke="#1B2436"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
            ))}

            {/* ===== Axis 1 · Orbital launches · left ===== */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke={LAVENDER} strokeOpacity={0.5} strokeWidth={1} />
            {LAUNCH_TICKS.map((v) => (
              <text
                key={`launch-${v}`}
                x={PAD.left - 10}
                y={yLaunch(v) + 3.5}
                textAnchor="end"
                className="font-mono"
                fill={LAVENDER}
                fillOpacity={0.85}
                fontSize={11}
              >
                {v}
              </text>
            ))}
            <text
              x={4}
              y={PAD.top - 16}
              textAnchor="start"
              className="font-mono"
              fill={LAVENDER}
              fontSize={10}
              letterSpacing="0.08em"
            >
              LAUNCHES
            </text>

            {/* ===== Axis 2 · Compliance spend ($B) · right ===== */}
            <line x1={COMP_AXIS_X} y1={PAD.top} x2={COMP_AXIS_X} y2={baseY} stroke={COPPER} strokeOpacity={0.5} strokeWidth={1} />
            {COMP_TICKS.map((v) => (
              <text
                key={`comp-${v}`}
                x={COMP_AXIS_X + 8}
                y={yComp(v) + 3.5}
                textAnchor="start"
                className="font-mono"
                fill={COPPER}
                fillOpacity={0.8}
                fontSize={11}
              >
                ${v}B
              </text>
            ))}
            <text
              x={COMP_AXIS_X + 8}
              y={PAD.top - 16}
              textAnchor="start"
              className="font-mono"
              fill={COPPER}
              fontSize={10}
              letterSpacing="0.08em"
            >
              COMPLIANCE
            </text>

            {/* X year labels */}
            {X_TICKS.map((i) => (
              <text
                key={`x-${i}`}
                x={x(i)}
                y={baseY + 24}
                textAnchor="middle"
                className="font-mono"
                fill="#1B2436"
                fillOpacity={0.4}
                fontSize={11}
              >
                {DATA[i].year}
              </text>
            ))}

            {/* ===== series (revealed left to right) ===== */}
            <g clipPath="url(#rl-reveal)">
              {/* area fills under each curve */}
              <path d={LAUNCH.area} fill="url(#rl-fill-launch)" stroke="none" />
              <path d={COMP.area} fill="url(#rl-fill-comp)" stroke="none" />

              {/* Orbital launches (left axis) */}
              <path
                d={LAUNCH.d}
                fill="none"
                stroke={LAVENDER}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Compliance spend (right axis) */}
              <path
                d={COMP.d}
                fill="none"
                stroke={COPPER}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* endpoint dots */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.45, delay: 1.5 }}
            >
              <circle cx={LAUNCH.last[0]} cy={LAUNCH.last[1]} r={4} fill={LAVENDER} />
              <circle cx={COMP.last[0]} cy={COMP.last[1]} r={4} fill={COPPER} />
            </motion.g>
          </svg>
        </div>

          {/* legend */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: LAVENDER }} />
              Orbital launches · 259 → 967 / yr
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: COPPER }} />
              Compliance spend · $0.8 → $12B
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
              Global orbital launches · 2024–2035
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
              Two independent scales · one timeline
            </p>
          </div>
      </div>
    </figure>
  )
}
