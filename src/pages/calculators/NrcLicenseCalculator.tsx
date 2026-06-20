import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../../components/Seo'

const URL = `${SITE_URL}/calculators/nrc-license-timeline`

type Pathway = 'part-50-cp' | 'part-52-col' | 'part-53'

type Inputs = {
  pathway: Pathway
  preAppMonths: number // months of formal pre-application engagement already
  topicalReportsApproved: number // 0..10
  ticapAligned: boolean
  noveltyLevel: number // 0..5 (0 = LWR familiar; 5 = first-of-kind non-LWR)
  hasEsp: boolean
}

const DEFAULTS: Inputs = {
  pathway: 'part-50-cp',
  preAppMonths: 24,
  topicalReportsApproved: 2,
  ticapAligned: true,
  noveltyLevel: 3,
  hasEsp: false,
}

function estimate(i: Inputs) {
  // Formal review base by pathway, in months.
  const base: Record<Pathway, number> = {
    'part-50-cp': 22,
    'part-52-col': 46,
    'part-53': 18,
  }
  let months = base[i.pathway]

  // Novelty drives extension. LWR-familiar designs review faster.
  months += i.noveltyLevel * 2

  // Each approved topical report saves ~1.5 months of review.
  months -= i.topicalReportsApproved * 1.5

  // TICAP alignment shaves ~3 months because the staff workflow is familiar.
  if (i.ticapAligned) months -= 3

  // An existing ESP shaves significant time on Part 52 reviews.
  if (i.hasEsp && i.pathway === 'part-52-col') months -= 6

  // Floor: not less than 12 months for any docketed pathway.
  months = Math.max(12, Math.round(months))

  // Pre-app remaining heuristic: typical engagement should be at least
  // 36 months before Part 50 CP, 18 months for Part 53. Subtract done.
  const preAppExpected: Record<Pathway, number> = {
    'part-50-cp': 36,
    'part-52-col': 24,
    'part-53': 18,
  }
  const preAppRemaining = Math.max(0, preAppExpected[i.pathway] - i.preAppMonths)

  return {
    formalReviewMonths: months,
    preAppRemaining,
    totalMonths: months + preAppRemaining,
  }
}

const PATHWAY_LABEL: Record<Pathway, string> = {
  'part-50-cp': '10 CFR Part 50, Construction Permit (then OL separately)',
  'part-52-col': '10 CFR Part 52, Combined Licence',
  'part-53': '10 CFR Part 53, risk-informed (effective April 29, 2026)',
}

export default function NrcLicenseCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const result = useMemo(() => estimate(inputs), [inputs])

  return (
    <>
      <Seo
        title="NRC license timeline calculator (Parts 50, 52, 53)"
        description="Estimate how long an NRC reactor license application will take under 10 CFR Part 50, 52, or 53, based on pathway, pre-application engagement, approved topical reports, TICAP alignment, design novelty, and ESP status."
        canonical={URL}
        ogImage={`${SITE_URL}/og/how-long-does-nrc-license-take.png`}
        ogType="website"
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${URL}#app`,
            name: 'NRC license timeline calculator',
            description:
              'Estimate NRC nuclear reactor license duration under Parts 50, 52, or 53 from pre-application engagement, topical reports, TICAP alignment, design novelty, and ESP status.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: URL,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Compliance', url: `${SITE_URL}/compliance` },
            { name: 'NRC license timeline', url: `${SITE_URL}/how-long-does-nrc-license-take` },
            { name: 'NRC calculator', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
            Calculator · NRC reactor licensing
          </p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            NRC license timeline estimator.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 md:text-lg">
            A first-order estimate of how long an NRC reactor license application will take, anchored to recent advanced reactor and Part 52 dockets (Kairos Hermes, TerraPower Natrium, Long Mott Xe-100, Vogtle Units 3 and 4). This is an estimate, not a forecast.
          </p>

          <section className="mt-12 rounded-[3px] border border-ink/15 bg-white p-6 md:p-8">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Inputs</h2>

            <Field label="Licensing pathway">
              <select
                value={inputs.pathway}
                onChange={(e) => setInputs({ ...inputs, pathway: e.target.value as Pathway })}
                className="mt-2 w-full rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              >
                {Object.entries(PATHWAY_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Months of pre-application engagement done"
              hint="Kairos engaged with NRC from Nov 2018; Hermes CP issued Dec 14 2023. Roughly 36 months is typical for Part 50 advanced reactors."
            >
              <input
                type="number"
                min={0}
                max={120}
                value={inputs.preAppMonths}
                onChange={(e) => setInputs({ ...inputs, preAppMonths: Number(e.target.value) })}
                className="mt-2 w-32 rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              />
            </Field>

            <Field
              label="Approved topical reports referenced"
              hint="Each approved TR with a Final Safety Evaluation saves review time. Kairos referenced 11+ TRs."
            >
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={inputs.topicalReportsApproved}
                onChange={(e) => setInputs({ ...inputs, topicalReportsApproved: Number(e.target.value) })}
                className="mt-2 w-full accent-copper"
              />
              <span className="ml-2 font-sans text-xs text-ink/65">{inputs.topicalReportsApproved}</span>
            </Field>

            <Field
              label="Design novelty (0 = LWR-familiar, 5 = first-of-kind non-LWR)"
              hint="Higher novelty triggers more RAI cycles."
            >
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={inputs.noveltyLevel}
                onChange={(e) => setInputs({ ...inputs, noveltyLevel: Number(e.target.value) })}
                className="mt-2 w-full accent-copper"
              />
              <span className="ml-2 font-sans text-xs text-ink/65">{inputs.noveltyLevel}</span>
            </Field>

            <Field label="Application aligned to NEI 21-07 TICAP?">
              <div className="mt-2 flex gap-3">
                {[
                  ['Yes', true],
                  ['No', false],
                ].map(([label, v]) => (
                  <button
                    key={String(v)}
                    onClick={() => setInputs({ ...inputs, ticapAligned: v as boolean })}
                    className={`rounded-full border px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      inputs.ticapAligned === v
                        ? 'border-copper bg-copper/10 text-copper'
                        : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Existing Early Site Permit (ESP) referenced? (Part 52 only)">
              <div className="mt-2 flex gap-3">
                {[
                  ['Yes', true],
                  ['No', false],
                ].map(([label, v]) => (
                  <button
                    key={String(v)}
                    onClick={() => setInputs({ ...inputs, hasEsp: v as boolean })}
                    disabled={inputs.pathway !== 'part-52-col'}
                    className={`rounded-full border px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.12em] transition-colors disabled:opacity-40 ${
                      inputs.hasEsp === v
                        ? 'border-copper bg-copper/10 text-copper'
                        : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </div>
            </Field>
          </section>

          <section className="mt-8 rounded-[3px] border border-copper/20 bg-copper/5 p-6 md:p-8">
            <h2 className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Estimate</h2>
            <p className="mt-4 font-serif text-5xl font-normal leading-none tracking-[-0.02em] text-ink md:text-6xl">
              ~{result.totalMonths} months
            </p>
            <p className="mt-3 font-sans text-sm text-ink/65">total from today to license, including remaining pre-application</p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              <Stat label="Pre-app remaining" value={`${result.preAppRemaining} mo`} />
              <Stat label="Formal review" value={`${result.formalReviewMonths} mo`} />
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl font-normal text-ink md:text-3xl">Anchors and method</h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              The model uses the same per-docket data documented in our {' '}
              <Link to="/how-long-does-nrc-license-take" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                NRC license timeline guide
              </Link>
              . Part 50 CP base is 22 months (median of Kairos Hermes 2 at 16, Hermes 1 at 25, Natrium at 22, Long Mott at 18). Part 52 COL base is 46 months (Vogtle 3 and 4, V.C. Summer 2 and 3). Part 53 base is 18 months (NRC stated target for first applications under the rule that took effect April 29, 2026).
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Each approved topical report saves about 1.5 months because the staff incorporates the prior FSER by reference. TICAP alignment under NEI 21-07 with RG 1.253 endorsement saves about 3 months because the staff workflow is familiar. An ESP shaves 6 months from a Part 52 COL because siting issues are pre-resolved.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              For a serious docket-specific schedule, talk to your NRC project manager and the relevant DANU branch chief.
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
      <label className="block font-sans text-[11px] uppercase tracking-[0.12em] text-ink/55">
        {label}
      </label>
      {hint && <p className="mt-1 font-sans text-xs text-ink/45">{hint}</p>}
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink/55">{label}</dt>
      <dd className="mt-2 font-serif text-2xl font-normal text-ink">{value}</dd>
    </div>
  )
}
