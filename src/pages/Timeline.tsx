import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Seo, SITE_URL, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema } from '../components/Seo'
import GanttChart from '../components/timeline/GanttChart'
import FilingDossier from '../components/timeline/FilingDossier'
import ComparisonSection from '../components/timeline/ComparisonSection'
import PlatformBridge from '../components/timeline/PlatformBridge'
import { buildPlan } from '../lib/timeline/engine'
import { SPECIALIST_TRACKS } from '../data/timeline/filings'
import { runResearch } from '../lib/timeline/research'
import type { MissionProfile, PlanItem, ResearchResult } from '../lib/timeline/types'
import posthog from '../posthog'

const EASE = [0.22, 1, 0.36, 1] as const

type Stage = 'intro' | 'research' | 'confirm' | 'plan'

/** The only fields a question chip is allowed to write. Mirrors the API schema. */
const ANSWERABLE_FIELDS = new Set([
  'launch.monthsFromNow',
  'launch.site',
  'remoteSensing',
  'commsService',
  'orbit',
  'spacecraftCount',
  'massKg',
  'altitudeKm',
  'propulsion',
  'foreignPartners',
  'foreignNationalStaff',
  'usNexus',
  'indiaNexus',
  'operatorKind',
  'humanSpaceflight',
  'nuclear',
  'novelActivity',
])

/** Write a chip answer onto the profile via its allowlisted dot-path field. */
function applyAnswer(profile: MissionProfile, field: string, value: unknown): MissionProfile {
  if (!ANSWERABLE_FIELDS.has(field)) return profile
  const next: MissionProfile = JSON.parse(JSON.stringify(profile))
  const parts = field.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let target: any = next
  for (const part of parts.slice(0, -1)) target = target[part]
  target[parts[parts.length - 1]] = value
  // A changed launch window invalidates the researched calendar target;
  // recompute it so the axis and the legend stay consistent.
  if (field === 'launch.monthsFromNow') {
    const months = next.launch.monthsFromNow
    if (months === null) {
      next.launch.target = null
    } else {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() + months)
      next.launch.target = `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`
    }
  }
  return next
}

export default function Timeline() {
  const [stage, setStage] = useState<Stage>('intro')
  const [url, setUrl] = useState('')
  const [statusLines, setStatusLines] = useState<{ id: number; text: string }[]>([])
  const [demoNote, setDemoNote] = useState<string | null>(null)
  const [hardError, setHardError] = useState<string | null>(null)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'chart' | 'checklist'>('chart')
  const running = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const statusId = useRef(0)

  const profile = useMemo(() => {
    if (!result) return null
    let p = result.profile
    for (const q of result.questions) {
      if (q.id in answers) p = applyAnswer(p, q.field, answers[q.id])
    }
    return p
  }, [result, answers])

  const plan = useMemo(() => (profile ? buildPlan(profile) : null), [profile])

  const selectedItem: PlanItem | null =
    plan?.items.find((i) => i.filing.id === selectedId) ?? null

  const start = useCallback(
    async (demo = false) => {
      const trimmed = url.trim()
      if (!demo && !trimmed) return
      if (running.current) return
      running.current = true
      posthog.capture('mission_research_started', {
        source: demo ? 'worked_example' : 'website',
      })
      const controller = new AbortController()
      abortRef.current = controller
      setStage('research')
      setStatusLines([])
      setDemoNote(null)
      setHardError(null)
      await runResearch(
        trimmed || 'demo',
        {
          onStatus: (text) =>
            setStatusLines((prev) => [...prev.slice(-7), { id: statusId.current++, text }]),
          onResult: (r) => {
            posthog.capture('mission_research_completed', {
              source: demo ? 'worked_example' : 'website',
              question_count: r.questions.length,
            })
            setResult(r)
            setAnswers({})
            setStage('confirm')
          },
          onError: (message, hard) => {
            if (hard) {
              setHardError(message)
              setStage('intro')
            } else {
              setDemoNote(message)
            }
          },
        },
        demo,
        controller.signal
      )
      running.current = false
    },
    [url]
  )

  const cancelResearch = () => {
    abortRef.current?.abort()
    running.current = false
    setStage('intro')
    setStatusLines([])
  }

  const reset = () => {
    abortRef.current?.abort()
    running.current = false
    setStage('intro')
    setResult(null)
    setAnswers({})
    setSelectedId(null)
    setStatusLines([])
    setDemoNote(null)
    setHardError(null)
    setView('chart')
  }

  const jsonLd = [
    ORG_SCHEMA,
    EDITORIAL_TEAM,
    {
      '@type': 'WebApplication',
      name: 'Mission timeline: the space regulatory roadmap generator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Mission timeline', url: `${SITE_URL}/timeline` },
    ]),
  ]

  const seo = (
    <Seo
      title="Mission timeline. Every filing between you and launch"
      description="Enter your company website. An agent reads the public record and derives your full US and India regulatory filing plan: FCC, NOAA, ITAR and EAR, FAA, IN-SPACe, with the real clocks, fees, and failure modes for each."
      canonical={`${SITE_URL}/timeline`}
      ogType="website"
      jsonLd={jsonLd}
    />
  )

  /* ---------------- Plan: full-bleed flagship layout -------------------- */
  if (stage === 'plan' && plan && profile) {
    const filingNames = plan.items
      .filter((i) => !i.filing.recurring)
      .sort((a, b) => b.startT - a.startT)
      .map((i) => i.filing.name)
    const recurring = plan.items.filter((i) => i.filing.recurring)
    const specialist = SPECIALIST_TRACKS.filter((s) => plan.notes.includes(s.id))

    return (
      <>
        {seo}
        <section className="bg-paper px-6 pb-16 pt-16 md:px-12 md:pb-20 md:pt-24 lg:px-20">
          <div className="mx-auto max-w-5xl">
            {demoNote && <Note>{demoNote}</Note>}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
                Regulatory timeline · {profile.company.name}
              </div>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl font-normal leading-[1.05] tracking-[-0.025em] text-ink md:text-5xl">
                {plan.stats.filingCount} filings stand between this mission and launch.
              </h1>
              <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-ink/65">
                Derived from the regulations in force, not generated.
              </p>
            </motion.div>

            {/* Stats strip, editorial */}
            <div className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-y border-ink/10 py-5">
              <Stat label="Filings before launch" value={String(plan.stats.filingCount)} />
              <Stat label="Start by" value={`T-${plan.stats.startByMonths}`} />
              <Stat label="Longest pole" value={plan.stats.longestPole} />
              <Stat label="Government fees" value={plan.stats.feeSummary} />
            </div>

            {/* View toggle */}
            <div className="mt-10 flex items-center justify-between">
              <div className="flex gap-2">
                {(['chart', 'checklist'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className={`rounded-full border px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      view === v
                        ? 'border-copper bg-copper/10 text-copper'
                        : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {v === 'chart' ? 'Timeline' : 'Checklist'}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStage('confirm')}
                className="font-sans text-[13px] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-copper"
              >
                Edit answers
              </button>
            </div>

            <div className="mt-4">
              {view === 'chart' ? (
                <>
                  <GanttChart
                    plan={plan}
                    monthsToLaunch={profile.launch.monthsFromNow}
                    launchLabel={profile.launch.target}
                    selectedId={selectedId}
                    onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
                  />
                  <p className="mt-3 text-center font-sans text-[11.5px] text-ink/40">
                    {selectedItem
                      ? 'Built from the CFR and the Federal Register, current to mid 2026. Not legal advice.'
                      : 'Select a filing for its dossier: the clock, the fees, the failure modes.'}
                  </p>
                  <FilingDossier item={selectedItem} />
                </>
              ) : (
                <Checklist plan={plan} onSelect={(id) => { setView('chart'); setSelectedId(id) }} />
              )}
            </div>

            {/* What the research flagged */}
            {result && result.notes.length > 0 && (
              <div className="mt-12 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
                  What the research flagged
                </div>
                <ol className="mt-4 space-y-4">
                  {result.notes.map((n, i) => (
                    <li key={n} className="flex gap-4">
                      <span className="font-serif text-lg leading-6 text-copper">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-[14px] leading-relaxed text-ink/70">{n}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Specialist overlays, full width */}
            {specialist.map((s) => (
              <div
                key={s.id}
                className="mt-6 rounded-[3px] border border-ink/10 border-l-2 border-l-copper bg-white p-6 md:p-8"
              >
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
                  Specialist track
                </div>
                <div className="mt-2 grid gap-3 md:grid-cols-[220px_1fr] md:gap-8">
                  <h3 className="font-serif text-2xl leading-tight text-ink">{s.title}.</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-ink/65">{s.body}</p>
                </div>
              </div>
            ))}

            {/* After grant */}
            {recurring.length > 0 && (
              <div className="mt-12">
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
                  And it does not end at grant
                </div>
                <div className="mt-4 divide-y divide-ink/[0.08] rounded-[3px] border border-ink/10 bg-white">
                  {recurring.map((i) => (
                    <button
                      key={i.filing.id}
                      type="button"
                      onClick={() => { setView('chart'); setSelectedId(i.filing.id) }}
                      className="flex w-full flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 text-left transition-colors hover:bg-ink/[0.02]"
                    >
                      <span className="font-sans text-[14px] font-medium text-ink">
                        {i.filing.name}
                      </span>
                      <span className="font-sans text-[13px] text-ink/50">
                        {i.filing.clock.statutory}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        <ComparisonSection />
        <PlatformBridge companyName={profile.company.name} filingNames={filingNames} />

        <div className="bg-paper pb-20 text-center">
          <button
            type="button"
            onClick={reset}
            className="font-sans text-[13px] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-copper"
          >
            Map another mission
          </button>
        </div>
      </>
    )
  }

  /* ---------------- Intro, research, confirm ---------------------------- */
  return (
    <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
      {seo}

      {(stage === 'intro' || stage === 'research') && (
        <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col justify-center">
          <motion.div layout transition={{ duration: 0.5, ease: EASE }}>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: EASE }}
              className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper"
            >
              Interactive · Mission timeline
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
              className="mt-4 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl"
            >
              Every filing between you and launch.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.18, ease: EASE }}
              className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ink/65"
            >
              Enter your website. An agent reads the public record, asks only what it cannot know,
              and derives your regulatory roadmap from the regulations themselves: FCC, NOAA, ITAR
              and EAR, FAA, IN-SPACe. With the real clocks, not the statutory fiction. No signup.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
              className="mt-8 flex max-w-xl gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                start(false)
              }}
            >
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="yourcompany.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={stage === 'research'}
                className="h-11 w-full rounded-full border border-ink/15 bg-white px-5 font-sans text-[15px] text-ink placeholder:text-ink/35 focus:border-copper focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={stage === 'research' || !url.trim()}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-ink px-6 font-sans text-[15px] font-medium text-cloud transition-colors hover:bg-copper disabled:cursor-not-allowed disabled:opacity-50"
              >
                {stage === 'research' ? 'Researching ...' : 'Map my mission'}
              </button>
            </motion.form>

            {stage === 'intro' && hardError && (
              <div className="mt-4 max-w-xl rounded-[3px] border border-copper/30 bg-copper/10 px-4 py-3 font-sans text-[13px] text-ink/70">
                {hardError}
              </div>
            )}
            {stage === 'intro' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                type="button"
                onClick={() => start(true)}
                className="mt-4 font-sans text-[13px] text-ink/45 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-copper"
              >
                Or see a worked example first
              </motion.button>
            )}
            {stage === 'research' && (
              <button
                type="button"
                onClick={cancelResearch}
                className="mt-4 font-sans text-[13px] text-ink/45 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-copper"
              >
                Cancel
              </button>
            )}

            <AnimatePresence>
              {stage === 'research' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-10 rounded-[3px] border border-ink/10 bg-white p-5"
                  aria-live="polite"
                >
                  {statusLines.map((line, i) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: i === statusLines.length - 1 ? 1 : 0.45 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 py-1 font-sans text-[13.5px] text-ink/80"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          i === statusLines.length - 1 ? 'animate-pulse bg-copper' : 'bg-ink/25'
                        }`}
                      />
                      {line.text}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {stage === 'confirm' && result && (
        <div className="mx-auto max-w-3xl pt-6">
          {demoNote && <Note>{demoNote}</Note>}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
              What we found
            </div>
            <h1 className="mt-3 font-serif text-3xl font-normal leading-[1.06] tracking-[-0.02em] text-ink md:text-4xl">
              {result.profile.company.name}.
            </h1>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink/65">
              {result.profile.company.summary}
            </p>
          </motion.div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {result.findings.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: EASE }}
                className="rounded-[3px] border border-ink/10 bg-white p-4"
              >
                <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      f.confidence === 'confirmed' ? 'bg-copper' : 'border border-copper bg-transparent'
                    }`}
                    title={f.confidence}
                  />
                  {f.label}
                  <span className="ml-auto normal-case tracking-normal text-ink/30">
                    {f.confidence === 'confirmed' ? 'confirmed' : 'inferred'}
                  </span>
                </div>
                <div className="mt-1.5 font-sans text-[14px] leading-snug text-ink/80">{f.value}</div>
              </motion.div>
            ))}
          </div>

          {result.questions.length > 0 && (
            <div className="mt-12">
              <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
                What only you know
              </div>
              <div className="mt-4 space-y-8">
                {result.questions.map((q) => (
                  <div key={q.id}>
                    <div className="font-sans text-[15px] font-medium text-ink">{q.question}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.value
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))
                            }
                            className={`rounded-full border px-4 py-1.5 font-sans text-[13px] transition-colors ${
                              active
                                ? 'border-copper bg-copper/10 text-copper'
                                : 'border-ink/15 text-ink/65 hover:border-ink/30'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-2 font-sans text-[12px] leading-relaxed text-ink/45">{q.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                posthog.capture('mission_timeline_built', {
                  question_count: result.questions.length,
                  answered_question_count: Object.keys(answers).length,
                })
                setStage('plan')
              }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 font-sans text-[15px] font-medium text-cloud transition-colors hover:bg-copper"
            >
              Build the timeline
            </button>
            <button
              type="button"
              onClick={reset}
              className="font-sans text-[13px] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-copper"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-[3px] border border-copper/30 bg-copper/10 px-4 py-3 font-sans text-[13px] text-ink/70">
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-sans text-[10.5px] uppercase tracking-[0.12em] text-ink/40">{label}</div>
      <div className="mt-1 max-w-[280px] font-serif text-xl leading-snug text-ink md:text-[22px]">
        {value}
      </div>
    </div>
  )
}

function Checklist({
  plan,
  onSelect,
}: {
  plan: ReturnType<typeof buildPlan>
  onSelect: (id: string) => void
}) {
  const rows = plan.items
    .filter((i) => !i.filing.recurring)
    .sort((a, b) => b.startT - a.startT)
  return (
    <div className="overflow-x-auto rounded-[3px] border border-ink/15 bg-white">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink/10">
            <Th>Start</Th>
            <Th>Filing</Th>
            <Th>Agency</Th>
            <Th>The clock, honestly</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr
              key={i.filing.id}
              onClick={() => onSelect(i.filing.id)}
              className="cursor-pointer border-b border-ink/[0.06] transition-colors last:border-0 hover:bg-ink/[0.03]"
            >
              <td className="whitespace-nowrap px-4 py-3 font-sans text-[13px] tabular-nums text-ink/70">
                T-{i.startT} mo
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(i.filing.id)
                  }}
                  className="text-left font-sans text-[13.5px] text-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-copper focus-visible:decoration-copper"
                >
                  {i.filing.name}
                </button>
                {i.critical && (
                  <span className="ml-2 rounded-full border border-copper/40 bg-copper/10 px-1.5 py-px font-sans text-[9px] uppercase tracking-[0.1em] text-copper">
                    Critical
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-sans text-[12px] text-ink/55">
                {i.filing.agency}
              </td>
              <td className="px-4 py-3 font-sans text-[12.5px] leading-relaxed text-ink/60">
                {i.filing.clock.statutory}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
      {children}
    </th>
  )
}
