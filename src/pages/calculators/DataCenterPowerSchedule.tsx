import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  calculatePowerPhase, EXAMPLE_PHASES, POWER_SCHEDULE_DESCRIPTION, POWER_SCHEDULE_PATH,
  POWER_SCHEDULE_TITLE, type PowerPhase,
} from '../../data/dataCenterPowerSchedule'
import './DataCenterPowerCapacity.css'
import './DataCenterPowerSchedule.css'

const URL = SITE_URL + POWER_SCHEDULE_PATH
const CHECKLIST = '/blog/data-center-site-selection-checklist'
const UTILITY_GUIDE = '/blog/utility-will-serve-letter-load-study-esa'
const DOE_COMMISSIONING = 'https://betterbuildingssolutioncenter.energy.gov/sites/default/files/Acheiving%20Data%20Center%20Cost%20Savings%20Through%20Renewable%20Energy.pdf'

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const displayDate = (date: string) => dateFormat.format(new Date(date))

const fields = [
  { id: 'demandMw', label: 'Facility demand (MW)', type: 'number', min: 0.01, step: '.01' },
  { id: 'opening', label: 'Target opening', type: 'date' },
  { id: 'commissioningDays', label: 'Commissioning and buffer (days)', type: 'number', min: 0, step: '1' },
  { id: 'supplyMw', label: 'Reported service (MW)', type: 'number', min: 0, step: '.01', placeholder: 'Unknown' },
  { id: 'service', label: 'Reported service date', type: 'date' },
] as const

function PhaseSchedule({ name, initial }: { name: string; initial: PowerPhase }) {
  const [inputs, setInputs] = useState(initial)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const result = calculatePowerPhase(inputs)
  const { latestService, estimatedReady, scheduleMargin, powerMargin } = result
  const scheduleDetail = scheduleMargin === null ? 'Schedule margin unknown'
    : scheduleMargin === 0 ? 'On the target date'
      : `${numberFormat.format(Math.abs(scheduleMargin))} ${Math.abs(scheduleMargin) === 1 ? 'day' : 'days'} ${scheduleMargin < 0 ? 'late' : 'early'}`
  const marginDetail = powerMargin === null ? 'Unknown'
    : powerMargin === 0 ? 'Matches demand'
      : `${numberFormat.format(Math.abs(powerMargin))} MW ${powerMargin < 0 ? 'below demand' : 'above demand'}`
  return (
    <fieldset className="phase-schedule-phase">
      <legend>{name}</legend>
      <div className="phase-schedule-inputs">
        {fields.map(field => (
          <label className="phase-schedule-field" key={field.id}>
            <span>{field.label}</span>
            <input
              type={field.type}
              value={inputs[field.id]}
              disabled={!ready}
              {...(field.type === 'number' && {
                min: field.min, step: field.step, inputMode: field.step === '1' ? 'numeric' : 'decimal',
              })}
              placeholder={'placeholder' in field ? field.placeholder : undefined}
              onChange={event => setInputs({ ...inputs, [field.id]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <dl className="phase-schedule-results" aria-live="polite" aria-atomic="true">
        <div>
          <dt>Power needed by</dt>
          <dd>{latestService ? <time dateTime={latestService}>{displayDate(latestService)}</time> : 'Enter a valid opening date and buffer'}</dd>
        </div>
        <div>
          <dt>Opening after commissioning</dt>
          <dd data-short={scheduleMargin !== null && scheduleMargin < 0}>
            {estimatedReady ? <><time dateTime={estimatedReady}>{displayDate(estimatedReady)}</time><small>{scheduleDetail}</small></> : 'Unknown'}
          </dd>
        </div>
        <div>
          <dt>Reported power versus demand</dt>
          <dd data-short={powerMargin !== null && powerMargin < 0}>{marginDetail}</dd>
        </div>
      </dl>
    </fieldset>
  )
}

export default function DataCenterPowerSchedule() {
  return (
    <>
      <Seo title={POWER_SCHEDULE_TITLE} description={POWER_SCHEDULE_DESCRIPTION} canonical={URL}
        markdown={`${POWER_SCHEDULE_PATH}.md`} jsonLd={[
          ORG_SCHEMA,
          breadcrumbSchema([
            { name: 'Invariant', url: SITE_URL },
            { name: 'Calculators', url: `${SITE_URL}/calculators` },
            { name: POWER_SCHEDULE_TITLE, url: URL },
          ]),
          {
            '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${URL}#app`,
            name: POWER_SCHEDULE_TITLE, description: POWER_SCHEDULE_DESCRIPTION, url: URL,
            applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
        ]}
      />
      <article className="power-calc phase-schedule">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{POWER_SCHEDULE_TITLE}</h1>
            <p>{POWER_SCHEDULE_DESCRIPTION}</p>
          </header>
          <section aria-labelledby="phase-schedule-inputs">
            <h2 id="phase-schedule-inputs">Check your opening dates</h2>
            <p className="phase-schedule-hint">Start with the example or enter your own dates. Enter total facility MW at the meter for each phase and the calendar days needed after power arrives.</p>
            <PhaseSchedule name="First phase" initial={EXAMPLE_PHASES[0]} />
            <PhaseSchedule name="Full buildout" initial={EXAMPLE_PHASES[1]} />
          </section>
          <section className="power-calc-method" aria-labelledby="phase-schedule-method">
            <h2 id="phase-schedule-method">How the dates are calculated</h2>
            <p>Subtract commissioning and buffer days from the target opening to get the latest date you need power. Add the same days to the reported service date to estimate opening. Compare service MW and demand separately.</p>
            <p>In the example, a June 30, 2028 opening with 45 days of commissioning and buffer needs power by May 16. A June 15 service date moves the estimated opening to July 30, 30 days late, even though reported power exceeds demand by 10 MW. The 80 MW buildout still needs a service date and a power figure.</p>
            <p>Use the service date and MW from the same documented milestone. Check what the serving utility can provide and when. Check customer construction, permits, and commissioning against their own schedules as well.</p>
            <div className="power-calc-links">
              <Link to={CHECKLIST}>Download the site selection checklist ↗</Link>
              <Link to={UTILITY_GUIDE}>Review utility letters, studies, and agreements ↗</Link>
              <a href={DOE_COMMISSIONING}>DOE guidance on commissioning ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
