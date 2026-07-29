import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

/*
 * The back and forth, side by side. Two panels on one axis: the same journey
 * from your engineer to five regulators, once through a tangle of people on
 * the meter with no single owner, once through one Invariant engineer on the
 * platform. No moving dots, no pictograms. The contrast is carried by the
 * drawing itself: an anonymous crossing mesh against a single copper hub, and
 * the two hours numbers land on the same line. Copper is reserved for us.
 */

const REGS = ['FCC', 'NOAA', 'FAA', 'DDTC', 'IN-SPACe']
const REG_CY = [34, 82, 120, 158, 206]

const EDGE_GRAY = 'rgba(236,234,231,0.22)'
const EDGE_COPPER = 'rgba(197,122,62,0.55)'
const NODE = 'rgba(236,234,231,0.55)'
const LABEL = 'rgba(236,234,231,0.5)'
const COPPER = '#C57A3E'

// Consultants: engineer -> four anonymous intermediaries -> regulators, with
// deliberate long crossings. Fourteen lines that never resolve to one owner.
const C_EDGES = [
  'M46,120 C110,110 150,70 210,48',
  'M46,120 C110,116 150,104 210,100',
  'M46,120 C110,128 150,144 210,152',
  'M46,120 C110,150 150,190 210,204',
  'M210,48 C270,40 300,34 352,34',
  'M210,48 C270,58 300,74 352,82',
  'M210,48 C280,70 300,110 352,120',
  'M210,100 C270,94 300,84 352,82',
  'M210,100 C270,106 300,116 352,120',
  'M210,100 C280,132 300,192 352,206',
  'M210,152 C270,144 300,126 352,120',
  'M210,152 C270,154 300,156 352,158',
  'M210,204 C270,196 300,168 352,158',
  'M210,204 C270,206 300,206 352,206',
]

const C_NODES = [
  [210, 48],
  [210, 100],
  [210, 152],
  [210, 204],
]

// Invariant: engineer -> one hub -> five regulators. Six clean lines.
const I_EDGES = [
  'M46,120 C110,120 150,120 200,120',
  'M220,120 C280,100 300,44 352,34',
  'M220,120 C280,110 300,88 352,82',
  'M220,120 C280,120 300,120 352,120',
  'M220,120 C280,130 300,152 352,158',
  'M220,120 C280,142 300,196 352,206',
]

function Plaques() {
  return (
    <g>
      {REGS.map((r, i) => (
        <g key={r}>
          <rect
            x="352"
            y={REG_CY[i] - 11}
            width="80"
            height="22"
            rx="4"
            fill="rgba(236,234,231,0.03)"
            stroke="rgba(236,234,231,0.2)"
          />
          <text x="392" y={REG_CY[i] + 3.5} textAnchor="middle" fill="rgba(236,234,231,0.62)" fontSize="10.5">
            {r}
          </text>
        </g>
      ))}
    </g>
  )
}

function Edge({ d, copper, reveal, delay }: { d: string; copper: boolean; reveal: boolean; delay: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={copper ? EDGE_COPPER : EDGE_GRAY}
      strokeWidth={copper ? 1.2 : 1}
      initial={reveal ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
      animate={reveal ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
    />
  )
}

function Diagram({ variant, reveal }: { variant: 'consultants' | 'invariant'; reveal: boolean }) {
  const consultants = variant === 'consultants'
  const edges = consultants ? C_EDGES : I_EDGES
  return (
    <svg
      viewBox="0 0 440 245"
      className="h-auto w-full"
      role="img"
      aria-label={
        consultants
          ? 'Your engineer routing through four anonymous consultants and counsel, a crossing mesh of lines reaching five regulators.'
          : 'Your engineer through one Invariant engineer on the platform, a clean set of lines to the same five regulators.'
      }
    >
      {edges.map((d, i) => (
        <Edge key={d} d={d} copper={!consultants} reveal={reveal} delay={0.15 + i * (consultants ? 0.045 : 0.08)} />
      ))}

      {/* Your engineer */}
      <circle cx="46" cy="120" r="6" fill="none" stroke={NODE} strokeWidth="1.4" />
      <circle cx="46" cy="120" r="1.7" fill={NODE} />
      <text x="46" y="145" textAnchor="middle" fill={LABEL} fontSize="10">
        Your engineer
      </text>

      {consultants ? (
        <g>
          {C_NODES.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="rgba(236,234,231,0.5)" />
          ))}
          <text x="210" y="232" textAnchor="middle" fill={LABEL} fontSize="10">
            consultants · counsel · brokers
          </text>
        </g>
      ) : (
        <g>
          <circle cx="210" cy="120" r="11" fill={COPPER} />
          <circle cx="210" cy="120" r="15" fill="none" stroke="rgba(197,122,62,0.35)" strokeWidth="1" />
          <text x="210" y="150" textAnchor="middle" fill="rgba(236,234,231,0.72)" fontSize="10">
            One Invariant engineer
          </text>
          <text x="210" y="164" textAnchor="middle" fill="rgba(197,122,62,0.9)" fontSize="10">
            on the platform
          </text>
        </g>
      )}

      <Plaques />
    </svg>
  )
}

function Panel({
  variant,
  reveal,
  inView,
  delay,
}: {
  variant: 'consultants' | 'invariant'
  reveal: boolean
  inView: boolean
  delay: number
}) {
  const consultants = variant === 'consultants'
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`flex flex-col rounded-xl border p-6 md:p-8 ${
        consultants ? 'border-cloud/10' : 'border-copper/25 bg-copper/[0.035]'
      }`}
    >
      <div className="font-sans text-[13.5px]">
        <span className={consultants ? 'font-medium text-cloud' : 'font-medium text-copper'}>
          {consultants ? 'With consultants' : 'With Invariant'}
        </span>
        <span className="text-cloud/40">
          {consultants ? ' · metered, no single owner' : ' · one owner, fixed scope'}
        </span>
      </div>

      <div className="mt-5">
        <Diagram variant={variant} reveal={reveal} />
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className={`font-serif text-6xl leading-none md:text-7xl ${consultants ? 'text-cloud' : 'text-copper'}`}>
          {consultants ? '18' : '3 to 4'}
        </span>
        <span className="font-sans text-[12.5px] leading-tight text-cloud/55">
          hrs a week
          <br />
          of your engineer
        </span>
      </div>
      <div className={`mt-3 font-sans text-[12.5px] ${consultants ? 'text-cloud/40' : 'text-copper/90'}`}>
        {consultants ? 'Billed by the hour, every round.' : '14 hours a week back to the hardware.'}
      </div>
    </motion.div>
  )
}

export default function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const reduced = useReducedMotion()
  const reveal = inView && !reduced

  return (
    <section ref={ref} className="bg-ink px-6 py-14 text-cloud md:px-12 md:py-20 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-serif text-3xl font-normal leading-none tracking-[-0.02em] md:text-5xl"
        >
          The back and forth.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-3 max-w-xl font-sans text-[14.5px] leading-relaxed text-cloud/55"
        >
          Same five regulators, either way. What changes is who runs the traffic, and how much of your
          engineer it costs.
        </motion.p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
          <Panel variant="consultants" reveal={reveal} inView={inView} delay={0.15} />
          <Panel variant="invariant" reveal={reveal} inView={inView} delay={0.3} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-8 text-center font-serif text-lg italic text-cloud/85 md:text-xl"
        >
          Invariant fills, files, and answers the regulator.
        </motion.p>
      </div>
    </section>
  )
}
