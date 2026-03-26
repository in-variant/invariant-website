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
    description: 'Cost to prepare and submit a full License Application for a new nuclear facility — before a single component is manufactured.',
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
    description: 'Carrying cost of a delayed nuclear project during a licensing hold — interest, labor, fixed overhead.',
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

export default function FactCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionEndRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const containerHeight = containerRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollableDistance = containerHeight - viewportHeight
    const scrolled = -rect.top

    if (scrolled >= 0 && scrolled <= scrollableDistance) {
      const progress = scrolled / scrollableDistance
      const index = Math.min(
        Math.floor(progress * FACTS.length),
        FACTS.length - 1
      )
      setActiveIndex(Math.max(0, index))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const skipToNext = () => {
    sectionEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const jumpToFact = (index: number) => {
    if (!containerRef.current) return
    const containerTop = containerRef.current.offsetTop
    const containerHeight = containerRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollableDistance = containerHeight - viewportHeight
    const targetScroll = containerTop + (index / FACTS.length) * scrollableDistance
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }

  const fact = FACTS[activeIndex]

  return (
    <div
      ref={containerRef}
      style={{ height: `${(FACTS.length + 1) * 60}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex items-center px-6 md:px-12 lg:px-24 xl:px-32">
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="font-mono text-sm md:text-base tracking-[0.3em] uppercase text-ink font-medium mb-4 md:mb-6">
                {fact.domain}
              </p>
              <p
                className="font-serif font-medium tracking-[-0.04em] text-ink leading-[0.9] mb-6 md:mb-8"
                style={{ fontSize: 'clamp(4rem, 15vw, 14rem)' }}
              >
                <CountUpNumber
                  end={fact.countUp.end}
                  suffix={fact.countUp.suffix}
                  prefix={fact.countUp.prefix}
                  resetKey={activeIndex}
                />
              </p>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/60 max-w-lg">
                {fact.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-[-4rem] left-0 flex items-center gap-4">
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
              onClick={skipToNext}
              className="font-mono text-sm text-ink/50 hover:text-ink transition-colors flex items-center gap-1.5 ml-2"
            >
              Skip
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-px">
                <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div ref={sectionEndRef} className="absolute bottom-0" />
    </div>
  )
}
