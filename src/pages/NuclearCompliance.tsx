import type { ReactNode } from 'react'
import { Seo, articleSchema, faqSchema, breadcrumbSchema, ORG_SCHEMA } from '../components/Seo'

const URL = 'https://invariant-ai.com/nuclear-compliance'

const FAQS = [
  {
    question: 'What is nuclear compliance?',
    answer:
      "Nuclear compliance is the body of regulations, standards, and licensing requirements an applicant must satisfy to design, construct, operate, decommission, and export commercial nuclear technology. In the United States it is centred on the NRC's 10 CFR framework (Parts 50, 52, 53, 100, 110); internationally, IAEA safety standards (SSR-2/1, SF-1) and national regulators (UK ONR, Canada CNSC, French ASN, Japan NRA, India AERB) form the global landscape. The deliverables are the Safety Analysis Report (PSAR / FSAR), environmental review, security and safeguards plans, and the rolling RAI response programme.",
  },
  {
    question: 'Who regulates nuclear?',
    answer:
      "The US Nuclear Regulatory Commission (NRC) is the civilian regulator for commercial nuclear power. The Department of Energy (DOE) regulates the federal nuclear complex. The IAEA sets international safety and safeguards standards. Other national regulators include the UK Office for Nuclear Regulation (ONR), Canada's CNSC, France's ASN, Japan's NRA, Korea's KINS, and India's AERB. Most advanced-reactor developers face the NRC + IAEA + at least one national authority.",
  },
  {
    question: 'What is 10 CFR Part 53?',
    answer:
      "10 CFR Part 53 is the NRC's new technology-inclusive, risk-informed, performance-based licensing framework for commercial advanced nuclear reactors. It was finalised in 2026 and provides an alternative to the Part 50/52 pathways. Part 53 organises requirements around Licensing Basis Events (LBEs), risk-significant SSCs (Structures, Systems, Components), and the safety functions they perform — applicable across LWRs, advanced reactors, and microreactors.",
  },
  {
    question: 'What are PSAR and FSAR?',
    answer:
      "The Preliminary Safety Analysis Report (PSAR) is submitted with the construction permit application and describes the proposed design and safety basis in enough detail for the NRC to issue the permit. The Final Safety Analysis Report (FSAR) accompanies the operating licence application and reflects the as-built plant. Both are dense, multi-thousand-page documents organised into chapters on site characteristics, design, safety analysis, conduct of operations, technical specifications, quality assurance, and decommissioning.",
  },
  {
    question: 'How long does NRC licensing take?',
    answer:
      "Historically, US nuclear licensing has run 36–60 months for a full safety review on novel designs. The new Part 53 framework and ongoing NRC modernization aim to compress this, with advanced-reactor design certifications and Construction Permit Applications progressing in 24–36 months for well-prepared applicants. Realistic timelines depend on the applicant's documentation quality, RAI volume, and pre-application engagement.",
  },
  {
    question: 'What is the licensing pathway for an advanced reactor?',
    answer:
      "An advanced reactor developer can use the legacy two-step process (Construction Permit + Operating Licence under Part 50), the one-step Combined Licence (COL) under Part 52 (often combined with a Design Certification and/or Early Site Permit), or the technology-inclusive Part 53 framework. Most current advanced-reactor and SMR applicants are using Part 52 (e.g., NuScale's design certification) while the industry transitions to Part 53.",
  },
  {
    question: 'What are RAIs in nuclear licensing?',
    answer:
      "A Request for Additional Information (RAI) is an NRC staff request for clarification or more detail on a submission. Each RAI must be answered in writing and, if it identifies an actual gap, a supplemental amendment must be issued. RAI volume is the single most common driver of licensing timeline slippage. Citation accuracy and document depth in the original submission determine RAI volume.",
  },
  {
    question: 'What is FermiBench?',
    answer:
      'FermiBench is the only public information-retrieval benchmark for the nuclear regulatory domain, built by Atomic Canyon from the NRC ADAMS document corpus. Invariant\'s domain-adapted retrieval model, Helion-512, holds the published state of the art on FermiBench at 0.9693 nDCG@10 — up from the previous best of 0.74 — demonstrating real capability on nuclear-domain retrieval.',
  },
  {
    question: 'How do AI agents accelerate nuclear compliance?',
    answer:
      'Autonomous AI agents can ingest a project\'s design documents, the NRC ADAMS corpus, and the regulations that apply, then draft sections of the Safety Analysis Report with every claim cited back to the rule that supports it, generate RAI responses with traceable evidence, build the verification matrix against 10 CFR requirements, and continuously monitor the underlying regulations for changes. Domain-adapted retrieval (such as Helion-512) is what makes the citation grounding reliable. Agents do not replace the licensing engineer or the regulator. They remove the documentation grind.',
  },
  {
    question: 'What is IAEA SSR-2/1?',
    answer:
      "IAEA Specific Safety Requirements SSR-2/1, 'Safety of Nuclear Power Plants: Design,' is the IAEA's principal design safety standard for civil nuclear power plants. It defines the design requirements (deterministic and probabilistic safety analyses, defence in depth, multiple barriers) that national regulators reference and harmonise with.",
  },
  {
    question: 'What is the difference between Part 50, Part 52, and Part 53?',
    answer:
      "10 CFR Part 50 is the legacy two-step framework (Construction Permit, then Operating Licence). 10 CFR Part 52 is the one-step Combined Licence regime introduced in 1989 with Design Certifications and Early Site Permits — the path most modern fleets have used. 10 CFR Part 53 is the new technology-inclusive, risk-informed, performance-based framework, designed for advanced reactors, SMRs, and microreactors, finalised in 2026.",
  },
  {
    question: 'What does Invariant do for nuclear companies?',
    answer:
      "Invariant deploys autonomous AI agents plus a small team of forward-deployed nuclear engineers to run an advanced-reactor or SMR developer's compliance end to end: drafting PSAR/FSAR chapters with traceable citations to 10 CFR and IAEA standards, generating RAI responses, building the verification matrix, and continuously monitoring rule changes (Part 53, Part 100 Appendix A → Part 53 Subpart D, and others). Our retrieval is the published state of the art on FermiBench.",
  },
]

const CITATIONS = [
  { label: 'US Nuclear Regulatory Commission', url: 'https://www.nrc.gov/' },
  { label: '10 CFR Part 50 (production and utilization facilities)', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part050/' },
  { label: '10 CFR Part 52 (combined licences, design certifications, ESPs)', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part052/' },
  { label: '10 CFR Part 53 (advanced reactor framework)', url: 'https://www.nrc.gov/reactors/new-reactors/advanced/rulemaking.html' },
  { label: '10 CFR Part 100 (reactor site criteria)', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part100/' },
  { label: '10 CFR Part 110 (export and import licensing)', url: 'https://www.nrc.gov/reading-rm/doc-collections/cfr/part110/' },
  { label: 'IAEA SSR-2/1 (Safety of Nuclear Power Plants: Design)', url: 'https://www.iaea.org/publications/10885' },
  { label: 'IAEA Safety Standards', url: 'https://www.iaea.org/resources/safety-standards' },
  { label: 'US Department of Energy', url: 'https://www.energy.gov/' },
  { label: 'UK Office for Nuclear Regulation (ONR)', url: 'https://www.onr.org.uk/' },
  { label: 'Canadian Nuclear Safety Commission (CNSC)', url: 'https://www.cnsc-ccsn.gc.ca/' },
  { label: 'NRC ADAMS (the public document corpus)', url: 'https://www.nrc.gov/reading-rm/adams.html' },
]

export default function NuclearCompliance() {
  const ld = [
    ORG_SCHEMA,
    articleSchema({
      title: 'Nuclear compliance: the licensing pathways, what the regulator reads, and how AI changes the work',
      description:
        'A complete guide to nuclear compliance for advanced reactor, SMR, and microreactor developers. Regulators, 10 CFR Parts 50/52/53, PSAR/FSAR drafting, RAIs, and where AI agents help.',
      url: URL,
      datePublished: '2026-06-11',
      dateModified: '2026-06-11',
    }),
    faqSchema(FAQS),
    breadcrumbSchema([
      { name: 'Invariant', url: 'https://invariant-ai.com/' },
      { name: 'Nuclear compliance', url: URL },
    ]),
  ]
  return (
    <>
      <Seo
        title="Nuclear compliance: a complete guide (2026)"
        description="A complete guide to nuclear compliance for advanced reactor, SMR, and microreactor developers. Regulators, the 10 CFR Parts 50/52/53 pathways, PSAR/FSAR drafting, RAIs, and how autonomous AI agents are changing the work."
        canonical={URL}
        jsonLd={ld}
        ogType="article"
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Nuclear compliance</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            Nuclear compliance: the licensing pathways, what the regulator reads, and how AI changes the work.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Nuclear compliance is the body of regulations, standards, and licensing requirements an applicant must satisfy to design, construct, operate, decommission, and export commercial nuclear technology. In the United States it is centred on the NRC's 10 CFR framework; internationally, IAEA safety standards and national regulators form the rest of the global landscape.
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink/65">
            The deliverables are the Safety Analysis Report, the environmental review, the security and safeguards plans, and a rolling RAI-response programme. They are dense, citation-heavy, and they are the single largest schedule risk on a new-build or advanced-reactor programme.
          </p>

          <H2>Who regulates nuclear</H2>
          <P>Civil nuclear power is regulated nationally, with the IAEA setting harmonising safety standards. An advanced-reactor or SMR developer typically deals with multiple regulators at once: the NRC for the design / first-of-a-kind plant, the IAEA for safeguards posture, and at least one foreign authority for international deployment.</P>
          <div className="mt-8 space-y-6">
            <Block title="United States">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li><strong>NRC</strong>: civilian commercial reactor licensing under 10 CFR (Parts 50, 52, 53, 100, 110).</li>
                <li><strong>DOE</strong>: federal nuclear complex, fuel cycle, weapons, advanced-reactor demonstration funding (ARDP).</li>
                <li><strong>DDTC / BIS</strong>: nuclear export controls (Part 810 from DOE; 10 CFR Part 110 from NRC).</li>
              </ul>
            </Block>
            <Block title="International">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li><strong>IAEA</strong>: safety standards (SSR-2/1, SF-1), safeguards, peer reviews (IRRS, OSART).</li>
                <li><strong>UK ONR</strong>, <strong>Canada CNSC</strong>, <strong>France ASN</strong>, <strong>Japan NRA</strong>, <strong>Korea KINS</strong>, <strong>India AERB</strong>: national authorities a developer hits when going international.</li>
              </ul>
            </Block>
          </div>

          <H2>The major frameworks (10 CFR)</H2>
          <P>The US framework dominates the global market, both for the size of the fleet and as the template that other regulators reference.</P>
          <div className="mt-8 space-y-6">
            <Block title="10 CFR Part 50 (legacy two-step)">
              <P>Construction Permit (CP) first, then Operating Licence (OL). Used for the existing US fleet. Some new applicants still use Part 50, particularly for first-of-a-kind designs that prefer the staged review.</P>
            </Block>
            <Block title="10 CFR Part 52 (one-step Combined Licence)">
              <P>Combined Construction and Operating Licence (COL), often paired with a separate Design Certification (Appendix to Part 52) and an Early Site Permit (ESP). This is the path most modern fleets have used (Vogtle, Summer; NuScale's DC).</P>
            </Block>
            <Block title="10 CFR Part 53 (technology-inclusive, risk-informed)">
              <P>The new framework finalised in 2026. Organised around Licensing Basis Events (LBEs), risk-significant SSCs, and the safety functions they perform. Applicable across LWRs, advanced reactors, and microreactors. Subpart D introduces risk-tiered design-basis ground motions (DBGMs) and seismic design categories (SDCs), replacing the deterministic SSE/OBE structure of Part 100 Appendix A.</P>
            </Block>
            <Block title="10 CFR Part 100 (siting)">
              <P>Reactor site criteria, including the population, seismic, meteorology, and hydrology factors. Subpart D's seismic siting under Part 53 replaces much of the legacy Appendix A framework for advanced reactor applicants.</P>
            </Block>
            <Block title="10 CFR Part 110 (export and import)">
              <P>Governs the export and import of nuclear equipment and material from US jurisdiction. Complementary to DOE 10 CFR Part 810 (assistance to foreign nuclear activities).</P>
            </Block>
          </div>

          <H2>What the regulator actually reads</H2>
          <P>The output of a licensing programme is a small number of very dense documents.</P>
          <ul className="mt-6 ml-5 list-disc space-y-3 font-sans text-base leading-relaxed text-ink/70">
            <li><strong>PSAR / FSAR.</strong> Multi-thousand-page Safety Analysis Reports organised into NRC-standard chapters (site, design, accident analysis, conduct of operations, technical specifications, QA, decommissioning). Every claim must be traceable to the regulation, the standard, or the analysis that supports it.</li>
            <li><strong>Environmental Report.</strong> NEPA-aligned environmental assessment.</li>
            <li><strong>Security and safeguards plans.</strong> Physical security, cyber, material control and accounting.</li>
            <li><strong>Technical specifications.</strong> Operating limits, surveillance requirements.</li>
            <li><strong>RAIs.</strong> The continuous back-and-forth that determines the licensing timeline.</li>
          </ul>

          <H2>Why timelines slip</H2>
          <P>RAI volume is the single most common driver of licensing schedule risk. RAI volume is itself driven by citation quality and document depth in the original submission. A submission that does not cite the right standard, does not anticipate the regulator's question, or relies on an ambiguous reference, produces more RAIs and longer review.</P>
          <P>The legacy way to mitigate this is to staff up: more senior nuclear engineers, more consultants, more reviewers. That is also why Construction Permit and Operating Licence applications cost what they cost.</P>

          <H2>How autonomous AI agents are changing nuclear compliance</H2>
          <P>Modern AI agents can ingest the NRC ADAMS corpus, the applicable parts of 10 CFR and the IAEA standards, and a project's design and analysis documents. They draft sections of the Safety Analysis Report with every claim cited back to the rule or analysis that supports it, generate RAI responses with traceable evidence, build the verification matrix against 10 CFR requirements, and continuously monitor the underlying regulations for changes.</P>
          <P>The bottleneck for reliable agentic work in this domain has been retrieval. General-purpose retrieval models are not good enough at nuclear-domain language to safely ground a regulatory submission. <strong>Invariant's Helion-512</strong> retrieval model holds the published state of the art on FermiBench at <strong>0.9693 nDCG@10</strong>, up from the previous best of 0.74. That is the foundation that makes citation grounding work.</P>
          <P>Agents do not replace the licensing engineer or the regulator. They remove the documentation grind.</P>

          <H2>Frequently asked questions</H2>
          <div className="mt-8 divide-y divide-ink/10">
            {FAQS.map((f) => (
              <div key={f.question} className="py-6">
                <h3 className="font-serif text-xl font-normal text-ink">{f.question}</h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-ink/65">{f.answer}</p>
              </div>
            ))}
          </div>

          <H2 small>Primary sources</H2>
          <ul className="mt-6 ml-5 list-disc space-y-2 font-sans text-sm text-ink/65">
            {CITATIONS.map((c) => (
              <li key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-4 hover:text-copper hover:decoration-copper/60">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Last updated 11 June 2026</p>
        </div>
      </article>
    </>
  )
}

function H2({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <h2
      className={`mt-16 font-serif font-normal leading-[1.1] tracking-[-0.02em] text-ink ${
        small ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
      }`}
    >
      {children}
    </h2>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-5 font-sans text-base leading-relaxed text-ink/70">{children}</p>
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[3px] border border-ink/10 bg-white p-6 md:p-7">
      <h3 className="font-serif text-xl font-normal tracking-[-0.01em] text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}
