import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Global space industry, 2024,2035
 * (source: space_satellites_spend_compliance_2024_2035.csv).
 *
 * Two independently-scaled line series share one timeline, each on its own
 * vertical axis so every curve stays readable:
 *   • Satellites in orbit       [left axis]
 *   • Compliance spend ($B)     [right axis]
 */
type Row = {
  year: number
  sats: number // satellites_in_orbit
  compliance: number // compliance_spend_usd_b ($B)
}

const DATA: Row[] = [
  { year: 2024, sats: 11500, compliance: 4.4 },
  { year: 2025, sats: 14500, compliance: 5.8 },
  { year: 2026, sats: 18000, compliance: 7.5 },
  { year: 2027, sats: 22000, compliance: 9.8 },
  { year: 2028, sats: 27000, compliance: 12.5 },
  { year: 2029, sats: 32000, compliance: 15.8 },
  { year: 2030, sats: 37000, compliance: 19.5 },
  { year: 2031, sats: 42000, compliance: 24.0 },
  { year: 2032, sats: 48000, compliance: 29.5 },
  { year: 2033, sats: 54000, compliance: 36.0 },
  { year: 2034, sats: 60000, compliance: 43.5 },
  { year: 2035, sats: 66000, compliance: 52.0 },
]

const LAVENDER = '#2563EB' // satellites in orbit - blue
const COPPER = '#EA580C' // compliance spend ($B) - orange

// --- chart geometry ---
const W = 1000
const H = 500
const PAD = { left: 72, right: 132, top: 72, bottom: 52 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom
const plotRight = PAD.left + PLOT_W
const baseY = PAD.top + PLOT_H

// two independent vertical scales (one per series)
const MAX_SAT = 75000
const SAT_TICKS = [0, 25000, 50000, 75000]
const MAX_COMP = 60
const COMP_TICKS = [0, 20, 40, 60]

const X_TICKS = [0, 3, 6, 9, 11] // 2024, 2027, 2030, 2033, 2035

// axis x-positions: satellites left, compliance right
const COMP_AXIS_X = plotRight

const n = DATA.length
const x = (i: number) => PAD.left + (i / (n - 1)) * PLOT_W
const ySat = (v: number) => PAD.top + (1 - v / MAX_SAT) * PLOT_H
const yComp = (v: number) => PAD.top + (1 - v / MAX_COMP) * PLOT_H

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

const SAT = line(DATA.map((d) => d.sats), ySat)
const COMP = line(DATA.map((d) => d.compliance), yComp)

export default function SpaceMarket() {
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
            aria-label="Global space industry, 2024,2035: satellites in orbit rising 11,500→66,000 (left axis) and compliance spend growing $4.4B→$52B (right axis), each on its own scale."
          >
            <defs>
              <clipPath id="sm-reveal">
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
              <linearGradient id="sm-fill-sat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LAVENDER} stopOpacity={0.18} />
                <stop offset="100%" stopColor={LAVENDER} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sm-fill-comp" x1="0" y1="0" x2="0" y2="1">
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
              Global Space Industry: Satellites &amp; Compliance Spend
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
              2024,2035 · TWO INDEPENDENT SCALES
            </text>

            {/* horizontal gridlines (keyed to the satellites / left axis) */}
            {SAT_TICKS.map((v) => (
              <line
                key={`grid-${v}`}
                x1={PAD.left}
                y1={ySat(v)}
                x2={plotRight}
                y2={ySat(v)}
                stroke="#1B2436"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
            ))}

            {/* ===== Axis 1 · Satellites in orbit · left ===== */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke={LAVENDER} strokeOpacity={0.5} strokeWidth={1} />
            {SAT_TICKS.map((v) => (
              <text
                key={`sat-${v}`}
                x={PAD.left - 10}
                y={ySat(v) + 3.5}
                textAnchor="end"
                className="font-mono"
                fill={LAVENDER}
                fillOpacity={0.85}
                fontSize={11}
              >
                {v / 1000}k
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
              SATELLITES
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
            <g clipPath="url(#sm-reveal)">
              {/* area fills under each curve */}
              <path d={SAT.area} fill="url(#sm-fill-sat)" stroke="none" />
              <path d={COMP.area} fill="url(#sm-fill-comp)" stroke="none" />

              {/* Satellites in orbit (left axis) */}
              <path
                d={SAT.d}
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
              <circle cx={SAT.last[0]} cy={SAT.last[1]} r={4} fill={LAVENDER} />
              <circle cx={COMP.last[0]} cy={COMP.last[1]} r={4} fill={COPPER} />
            </motion.g>
          </svg>
        </div>

          {/* legend */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: LAVENDER }} />
              Satellites in orbit · 11.5k → 66k
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: COPPER }} />
              Compliance spend · $4.4 → $52B
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
              Global space industry · 2024,2035
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
              Two independent scales · one timeline
            </p>
          </div>
      </div>
    </figure>
  )
}
