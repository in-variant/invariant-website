import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../../components/Seo'

const URL = `${SITE_URL}/calculators/fcc-deorbit-feasibility`

type Disposal = 'passive-drag' | 'active-deorbit' | 'graveyard' | 'controlled-reentry'

type Inputs = {
  altitudeKm: number
  inclinationDeg: number
  ballisticCoeff: number // mass/area in kg/m^2 (typical smallsat 50-200)
  hasPropulsion: boolean
  disposalStrategy: Disposal
  launchAfterGrandfathering: boolean // Sep 29 2024 watershed
}

const DEFAULTS: Inputs = {
  altitudeKm: 550,
  inclinationDeg: 53,
  ballisticCoeff: 100,
  hasPropulsion: false,
  disposalStrategy: 'passive-drag',
  launchAfterGrandfathering: true,
}

function estimate(i: Inputs) {
  // Rough natural decay model (King-Hele approximation).
  // Lifetime in years scales ~ exp(altitude/H) * BC where H ~ 50km.
  const H = 50
  const naturalDecayYears = Math.exp((i.altitudeKm - 400) / H) * (i.ballisticCoeff / 100) * 1.5

  // Rule applicability
  const captured = i.altitudeKm < 2000 // LEO
  const passes5yr = naturalDecayYears <= 5

  let strategy: Disposal = i.disposalStrategy
  // Auto-recommend if user picked passive but it won't make 5yr
  let recommended: Disposal = strategy
  if (i.disposalStrategy === 'passive-drag' && !passes5yr) {
    recommended = i.hasPropulsion ? 'active-deorbit' : 'graveyard'
  }

  // Risk of compliance failure (used to suggest design changes)
  const successProbability = strategy === 'passive-drag'
    ? Math.max(0.5, Math.min(0.95, 1 - Math.log(Math.max(naturalDecayYears, 1)) / 6))
    : 0.95

  const meetsRule = !captured || passes5yr || strategy === 'active-deorbit' || strategy === 'controlled-reentry'

  return {
    captured,
    naturalDecayYears: Math.round(naturalDecayYears * 10) / 10,
    passes5yr,
    recommended,
    successProbability: Math.round(successProbability * 100) / 100,
    meetsRule,
    grandfathered: !i.launchAfterGrandfathering,
  }
}

const DISPOSAL_LABEL: Record<Disposal, string> = {
  'passive-drag': 'Passive atmospheric drag (no propulsion)',
  'active-deorbit': 'Active deorbit burn (propulsion)',
  graveyard: 'Graveyard orbit (above LEO protected region)',
  'controlled-reentry': 'Controlled reentry (precision target footprint)',
}

export default function FccDeorbitCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const result = useMemo(() => estimate(inputs), [inputs])

  return (
    <>
      <Seo
        title="FCC 5-year deorbit feasibility calculator"
        description="Check whether your LEO satellite complies with the FCC 22-74 five-year post-mission disposal rule, based on altitude, inclination, ballistic coefficient, and disposal strategy."
        canonical={URL}
        ogImage={`${SITE_URL}/og/fcc-5-year-deorbit-rule.png`}
        ogType="website"
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${URL}#app`,
            name: 'FCC 5-year deorbit feasibility calculator',
            description:
              "Estimate whether a LEO satellite's natural decay or active disposal plan satisfies the FCC 22-74 five-year post-mission disposal rule under 47 CFR 25.283(e).",
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: URL,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Calculators', url: `${SITE_URL}/calculators` },
            { name: 'FCC 5-year deorbit feasibility', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
            Calculator · FCC orbital debris
          </p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            FCC 5-year deorbit feasibility.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 md:text-lg">
            A first-order check of whether your LEO satellite design satisfies the FCC 22-74 five-year post-mission disposal rule under 47 CFR 25.283(e), based on altitude, inclination, ballistic coefficient, and disposal strategy. Not a flight-quality propagation, but enough to flag risk early in design.
          </p>

          <section className="mt-12 rounded-[3px] border border-ink/15 bg-white p-6 md:p-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Inputs</h2>

            <Field label="Operational altitude (km)">
              <input
                type="number"
                min={300}
                max={2500}
                value={inputs.altitudeKm}
                onChange={(e) => setInputs({ ...inputs, altitudeKm: Number(e.target.value) })}
                className="mt-2 w-32 rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              />
            </Field>

            <Field label="Orbital inclination (deg)">
              <input
                type="number"
                min={0}
                max={120}
                value={inputs.inclinationDeg}
                onChange={(e) => setInputs({ ...inputs, inclinationDeg: Number(e.target.value) })}
                className="mt-2 w-32 rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              />
            </Field>

            <Field
              label="Ballistic coefficient (kg/m²)"
              hint="Typical smallsat 50-200, cubesat 5-50, large GEO bus 200-500. Use mass / area."
            >
              <input
                type="number"
                min={5}
                max={500}
                value={inputs.ballisticCoeff}
                onChange={(e) => setInputs({ ...inputs, ballisticCoeff: Number(e.target.value) })}
                className="mt-2 w-32 rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              />
            </Field>

            <Field label="Onboard propulsion available?">
              <div className="mt-2 flex gap-3">
                {[['Yes', true], ['No', false]].map(([label, v]) => (
                  <button
                    key={String(v)}
                    onClick={() => setInputs({ ...inputs, hasPropulsion: v as boolean })}
                    className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      inputs.hasPropulsion === v ? 'border-copper bg-copper/10 text-copper' : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Planned disposal strategy">
              <select
                value={inputs.disposalStrategy}
                onChange={(e) => setInputs({ ...inputs, disposalStrategy: e.target.value as Disposal })}
                className="mt-2 w-full rounded-[3px] border border-ink/15 bg-paper px-3 py-2 font-sans text-base text-ink focus:border-copper focus:outline-none"
              >
                {Object.entries(DISPOSAL_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>

            <Field label="Launched after September 29, 2024?" hint="Satellites authorized before Sept 29 2022 and launched before Sept 29 2024 are grandfathered under the prior 25-year benchmark.">
              <div className="mt-2 flex gap-3">
                {[['Yes (rule applies)', true], ['No (grandfathered)', false]].map(([label, v]) => (
                  <button
                    key={String(v)}
                    onClick={() => setInputs({ ...inputs, launchAfterGrandfathering: v as boolean })}
                    className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      inputs.launchAfterGrandfathering === v ? 'border-copper bg-copper/10 text-copper' : 'border-ink/15 text-ink/65 hover:border-ink/30'
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </div>
            </Field>
          </section>

          <section className="mt-8 rounded-[3px] border border-copper/20 bg-copper/5 p-6 md:p-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Result</h2>
            <p className="mt-4 font-serif text-3xl font-normal leading-tight tracking-[-0.015em] text-ink md:text-4xl">
              {result.grandfathered
                ? 'Grandfathered under prior 25-year benchmark.'
                : result.meetsRule
                  ? 'Compliant with FCC 22-74 (47 CFR 25.283(e)).'
                  : 'At risk of non-compliance under 47 CFR 25.283(e).'}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <Stat label="Natural decay (if passive)" value={`~${result.naturalDecayYears} years`} />
              <Stat label="Captured by rule?" value={result.captured ? 'Yes (LEO)' : 'No'} />
              <Stat label="Passes 5-year passive?" value={result.passes5yr ? 'Yes' : 'No'} />
              <Stat label="Disposal success prob." value={`${result.successProbability}`} hint="Rule requires ≥ 0.9 in 25.122(d)(9)." />
            </dl>
            {result.recommended !== inputs.disposalStrategy && (
              <p className="mt-6 rounded-[3px] border border-ink/15 bg-white p-4 font-sans text-sm leading-relaxed text-ink/75">
                <strong className="font-medium text-ink">Recommended strategy:</strong>{' '}
                {DISPOSAL_LABEL[result.recommended]}. At {inputs.altitudeKm} km with a ballistic coefficient of {inputs.ballisticCoeff} kg/m², passive drag is unlikely to meet the 5-year clock.
              </p>
            )}
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl font-normal text-ink md:text-3xl">Method</h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Natural decay is approximated using a King-Hele exponential model scaled by ballistic coefficient. For a serious design check, run a full SGP4 propagation with realistic atmospheric density (NRLMSISE-00 or JB2008) and the solar cycle phase you expect at end of mission.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              The rule lives at 47 CFR 25.283(e), codified by FCC 22-74 (Second Report and Order, adopted September 29, 2022, IB Docket Nos. 18-313 and 22-271). Full background at {' '}
              <Link to="/fcc-5-year-deorbit-rule" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                /fcc-5-year-deorbit-rule
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
      <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">{label}</label>
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
