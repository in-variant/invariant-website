import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
const TOTAL = 13

/* ═══════════════════════════════════════════════════════════════
   FLOWING BACKGROUND, from Hero.tsx
   ═══════════════════════════════════════════════════════════════ */

const FLOW_LINES = [
  { y: '15%', delay: 0, duration: 3.5, color: '#2A9D8F' },
  { y: '30%', delay: 0.8, duration: 4.2, color: '#C4820E' },
  { y: '45%', delay: 0.3, duration: 3.8, color: '#3A7CA5' },
  { y: '60%', delay: 1.2, duration: 4.5, color: '#5C6370' },
  { y: '75%', delay: 0.6, duration: 3.2, color: '#2A9D8F' },
  { y: '88%', delay: 1.5, duration: 4.0, color: '#C4820E' },
  { y: '22%', delay: 2.0, duration: 3.6, color: '#3A7CA5' },
  { y: '52%', delay: 1.8, duration: 4.8, color: '#5C6370' },
]

const ACCENT_ICONS = [
  { type: 'satellite' as const, y: '20%', delay: 1, duration: 18, color: '#3A7CA5', bob: -12 },
  { type: 'atom' as const, y: '50%', delay: 4, duration: 22, color: '#C4820E', bob: 10 },
  { type: 'rocket' as const, y: '78%', delay: 7, duration: 16, color: '#3A7CA5', bob: -8 },
]

function FlowingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOW_LINES.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{ top: line.y, background: `linear-gradient(90deg, transparent 0%, ${line.color}15 20%, ${line.color}25 50%, ${line.color}15 80%, transparent 100%)` }}
          initial={{ left: '-40%', width: '40%' }}
          animate={{ left: '100%' }}
          transition={{ delay: line.delay, duration: line.duration, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {FLOW_LINES.map((line, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{ top: line.y, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, backgroundColor: `${line.color}30` }}
          initial={{ left: '-5%', y: 0 }}
          animate={{ left: '105%', y: [0, i % 2 === 0 ? -15 : 15, 0] }}
          transition={{
            left: { delay: line.delay + 0.5, duration: line.duration * 1.3, repeat: Infinity, ease: 'linear' },
            y: { delay: line.delay + 0.5, duration: line.duration * 0.65, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
        />
      ))}
      {ACCENT_ICONS.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={{ top: item.y, opacity: 0.12 }}
          initial={{ left: '-6%' }}
          animate={{ left: '106%', y: [0, item.bob, 0] }}
          transition={{
            left: { delay: item.delay, duration: item.duration, repeat: Infinity, ease: 'linear' },
            y: { delay: item.delay, duration: item.duration * 0.35, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
        >
          {item.type === 'satellite' && (
            <svg viewBox="0 0 36 20" width="36" height="20" fill="none">
              <rect x="12" y="6" width="12" height="8" rx="1.5" fill={item.color} />
              <rect x="0" y="7.5" width="10" height="5" rx="1" fill={item.color} />
              <rect x="26" y="7.5" width="10" height="5" rx="1" fill={item.color} />
              <line x1="18" y1="6" x2="18" y2="2" stroke={item.color} strokeWidth="1" />
              <circle cx="18" cy="1" r="1" fill={item.color} />
            </svg>
          )}
          {item.type === 'rocket' && (
            <svg viewBox="0 0 18 36" width="16" height="32" fill="none" style={{ transform: 'rotate(-25deg)' }}>
              <path d="M9 1 L14 12 H4 Z" fill={item.color} />
              <rect x="5" y="12" width="8" height="14" rx="1" fill={item.color} />
              <rect x="2" y="20" width="3" height="7" rx="1.5" fill={item.color} />
              <rect x="13" y="20" width="3" height="7" rx="1.5" fill={item.color} />
              <ellipse cx="9" cy="30" rx="3" ry="4" fill={item.color} opacity="0.5" />
            </svg>
          )}
          {item.type === 'atom' && (
            <motion.svg viewBox="0 0 32 32" width="32" height="32" fill="none" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <circle cx="16" cy="16" r="3" fill={item.color} />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" transform="rotate(60 16 16)" />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" transform="rotate(120 16 16)" />
            </motion.svg>
          )}
        </motion.div>
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(42,157,143,0.05) 0%, rgba(196,130,14,0.03) 30%, rgba(58,124,165,0.02) 60%, transparent 80%)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════════════════════════ */

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center px-5 sm:px-10 md:px-16 lg:px-20 pt-14 pb-20 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-16 bg-white text-ink paper-grain relative">
      <div className="absolute top-4 sm:top-5 left-5 sm:left-10 md:left-16 lg:left-20 z-10">
        <span className="font-serif text-base sm:text-lg font-medium tracking-[-0.02em] text-ink/30">Invariant AI</span>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-4xl">{children}</div>
    </div>
  )
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-8">{children}</p>
}

function Rule({ className = '' }: { className?: string }) {
  return <div className={`section-rule ${className}`} />
}

function HorizontalArrow({ color, delay }: { color: string; delay: number }) {
  return (
    <div className="flex items-center justify-center px-2 lg:px-3 shrink-0">
      <motion.svg width="36" height="16" viewBox="0 0 36 16" fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.2 }}
      >
        <motion.line x1="2" y1="8" x2="26" y2="8" stroke={color} strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay, duration: 0.35, ease: 'easeInOut' }}
        />
        <motion.polyline points="22,3 32,8 22,13" stroke={color} strokeWidth="1.5" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.2 }}
        />
      </motion.svg>
    </div>
  )
}

function VerticalArrow({ color, delay }: { color: string; delay: number }) {
  return (
    <div className="flex items-center justify-center py-2 shrink-0">
      <motion.svg width="16" height="36" viewBox="0 0 16 36" fill="none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.2 }}
      >
        <motion.line x1="8" y1="2" x2="8" y2="26" stroke={color} strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay, duration: 0.35, ease: 'easeInOut' }}
        />
        <motion.polyline points="3,22 8,32 13,22" stroke={color} strokeWidth="1.5" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.2 }}
        />
      </motion.svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 1, HERO
   ═══════════════════════════════════════════════════════════════ */

function HeroSlide() {
  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-center bg-white paper-grain relative overflow-hidden">
      <FlowingBackground />
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-medium tracking-[-0.04em] text-ink mb-6"
        >
          Invariant AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
          className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-[-0.02em] text-ink"
        >
          AI-native services for regulated compliance.
        </motion.p>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 2, COVERAGE VERTICALS
   ═══════════════════════════════════════════════════════════════ */

const COVERAGE_PHASES = [
  {
    title: 'Transit Insurance',
    subtitle: 'Facility → launch site',
    color: '#2A9D8F',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="6" y="28" width="36" height="10" rx="2" fill={`${c}10`} stroke={c} strokeWidth="1.2" />
        <circle cx="14" cy="40" r="3" fill={`${c}20`} stroke={c} strokeWidth="1" />
        <circle cx="34" cy="40" r="3" fill={`${c}20`} stroke={c} strokeWidth="1" />
        <rect x="16" y="18" width="16" height="10" rx="1.5" fill={`${c}15`} stroke={c} strokeWidth="1" />
        <motion.line x1="8" y1="33" x2="40" y2="33" stroke={`${c}30`} strokeWidth="0.75"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }} />
      </svg>
    ),
  },
  {
    title: 'Pre-Launch Insurance',
    subtitle: 'Arrival → ignition',
    color: '#C4820E',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="14" y="8" width="20" height="28" rx="2" fill={`${c}10`} stroke={c} strokeWidth="1.2" />
        <line x1="14" y1="20" x2="34" y2="20" stroke={`${c}30`} strokeWidth="0.75" />
        <line x1="14" y1="28" x2="34" y2="28" stroke={`${c}30`} strokeWidth="0.75" />
        <rect x="8" y="36" width="32" height="6" rx="1" fill={`${c}08`} stroke={`${c}40`} strokeWidth="1" />
        <motion.circle cx="24" cy="14" r="3" fill={c}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
      </svg>
    ),
  },
  {
    title: 'Launch Insurance',
    subtitle: 'Ignition → orbit insertion',
    color: '#3A7CA5',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M24 4 L30 18 H18 Z" fill={`${c}20`} stroke={c} strokeWidth="1" />
        <rect x="18" y="18" width="12" height="16" rx="1" fill={`${c}15`} stroke={c} strokeWidth="1" />
        <path d="M18 28 L12 38 H18 Z" fill={`${c}12`} stroke={`${c}60`} strokeWidth="0.75" />
        <path d="M30 28 L36 38 H30 Z" fill={`${c}12`} stroke={`${c}60`} strokeWidth="0.75" />
        <motion.ellipse cx="24" cy="40" rx="4" ry="5" fill={c}
          animate={{ opacity: [0.2, 0.5, 0.2], ry: [4, 6, 4] as number[] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
      </svg>
    ),
  },
  {
    title: 'In-Orbit Insurance',
    subtitle: 'On-orbit operations',
    color: '#8B5CF6',
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="14" fill="none" stroke={`${c}20`} strokeWidth="1" />
        <circle cx="24" cy="24" r="8" fill="none" stroke={`${c}30`} strokeWidth="0.75" strokeDasharray="3 2" />
        <motion.circle cx="24" cy="10" r="3" fill={c}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '24px 24px' }} />
        <circle cx="24" cy="24" r="4" fill={`${c}15`} stroke={c} strokeWidth="1" />
      </svg>
    ),
  },
]

function CoverageVerticalsSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Coverage verticals</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4"
        >
          Four sequential phases.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          className="body-technical mb-12"
        >
          Each phase covers a distinct risk window. Underwritten separately or bundled.
        </motion.p>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-start justify-center">
          {COVERAGE_PHASES.map((phase, i) => {
            const delay = 0.2 + i * 0.4
            return (
              <div key={i} className="flex items-start">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center w-[140px] lg:w-[165px]"
                >
                  <motion.div
                    className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-4 rounded-2xl flex items-center justify-center p-3 lg:p-3.5"
                    style={{ backgroundColor: `${phase.color}0A`, border: `1.5px solid ${phase.color}30` }}
                    whileHover={{ scale: 1.06, backgroundColor: `${phase.color}14` }}
                    transition={{ duration: 0.2 }}
                  >
                    {phase.icon(phase.color)}
                  </motion.div>
                  <h3 className="font-serif text-lg lg:text-xl font-medium text-ink mb-1 text-center">{phase.title}</h3>
                  <p className="font-sans text-[10px] lg:text-[11px] tracking-wide uppercase text-center" style={{ color: phase.color }}>
                    {phase.subtitle}
                  </p>
                </motion.div>
                {i < COVERAGE_PHASES.length - 1 && (
                  <div className="pt-8 lg:pt-9">
                    <HorizontalArrow color={COVERAGE_PHASES[i + 1].color} delay={delay + 0.25} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col items-center">
          {COVERAGE_PHASES.map((phase, i) => {
            const delay = 0.2 + i * 0.35
            return (
              <div key={i} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.45 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 mb-3 rounded-2xl flex items-center justify-center p-3"
                    style={{ backgroundColor: `${phase.color}0A`, border: `1.5px solid ${phase.color}30` }}
                  >
                    {phase.icon(phase.color)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-ink mb-0.5 text-center">{phase.title}</h3>
                  <p className="font-sans text-[10px] tracking-wide uppercase text-center" style={{ color: phase.color }}>
                    {phase.subtitle}
                  </p>
                </motion.div>
                {i < COVERAGE_PHASES.length - 1 && (
                  <VerticalArrow color={COVERAGE_PHASES[i + 1].color} delay={delay + 0.2} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDES 3,6, INDIVIDUAL COVERAGE DETAILS
   ═══════════════════════════════════════════════════════════════ */

function TransitInsuranceSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Coverage verticals</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          Transit Insurance
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-8 rounded-2xl flex items-center justify-center p-3 lg:p-3.5 mx-auto"
          style={{ backgroundColor: '#2A9D8F0A', border: '1.5px solid #2A9D8F30' }}
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <rect x="6" y="28" width="36" height="10" rx="2" fill="#2A9D8F10" stroke="#2A9D8F" strokeWidth="1.2" />
            <circle cx="14" cy="40" r="3" fill="#2A9D8F20" stroke="#2A9D8F" strokeWidth="1" />
            <circle cx="34" cy="40" r="3" fill="#2A9D8F20" stroke="#2A9D8F" strokeWidth="1" />
            <rect x="16" y="18" width="16" height="10" rx="1.5" fill="#2A9D8F15" stroke="#2A9D8F" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-base sm:text-lg md:text-xl leading-[1.4] tracking-[-0.02em] text-ink/70 max-w-xl mb-10 px-2"
        >
          Covers the vehicle or payload from the manufacturer's facility to the launch site.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-8"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-ink/40 mb-6"
        >
          Key risks
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 md:flex-nowrap">
          {['Handling damage', 'Transportation accidents', 'Environmental exposure', 'Ground movement incidents'].map((risk, i) => (
            <motion.div
              key={risk}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
              className="border border-ink/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 rounded-md"
              style={{ background: 'linear-gradient(135deg, #2A9D8F03 0%, #2A9D8F06 100%)' }}
            >
              <span className="font-sans text-[10px] sm:text-xs text-ink/60">{risk}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

function PreLaunchInsuranceSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Coverage verticals</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          Pre-Launch Insurance
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-8 rounded-2xl flex items-center justify-center p-3 lg:p-3.5 mx-auto"
          style={{ backgroundColor: '#C4820E0A', border: '1.5px solid #C4820E30' }}
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <rect x="14" y="8" width="20" height="28" rx="2" fill="#C4820E10" stroke="#C4820E" strokeWidth="1.2" />
            <line x1="14" y1="20" x2="34" y2="20" stroke="#C4820E30" strokeWidth="0.75" />
            <line x1="14" y1="28" x2="34" y2="28" stroke="#C4820E30" strokeWidth="0.75" />
            <rect x="8" y="36" width="32" height="6" rx="1" fill="#C4820E08" stroke="#C4820E40" strokeWidth="1" />
            <motion.circle cx="24" cy="14" r="3" fill="#C4820E"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-base sm:text-lg md:text-xl leading-[1.4] tracking-[-0.02em] text-ink/70 max-w-xl mb-10 px-2"
        >
          Covers the period from arrival at the launch facility through intentional ignition.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-8"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-ink/40 mb-6"
        >
          Key risks
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 md:flex-nowrap">
          {['Ground handling', 'Fueling operations', 'Integration incidents', 'Facility-related damage'].map((risk, i) => (
            <motion.div
              key={risk}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
              className="border border-ink/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 rounded-md"
              style={{ background: 'linear-gradient(135deg, #C4820E03 0%, #C4820E06 100%)' }}
            >
              <span className="font-sans text-[10px] sm:text-xs text-ink/60">{risk}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

function LaunchInsuranceSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Coverage verticals</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          Launch Insurance
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-8 rounded-2xl flex items-center justify-center p-3 lg:p-3.5 mx-auto"
          style={{ backgroundColor: '#3A7CA50A', border: '1.5px solid #3A7CA530' }}
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <path d="M24 4 L30 18 H18 Z" fill="#3A7CA520" stroke="#3A7CA5" strokeWidth="1" />
            <rect x="18" y="18" width="12" height="16" rx="1" fill="#3A7CA515" stroke="#3A7CA5" strokeWidth="1" />
            <path d="M18 28 L12 38 H18 Z" fill="#3A7CA512" stroke="#3A7CA560" strokeWidth="0.75" />
            <path d="M30 28 L36 38 H30 Z" fill="#3A7CA512" stroke="#3A7CA560" strokeWidth="0.75" />
            <motion.ellipse cx="24" cy="40" rx="4" ry="5" fill="#3A7CA5"
              animate={{ opacity: [0.2, 0.5, 0.2], ry: [4, 6, 4] as number[] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-base sm:text-lg md:text-xl leading-[1.4] tracking-[-0.02em] text-ink/70 max-w-xl mb-4 px-2"
        >
          Covers the period from intentional ignition through orbital insertion.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="font-sans text-xs sm:text-sm text-ink/50 mb-10 max-w-lg px-2"
        >
          Highest-risk phase. Typically carries the largest share of the premium.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-8"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-ink/40 mb-6"
        >
          Key risks
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 md:flex-nowrap">
          {['Vehicle failure', 'Stage separation anomalies', 'Payload fairing failures'].map((risk, i) => (
            <motion.div
              key={risk}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
              className="border border-ink/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 rounded-md"
              style={{ background: 'linear-gradient(135deg, #3A7CA503 0%, #3A7CA506 100%)' }}
            >
              <span className="font-sans text-[10px] sm:text-xs text-ink/60">{risk}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

function InOrbitInsuranceSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Coverage verticals</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          In-Orbit Insurance
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-8 rounded-2xl flex items-center justify-center p-3 lg:p-3.5 mx-auto"
          style={{ backgroundColor: '#8B5CF60A', border: '1.5px solid #8B5CF630' }}
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <circle cx="24" cy="24" r="14" fill="none" stroke="#8B5CF620" strokeWidth="1" />
            <circle cx="24" cy="24" r="8" fill="none" stroke="#8B5CF630" strokeWidth="0.75" strokeDasharray="3 2" />
            <motion.circle cx="24" cy="10" r="3" fill="#8B5CF6"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '24px 24px' }} />
            <circle cx="24" cy="24" r="4" fill="#8B5CF615" stroke="#8B5CF6" strokeWidth="1" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-base sm:text-lg md:text-xl leading-[1.4] tracking-[-0.02em] text-ink/70 max-w-xl mb-10 px-2"
        >
          Covers the on-orbit phase. Coverage can be structured across multiple sub-stages.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-8"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-ink/40 mb-6"
        >
          Coverage options
        </motion.p>

        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md">
          {[
            { label: 'Full mission duration', desc: 'Active coverage for the operational life of the spacecraft' },
            { label: 'Until payload commissioning', desc: 'Coverage until the payload is verified operational on orbit' },
            { label: 'Until ground station downlink', desc: 'Coverage until first successful contact with the ground station' },
          ].map((option, i) => (
            <motion.div
              key={option.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.4, ease: 'easeOut' }}
              className="w-full border border-ink/[0.08] px-4 sm:px-5 py-3 sm:py-4 rounded-md text-left"
              style={{ background: 'linear-gradient(135deg, #8B5CF603 0%, #8B5CF606 100%)' }}
            >
              <p className="font-sans text-xs font-semibold text-ink/75 mb-1">{option.label}</p>
              <p className="font-sans text-[10px] leading-relaxed text-ink/45">{option.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 7, THE PROCESS (1:N graph)
   ═══════════════════════════════════════════════════════════════ */

const REINSURER_NODES = [
  { label: 'Reinsurer 1', color: '#C4820E' },
  { label: 'Reinsurer 2', color: '#3A7CA5' },
  { label: 'Reinsurer 3', color: '#2A9D8F' },
  { label: 'Reinsurer 4', color: '#8B5CF6' },
  { label: 'Reinsurer N', color: '#5C6370' },
]

function TheProcessSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>The process</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 max-w-3xl"
        >
          One client. Many reinsurers.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          className="body-technical mb-14 max-w-2xl"
        >
          You need to engage multiple markets simultaneously to get competitive terms.
        </motion.p>

        {/* Desktop: 1:N graph */}
        <div className="hidden md:flex items-center justify-center gap-0 w-full max-w-4xl">
          {/* Client node */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center shrink-0"
          >
            <div
              className="w-[72px] h-[72px] lg:w-20 lg:h-20 mb-4 rounded-2xl flex items-center justify-center p-3 lg:p-3.5"
              style={{ backgroundColor: '#3A7CA50A', border: '1.5px solid #3A7CA530' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <circle cx="24" cy="16" r="7" fill="#3A7CA518" stroke="#3A7CA5" strokeWidth="1.5" />
                <path d="M12 42 C12 34 17 29 24 29 C31 29 36 34 36 42" stroke="#3A7CA5" strokeWidth="1.5" fill="#3A7CA508" />
              </svg>
            </div>
            <h3 className="font-serif text-lg lg:text-xl font-medium text-ink mb-1">Client</h3>
            <p className="font-sans text-[10px] lg:text-[11px] tracking-wide uppercase" style={{ color: '#3A7CA5' }}>You</p>
          </motion.div>

          {/* Branching arrows */}
          <div className="flex flex-col items-center justify-center gap-2 px-4 lg:px-6">
            {REINSURER_NODES.map((_, i) => (
              <motion.svg
                key={i}
                width="60" height="12" viewBox="0 0 60 12" fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
              >
                <motion.line x1="2" y1="6" x2="46" y2="6" stroke="#0D0D0D20" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.3, ease: 'easeInOut' }}
                />
                <motion.polyline points="42,2 52,6 42,10" stroke="#0D0D0D30" strokeWidth="1" fill="none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.2 }}
                />
              </motion.svg>
            ))}
          </div>

          {/* Reinsurer nodes */}
          <div className="flex flex-col gap-2">
            {REINSURER_NODES.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                className="flex items-center gap-3 border border-ink/[0.08] px-4 py-2.5 rounded-md"
                style={{ background: `linear-gradient(135deg, ${node.color}03 0%, ${node.color}06 100%)` }}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                <span className="font-sans text-xs text-ink/60">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical 1:N */}
        <div className="flex md:hidden flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 mb-3 rounded-2xl flex items-center justify-center p-3"
              style={{ backgroundColor: '#3A7CA50A', border: '1.5px solid #3A7CA530' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <circle cx="24" cy="16" r="7" fill="#3A7CA518" stroke="#3A7CA5" strokeWidth="1.5" />
                <path d="M12 42 C12 34 17 29 24 29 C31 29 36 34 36 42" stroke="#3A7CA5" strokeWidth="1.5" fill="#3A7CA508" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium text-ink mb-0.5">Client</h3>
            <p className="font-sans text-[10px] tracking-wide uppercase" style={{ color: '#3A7CA5' }}>You</p>
          </motion.div>

          <VerticalArrow color="#5C6370" delay={0.5} />

          <div className="flex flex-col gap-2">
            {REINSURER_NODES.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                className="flex items-center gap-3 border border-ink/[0.08] px-4 py-2.5 rounded-md"
                style={{ background: `linear-gradient(135deg, ${node.color}03 0%, ${node.color}06 100%)` }}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                <span className="font-sans text-xs text-ink/60">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 8, WHAT REINSURERS NEED
   ═══════════════════════════════════════════════════════════════ */

function WhatReinsurersNeedSlide() {
  const items = [
    { title: 'Safety case & failure mode analysis', desc: 'FMEA / FTA: structured breakdown of all failure modes, likelihood, severity, and mitigations.', color: '#C4820E' },
    { title: 'Risk analysis & mitigation plan', desc: 'End-to-end risk register covering design, manufacturing, integration, and operational risks.', color: '#3A7CA5' },
    { title: 'Parts documentation & heritage data', desc: 'Component-level records: manufacturer specs, qualification status, and flight heritage.', color: '#2A9D8F' },
    { title: 'Reliability & redundancy evidence', desc: 'MTBF, probability of success, redundant systems, and fault-tolerance documentation.', color: '#8B5CF6' },
  ]


  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>The bottleneck</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 max-w-3xl"
        >
          What reinsurers need from you.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full max-w-3xl mt-10 mb-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-start text-left border border-ink/[0.08] p-4 sm:p-5 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${item.color}03 0%, ${item.color}06 100%)` }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px]"
                style={{ backgroundColor: item.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
              />
              <h3 className="font-sans text-xs font-semibold text-ink/80 mb-2">{item.title}</h3>
              <p className="font-sans text-[10px] leading-relaxed text-ink/50">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-base sm:text-lg md:text-xl leading-[1.3] tracking-[-0.02em] text-ink/70 mb-8 px-2"
        >
          Gaps in this package directly result in higher premiums or declined coverage.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-6"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 9, HOW INVARIANT HELPS
   ═══════════════════════════════════════════════════════════════ */

const INVARIANT_SERVICES = [
  { label: 'Safety case & documentation', color: '#2A9D8F' },
  { label: 'Broker & reinsurer analysis', color: '#3A7CA5' },
  { label: 'Quote solicitation & evaluation', color: '#C4820E' },
  { label: 'Negotiations & correspondence', color: '#8B5CF6' },
  { label: 'Policy analysis & optimization', color: '#5C6370' },
]

function HowInvariantHelpsSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>How Invariant helps</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 max-w-3xl"
        >
          We sit between you and the market.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          className="body-technical mb-12 max-w-2xl px-2"
        >
          Forward-deployed engineering consultant at your site. End-to-end ownership.
        </motion.p>

        {/* Desktop: Client → Invariant → Reinsurers with services */}
        <div className="hidden md:flex items-start justify-center gap-0 w-full max-w-4xl">
          {/* Client */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center w-[120px] lg:w-[140px] shrink-0 pt-6"
          >
            <div
              className="w-16 h-16 mb-3 rounded-2xl flex items-center justify-center p-3"
              style={{ backgroundColor: '#3A7CA50A', border: '1.5px solid #3A7CA530' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <circle cx="24" cy="16" r="7" fill="#3A7CA518" stroke="#3A7CA5" strokeWidth="1.5" />
                <path d="M12 42 C12 34 17 29 24 29 C31 29 36 34 36 42" stroke="#3A7CA5" strokeWidth="1.5" fill="#3A7CA508" />
              </svg>
            </div>
            <h3 className="font-serif text-base font-medium text-ink mb-0.5">Client</h3>
          </motion.div>

          <div className="pt-12">
            <HorizontalArrow color="#2A9D8F" delay={0.55} />
          </div>

          {/* Invariant, center with services */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center border border-ink/[0.08] rounded-lg p-5 lg:p-6 mx-2"
            style={{ background: 'linear-gradient(135deg, #2A9D8F03 0%, #2A9D8F06 100%)' }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-[2px] rounded-t-lg"
              style={{ backgroundColor: '#2A9D8F' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
            />
            <h3 className="font-serif text-lg font-medium text-ink mb-1">Invariant AI</h3>
            <p className="font-sans text-[10px] tracking-wide uppercase mb-4" style={{ color: '#2A9D8F' }}>We handle</p>
            <div className="flex flex-col gap-2">
              {INVARIANT_SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center"
                >
                  <span className="font-sans text-[11px] text-ink/60 text-left">{svc.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="pt-12">
            <HorizontalArrow color="#C4820E" delay={0.85} />
          </div>

          {/* Reinsurers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center w-[120px] lg:w-[140px] shrink-0 pt-6"
          >
            <div
              className="w-16 h-16 mb-3 rounded-2xl flex items-center justify-center p-3"
              style={{ backgroundColor: '#C4820E0A', border: '1.5px solid #C4820E30' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect x="8" y="6" width="32" height="36" rx="2" fill="#C4820E08" stroke="#C4820E" strokeWidth="1.2" />
                <path d="M18 18 L22 22 L30 14" stroke="#C4820E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="16" y1="28" x2="32" y2="28" stroke="#C4820E40" strokeWidth="1" strokeLinecap="round" />
                <line x1="16" y1="33" x2="28" y2="33" stroke="#C4820E40" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-serif text-base font-medium text-ink mb-0.5">Reinsurers</h3>
          </motion.div>
        </div>

        {/* Mobile: vertical */}
        <div className="flex md:hidden flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 mb-2 rounded-2xl flex items-center justify-center p-2.5"
              style={{ backgroundColor: '#3A7CA50A', border: '1.5px solid #3A7CA530' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <circle cx="24" cy="16" r="7" fill="#3A7CA518" stroke="#3A7CA5" strokeWidth="1.5" />
                <path d="M12 42 C12 34 17 29 24 29 C31 29 36 34 36 42" stroke="#3A7CA5" strokeWidth="1.5" fill="#3A7CA508" />
              </svg>
            </div>
            <h3 className="font-serif text-base font-medium text-ink">Client</h3>
          </motion.div>

          <VerticalArrow color="#2A9D8F" delay={0.5} />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-col items-center border border-ink/[0.08] rounded-lg p-5 w-full max-w-xs"
            style={{ background: 'linear-gradient(135deg, #2A9D8F03 0%, #2A9D8F06 100%)' }}
          >
            <h3 className="font-serif text-lg font-medium text-ink mb-1">Invariant AI</h3>
            <p className="font-sans text-[10px] tracking-wide uppercase mb-3" style={{ color: '#2A9D8F' }}>We handle</p>
            <div className="flex flex-col gap-2">
              {INVARIANT_SERVICES.map((svc, i) => (
                <motion.div
                  key={svc.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
                  className="flex items-center"
                >
                  <span className="font-sans text-[11px] text-ink/60 text-left">{svc.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <VerticalArrow color="#C4820E" delay={0.9} />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 mb-2 rounded-2xl flex items-center justify-center p-2.5"
              style={{ backgroundColor: '#C4820E0A', border: '1.5px solid #C4820E30' }}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <rect x="8" y="6" width="32" height="36" rx="2" fill="#C4820E08" stroke="#C4820E" strokeWidth="1.2" />
                <path d="M18 18 L22 22 L30 14" stroke="#C4820E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="16" y1="28" x2="32" y2="28" stroke="#C4820E40" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="font-serif text-base font-medium text-ink">Reinsurers</h3>
          </motion.div>
        </div>

      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 10, INDIA-SPECIFIC REGULATORY CONSTRAINT
   ═══════════════════════════════════════════════════════════════ */

function IndiaConstraintSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>India-specific constraint</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          50% mandatory domestic co-insurance.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
          className="body-technical max-w-2xl mb-10"
        >
          Indian law mandates that 50% of the insured sum be co-insured with a domestic insurer: New India Assurance, GIC Re, United India Insurance, ICICI Lombard, HDFC, etc.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-3xl mb-12">
          {[
            {
              title: 'Limited domestic capacity',
              desc: 'Indian insurers lack the technical underwriting capability for launch risk. They participate as co-insurers on paper but add no risk assessment value, which international reinsurers view unfavorably.',
              color: '#C4820E',
              icon: (c: string) => (
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                  <circle cx="24" cy="24" r="16" fill={`${c}08`} stroke={`${c}30`} strokeWidth="1.2" />
                  <path d="M16 28 Q20 18 24 20 Q28 22 32 16" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <motion.line x1="14" y1="14" x2="34" y2="34" stroke={c} strokeWidth="1.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }} />
                </svg>
              ),
            },
            {
              title: 'Friction for first-time vehicles',
              desc: 'Reinsurers already apply higher scrutiny to unproven launch vehicles. The mandatory domestic co-insurance requirement adds a structural layer of complexity, making placement harder and slower.',
              color: '#3A7CA5',
              icon: (c: string) => (
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                  <path d="M10 38 A18 18 0 0 1 38 38" stroke={`${c}25`} strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M10 38 A18 18 0 0 1 38 38" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="46" strokeDashoffset="38" />
                  <line x1="24" y1="38" x2="16" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="24" cy="38" r="2.5" fill={c} />
                </svg>
              ),
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center border border-ink/[0.08] p-4 sm:p-6 md:p-7"
              style={{ background: `linear-gradient(135deg, ${card.color}03 0%, ${card.color}06 100%)` }}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 rounded-xl flex items-center justify-center p-2.5 sm:p-3"
                style={{ backgroundColor: `${card.color}0A`, border: `1.5px solid ${card.color}30` }}
              >
                {card.icon(card.color)}
              </div>
              <h3 className="font-serif text-base sm:text-lg font-medium text-ink mb-2">{card.title}</h3>
              <p className="font-sans text-[11px] sm:text-xs leading-relaxed text-ink/55">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xs mb-6"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}
          className="font-serif text-lg md:text-xl leading-[1.3] tracking-[-0.02em] text-ink/70 max-w-lg"
        >
          Start the insurance process 8,10 months before the planned launch date.
        </motion.p>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE, THE EXCHANGE
   ═══════════════════════════════════════════════════════════════ */

function TheExchangeSlide() {
  const getItems = [
    { label: 'Safety case ownership', color: '#C4820E', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="10" y="8" width="28" height="32" rx="2" fill={`${c}10`} stroke={c} strokeWidth="1.5" />
        <path d="M19 24 L23 28 L31 18" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )},
    { label: 'Broker management', color: '#3A7CA5', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="16" r="7" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <path d="M12 40 C12 32 18 28 24 28 C30 28 36 32 36 40" stroke={c} strokeWidth="1.5" fill={`${c}10`} />
      </svg>
    )},
    { label: 'Optimal premium', color: '#2A9D8F', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={`${c}25`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="46" strokeDashoffset="8" />
        <line x1="24" y1="38" x2="33" y2="24" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2.5" fill={c} />
      </svg>
    )},
    { label: 'Zero new hires', color: '#5C6370', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="18" cy="18" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <circle cx="30" cy="18" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <path d="M10 38 C10 32 14 28 18 28" stroke={`${c}40`} strokeWidth="1.2" fill="none" />
        <path d="M30 28 C34 28 38 32 38 38" stroke={`${c}40`} strokeWidth="1.2" fill="none" />
        <line x1="20" y1="34" x2="28" y2="34" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )},
  ]

  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>The exchange</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 max-w-3xl"
        >
          What you give. What you get.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full max-w-4xl items-start gap-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-8 md:py-12"
          >
            <p className="font-serif text-lg md:text-xl font-medium text-ink/35 mb-8">You give us</p>
            <p className="font-serif text-5xl sm:text-6xl md:text-8xl font-medium tracking-[-0.04em] text-ink leading-none">3,4</p>
            <p className="font-sans text-xs sm:text-sm text-ink/50 mt-3">hours of your lead systems engineer</p>
            <p className="font-sans text-[10px] sm:text-xs text-ink/30 mt-1">occasional availability for reinsurer calls</p>
          </motion.div>

          <div className="hidden md:flex flex-col items-center justify-center px-6 self-stretch">
            <motion.div
              className="w-px flex-1 bg-rule"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />
            <motion.svg
              width="32" height="32" viewBox="0 0 32 32" fill="none"
              className="my-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
            >
              <motion.line x1="4" y1="16" x2="22" y2="16" stroke="#0D0D0D" strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.4, ease: 'easeInOut' }}
              />
              <motion.polyline points="18,10 28,16 18,22" stroke="#0D0D0D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.25 }}
              />
            </motion.svg>
            <motion.div
              className="w-px flex-1 bg-rule"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom' }}
            />
          </div>
          <div className="flex md:hidden items-center justify-center py-3">
            <motion.svg
              width="32" height="32" viewBox="0 0 32 32" fill="none"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
            >
              <motion.line x1="16" y1="4" x2="16" y2="22" stroke="#0D0D0D" strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.4, ease: 'easeInOut' }}
              />
              <motion.polyline points="10,18 16,28 22,18" stroke="#0D0D0D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.25 }}
              />
            </motion.svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            className="py-8 md:py-12"
          >
            <p className="font-serif text-lg md:text-xl font-medium mb-8 text-center" style={{ color: '#2A9D8F' }}>You get</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {getItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center text-center border border-ink/[0.08] p-3 sm:p-4 md:p-5"
                  style={{ background: `linear-gradient(135deg, ${item.color}03 0%, ${item.color}06 100%)` }}
                >
                  <motion.div
                    className="w-12 h-12 mb-3 rounded-xl flex items-center justify-center p-2"
                    style={{ backgroundColor: `${item.color}0A`, border: `1.5px solid ${item.color}25` }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.3, ease: 'easeOut' }}
                  >
                    {item.icon(item.color)}
                  </motion.div>
                  <p className="font-sans text-xs font-medium text-ink/70">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 8, WHY INVARIANT
   ═══════════════════════════════════════════════════════════════ */

const TEAM_LOGOS_ROW1 = [
  { src: '/team/skyroot-logo.jpeg', alt: 'Skyroot Aerospace' },
]
const TEAM_LOGOS_ROW2 = [
  { src: '/team/iisc-logo.png', alt: 'Indian Institute of Science' },
  { src: '/team/kgp-logo.png', alt: 'IIT Kharagpur' },
  { src: '/team/Purdue-University-Logo.png', alt: 'Purdue University' },
]

function WhyInvariantSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Why Invariant</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl"
        >
          Why Invariant?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
          className="body-technical max-w-xl mb-14"
        >
          Built by people who've handled missions from:
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-8 max-w-3xl mx-auto mb-14"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 md:gap-x-16">
            {TEAM_LOGOS_ROW1.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="h-8 sm:h-12 md:h-14 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10 md:gap-x-14">
            {TEAM_LOGOS_ROW2.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="h-8 sm:h-12 md:h-14 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </motion.div>

      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CTA SLIDE
   ═══════════════════════════════════════════════════════════════ */

function CTASlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="body-technical max-w-sm mb-10"
        >
          If launch insurance is on your critical path,
        </motion.p>

        <motion.a
          href="mailto:founders@invariant-ai.com"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-ink hover:text-ink/70 transition-colors"
        >
          founders@invariant-ai.com
        </motion.a>

        <motion.a
          href="tel:+919328276067"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="font-sans text-sm sm:text-base md:text-lg text-ink/50 hover:text-ink transition-colors mt-4"
        >
          +91 93282 76067
        </motion.a>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[100px] mt-10 mb-4"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="font-sans text-xs text-ink/35 tracking-wide"
        >
          invariant-ai.com
        </motion.p>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DECK
   ═══════════════════════════════════════════════════════════════ */

const slides: { id: string; render: () => React.ReactNode }[] = [
  { id: 'hero', render: () => <HeroSlide /> },
  { id: 'coverage-verticals', render: () => <CoverageVerticalsSlide /> },
  { id: 'transit-insurance', render: () => <TransitInsuranceSlide /> },
  { id: 'prelaunch-insurance', render: () => <PreLaunchInsuranceSlide /> },
  { id: 'launch-insurance', render: () => <LaunchInsuranceSlide /> },
  { id: 'inorbit-insurance', render: () => <InOrbitInsuranceSlide /> },
  { id: 'the-process', render: () => <TheProcessSlide /> },
  { id: 'what-reinsurers-need', render: () => <WhatReinsurersNeedSlide /> },
  { id: 'how-invariant-helps', render: () => <HowInvariantHelpsSlide /> },
  { id: 'india-constraint', render: () => <IndiaConstraintSlide /> },
  { id: 'the-exchange', render: () => <TheExchangeSlide /> },
  { id: 'why-invariant', render: () => <WhyInvariantSlide /> },
  { id: 'cta', render: () => <CTASlide /> },
]

export default function InsuranceDeck() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const total = slides.length

  const go = useCallback((next: number) => {
    if (next < 0 || next >= total || next === current) return
    setDirection(next > current ? 1 : -1)
    setCurrent(next)
  }, [current, total])

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      if (e.key === 'Home') { e.preventDefault(); go(0) }
      if (e.key === 'End') { e.preventDefault(); go(total - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  useEffect(() => {
    let startX = 0, startY = 0
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) { if (dx < 0) next(); else prev() }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd) }
  }, [next, prev])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white select-none relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SLIDE_TRANSITION}
          className="absolute inset-0"
        >
          {slides[current].render()}
        </motion.div>
      </AnimatePresence>

      {current > 0 && (
        <button onClick={prev} aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-ink/[0.04] transition-colors rounded-full"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30" />
          </svg>
        </button>
      )}

      {current < total - 1 && (
        <button onClick={next} aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-ink/[0.04] transition-colors rounded-full"
        >
          <motion.svg
            width="18" height="18" viewBox="0 0 18 18" fill="none"
            animate={current === 0 ? { x: [0, 4, 0] } : { x: 0 }}
            transition={current === 0 ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          >
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={current === 0 ? 'text-ink' : 'text-ink/30'} />
          </motion.svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-sm border-t border-ink/[0.04]">
        <span className="font-serif text-xs sm:text-sm font-medium tracking-[-0.02em] text-ink/25">Invariant</span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-4 sm:w-6 bg-ink/60' : 'w-1.5 sm:w-2 bg-ink/12 hover:bg-ink/25'}`}
            />
          ))}
        </div>
        <span className="font-sans text-[10px] sm:text-xs tabular-nums text-ink/30">
          {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
