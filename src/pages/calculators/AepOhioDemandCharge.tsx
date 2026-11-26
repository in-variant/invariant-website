import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  AEP_DEMAND_DESCRIPTION as description, AEP_DEMAND_EXAMPLE, AEP_DEMAND_PATH as path,
  AEP_DEMAND_TITLE as title, calculateAepDemandCharge, type AepDemandInputs,
} from '../../data/aepOhioDemandCharge'
import { SITE_SEARCH_REQUEST_PATH } from '../../data/siteContact'
import './DataCenterPowerCapacity.css'
import './AepOhioDemandCharge.css'

const url = SITE_URL + path
const rateBook = 'https://www.aepohio.com/lib/docs/ratesandtariffs/Ohio/November_2026_Ohio_Power_Tariff_Book.pdf'
const mw = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 })
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function AepOhioDemandCharge() {
  const [inputs, setInputs] = useState(AEP_DEMAND_EXAMPLE)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const ramping = inputs.phase === 'ramp'
  const result = calculateAepDemandCharge(inputs)

  function setInput<Key extends keyof AepDemandInputs>(name: Key, value: AepDemandInputs[Key]) {
    setInputs(previous => ({ ...previous, [name]: value }))
  }

  function demandInput(name: 'contractMw' | 'meteredMw' | 'rampMw' | 'priorBilledMw', label: string, note: string) {
    const id = `aep-demand-${name}`
    return (
      <div className="power-calc-field" key={name}>
        <label htmlFor={id}>{label}</label>
        <div className="power-calc-number">
          <input id={id} type="number" inputMode="decimal" min="0" step="any" disabled={!ready}
            value={inputs[name]} aria-describedby={`${id}-unit ${id}-note`}
            onChange={event => setInput(name, event.target.value)} />
          <span id={`${id}-unit`}>MW</span>
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
      <article className="power-calc aep-demand-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <div className="power-calc-grid">
            <div className="power-calc-inputs">
              <div className="aep-demand-heading">
                <h2>Billing inputs</h2>
                <button type="button" disabled={!ready} onClick={() => setInputs(AEP_DEMAND_EXAMPLE)}>Reset example</button>
              </div>
              <p>Use one energized contract and one billing month.</p>
              <noscript><p>Enable JavaScript to change the example inputs.</p></noscript>
              <div className="power-calc-fields">
                <div className="aep-demand-selects">
                  <div className="power-calc-field">
                    <label htmlFor="aep-demand-phase">Contract phase</label>
                    <select id="aep-demand-phase" value={inputs.phase} disabled={!ready}
                      onChange={event => setInput('phase', event.target.value === 'ramp' ? 'ramp' : 'after')}>
                      <option value="after">After ramp</option>
                      <option value="ramp">During ramp</option>
                    </select>
                  </div>
                  <div className="power-calc-field">
                    <label htmlFor="aep-demand-voltage">Service voltage</label>
                    <select id="aep-demand-voltage" value={inputs.voltage} disabled={!ready}
                      onChange={event => setInput('voltage', event.target.value === 'secondary' ? 'secondary' : 'primary')}>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>
                </div>
                {demandInput('contractMw', 'Contract capacity', 'Use the final MW in the signed service agreement.')}
                {demandInput('meteredMw', 'Metered peak this month', 'Use the demand reading Ohio Power uses for this bill.')}
                {ramping
                  ? demandInput('rampMw', 'Agreed ramp capacity', 'Use the capacity the contract assigns to this billing month.')
                  : demandInput('priorBilledMw', 'Highest prior billed demand', 'Use the greatest billed MW from the preceding 11 months.')}
              </div>
            </div>
            <section className="power-calc-result" aria-labelledby="aep-demand-result">
              <h2 id="aep-demand-result">Monthly billing demand</h2>
              <div aria-live="polite" aria-atomic="true">
                {result.error !== undefined ? <p className="power-calc-message">{result.error}</p> : (
                  <>
                    <p className="power-calc-demand"><strong>{mw.format(result.billedMw)}</strong> MW</p>
                    <dl className="power-calc-margins">
                      <div className="aep-demand-subtotal"><dt>Base distribution and customer subtotal</dt><dd>{dollars.format(result.baseMonthlyCharge)}</dd></div>
                      <div><dt>{ramping ? 'Agreed ramp floor' : 'Contract-tier floor'}</dt><dd>{mw.format(result.minimumMw)} MW</dd></div>
                      {!ramping && <div><dt>Prior-bill floor</dt><dd>{mw.format(result.priorBillFloor)} MW</dd></div>}
                      <div><dt>Distribution at {dollars.format(result.distributionRate)} per kW</dt><dd>{dollars.format(result.distributionCharge)}</dd></div>
                      <div><dt>Monthly customer charge</dt><dd>{dollars.format(result.customerCharge)}</dd></div>
                      <div><dt>Demand charges above the metered peak</dt><dd>{dollars.format(result.additionalCharge)}</dd></div>
                    </dl>
                    <p className="power-calc-result-label">Budget energy, transmission and other riders, applicable reactive demand charges, and taxes separately.</p>
                    {result.aboveContract && <p className="aep-demand-review">The entered peak exceeds contract capacity. Check the agreement’s overage terms.</p>}
                  </>
                )}
              </div>
            </section>
          </div>
          <section className="power-calc-method" aria-labelledby="aep-demand-method">
            <h2 id="aep-demand-method">How AEP Ohio calculates Schedule DCT demand</h2>
            <p>During the ramp, use the greater of the metered peak and 85% of the monthly ramp capacity in the agreement. After the ramp, compare the metered peak with the contract-tier minimum and 85% of the highest monthly billing demand from the preceding 11 months. Multiply the largest demand in kW by the filed distribution rate, then add the monthly customer charge.</p>
            <h3>How is the contract-tier minimum set?</h3>
            <p>From 25,001 through 75,000 kW of contracted capacity, start at 15,000 kW and add 85% of capacity above 25,000 kW. Above 75,000 kW, start at 57,500 kW and add all capacity above 75,000 kW, then cap the contract-tier minimum at 85% of total contracted capacity.</p>
            <h3>What is the charge for a 100 MW primary-voltage contract?</h3>
            <p>With a 65 MW peak after the ramp and a prior billed peak of 100 MW, the lookback gives 85 MW and the contract-tier floor gives 82.5 MW. The bill uses 85 MW. At $8.08 per kW, base distribution costs $686,800. Add the $186.30 customer charge for a base subtotal of $686,986.30.</p>
            <p>During the ramp, a 50 MW agreed monthly capacity and a 35 MW peak produce 42.5 MW of billed demand. The primary-voltage base subtotal is $343,586.30.</p>
            <h3>Which contract and rate should you enter?</h3>
            <p>Use the Ohio Power schedule assigned to the account. This example models one energized New Load contract at primary or secondary service voltage. The rates come from the November 2026 tariff book. Ask Ohio Power how it treats affiliated loads, alternate service voltages, and agreements with service that has yet to energize.</p>
            <div className="power-calc-links">
              <a href={rateBook+'#page=115'}>Read the filed rate sheet ↗</a>
              <a href={rateBook+'#page=116'}>Read the demand floors and lookback ↗</a>
              <Link to="/blog/aep-ohio-data-center-tariff-minimum-demand">See the full Ohio tariff example ↗</Link>
              <a href="https://github.com/in-variant/invariant-website/releases/tag/aep-ohio-dct-replay-v1.0.0">Download the 13-month replay and CSV ↗</a>
              <Link to="/blog/dominion-virginia-gs5-data-center-tariff">Compare the Virginia billing components ↗</Link>
              <Link to={SITE_SEARCH_REQUEST_PATH}>Share your site and power requirements ↗</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
