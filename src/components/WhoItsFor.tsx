import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AUDIENCES = [
  {
    label: 'Engineering Teams',
    description: 'Teams building regulated systems who need compliance awareness from first sketch to final submission.',
    color: '#2A9D8F',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="16" cy="16" r="7" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <circle cx="32" cy="16" r="7" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <circle cx="24" cy="30" r="7" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <path d="M22 17 L26 17" stroke={`${c}40`} strokeWidth="1" />
        <path d="M18 22 L22 27" stroke={`${c}40`} strokeWidth="1" />
        <path d="M30 22 L26 27" stroke={`${c}40`} strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: 'Compliance Consultants',
    description: 'Practitioners who author safety cases, regulatory filings, and compliance documentation across industries.',
    color: '#C4820E',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="10" y="8" width="28" height="32" rx="3" fill={`${c}12`} stroke={c} strokeWidth="1.5" />
        <line x1="16" y1="16" x2="32" y2="16" stroke={`${c}40`} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="16" y1="22" x2="28" y2="22" stroke={`${c}40`} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="16" y1="28" x2="30" y2="28" stroke={`${c}40`} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M14 34 L18 38 L24 32" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Program Leadership',
    description: 'Leaders managing the intersection of engineering schedules and regulatory timelines.',
    color: '#3A7CA5',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="8" y="18" width="32" height="22" rx="2" fill={`${c}10`} stroke={c} strokeWidth="1.5" />
        <line x1="8" y1="26" x2="40" y2="26" stroke={`${c}30`} strokeWidth="1" />
        <rect x="14" y="12" width="20" height="6" rx="1.5" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <circle cx="24" cy="33" r="4" fill={`${c}20`} stroke={c} strokeWidth="1" />
        <path d="M22 33 L24 35 L27 31" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
]

export default function WhoItsFor() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-white">
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-20 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-5"
          >
            Who Invariant AI is for.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="body-technical"
          >
            Built for teams where regulation shapes the engineering.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-4xl mx-auto">
          {AUDIENCES.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center p-3"
                style={{ backgroundColor: `${audience.color}0A`, border: `1.5px solid ${audience.color}30` }}
              >
                {audience.icon(audience.color)}
              </div>
              <h3
                className="font-mono text-xs tracking-[0.2em] uppercase font-medium mb-2"
                style={{ color: audience.color }}
              >
                {audience.label}
              </h3>
              <p className="font-mono text-sm leading-relaxed text-ink/50 max-w-xs">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
