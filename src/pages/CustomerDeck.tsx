import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
const TOTAL = 8

/* ═══════════════════════════════════════════════════════════════
   FLOWING BACKGROUND — from Hero.tsx
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
   ANIMATED VISUALS — from WhoWeServe.tsx
   ═══════════════════════════════════════════════════════════════ */

function NuclearReactor() {
  return (
    <div className="relative w-[220px] h-[200px] md:w-[280px] md:h-[240px]">
      <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <line x1="20" y1="240" x2="300" y2="240" stroke="#C4820E30" strokeWidth="1" />
        <path d="M50 240 Q50 180 65 150 Q72 135 60 100 L62 70 Q75 60 88 70 L90 100 Q78 135 85 150 Q100 180 100 240 Z" fill="#C4820E10" stroke="#C4820E40" strokeWidth="1" />
        <ellipse cx="75" cy="72" rx="14" ry="5" fill="#C4820E08" stroke="#C4820E30" strokeWidth="0.75" />
        {[0, 1, 2].map((i) => (
          <motion.ellipse key={`sl-${i}`} cx={70 + i * 5} rx={6 + i * 3} ry={4 + i * 2} fill="#C4820E"
            initial={{ cy: 68, opacity: 0.15 }}
            animate={{ cy: [68, 30 - i * 12], opacity: [0.15, 0], rx: [6 + i * 3, 14 + i * 5], ry: [4 + i * 2, 8 + i * 3] }}
            transition={{ duration: 3 + i * 0.5, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <path d="M135 130 Q135 85 175 75 Q215 85 215 130" fill="#C4820E08" stroke="#C4820E50" strokeWidth="1.5" />
        <rect x="135" y="130" width="80" height="110" rx="2" fill="#C4820E0C" stroke="#C4820E50" strokeWidth="1.5" />
        <line x1="135" y1="160" x2="215" y2="160" stroke="#C4820E25" strokeWidth="0.75" />
        <line x1="135" y1="190" x2="215" y2="190" stroke="#C4820E25" strokeWidth="0.75" />
        <line x1="135" y1="220" x2="215" y2="220" stroke="#C4820E25" strokeWidth="0.75" />
        <motion.circle cx="175" cy="180" r="20" fill="none" style={{ filter: 'blur(8px)' }} stroke="#C4820E" strokeWidth="2"
          animate={{ opacity: [0.2, 0.5, 0.2], r: [18, 22, 18] as number[] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle cx="175" cy="180" r="10" fill="#C4820E"
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[-6, -2, 2, 6].map((dx) => (
          <motion.line key={`rod-${dx}`} x1={175 + dx} y1={170} x2={175 + dx} y2={190} stroke="#C4820E" strokeWidth="1.5" strokeLinecap="round"
            animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.8, delay: Math.abs(dx) * 0.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <path d="M230 240 Q230 185 242 158 Q248 143 238 112 L240 85 Q251 76 262 85 L264 112 Q254 143 260 158 Q272 185 272 240 Z" fill="#C4820E10" stroke="#C4820E40" strokeWidth="1" />
        <ellipse cx="251" cy="87" rx="12" ry="4.5" fill="#C4820E08" stroke="#C4820E30" strokeWidth="0.75" />
        {[0, 1, 2].map((i) => (
          <motion.ellipse key={`sr-${i}`} cx={248 + i * 4} rx={5 + i * 3} ry={3 + i * 2} fill="#C4820E"
            initial={{ cy: 83, opacity: 0.12 }}
            animate={{ cy: [83, 40 - i * 14], opacity: [0.12, 0], rx: [5 + i * 3, 12 + i * 5], ry: [3 + i * 2, 7 + i * 3] }}
            transition={{ duration: 3.5 + i * 0.4, delay: 0.4 + i * 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <line x1="100" y1="210" x2="135" y2="210" stroke="#C4820E30" strokeWidth="1.5" />
        <line x1="215" y1="210" x2="230" y2="210" stroke="#C4820E30" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <motion.circle key={`cl-${i}`} cy={210} r={2} fill="#C4820E" opacity={0.5}
            initial={{ cx: 100 }} animate={{ cx: [100, 135] }}
            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle key={`cr-${i}`} cy={210} r={2} fill="#C4820E" opacity={0.5}
            initial={{ cx: 215 }} animate={{ cx: [215, 230] }}
            transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        <motion.g animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <circle cx="175" cy="140" r="3" fill="#C4820E" />
          {[0, 120, 240].map((angle) => {
            const rad = (angle * Math.PI) / 180
            return <line key={`rad-${angle}`} x1={175 + Math.sin(rad) * 5} y1={140 - Math.cos(rad) * 5} x2={175 + Math.sin(rad) * 12} y2={140 - Math.cos(rad) * 12} stroke="#C4820E" strokeWidth="2.5" strokeLinecap="round" />
          })}
        </motion.g>
      </svg>
    </div>
  )
}

function RocketLaunch() {
  return (
    <div className="relative w-[190px] h-[190px] md:w-[240px] md:h-[240px] overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={`star-${i}`} className="absolute rounded-full"
          style={{ width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1, backgroundColor: '#3A7CA5', left: `${10 + (i * 37) % 80}%`, top: `${5 + (i * 53) % 85}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.5 + (i % 3) * 0.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div className="absolute left-1/2 top-1/2 rounded-full border" style={{ width: 170, height: 170, marginLeft: -85, marginTop: -85, borderColor: '#3A7CA515' }}
        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div className="absolute -top-[5px] left-1/2 -translate-x-1/2" style={{ width: 10, height: 10 }}>
          <div className="w-[10px] h-[4px] bg-[#3A7CA5] rounded-sm relative">
            <div className="absolute -left-[6px] top-[1px] w-[5px] h-[2px] bg-[#3A7CA580]" />
            <div className="absolute -right-[6px] top-[1px] w-[5px] h-[2px] bg-[#3A7CA580]" />
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[25%]">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="32" height="72" viewBox="0 0 36 80" fill="none">
            <path d="M18 2 L26 28 H10 Z" fill="#3A7CA5" stroke="#3A7CA540" strokeWidth="0.5" />
            <rect x="10" y="28" width="16" height="32" rx="1" fill="#3A7CA5CC" stroke="#3A7CA540" strokeWidth="0.5" />
            <circle cx="18" cy="38" r="4" fill="#0D0D0D20" stroke="#3A7CA560" strokeWidth="0.5" />
            <path d="M10 52 L2 66 H10 Z" fill="#3A7CA580" />
            <path d="M26 52 L34 66 H26 Z" fill="#3A7CA580" />
            <path d="M12 60 L10 68 H26 L24 60 Z" fill="#5C637080" />
          </svg>
          <div className="flex justify-center -mt-1">
            <motion.div className="flex flex-col items-center" animate={{ scaleY: [0.8, 1.3, 0.9, 1.2, 0.8] }} transition={{ duration: 0.3, repeat: Infinity }}>
              <div className="w-[12px] h-[18px] rounded-b-full" style={{ background: 'linear-gradient(to bottom, #C4820EDD, #C4820E88, #C4820E22)' }} />
              <motion.div className="w-[8px] h-[12px] rounded-b-full -mt-1" style={{ background: 'linear-gradient(to bottom, #C4820E66, #C4820E22, transparent)' }}
                animate={{ scaleY: [1, 1.5, 0.8, 1.2, 1] }} transition={{ duration: 0.25, repeat: Infinity }}
              />
            </motion.div>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <motion.div key={`smoke-${i}`} className="absolute rounded-full"
              style={{ width: 6 + i * 2, height: 6 + i * 2, backgroundColor: '#5C637015', left: 12 + (i % 2 === 0 ? -4 : 8), bottom: -20 }}
              animate={{ y: [0, 40 + i * 15], x: [0, (i % 2 === 0 ? -1 : 1) * (10 + i * 5)], opacity: [0.5, 0], scale: [1, 2.5] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      </div>
      <motion.div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px]"
        style={{ background: 'linear-gradient(to top, transparent, #3A7CA520, #3A7CA540, transparent)', height: '30%' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
   SLIDE 1 — HERO
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
          className="font-serif text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-medium tracking-[-0.04em] text-ink mb-6"
        >
          Invariant AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
          className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-[-0.02em] text-ink"
        >
          AI-native services for regulated compliance.
        </motion.p>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 2 — YOUR WORLD
   ═══════════════════════════════════════════════════════════════ */

const SECTORS = [
  { id: 'nuclear', title: 'Nuclear', color: '#C4820E', desc: 'From licence applications to safety analysis reports.', Visual: NuclearReactor },
  { id: 'spacetech', title: 'Space-Tech', color: '#3A7CA5', desc: 'From launch vehicle certification to satellite licensing.', Visual: RocketLaunch },
]

function YourWorldSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>Your world</SlideLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-3xl mx-auto mb-12">
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.25, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6"><sector.Visual /></div>
              <motion.span
                className="font-mono text-xs tracking-[0.25em] uppercase font-medium mb-2 block"
                style={{ color: sector.color }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.25, duration: 0.5 }}
              >
                {sector.title}
              </motion.span>
              <motion.p
                className="font-mono text-sm leading-relaxed text-ink/60 max-w-xs"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.25, duration: 0.5 }}
              >
                {sector.desc}
              </motion.p>
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
          className="font-serif text-lg md:text-xl lg:text-2xl leading-[1.3] tracking-[-0.02em] text-ink/70 max-w-lg"
        >
          Nothing flies, operates, or goes critical without regulatory authorisation.
        </motion.p>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 3 — THE PROBLEM (cards)
   ═══════════════════════════════════════════════════════════════ */

const PROBLEM_CARDS = [
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="12" y="6" width="24" height="30" rx="2" fill={`${c}10`} stroke={`${c}50`} strokeWidth="1.5" />
        <line x1="16" y1="14" x2="32" y2="14" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="19" x2="28" y2="19" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="24" x2="30" y2="24" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <circle cx="16" cy="18" r="6" fill={`${c}25`} stroke={c} strokeWidth="1.5" />
        <circle cx="32" cy="18" r="6" fill={`${c}25`} stroke={c} strokeWidth="1.5" />
        <path d="M22 20 Q24 16 26 20" stroke={c} strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
      </svg>
    ),
    title: 'Engineers on doc duty',
    desc: 'Your best people writing compliance documents instead of building.',
    color: '#C4820E',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={`${c}25`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="46" strokeDashoffset="38" />
        <line x1="24" y1="38" x2="16" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2.5" fill={c} />
        <text x="8" y="46" fontSize="5" fill={c} fontFamily="monospace" fontWeight="bold">slow</text>
        <text x="33" y="46" fontSize="5" fill={`${c}60`} fontFamily="monospace">fast</text>
      </svg>
    ),
    title: 'One query, one quarter',
    desc: 'A single unanswered regulator query stalls your entire programme.',
    color: '#3A7CA5',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="16" cy="20" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <circle cx="32" cy="20" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <path d="M22 20 L26 20" stroke={`${c}40`} strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="26" x2="32" y2="36" stroke={`${c}30`} strokeWidth="1" strokeDasharray="3 2" />
        <text x="28" y="43" fontSize="5" fill={`${c}60`} fontFamily="monospace">gone</text>
      </svg>
    ),
    title: "Can't staff it",
    desc: "You can't hire fast enough. Consultants disappear after submission.",
    color: '#5C6370',
  },
]

function ProblemSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>The problem</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 max-w-3xl"
        >
          Compliance won't wait.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
          {PROBLEM_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center border border-ink/[0.08] p-6 md:p-7"
              style={{ background: `linear-gradient(135deg, ${card.color}03 0%, ${card.color}06 100%)` }}
            >
              <motion.div
                className="w-16 h-16 lg:w-[72px] lg:h-[72px] mb-5 flex items-center justify-center p-3"
                style={{ backgroundColor: `${card.color}0A`, border: `1.5px solid ${card.color}30`, borderRadius: 16 }}
                whileHover={{ scale: 1.06, backgroundColor: `${card.color}14` }}
                transition={{ duration: 0.2 }}
              >
                {card.icon(card.color)}
              </motion.div>
              <h3 className="font-serif text-lg font-medium text-ink mb-2">{card.title}</h3>
              <p className="font-mono text-xs leading-relaxed text-ink/55">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 4 — THE SOLUTION (tighter)
   ═══════════════════════════════════════════════════════════════ */

function SolutionSlide() {
  const cols = [
    { title: 'Embedded team', color: '#2A9D8F', desc: 'Engineer and regulatory specialist in your workflow.' },
    { title: 'Agentic workflows', color: '#3A7CA5', desc: 'AI pipelines for documentation and filing.' },
    { title: 'Regulatory liaison', color: '#C4820E', desc: 'Single point of contact with every authority.' },
  ]

  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>The solution</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 max-w-3xl"
        >
          We own your compliance path.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-4xl">
          {cols.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <span className="font-mono text-xs tracking-[0.2em] uppercase font-medium mb-3 block" style={{ color: col.color }}>
                {col.title}
              </span>
              <p className="font-mono text-sm leading-relaxed text-ink/60">{col.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 5 — HOW WE WORK (icon flow like HowWeWork.tsx)
   ═══════════════════════════════════════════════════════════════ */

const FLOW_STEPS = [
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="16" cy="18" r="6" fill={`${c}25`} stroke={c} strokeWidth="1.5" />
        <circle cx="32" cy="18" r="6" fill={`${c}25`} stroke={c} strokeWidth="1.5" />
        <path d="M22 20 Q24 16 26 20" stroke={c} strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
        <rect x="14" y="32" width="20" height="12" rx="2" fill={`${c}10`} stroke={`${c}50`} strokeWidth="1" />
        <line x1="18" y1="36" x2="30" y2="36" stroke={`${c}40`} strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="40" x2="26" y2="40" stroke={`${c}40`} strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    title: 'Engage',
    subtitle: 'Map compliance surface',
    color: '#2A9D8F',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="12" cy="20" r="5" fill="#5C637018" stroke="#5C6370" strokeWidth="1" />
        <circle cx="24" cy="20" r="5" fill="#5C637018" stroke="#5C6370" strokeWidth="1" />
        <circle cx="36" cy="20" r="5" fill={`${c}25`} stroke={c} strokeWidth="1.5" />
        <path d="M36 14 L36 8" stroke={c} strokeWidth="1" strokeLinecap="round" />
        <path d="M33 10 L36 6 L39 10" stroke={c} strokeWidth="1" fill="none" strokeLinecap="round" />
        <rect x="6" y="32" width="36" height="10" rx="3" fill={`${c}08`} stroke={`${c}40`} strokeWidth="1" />
        <text x="24" y="39.5" fontSize="5" fill={c} fontFamily="monospace" textAnchor="middle" fontWeight="500">EMBEDDED</text>
      </svg>
    ),
    title: 'Deploy',
    subtitle: 'Embed with your team',
    color: '#C4820E',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="14" cy="14" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <circle cx="34" cy="14" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <circle cx="24" cy="34" r="6" fill={`${c}15`} stroke={c} strokeWidth="1.2" />
        <line x1="19" y1="16" x2="29" y2="16" stroke={`${c}40`} strokeWidth="1" />
        <line x1="16" y1="19" x2="22" y2="30" stroke={`${c}40`} strokeWidth="1" />
        <line x1="32" y1="19" x2="26" y2="30" stroke={`${c}40`} strokeWidth="1" />
        <circle cx="14" cy="14" r="2.5" fill={c} />
        <circle cx="34" cy="14" r="2.5" fill={c} />
        <circle cx="24" cy="34" r="2.5" fill={c} />
      </svg>
    ),
    title: 'Automate',
    subtitle: 'Agentic AI workflows',
    color: '#3A7CA5',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={`${c}25`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M10 38 A18 18 0 0 1 38 38" stroke={c} strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="46" strokeDashoffset="8" />
        <line x1="24" y1="38" x2="33" y2="24" stroke={c} strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2.5" fill={c} />
        <text x="8" y="46" fontSize="5" fill={`${c}60`} fontFamily="monospace">slow</text>
        <text x="33" y="46" fontSize="5" fill={c} fontFamily="monospace" fontWeight="bold">fast</text>
      </svg>
    ),
    title: 'Accelerate',
    subtitle: 'Months → days',
    color: '#8B5CF6',
  },
  {
    icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="12" y="6" width="24" height="30" rx="2" fill={`${c}10`} stroke={`${c}50`} strokeWidth="1.5" />
        <line x1="16" y1="14" x2="32" y2="14" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="19" x2="28" y2="19" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="24" x2="30" y2="24" stroke={`${c}30`} strokeWidth="1" strokeLinecap="round" />
        <circle cx="34" cy="34" r="10" fill={`${c}15`} stroke={c} strokeWidth="2" />
        <path d="M29 34 L33 38 L40 30" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: 'Done',
    subtitle: 'Compliance approved',
    color: '#2A9D8F',
  },
]

function HowWeWorkSlide() {
  return (
    <SlideShell>
      <div className="flex flex-col items-center text-center">
        <SlideLabel>How we work</SlideLabel>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4"
        >
          How we work.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          className="body-technical mb-12"
        >
          One engagement. End-to-end compliance.
        </motion.p>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-start justify-center">
          {FLOW_STEPS.map((step, i) => {
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
                    style={{ backgroundColor: `${step.color}0A`, border: `1.5px solid ${step.color}30` }}
                    whileHover={{ scale: 1.06, backgroundColor: `${step.color}14` }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.icon(step.color)}
                  </motion.div>
                  <h3 className="font-serif text-lg lg:text-xl font-medium text-ink mb-1 text-center">{step.title}</h3>
                  <p className="font-mono text-[10px] lg:text-[11px] tracking-wide uppercase text-center" style={{ color: step.color }}>
                    {step.subtitle}
                  </p>
                </motion.div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="pt-8 lg:pt-9">
                    <HorizontalArrow color={FLOW_STEPS[i + 1].color} delay={delay + 0.25} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex md:hidden flex-col items-center">
          {FLOW_STEPS.map((step, i) => {
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
                    style={{ backgroundColor: `${step.color}0A`, border: `1.5px solid ${step.color}30` }}
                  >
                    {step.icon(step.color)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-ink mb-0.5 text-center">{step.title}</h3>
                  <p className="font-mono text-[10px] tracking-wide uppercase text-center" style={{ color: step.color }}>
                    {step.subtitle}
                  </p>
                </motion.div>
                {i < FLOW_STEPS.length - 1 && (
                  <VerticalArrow color={FLOW_STEPS[i + 1].color} delay={delay + 0.2} />
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
   SLIDE 6 — WHAT WE NEED (visual layout)
   ═══════════════════════════════════════════════════════════════ */

function TheExchangeSlide() {
  const getItems = [
    { label: 'Embedded engineer', color: '#C4820E', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="16" r="7" fill={`${c}20`} stroke={c} strokeWidth="1.5" />
        <path d="M12 40 C12 32 18 28 24 28 C30 28 36 32 36 40" stroke={c} strokeWidth="1.5" fill={`${c}10`} />
        <path d="M36 14 L36 8" stroke={c} strokeWidth="1" strokeLinecap="round" />
        <path d="M33 10 L36 6 L39 10" stroke={c} strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    )},
    { label: 'Compliance ownership', color: '#2A9D8F', icon: (c: string) => (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="10" y="8" width="28" height="32" rx="2" fill={`${c}10`} stroke={c} strokeWidth="1.5" />
        <path d="M19 24 L23 28 L31 18" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )},
    { label: 'Regulatory velocity', color: '#3A7CA5', icon: (c: string) => (
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
          {/* LEFT — you give */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-8 md:py-12"
          >
            <p className="font-serif text-lg md:text-xl font-medium text-ink/35 mb-8">You give us</p>
            <p className="font-serif text-6xl sm:text-7xl md:text-8xl font-medium tracking-[-0.04em] text-ink leading-none">3–4</p>
            <p className="font-mono text-sm text-ink/50 mt-3">hours per week</p>
            <p className="font-mono text-xs text-ink/30 mt-1">one senior engineer</p>
          </motion.div>

          {/* CENTER — divider + animated arrow */}
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

          {/* RIGHT — you get */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            className="py-8 md:py-12"
          >
            <p className="font-serif text-lg md:text-xl font-medium mb-8 text-center" style={{ color: '#2A9D8F' }}>You get</p>
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {getItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center text-center border border-ink/[0.08] p-4 md:p-5"
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
                  <p className="font-mono text-xs font-medium text-ink/70">{item.label}</p>
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
   SLIDE 8 — WHY INVARIANT
   ═══════════════════════════════════════════════════════════════ */

const TEAM_LOGOS_ROW1 = [
  { src: '/team/skyroot-logo.jpeg', alt: 'Skyroot Aerospace' },
  { src: '/team/galaxeye-logo.png', alt: 'GalaxEye' },
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
          <div className="flex items-center justify-center gap-x-12 md:gap-x-16">
            {TEAM_LOGOS_ROW1.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="h-12 md:h-14 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-x-10 md:gap-x-14">
            {TEAM_LOGOS_ROW2.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="h-12 md:h-14 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </motion.div>

        <Rule className="max-w-xs mx-auto mb-8" />

        <div className="flex flex-col items-center max-w-xl gap-6">
          {[
            { text: 'helion-512 — state-of-the-art on FermiBench. NDCG@10: 0.9693.', color: '#C4820E' },
            { text: 'Active MSA with an orbital launch and reentry client.', color: '#3A7CA5' },
            { text: 'We close on authorisation, not on hours billed.', color: '#5C6370' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
              className="flex items-start gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: item.color }} />
              <p className="font-mono text-sm leading-relaxed text-ink/65 text-left">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 9 — LET'S TALK (minimal)
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
          If compliance is on your critical path —
        </motion.p>

        <motion.a
          href="mailto:founders@invariant-ai.com"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-ink hover:text-ink/70 transition-colors"
        >
          founders@invariant-ai.com
        </motion.a>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[100px] mt-10 mb-4"
          style={{ transformOrigin: 'center' }}
        >
          <Rule />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="font-mono text-xs text-ink/35 tracking-wide"
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
  { id: 'your-world', render: () => <YourWorldSlide /> },
  { id: 'problem', render: () => <ProblemSlide /> },
  { id: 'solution', render: () => <SolutionSlide /> },
  { id: 'how-we-work', render: () => <HowWeWorkSlide /> },
  { id: 'the-exchange', render: () => <TheExchangeSlide /> },
  { id: 'why-invariant', render: () => <WhyInvariantSlide /> },
  { id: 'cta', render: () => <CTASlide /> },
]

export default function CustomerDeck() {
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
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-ink/60' : 'w-2 bg-ink/12 hover:bg-ink/25'}`}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] sm:text-xs tabular-nums text-ink/30">
          {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
