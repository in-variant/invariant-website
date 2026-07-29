import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Plan, PlanItem } from '../../lib/timeline/types'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  plan: Plan
  monthsToLaunch: number | null
  launchLabel: string | null
  selectedId: string | null
  onSelect: (id: string) => void
}

/**
 * The regulatory timeline chart. Swimlanes by agency track, bars in months
 * before launch. Identity is carried by row labels and lane grouping; color
 * carries exactly one meaning: copper marks the critical path. The lighter
 * tail on each bar is the honest part, what happens if reviews run long.
 */
export default function GanttChart({ plan, monthsToLaunch, launchLabel, selectedId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const horizon = useMemo(() => Math.max(18, Math.ceil(plan.horizon / 6) * 6), [plan.horizon])
  const x = (t: number) => ((horizon - t) / horizon) * 100

  const ticks = useMemo(() => {
    const out: number[] = []
    for (let t = horizon; t >= 0; t -= 6) out.push(t)
    return out
  }, [horizon])

  const quarterLabel = (t: number): string | null => {
    if (monthsToLaunch === null) return null
    const d = new Date()
    d.setDate(1) // avoid end-of-month rollover shifting the quarter
    d.setMonth(d.getMonth() + (monthsToLaunch - t))
    return `Q${Math.floor(d.getMonth() / 3) + 1} ${String(d.getFullYear()).slice(2)}`
  }

  const chartRows = plan.tracks
    .map((track) => ({ ...track, items: track.items.filter((i) => !i.filing.recurring) }))
    .filter((t) => t.items.length > 0)

  let rowIndex = 0

  return (
    <div ref={ref} className="overflow-x-auto rounded-[3px] border border-ink/15 bg-white">
      <div className="min-w-[720px] p-5 md:p-7">
        {/* Axis */}
        <div className="grid grid-cols-[248px_1fr] items-end pb-2">
          <div className="pr-4 font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
            Filing
          </div>
          <div className="relative h-9">
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute bottom-0 -translate-x-1/2 text-center"
                style={{ left: `${x(t)}%` }}
              >
                <div className="font-sans text-[11px] tabular-nums text-ink/50">
                  {t === 0 ? 'Launch' : `T-${t}`}
                </div>
                {quarterLabel(t) && (
                  <div className="font-sans text-[10px] text-ink/30">{quarterLabel(t)}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lanes */}
        <div className="relative">
          {/* Gridlines spanning all rows */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-[248px_1fr]">
            <div />
            <div className="relative">
              {ticks.map((t) => (
                <div
                  key={t}
                  className={`absolute bottom-0 top-0 w-px ${t === 0 ? 'bg-ink/25' : 'bg-ink/[0.06]'}`}
                  style={{ left: `${x(t)}%` }}
                />
              ))}
              {monthsToLaunch !== null && monthsToLaunch <= horizon && (
                <div
                  className="absolute bottom-0 top-0 w-px bg-copper"
                  style={{ left: `${x(monthsToLaunch)}%` }}
                >
                  <span className="absolute -top-1 left-1.5 whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.12em] text-copper">
                    Today
                  </span>
                </div>
              )}
            </div>
          </div>

          {chartRows.map((track) => (
            <div key={track.track}>
              <div className="grid grid-cols-[248px_1fr]">
                <div className="pb-1 pr-4 pt-4 font-sans text-[11px] uppercase tracking-[0.14em] text-ink/40">
                  {track.label}
                </div>
                <div />
              </div>
              {track.items.map((item) => {
                const i = rowIndex++
                return (
                  <Row
                    key={item.filing.id}
                    item={item}
                    x={x}
                    index={i}
                    inView={inView}
                    selected={selectedId === item.filing.id}
                    behind={monthsToLaunch !== null && item.startT >= monthsToLaunch}
                    onSelect={onSelect}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-4">
          <LegendSwatch className="bg-copper" label="Critical path" />
          <LegendSwatch className="bg-observatory" label="Filing window" />
          <LegendSwatch className="bg-observatory/30" label="If reviews run long" />
          {plan.items.some((i) => i.overrun && !i.filing.recurring) && (
            <span className="flex items-center gap-2">
              <OverrunArrow className="text-ink/50" />
              <span className="font-sans text-[11px] text-ink/60">Worst case slips the launch date</span>
            </span>
          )}
          {monthsToLaunch !== null && monthsToLaunch <= horizon && (
            <span className="font-sans text-[11px] text-ink/50">
              Windows to the left of Today should already be underway.
            </span>
          )}
          {launchLabel && (
            <span className="ml-auto font-sans text-[11px] text-ink/50">
              Anchored to your target: {launchLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({
  item,
  x,
  index,
  inView,
  selected,
  behind,
  onSelect,
}: {
  item: PlanItem
  x: (t: number) => number
  index: number
  inView: boolean
  selected: boolean
  behind: boolean
  onSelect: (id: string) => void
}) {
  const solidLeft = x(item.startT)
  const solidWidth = Math.max(x(item.solidEndT) - x(item.startT), 1.2)
  const tailWidth = Math.max(x(item.tailEndT) - x(item.solidEndT), 0)
  const fill = item.critical ? 'bg-copper' : 'bg-observatory'
  const tail = item.critical ? 'bg-copper/30' : 'bg-observatory/25'

  return (
    <button
      type="button"
      onClick={() => onSelect(item.filing.id)}
      aria-pressed={selected}
      className={`group grid w-full grid-cols-[248px_1fr] items-center rounded-[3px] text-left transition-colors ${
        selected ? 'bg-copper/[0.07]' : 'hover:bg-ink/[0.03]'
      }`}
    >
      <div className="flex items-center gap-2 py-1.5 pl-1 pr-4">
        <span
          title={item.filing.name}
          className={`line-clamp-2 font-sans text-[12.5px] leading-[1.25] ${
            selected ? 'text-ink' : 'text-ink/75'
          }`}
        >
          {item.filing.name}
        </span>
        {behind && (
          <span className="shrink-0 rounded-full border border-copper/40 bg-copper/10 px-1.5 py-px font-sans text-[9px] uppercase tracking-[0.1em] text-copper">
            Start now
          </span>
        )}
      </div>
      <div className="relative h-9">
        <motion.div
          className="absolute h-[14px]"
          style={{
            left: `${solidLeft}%`,
            width: `${solidWidth + tailWidth}%`,
            top: 'calc(50% - 7px)',
            transformOrigin: 'left center',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 + index * 0.05, ease: EASE }}
        >
          <div className="flex h-full w-full">
            <div
              className={`h-full ${fill} rounded-l-[2px] ${tailWidth === 0 && !item.overrun ? 'rounded-r-[4px]' : ''}`}
              style={{ width: `${(solidWidth / (solidWidth + tailWidth)) * 100}%` }}
            />
            {tailWidth > 0 && (
              <div className={`h-full flex-1 ${tail} ${item.overrun ? '' : 'rounded-r-[4px]'}`} />
            )}
          </div>
          {item.overrun && (
            <OverrunArrow
              className={`absolute -right-[9px] top-1/2 -translate-y-1/2 ${
                item.critical ? 'text-copper' : 'text-observatory/60'
              }`}
            />
          )}
        </motion.div>
      </div>
    </button>
  )
}

function OverrunArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 8 14"
      className={`h-[14px] w-2 ${className}`}
      fill="currentColor"
    >
      <path d="M0 0 L8 7 L0 14 Z" />
    </svg>
  )
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-[10px] w-5 rounded-[2px] ${className}`} />
      <span className="font-sans text-[11px] text-ink/60">{label}</span>
    </span>
  )
}
