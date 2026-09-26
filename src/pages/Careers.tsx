import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import BlockReveal from '../components/BlockReveal'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import { Seo, SITE_URL, breadcrumbSchema } from '../components/Seo'
import { FOUNDING_ENGINEER as role, prepareJobApplication, type JobApplication } from '../data/foundingEngineer'
import './Careers.css'

const headingGradient = ['#fb4d03', '#fffaf2', '#80a8c6', '#071b35']
const sections = [['role', 'The role'], ['ownership', 'What you’ll own'], ['requirements', 'What you bring'], ['offer', 'The offer'], ['apply', 'Apply']] as const
type Draft = ReturnType<typeof prepareJobApplication>

function Corners() {
  return <span className="careers-corners" aria-hidden="true"><i /><i /><i /><i /></span>
}

function ApplicationForm() {
  const [values, setValues] = useState<JobApplication>({ name: '', email: '', project: '', agent: '', customer: '' })
  const [draft, setDraft] = useState<Draft | null>(null)
  const [copyStatus, setCopyStatus] = useState('')
  const reviewHeading = useRef<HTMLHeadingElement>(null)
  const nameField = useRef<HTMLInputElement>(null)
  const applicationPanel = useRef<HTMLDivElement>(null)

  const showPanel = () => applicationPanel.current?.scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })

  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    // Native validation handles format and limits. Also reject whitespace-only
    // names and answers before constructing a mail draft.
    for (const key of ['name', 'agent', 'customer'] as const) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement
      field.setCustomValidity(values[key].trim() ? '' : key === 'name' ? 'Please enter your name.' : 'Please share a short example.')
    }
    if (!form.reportValidity()) return
    setCopyStatus('')
    setDraft(prepareJobApplication(values))
    requestAnimationFrame(() => {
      reviewHeading.current?.focus({ preventScroll: true })
      showPanel()
    })
  }

  const edit = () => {
    setDraft(null)
    setCopyStatus('')
    requestAnimationFrame(() => {
      nameField.current?.focus({ preventScroll: true })
      showPanel()
    })
  }

  const copy = async () => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(`To: ${role.email}\nSubject: ${role.title}\n\n${draft.body}`)
      setCopyStatus('Copied. Paste this into an email to jobs@invariant-ai.com.')
    } catch {
      setCopyStatus('Select and copy the application below, then paste it into your email app.')
    }
  }

  return <div ref={applicationPanel} className="careers-application ph-no-capture ph-sensitive">
    <Corners />
    {draft ? <div className="careers-draft">
      <p className="careers-eyebrow">Your application / Review</p>
      <h3 ref={reviewHeading} tabIndex={-1}>Ready when you are.</h3>
      <p className="careers-form-intro">Your draft is ready. Open it in your email app, review it, and send it to the team.</p>
      <dl className="careers-draft-address"><div><dt>To</dt><dd>{role.email}</dd></div><div><dt>Subject</dt><dd>{role.title}</dd></div></dl>
      <label className="careers-sr-only" htmlFor="careers-email-preview">Your application email</label>
      <textarea id="careers-email-preview" className="careers-email-preview" value={draft.body} readOnly rows={12} data-lenis-prevent />
      <a className="careers-button careers-button--full" href={draft.href}><FigmaScrambleLabel>Open email draft</FigmaScrambleLabel><span aria-hidden="true">↗</span></a>
      <div className="careers-draft-actions"><button type="button" onClick={edit}>Edit application</button><button type="button" onClick={copy}>Copy application</button></div>
      <p className="careers-delivery-note" role="status">{copyStatus || 'Nothing has been sent yet. If your email app doesn’t open, copy the application and email it directly.'}</p>
    </div> : <form onSubmit={prepare} className="careers-form">
      <div className="careers-form-top"><p className="careers-eyebrow">Your application</p><span>Founding Engineer</span></div>
      <p className="careers-form-intro">A link to your work and two short answers. Skip the cover letter.</p>
      <div className="careers-form-row">
        <div className="careers-field">
          <label htmlFor="careers-name">Your name <span aria-hidden="true">*</span></label>
          <input ref={nameField} id="careers-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100} value={values.name} onChange={event => { event.currentTarget.setCustomValidity(''); setValues({ ...values, name: event.target.value }) }} />
        </div>
        <div className="careers-field">
          <label htmlFor="careers-email">Email <span aria-hidden="true">*</span></label>
          <input id="careers-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} />
        </div>
      </div>
      <div className="careers-field">
        <label htmlFor="careers-project">A link to your work <span aria-hidden="true">*</span></label>
        <input id="careers-project" name="project" type="url" inputMode="url" autoComplete="url" spellCheck={false} placeholder="https://github.com/you/your-project" required pattern="https?://.+" maxLength={350} aria-describedby="careers-project-hint" value={values.project} onChange={event => setValues({ ...values, project: event.target.value })} />
        <p id="careers-project-hint" className="careers-field-hint">A repository, live product, or write-up of the agent you describe below.</p>
      </div>
      <div className="careers-field">
        <label htmlFor="careers-agent">Tell us about an AI agent you shipped. <span aria-hidden="true">*</span></label>
        <textarea id="careers-agent" name="agent" rows={5} required maxLength={1200} placeholder="What did it do, what did you build yourself, and how did you know it worked? Include a failure you had to fix." aria-describedby="careers-agent-hint" value={values.agent} onChange={event => { event.currentTarget.setCustomValidity(''); setValues({ ...values, agent: event.target.value }) }} />
        <div className="careers-field-bottom"><p id="careers-agent-hint" className="careers-field-hint">One concrete example. A short paragraph is enough.</p><span aria-hidden="true">{values.agent.length} / 1,200</span></div>
      </div>
      <div className="careers-field">
        <label htmlFor="careers-customer">How did you make it work for a customer? <span aria-hidden="true">*</span></label>
        <textarea id="careers-customer" name="customer" rows={5} required maxLength={1200} placeholder="Tell us about working directly with a customer or user: understanding their workflow, connecting their systems, and changing what you built after seeing it in use." aria-describedby="careers-customer-hint" value={values.customer} onChange={event => { event.currentTarget.setCustomValidity(''); setValues({ ...values, customer: event.target.value }) }} />
        <div className="careers-field-bottom"><p id="careers-customer-hint" className="careers-field-hint">Use examples you can share publicly. Leave out customer names or confidential details.</p><span aria-hidden="true">{values.customer.length} / 1,200</span></div>
      </div>
      <div className="careers-form-submit">
        <button type="submit" className="careers-button careers-button--full"><FigmaScrambleLabel>Prepare application</FigmaScrambleLabel><span aria-hidden="true">↗</span></button>
        <p className="careers-delivery-note">Review your draft, then send it from your email app to <a href={`mailto:${role.email}?subject=Founding%20Engineer`}>{role.email}</a>.</p>
      </div>
    </form>}
  </div>
}

export default function Careers({ renderSeo = true }: { renderSeo?: boolean }) {
  return <article className="careers-page" aria-labelledby="careers-title">
    {renderSeo && <Seo title={role.pageTitle} description={role.description} canonical={`${SITE_URL}/careers`} jsonLd={breadcrumbSchema([{ name: 'Invariant', url: SITE_URL }, { name: 'Careers', url: `${SITE_URL}/careers` }])} />}
    <div className="careers-container">
      <header className="careers-hero">
        <div className="careers-hero-copy">
          <p className="careers-eyebrow">Careers at Invariant <span className="careers-open-label"><i aria-hidden="true" />One open role</span></p>
          <BlockReveal as="h1" id="careers-title" gradient={headingGradient}>Founding<br />Engineer.</BlockReveal>
          <p className="careers-hero-lead">Ship software that helps<br className="careers-desktop-break" /> hardware leave the ground.</p>
          <p className="careers-hero-description">Build the agents that draft, check, and file regulatory submissions. Work directly with the founders. Own what ships.</p>
          <div className="careers-hero-actions"><a href="#apply" className="careers-button"><FigmaScrambleLabel>Apply for this role</FigmaScrambleLabel><span aria-hidden="true">↗</span></a><a href="/jobs/founding-engineer.pdf" className="careers-text-link" target="_blank" rel="noopener noreferrer">Read the brief <span>PDF ↗</span></a></div>
        </div>
        <figure className="careers-hero-art">
          <img src="/media/hero-enhanced-1920.webp?v=91f312f7" alt="A spacecraft climbing above Earth’s horizon" width="1920" height="1080" fetchPriority="high" />
          <div className="careers-art-index" aria-hidden="true"><span>Invariant / Engineering</span><span>001</span></div>
          <figcaption>Good engineering deserves<br />to get off the ground.</figcaption>
        </figure>
      </header>

      <dl className="careers-facts" aria-label="Role at a glance">
        <div><dt>Location</dt><dd>San Francisco, CA <span>On-site</span></dd></div>
        <div><dt>Commitment</dt><dd>Full time</dd></div>
        <div><dt>Base salary</dt><dd>$140,000 <span>USD / year</span></dd></div>
        <div><dt>Equity</dt><dd>1.5% <span>Equity in Invariant</span></dd></div>
      </dl>

      <div className="careers-details-layout">
        <aside className="careers-sidebar">
          <p className="careers-eyebrow">The opportunity</p>
          <nav aria-label="Job details">{sections.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}<i aria-hidden="true">↗</i></a>)}</nav>
          <div className="careers-founder-note">
            <div className="careers-founder-photos"><img src="/founders/parthiv.jpg" alt="Parthiv" width="48" height="56" loading="lazy" /><img src="/founders/pranav.jpg" alt="Pranav" width="48" height="56" loading="lazy" /></div>
            <p>You’ll work directly with<br />Parthiv and Pranav.</p>
            <Link className="careers-text-link" to="/about">Meet the founders <span aria-hidden="true">↗</span></Link>
          </div>
        </aside>

        <div className="careers-details">
          <section id="role" className="careers-section" aria-labelledby="careers-role-title">
            <p className="careers-section-index">01 / The role</p>
            <h2 id="careers-role-title">Close to the code.<br />Close to the customer.</h2>
            <p>You’ll be one of the first engineers at Invariant, owning the agents that draft, check, and file regulatory submissions. Your code ships to customers, with a measured improvement against an eval.</p>
            <p>You’ll work directly with both founders, sit in customer working sessions, and make architecture calls that the rest of the team will build on for years. What gets built, and in what order, is partly your decision.</p>
            <div className="careers-context"><span className="careers-eyebrow">Why this work exists</span><p>Invariant builds autonomous agents for mission-critical compliance. Our engineers deploy into the customer’s team and own the regulatory process from the first determination through to filing, with the agents doing the work underneath.</p><p>A satellite can be built before its approvals are ready. Spectrum, launch, remote sensing, and export requirements each create work that someone has to get right. We’re building the systems that carry that work through.</p><Link className="careers-text-link" to="/charter">Why we’re building Invariant <span aria-hidden="true">↗</span></Link></div>
          </section>

          <section id="ownership" className="careers-section" aria-labelledby="careers-ownership-title">
            <p className="careers-section-index">02 / What you’ll own</p><h2 id="careers-ownership-title">The core system.<br />And the standard it ships to.</h2>
            <ul className="careers-list">{role.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
            <div className="careers-stack" aria-label="Technologies">{['Python', 'FastAPI', 'pgvector', 'Next.js', 'Evals'].map(item => <span key={item}>{item}</span>)}</div>
          </section>

          <section id="requirements" className="careers-section" aria-labelledby="careers-requirements-title">
            <p className="careers-section-index">03 / What you bring</p><h2 id="careers-requirements-title">You’ve built it.<br />You’ve had to make it work.</h2>
            <ul className="careers-list">{role.requirements.map(item => <li key={item}>{item}</li>)}</ul>
            <div className="careers-nice-to-have"><h3>Nice to have.</h3><p>Additional experience that would help.</p><ul className="careers-list">{role.niceToHave.map(item => <li key={item}>{item}</li>)}</ul></div>
          </section>

          <section id="offer" className="careers-section" aria-labelledby="careers-offer-title">
            <p className="careers-section-index">04 / The offer</p><h2 id="careers-offer-title">A real stake in what you build.</h2>
            <div className="careers-offer-grid"><div><strong>$140K</strong><span>Base salary / USD</span></div><div><strong>1.5%</strong><span>Equity</span></div><div><strong>San Francisco</strong><span>Relocation covered</span></div></div>
            <ul className="careers-list"><li>Direct work with both founders. There’s no layer between you and the decisions.</li><li>Ownership of the core system, and a say in how the engineering team grows.</li><li>Your name on work that ships to companies putting hardware in orbit.</li></ul>
          </section>
        </div>
      </div>

      <section id="apply" className="careers-apply" aria-labelledby="careers-apply-title">
        <div className="careers-apply-intro"><p className="careers-section-index">05 / Apply</p><h2 id="careers-apply-title">Show us what<br />you’ve built.</h2><p>Tell us about an agent you shipped and the work it took to make it useful to a customer. We want to understand what you owned, what you learned, and what changed.</p><p className="careers-reply-note"><span aria-hidden="true">↳</span> We reply to everyone.</p><div className="careers-direct"><span className="careers-eyebrow">Prefer a direct email?</span><a className="careers-text-link" href={`mailto:${role.email}?subject=Founding%20Engineer`}>{role.email} <span aria-hidden="true">↗</span></a></div></div>
        <ApplicationForm />
      </section>

      <section className="careers-equal-opportunity" aria-labelledby="careers-equal-title"><h2 id="careers-equal-title">Equal opportunity</h2><p>{role.equalOpportunity}</p></section>
    </div>
  </article>
}
