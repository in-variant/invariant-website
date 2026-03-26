import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REGULATORY_PROSE = `Section 4.2.1 — The applicant shall demonstrate, through deterministic and probabilistic analysis, that the proposed design meets the acceptance criteria of 10 CFR 50.46 for emergency core cooling system performance under all postulated loss-of-coolant accident scenarios, including documentation of all assumptions, boundary conditions, and analytical methods employed...`

const CHARS_TO_TYPE = 220

const REGULATORY_SOURCES = [
  '10 CFR 50.46',
  'DO-178C',
  'DGCA CAR',
  'IMO SOLAS',
  'NRC SRP',
]

const TEAM_OUTPUTS = [
  { label: 'Engineering Teams', color: '#2A9D8F' },
  { label: 'Licensing Consultants', color: '#3A7CA5' },
  { label: 'Program Leadership', color: '#5C6370' },
]

const SOURCE_COLORS = ['#C4820E', '#2A9D8F', '#3A7CA5', '#5C6370', '#8B5CF6']

function ModelStackDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1.2 }}
      className="hidden lg:flex flex-col items-center justify-end select-none"
    >
      <div className="w-full max-w-[380px] flex flex-col items-center">

        {/* Teams working with the model */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          className="w-full mb-5"
        >
          <p className="font-mono text-sm tracking-[0.2em] uppercase text-ink/60 mb-3 text-center">
            Teams
          </p>
          <div className="flex justify-center gap-3">
            {TEAM_OUTPUTS.map((team, i) => (
              <motion.div
                key={team.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.12, duration: 0.4 }}
                className="flex-1 rounded px-3 py-3 text-center border"
                style={{
                  borderColor: `${team.color}45`,
                  backgroundColor: `${team.color}10`,
                }}
              >
                <span
                  className="block text-base mb-1"
                  style={{ color: team.color }}
                >◇</span>
                <span className="font-mono text-xs leading-tight text-ink/75 block">
                  {team.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upward arrows from model to teams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex justify-center gap-8 mb-5"
        >
          {TEAM_OUTPUTS.map((team, i) => (
            <svg key={i} width="14" height="22" viewBox="0 0 14 22" style={{ color: `${team.color}80` }}>
              <line x1="7" y1="20" x2="7" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="2,9 7,2 12,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          ))}
        </motion.div>

        {/* The model — central element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="w-full rounded-md px-5 py-5 mb-5 relative overflow-hidden border"
          style={{ borderColor: '#2A9D8F60', backgroundColor: '#2A9D8F0D' }}
        >
          <div className="relative">
            <p className="font-mono text-sm tracking-[0.2em] uppercase mb-2 font-medium" style={{ color: '#2A9D8F' }}>
              Invariant Model
            </p>
            <p className="font-mono text-sm text-ink/75 leading-relaxed">
              Domain-specific language models trained on engineering regulations
            </p>
            <div className="mt-3 flex gap-2">
              {['Learning', 'Reasoning', 'Authoring'].map((cap, i) => {
                const colors = ['#C4820E', '#3A7CA5', '#2A9D8F']
                return (
                  <span
                    key={cap}
                    className="font-mono text-xs tracking-wide uppercase px-2.5 py-1 rounded-sm font-medium"
                    style={{ backgroundColor: `${colors[i]}20`, color: colors[i] }}
                  >
                    {cap}
                  </span>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Horizontal divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
          className="w-full mb-5 origin-center flex items-center gap-3"
        >
          <div className="flex-1 h-px" style={{ backgroundColor: '#C4820E50' }} />
          <span className="font-mono text-xs tracking-[0.15em] uppercase font-medium" style={{ color: '#C4820E' }}>
            Training
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#C4820E50' }} />
        </motion.div>

        {/* Upward arrows from documents to model */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex justify-center gap-10 mb-5"
        >
          {[0, 1].map((i) => (
            <svg key={i} width="14" height="22" viewBox="0 0 14 22" style={{ color: '#C4820E80' }}>
              <line x1="7" y1="20" x2="7" y2="5" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="2,9 7,2 12,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          ))}
        </motion.div>

        {/* Regulatory documents feeding in */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full"
        >
          <p className="font-mono text-sm tracking-[0.2em] uppercase text-ink/60 mb-3 text-center">
            Regulatory Sources
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {REGULATORY_SOURCES.map((source, i) => (
              <motion.span
                key={source}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                className="font-mono text-sm px-3 py-1.5 rounded font-medium"
                style={{
                  borderWidth: 1,
                  borderColor: `${SOURCE_COLORS[i]}50`,
                  backgroundColor: `${SOURCE_COLORS[i]}12`,
                  color: SOURCE_COLORS[i],
                }}
              >
                {source}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'fading' | 'wordmark'>('typing')
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
    const timeout = setTimeout(() => setPhase('wordmark'), 700)
    return () => clearTimeout(timeout)
  }, [phase])

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 xl:px-32 py-24 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-ink/15 rounded-full mb-6">
            <span className="font-mono text-sm text-ink/70">Backed by</span>
            <a href="https://www.joinef.com" target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-medium text-ink hover:text-ink/70 transition-colors">
              Entrepreneur First
            </a>
          </div>

          <div className="mb-6 h-[80px] md:h-[100px] lg:h-[120px] xl:h-[145px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {(phase === 'typing' || phase === 'pause') && (
                <motion.div
                  key="prose"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <p className="font-mono text-sm md:text-base leading-relaxed text-ink/60 max-w-3xl">
                    {displayedText}
                    <span className="cursor-blink text-ink/30 ml-px">▌</span>
                  </p>
                </motion.div>
              )}
              {phase === 'wordmark' && (
                <motion.div
                  key="wordmark"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-start"
                >
                  <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-medium tracking-[-0.04em] text-ink">
                    Invariant
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-[-0.02em] text-ink mb-8">
              From first design<br />to final approval.
            </p>

            <p className="body-technical max-w-xl mb-12">
              Invariant builds language models trained on engineering regulations — AI that works alongside your team from early R&amp;D through certification.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-4 py-3 font-mono text-base bg-transparent border border-ink/15 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink/40 transition-colors"
              />
              <a
                href={`mailto:hello@invariant.ai?subject=Early Access Request&body=I'd like to request early access to Invariant.`}
                className="px-6 py-3 bg-ink text-white font-mono text-base tracking-wide hover:bg-ink/85 transition-colors text-center whitespace-nowrap"
              >
                Request early access
              </a>
            </div>
          </motion.div>
        </div>

        <ModelStackDiagram />
      </div>
    </section>
  )
}
