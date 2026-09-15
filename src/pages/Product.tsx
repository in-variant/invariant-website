import { Link } from 'react-router-dom'
import DemoVideo from '../components/DemoVideo'
import { Seo, SITE_URL } from '../components/Seo'
import FigmaScrambleLabel from '../components/FigmaScrambleLabel'
import '../styles/figma-fonts.css'
import './Product.css'

const CAPABILITIES = [
  { n: '01', title: 'Drafting agents', body: 'PSARs, RAI responses, Means of Compliance, and test plans drafted against your project corpus. Supporting citations stay connected to the document.' },
  { n: '02', title: 'Citation traceability', body: 'Follow a claim back to the rule that supports it. Review the source alongside the draft, with the evidence available at the line where it matters.' },
  { n: '03', title: 'Live regulation monitoring', body: 'Federal Register, NRC ADAMS, FAA dockets, and FCC orders monitored for changes relevant to your filing.' },
  { n: '04', title: 'Engineer-led delivery', body: 'A forward-deployed engineer reviews the output and works through submission packaging, regulator correspondence, and the filing itself.' },
]
const SOURCE_GROUPS = [
  { label: 'Customer artefacts', items: ['Design basis', 'Topical reports', 'Prior filings', 'Vendor documents'] },
  { label: 'Nuclear corpus', items: ['10 CFR Part 50', '10 CFR Part 52', 'ASME III codes', 'NRC NUREG-0800', 'NRC Regulatory Guides'] },
  { label: 'Space corpus', items: ['14 CFR Part 450', '47 CFR Part 25', 'IN-SPACe guidelines', 'ECSS standards'] },
  { label: 'Live feeds', items: ['Federal Register', 'NRC ADAMS', 'FAA dockets', 'FCC filings'] },
]
const READINGS = [
  { category: 'Drafting / Nuclear', title: 'How to write a PSAR', description: 'The structure, supporting evidence, and review criteria behind a Preliminary Safety Analysis Report.', href: '/how-to-write-a-psar' },
  { category: 'Review / Nuclear', title: 'Managing requests for additional information', description: 'A guide to organizing, answering, and tracking NRC questions through the review process.', href: '/nrc-rai-management' },
  { category: 'Research / Retrieval', title: 'Testing regulatory retrieval with FermiBench', description: 'The benchmark, the evaluation, and what we learned about finding the right regulatory evidence.', href: '/blog/fermibench-sota' },
]

function Brackets() {
  return <span className="product-brackets" aria-hidden="true"><i /><i /><i /><i /></span>
}
function Arrow({ direction = 'out' }: { direction?: 'out' | 'right' }) {
  return <svg className={`product-arrow product-arrow-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {direction === 'out' ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h16m-7-7 7 7-7 7" />}
  </svg>
}

function ProductDemo() {
  return <section className="product-intro product-container" aria-labelledby="product-title">
    <p className="product-eyebrow">The platform</p>
    <div className="product-intro-copy">
      <h1 id="product-title">Drafting, citing,<br />and reviewing in one place.</h1>
      <p className="product-lede">Your project corpus on the left, the document being drafted in the middle, and a live agent on the right. Every paragraph grounded in your corpus.</p>
    </div>
    <figure className="product-demo" id="platform-demo">
      <div className="product-frame-label"><span>See Invariant at work</span><span>Product walkthrough / 01:36</span></div>
      <div className="product-video-frame">
        <div className="product-video-player"><DemoVideo className="product-native-video" /></div>
        <Brackets />
      </div>
      <figcaption className="product-video-caption">
        <span className="product-caption-label">A real product walkthrough</span>
        <p>Recorded in a demo workspace. The applicant and the licensing portal are stand-ins; the product, the corpus, and the citations are real.</p>
      </figcaption>
    </figure>
    <ol className="product-workspace-parts" aria-label="Inside the workspace">
      <li><span className="product-step-number">01</span><div><h2>Your corpus</h2><p>Project documents and the regulations that apply.</p></div></li>
      <li><span className="product-step-number">02</span><div><h2>The document</h2><p>The draft and its supporting citations, together.</p></div></li>
      <li><span className="product-step-number">03</span><div><h2>The agent</h2><p>Drafting and retrieval in the context of your work.</p></div></li>
    </ol>
  </section>
}

function ProductCapabilities() {
  return <section className="product-capabilities product-container product-section" aria-labelledby="product-capabilities-title">
    <div className="product-section-heading">
      <p className="product-eyebrow">From evidence to execution</p>
      <h2 id="product-capabilities-title">Agents do the work.<br />Engineers see it through.</h2>
    </div>
    <div className="product-capability-layout">
      <figure className="product-system-figure">
        <div className="product-system-art" aria-hidden="true"><img src="/figma/platform-orchestrate.png" alt="" width="4096" height="2731" loading="lazy" /></div>
        <figcaption><span>Connected evidence</span><Arrow direction="right" /><span>A working document</span></figcaption>
      </figure>
      <ol className="product-capability-list">
        {CAPABILITIES.map(capability => <li key={capability.n}>
          <span className="product-step-number">{capability.n}</span>
          <div><h3>{capability.title}</h3><p>{capability.body}</p></div>
        </li>)}
      </ol>
    </div>
  </section>
}

function ProductSources() {
  return <section className="product-sources product-section" aria-labelledby="product-sources-title">
    <div className="product-container">
      <div className="product-sources-intro">
        <div className="product-section-heading"><p className="product-eyebrow">Built on your sources</p><h2 id="product-sources-title">The right context.<br />At every step.</h2></div>
        <p className="product-lede">Your project documents, the regulations that apply, and the live feeds that flag changes as they post. Indexed and available to cite in the same workspace.</p>
      </div>
      <figure className="product-library">
        <div className="product-frame-label"><span>Inside the platform</span><span>Regulation library</span></div>
        <a className="product-library-image" href="/platform/regulations.jpg" target="_blank" rel="noreferrer" aria-label="Open the Invariant regulation library screenshot at full size in a new tab">
          <img src="/platform/regulations.jpg" alt="The Invariant regulation library, showing nuclear regulations organized by agency, code, and review framework." width="1800" height="943" loading="lazy" />
          <Brackets />
        </a>
        <figcaption><span>Organized by agency, code, and review framework.</span><a href="/platform/regulations.jpg" target="_blank" rel="noreferrer">View full size <Arrow /></a></figcaption>
      </figure>
      <div className="product-source-groups">
        {SOURCE_GROUPS.map((group, index) => <div key={group.label}>
          <span className="product-step-number">0{index + 1}</span><h3>{group.label}</h3>
          <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </div>)}
      </div>
    </div>
  </section>
}

function ProductReadings() {
  return <section className="product-readings product-container product-section" aria-labelledby="product-readings-title">
    <div className="product-reading-heading">
      <div className="product-section-heading"><p className="product-eyebrow">The work in practice</p><h2 id="product-readings-title">A closer look.</h2></div>
      <Link className="product-text-link" to="/research"><FigmaScrambleLabel>Explore research</FigmaScrambleLabel><Arrow /></Link>
    </div>
    <div className="product-reading-grid">
      {READINGS.map(reading => <Link className="product-reading" to={reading.href} key={reading.href}>
        <span className="product-reading-category">{reading.category}</span><h3>{reading.title}</h3><p>{reading.description}</p>
        <span className="product-reading-action">Read the article <Arrow /></span>
      </Link>)}
    </div>
  </section>
}

function ProductCTA() {
  return <section className="product-cta product-container" aria-labelledby="product-cta-title">
    <div><p className="product-eyebrow">Start with your mission</p><h2 id="product-cta-title">Your next filing,<br />on Invariant.</h2></div>
    <div className="product-cta-action">
      <p>We’ll walk through your corpus, your regulators, and your timeline. No deck. Just the work.</p>
      <div className="product-actions">
        <Link className="product-button" to="/contact"><FigmaScrambleLabel>Talk to an expert</FigmaScrambleLabel><Arrow /></Link>
        <Link className="product-button product-button-secondary" to="/probe"><FigmaScrambleLabel>Try Probe</FigmaScrambleLabel><Arrow /></Link>
      </div>
    </div>
  </section>
}

export default function Product() {
  return <div className="product-page"><Seo title="Platform | Invariant" description="See Invariant draft, cite, and review regulatory work against your project corpus. Autonomous agents for mission-critical compliance." canonical={`${SITE_URL}/product`} /><ProductDemo /><ProductCapabilities /><ProductSources /><ProductReadings /><ProductCTA /></div>
}
