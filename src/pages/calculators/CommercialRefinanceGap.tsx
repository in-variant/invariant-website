import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  REFINANCE_DESCRIPTION as description, REFINANCE_EXAMPLE, REFINANCE_FIELDS, REFINANCE_PATH as path,
  REFINANCE_TITLE as title, calculateCommercialRefinance, type RefinanceInputs,
} from '../../data/commercialRefinance'
import './DataCenterPowerCapacity.css'
import './CommercialRefinanceGap.css'

const url = SITE_URL + path
const handbook = 'https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf#page=47'
const risk = 'https://www.occ.gov/news-issuances/bulletins/2024/bulletin-2024-29.html'
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function CommercialRefinanceGap() {
  const [inputs, setInputs] = useState(REFINANCE_EXAMPLE)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const result = calculateCommercialRefinance(inputs)

  function setInput<Key extends keyof RefinanceInputs>(key: Key, value: RefinanceInputs[Key]) {
    setInputs(previous => ({ ...previous, [key]: value }))
  }

  function amountInput(key: keyof typeof REFINANCE_FIELDS, note?: string) {
    const id = `refi-${key}`
    const { label, unit, min, max } = REFINANCE_FIELDS[key]
    return (
      <div className="power-calc-field">
        <label htmlFor={id}>{label}</label>
        <div className="power-calc-number">
          <input id={id} type="number" disabled={!ready} value={inputs[key]}
            inputMode={key === 'amortization' ? 'numeric' : 'decimal'} step={key === 'amortization' ? 1 : 'any'}
            min={Number.isFinite(min) ? min : undefined} max={Number.isFinite(max) ? max : undefined}
            aria-describedby={note ? `${id}-unit ${id}-note` : `${id}-unit`}
            onChange={event => setInput(key, event.target.value)} />
          <span id={`${id}-unit`}>{unit}</span>
        </div>
        {note && <small id={`${id}-note`}>{note}</small>}
      </div>
    )
  }

  const cashAfterPayoff = result.error === undefined ? result.cashAfterPayoff : 0
  const cashResult = Math.abs(cashAfterPayoff)
  const fundingLabel = cashResult < 0.005 ? 'Payoff and costs covered'
    : cashAfterPayoff < 0 ? 'Cash needed at closing' : 'Proceeds above payoff and costs'

  return (
    <>
      <Seo title={title} description={description} canonical={url} markdown={`${path}.md`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL }, { name: 'Calculators', url: SITE_URL + '/calculators' }, { name: title, url },
        ]), {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': url + '#app',
          name: title, description, url, applicationCategory: 'FinanceApplication', operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, publisher: { '@id': SITE_URL + '/#organization' },
        }]} />
      <article className="power-calc refinance-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
            <a className="refi-results-link" href="#refinance-results">See results <span aria-hidden="true">↓</span></a>
          </header>
          <div className="power-calc-grid">
            <div className="power-calc-inputs">
              <div className="refi-heading">
                <h2>Refinance assumptions</h2>
                <button type="button" disabled={!ready} onClick={() => setInputs(REFINANCE_EXAMPLE)}>Reset example</button>
              </div>
              <p>Use the same collateral and closing date throughout. The starting values are illustrative.</p>
              <noscript><p>Enable JavaScript to change the example inputs.</p></noscript>
              <fieldset className="refi-input-group">
                <legend>Property and payoff</legend>
                {amountInput('noi', 'Use the lender’s underwritten income before debt service.')}
                {amountInput('value')}
                {amountInput('payoff', 'Use a dated payoff statement. Include applicable exit and prepayment costs here or in closing costs.')}
              </fieldset>
              <fieldset className="refi-input-group">
                <legend>New loan terms and limits</legend>
                <div className="power-calc-field">
                  <label htmlFor="refi-repayment">Payment schedule</label>
                  <select id="refi-repayment" disabled={!ready} value={inputs.repayment}
                    onChange={event => setInput('repayment', event.target.value === 'interestOnly' ? 'interestOnly' : 'amortizing')}>
                    <option value="amortizing">Monthly principal and interest</option>
                    <option value="interestOnly">Interest only</option>
                  </select>
                </div>
                {amountInput('rate', 'Enter the annual rate used to size the loan.')}
                {inputs.repayment === 'amortizing' && amountInput('amortization', 'Use whole years from 1 to 50.')}
                {amountInput('ltv')}
                {amountInput('dscr')}
                {amountInput('yield', 'Enter zero when the lender omits this test.')}
              </fieldset>
              <fieldset className="refi-input-group">
                <legend>Closing costs</legend>
                {amountInput('feeRate')}
                {amountInput('fixedFees')}
              </fieldset>
            </div>
            <section id="refinance-results" className="power-calc-result" aria-labelledby="refi-result" tabIndex={-1}>
              <h2 id="refi-result">Refinance result</h2>
              <div aria-live="polite" aria-atomic="true">
                {result.error !== undefined ? <p className="power-calc-message">{result.error}</p> : (
                  <>
                    <p className="power-calc-result-label">{fundingLabel}</p>
                    <p className="power-calc-demand"><strong>{(cashResult > 0 && cashResult < 1 ? cents : money).format(cashResult)}</strong></p>
                    <p className="power-calc-result-label">The lowest loan limit comes from {result.binding.join(' and ').toLowerCase()}.</p>
                    <dl className="power-calc-margins">
                      <div><dt>Loan amount before costs</dt><dd>{money.format(result.grossLoan)}</dd></div>
                      <div><dt>Annual debt service on that loan</dt><dd>{money.format(result.annualDebtService)}</dd></div>
                      <div><dt>Estimated closing costs</dt><dd>{money.format(result.fees)}</dd></div>
                      <div><dt>Proceeds after closing costs</dt><dd>{money.format(result.netProceeds)}</dd></div>
                    </dl>
                    <h3>Maximum loan by test</h3>
                    <dl className="power-calc-margins">
                      {result.limits.map(({ name, amount }) => (
                        <div key={name}><dt>{name}</dt><dd>{amount === null ? 'Does not apply' : money.format(amount)}</dd></div>
                      ))}
                    </dl>
                    <h3>What would cover payoff and costs?</h3>
                    <dl className="power-calc-margins">
                      <div><dt>Gross loan needed</dt><dd>{money.format(result.grossNeeded)}</dd></div>
                      <div><dt>Minimum annual NOI</dt><dd>{result.noiNeeded === null ? 'Does not apply' : money.format(result.noiNeeded)}</dd></div>
                      <div><dt>Minimum property value</dt><dd>{money.format(result.valueNeeded)}</dd></div>
                    </dl>
                    <p className="power-calc-result-label">Meet the applicable thresholds together at the entered terms. These amounts are estimates for planning a refinance.</p>
                  </>
                )}
              </div>
            </section>
          </div>
          <section className="power-calc-method" aria-labelledby="refi-method">
            <h2 id="refi-method">How to calculate a commercial refinance gap</h2>
            <p>Use the lowest of the three loan amounts. Loan-to-value (LTV) multiplies the property value by the lender’s maximum ratio. Debt-service coverage (DSCR) divides annual net operating income (NOI) by the minimum ratio, then converts the affordable annual payment into a loan. Debt yield divides NOI by the lender’s minimum yield.</p>
            <p>Subtract fees, fixed closing costs and the existing payoff from the estimated new loan. To work backward, divide payoff plus fixed costs by one minus the percentage fee. That gross loan establishes the minimum property value at the given LTV and the higher NOI required by the DSCR and debt-yield tests.</p>
            <h3>How much cash would a $6 million refinance need?</h3>
            <p>In this example, $600,000 of annual NOI and a $9 million value support about $5.66 million of new debt at 7% with a 25-year amortization. Debt-service coverage is the lowest test at 1.25×, ahead of a 65% LTV ceiling and a 10% debt yield floor. With a 1% fee and $25,000 in other costs, about $422,119 of cash is needed to repay $6 million. At 8%, with the same assumptions, cash needed rises to $894,245.</p>
            <h3>Which records go into a lender’s refinance file?</h3>
            <p>Get a closing-date payoff, a current valuation, the lender’s underwriting terms and NOI tied to the same collateral as the loan. Public CMBS balances and property financials have reporting dates and may cover different assets. Enter the payment schedule used for underwriting, including the amortizing payment when a lender sizes on that basis after an interest-only period.</p>
            <div className="power-calc-links">
              <a href={handbook}>OCC handbook on DSCR, debt yield and valuation ↗</a>
              <a href={risk}>OCC refinance risk guidance ↗</a>
              <Link to="/blog/cmbs-dscr-noi-by-property">Trace dated CMBS property financials ↗</Link>
              <Link to="/calculators/dscr-debt-yield">Compare debt coverage across two payment schedules ↗</Link>
              <Link to="/blog/commercial-mortgage-maturity-data-apis">Verify a commercial mortgage maturity ↗</Link>
              <Link to="/blog/commercial-real-estate-data-apis-for-lenders">Check collateral across a portfolio ↗</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
