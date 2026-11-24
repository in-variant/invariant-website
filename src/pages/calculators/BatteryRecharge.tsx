import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  BATTERY_INPUTS, BATTERY_RECHARGE_DESCRIPTION as description, BATTERY_RECHARGE_PATH as path,
  BATTERY_RECHARGE_TITLE as title, calculateBatteryRecharge, type BatteryInputs,
} from '../../data/batteryRecharge'
import './DataCenterPowerCapacity.css'
import './BatteryRecharge.css'

const url = SITE_URL + path
const sitingGuide = '/blog/battery-storage-site-interconnection'
const eia = 'https://www.eia.gov/todayinenergy/detail.php?id=51798'
const pjm = 'https://www.pjm.com/pjmfiles/pub/planning/project-queues/feas_docs/w3093_fea.pdf#page=2'
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 })

function format(value: number) {
  return value > 0 && value < 0.001 ? '<0.001' : number.format(value)
}

const dispatchFields = [
  { name: 'targetMw', label: 'Target export', unit: 'MW' },
  { name: 'targetHours', label: 'Target duration', unit: 'hours', max: 24 },
  { name: 'exportMw', label: 'Maximum export', unit: 'MW' },
  { name: 'usableMwh', label: 'Usable export energy', unit: 'MWh' },
  { name: 'efficiency', label: 'AC round-trip efficiency', unit: '%', max: 100 },
] as const

const windows = [
  { label: 'First window', power: 'firstMw', hours: 'firstHours' },
  { label: 'Second window (optional)', power: 'secondMw', hours: 'secondHours' },
] as const

export default function BatteryRecharge() {
  const [inputs, setInputs] = useState(BATTERY_INPUTS)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const result = calculateBatteryRecharge(inputs)

  function input(name: keyof BatteryInputs, label: string, unit: string, max?: number) {
    return (
      <div className="power-calc-field" key={name}>
        <label htmlFor={`battery-${name}`}>{label}</label>
        <div className="power-calc-number">
          <input id={`battery-${name}`} type="number" inputMode="decimal" min="0" max={max} step="any"
            disabled={!ready} aria-describedby={`battery-${name}-unit`} value={inputs[name]}
            onChange={event => setInputs({ ...inputs, [name]: event.target.value })} />
          <span id={`battery-${name}-unit`}>{unit}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo title={title} description={description} canonical={url} markdown={`${path}.md`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL }, { name: 'Calculators', url: `${SITE_URL}/calculators` }, { name: title, url },
        ]), {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${url}#app`,
          name: title, description, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, publisher: { '@id': `${SITE_URL}/#organization` },
        }]} />
      <article className="power-calc battery-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <div className="power-calc-grid">
            <div className="power-calc-inputs">
              <div className="battery-input-heading">
                <h2>Plan one daily cycle</h2>
                <button type="button" disabled={!ready} onClick={() => setInputs(BATTERY_INPUTS)}>Reset example</button>
              </div>
              <p>Use power and energy at the grid connection. Start with an empty usable energy window.</p>
              <div className="power-calc-fields battery-fields">
                {dispatchFields.map(field => input(field.name, field.label, field.unit, 'max' in field ? field.max : undefined))}
              </div>
              <div className="battery-windows">
                <h3>Charging windows</h3>
                <p>Enter nonoverlapping hours before dispatch and the import MW available to the battery in each.</p>
                {windows.map(({ label, power, hours }) => (
                  <fieldset key={power}>
                    <legend>{label}</legend>
                    <div className="battery-fields">
                      {input(power, 'Import for charging', 'MW')}
                      {input(hours, 'Allowed charging time', 'hours', 24)}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
            <section className="power-calc-result" aria-labelledby="battery-dispatch-result">
              <h2 id="battery-dispatch-result">Dispatch check</h2>
              <div aria-live="polite" aria-atomic="true">
                {result.error !== undefined ? <p className="power-calc-message">{result.error}</p> : (
                  <>
                    <p className="power-calc-demand"><strong>{format(result.availableMwh)}</strong> MWh</p>
                    <p className="power-calc-result-label">Usable export energy after charging</p>
                    <dl className="power-calc-margins">
                      <div><dt>Energy needed for dispatch</dt><dd>{format(result.targetMwh)} MWh</dd></div>
                      <div><dt>Grid energy available to charge</dt><dd>{format(result.inputMwh)} MWh</dd></div>
                      <div><dt>Grid energy needed for target</dt><dd>{format(result.gridEnergyNeeded)} MWh</dd></div>
                      <div><dt>Runtime at target output</dt><dd data-short={result.exportShortfall > 0}>
                        {result.exportShortfall > 0 ? 'Above export limit' : `${format(result.duration)} hours`}
                      </dd></div>
                    </dl>
                    {result.energyShortfall > 0 && (
                      <p className="battery-warning">The plan is short by {format(result.energyShortfall)} MWh.
                        {result.capacityShortfall && ' The battery’s usable capacity is below the dispatch target even at full charge.'}</p>
                    )}
                    {result.exportShortfall > 0 && <p className="battery-warning">The export limit is {format(result.exportShortfall)} MW below the target.</p>}
                    {!result.energyShortfall && !result.exportShortfall && <p className="power-calc-result-label">The entered limits cover the planned dispatch.</p>}
                  </>
                )}
              </div>
            </section>
          </div>
          <section className="power-calc-method" aria-labelledby="recharge-method">
            <h2 id="recharge-method">How to check a battery recharge window</h2>
            <p>Multiply the MW available for charging in each window by its length in hours. Add the resulting MWh and multiply by AC round-trip efficiency. Cap the result at the battery’s usable export energy. The dispatch needs its target MW times its duration, and the connection must support the target MW throughout the dispatch.</p>
            <h3>Can a 50 MW import limit refill a 100 MW battery in eight hours?</h3>
            <p>At 90% efficiency, eight hours at 50 MW imports 400 MWh and yields 360 MWh for export. That runs a 100 MW dispatch for 3.6 hours, leaving a 40 MWh shortfall against a four-hour target. With 400 MWh of usable export energy, the battery needs 444.44 MWh of grid input, about 8 hours and 53 minutes at 50 MW. A second one-hour window at 50 MW supplies enough energy in this example.</p>
            <h3>Which limits belong in the calculator?</h3>
            <p>Use the lower of the usable charging equipment rating and the import allowance left after any other site loads in each window. Use the lower of the discharge equipment limit and the permitted grid export. PJM’s Deka Road study evaluated 3.6 MW of charging load and 3 MW of injection in separate cases. Get the applicable limits and hours for your own connection from the utility study or agreement.</p>
            <p>This screen assumes constant limits within each window, fixed losses at the grid connection and one charge before one dispatch. Use usable energy at the applicable age and temperature. For operating schedules, model ramping, auxiliary loads, changing efficiency and state of charge across cycles.</p>
            <div className="power-calc-links">
              <Link to={sitingGuide}>Compare battery interconnection studies ↗</Link>
              <a href={pjm}>Read the PJM Deka Road study ↗</a>
              <a href={eia}>See how EIA defines battery duration ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
