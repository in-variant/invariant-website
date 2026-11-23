import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import { DEFAULT_POWER_CASE, calculatePowerCapacity, type PowerCase } from '../../data/dataCenterPowerCapacity'
import './DataCenterPowerCapacity.css'

const URL = `${SITE_URL}/calculators/data-center-power-capacity`
const TITLE = 'Data center power capacity calculator'
const DESCRIPTION = 'Calculate total facility MW from your IT load. Compare the demand with net on-site power in normal conditions and after a generator outage.'
const GUIDE = '/blog/behind-the-meter-power-for-data-centers'
const DOE_GUIDE = 'https://www.energy.gov/sites/default/files/2024-07/best-practice-guide-data-center-design_0.pdf'
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 })

const fields: { id: keyof PowerCase; label: string; unit: string; min: number; hint?: string }[] = [
  { id: 'it', label: 'IT load', unit: 'MW', min: 0.01, hint: 'Servers, storage, and networking.' },
  { id: 'multiplier', label: 'Facility-to-IT power ratio', unit: '×', min: 1, hint: 'Use the ratio for the design condition.' },
  { id: 'normal', label: 'Net power in normal conditions', unit: 'MW', min: 0 },
  { id: 'outage', label: 'Net power during an outage', unit: 'MW', min: 0 },
]

function marginText(margin: number) {
  if (margin === 0) return '0 MW margin'
  return `${format.format(Math.abs(margin))} MW ${margin < 0 ? 'short' : 'spare'}`
}

export default function DataCenterPowerCapacity() {
  const [inputs, setInputs] = useState<PowerCase>(DEFAULT_POWER_CASE)
  const [copyStatus, setCopyStatus] = useState('')
  const capacity = calculatePowerCapacity(inputs)

  async function copyCalculation() {
    if (!capacity) return
    const summary = [
      TITLE,
      `${inputs.it} MW IT × ${inputs.multiplier} facility-to-IT ratio = ${format.format(capacity.facilityMw)} MW facility demand`,
      `Normal: ${inputs.normal} MW net, ${marginText(capacity.normalMarginMw)}`,
      `Outage: ${inputs.outage} MW net, ${marginText(capacity.outageMarginMw)}`,
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
      <Seo title={TITLE} description={DESCRIPTION} canonical={URL} ogImage={`${SITE_URL}/og-image.png`} jsonLd={[
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
              <p>Enter both power figures at the facility intake, under the conditions for each case.</p>
              <div className="power-calc-fields">
                {fields.map(field => (
                  <div className="power-calc-field" key={field.id}>
                    <label htmlFor={`power-calc-${field.id}`}>{field.label}{field.unit === 'MW' && <span className="sr-only"> (MW)</span>}</label>
                    <div className="power-calc-number">
                      <input
                        id={`power-calc-${field.id}`}
                        type="number" inputMode="decimal" min={field.min} step=".01"
                        value={inputs[field.id]}
                        aria-describedby={field.hint ? `power-calc-hint-${field.id}` : undefined}
                        onChange={event => {
                          setInputs({ ...inputs, [field.id]: event.target.value })
                          setCopyStatus('')
                        }}
                      />
                      <span aria-hidden="true">{field.unit}</span>
                    </div>
                    {field.hint && <small id={`power-calc-hint-${field.id}`}>{field.hint}</small>}
                  </div>
                ))}
              </div>
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
                      <div><dt>Outage case</dt><dd data-short={capacity.outageMarginMw < 0}>{marginText(capacity.outageMarginMw)}</dd></div>
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
          <section className="power-calc-method" aria-labelledby="power-calc-method">
            <h2 id="power-calc-method">How to read the result</h2>
            <p>Multiply IT load by the facility-to-IT power ratio. Subtract that demand from the net power available in each case. A shortfall is the extra net power needed at the facility intake for that case.</p>
            <p>In the example above, 50 MW of IT load at a ratio of 1.25 needs 62.5 MW at the intake. A plant that delivers 70 MW normally has 7.5 MW to spare. With 55 MW available after the largest unit is lost, the facility is 7.5 MW short.</p>
            <p>For sizing, use the engineer’s demand schedule or a ratio calculated for the design condition. Annual power usage effectiveness (PUE) measures energy over a year. Obtain net plant output after site derating, plant auxiliary loads, and losses to the intake. Include grid imports only where the utility can supply them in the scenario under review.</p>
            <p>Before using the result for procurement, have the engineer check reserves, fuel delivery, switching, common equipment, and load pickup.</p>
            <div className="power-calc-links">
              <Link to={GUIDE}>Read the behind-the-meter power guide ↗</Link>
              <a href={DOE_GUIDE}>DOE data center design guide ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
