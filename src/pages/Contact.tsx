import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import posthog from '../posthog'
import { Seo, SITE_URL } from '../components/Seo'
import './Contact.css'

const contactEmail = 'founders@invariant-ai.com'
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
  const [industry, setIndustry] = useState('')

  useEffect(() => {
    setIndustry(industries.some(item => item.value === requestedIndustry) ? requestedIndustry : '')
  }, [requestedIndustry])

  const prepareMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const name = String(values.get('name') || '').trim()
    const email = String(values.get('email') || '').trim()
    const company = String(values.get('company') || '').trim()
    const message = String(values.get('message') || '').trim()
    const sector = industries.find(item => item.value === industry)?.label
    const body = [
      'Hi Parthiv and Pranav,',
      '',
      message || 'I’d like to talk about how Invariant can help with our regulatory work.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      ...(company ? [`Company: ${company}`] : []),
      ...(sector ? [`Industry: ${sector}`] : []),
    ].join('\n')

    posthog.capture('early_access_contact_initiated', { source: 'contact', industry: industry || undefined })
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Design Partner Inquiry')}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <Seo title="Talk to an expert | Invariant" description="Tell us about your mission and the regulatory work ahead. Talk with the Invariant team about autonomous agents for mission-critical compliance." canonical={`${SITE_URL}/contact`} />
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="contact-eyebrow">Start a conversation</p>
          <h1 id="contact-title">Tell us what<br />you’re building.</h1>
          <p className="contact-description">Bring us the mission, the requirements, and what’s holding you up. We’ll talk through where Invariant can help.</p>
          <div className="contact-visual" aria-hidden="true">
            <span className="contact-visual-rule" />
            <img src="/figma/imgImage65.png" width="1536" height="1024" alt="" />
            <span className="contact-visual-caption">From mission to approval.</span>
          </div>
          <div className="contact-direct">
            <span className="contact-eyebrow">Prefer a direct line?</span>
            <a href={`mailto:${contactEmail}`} onClick={() => posthog.capture('early_access_contact_initiated', { source: 'contact_direct' })}>{contactEmail}<span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="contact-form-panel">
          <ContactCorners />
          <div className="contact-form-heading">
            <p className="contact-eyebrow">Your mission</p>
            <h2>Talk to the team.</h2>
            <p>A little context is a good place to start.</p>
          </div>
          <form className="contact-form" onSubmit={prepareMessage}>
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
              <div className="contact-field">
                <label htmlFor="contact-industry">Industry <small>Optional</small></label>
                <div className="contact-select">
                  <select id="contact-industry" name="industry" value={industry} onChange={event => setIndustry(event.target.value)}>
                    <option value="">Select your industry</option>
                    {industries.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <span aria-hidden="true">⌄</span>
                </div>
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">What are you working on? <small>Optional</small></label>
              <textarea id="contact-message" name="message" rows={4} maxLength={1800} placeholder="Tell us about your program and the regulatory work ahead." />
            </div>
            <div className="contact-form-actions">
              <button type="submit" className="contact-submit" aria-describedby="contact-delivery-note"><FigmaScrambleLabel>Continue in email</FigmaScrambleLabel><span aria-hidden="true">↗</span></button>
              <p id="contact-delivery-note">Opens a draft in your email app. Review it there, then send.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
