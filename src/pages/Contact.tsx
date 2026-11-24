import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import posthog from '../posthog'
import { Seo, SITE_URL, ORG_SCHEMA, breadcrumbSchema } from '../components/Seo'
import { DEFAULT_EMAIL, SITES_EMAIL } from '../data/siteContact'
import './Contact.css'

const siteSearchSubject = 'Data center site selection request'
const industries = [
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'nuclear', label: 'Nuclear' },
  { value: 'data-centers', label: 'Data centers' },
  { value: 'oil-and-gas', label: 'Oil & gas' },
  { value: 'other', label: 'Other' },
]

function ContactCorners() {
  return <span className="contact-corners" aria-hidden="true"><i /><i /><i /><i /></span>
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const requestedIndustry = searchParams.get('industry') || ''
  const siteSearch = searchParams.get('request') === 'site-selection'
  const contactEmail = siteSearch ? SITES_EMAIL : DEFAULT_EMAIL
  const [industry, setIndustry] = useState('')
  const [draft, setDraft] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const [requestError, setRequestError] = useState('')
  const draftField = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIndustry(industries.some(item => item.value === requestedIndustry) ? requestedIndustry : '')
    setDraft('')
    setCopyMessage('')
    setRequestError('')
  }, [requestedIndustry, siteSearch])

  useEffect(() => {
    if (draft) draftField.current?.focus()
  }, [draft])

  const clearDraft = () => {
    setDraft('')
    setCopyMessage('')
    setRequestError('')
  }

  const openEmail = (subject: string, body: string) => {
    posthog.capture('early_access_contact_initiated', {
      source: siteSearch ? 'site_selection_request' : 'contact',
      industry: siteSearch ? 'data-centers' : industry || undefined,
    })
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopyMessage('Request copied. Paste it into your email to Invariant.')
    } catch {
      draftField.current?.focus()
      draftField.current?.select()
      setCopyMessage('Copy the selected text to use it in your email.')
    }
  }

  const prepareMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const name = String(values.get('name') || '').trim()
    const email = String(values.get('email') || '').trim()
    const company = String(values.get('company') || '').trim()
    const message = String(values.get('message') || '').trim()
    const sector = industries.find(item => item.value === industry)?.label
    const market = String(values.get('market') || '').trim()
    const phases = String(values.get('phases') || '').trim()
    if (siteSearch && (!market || !phases)) {
      setRequestError('Enter your target markets and expected power requirements.')
      return
    }
    const project = siteSearch
      ? ['I’d like to request a data center site shortlist.', '', `Target markets: ${market}`, `Facility MW and service dates: ${phases}`, ...(message ? [`Other requirements: ${message}`] : [])]
      : [message || 'I’d like to talk about how Invariant can help with our regulatory work.']
    const body = [
      'Hi Parthiv and Pranav,',
      '',
      ...project,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      ...(company ? [`Company: ${company}`] : []),
      ...(!siteSearch && sector ? [`Industry: ${sector}`] : []),
    ].join('\n')

    if (siteSearch) {
      setDraft(body)
      return
    }
    openEmail('Design Partner Inquiry', body)
  }

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <Seo title="Talk to an expert | Invariant" description="Tell us what you are building and the approvals ahead. Talk with Invariant about autonomous agents for the physical economy." canonical={`${SITE_URL}/contact`} jsonLd={[ORG_SCHEMA, breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Contact', url: `${SITE_URL}/contact` }])]} />
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="contact-eyebrow">Start a conversation</p>
          <h1 id="contact-title">{siteSearch ? 'Request a data center site shortlist' : <>Tell us what<br />you’re building.</>}</h1>
          <p className="contact-description">{siteSearch ? 'Tell us where you’re looking, how much power you need and when each phase needs service.' : 'Bring us the mission, the requirements, and what’s holding you up. We’ll talk through where Invariant can help.'}</p>
          {!siteSearch && <div className="contact-visual" aria-hidden="true">
            <span className="contact-visual-rule" />
            <img src="/figma/imgImage65.png" width="1536" height="1024" alt="" />
            <span className="contact-visual-caption">From mission to approval.</span>
          </div>}
          <div className="contact-direct">
            <span className="contact-eyebrow">Prefer a direct line?</span>
            <a href={`mailto:${contactEmail}`} onClick={() => posthog.capture('early_access_contact_initiated', { source: 'contact_direct' })}>{contactEmail}<span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="contact-form-panel">
          <ContactCorners />
          <div className="contact-form-heading">
            <p className="contact-eyebrow">{siteSearch ? 'Site selection' : 'Your mission'}</p>
            <h2>{siteSearch ? 'Your site requirements' : 'Talk to the team.'}</h2>
            <p>{siteSearch ? 'Include rough targets if the project is still taking shape.' : 'A little context is a good place to start.'}</p>
          </div>
          <form className={siteSearch ? 'contact-form ph-no-capture' : 'contact-form'} onSubmit={prepareMessage} onChange={siteSearch ? clearDraft : undefined}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label>
                <input id="contact-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={120} />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Work email <span aria-hidden="true">*</span></label>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} />
              </div>
            </div>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-company">Company <small>Optional</small></label>
                <input id="contact-company" name="company" autoComplete="organization" placeholder="Company name" maxLength={180} />
              </div>
              {siteSearch ? <div className="contact-field">
                <label htmlFor="contact-market">Target states or markets <span aria-hidden="true">*</span></label>
                <input id="contact-market" name="market" placeholder="Ohio, Virginia or nationwide" required maxLength={160} />
              </div> : <div className="contact-field">
                <label htmlFor="contact-industry">Industry <small>Optional</small></label>
                <div className="contact-select">
                  <select id="contact-industry" name="industry" value={industry} onChange={event => setIndustry(event.target.value)}>
                    <option value="">Select your industry</option>
                    {industries.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <span aria-hidden="true">⌄</span>
                </div>
              </div>}
            </div>
            {siteSearch && <div className="contact-field">
              <label htmlFor="contact-phases">Facility MW and required service dates <span aria-hidden="true">*</span></label>
              <textarea id="contact-phases" name="phases" rows={2} required maxLength={500} placeholder="40 MW at the meter by June 2028, 80 MW total by June 2030" />
            </div>}
            <div className="contact-field">
              <label htmlFor="contact-message">{siteSearch ? 'Other requirements' : 'What are you working on?'} <small>Optional</small></label>
              <textarea id="contact-message" name="message" rows={4} maxLength={1800} placeholder={siteSearch ? 'Buy or lease, usable acreage, reliability, water, fiber or sites under review' : 'Tell us about your program and the regulatory work ahead.'} />
            </div>
            <div className="contact-form-actions">
              <button type="submit" className="contact-submit" aria-describedby="contact-delivery-note"><FigmaScrambleLabel>{siteSearch ? 'Prepare request' : 'Continue in email'}</FigmaScrambleLabel><span aria-hidden="true">↗</span></button>
              <p id="contact-delivery-note">{siteSearch ? 'Preview your request here, then copy it or open an email draft.' : 'Opens a draft in your email app. Review it there, then send.'}</p>
              {requestError && <p role="alert">{requestError}</p>}
            </div>
          </form>
          {siteSearch && draft && <section className="contact-draft ph-no-capture" aria-label="Prepared site request">
            <p>Send to <strong>{contactEmail}</strong> with the subject <strong>{siteSearchSubject}</strong>.</p>
            <div className="contact-field">
              <label htmlFor="contact-draft">Request text</label>
              <textarea id="contact-draft" ref={draftField} readOnly value={draft} rows={8} />
            </div>
            <div className="contact-form-row">
              <button type="button" className="contact-submit" onClick={copyDraft}>Copy request</button>
              <button type="button" className="contact-submit contact-submit--secondary" onClick={() => openEmail(siteSearchSubject, draft)}>Open email draft</button>
            </div>
            <p role="status">{copyMessage}</p>
          </section>}
        </div>
      </div>
    </section>
  )
}
