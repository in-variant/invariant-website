import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  EMPTY_RUN, GENERATOR_HOURS_DESCRIPTION, GENERATOR_HOURS_PATH, GENERATOR_HOURS_TITLE,
  GENERATOR_LOG_PATH, GENERATOR_PERMIT_GUIDE, LOUDOUN_EXAMPLE, LOUDOUN_PERMIT,
  calculateRunHours, engineCount, hundredthsOfHour, type Ledger,
} from '../../data/generatorRunHours'
import '../../styles/invariant-brand.css'
import './GeneratorRunHours.css'

const URL = SITE_URL + GENERATOR_HOURS_PATH
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const ledgerFields = [
  { key: 'previous', label: 'Preceding 11 months' },
  { key: 'current', label: 'Month to date' },
  { key: 'limit', label: '12-month limit (optional)' },
] as const

function NumberField({ id, label, unit, value, kind = 'hours', onChange }: {
  id: string
  label: string
  unit?: string
  value: string
  kind?: 'count' | 'duration' | 'hours'
  onChange: (value: string) => void
}) {
  const hours = hundredthsOfHour(value)
  const valid = kind === 'count' ? engineCount(value) !== null : hours !== null && (kind !== 'duration' || hours > 0)
  const invalid = value.trim() !== '' && !valid
  const hint = kind === 'count' ? 'Enter a positive whole number.'
    : kind === 'duration' ? 'Enter more than zero, with up to two decimal places.'
      : 'Enter zero or more, with up to two decimal places.'
  return <div className="run-hours-field">
    <label htmlFor={id}>{label}{unit && <span className="sr-only"> ({unit})</span>}</label>
    <div className="run-hours-number">
      <input id={id} value={value} type="text" inputMode={kind === 'count' ? 'numeric' : 'decimal'}
        aria-invalid={invalid || undefined} aria-describedby={invalid ? id + '-error' : undefined}
        onChange={event => onChange(event.target.value)} />
      {unit && <span aria-hidden="true">{unit}</span>}
    </div>
    {invalid && <small id={id + '-error'}>{hint}</small>}
  </div>
}

function LedgerFields({ id, title, ledger, onChange }: {
  id: 'group' | 'engine'
  title: string
  ledger: Ledger
  onChange: (ledger: Ledger) => void
}) {
  const unit = id === 'group' ? 'engine-hours' : 'hours'
  return <fieldset>
    <legend>{title}</legend>
    <div className="run-hours-fields">
      {ledgerFields.map(({ key, label }) => <NumberField key={key} id={id + '-' + key}
        label={label} unit={unit} value={ledger[key]} onChange={value => onChange({ ...ledger, [key]: value })} />)}
    </div>
  </fieldset>
}

type Projection = ReturnType<typeof calculateRunHours>['group']

function LedgerResult({ name, unit, projection }: { name: string; unit: string; projection: Projection }) {
  if (!projection) return <div>
    <dt>{name}</dt>
    <dd>Enter the run and recorded hours.</dd>
  </div>

  const { projected, remaining } = projection
  return <div>
    <dt>{name}</dt>
    <dd className="run-hours-reading">{format.format(projected)} <span>{unit}</span></dd>
    <dd>{remaining === null ? 'Enter the permit limit to compare.'
      : remaining === 0 ? 'At the entered limit.'
        : format.format(Math.abs(remaining)) + ' ' + unit + (remaining < 0 ? ' above the entered limit.' : ' below the entered limit.')}</dd>
  </div>
}

export default function GeneratorRunHours() {
  const [run, setRun] = useState(EMPTY_RUN)
  const result = calculateRunHours(run)
  return <>
    <Seo title={GENERATOR_HOURS_TITLE} description={GENERATOR_HOURS_DESCRIPTION} canonical={URL}
      ogImage={SITE_URL + '/og-image.png'} markdown={GENERATOR_HOURS_PATH + '.md'}
      jsonLd={[
        ORG_SCHEMA,
        breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL },
          { name: 'Calculators', url: SITE_URL + '/calculators' },
          { name: GENERATOR_HOURS_TITLE, url: URL },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': URL + '#app',
          name: GENERATOR_HOURS_TITLE, description: GENERATOR_HOURS_DESCRIPTION, url: URL,
          applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@id': SITE_URL + '/#organization' },
        },
      ]} />
    <article className="run-hours">
      <div className="run-hours-inner">
        <header>
          <Link to="/calculators">Calculators</Link>
          <h1>{GENERATOR_HOURS_TITLE}</h1>
          <p>{GENERATOR_HOURS_DESCRIPTION}</p>
          <a className="run-hours-download" href={GENERATOR_LOG_PATH} download>Download the run log (CSV) <span aria-hidden="true">↓</span></a>
        </header>

        <div className="run-hours-grid">
          <section className="run-hours-inputs" aria-labelledby="planned-run" aria-describedby="planned-run-help">
            <h2 id="planned-run">Plan a run</h2>
            <p id="planned-run-help">Use engines in the same permit group that will run for the same duration within one reporting month.</p>
            <div className="run-hours-actions">
              <button type="button" onClick={() => setRun(LOUDOUN_EXAMPLE)}>Load the permit example</button>
              <button type="button" onClick={() => setRun(EMPTY_RUN)}>Clear inputs</button>
            </div>
            <div className="run-hours-fields">
              <NumberField id="planned-engines" label="Engines running" value={run.engines} kind="count"
                onChange={engines => setRun(previous => ({ ...previous, engines }))} />
              <NumberField id="planned-duration" label="Run time per engine" unit="hours" value={run.duration} kind="duration"
                onChange={duration => setRun(previous => ({ ...previous, duration }))} />
            </div>
            <p className="run-hours-ledger-help">Enter hours that count under each permit condition. Use the 11 full months before the run month, plus counted hours already logged in the run month. Enter zero for a confirmed zero.</p>
            <LedgerFields id="group" title="Permit group" ledger={run.group}
              onChange={group => setRun(previous => ({ ...previous, group }))} />
            <LedgerFields id="engine" title="One engine in this run" ledger={run.engine}
              onChange={engine => setRun(previous => ({ ...previous, engine }))} />
            <a className="run-hours-results-link" href="#run-results">View projected hours <span aria-hidden="true">↓</span></a>
          </section>

          <section className="run-hours-results" id="run-results" aria-labelledby="run-results-heading" tabIndex={-1}>
            <h2 id="run-results-heading">Projected hours</h2>
            <div aria-live="polite">
              <p className="run-hours-addition">
                {result.added === null ? 'Enter engine count and duration for the planned run.'
                  : format.format(result.added) + ' engine-hours added to the group'}
              </p>
              {result.engineAdded !== null && <p>{format.format(result.engineAdded)} hours added to each scheduled engine</p>}
              <dl>
                <LedgerResult name="Permit group, rolling 12 months" unit="engine-hours" projection={result.group} />
                <LedgerResult name="Selected engine, rolling 12 months" unit="hours" projection={result.engine} />
              </dl>
            </div>
            <p className="run-hours-note">The comparison covers the limits you enter. Check each affected engine and the applicable use restrictions, calendar-year limits and other conditions separately.</p>
          </section>
        </div>

        <section className="run-hours-method" aria-labelledby="loudoun-example">
          <h2 id="loudoun-example">Worked example from a Virginia permit</h2>
          <p>Conditions 7 and 8 of the March 14, 2025 <a href={LOUDOUN_PERMIT}>Digital Loudoun Title V permit</a> set a 1,100 engine-hour cap for a group of 21 listed generators and a 500-hour cap for any one engine. Each window is 12 consecutive months, calculated monthly.</p>
          <p>Suppose all 21 engines run for two hours each in November. The run adds <strong>42 engine-hours</strong> to the group and <strong>2 hours</strong> to each engine. With an illustrative 1,050 group hours from the prior 11 months and 30 already logged in November, the projected group total is <strong>1,122 engine-hours, 22 above the cap</strong>. An engine with 38 prior hours and one November hour would reach <strong>41 hours, 459 below its individual cap</strong>. The totals before the run are illustrative.</p>
          <h2>How to use the log</h2>
          <p>Record one row per engine per run. Keep meter readings, the run reason, the source record, and the hours counted under each permit condition or federal category. For a run that crosses a month boundary, use the same run ID on one row per month and record only the hours allocated to that month. Use the prior 11 months plus the reporting month to check the rolling total.</p>
          <p><Link to={GENERATOR_PERMIT_GUIDE}>Read the backup generator permit guide</Link></p>
        </section>
      </div>
    </article>
  </>
}
