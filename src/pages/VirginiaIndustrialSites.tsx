import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, SITE_URL, breadcrumbSchema } from '../components/Seo'
import {
  VIRGINIA_SITES_PATH as path, VIRGINIA_SITES_DESCRIPTION as description, VIRGINIA_SITES_TITLE as title,
  VEDP_DIRECTORY, VEDP_SITE_LAYER, hasVirginiaAcreageConflict, screenVirginiaSites, vedpListingUrl,
  virginiaSitesSnapshot as snapshot, type VirginiaSite,
} from '../data/virginiaIndustrialSites'
import '../styles/invariant-brand.css'
import './VirginiaIndustrialSites.css'

const url = SITE_URL + path
const pageSize = 12
const acres = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 })
const observedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })
const observedTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })
const dateText = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : observedDate.format(date)
}

function AcreageTable({ sites }: { sites: readonly VirginiaSite[] }) {
  return (
    <table className="virginia-sites-table" role="table">
      <caption className="sr-only">Virginia Economic Development Partnership site listings and reported acreage</caption>
      <thead>
        <tr>
          <th scope="col">Listing</th>
          <th scope="col">Gross acres</th>
          <th scope="col">Contiguous acres</th>
          <th scope="col">Construction acres</th>
          <th scope="col">Listed zoning</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {sites.map(site => (
          <tr key={site.recordId} role="row">
            <th scope="row" role="rowheader">
              <a href={vedpListingUrl(site.propertyId)}>{site.name} <span aria-hidden="true">↗</span></a>
              <span className="virginia-sites-locality">{site.locality ?? 'Locality unavailable'}{site.sourceUpdated && <><span aria-hidden="true"> · </span>Updated <time dateTime={site.sourceUpdated}>{dateText(site.sourceUpdated)}</time></>}</span>
              {hasVirginiaAcreageConflict(site) && <span className="virginia-sites-acreage-note">Reported acreage needs review</span>}
            </th>
            <td role="cell" data-label="Gross acres">{site.gross === null ? 'Unavailable' : acres.format(site.gross)}</td>
            <td role="cell" data-label="Contiguous acres">{site.contiguous === null ? 'Unavailable' : acres.format(site.contiguous)}</td>
            <td role="cell" data-label="Construction acres">{site.construction === null ? 'Unavailable' : acres.format(site.construction)}</td>
            <td role="cell" data-label="Listed zoning">{site.zoning ?? 'Unreported'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function VirginiaIndustrialSites() {
  const [ready, setReady] = useState(false)
  const [minimumInput, setMinimumInput] = useState('100')
  const [filter, setFilter] = useState('')
  const [visible, setVisible] = useState(pageSize)
  const [live, setLive] = useState<{ sites: VirginiaSite[]; checkedAt: number }>()
  const [requestState, setRequestState] = useState<'idle' | 'loading' | 'error'>('idle')
  const request = useRef<AbortController | null>(null)
  useEffect(() => {
    setReady(true)
    return () => {
      request.current?.abort()
      request.current = null
    }
  }, [])

  const minimum = Number(minimumInput)
  const validMinimum = minimumInput.trim() !== '' && Number.isFinite(minimum) && minimum > 0
  const snapshotHundred = snapshot.screens.find(preset => preset.minimum === 100)!
  const screen = validMinimum ? screenVirginiaSites(live?.sites ?? snapshot.examples, minimum) : null
  const search = filter.trim().toLowerCase()
  const matches = (screen?.matches ?? [])
    .filter(site => `${site.name} ${site.locality ?? ''}`.toLowerCase().includes(search))
    .sort((a, b) => (b.contiguous ?? 0) - (a.contiguous ?? 0) || a.name.localeCompare(b.name))

  async function updateListings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validMinimum || request.current) return
    const controller = new AbortController()
    request.current = controller
    const timer = setTimeout(() => controller.abort(), 15000)
    setRequestState('loading')
    try {
      const response = await fetch('/api/virginia-industrial-sites', { signal: controller.signal })
      if (!response.ok) throw new Error('The public directory is unavailable.')
      const { sites, checkedAt } = await response.json()
      if (!Array.isArray(sites) || !Number.isFinite(checkedAt)) throw new Error('The public directory returned an invalid result.')
      if (request.current !== controller) return
      setLive({ sites, checkedAt })
      setVisible(pageSize)
      setRequestState('idle')
    } catch {
      if (request.current === controller) setRequestState('error')
    } finally {
      clearTimeout(timer)
      if (request.current === controller) request.current = null
    }
  }

  function changeMinimum(value: string) {
    setMinimumInput(value)
    setVisible(pageSize)
  }

  return (
    <>
      <Seo title={title} description={description} canonical={url} markdown={`${path}.md`}
        jsonLd={[ORG_SCHEMA, breadcrumbSchema([
          { name: 'Invariant', url: SITE_URL }, { name: 'Resources', url: SITE_URL + '/resources' }, { name: title, url },
        ]), {
          '@context': 'https://schema.org', '@type': 'WebApplication', '@id': url + '#app',
          name: title, description, url, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, publisher: { '@id': SITE_URL + '/#organization' },
        }]} />
      <article className="virginia-sites">
        <div className="virginia-sites-inner">
          <header className="virginia-sites-intro">
            <Link to="/resources">Resources</Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          <section className="virginia-sites-screen" aria-labelledby="virginia-sites-screen-title">
            <div className="virginia-sites-screen-heading">
              <div>
                <h2 id="virginia-sites-screen-title">Acreage screen</h2>
                <p>Requires all three reported acreage fields to meet your minimum.</p>
              </div>
              <a href={VEDP_DIRECTORY}>Virginia’s sites directory ↗</a>
            </div>

            <form className="virginia-sites-form" onSubmit={updateListings}>
              <label htmlFor="virginia-sites-minimum">Minimum acres</label>
              <div className="virginia-sites-controls">
                <input id="virginia-sites-minimum" type="number" min="0" step="any" inputMode="decimal"
                  value={minimumInput} disabled={!ready} onChange={event => changeMinimum(event.target.value)} />
                <div role="group" aria-label="Common acreage minimums" className="virginia-sites-presets">
                  {snapshot.screens.map(({ minimum: preset }) => (
                    <button type="button" key={preset} disabled={!ready} aria-pressed={minimum === preset}
                      onClick={() => changeMinimum(String(preset))}>{preset} acres</button>
                  ))}
                </div>
                <button type="submit" disabled={!ready || !validMinimum || requestState === 'loading'} className="virginia-sites-primary">
                  {requestState === 'loading' ? 'Checking listings…' : 'Check current listings'}
                </button>
              </div>
            </form>
            <div role="status" className="virginia-sites-status">
              {requestState === 'loading' ? 'Reading listings marked for sale in the Virginia Economic Development Partnership directory.' :
                requestState === 'error' ? 'The live directory is unavailable. You can still open the state directory.' : null}
              {' '}
              {live ? `Last checked ${observedTime.format(live.checkedAt)} UTC. ${acres.format(live.sites.length)} listing records marked for sale.` :
                `Snapshot checked ${dateText(snapshot.checkedAt)} UTC. ${acres.format(snapshot.saleListings)} listing records marked for sale.`}
            </div>
            <div className="virginia-sites-results">
              {live && screen ? (
                <dl className="virginia-sites-totals">
                  <div><dt>Total acres meet minimum</dt><dd>{acres.format(screen.gross)}</dd></div>
                  <div><dt>Also meet contiguous minimum</dt><dd>{acres.format(screen.contiguous)}</dd></div>
                  <div><dt>Also meet construction minimum</dt><dd>{acres.format(screen.construction)}</dd></div>
                </dl>
              ) : (
                <dl className="virginia-sites-totals">
                  {snapshot.screens.map(preset => (
                    <div key={preset.minimum}><dt>{preset.minimum} acres or more in all three fields</dt><dd>{acres.format(preset.construction)}</dd></div>
                  ))}
                </dl>
              )}
            </div>
          </section>

          <section className="virginia-sites-list" aria-labelledby="virginia-sites-list-heading">
            <div className="virginia-sites-screen-heading">
              <div>
                <h2 id="virginia-sites-list-heading">{live ? 'Matching listings' : 'Example listings from the snapshot'}</h2>
                <p>{validMinimum ? `${acres.format(minimum)} acres or more in all three reported fields. Confirm availability, zoning, and boundaries with the listing contact.` : 'Enter a positive acreage minimum.'}</p>
              </div>
              {live && <label className="virginia-sites-locality-search">
                <span>Find a site or locality</span>
                <input type="search" value={filter} onChange={event => {
                  setFilter(event.target.value)
                  setVisible(pageSize)
                }} />
              </label>}
            </div>
            {matches.length ? (
              <>
                <AcreageTable sites={matches.slice(0, visible)} />
                {matches.length > visible && <button type="button" className="virginia-sites-more"
                  onClick={() => setVisible(count => count + pageSize)}>Show more listings</button>}
              </>
            ) : validMinimum && (
              <p className="virginia-sites-empty">{live ? 'No listings match these filters.' : 'Check current listings for this acreage minimum.'}</p>
            )}
            {live && validMinimum && <p className="virginia-sites-list-count" role="status">Showing {Math.min(matches.length, visible)} of {acres.format(matches.length)} matching listings.</p>}
          </section>

          <section className="virginia-sites-method" aria-labelledby="virginia-sites-method-heading">
            <h2 id="virginia-sites-method-heading">What the acreage numbers mean</h2>
            <p>For the 100-acre snapshot, {snapshotHundred.gross} records cleared the gross acreage requirement. Requiring a contiguous block of at least 100 acres reduced that to {snapshotHundred.contiguous}. Requiring at least 100 acres reported suitable for construction left {snapshotHundred.construction} listings.</p>
            <p>The three fields describe different parts of the listing. We flag records for review when a reported acreage exceeds the stated gross acreage. Ask for a boundary covering the land on offer and a plan showing a single connected area large enough for the building, circulation, and utility routes. Verify your use against the local zoning and any required approvals. The listing’s sale flag comes from the state directory. Ask the listing contact for current terms and confirm utility capacity with each provider.</p>
            <div className="virginia-sites-links">
              <a href={VEDP_SITE_LAYER}>Available Sites field definitions ↗</a>
              <a href={snapshot.sourceQuery}>Replay the state source query ↗</a>
              <Link to="/blog/industrial-land-for-sale-acreage-zoning">How to screen industrial land ↗</Link>
              <Link to="/blog/manufacturing-site-selection-100-buildable-acres">Verify utility and rail evidence ↗</Link>
              <Link to="/contact?request=site-selection">Talk to us about a site ↗</Link>
            </div>
          </section>
        </div>
      </article>
    </>
  )
}
