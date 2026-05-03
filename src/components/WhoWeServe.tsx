import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ---------- animated nuclear reactor facility ---------- */
function NuclearReactor() {
  return (
    <div className="relative w-[260px] h-[240px] md:w-[320px] md:h-[280px]">
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Ground line */}
        <line x1="20" y1="240" x2="300" y2="240" stroke="#C4820E30" strokeWidth="1" />

        {/* ---- Cooling tower (left) ---- */}
        <path
          d="M50 240 Q50 180 65 150 Q72 135 60 100 L62 70 Q75 60 88 70 L90 100 Q78 135 85 150 Q100 180 100 240 Z"
          fill="#C4820E10"
          stroke="#C4820E40"
          strokeWidth="1"
        />
        {/* Tower opening */}
        <ellipse cx="75" cy="72" rx="14" ry="5" fill="#C4820E08" stroke="#C4820E30" strokeWidth="0.75" />

        {/* Steam from left tower */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={`steam-l-${i}`}
            cx={70 + i * 5}
            rx={6 + i * 3}
            ry={4 + i * 2}
            fill="#C4820E"
            initial={{ cy: 68, opacity: 0.15 }}
            animate={{
              cy: [68, 30 - i * 12],
              opacity: [0.15, 0],
              rx: [6 + i * 3, 14 + i * 5],
              ry: [4 + i * 2, 8 + i * 3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* ---- Containment building (center) ---- */}
        {/* Dome */}
        <path
          d="M135 130 Q135 85 175 75 Q215 85 215 130"
          fill="#C4820E08"
          stroke="#C4820E50"
          strokeWidth="1.5"
        />
        {/* Cylindrical body */}
        <rect
          x="135"
          y="130"
          width="80"
          height="110"
          rx="2"
          fill="#C4820E0C"
          stroke="#C4820E50"
          strokeWidth="1.5"
        />
        {/* Containment rings */}
        <line x1="135" y1="160" x2="215" y2="160" stroke="#C4820E25" strokeWidth="0.75" />
        <line x1="135" y1="190" x2="215" y2="190" stroke="#C4820E25" strokeWidth="0.75" />
        <line x1="135" y1="220" x2="215" y2="220" stroke="#C4820E25" strokeWidth="0.75" />

        {/* Reactor core glow */}
        <motion.circle
          cx="175"
          cy="180"
          r="20"
          fill="none"
          style={{
            filter: 'blur(8px)',
          }}
          stroke="#C4820E"
          strokeWidth="2"
          animate={{ opacity: [0.2, 0.5, 0.2], r: [18, 22, 18] as number[] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="175"
          cy="180"
          r="10"
          fill="#C4820E"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fuel rod lines inside core */}
        {[-6, -2, 2, 6].map((dx) => (
          <motion.line
            key={`rod-${dx}`}
            x1={175 + dx}
            y1={170}
            x2={175 + dx}
            y2={190}
            stroke="#C4820E"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 1.8,
              delay: Math.abs(dx) * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* ---- Cooling tower (right) ---- */}
        <path
          d="M230 240 Q230 185 242 158 Q248 143 238 112 L240 85 Q251 76 262 85 L264 112 Q254 143 260 158 Q272 185 272 240 Z"
          fill="#C4820E10"
          stroke="#C4820E40"
          strokeWidth="1"
        />
        <ellipse cx="251" cy="87" rx="12" ry="4.5" fill="#C4820E08" stroke="#C4820E30" strokeWidth="0.75" />

        {/* Steam from right tower */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={`steam-r-${i}`}
            cx={248 + i * 4}
            rx={5 + i * 3}
            ry={3 + i * 2}
            fill="#C4820E"
            initial={{ cy: 83, opacity: 0.12 }}
            animate={{
              cy: [83, 40 - i * 14],
              opacity: [0.12, 0],
              rx: [5 + i * 3, 12 + i * 5],
              ry: [3 + i * 2, 7 + i * 3],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              delay: 0.4 + i * 0.9,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* ---- Pipes connecting towers to containment ---- */}
        <line x1="100" y1="210" x2="135" y2="210" stroke="#C4820E30" strokeWidth="1.5" />
        <line x1="215" y1="210" x2="230" y2="210" stroke="#C4820E30" strokeWidth="1.5" />

        {/* Animated coolant flow dots along pipes */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`cool-l-${i}`}
            cy={210}
            r={2}
            fill="#C4820E"
            initial={{ cx: 100 }}
            animate={{ cx: [100, 135] }}
            transition={{
              duration: 1.5,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            opacity={0.5}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`cool-r-${i}`}
            cy={210}
            r={2}
            fill="#C4820E"
            initial={{ cx: 215 }}
            animate={{ cx: [215, 230] }}
            transition={{
              duration: 1.2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'linear',
            }}
            opacity={0.5}
          />
        ))}

        {/* Radiation hazard symbol (subtle, on the building) */}
        <motion.g
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="175" cy="140" r="3" fill="#C4820E" />
          {[0, 120, 240].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x1 = 175 + Math.sin(rad) * 5
            const y1 = 140 - Math.cos(rad) * 5
            const x2 = 175 + Math.sin(rad) * 12
            const y2 = 140 - Math.cos(rad) * 12
            return (
              <line
                key={`rad-${angle}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#C4820E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )
          })}
        </motion.g>
      </svg>
    </div>
  )
}

/* ---------- animated rocket / launch vehicle ---------- */
function RocketLaunch() {
  return (
    <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] overflow-hidden">
      {/* Star field */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            backgroundColor: '#3A7CA5',
            left: `${10 + (i * 37) % 80}%`,
            top: `${5 + (i * 53) % 85}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 1.5 + (i % 3) * 0.5,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Orbit ring (satellite path) */}
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: 200,
          height: 200,
          marginLeft: -100,
          marginTop: -100,
          borderColor: '#3A7CA515',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Satellite on the orbit */}
        <motion.div
          className="absolute -top-[5px] left-1/2 -translate-x-1/2"
          style={{ width: 10, height: 10 }}
        >
          <div className="w-[10px] h-[4px] bg-[#3A7CA5] rounded-sm relative">
            <div className="absolute -left-[6px] top-[1px] w-[5px] h-[2px] bg-[#3A7CA580]" />
            <div className="absolute -right-[6px] top-[1px] w-[5px] h-[2px] bg-[#3A7CA580]" />
          </div>
        </motion.div>
      </motion.div>

      {/* Rocket body – centered, flying upward */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[25%]">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Rocket SVG */}
          <svg
            width="36"
            height="80"
            viewBox="0 0 36 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Nose cone */}
            <path
              d="M18 2 L26 28 H10 Z"
              fill="#3A7CA5"
              stroke="#3A7CA540"
              strokeWidth="0.5"
            />
            {/* Body */}
            <rect
              x="10"
              y="28"
              width="16"
              height="32"
              rx="1"
              fill="#3A7CA5CC"
              stroke="#3A7CA540"
              strokeWidth="0.5"
            />
            {/* Window */}
            <circle cx="18" cy="38" r="4" fill="#0D0D0D20" stroke="#3A7CA560" strokeWidth="0.5" />
            {/* Fins */}
            <path d="M10 52 L2 66 H10 Z" fill="#3A7CA580" />
            <path d="M26 52 L34 66 H26 Z" fill="#3A7CA580" />
            {/* Nozzle */}
            <path d="M12 60 L10 68 H26 L24 60 Z" fill="#5C637080" />
          </svg>

          {/* Exhaust flames */}
          <div className="flex justify-center -mt-1">
            <motion.div
              className="flex flex-col items-center"
              animate={{ scaleY: [0.8, 1.3, 0.9, 1.2, 0.8] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <div
                className="w-[12px] h-[18px] rounded-b-full"
                style={{
                  background:
                    'linear-gradient(to bottom, #C4820EDD, #C4820E88, #C4820E22)',
                }}
              />
              <motion.div
                className="w-[8px] h-[12px] rounded-b-full -mt-1"
                style={{
                  background:
                    'linear-gradient(to bottom, #C4820E66, #C4820E22, transparent)',
                }}
                animate={{ scaleY: [1, 1.5, 0.8, 1.2, 1] }}
                transition={{ duration: 0.25, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Smoke / exhaust particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={`smoke-${i}`}
              className="absolute rounded-full"
              style={{
                width: 6 + i * 2,
                height: 6 + i * 2,
                backgroundColor: '#5C637015',
                left: 12 + (i % 2 === 0 ? -4 : 8),
                bottom: -20,
              }}
              animate={{
                y: [0, 40 + i * 15],
                x: [0, (i % 2 === 0 ? -1 : 1) * (10 + i * 5)],
                opacity: [0.5, 0],
                scale: [1, 2.5],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Trajectory trail */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px]"
        style={{
          background:
            'linear-gradient(to top, transparent, #3A7CA520, #3A7CA540, transparent)',
          height: '30%',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ---------- main section ---------- */
const SECTORS = [
  {
    id: 'nuclear',
    title: 'Nuclear',
    color: '#C4820E',
    description:
      'From license applications to safety analysis reports. AI-native compliance for the most regulated energy sector on earth.',
    Visual: NuclearReactor,
  },
  {
    id: 'spacetech',
    title: 'Space-Tech',
    color: '#3A7CA5',
    description:
      'From launch vehicle certification to satellite licensing. Purpose-built compliance services for the new space economy.',
    Visual: RocketLaunch,
  },
]

export default function WhoWeServe() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-[#FAFAF9] border-t border-ink/[0.06]">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-6"
          >
            Who we serve.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
            className="body-technical"
          >
            We work with teams building the hardest things in the most regulated
          industries. Where compliance isn't optional and failure isn't
          abstract.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl mx-auto">
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.3 + i * 0.25,
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex flex-col items-center text-center"
            >
              {/* Animated visual */}
              <div className="mb-8 relative">
                <sector.Visual />
              </div>

              {/* Label */}
              <motion.span
                className="font-mono text-xs tracking-[0.25em] uppercase font-medium mb-3 block"
                style={{ color: sector.color }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.25, duration: 0.5 }}
              >
                {sector.title}
              </motion.span>

              {/* Description */}
              <motion.p
                className="font-mono text-sm leading-relaxed text-ink/60 max-w-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.25, duration: 0.5 }}
              >
                {sector.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
