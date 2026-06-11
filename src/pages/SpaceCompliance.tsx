import type { ReactNode } from 'react'
import { Seo, articleSchema, faqSchema, breadcrumbSchema, ORG_SCHEMA } from '../components/Seo'

const URL = 'https://invariant-ai.com/space-compliance'

const FAQS = [
  {
    question: 'What is space compliance?',
    answer:
      "Space compliance is the body of regulations, standards, and qualification requirements a spacecraft, launch vehicle, or space-data operator must satisfy to be authorised, launched, operated, and to sell its data or services lawfully. It spans launch licensing (e.g., FAA Part 450), spectrum authorisation (FCC, ITU, national regulators), Earth-observation data dissemination rules (NOAA, national geospatial guidelines), national space-activity authorisation (IN-SPACe in India), and environmental qualification to launch-vehicle and mission-assurance standards (ECSS, NASA GEVS, MIL-STD-1540, MIL-STD-461).",
  },
  {
    question: 'Who regulates space activities?',
    answer:
      'Space activities are regulated nationally. In the United States the primary regulators are the FAA Office of Commercial Space Transportation (launch + reentry), the FCC (spectrum and satellite communications), and NOAA (Earth-observation licensing). In India it is IN-SPACe (authorisation) and DGCA (UAS/aviation). In Europe, ESA + national authorities + the UK Space Agency. ITU coordinates orbital and frequency assignments globally through national administrations.',
  },
  {
    question: 'What is FAA Part 450?',
    answer:
      "14 CFR Part 450 is the streamlined US FAA framework (effective 2021) that consolidated separate launch and reentry licensing regimes into a single performance-based launch and reentry license. It governs commercial orbital, suborbital, and reusable vehicle operations from US territory. Applicants demonstrate safety through quantitative risk analysis and an ongoing safety case rather than the older prescriptive process.",
  },
  {
    question: 'What is IN-SPACe authorisation?',
    answer:
      "IN-SPACe (Indian National Space Promotion and Authorisation Centre) is the single-window regulator authorising non-governmental space activities in India under the Indian Space Policy 2023 and the IN-SPACe Norms, Guidelines and Procedures (NGP 2024). Operators of satellites, launch vehicles, ground stations, and space-data services apply to IN-SPACe; the spectrum chain runs IN-SPACe advisory note → WPC/DoT → ITU.",
  },
  {
    question: 'How long does space licensing take?',
    answer:
      'Realistic timelines: a US FAA Part 450 launch licence is typically 18–24+ months from pre-application to issuance, depending on vehicle novelty and site work. FCC satellite earth-station and Part 25 system authorisations take 6–18 months. IN-SPACe authorisation for an operational constellation typically takes 6–12 months once the spectrum chain (ITU/WPC) is moving. The spectrum filing is usually the longest pole on the critical path to launch.',
  },
  {
    question: 'What environmental qualification tests does a satellite need?',
    answer:
      'A satellite or payload typically goes through vibration (random, sine, sometimes shock/pyroshock), thermal-vacuum cycling and thermal balance, EMI/EMC emissions and susceptibility (often to MIL-STD-461), mass properties, leak, and outgassing/bakeout (TML and CVCM per ASTM E595). Levels are tailored to the launch vehicle\'s payload user guide / interface control document. Smallsats often follow a "protoflight" approach (between qualification and acceptance).',
  },
  {
    question: 'What is ECSS?',
    answer:
      'The European Cooperation for Space Standardization (ECSS) is the standards system developed by ESA, national space agencies, and the European space industry. It is the dominant non-US standards set for civil space (engineering, product assurance, management, and verification). The testing series ECSS-E-ST-10-03 governs environmental qualification.',
  },
  {
    question: 'What is NASA GEVS?',
    answer:
      "NASA's General Environmental Verification Standard (GSFC-STD-7000, GEVS) is NASA Goddard's reference standard for environmental verification of payloads, instruments, and subsystems. It defines testing levels and procedures and is widely used as a baseline outside NASA programs.",
  },
  {
    question: 'Do I need ITAR registration for a space company?',
    answer:
      'It depends on what you build. Launch vehicles and many propulsion components (USML Category IV) and many spacecraft/components (USML Category XV) remain on the US Munitions List and are governed by ITAR; manufacturers and exporters of those defence articles must register with DDTC. After the 2014 Export Control Reform, many commercial satellites and parts moved to the EAR (often ECCN 9x515 or EAR99). Your specific scope determines whether you need DDTC registration and possibly a Technical Assistance Agreement.',
  },
  {
    question: 'What is the difference between qualification and acceptance testing?',
    answer:
      'Qualification testing demonstrates that the design margin is sufficient and is performed at higher levels and durations than expected flight environments. Acceptance testing is performed on each flight unit at expected flight levels to detect workmanship defects. Smallsats often combine these into "protoflight": one unit, higher-than-acceptance level, shorter-than-qualification duration.',
  },
  {
    question: 'How do AI agents accelerate space compliance?',
    answer:
      'Autonomous AI agents can ingest a mission\'s design docs, test data, and the applicable rules, then produce the verification/compliance matrix mapping every requirement to its evidence, draft the test plans and procedures tailored to the launch vehicle\'s ICD, generate regulator-grade submissions, and monitor the underlying regulations for changes — all with explicit citation back to the source rule. They do not replace the test campaign or the regulator. They remove the documentation grind that pulls engineers off the hardware.',
  },
  {
    question: 'What does Invariant do for space companies?',
    answer:
      "Invariant deploys autonomous AI agents plus a small team of forward-deployed domain engineers to run a space company's regulatory and qualification compliance end to end: building the verification/compliance matrix, tailoring test plans to the launch ICD, drafting IN-SPACe / FCC / FAA submissions, producing the launch-provider compliance package, and continuously monitoring rule changes that touch the filings. Backed by Entrepreneurs First.",
  },
]

const CITATIONS = [
  { label: 'FAA Office of Commercial Space Transportation', url: 'https://www.faa.gov/space' },
  { label: 'FAA 14 CFR Part 450 (launch + reentry licence)', url: 'https://www.ecfr.gov/current/title-14/chapter-III/subchapter-C/part-450' },
  { label: 'FCC Part 25 (satellite communications)', url: 'https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-25' },
  { label: 'NOAA Commercial Remote Sensing Licensing', url: 'https://www.nesdis.noaa.gov/commercial-space' },
  { label: 'IN-SPACe (India)', url: 'https://www.inspace.gov.in/' },
  { label: 'IN-SPACe Norms, Guidelines and Procedures 2024', url: 'https://www.inspace.gov.in/' },
  { label: 'Indian Space Policy 2023', url: 'https://www.isro.gov.in/IndianSpacePolicy2023.html' },
  { label: 'ECSS standards', url: 'https://ecss.nl/' },
  { label: 'NASA GEVS (GSFC-STD-7000)', url: 'https://standards.nasa.gov/standard/gsfc/gsfc-std-7000' },
  { label: 'MIL-STD-461 (EMI/EMC)', url: 'https://everyspec.com/MIL-STD/MIL-STD-0300-0499/MIL-STD-461F_19035/' },
  { label: 'ITU Radio Regulations', url: 'https://www.itu.int/pub/R-REG-RR' },
  { label: 'ASTM E595 (outgassing)', url: 'https://www.astm.org/e0595-15r21.html' },
]

export default function SpaceCompliance() {
  const ld = [
    ORG_SCHEMA,
    articleSchema({
      title: 'Space compliance: the global map, the lifecycle, and what gates a launch',
      description:
        'A complete guide to space compliance for satellite, launch, and Earth-observation companies. Regulators, frameworks, environmental qualification, licensing timelines, and where autonomous AI agents help.',
      url: URL,
      datePublished: '2026-06-11',
      dateModified: '2026-06-11',
    }),
    faqSchema(FAQS),
    breadcrumbSchema([
      { name: 'Invariant', url: 'https://invariant-ai.com/' },
      { name: 'Space compliance', url: URL },
    ]),
  ]
  return (
    <>
      <Seo
        title="Space compliance: a complete guide (2026)"
        description="A complete guide to space compliance for satellite, launch, and Earth-observation companies. Regulators, frameworks, environmental qualification, licensing timelines, and how autonomous AI agents are changing the work."
        canonical={URL}
        jsonLd={ld}
        ogType="article"
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Space compliance</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            Space compliance: the global map, the lifecycle, and what gates a launch.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Space compliance is the body of regulations, standards, and qualification requirements a spacecraft, launch vehicle, or space-data operator must satisfy to be authorised, launched, operated, and to sell its data or services lawfully. It spans launch licensing, spectrum coordination, Earth-observation dissemination rules, national authorisations, and environmental qualification to launch-vehicle and mission-assurance standards.
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink/65">
            In practice it is the documentation grind that quietly slips launches. The hardware is rarely the bottleneck. The compliance package is.
          </p>

          <H2>Who regulates space activities</H2>
          <P>Space is regulated nationally, not globally. Operators face an overlapping stack of civil space authorities (launch + reentry), telecommunications regulators (spectrum), remote-sensing authorities (Earth-observation data), and the International Telecommunication Union (orbital frequency coordination).</P>

          <div className="mt-8 space-y-6">
            <Block title="United States">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li><strong>FAA</strong> Office of Commercial Space Transportation (AST): launch + reentry licensing under 14 CFR Part 450.</li>
                <li><strong>FCC</strong>: satellite communications, earth-station licensing, and Part 25 system authorisations.</li>
                <li><strong>NOAA</strong>: Earth-observation licensing under CSLA implementing regulations.</li>
                <li><strong>State/DDTC</strong> (ITAR) and <strong>BIS</strong> (EAR): export controls on launch vehicles, propulsion, and many spacecraft.</li>
              </ul>
            </Block>
            <Block title="India">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li><strong>IN-SPACe</strong>: single-window authorisation under the Indian Space Policy 2023 and NGP 2024.</li>
                <li><strong>DGCA</strong>: aviation and unmanned aerial systems.</li>
                <li><strong>DoT/WPC</strong>: spectrum; ITU filing routed through DoS/IN-SPACe.</li>
              </ul>
            </Block>
            <Block title="Europe">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li><strong>ESA</strong> and the <strong>ECSS</strong> standards system: engineering, product assurance, and verification.</li>
                <li><strong>UK Space Agency</strong> for launch from UK territory; national authorities across Europe.</li>
              </ul>
            </Block>
            <Block title="Other major regimes">
              <ul className="ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                <li>JAXA + MIC (Japan); Australian Space Agency; CSA (Canada); CONAE (Argentina). National authorisation regimes have proliferated post-2020.</li>
                <li><strong>ITU</strong> coordinates orbital and frequency assignments globally, working through national administrations.</li>
              </ul>
            </Block>
          </div>

          <H2>The major compliance frameworks</H2>
          <P>Below are the frameworks that most often appear in a space company's compliance binder.</P>

          <div className="mt-8 space-y-6">
            <Block title="Launch and reentry">
              <P><strong>FAA 14 CFR Part 450</strong> (2021) consolidated the older launch and reentry licensing regimes into a single performance-based licence covering orbital, suborbital, and reusable operations. Applicants demonstrate safety through quantitative risk analysis (e.g., expected casualty figures) and an ongoing safety case rather than prescriptive checklists.</P>
            </Block>
            <Block title="Spectrum and satellite communications">
              <P><strong>FCC Part 25</strong> governs US-jurisdiction satellite communications. <strong>ITU Radio Regulations</strong> coordinate orbital and frequency assignments internationally; filings route through national administrations (in India, IN-SPACe and WPC/DoT). The interference-analysis and coordination process is usually the longest critical-path item to launch.</P>
            </Block>
            <Block title="Earth observation and remote sensing">
              <P><strong>NOAA</strong> licenses commercial remote-sensing systems under CSLA implementing regulations. India's <strong>Geospatial Data Guidelines 2021</strong> and remote-sensing dissemination rules govern resolution thresholds and who an operator may sell to. Both regimes apply when satellite imagery is the product.</P>
            </Block>
            <Block title="National space authorisation (India)">
              <P><strong>IN-SPACe NGP 2024</strong> implements the Indian Space Policy 2023 and prescribes application content, evaluation, and grant of authorisations for satellite operations, ground stations, and space-data services. Only Indian entities (or foreign operators via Indian subsidiaries/JVs) may apply.</P>
            </Block>
            <Block title="Engineering and qualification standards">
              <P><strong>ECSS</strong> is the European standards set; <strong>NASA GEVS (GSFC-STD-7000)</strong> is NASA Goddard's environmental verification reference; <strong>MIL-STD-1540</strong> and <strong>MIL-STD-461</strong> (EMI/EMC) are the military equivalents widely used in commercial smallsats. Launch vehicles publish their own Payload User Guides / Interface Control Documents that tailor the levels.</P>
            </Block>
          </div>

          <H2>The compliance lifecycle for a space company</H2>
          <P>Compliance work follows the program. The output at each phase is a body of documentation that ultimately satisfies the regulator and the launch provider.</P>
          <ol className="mt-8 list-decimal space-y-4 pl-5 font-sans text-base leading-relaxed text-ink/70">
            <li><strong>Concept and feasibility.</strong> Mission concept, target orbit, payload spec, applicable regulators identified. Decisions made here determine ITAR/EAR exposure and the spectrum chain.</li>
            <li><strong>Design (PDR/CDR).</strong> Requirements baselined, allocations to subsystems, applicable standards tailored. The verification/compliance matrix is born here.</li>
            <li><strong>Qualification.</strong> Environmental tests (vibration, TVAC, EMC); test plans tailored from ECSS/NASA/MIL to the launch ICD; test reports and non-conformance records (NCRs) generated.</li>
            <li><strong>Pre-launch and integration.</strong> Compliance package handed to the launch provider, declaration of compliance, RAI cycles, regulatory authorisations obtained.</li>
            <li><strong>Operations.</strong> Ongoing reporting, anomaly disclosures, continuous monitoring of rule changes.</li>
          </ol>

          <H2>Environmental qualification, in practice</H2>
          <P>The launch vehicle imposes the levels. The standards (ECSS, NASA GEVS, MIL-STD-1540, MIL-STD-461, ASTM E595) define the methods. The work that bottlenecks small teams is the documentation around the tests, not the tests themselves.</P>
          <ul className="mt-6 ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
            <li><strong>Vibration &amp; shock.</strong> Random, sine, and shock/pyroshock at qualification, acceptance, or protoflight levels.</li>
            <li><strong>Thermal vacuum (TVAC).</strong> Cycling and balance in vacuum; a bakeout reduces outgassing (TML ≤ 1%, CVCM ≤ 0.1% per ASTM E595).</li>
            <li><strong>EMI/EMC.</strong> Emissions and susceptibility, typically to MIL-STD-461 or the launch provider's spec.</li>
            <li><strong>Supporting tests.</strong> Mass properties, deployment, leak, ESD, materials.</li>
            <li><strong>Documentation.</strong> Verification matrix, test plans + procedures, as-run procedures, test reports, NCRs, waivers, declaration of compliance.</li>
          </ul>

          <H2>What actually gates a launch</H2>
          <P>Three things slip launches far more often than the hardware:</P>
          <ul className="mt-6 ml-5 list-disc space-y-3 font-sans text-base leading-relaxed text-ink/70">
            <li><strong>The spectrum chain.</strong> ITU coordination → national administration → WPC/DoT. Interference analyses take weeks; coordination with neighbouring administrations takes months. Start this on day one.</li>
            <li><strong>The compliance package for the launch provider.</strong> The launch ICD lists environmental requirements; the rideshare integrator demands the verification matrix, test plans, reports, declaration of compliance. Producing it well takes weeks of senior engineer time.</li>
            <li><strong>RAIs and waiver cycles.</strong> A regulator's Request for Additional Information turns into weeks of back-and-forth. Citation quality and document depth in the original submission determine RAI volume.</li>
          </ul>

          <H2>How autonomous AI agents are changing the work</H2>
          <P>Modern AI agents can ingest a mission's design docs, test data, and the applicable rules, then produce the verification/compliance matrix mapping every requirement to its evidence, draft the test plans and procedures tailored to the launch ICD, generate regulator-grade submissions, and monitor the underlying regulations for changes — all with explicit citation back to the source rule. The agents do not replace the test campaign or the regulator. They remove the documentation grind that pulls engineers off the hardware.</P>
          <P>Invariant builds this layer. Our agents handle drafting, traceability, and continuous monitoring across the space regulatory and qualification surface. A small team of forward-deployed domain engineers handles deployment and high-stakes review.</P>

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
