import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../../components/Seo'

const URL = `${SITE_URL}/calculators/faa-part-450-timeline`

type VehicleClass = 'elv-existing' | 'elv-new' | 'rlv-new' | 'suborbital-tourism' | 'reentry'

type Inputs = {
  vehicleClass: VehicleClass
  novelFeatures: number // 0..5+
  acceptedMocCount: number // # of canonical AC-aligned MoCs claimed (0..6)
  environmentalReview: 'none' | 'ea' | 'eis'
  preAppMonthsAlready: number // months already invested in pre-app
}

const DEFAULTS: Inputs = {
  vehicleClass: 'elv-new',
  novelFeatures: 1,
  acceptedMocCount: 3,
  environmentalReview: 'ea',
  preAppMonthsAlready: 6,
}

function estimate(i: Inputs) {
  // ── Pre-application phase ──────────────────────────────────────────────
  // Base by class, in months.
  const preAppBase: Record<VehicleClass, number> = {
    'elv-existing': 4,
    'elv-new': 14,
    'rlv-new': 22,
    'suborbital-tourism': 18,
    reentry: 16,
  }
  // Each novel feature adds 3 months to pre-app; each missing canonical MoC adds 2 months.
  const preAppMonths = Math.max(
    0,
    preAppBase[i.vehicleClass] + i.novelFeatures * 3 + (6 - i.acceptedMocCount) * 2 - i.preAppMonthsAlready,
  )

  // ── Formal review phase ───────────────────────────────────────────────
  // Statutory clock is 180 days. Tolling for RAIs scales with novelty + missing MoCs.
  // Each novel feature drives ~2 RAI cycles. Each cycle adds ~3 weeks.
  const raiCycles = 2 + i.novelFeatures * 1.5 + (6 - i.acceptedMocCount) * 0.5
  const reviewDays = 180 + raiCycles * 21

  // ── Environmental review ──────────────────────────────────────────────
  const envDays = i.environmentalReview === 'eis' ? 365 : i.environmentalReview === 'ea' ? 120 : 0

  // ── Aggregate ─────────────────────────────────────────────────────────
  const totalMonths = preAppMonths + (reviewDays + envDays) / 30
  return {
    preAppMonths: Math.round(preAppMonths),
    reviewDays: Math.round(reviewDays),
    envDays,
    totalMonths: Math.round(totalMonths),
    raiCycles: Math.round(raiCycles * 10) / 10,
  }
}

const CLASS_LABEL: Record<VehicleClass, string> = {
  'elv-existing': 'ELV (existing class, e.g. Falcon 9 / Atlas V conversion)',
  'elv-new': 'ELV (new vehicle, no prior FAA family)',
  'rlv-new': 'RLV (new reusable launch + reentry vehicle)',
  'suborbital-tourism': 'Suborbital tourism / human spaceflight',
  reentry: 'Reentry vehicle (non-RLV, e.g. orbital capsule)',
}

export default function FaaPart450Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const result = useMemo(() => estimate(inputs), [inputs])

  return (
    <>
      <Seo
        title="FAA Part 450 license timeline calculator"
        description="Estimate how long an FAA 14 CFR Part 450 launch or reentry license application will take, based on vehicle class, accepted MoCs, novel features, and environmental review."
        canonical={URL}
        ogImage={`${SITE_URL}/og/faa-part-450-license-timeline.png`}
        ogType="website"
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${URL}#app`,
            name: 'FAA Part 450 license timeline calculator',
            description:
              'Estimate FAA Part 450 launch or reentry license duration from vehicle class, accepted Means of Compliance, novel features, and environmental review.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: URL,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Compliance', url: `${SITE_URL}/compliance` },
            { name: 'FAA Part 450 timeline', url: `${SITE_URL}/faa-part-450-license-timeline` },
            { name: 'Timeline calculator', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
            Calculator · FAA Part 450
          </p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            FAA Part 450 timeline estimator.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 md:text-lg">
            A first-order estimate of how long a Part 450 launch or reentry license application will take from kickoff to license, based on per-operator data and FAA Part 450 Implementation Plan benchmarks. Output is an estimate, not a commitment, and is not a substitute for FAA AST consultation.
          </p>

          <section className="mt-12 rounded-[3px] border border-ink/15 bg-white p-6 md:p-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Inputs</h2>

            <Field label="Vehicle class">
              <select
                value={inputs.vehicleClass}
                onChange={(e) => setInputs({ ...inputs, vehicleClass: e.target.value as VehicleClass })}
                className="mt-2 w-full rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              >
                {Object.entries(CLASS_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Number of novel design features (0 to 5)"
              hint="e.g. autonomous flight safety system, new propellant chemistry, untested abort mode"
            >
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={inputs.novelFeatures}
                onChange={(e) => setInputs({ ...inputs, novelFeatures: Number(e.target.value) })}
                className="mt-2 w-full accent-copper"
              />
              <span className="ml-2 font-mono text-xs text-ink/65">{inputs.novelFeatures}</span>
            </Field>

            <Field
              label="Accepted Means of Compliance you can claim (0 to 6)"
              hint="The five §450.35 areas plus a general MoC are the canonical six. More accepted MoCs = faster review."
            >
              <input
                type="range"
                min={0}
                max={6}
                step={1}
                value={inputs.acceptedMocCount}
                onChange={(e) => setInputs({ ...inputs, acceptedMocCount: Number(e.target.value) })}
                className="mt-2 w-full accent-copper"
              />
              <span className="ml-2 font-mono text-xs text-ink/65">{inputs.acceptedMocCount}</span>
            </Field>

            <Field label="Environmental review type">
              <div className="mt-2 flex gap-3">
                {(['none', 'ea', 'eis'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setInputs({ ...inputs, environmentalReview: v })}
                    className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      inputs.environmentalReview === v
                        ? 'border-copper bg-copper/10 text-copper'
                        : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {v === 'none' ? 'CatEx' : v.toUpperCase()}
                  </button>
                ))}
              </div>
            </Field>

            <Field
              label="Months of pre-application work already done"
              hint="If you have been engaging with FAA AST for some months already, subtract that here."
            >
              <input
                type="number"
                min={0}
                max={48}
                value={inputs.preAppMonthsAlready}
                onChange={(e) => setInputs({ ...inputs, preAppMonthsAlready: Number(e.target.value) })}
                className="mt-2 w-32 rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              />
            </Field>
          </section>

          <section className="mt-8 rounded-[3px] border border-copper/20 bg-copper/5 p-6 md:p-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Estimate</h2>
            <p className="mt-4 font-serif text-5xl font-normal leading-none tracking-[-0.02em] text-ink md:text-6xl">
              ~{result.totalMonths} months
            </p>
            <p className="mt-3 font-sans text-sm text-ink/65">total wall-clock from today to license, assuming the inputs above</p>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              <Stat label="Pre-app left" value={`${result.preAppMonths} mo`} />
              <Stat label="Formal review" value={`${result.reviewDays} days`} hint={`(~${result.raiCycles} RAI cycles)`} />
              <Stat label="Environmental" value={`${result.envDays} days`} />
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl font-normal text-ink md:text-3xl">How the estimator works</h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              The estimator anchors on the statutory 180-day review clock at 51 U.S.C. 50905 and the FAA Part 450 Implementation Plan, then adjusts for the empirical drivers we see in recent dockets. Pre-application duration scales with vehicle novelty: a new ELV class without a prior FAA family runs roughly 14 months of pre-app on average; a new RLV runs longer. Each novel design feature adds about three months to pre-app to allow Means of Compliance acceptance under 14 CFR 450.35. Each canonical accepted MoC you can already point at saves roughly two months.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Formal review begins with the statutory 180 days. Each RAI cycle adds approximately three weeks. Novel features and missing MoCs drive RAI cycles. Environmental review (NEPA) adds 120 days for an Environmental Assessment and roughly 365 days for an Environmental Impact Statement; Categorical Exclusions add nothing.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              The estimator is a first-order tool, not a forecast. Anchors are Astra (about 8 months kickoff to license), Blue Origin New Glenn (114 days post-acceptance), and SpaceX Starship (over 18 months). For a serious schedule, talk to FAA AST.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Background: read the full {' '}
              <Link to="/faa-part-450-license-timeline" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                FAA Part 450 license timeline guide
              </Link>
              {' '} and the {' '}
              <Link to="/how-to-write-faa-part-450-means-of-compliance" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                Means of Compliance drafting guide
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">
        {label}
      </label>
      {hint && <p className="mt-1 font-sans text-xs text-ink/45">{hint}</p>}
      {children}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">{label}</dt>
      <dd className="mt-2 font-serif text-2xl font-normal text-ink">{value}</dd>
      {hint && <p className="mt-1 font-mono text-xs text-ink/45">{hint}</p>}
    </div>
  )
}
