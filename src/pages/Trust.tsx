import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../components/Seo'
import './Trust.css'

const URL = `${SITE_URL}/trust`
const contents = [
  ['data-handling', 'Data handling defaults'],
  ['export-controlled-data', 'Export-controlled data'],
  ['regulatory-accuracy', 'Regulatory accuracy'],
  ['audit-trail', 'Reproducibility and audit trail'],
  ['infrastructure', 'Subprocessors and infrastructure'],
  ['research', 'Independent research'],
  ['security-contact', 'Contact for security or data questions'],
]

export default function Trust() {
  return (
    <>
      <Seo
        title="Trust: security, data handling, and compliance disclosures"
        description="How Invariant handles your data, hosts your regulatory submissions, and meets the security expectations of space, aerospace, and nuclear operators."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Trust', url: URL },
          ]),
        ]}
      />
      <article className="trust-page">
        <div className="trust-container">
          <header className="trust-hero">
          <div className="trust-intro">
          <p className="trust-eyebrow">Trust</p>
          <h1>
            How we handle your work.
          </h1>
          <p className="trust-lead">
            Customers running launch, reactor, and aviation programs work with data that ranges from contract-sensitive to ITAR controlled. This is the practical statement of how Invariant handles that data, and where the explicit limits are.
          </p>
          </div>
          <figure className="trust-illustration" aria-label="Protected customer infrastructure, depicted in blue dither">
            <div className="trust-data-art"><img src="/figma/imgDataSafetyDither3.png" width="4096" height="1747" alt="" /></div>
            <figcaption>Security &amp; data handling</figcaption>
          </figure>
          </header>

          <div className="trust-layout">
          <aside className="trust-contents" aria-label="On this page">
            <p className="trust-eyebrow">On this page</p>
            <nav>{contents.map(([id, title], index) => <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, '0')}</span>{title}</a>)}</nav>
          </aside>
          <div className="trust-sections">

          <Section index={0}>
            <p>
              Customer documents and prompts are processed in tenant-scoped infrastructure and are not used for training shared models. Engagement-specific data, including drafts, technical memos, and Request-for-Additional-Information responses, is retained only as long as the engagement requires and is deleted on customer request.
            </p>
            <p>
              We treat every customer corpus as confidential under the engagement contract. Document text and embeddings are encrypted at rest using AES-256 and in transit via TLS 1.3. Access by Invariant staff is role-scoped and audited.
            </p>
          </Section>

          <Section index={1}>
            <p>
              We do not accept ITAR-controlled technical data, EAR Strategic-Trade-Authorization-restricted content, or material classified by a national authority into our standard cloud environment. Customers with controlled-data needs are routed to a dedicated, customer-controlled deployment with no shared infrastructure and personnel restricted to U.S. persons under 22 CFR 120.62.
            </p>
            <p>
              The classification of the document itself is the customer's responsibility under their existing export-control compliance program. We will not attempt to make classification determinations on the customer's behalf.
            </p>
          </Section>

          <Section index={2}>
            <p>
              Every claim our agents generate is traced to a specific regulatory section, advisory circular, regulatory guide, NUREG, ECSS standard, or other primary-source citation. Outputs are reviewed by domain engineers before they reach the regulator. The customer's named licensing professional remains the responsible party for any regulatory submission.
            </p>
            <p>
              Invariant does not offer regulatory representation, does not certify any submission as compliant with any regulation on the customer's behalf, and does not provide legal advice. Where a question is a legal matter rather than a regulatory-engineering matter, we refer the customer to their licensed counsel.
            </p>
          </Section>

          <Section index={3}>
            <p>
              Every agent action is logged with the inputs that produced it, the prompt and tool configuration in effect, the cited source documents, and the timestamp. Logs are retained for the duration of the engagement and made available to customer auditors on request.
            </p>
          </Section>

          <Section index={4}>
            <p>
              Our default infrastructure runs on a U.S.-based cloud provider with FedRAMP-aligned services. Model providers used today include Anthropic for general agentic work and our own Helion-512 retrieval model for nuclear regulatory text. The current subprocessor list is provided to customers under NDA.
            </p>
          </Section>

          <Section index={5}>
            <p>
              We publish technical work as part of building trust with the customer base. Our domain-adapted retrieval model Helion-512 is the published state of the art on the FermiBench retrieval benchmark at 0.9693 nDCG@10. The full write-up and other research notes are at{' '}
              <Link to="/research">
                /research
              </Link>
              .
            </p>
          </Section>

          <Section index={6}>
            <p>
              For procurement, security review, or data-handling questions specific to your program, reach the team at{' '}
              <a
                href="mailto:founders@invariant-ai.com"
              >
                founders@invariant-ai.com
              </a>
              . We will respond within one business day with the right contact for your question.
            </p>
          </Section>
          </div>
          </div>
        </div>
      </article>
    </>
  )
}

function Section({ index, children }: { index: number; children: React.ReactNode }) {
  const [id, title] = contents[index]
  return (
    <section className="trust-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="trust-section-heading"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h2 id={`${id}-title`}>
        {title}
      </h2></div>
      <div className="trust-section-copy">{children}</div>
    </section>
  )
}
