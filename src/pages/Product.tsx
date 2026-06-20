import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * /product — platform page.
 *
 * No hero. Page opens straight on the document editor screenshot with the
 * h1 above it. No "• MICROHEADER" labels — just headlines and body. Final
 * CTA at the bottom is the only call to action.
 */

const CAPABILITIES = [
  {
    n: '01',
    title: 'Drafting agents',
    body: 'PSAR, RAI responses, Means of Compliance, and test plans drafted to spec. Every section pulled from your corpus, every citation live.',
  },
  {
    n: '02',
    title: 'Citation traceability',
    body: 'Every claim mapped to the rule that supports it. No invented citations. No hallucinated authorities. Auditable to the line.',
  },
  {
    n: '03',
    title: 'Live regulation monitoring',
    body: 'Federal Register, NRC ADAMS, FAA dockets, and FCC orders watched per filing. Changes flagged the day they post.',
  },
  {
    n: '04',
    title: 'Engineer-led ship',
    body: 'A forward-deployed engineer reviews every output. Submission packaging, regulator correspondence, and the actual file all owned by us.',
  },
]

const SOURCE_GROUPS = [
  {
    label: 'Customer artefacts',
    items: ['Design basis', 'Topical reports', 'Prior filings', 'Vendor docs', 'and more'],
  },
  {
    label: 'Nuclear corpus',
    items: ['10 CFR Part 50', '10 CFR Part 52', 'ASME III codes', 'NRC NUREG-0800', 'NRC Regulatory Guides', 'and more'],
  },
  {
    label: 'Space corpus',
    items: ['14 CFR Part 450', '47 CFR Part 25', 'IN-SPACe guidelines', 'ECSS standards', 'and more'],
  },
  {
    label: 'Live feeds',
    items: ['Federal Register', 'NRC ADAMS', 'FAA dockets', 'FCC filings', 'and more'],
  },
]

// ── Document editor (page opener) ──────────────────────────────────────
function DocumentEditorSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="bg-paper px-6 pb-20 pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl lg:text-[4.5rem]"
          >
            Drafting, citing, and reviewing in one place.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink/65"
          >
            Your project corpus on the left, the document being drafted in the middle, and a live
            agent on the right. Every paragraph generated against the rules in your corpus, not the
            open web.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 overflow-hidden rounded-2xl border border-ink/10 bg-cloud/[0.3] p-2 shadow-2xl"
        >
          <img
            src="/platform/document-editor.jpg"
            alt="The Invariant document editor. PSAR section being drafted with an agent on the right."
            className="block w-full rounded-lg"
            loading="lazy"
            width="2000"
            height="1044"
          />
        </motion.div>
      </div>
    </section>
  )
}

// ── Capabilities (dark) ─────────────────────────────────────────────────
function CapabilitiesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  return (
    <section ref={ref} className="bg-ink px-6 py-20 text-cloud md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-cloud md:text-5xl lg:text-[3.5rem]"
        >
          Agents that do the work. Engineers that ship it.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 border-t border-cloud/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col border-b border-cloud/10 px-6 py-10 lg:px-8 lg:py-12 lg:border-b-0 ${
                  i < CAPABILITIES.length - 1 ? 'lg:border-r lg:border-cloud/10' : ''
                } ${
                  i % 2 === 1 ? 'sm:border-l sm:border-cloud/10 lg:border-l-0' : ''
                }`}
              >
                <span className="font-display text-5xl font-normal tracking-[-0.02em] text-copper">
                  {c.n}
                </span>
                <h3 className="mt-8 font-display text-2xl font-normal tracking-tight text-cloud">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-cloud/60">
                  {c.body}
                </p>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Sources + regulations screenshot ───────────────────────────────────
function SourcesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="bg-paper px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl lg:text-[3.5rem]"
          >
            Built on every source that matters.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink/65"
          >
            Your project documents, the regulations that apply, and the live feeds that flag changes
            as they post. Everything indexed, everything cited.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 overflow-hidden rounded-2xl border border-ink/10 bg-cloud/[0.3] p-2 shadow-2xl"
        >
          <img
            src="/platform/regulations.jpg"
            alt="The Invariant regulation library. Nested tree of nuclear and space regulations."
            className="block w-full rounded-lg"
            loading="lazy"
          />
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {SOURCE_GROUPS.map((g, i) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-sans text-sm font-medium text-ink">{g.label}</p>
              <ul className="mt-4 space-y-2 font-sans text-sm text-ink/65">
                {g.items.map((it) => (
                  <li key={it} className={it === 'and more' ? 'text-ink/40' : ''}>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ──────────────────────────────────────────────────────────
function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="bg-ink px-6 py-24 text-cloud md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-cloud md:text-5xl lg:text-[3.5rem]"
        >
          Want to see your filing on Invariant?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-lg font-sans text-base leading-relaxed text-cloud/65"
        >
          We'll walk through your corpus, your regulators, and your timeline. No deck. Just the work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="mailto:founders@invariant-ai.com?subject=Invariant%20conversation"
            className="inline-flex h-11 items-center justify-center rounded-full bg-cloud px-6 font-sans text-[15px] font-medium text-ink transition-colors hover:bg-mineral"
          >
            Talk to an expert
          </a>
          <a
            href="/probe"
            className="inline-flex h-11 items-center justify-center rounded-full border border-cloud/30 bg-cloud/10 px-6 font-sans text-[15px] font-medium text-cloud transition-colors hover:bg-cloud hover:text-ink"
          >
            Try Probe
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function Product() {
  return (
    <>
      <DocumentEditorSection />
      <CapabilitiesSection />
      <SourcesSection />
      <FinalCTA />
    </>
  )
}
