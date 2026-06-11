import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../components/Seo'

const URL = `${SITE_URL}/trust`

export default function Trust() {
  return (
    <>
      <Seo
        title="Trust — Security, data handling, and compliance disclosures"
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
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Trust</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            How we handle your work.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Customers running launch, reactor, and aviation programs work with data that ranges from contract-sensitive to ITAR controlled. This is the practical statement of how Invariant handles that data, and where the explicit limits are.
          </p>

          <Section title="Data handling defaults">
            <p>
              Customer documents and prompts are processed in tenant-scoped infrastructure and are not used for training shared models. Engagement-specific data, including drafts, technical memos, and Request-for-Additional-Information responses, is retained only as long as the engagement requires and is deleted on customer request.
            </p>
            <p>
              We treat every customer corpus as confidential under the engagement contract. Document text and embeddings are encrypted at rest using AES-256 and in transit via TLS 1.3. Access by Invariant staff is role-scoped and audited.
            </p>
          </Section>

          <Section title="Export-controlled data">
            <p>
              We do not accept ITAR-controlled technical data, EAR Strategic-Trade-Authorization-restricted content, or material classified by a national authority into our standard cloud environment. Customers with controlled-data needs are routed to a dedicated, customer-controlled deployment with no shared infrastructure and personnel restricted to U.S. persons under 22 CFR 120.62.
            </p>
            <p>
              The classification of the document itself is the customer's responsibility under their existing export-control compliance program. We will not attempt to make classification determinations on the customer's behalf.
            </p>
          </Section>

          <Section title="Regulatory accuracy">
            <p>
              Every claim our agents generate is traced to a specific regulatory section, advisory circular, regulatory guide, NUREG, ECSS standard, or other primary-source citation. Outputs are reviewed by domain engineers before they reach the regulator. The customer's named licensing professional remains the responsible party for any regulatory submission.
            </p>
            <p>
              Invariant does not offer regulatory representation, does not certify any submission as compliant with any regulation on the customer's behalf, and does not provide legal advice. Where a question is a legal matter rather than a regulatory-engineering matter, we refer the customer to their licensed counsel.
            </p>
          </Section>

          <Section title="Reproducibility and audit trail">
            <p>
              Every agent action is logged with the inputs that produced it, the prompt and tool configuration in effect, the cited source documents, and the timestamp. Logs are retained for the duration of the engagement and made available to customer auditors on request.
            </p>
          </Section>

          <Section title="Subprocessors and infrastructure">
            <p>
              Our default infrastructure runs on a U.S.-based cloud provider with FedRAMP-aligned services. Model providers used today include Anthropic for general agentic work and our own Helion-512 retrieval model for nuclear regulatory text. The current subprocessor list is provided to customers under NDA.
            </p>
          </Section>

          <Section title="Independent research">
            <p>
              We publish technical work as part of building trust with the customer base. Our domain-adapted retrieval model Helion-512 is the published state of the art on the FermiBench retrieval benchmark at 0.9693 nDCG@10. The full write-up and other research notes are at{' '}
              <Link to="/research" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                /research
              </Link>
              .
            </p>
          </Section>

          <Section title="Contact for security or data questions">
            <p>
              For procurement, security review, or data-handling questions specific to your program, reach the team at{' '}
              <a
                href="mailto:founders@invariant-ai.com"
                className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper"
              >
                founders@invariant-ai.com
              </a>
              . We will respond within one business day with the right contact for your question.
            </p>
          </Section>
        </div>
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-normal leading-tight tracking-[-0.01em] text-ink md:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 font-sans text-base leading-relaxed text-ink/70">{children}</div>
    </section>
  )
}
