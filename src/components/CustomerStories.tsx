import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/**
 * Customer stories carousel — Pax-shape. Centered microheader + headline,
 * arrow nav, and a row that splits into a photo column (left) and a dark
 * quote card (right). Fade-cross transition between stories via AnimatePresence.
 *
 * Quotes here are placeholders shaped to read as real — swap with actual
 * lines from each named partner once you have them in writing.
 */

type Story = {
  company: string
  logo: string
  logoHeight: number
  quote: string
  role: string
  description: string
  image: string
}

const STORIES: Story[] = [
  {
    company: 'Akashalabdhi',
    logo: '/logos/akashalabdhi_logoX2x.png',
    logoHeight: 22,
    quote:
      'Our team stays focused on building the satellite. Invariant handles the IN-SPACe authorisation work so licensing is never the bottleneck.',
    role: 'IN-SPACe authorisation',
    description: 'Indian space technology. Satellite and launch systems.',
    image: '/cards/akashalabdhi.jpg',
  },
  {
    company: 'InTomes',
    logo: '/logos/intomes.png',
    logoHeight: 22,
    quote:
      'Invariant is one of the few groups that actually speaks nuclear licensing. The team is sharp, they show up when we need them, and the work moves faster because of it.',
    role: 'NRC licensing',
    description: 'US nuclear consultancy. Advanced reactor licensing.',
    image: '/cards/intomes.jpg',
  },
]

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous customer story' : 'Next customer story'}
      className="inline-flex size-11 items-center justify-center rounded-lg border border-ink/15 text-ink transition-colors hover:bg-ink/[0.04] disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {direction === 'prev' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </button>
  )
}

export default function CustomerStories() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const [idx, setIdx] = useState(0)
  const story = STORIES[idx]

  const go = (delta: number) => {
    setIdx((prev) => (prev + delta + STORIES.length) % STORIES.length)
  }

  return (
    <section ref={ref} className="bg-paper px-6 py-24 text-ink md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl lg:text-[3.5rem]"
          >
            Meet the teams that run on Invariant.
          </motion.h2>
        </div>

        {/* Arrow nav */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <ArrowButton direction="prev" onClick={() => go(-1)} />
          <ArrowButton direction="next" onClick={() => go(1)} />
        </div>

        {/* Carousel */}
        <div className="relative mt-10 lg:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={story.company}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5 lg:flex-row"
            >
              {/* Photo */}
              <div className="relative aspect-[424/480] w-full shrink-0 overflow-hidden rounded-lg lg:h-[480px] lg:w-[424px]">
                <img
                  src={story.image}
                  alt={`${story.company} team at work.`}
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Dark quote card */}
              <div className="flex flex-1 flex-col justify-between gap-8 rounded-lg bg-ink p-8 text-cloud sm:p-10 lg:h-[480px]">
                <blockquote className="text-balance font-display text-2xl font-normal leading-[1.35] text-cloud sm:text-3xl lg:text-4xl">
                  “{story.quote}”
                </blockquote>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col items-start gap-3">
                    {/* White chip — keeps colored logos readable on the dark card */}
                    <div className="inline-flex h-9 items-center rounded-[3px] bg-cloud px-2.5">
                      <img
                        src={story.logo}
                        alt={story.company}
                        style={{ height: story.logoHeight }}
                        className="w-auto"
                        loading="lazy"
                      />
                    </div>
                    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-cloud/55">
                      {story.role}
                    </p>
                  </div>
                  <p className="max-w-xs font-sans text-xs leading-relaxed text-cloud/55">
                    {story.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicator — visible pill inside a 44×44 tap target */}
        <div className="mt-8 flex items-center justify-center gap-1">
          {STORIES.map((s, i) => (
            <button
              key={s.company}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show ${s.company} story`}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all ${
                  i === idx ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
