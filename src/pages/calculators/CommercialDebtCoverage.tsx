import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  DEBT_COVERAGE_DESCRIPTION as description,
  DEBT_COVERAGE_EXAMPLE,
  DEBT_COVERAGE_FIELDS,
  DEBT_COVERAGE_PATH as path,
  DEBT_COVERAGE_TITLE as title,
  calculateDebtCoverage,
  type DebtCoverageField,
} from '../../data/commercialDebtCoverage'
import '../../styles/invariant-brand.css'
import './DataCenterPowerCapacity.css'
import './CommercialDebtCoverage.css'

const url = SITE_URL + path
const handbook = 'https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf#page=47'
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const ratio = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })
const percent = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 3 })
const ratioResult = (value: number) => `${ratio.format(value)}×`
const yieldResult = (value: number) => `${percent.format(value)}%`

export default function CommercialDebtCoverage() {
  const [inputs, setInputs] = useState(DEBT_COVERAGE_EXAMPLE)
  const [ready, setReady] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  useEffect(() => setReady(true), [])
  const result = calculateDebtCoverage(inputs)

  function amountInput(field: DebtCoverageField, note: string) {
    const id = `debt-coverage-${field}`
    const { label, unit, min } = DEBT_COVERAGE_FIELDS[field]
    return (
      <div className="power-calc-field">
        <label htmlFor={id}>{label}</label>
        <div className="power-calc-number">
          <input id={id} type="number" inputMode="decimal" min={min} step="any" disabled={!ready}
            value={inputs[field]} aria-invalid={result.field === field || undefined}
            aria-describedby={`${id}-unit ${id}-note`}
            onChange={event => {
              setCopyStatus('')
              setInputs(previous => ({ ...previous, [field]: event.target.value }))
            }} />
          <span id={`${id}-unit`}>{unit}</span>
        </div>
        <small id={`${id}-note`}>{note}</small>
      </div>
    )
  }

  async function copyResult() {
    if (result.error !== undefined) return
    const text = [
      title,
      `Annual net operating income ${money.format(Number(inputs.noi))}`,
      `Loan principal ${money.format(Number(inputs.loan))}`,
      `Annual debt service ${money.format(result.base.annualService)}`,
      `DSCR ${ratioResult(result.base.dscr)} against ${ratioResult(Number(inputs.dscrTarget))}`,
      `Debt yield ${yieldResult(result.debtYield)} against ${yieldResult(Number(inputs.yieldTarget))}`,
      `Minimum annual NOI for both targets ${money.format(result.base.minimumIncome)}`,
      ...(result.comparison ? [
        `Second annual debt service ${money.format(result.comparison.annualService)}`,
        `Second schedule DSCR ${ratioResult(result.comparison.dscr)}`,
        `Second schedule minimum annual NOI for both targets ${money.format(result.comparison.minimumIncome)}`,
      ] : []),
      url,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Clipboard unavailable. Select and copy the results.')
    }
  }

  const threshold = (meets: boolean) => meets ? 'Meets the entered target' : 'Below the entered target'

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
      <article className="power-calc debt-coverage">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
            <a className="debt-coverage-jump" href="#debt-coverage-results">See results <span aria-hidden="true">↓</span></a>
          </header>
          <div className="power-calc-grid">
            <div className="power-calc-inputs">
              <div className="debt-coverage-heading">
                <h2>Loan inputs</h2>
                <button type="button" disabled={!ready} onClick={() => {
                  setInputs(DEBT_COVERAGE_EXAMPLE)
                  setCopyStatus('')
                }}>Reset example</button>
              </div>
              <p>Use annual amounts for the same set of properties. The starting figures are illustrative.</p>
              <noscript><p>Enable JavaScript to edit the example inputs.</p></noscript>
              <div className="power-calc-fields">
                {amountInput('noi', 'Use reported or lender-adjusted income before debt service.')}
                {amountInput('loan', 'Use proposed principal or a dated loan balance.')}
                {amountInput('service', 'Enter total principal and interest due under the payment schedule being evaluated.')}
                {amountInput('secondService', 'Optional. Enter a different payment schedule for the same income and principal.')}
              </div>
              <fieldset className="debt-coverage-targets">
                <legend>Underwriting targets</legend>
                {amountInput('dscrTarget', 'Use the lender’s minimum ratio.')}
                {amountInput('yieldTarget', 'Enter percentage points, such as 9 for 9%.')}
              </fieldset>
            </div>
            <section className="power-calc-result" id="debt-coverage-results" aria-labelledby="debt-coverage-result-heading" tabIndex={-1}>
              <h2 id="debt-coverage-result-heading">Coverage results</h2>
              <div aria-live="polite" aria-atomic="true">
                {result.error !== undefined ? <p className="power-calc-message">{result.error}</p> : (
                  <>
                    <dl className="debt-coverage-metrics">
                      <div>
                        <dt>Debt-service coverage</dt>
                        <dd>
                          <strong>{ratioResult(result.base.dscr)}</strong>
                          <span>{threshold(result.base.meetsDscr)}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>Debt yield</dt>
                        <dd>
                          <strong>{yieldResult(result.debtYield)}</strong>
                          <span>{threshold(result.meetsYield)}</span>
                        </dd>
                      </div>
                    </dl>
                    <dl className="power-calc-margins">
                      <div><dt>Minimum annual NOI for both targets</dt><dd>{money.format(result.base.minimumIncome)}</dd></div>
                      <div><dt>Annual NOI shortfall</dt><dd>{money.format(result.base.incomeShortfall)}</dd></div>
                      <div><dt>Annual debt service supported by DSCR</dt><dd>{money.format(result.serviceLimit)}</dd></div>
                      <div><dt>Loan principal supported by debt yield</dt><dd>{money.format(result.loanLimitByYield)}</dd></div>
                    </dl>
                    {result.comparison && (
                      <>
                        <h3>Second payment schedule</h3>
                        <p className="power-calc-result-label">Debt yield stays at {yieldResult(result.debtYield)} with the same income and principal.</p>
                        <dl className="power-calc-margins">
                          <div><dt>Debt-service coverage</dt><dd>{ratioResult(result.comparison.dscr)}</dd></div>
                          <div><dt>Minimum annual NOI for both targets</dt><dd>{money.format(result.comparison.minimumIncome)}</dd></div>
                          <div><dt>Annual NOI shortfall</dt><dd>{money.format(result.comparison.incomeShortfall)}</dd></div>
                        </dl>
                      </>
                    )}
                    <p className="power-calc-result-label debt-coverage-result-footnote">Target checks use unrounded values. Each supported amount applies to its named test.</p>
                  </>
                )}
              </div>
              <div className="power-calc-copy">
                <button type="button" disabled={!ready || result.error !== undefined} onClick={copyResult}>Copy results</button>
                <span role="status">{copyStatus}</span>
              </div>
            </section>
          </div>
          <section className="power-calc-method" aria-labelledby="debt-coverage-method-heading">
            <h2 id="debt-coverage-method-heading">How to calculate DSCR and debt yield</h2>
            <p>Divide annual net operating income (NOI) by annual debt service for the debt-service coverage ratio (DSCR). Divide annual NOI by loan principal and express the result as a percentage for debt yield.</p>
            <p>To find the income needed for both tests, multiply annual debt service by the minimum DSCR and loan principal by the minimum debt yield as a decimal. Use the higher of the two income requirements.</p>
            <h3>What happens when the interest-only period ends?</h3>
            <p>In this illustrative case, $600,000 of annual NOI on a $6 million loan yields 10.0%. At $420,000 in annual interest-only payments, DSCR is about 1.429×. At $540,000 in annual payments including principal, DSCR falls to about 1.111×. Debt yield stays at 10.0%. At a 1.25× DSCR target and a 9% debt-yield target, the second schedule needs $675,000 of annual NOI, $75,000 more than the property earns in this example.</p>
            <h3>Which loan and income records should go together?</h3>
            <p>Record the financial period and payment basis. For a trailing review, use the applicable reported income and payments. For underwriting, use the lender’s income adjustments and annual payment assumptions. Match loans and property financials at the same collateral scope, especially when several buildings secure a single loan or a filing reports separate notes.</p>
            <div className="power-calc-links">
              <a href={handbook}>OCC handbook on debt coverage and yield ↗</a>
              <Link to="/blog/cmbs-dscr-noi-by-property#compare-noi-and-ncf">Compare filed NOI and net cash flow on the same loan ↗</Link>
              <Link to="/calculators/commercial-refinance-gap">Calculate the cash needed to refinance ↗</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
