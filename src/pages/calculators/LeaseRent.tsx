import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../../components/Seo'
import {
  calculateLeaseRent, LEASE_EXAMPLES, LEASE_FIELDS, LEASE_RENT_DESCRIPTION as description,
  LEASE_RENT_PATH as path, LEASE_RENT_TITLE as title, type LeaseInputs,
} from '../../data/leaseRent'
import './DataCenterPowerCapacity.css'
import './LeaseRent.css'

const url = SITE_URL + path
const comparableGuide = '/blog/commercial-real-estate-sales-lease-comps-apis'
const secLease = 'https://www.sec.gov/Archives/edgar/data/791963/000162828026071942/rxr-oppenheimerx32oldsli.htm'
const secMethod = 'https://www.sec.gov/Archives/edgar/data/1581068/000158106821000041/brx-20211101ex992.htm'
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

function LeaseOffer({ name, inputs, ready, update }: {
  name: string
  inputs: LeaseInputs
  ready: boolean
  update: (inputs: LeaseInputs) => void
}) {
  const result = calculateLeaseRent(inputs)
  return (
    <fieldset className="lease-offer">
      <legend>{name}</legend>
      <div className="lease-fields">
        {LEASE_FIELDS.map(({ key, label, min, max, step }) => (
          <label key={key}>
            <span>{label}</span>
            <input type="number" inputMode={step === 1 ? 'numeric' : 'decimal'} min={min} max={max}
              step={step} disabled={!ready} value={inputs[key]}
              onChange={event => update({ ...inputs, [key]: event.target.value })} />
          </label>
        ))}
      </div>
      <div className="lease-output" aria-live="polite" aria-atomic="true">
        {result.error !== undefined ? <p className="lease-error">{result.error}</p> : (
          <dl>
            <div>
              <dt>Average base rent after free months</dt>
              <dd><strong>{usd.format(result.averageBaseRent)}</strong> <span>per RSF/year</span></dd>
            </div>
            <div><dt>After build-out allowance used</dt><dd>{usd.format(result.rentAfterAllowance)} <span>per RSF/year</span></dd></div>
            <div><dt>Starting monthly base rent</dt><dd>{usd.format(result.startingMonthlyRent)}</dd></div>
            <div><dt>Total base rent due</dt><dd>{usd.format(result.totalBaseRent)}</dd></div>
          </dl>
        )}
      </div>
    </fieldset>
  )
}

export default function LeaseRent() {
  const [left, setLeft] = useState(LEASE_EXAMPLES[0])
  const [right, setRight] = useState(LEASE_EXAMPLES[1])
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <>
      <Seo title={title} description={description} canonical={url} markdown={`${path}.md`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL },
          { name: 'Calculators', url: `${SITE_URL}/calculators` },
          { name: title, url },
        ]), {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': `${url}#app`,
          name: title, description, url, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
          publisher: { '@id': `${SITE_URL}/#organization` },
        }]} />
      <article className="power-calc lease-calc">
        <div className="power-calc-inner">
          <header className="power-calc-header">
            <Link to="/calculators">Calculators</Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <section aria-labelledby="compare-lease-offers">
            <div className="lease-compare-heading">
              <h2 id="compare-lease-offers">Compare lease offers</h2>
              <button type="button" disabled={!ready} onClick={() => {
                setLeft(LEASE_EXAMPLES[0])
                setRight(LEASE_EXAMPLES[1])
              }}>Reset examples</button>
            </div>
            <p className="lease-hint">Enter annual base rent in dollars per rentable square foot (RSF). Count the opening free months within the lease term.</p>
            <div className="lease-offers">
              <LeaseOffer name="Offer A" inputs={left} ready={ready} update={setLeft} />
              <LeaseOffer name="Offer B" inputs={right} ready={ready} update={setRight} />
            </div>
          </section>
          <section className="power-calc-method" aria-labelledby="effective-rent-method">
            <h2 id="effective-rent-method">How to calculate net effective rent</h2>
            <p>Add the base rent payable each month, applying annual increases starting in month 13 and zero base rent during the initial free months. Divide the total by the full term in years and by the rentable square feet. The second result credits the one-time build-out allowance you expect to use.</p>
            <p>The examples both cover 10,000 rentable square feet over 60 months. Offer A starts at $48 per RSF per year and averages $46.17 after six free months and annual increases. Offer B starts at $45 and averages $46.28 after two free months and the same increases.</p>
            <p>These are undiscounted base-rent figures. Compare operating expenses, taxes, insurance, utilities, and tenant-paid build-out separately. Use the actual month-by-month schedule for later abatements, stepped rent, and changes in rentable area. Published effective-rent definitions vary in how they handle allowances and other costs.</p>
            <div className="power-calc-links">
              <Link to={comparableGuide}>Compare commercial lease and sale records ↗</Link>
              <a href={secLease}>See a filed office lease ↗</a>
              <a href={secMethod}>See an issuer’s effective-rent definition ↗</a>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
