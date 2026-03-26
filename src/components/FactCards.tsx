import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FactCard {
  domain: string
  figure: string
  description: string
  countUp: { end: number; suffix: string; prefix: string }
}

const FACTS: FactCard[] = [
  {
    domain: 'NUCLEAR',
    figure: '$1.1B',
    description: 'Cost overrun on Vogtle Units 3 & 4. Licensing delays and documentation rework were primary drivers.',
    countUp: { end: 1.1, suffix: 'B', prefix: '$' },
  },
  {
    domain: 'AEROSPACE',
    figure: '$20B+',
    description: 'Program cost overrun on the Boeing 737 MAX return-to-service, driven by re-authoring airworthiness documentation for the FAA.',
    countUp: { end: 20, suffix: 'B+', prefix: '$' },
  },
  {
    domain: 'NUCLEAR',
    figure: '7 years',
    description: 'Time consumed by the NRC\'s first advanced reactor design certification review. Most of it spent resolving documentation gaps.',
    countUp: { end: 7, suffix: ' years', prefix: '' },
  },
  {
    domain: 'AEROSPACE',
    figure: '18 months',
    description: 'Average delay when a single safety case chapter fails first regulatory review under DO-178C or DO-254.',
    countUp: { end: 18, suffix: ' months', prefix: '' },
  },
  {
    domain: 'DRONES',
    figure: '₹340 Cr',
    description: 'Cost of certification delays faced by Indian drone manufacturers under evolving DGCA type certification requirements.',
    countUp: { end: 340, suffix: ' Cr', prefix: '₹' },
  },
  {
    domain: 'NUCLEAR',
    figure: '$200M+',
    description: 'Cost to prepare and submit a full License Application for a new nuclear facility, before a single component is manufactured.',
    countUp: { end: 200, suffix: 'M+', prefix: '$' },
  },
  {
    domain: 'PHARMA',
    figure: '5+ years',
    description: 'Typical timeline for a new pharmaceutical manufacturing facility to navigate FDA process validation and cGMP compliance filings.',
    countUp: { end: 5, suffix: '+ years', prefix: '' },
  },
  {
    domain: 'NUCLEAR',
    figure: '3,000+ pages',
    description: 'Length of a standard Preliminary Safety Analysis Report. Every claim must be traceable to an acceptance criterion. Every page is written by hand.',
    countUp: { end: 3000, suffix: '+ pages', prefix: '' },
  },
  {
    domain: 'NUCLEAR',
    figure: '$50M/year',
    description: 'Carrying cost of a delayed nuclear project during a licensing hold: interest, labor, fixed overhead.',
    countUp: { end: 50, suffix: 'M/year', prefix: '$' },
  },
  {
    domain: 'ENERGY',
    figure: '24 months',
    description: 'Time added to offshore energy projects when safety case documentation fails first-pass review by maritime regulators.',
    countUp: { end: 24, suffix: ' months', prefix: '' },
  },
]

function CountUpNumber({ end, suffix, prefix, resetKey }: { end: number; suffix: string; prefix: string; resetKey: number }) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    setCurrent(0)
    const duration = 1000
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCurrent(eased * end)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [end, resetKey])

  const isDecimal = end % 1 !== 0
  const formatted = isDecimal
    ? current.toFixed(1)
    : end >= 1000
      ? Math.round(current).toLocaleString()
      : Math.round(current).toString()

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  )
}

const AUTO_ADVANCE_MS = 5000
const PAUSE_AFTER_INTERACTION_MS = 8000

export default function FactCards() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isUserScrolling = useRef(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pausedUntil = useRef(0)

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const cardWidth = el.scrollWidth / FACTS.length
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.max(0, Math.min(index, FACTS.length - 1)))
  }, [])

  const handleScroll = useCallback(() => {
    isUserScrolling.current = true
    pausedUntil.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
    clearTimeout(scrollTimeout.current)
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false
    }, 150)
    updateActiveFromScroll()
  }, [updateActiveFromScroll])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / FACTS.length
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
    setActiveIndex(index)
  }, [])

  const jumpToFact = (index: number) => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
    scrollToIndex(index)
  }

  const goNext = () => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
    scrollToIndex((activeIndex + 1) % FACTS.length)
  }

  const goPrev = () => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_INTERACTION_MS
    scrollToIndex((activeIndex - 1 + FACTS.length) % FACTS.length)
  }

  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() < pausedUntil.current) return
      if (isUserScrolling.current) return

      const next = (activeIndexRef.current + 1) % FACTS.length
      scrollToIndex(next)
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(interval)
  }, [scrollToIndex])

  return (
    <div className="relative">
      {/* Scrollable card strip */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FACTS.map((f, i) => (
          <div
            key={i}
            className="snap-center flex-shrink-0 w-full px-6 md:px-12 lg:px-24 xl:px-32"
          >
            <div className="py-16 md:py-24">
              <AnimatePresence mode="wait">
                {activeIndex === i && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <p className="font-mono text-sm md:text-base tracking-[0.3em] uppercase text-ink font-medium mb-4 md:mb-6">
                      {f.domain}
                    </p>
                    <p
                      className="font-serif font-medium tracking-[-0.04em] text-ink leading-[0.9] mb-6 md:mb-8"
                      style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
                    >
                      <CountUpNumber
                        end={f.countUp.end}
                        suffix={f.countUp.suffix}
                        prefix={f.countUp.prefix}
                        resetKey={i}
                      />
                    </p>
                    <p className="font-mono text-sm md:text-base leading-relaxed text-ink/60 max-w-lg">
                      {f.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-32 pb-8 flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="font-mono text-sm text-ink/50 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous fact"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {FACTS.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToFact(i)}
              className={`w-6 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex ? 'bg-ink' : 'bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>

        <span className="font-mono text-xs text-ink/40 tabular-nums">
          {activeIndex + 1}/{FACTS.length}
        </span>

        <button
          onClick={goNext}
          disabled={activeIndex === FACTS.length - 1}
          className="font-mono text-sm text-ink/50 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Next fact"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
