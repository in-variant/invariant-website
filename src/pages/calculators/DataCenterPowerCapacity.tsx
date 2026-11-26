import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  DEFAULT_POWER_CASE, DEFAULT_BATTERY_BRIDGE, DEFAULT_GRID_CASE, HYBRID_POWER_EXAMPLE,
  calculatePowerCapacity, calculateBatteryBridge, type BatteryBridge, type GridPowerCase, type PowerCase,
} from '../../data/dataCenterPowerCapacity'
import { POWER_SCHEDULE_PATH } from '../../data/dataCenterPowerSchedule'
import './DataCenterPowerCapacity.css'

const URL = `${SITE_URL}/calculators/data-center-power-capacity`
const TITLE = 'Data center power capacity calculator'
const DESCRIPTION = 'Convert IT load to facility MW. Compare grid imports and on-site generation during a generator trip or grid outage, then estimate battery runtime.'
const GUIDE = '/blog/behind-the-meter-power-for-data-centers'
const DOE_GUIDE = 'https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design_0.pdf'
const DOE_MICROGRIDS = 'https://www.energy.gov/oe/microgrid-systems'
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 })
const formatEnergy = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 7 })

type Field<T> = { id: keyof T & string; label: string; unit: string; min: number; hint?: string }

const capacityFields: Field<PowerCase>[] = [
  { id: 'it', label: 'IT load', unit: 'MW', min: 0.01, hint: 'Servers, storage, and networking.' },
  { id: 'multiplier', label: 'Facility-to-IT power ratio', unit: '×', min: 1, hint: 'Use the ratio for the design condition.' },
  { id: 'normal', label: 'Net power in normal conditions', unit: 'MW', min: 0 },
  { id: 'outage', label: 'Net power during an outage', unit: 'MW', min: 0 },
]

const hybridFields: Field<PowerCase>[] = [
  ...capacityFields.slice(0, 2),
  { id: 'normal', label: 'Net on-site power in normal conditions', unit: 'MW', min: 0 },
  { id: 'outage', label: 'Net on-site power after a generator trip', unit: 'MW', min: 0 },
]

const gridFields: Field<GridPowerCase>[] = [
  { id: 'imports', label: 'Usable utility imports in normal conditions', unit: 'MW', min: 0 },
  { id: 'importsAfterTrip', label: 'Usable utility imports after a generator trip', unit: 'MW', min: 0,
    hint: 'Use the capacity available under your standby or import agreement.' },
  { id: 'islandGeneration', label: 'Net on-site power with the grid disconnected', unit: 'MW', min: 0,
    hint: 'Use deliverable islanded output. Enter zero when no generation can stay online. Leave blank when unknown.' },
]

const batteryFields: Field<BatteryBridge>[] = [
  { id: 'power', label: 'Battery discharge power', unit: 'MW', min: 0 },
  { id: 'energy', label: 'Usable battery energy', unit: 'MWh', min: 0 },
  { id: 'duration', label: 'Time until replacement power is available', unit: 'min', min: 0.01 },
]

function NumericFields<T extends Record<string, string>>({ fields, values, onChange }: {
  fields: Field<T>[]
  values: T
  onChange: (values: T) => void
}) {
  return <div className="power-calc-fields">
    {fields.map(field => {
      const id = `power-calc-${field.id}`
      return <div className="power-calc-field" key={id}>
        <label htmlFor={id}>{field.label}{field.unit !== '×' && <span className="sr-only"> ({field.unit})</span>}</label>
        <div className="power-calc-number">
          <input
            id={id} type="number" inputMode="decimal" min={field.min} step=".01"
            value={values[field.id]}
            aria-describedby={field.hint ? `${id}-hint` : undefined}
            onChange={event => onChange({ ...values, [field.id]: event.target.value })}
          />
          <span aria-hidden="true">{field.unit}</span>
        </div>
        {field.hint && <small id={`${id}-hint`}>{field.hint}</small>}
      </div>
    })}
  </div>
}

function marginText(margin: number) {
  if (margin === 0) return '0 MW margin'
  return `${format.format(Math.abs(margin))} MW ${margin < 0 ? 'short' : 'spare'}`
}

export default function DataCenterPowerCapacity() {
  const [inputs, setInputs] = useState<PowerCase>(DEFAULT_POWER_CASE)
  const [battery, setBattery] = useState<BatteryBridge>(DEFAULT_BATTERY_BRIDGE)
  const [grid, setGrid] = useState<GridPowerCase>(DEFAULT_GRID_CASE)
  const [hybrid, setHybrid] = useState(false)
  const [batteryCase, setBatteryCase] = useState('generator')
  const [copyStatus, setCopyStatus] = useState('')
  const capacity = calculatePowerCapacity(inputs, hybrid ? grid : undefined)
  const batteryMargin = hybrid && batteryCase === 'grid' ? capacity?.islandMarginMw : capacity?.outageMarginMw
  const shortfall = Math.max(0, -(batteryMargin ?? 0))
  const bridge = shortfall ? calculateBatteryBridge(shortfall, battery) : null

  function loadHybridExample() {
    setInputs(HYBRID_POWER_EXAMPLE.power)
    setGrid(HYBRID_POWER_EXAMPLE.grid)
    setHybrid(true)
    setBatteryCase('generator')
    setCopyStatus('')
  }

  async function copyCalculation() {
    if (!capacity) return
    const summary = [
      TITLE,
      `${inputs.it} MW IT × ${inputs.multiplier} facility-to-IT ratio = ${format.format(capacity.facilityMw)} MW facility demand`,
      ...(hybrid ? [
        `Normal: ${inputs.normal} MW on-site + ${grid.imports} MW utility imports, ${marginText(capacity.normalMarginMw)}`,
        `Generator trip: ${inputs.outage} MW on-site + ${grid.importsAfterTrip} MW utility imports, ${marginText(capacity.outageMarginMw)}`,
        capacity.islandMarginMw === null ? 'Grid outage: islanded generation unknown'
          : `Grid outage: ${grid.islandGeneration} MW on-site with zero imports, ${marginText(capacity.islandMarginMw)}`,
      ] : [
        `Normal: ${inputs.normal} MW net, ${marginText(capacity.normalMarginMw)}`,
        `Outage: ${inputs.outage} MW net, ${marginText(capacity.outageMarginMw)}`,
      ]),
      URL,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(summary)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Clipboard unavailable. Select the values to copy them.')
    }
  }

  return (
    <>
      <Seo title={TITLE} description={DESCRIPTION} canonical={URL} ogImage={`${SITE_URL}/og-image.png`}
        markdown="/calculators/data-center-power-capacity.md" jsonLd={[
        ORG_SCHEMA,
        breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL },
          { name: 'Calculators', url: `${SITE_URL}/calculators` },
          { name: TITLE, url: URL },
        ]),
        {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${URL}#app`,
          name: TITLE, description: DESCRIPTION, url: URL, applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ]} />
      <article className="power-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{TITLE}</h1>
            <p>{DESCRIPTION}</p>
          </header>
          <div className="power-calc-grid">
            <section className="power-calc-inputs" aria-labelledby="power-calc-inputs">
              <h2 id="power-calc-inputs">Design case</h2>
              <p>Use net power delivered at the facility intake in each case.</p>
              <div className="power-calc-options">
                <label><input type="checkbox" checked={hybrid} onChange={event => {
                  setHybrid(event.target.checked)
                  setCopyStatus('')
                }} /> Enter on-site power and grid imports separately</label>
                <button type="button" onClick={loadHybridExample}>Load the 50 MW IT hybrid example</button>
              </div>
              <NumericFields fields={hybrid ? hybridFields : capacityFields} values={inputs} onChange={values => {
                setInputs(values)
                setCopyStatus('')
              }} />
              {hybrid && <fieldset className="power-calc-grid-fields">
                <legend>Utility and islanded service</legend>
                <NumericFields fields={gridFields} values={grid} onChange={values => {
                  setGrid(values)
                  setCopyStatus('')
                }} />
              </fieldset>}
            </section>
            <section className="power-calc-result" aria-labelledby="power-calc-result">
              <h2 id="power-calc-result">Capacity check</h2>
              <div aria-live="polite" aria-atomic="true">
                {capacity ? (
                  <>
                    <p className="power-calc-demand"><strong>{format.format(capacity.facilityMw)}</strong> MW</p>
                    <p className="power-calc-result-label">Total facility demand</p>
                    <dl className="power-calc-margins">
                      <div><dt>Normal conditions</dt><dd data-short={capacity.normalMarginMw < 0}>{marginText(capacity.normalMarginMw)}</dd></div>
                      <div><dt>{hybrid ? 'Generator trip' : 'Outage case'}</dt><dd data-short={capacity.outageMarginMw < 0}>{marginText(capacity.outageMarginMw)}</dd></div>
                      {hybrid && <div><dt>Loss of grid service</dt><dd data-short={(capacity.islandMarginMw ?? 0) < 0}>
                        {capacity.islandMarginMw === null ? 'Islanded output unknown' : marginText(capacity.islandMarginMw)}
                      </dd></div>}
                    </dl>
                  </>
                ) : (
                  <p className="power-calc-message">Enter an IT load above zero, a ratio of at least 1, and nonnegative power figures. Use up to two decimal places.</p>
                )}
              </div>
              <div className="power-calc-copy">
                <button type="button" disabled={!capacity} onClick={copyCalculation}>Copy calculation</button>
                <span role="status">{copyStatus}</span>
              </div>
            </section>
          </div>
          <details className="power-calc-bridge" id="battery-bridge">
            <summary>Check battery runtime during an outage</summary>
            <div className="power-calc-bridge-body">
              <p>Enter the battery’s discharge power and usable energy at the facility intake. Use the energy available at the expected state of charge after losses and reserves.</p>
              {hybrid && <label className="power-calc-case">
                Outage to use for battery sizing
                <select value={batteryCase} onChange={event => setBatteryCase(event.target.value)}>
                  <option value="generator">Generator trip</option>
                  <option value="grid">Loss of grid service</option>
                </select>
              </label>}
              {shortfall > 0 && <NumericFields fields={batteryFields} values={battery} onChange={setBattery} />}
              <div className="power-calc-bridge-result" aria-live="polite" aria-atomic="true">
                {bridge ? <>
                  <dl>
                    <div><dt>Discharge power needed</dt><dd>{format.format(shortfall)} MW</dd></div>
                    <div><dt>Usable energy needed</dt><dd>{formatEnergy.format(bridge.requiredEnergyMwh)} MWh</dd></div>
                    {bridge.runtimeMinutes !== null && <div><dt>Runtime at this shortfall</dt><dd>{formatEnergy.format(bridge.runtimeMinutes)} min</dd></div>}
                  </dl>
                  <p className="power-calc-bridge-status" data-short={!bridge.coversDuration}>{bridge.coversDuration
                    ? 'The battery covers the entered duration at this shortfall.'
                    : bridge.runtimeMinutes === null ? 'Battery discharge power is below the outage shortfall.'
                      : 'Usable battery energy runs out before replacement power is available.'}</p>
                </> : <p>{!capacity ? 'Complete the design case to check an outage.'
                  : batteryMargin === null ? 'Enter net on-site power with the grid disconnected to check battery requirements.'
                  : shortfall === 0 ? 'The outage case covers the entered facility load in steady state. Check transfer and recovery behavior separately.'
                    : 'Enter a positive duration and nonnegative battery power and energy with up to two decimal places.'}</p>}
              </div>
            </div>
          </details>
          <section className="power-calc-method" aria-labelledby="power-calc-method">
            <h2 id="power-calc-method">How to read the result</h2>
            <p>Multiply IT load by the facility-to-IT power ratio. Subtract that demand from the net power available in each case. A shortfall is the extra net power needed at the facility intake for that case.</p>
            <p>With the default inputs, 50 MW of IT load at a ratio of 1.25 needs 62.5 MW at the intake. A plant that delivers 70 MW normally has 7.5 MW to spare. With 55 MW available after the largest unit is lost, the facility is 7.5 MW short.</p>
            <p>For sizing, use the engineer’s demand schedule or a ratio calculated for the design condition. Annual power usage effectiveness (PUE) measures energy over a year. Obtain net plant output after site derating, plant auxiliary loads, and losses to the intake. Include grid imports only where the utility can supply them in the scenario under review.</p>
            <h3 id="grid-and-onsite">How much grid backup does on-site generation need?</h3>
            <p>A 50 MW IT phase at a 1.25 design ratio needs 62.5 MW at the intake. In the hybrid example, the plant delivers 50 MW and the utility supplies 20 MW, leaving 7.5 MW spare. A generator trip cuts on-site output to 40 MW. With the same 20 MW of imports, the facility is 2.5 MW short. If utility service goes out while the plant can deliver 50 MW in island mode, the shortfall is 12.5 MW.</p>
            <p>For 15 minutes, the generator trip needs a battery that can deliver 2.5 MW and 0.625 usable MWh. Covering the grid outage for the same time takes 12.5 MW and 3.125 usable MWh.</p>
            <p>Confirm usable imports after a generator trip in the utility agreement. For a grid outage, use the net on-site output that can actually serve the load after disconnecting. Check transfer, controls, fuel and shared equipment with the project engineer.</p>
            <h3>How much battery energy covers a generator shortfall?</h3>
            <p>Multiply the constant shortfall in MW by the duration in hours to get the usable MWh needed. A 500 MW IT campus at a design ratio of 1.20 needs 600 MW at the facility intake. With 550 MW available after generators settle into the outage condition, the 50 MW shortfall requires 25 usable MWh for 30 minutes. The inverter also needs to deliver at least 50 MW to the intake during that period.</p>
            <p>This calculation holds the shortfall constant. Model the first seconds after a trip, generator ramp, black start, battery recharge, and repeat outages separately. Plan for a sustained source or load reduction before the battery is depleted.</p>
            <p>Before using the result for procurement, have the engineer check reserves, fuel delivery, switching, common equipment, and load pickup.</p>
            <div className="power-calc-links">
              <Link to={POWER_SCHEDULE_PATH}>Check when each phase needs power ↗</Link>
              <Link to={GUIDE}>Read the behind-the-meter power guide ↗</Link>
              <a href={DOE_GUIDE}>DOE data center design guide ↗</a>
              <a href={DOE_MICROGRIDS}>DOE guidance on grid-connected and islanded operation ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
