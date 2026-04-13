import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  render: () => React.ReactNode
}

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center
        px-5 sm:px-10 md:px-16 lg:px-20
        pt-14 pb-20 sm:pt-16 sm:pb-20 md:pt-18 md:pb-20 lg:pt-20 lg:pb-16
        bg-white text-ink"
    >
      <div className="absolute top-4 sm:top-5 left-5 sm:left-10 md:left-16 lg:left-20 z-10">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/30 font-medium">
          Invariant
        </span>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-4xl">
        {children}
      </div>
    </div>
  )
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-8 text-ink/50">
      {children}
    </p>
  )
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 mt-0.5 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

const TIERS = [
  {
    name: 'Starter',
    price: '$99',
    unit: '/month/seat',
    popular: false,
    features: [
      'One workspace',
      'No integrations',
      'IN-SPACe application generation',
      'Regulatory Q&A',
      'Version history',
      'Community support',
      '48-hour response SLA',
    ],
    ownership:
      'Client owns compliance entirely — Invariant provides the tool only.',
    cta: 'Get started',
  },
  {
    name: 'Professional',
    price: '$249',
    unit: '/month/seat',
    popular: true,
    features: [
      'Unlimited workspaces',
      'Two integrations of choice',
      'Full application generation',
      'Revision cycles',
      'Regulatory change alerts',
      'Read-only audit trail',
      'Priority support',
    ],
    ownership:
      'Invariant owns document quality — reviews and signs off every submission package before it reaches you.',
    integrationNote: 'CAD, Ansys, SharePoint, Notion, and more',
    cta: 'Get started',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '/month/seat · min 3 seats',
    popular: false,
    features: [
      'Unlimited workspaces',
      'Unlimited integrations',
      'Azure & AWS GovCloud deployment',
      'Full audit trail with data export',
      'SSO / SAML',
      'Custom data residency',
      'Sub-six-hour SLA',
      'Dedicated compliance success manager',
    ],
    ownership:
      'Invariant owns end-to-end compliance including IN-SPACe liaison, formal correspondence, and submission management.',
    cta: 'Talk to sales',
  },
]

const SPANTRIK_BENEFITS = [
  {
    label: 'Sub-6-hour SLA on Professional',
    description: 'Enterprise-grade response time included with your Professional plan — no upgrade required.',
    standard: '24-hour SLA',
    spantrik: '< 6-hour SLA',
  },
  {
    label: 'Enterprise at $999/month/seat',
    description: 'Fixed, predictable Enterprise pricing as a founding client.',
    standard: 'Custom pricing',
    spantrik: '$999/month/seat',
  },
  {
    label: 'Liaison Add-on at $1,000/month',
    description: 'Full regulatory relationship management at half the standard rate.',
    standard: '$2,000/month',
    spantrik: '$1,000/month',
  },
]

const LIAISON_FEATURES = [
  'IN-SPACe liaison',
  'Formal correspondence management',
  'Query response handling',
  'Representation through to authorization grant',
]

const slides: Slide[] = [
  {
    id: 'title',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/40 mb-6">
            Prepared for Spantrik
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink mb-5 md:mb-8 max-w-4xl leading-[1.1]">
            Invariant for Spantrik
          </h1>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-10 md:mb-14">
            Regulatory compliance infrastructure for India's space tech companies — built with our founding client.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ink/35 tracking-wide hidden sm:flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&larr;</kbd>
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&rarr;</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="font-mono text-xs text-ink/35 tracking-wide sm:hidden">
              Swipe to navigate
            </span>
          </div>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'founding-client',
    render: () => (
      <SlideShell>
        <SlideLabel>Founding Client</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Spantrik As Our First Client.
        </h2>
        <p className="font-mono text-sm sm:text-base text-ink/55 leading-relaxed max-w-3xl mb-10 sm:mb-14">
          We're building Invariant's India space-tech vertical around our
          founding clients. Spantrik gets permanent pricing advantages,
          direct input on the product roadmap, and a compliance partner
          invested in your success from day one.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl">
          {[
            { num: '01', title: 'One month free', desc: 'First week free now through April 17. Sign the contract and get 3 more weeks — a full month on us.' },
            { num: '02', title: 'Founding pricing', desc: 'Locked-in rates that never increase. Enterprise at $999, Liaison at $1,000.' },
            { num: '03', title: 'Product influence', desc: 'Direct line to engineering. Your workflow shapes how we build.' },
            { num: '04', title: 'Priority everything', desc: 'Sub-6-hour SLA on Professional. Dedicated compliance success manager on Enterprise.' },
          ].map((item) => (
            <div key={item.num} className="rounded-lg border border-ink/[0.08] px-5 py-5 bg-ink/[0.015]">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-3">
                {item.num}
              </span>
              <h3 className="font-mono text-sm font-medium text-ink/80 leading-snug mb-2">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-ink/50 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'pricing',
    render: () => (
      <SlideShell>
        <SlideLabel>Pricing · India Space Tech</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 max-w-4xl">
          Three Tiers. Pick Your Level Of Ownership.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-8 sm:mb-10 max-w-3xl">
          From self-serve tooling to fully managed compliance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl w-full">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col border rounded-lg px-5 sm:px-6 py-6 sm:py-7 ${
                tier.popular
                  ? 'border-ink/30 bg-ink/[0.02]'
                  : 'border-ink/10'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-2.5 left-5 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase bg-ink text-white px-2.5 py-0.5 rounded-sm">
                  Most popular
                </span>
              )}
              <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-[-0.02em] text-ink mb-1">
                {tier.name}
              </h3>
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-ink">
                {tier.price}
              </span>
              <p className="font-mono text-[10px] sm:text-xs text-ink/40 mb-5 sm:mb-6">
                {tier.unit}
              </p>

              <ul className="flex flex-col gap-2 mb-5 sm:mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckIcon className="text-ink/30" />
                    <span className="font-mono text-[10px] sm:text-xs text-ink/65 leading-snug">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {'integrationNote' in tier && tier.integrationNote && (
                <p className="font-mono text-[9px] sm:text-[10px] text-ink/35 mb-4 -mt-2">
                  Integrations: {tier.integrationNote}
                </p>
              )}

              <div className="border-t border-ink/10 pt-4">
                <p className="font-mono text-[10px] sm:text-[11px] text-ink/45 leading-relaxed">
                  {tier.ownership}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'spantrik-benefits',
    render: () => (
      <SlideShell>
        <SlideLabel>Spantrik Benefits</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 max-w-4xl">
          Founding Client Advantages.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-8 sm:mb-10 max-w-3xl">
          Permanent pricing and SLA benefits locked in for Spantrik.
        </p>

        <div className="flex flex-col gap-5 max-w-4xl w-full">
          {SPANTRIK_BENEFITS.map((b) => (
            <div
              key={b.label}
              className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-5 sm:py-6"
            >
              <h3 className="font-mono text-sm sm:text-base font-medium text-ink/80 mb-2">
                {b.label}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-ink/50 leading-relaxed mb-5">
                {b.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-ink/30 font-medium">
                    Standard
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-ink/40 line-through">
                    {b.standard}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-ink/50 font-medium">
                    Spantrik
                  </span>
                  <span className="font-mono text-sm sm:text-base font-medium text-ink/80">
                    {b.spantrik}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'liaison',
    render: () => (
      <SlideShell>
        <SlideLabel>Add-on · Available On Any Tier</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 max-w-4xl">
          Liaison Add-on.
        </h2>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-sm sm:text-base text-ink/40 line-through">
            $2,000/month
          </span>
          <span className="font-serif text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-ink">
            $1,000
          </span>
          <span className="font-mono text-sm text-ink/40">/month</span>
        </div>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-8 sm:mb-10 max-w-3xl">
          Invariant takes full ownership of the regulatory relationship.
          Designed for founder-led companies with no in-house regulatory hire.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mb-10 sm:mb-12">
          {LIAISON_FEATURES.map((f) => (
            <div key={f} className="flex items-start gap-3 rounded-lg border border-ink/[0.08] px-5 py-4 bg-ink/[0.015]">
              <CheckIcon className="text-ink/40" />
              <span className="font-mono text-xs sm:text-sm text-ink/65 leading-snug">
                {f}
              </span>
            </div>
          ))}
        </div>

        <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-5 sm:py-6 max-w-3xl">
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">
              Spantrik rate
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">
            This rate is <strong className="text-ink/80 font-medium">locked in permanently</strong> as
            part of the founding client agreement. Standard rate is $2,000/month.
          </p>
        </div>
      </SlideShell>
    ),
  },

  {
    id: 'next-steps',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Next Steps</SlideLabel>
          <h2 className="heading-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 max-w-3xl">
            Let's get started.
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-xl mb-8 sm:mb-10">
            Your first week is already free — start using Invariant today. Sign
            the contract to unlock 3 more weeks, giving you a full month at no cost.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-10 sm:mb-14 max-w-2xl w-full">
            <div className="flex-1 rounded-lg border border-ink/10 bg-ink/[0.015] px-5 py-4 text-center">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/35 font-medium mb-1">Now — April 17</p>
              <p className="font-mono text-sm font-medium text-ink/80">First week free</p>
            </div>
            <svg className="w-5 h-5 text-ink/20 shrink-0 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex-1 rounded-lg border border-ink/10 bg-ink/[0.015] px-5 py-4 text-center">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/35 font-medium mb-1">On contract signing</p>
              <p className="font-mono text-sm font-medium text-ink/80">+3 weeks free</p>
            </div>
            <svg className="w-5 h-5 text-ink/20 shrink-0 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex-1 rounded-lg border border-ink/30 bg-ink/[0.03] px-5 py-4 text-center">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/50 font-medium mb-1">Total</p>
              <p className="font-mono text-sm font-semibold text-ink">1 month free</p>
            </div>
          </div>

          <a
            href="mailto:founders@invariant-ai.com"
            className="font-mono text-sm tracking-[0.1em] uppercase bg-ink text-white px-8 py-3.5 rounded hover:bg-ink/90 transition-colors"
          >
            founders@invariant-ai.com
          </a>
        </div>
      </SlideShell>
    ),
  },
]

export default function SpantrikDeck() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const total = slides.length

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total || next === current) return
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current, total],
  )

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      }
      if (e.key === 'End') {
        e.preventDefault()
        go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next()
        else prev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
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
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-sm border-t border-ink/[0.04]">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-ink/25 font-medium">
          Invariant × Spantrik
        </span>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-ink/60'
                  : 'w-2 bg-ink/12 hover:bg-ink/25'
              }`}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] sm:text-xs tabular-nums text-ink/30">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  )
}
