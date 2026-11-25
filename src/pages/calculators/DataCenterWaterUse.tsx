import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  WATER_USE_DESCRIPTION as description, WATER_USE_EXAMPLE, WATER_USE_PATH as path,
  WATER_USE_TITLE as title, calculateWaterUse, type WaterUseInputs,
} from '../../data/dataCenterWaterUse'
import './DataCenterPowerCapacity.css'
import './DataCenterWaterUse.css'

const url = SITE_URL + path
const permitGuide = '/blog/data-center-water-stormwater-permits'
const utilityGuide = '/blog/water-sewer-data-apis-site-selection'
const doe = 'https://www.energy.gov/cmei/femp/cooling-water-efficiency-opportunities-federal-data-centers'
const usgs = 'https://water.usgs.gov/water-basics_glossary.html'
const pittsburgBudget = '/blog/data-center-water-stormwater-permits#reclaimed-water-for-cooling'
const volume = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const rate = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 })
const daily = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

function format(value: number, formatter: Intl.NumberFormat, minimum: number) {
  return value > 0 && value < minimum ? `<${minimum}` : formatter.format(value)
}

export default function DataCenterWaterUse() {
  const [inputs, setInputs] = useState(WATER_USE_EXAMPLE)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const estimate = inputs.mode === 'estimate'
  const usesLoad = inputs.energyBasis === 'load'
  const result = calculateWaterUse(inputs)

  function setInput<Key extends keyof WaterUseInputs>(name: Key, value: WaterUseInputs[Key]) {
    setInputs(previous => ({ ...previous, [name]: value }))
  }

  function numberInput(name: 'averageMw' | 'annualGwh' | 'wue' | 'annualGallonsMillion', label: string, unit: string, note: string) {
    const id = `water-use-${name}`
    return (
      <div className="power-calc-field" key={name}>
        <label htmlFor={id}>{label}</label>
        <div className="power-calc-number">
          <input id={id} type="number" inputMode="decimal" min="0" step="any" disabled={!ready}
            value={inputs[name]} aria-describedby={`${id}-unit ${id}-note`}
            onChange={event => setInput(name, event.target.value)} />
          <span id={`${id}-unit`}>{unit}</span>
        </div>
        <small id={`${id}-note`}>{note}</small>
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
      <article className="power-calc water-use-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <div className="power-calc-grid">
            <div className="power-calc-inputs">
              <div className="water-use-input-heading">
                <h2>Site figures</h2>
                <button type="button" disabled={!ready} onClick={() => setInputs(WATER_USE_EXAMPLE)}>Reset example</button>
              </div>
              <p>Use IT energy and water figures for the same site and reporting year.</p>
              <noscript><p>Enable JavaScript to change the example inputs.</p></noscript>
              <div className="power-calc-fields">
                <div className="power-calc-field">
                  <label htmlFor="water-use-mode">Calculation</label>
                  <select id="water-use-mode" value={inputs.mode} disabled={!ready}
                    onChange={event => setInput('mode', event.target.value === 'derive' ? 'derive' : 'estimate')}>
                    <option value="estimate">Estimate annual water use</option>
                    <option value="derive">Calculate site WUE</option>
                  </select>
                </div>
                <div className="water-use-selects">
                  <div className="power-calc-field">
                    <label htmlFor="water-use-energy">IT energy input</label>
                    <select id="water-use-energy" value={inputs.energyBasis} disabled={!ready}
                      onChange={event => setInput('energyBasis', event.target.value === 'metered' ? 'metered' : 'load')}>
                      <option value="load">Average load</option>
                      <option value="metered">Annual energy</option>
                    </select>
                  </div>
                  <div className="power-calc-field">
                    <label htmlFor="water-use-days">Year length</label>
                    <select id="water-use-days" value={inputs.days} disabled={!ready}
                      onChange={event => setInput('days', event.target.value === '366' ? '366' : '365')}>
                      <option value="365">365 days</option>
                      <option value="366">366 days</option>
                    </select>
                  </div>
                </div>
                {usesLoad
                  ? numberInput('averageMw', 'Average IT load', 'MW', 'Use the average over the full year, including periods of low utilization.')
                  : numberInput('annualGwh', 'Annual IT energy', 'GWh', 'Use the energy drawn by IT equipment over the full reporting year.')}
                {estimate
                  ? numberInput('wue', 'Site water usage effectiveness', 'L/kWh', 'Use the site-based design or measured WUE. The example uses 0.6.')
                  : numberInput('annualGallonsMillion', 'Annual on-site water use', 'million US gal', 'Use the water volume for your chosen reporting basis and the same IT metering period.')}
              </div>
            </div>
            <section className="power-calc-result" aria-labelledby="water-use-result">
              <h2 id="water-use-result">{estimate ? 'Estimated annual water use' : 'Calculated site WUE'}</h2>
              <div aria-live="polite" aria-atomic="true">
                {result.error !== undefined ? <p className="power-calc-message">{result.error}</p> : (
                  <>
                    <p className="power-calc-demand"><strong>{estimate
                      ? format(result.annualGallonsMillion, volume, 0.01)
                      : format(result.wue, rate, 0.0001)}</strong> {estimate ? 'million US gal' : 'L/kWh'}</p>
                    <dl className="power-calc-margins">
                      <div><dt>{estimate ? 'Annual on-site water, liters' : 'Annual on-site water'}</dt><dd>{estimate
                        ? `${format(result.annualLitersMillion, volume, 0.01)} million L`
                        : `${format(result.annualGallonsMillion, volume, 0.01)} million US gal`}</dd></div>
                      <div><dt>Average daily water use</dt><dd>{format(result.dailyGallons, daily, 0.1)} US gal/day</dd></div>
                      <div><dt>Annual IT energy</dt><dd>{format(result.annualGwh, volume, 0.01)} GWh</dd></div>
                    </dl>
                    <p className="power-calc-result-label">Use the cooling design’s maximum-day and peak-hour flows to size service.</p>
                  </>
                )}
              </div>
            </section>
          </div>
          <section className="power-calc-method" aria-labelledby="water-use-method">
            <h2 id="water-use-method">How to calculate data center water use</h2>
            <p>Multiply annual IT equipment energy in kilowatt-hours by site WUE in liters per kilowatt-hour. Multiply average IT megawatts by the hours in the reporting year and by 1,000 to get kilowatt-hours. To calculate WUE from your records, divide on-site water in liters by IT kilowatt-hours for the same period. One US gallon is about 3.785412 liters.</p>
            <h3>How much water does a 100 MW data center use?</h3>
            <p>At 100 MW of average IT load and a site WUE of 0.6 liters per kilowatt-hour, a 365-day year uses 876 GWh of IT energy and about 138.85 million US gallons of on-site water. That averages about 380,408 gallons per day. The 100 MW in this example is average IT load. If your figure is the facility’s utility service or rated capacity, get the expected IT energy from the design or meters first.</p>
            <h3>What should you ask the water utility for?</h3>
            <p>Break demand out by source and phase, then ask what the utility can deliver during the peak hour and maximum day. Bring the cooling design’s pressure, storage and backup-supply requirements. Track water delivered, water consumed and water discharged on separate lines. A site WUE based on consumption estimates consumption. Water supplied or withdrawn can also include water discharged after use.</p>
            <p>In its October 2025 study for the proposed Pittsburg Data Hub, California Energy Commission staff estimated 58,407 gallons per day of average recycled-water demand. Staff listed domestic water and sewer demand separately. The filing is an example of a planning water balance. Use your own design and the provider’s written allocation and discharge conditions for a site decision.</p>
            <div className="power-calc-links">
              <Link to={permitGuide}>Review water and stormwater permits ↗</Link>
              <Link to={pittsburgBudget}>Read the Pittsburg water budget ↗</Link>
              <Link to={utilityGuide}>Verify water service at the parcel ↗</Link>
              <a href={doe}>See the Department of Energy WUE formula ↗</a>
              <a href={usgs}>Check USGS water use definitions ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
