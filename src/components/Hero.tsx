import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REGULATORY_PROSE = `Section 4.2.1: The applicant shall demonstrate, through deterministic and probabilistic analysis, that the proposed design meets the acceptance criteria of 10 CFR 50.46 for emergency core cooling system performance under all postulated loss-of-coolant accident scenarios, including documentation of all assumptions, boundary conditions, and analytical methods employed...`

const CHARS_TO_TYPE = 220

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
  { type: 'satellite', y: '20%', delay: 1, duration: 18, color: '#3A7CA5', bob: -12 },
  { type: 'atom', y: '50%', delay: 4, duration: 22, color: '#C4820E', bob: 10 },
  { type: 'rocket', y: '78%', delay: 7, duration: 16, color: '#3A7CA5', bob: -8 },
]

function FlowingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Flowing horizontal lines */}
      {FLOW_LINES.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: line.y,
            background: `linear-gradient(90deg, transparent 0%, ${line.color}15 20%, ${line.color}25 50%, ${line.color}15 80%, transparent 100%)`,
          }}
          initial={{ left: '-40%', width: '40%' }}
          animate={{ left: '100%' }}
          transition={{
            delay: line.delay,
            duration: line.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Small particles along lines */}
      {FLOW_LINES.map((line, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            top: line.y,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            backgroundColor: `${line.color}30`,
          }}
          initial={{ left: '-5%', y: 0 }}
          animate={{
            left: '105%',
            y: [0, i % 2 === 0 ? -15 : 15, 0],
          }}
          transition={{
            left: {
              delay: line.delay + 0.5,
              duration: line.duration * 1.3,
              repeat: Infinity,
              ease: 'linear',
            },
            y: {
              delay: line.delay + 0.5,
              duration: line.duration * 0.65,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
          }}
        />
      ))}

      {/* A few sparse domain icons — very small, very faint */}
      {ACCENT_ICONS.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={{ top: item.y, opacity: 0.12 }}
          initial={{ left: '-6%' }}
          animate={{
            left: '106%',
            y: [0, item.bob, 0],
          }}
          transition={{
            left: {
              delay: item.delay,
              duration: item.duration,
              repeat: Infinity,
              ease: 'linear',
            },
            y: {
              delay: item.delay,
              duration: item.duration * 0.35,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
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
            <motion.svg
              viewBox="0 0 32 32" width="32" height="32" fill="none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="16" cy="16" r="3" fill={item.color} />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" transform="rotate(60 16 16)" />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke={item.color} strokeWidth="0.8" transform="rotate(120 16 16)" />
            </motion.svg>
          )}
        </motion.div>
      ))}

      {/* Central convergence glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 500,
          height: 500,
          background:
            'radial-gradient(circle, rgba(42,157,143,0.05) 0%, rgba(196,130,14,0.03) 30%, rgba(58,124,165,0.02) 60%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'fading' | 'content'>('typing')
  const charIndex = useRef(0)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (phase !== 'typing') return

    const target = Math.min(CHARS_TO_TYPE, REGULATORY_PROSE.length)
    const interval = setInterval(() => {
      if (charIndex.current < target) {
        charIndex.current += 1
        setDisplayedText(REGULATORY_PROSE.slice(0, charIndex.current))
      } else {
        clearInterval(interval)
        setPhase('pause')
      }
    }, 14)

    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'pause') return
    const timeout = setTimeout(() => setPhase('fading'), 1000)
    return () => clearTimeout(timeout)
  }, [phase])

  useEffect(() => {
    if (phase !== 'fading') return
    const timeout = setTimeout(() => setPhase('content'), 700)
    return () => clearTimeout(timeout)
  }, [phase])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 xl:px-32 pb-32 pt-16 relative overflow-hidden bg-white">
      <FlowingBackground />

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        {/* Backed by badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-ink/15 rounded-full mb-8"
        >
          <span className="font-mono text-sm text-ink/70">Backed by</span>
          <a
            href="https://www.joinef.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-medium text-ink hover:text-ink/70 transition-colors"
          >
            Entrepreneurs First
          </a>
        </motion.div>

        {/* Typing → Wordmark transition */}
        <div className="mb-6 h-[80px] md:h-[100px] lg:h-[120px] xl:h-[145px] relative overflow-hidden w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {(phase === 'typing' || phase === 'pause') && (
              <motion.div
                key="prose"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="font-mono text-sm md:text-base leading-relaxed text-ink/60 max-w-2xl text-center">
                  {displayedText}
                  <span className="cursor-blink text-ink/30 ml-px">▌</span>
                </p>
              </motion.div>
            )}
            {phase === 'content' && (
              <motion.div
                key="wordmark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-medium tracking-[-0.04em] text-ink">
                  Invariant AI
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={phase === 'content' ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
          className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-[-0.02em] text-ink mb-8"
        >
          AI-native services for regulated compliance.
        </motion.p>

        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={phase === 'content' ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.55, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 px-4 py-3 font-mono text-base bg-white/80 backdrop-blur-sm border border-ink/15 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink/40 transition-colors text-center sm:text-left"
          />
          <a
            href={`mailto:founders@invariant-ai.com?subject=Early Access Request&body=I'd like to request early access to Invariant AI.`}
            className="px-6 py-3 bg-ink text-white font-mono text-base tracking-wide hover:bg-ink/85 transition-colors text-center whitespace-nowrap"
          >
            Request early access
          </a>
        </motion.div>
      </div>
    </section>
  )
}
