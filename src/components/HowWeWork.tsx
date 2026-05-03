import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    icon: (color: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="16" cy="18" r="6" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
        <circle cx="32" cy="18" r="6" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
        <path d="M22 20 Q24 16 26 20" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
        <rect x="14" y="32" width="20" height="12" rx="2" fill={`${color}10`} stroke={`${color}50`} strokeWidth="1" />
        <line x1="18" y1="36" x2="30" y2="36" stroke={`${color}40`} strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="40" x2="26" y2="40" stroke={`${color}40`} strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    title: 'Engage',
    subtitle: 'Map your compliance surface',
    color: '#2A9D8F',
  },
  {
    icon: (color: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="12" cy="20" r="5" fill="#5C637018" stroke="#5C6370" strokeWidth="1" />
        <circle cx="24" cy="20" r="5" fill="#5C637018" stroke="#5C6370" strokeWidth="1" />
        <circle cx="36" cy="20" r="5" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
        <path d="M36 14 L36 8" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M33 10 L36 6 L39 10" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
        <rect x="6" y="32" width="36" height="10" rx="3" fill={`${color}08`} stroke={`${color}40`} strokeWidth="1" />
        <text x="24" y="39.5" fontSize="5" fill={color} fontFamily="monospace" textAnchor="middle" fontWeight="500">EMBEDDED</text>
      </svg>
    ),
    title: 'Deploy',
    subtitle: 'Embed with your team',
    color: '#C4820E',
  },
  {
    icon: (color: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="14" cy="14" r="6" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
        <circle cx="34" cy="14" r="6" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
        <circle cx="24" cy="34" r="6" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
        <line x1="19" y1="16" x2="29" y2="16" stroke={`${color}40`} strokeWidth="1" />
        <line x1="16" y1="19" x2="22" y2="30" stroke={`${color}40`} strokeWidth="1" />
        <line x1="32" y1="19" x2="26" y2="30" stroke={`${color}40`} strokeWidth="1" />
        <circle cx="14" cy="14" r="2.5" fill={color} />
        <circle cx="34" cy="14" r="2.5" fill={color} />
        <circle cx="24" cy="34" r="2.5" fill={color} />
      </svg>
    ),
    title: 'Automate',
    subtitle: 'Agentic AI workflows',
    color: '#3A7CA5',
  },
  {
    icon: (color: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={`${color}25`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="46" strokeDashoffset="8" />
        <line x1="24" y1="38" x2="33" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2.5" fill={color} />
        <text x="8" y="46" fontSize="5" fill={`${color}60`} fontFamily="monospace">slow</text>
        <text x="33" y="46" fontSize="5" fill={color} fontFamily="monospace" fontWeight="bold">fast</text>
      </svg>
    ),
    title: 'Accelerate',
    subtitle: 'Months → days',
    color: '#8B5CF6',
  },
  {
    icon: (color: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="12" y="6" width="24" height="30" rx="2" fill={`${color}10`} stroke={`${color}50`} strokeWidth="1.5" />
        <line x1="16" y1="14" x2="32" y2="14" stroke={`${color}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="19" x2="28" y2="19" stroke={`${color}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="24" x2="30" y2="24" stroke={`${color}30`} strokeWidth="1" strokeLinecap="round" />
        <circle cx="34" cy="34" r="10" fill={`${color}15`} stroke={color} strokeWidth="2" />
        <path d="M29 34 L33 38 L40 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: 'Done',
    subtitle: 'Compliance approved',
    color: '#2A9D8F',
  },
]

function HorizontalArrow({ color, delay, inView }: { color: string; delay: number; inView: boolean }) {
  return (
    <div className="flex items-center justify-center px-2 lg:px-3 flex-shrink-0">
      <motion.svg width="36" height="16" viewBox="0 0 36 16" fill="none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay, duration: 0.2 }}
      >
        <motion.line x1="2" y1="8" x2="26" y2="8" stroke={color} strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ delay, duration: 0.35, ease: 'easeInOut' }}
        />
        <motion.polyline points="22,3 32,8 22,13" stroke={color} strokeWidth="1.5" fill="none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.2 }}
        />
      </motion.svg>
    </div>
  )
}

function VerticalArrow({ color, delay, inView }: { color: string; delay: number; inView: boolean }) {
  return (
    <div className="flex items-center justify-center py-2 flex-shrink-0">
      <motion.svg width="16" height="36" viewBox="0 0 16 36" fill="none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay, duration: 0.2 }}
      >
        <motion.line x1="8" y1="2" x2="8" y2="26" stroke={color} strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ delay, duration: 0.35, ease: 'easeInOut' }}
        />
        <motion.polyline points="3,22 8,32 13,22" stroke={color} strokeWidth="1.5" fill="none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.2 }}
        />
      </motion.svg>
    </div>
  )
}

export default function HowWeWork() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="bg-white border-t border-ink/[0.06]">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            How we work.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="body-technical"
          >
            One engagement. End-to-end compliance.
          </motion.p>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-start justify-center">
          {STEPS.map((step, i) => {
            const delay = 0.2 + i * 0.4
            return (
              <div key={i} className="flex items-start">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center w-[140px] lg:w-[165px]"
                >
                  <motion.div
                    className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-4 rounded-2xl flex items-center justify-center p-3 lg:p-3.5"
                    style={{ backgroundColor: `${step.color}0A`, border: `1.5px solid ${step.color}30` }}
                    whileHover={{ scale: 1.06, backgroundColor: `${step.color}14` }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.icon(step.color)}
                  </motion.div>
                  <h3 className="font-serif text-lg lg:text-xl font-medium text-ink mb-1 text-center">
                    {step.title}
                  </h3>
                  <p
                    className="font-mono text-[10px] lg:text-[11px] tracking-wide uppercase text-center"
                    style={{ color: step.color }}
                  >
                    {step.subtitle}
                  </p>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="pt-8 lg:pt-9">
                    <HorizontalArrow color={STEPS[i + 1].color} delay={delay + 0.25} inView={inView} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col items-center">
          {STEPS.map((step, i) => {
            const delay = 0.2 + i * 0.35
            return (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay, duration: 0.45 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-16 h-16 mb-3 rounded-2xl flex items-center justify-center p-3"
                    style={{ backgroundColor: `${step.color}0A`, border: `1.5px solid ${step.color}30` }}
                  >
                    {step.icon(step.color)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-ink mb-0.5 text-center">
                    {step.title}
                  </h3>
                  <p
                    className="font-mono text-[10px] tracking-wide uppercase text-center"
                    style={{ color: step.color }}
                  >
                    {step.subtitle}
                  </p>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <VerticalArrow color={STEPS[i + 1].color} delay={delay + 0.2} inView={inView} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
