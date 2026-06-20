import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * U.S. nuclear market, 2022,2040
 * (source: us_nuclear_spend_gw_compliance_2022_2040.csv).
 *
 * Two independently-scaled line series share one timeline, each on its own
 * vertical axis so every curve stays readable:
 *   • Installed capacity (GW)  [left axis]
 *   • Compliance TAM ($B)      [right axis]
 */
type Row = {
  year: number
  gw: number // installed_capacity_gw (GW)
  compliance: number // compliance_tam_usd_b ($B)
}

const DATA: Row[] = [
  { year: 2022, gw: 93, compliance: 8.5 },
  { year: 2023, gw: 95, compliance: 8.7 },
  { year: 2024, gw: 102, compliance: 9.5 },
  { year: 2025, gw: 103, compliance: 10.2 },
  { year: 2026, gw: 105, compliance: 11.0 },
  { year: 2027, gw: 108, compliance: 11.9 },
  { year: 2028, gw: 112, compliance: 13.1 },
  { year: 2029, gw: 117, compliance: 14.5 },
  { year: 2030, gw: 123, compliance: 16.2 },
  { year: 2031, gw: 130, compliance: 18.1 },
  { year: 2032, gw: 138, compliance: 20.3 },
  { year: 2033, gw: 147, compliance: 22.4 },
  { year: 2034, gw: 156, compliance: 24.5 },
  { year: 2035, gw: 164, compliance: 26.2 },
  { year: 2036, gw: 172, compliance: 28.1 },
  { year: 2037, gw: 181, compliance: 30.2 },
  { year: 2038, gw: 189, compliance: 32.5 },
  { year: 2039, gw: 195, compliance: 34.1 },
  { year: 2040, gw: 200, compliance: 35.8 },
]

const LAVENDER = '#2563EB' // installed capacity (GW) - blue
const COPPER = '#EA580C' // compliance TAM ($B) - orange

// --- chart geometry ---
const W = 1000
const H = 500
const PAD = { left: 64, right: 132, top: 72, bottom: 52 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom
const plotRight = PAD.left + PLOT_W
const baseY = PAD.top + PLOT_H

// two independent vertical scales (one per series)
const MAX_GW = 200
const GW_TICKS = [0, 50, 100, 150, 200]
const MAX_COMP = 40
const COMP_TICKS = [0, 10, 20, 30, 40]

const X_TICKS = [0, 4, 8, 13, 18] // 2022, 2026, 2030, 2035, 2040

// axis x-positions: capacity left, compliance right
const COMP_AXIS_X = plotRight

const n = DATA.length
const x = (i: number) => PAD.left + (i / (n - 1)) * PLOT_W
const yGw = (v: number) => PAD.top + (1 - v / MAX_GW) * PLOT_H
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

const GW = line(DATA.map((d) => d.gw), yGw)
const COMP = line(DATA.map((d) => d.compliance), yComp)

export default function NuclearMarket() {
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
            aria-label="U.S. nuclear market, 2022,2040: installed capacity rising 93→200 GW (left axis) and compliance TAM growing to $35.8B (right axis), each on its own scale."
          >
            <defs>
              <clipPath id="nm-reveal">
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
              <linearGradient id="nm-fill-gw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LAVENDER} stopOpacity={0.18} />
                <stop offset="100%" stopColor={LAVENDER} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nm-fill-comp" x1="0" y1="0" x2="0" y2="1">
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
              U.S. Nuclear Market: Capacity &amp; Compliance TAM
            </text>
            <text
              x={W / 2}
              y={54}
              textAnchor="middle"
              className="font-sans"
              fill="#1B2436"
              fillOpacity={0.45}
              fontSize={11}
              letterSpacing="0.12em"
            >
              2022,2040 · TWO INDEPENDENT SCALES
            </text>

            {/* horizontal gridlines (keyed to the capacity / left axis) */}
            {GW_TICKS.map((v) => (
              <line
                key={`grid-${v}`}
                x1={PAD.left}
                y1={yGw(v)}
                x2={plotRight}
                y2={yGw(v)}
                stroke="#1B2436"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
            ))}

            {/* ===== Axis 1 · Installed capacity (GW) · left ===== */}
            <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke={LAVENDER} strokeOpacity={0.5} strokeWidth={1} />
            {GW_TICKS.map((v) => (
              <text
                key={`gw-${v}`}
                x={PAD.left - 10}
                y={yGw(v) + 3.5}
                textAnchor="end"
                className="font-sans"
                fill={LAVENDER}
                fillOpacity={0.85}
                fontSize={11}
              >
                {v} GW
              </text>
            ))}
            <text
              x={PAD.left - 10}
              y={PAD.top - 16}
              textAnchor="end"
              className="font-sans"
              fill={LAVENDER}
              fontSize={10}
              letterSpacing="0.08em"
            >
              CAPACITY
            </text>

            {/* ===== Axis 2 · Compliance TAM ($B) · right ===== */}
            <line x1={COMP_AXIS_X} y1={PAD.top} x2={COMP_AXIS_X} y2={baseY} stroke={COPPER} strokeOpacity={0.5} strokeWidth={1} />
            {COMP_TICKS.map((v) => (
              <text
                key={`comp-${v}`}
                x={COMP_AXIS_X + 8}
                y={yComp(v) + 3.5}
                textAnchor="start"
                className="font-sans"
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
              className="font-sans"
              fill={COPPER}
              fontSize={10}
              letterSpacing="0.08em"
            >
              COMPLIANCE TAM
            </text>

            {/* X year labels */}
            {X_TICKS.map((i) => (
              <text
                key={`x-${i}`}
                x={x(i)}
                y={baseY + 24}
                textAnchor="middle"
                className="font-sans"
                fill="#1B2436"
                fillOpacity={0.4}
                fontSize={11}
              >
                {DATA[i].year}
              </text>
            ))}

            {/* ===== series (revealed left to right) ===== */}
            <g clipPath="url(#nm-reveal)">
              {/* area fills under each curve */}
              <path d={GW.area} fill="url(#nm-fill-gw)" stroke="none" />
              <path d={COMP.area} fill="url(#nm-fill-comp)" stroke="none" />

              {/* Installed capacity (left axis) */}
              <path
                d={GW.d}
                fill="none"
                stroke={LAVENDER}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Compliance TAM (right axis) */}
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
              <circle cx={GW.last[0]} cy={GW.last[1]} r={4} fill={LAVENDER} />
              <circle cx={COMP.last[0]} cy={COMP.last[1]} r={4} fill={COPPER} />
            </motion.g>
          </svg>
        </div>

          {/* legend */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: LAVENDER }} />
              Installed capacity · 93 → 200 GW
            </span>
            <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.1em] text-ink/60">
              <span className="h-[2.5px] w-5 rounded-full" style={{ background: COPPER }} />
              Compliance TAM · $8.5 → $35.8B
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
              U.S. nuclear market · 2022,2040
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
              Two independent scales · one timeline
            </p>
          </div>
      </div>
    </figure>
  )
}
