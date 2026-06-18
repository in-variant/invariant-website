#!/usr/bin/env node
// One-shot: add new glossary entries for vocabulary surfaced by the new
// cluster pages so renderLinkified auto-links them in body text.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const FILE = join(ROOT, 'src/pages/_data/glossary.json')

const TODAY = '2026-06-18'

const NEW_ENTRIES = [
  {
    slug: 'shanti-act',
    term: 'SHANTI Act 2025',
    topic: 'nuclear',
    aliases: [
      'SHANTI Act',
      'Sustainable Harnessing and Advancement of Nuclear Energy for Transforming India Act',
      'SHANTI Bill 2025',
    ],
    short_definition:
      'The SHANTI Act is the Indian statute that replaced the Atomic Energy Act 1962 and the CLNDA 2010 with effect from 20 December 2025, opening private reactor build, giving the AERB statutory standing, and replacing the flat operator liability cap with a graded band.',
    full_definition:
      "The Sustainable Harnessing and Advancement of Nuclear Energy for Transforming India Act 2025 (the SHANTI Act) was passed by the Lok Sabha on 17 December 2025 and the Rajya Sabha on 18 December 2025, with Presidential assent on 20 December 2025. It repeals two foundational statutes in a single instrument: the Atomic Energy Act 1962 and the Civil Liability for Nuclear Damage Act 2010, and consolidates Indian nuclear governance into one framework administered by the Department of Atomic Energy with safety regulation by a now-statutory Atomic Energy Regulatory Board.\n\nThe Act admits private companies and joint ventures to reactor build and operation, permits up to 49 percent foreign direct investment in nuclear power joint ventures with an Indian operator retaining majority equity, replaces the flat Rs 1,500 crore CLNDA operator cap with a graded operator liability band running from approximately Rs 100 crore to Rs 3,000 crore by reactor capacity, removes the statutory right of recourse against suppliers under Section 17(b) of the CLNDA, and exempts research and development activity below criticality from licensing. Strategic activities including uranium and thorium mining, isotopic separation and enrichment, reprocessing, heavy water production, and off-site spent fuel management remain reserved to the Central Government.",
    related_to: ['aerb', 'clnda', 'npcil', 'ashvini', 'bharat-small-reactor', 'csc-nuclear-damage', 'part-810', 'dae'],
    citations: [
      { label: 'PRS India: SHANTI Bill 2025 tracker', url: 'https://prsindia.org/billtrack/the-sustainable-harnessing-and-advancementof-nuclear-energy-for-transforming-india-bill-2025' },
      { label: 'PIB: SHANTI Act explainer (December 2025)', url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/dec/doc20251222741701.pdf' },
      { label: 'World Nuclear News: SHANTI Bill completes legislative process', url: 'https://www.world-nuclear-news.org/articles/indias-shanti-bill-completes-legislative-process' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'bharat-small-reactor',
    term: 'Bharat Small Reactor',
    topic: 'nuclear',
    aliases: ['BSR', 'BSR program', 'Bharat Small Reactor program'],
    short_definition:
      'The Bharat Small Reactor (BSR) program is NPCIL\'s 220 MWe pressurised heavy water reactor offered to private industrial users under a captive use commercial model, financed by the industrial partner and operated by NPCIL under AERB licence.',
    full_definition:
      "The Bharat Small Reactor (BSR) program is NPCIL's vehicle for privately financed deployment of 220 MWe pressurised heavy water reactors derived from the IPHWR-220 design. NPCIL issued the Request for Proposal on 31 December 2024 and extended the submission deadline to 31 March 2026. The commercial structure separates capital from operations: the private partner provides land, cooling water, site preparation, and full lifecycle finance including decommissioning, while NPCIL retains design authority, owns the plant on completion, and operates and maintains it under AERB licence. Electricity is delivered for captive use by the financing industrial user; surplus may be sold at a Department of Atomic Energy determined tariff.\n\nSix industrial groups have responded to the BSR RFP: Reliance Industries, Adani Power, Tata Power, JSW Energy, Jindal Steel and Power, and Hindalco Industries. The target customer base is energy-intensive manufacturing including steel, aluminium, copper smelting, and cement. The Nuclear Energy Mission announced in Union Budget 2025-26 carries an outlay of Rs 20,000 crore and commits the government to operationalising at least five indigenously developed small modular reactors by 2033, with a separate parallel 200 MWe Bharat Small Modular Reactor (BSMR) design under development through BARC.",
    related_to: ['npcil', 'aerb', 'shanti-act', 'dae', 'ashvini'],
    citations: [
      { label: 'World Nuclear News: NPCIL BSR RFP', url: 'https://www.world-nuclear-news.org/articles/npcil-seeks-proposals-for-privately-funded-small-reactor-projects' },
      { label: 'PIB: Union Budget 2025-26 Nuclear Mission', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2099244' },
      { label: 'Engineers India Limited: BSR MoU with NPCIL', url: 'https://engineersindia.com/Media/Details/EIL-signs-MoU-with-NPCIL-to-provide-engineering-services-for--Bharat-Small-Reactor-(BSR)' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'ashvini',
    term: 'ASHVINI (Anushakti Vidhyut Nigam)',
    topic: 'nuclear',
    aliases: ['Anushakti Vidhyut Nigam', 'ASHVINI joint venture', 'Anushakti Vidhyut Nigam Limited'],
    short_definition:
      'ASHVINI, formally Anushakti Vidhyut Nigam Limited, is a 51 percent NPCIL and 49 percent NTPC joint venture approved on 11 September 2024 and restructured on 9 January 2025 with authorised share capital of Rs 15,000 crore, set up to build large new-build nuclear capacity in India.',
    full_definition:
      "ASHVINI, formally Anushakti Vidhyut Nigam Limited, is a joint venture of Nuclear Power Corporation of India Limited (51 percent) and NTPC Limited (49 percent) approved by the Government of India on 11 September 2024. On 9 January 2025 the parties signed a supplementary joint venture agreement raising the authorised share capital from Rs 5 crore to Rs 15,000 crore. The Mahi Banswara Rajasthan Atomic Power Project, four units of 700 MWe based on the indigenous PHWR design, was transferred from NPCIL to ASHVINI as the inaugural project.\n\nASHVINI is positioned to take up additional reactor sites and is expected to be one of the earliest vehicles to test the SHANTI Act licensing framework for a major new build. The structure pairs NPCIL's reactor design and operating experience with NTPC's project finance scale and grid integration expertise, and is a template for further large new-build joint ventures under the SHANTI Act.",
    related_to: ['npcil', 'shanti-act', 'aerb', 'dae'],
    citations: [
      { label: 'NTPC: ASHVINI JV approval press release', url: 'https://ntpc.co.in/media/press-releases/govt-accords-approval-npcil-ntpc-jv-company-ashvini-take-nuclear-power' },
      { label: 'World Nuclear Association: India country profile', url: 'https://world-nuclear.org/information-library/country-profiles/countries-g-n/india' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'aerb',
    term: 'Atomic Energy Regulatory Board',
    topic: 'nuclear',
    aliases: ['AERB', 'AERB India', 'Indian nuclear regulator'],
    short_definition:
      'The AERB is the Indian nuclear and radiation safety regulator, given statutory standing under the SHANTI Act 2025 with powers of licensing, inspection, suspension, and penalty over all civilian nuclear and radiation facilities in India.',
    full_definition:
      "The Atomic Energy Regulatory Board (AERB) is the safety regulator for civilian nuclear and radiation facilities in India. Originally constituted in November 1983 under Section 27 of the Atomic Energy Act 1962, the AERB was given full statutory standing under the SHANTI Act 2025 with independent powers of licensing, inspection, suspension, and financial penalty. Its consent chain covers siting consent, construction consent, commissioning authorisation including first approach to criticality, operating licence, and decommissioning authorisation, with periodic safety review at AERB-defined intervals.\n\nThe AERB publishes a code-and-guide framework structured around AERB/SC/G (the umbrella safety code on regulation of nuclear and radiation facilities), reactor-design and operation specific codes (AERB/SC/D, AERB/SC/O), and supporting safety guides. For small modular reactors, AERB has confirmed that its existing code framework will be supplemented with SMR-specific provisions covering modular construction, passive safety systems, multi-unit siting, and factory fabrication quality assurance.",
    related_to: ['shanti-act', 'npcil', 'dae', 'bharat-small-reactor', 'ashvini'],
    citations: [
      { label: 'AERB official site', url: 'https://www.aerb.gov.in' },
      { label: 'AERB Safety Codes and Guides', url: 'https://www.aerb.gov.in/english/safety-documents' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'npcil',
    term: 'Nuclear Power Corporation of India',
    topic: 'nuclear',
    aliases: ['NPCIL', 'Nuclear Power Corporation of India Limited'],
    short_definition:
      "NPCIL is the Government of India undertaking under the Department of Atomic Energy that designs, builds, owns, and operates India's civilian nuclear power plants, including under the Bharat Small Reactor program and the ASHVINI joint venture.",
    full_definition:
      "Nuclear Power Corporation of India Limited (NPCIL) is a Government of India undertaking under the Department of Atomic Energy. Incorporated in 1987, NPCIL designs, builds, owns, and operates India's civilian nuclear power plants, with installed capacity of approximately 8.2 GWe across multiple sites and a project pipeline targeting 22.48 GWe by 2031-32. After the SHANTI Act 2025, NPCIL remains the principal operator for state-led builds and acts as the design authority and operator under the Bharat Small Reactor program, where private partners finance the plant and NPCIL operates it under AERB licence. NPCIL is the majority partner (51 percent) in the ASHVINI joint venture with NTPC."
    ,
    related_to: ['aerb', 'shanti-act', 'bharat-small-reactor', 'ashvini', 'dae'],
    citations: [
      { label: 'NPCIL official site', url: 'https://www.npcil.nic.in' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'dae',
    term: 'Department of Atomic Energy',
    topic: 'nuclear',
    aliases: ['DAE', 'Indian Department of Atomic Energy'],
    short_definition:
      'The Department of Atomic Energy (DAE) is the Government of India department, established 1954, that administers civilian atomic energy policy, the Bhabha Atomic Research Centre, NPCIL, and other reserved-activity research institutions.',
    full_definition:
      "The Department of Atomic Energy (DAE), established 1954, is the Government of India department responsible for nuclear policy, research, and the institutional infrastructure for India's civilian atomic energy programme. It administers the Bhabha Atomic Research Centre (BARC), Indira Gandhi Centre for Atomic Research (IGCAR), the Heavy Water Board, Nuclear Fuel Complex, and NPCIL, among others. Under the SHANTI Act 2025, the DAE retains policy control and continues to administer fuel cycle activities reserved to the state, including uranium and thorium mining, enrichment, reprocessing, and heavy water production. Day-to-day safety regulation is exercised by the AERB.",
    related_to: ['aerb', 'npcil', 'shanti-act', 'bharat-small-reactor'],
    citations: [
      { label: 'Department of Atomic Energy', url: 'https://dae.gov.in' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'clnda',
    term: 'Civil Liability for Nuclear Damage Act 2010',
    topic: 'nuclear',
    aliases: ['CLNDA', 'CLNDA 2010', 'Civil Liability for Nuclear Damage Act'],
    short_definition:
      'The CLNDA was the Indian statute that defined nuclear operator liability and the controversial right of recourse against suppliers under Section 17(b). It was repealed on 20 December 2025 by the SHANTI Act.',
    full_definition:
      "The Civil Liability for Nuclear Damage Act 2010 (CLNDA) channelled liability for a nuclear incident to the operator with a flat statutory cap of Rs 1,500 crore for reactors of 10 MW thermal and above, with the Central Government assuming residual liability up to 300 million SDR under the Convention on Supplementary Compensation. The Act's distinctive feature, Section 17(b), preserved the operator's statutory right of recourse against suppliers for patent or latent defects or sub-standard services. Section 46 preserved parallel civil and criminal action.\n\nFor more than a decade, Section 17(b) was the principal obstacle to participation by foreign reactor vendors in the Indian market because it inverted the channelling principle adopted in the rest of the international civil-liability regime. The CLNDA was repealed in full on 20 December 2025 by the SHANTI Act, which replaced its flat cap with a graded operator cap, removed the statutory right of recourse, and confined supplier liability to written contract terms or proof of intent to cause damage.",
    related_to: ['shanti-act', 'csc-nuclear-damage', 'aerb', 'npcil'],
    citations: [
      { label: 'India Code: CLNDA 2010 text', url: 'https://www.indiacode.nic.in/bitstream/123456789/2084/1/201038.pdf' },
      { label: 'DAE FAQs on CLNDA', url: 'https://dae.gov.in/faqs-version-2-0-on-clnd-act-2010/' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'csc-nuclear-damage',
    term: 'Convention on Supplementary Compensation for Nuclear Damage',
    topic: 'nuclear',
    aliases: ['CSC', 'Convention on Supplementary Compensation', 'CSC Convention'],
    short_definition:
      'The Convention on Supplementary Compensation for Nuclear Damage (CSC) is the IAEA-administered umbrella treaty that creates a global supplementary fund for nuclear damages and aligns operator liability ceilings at 300 million SDR.',
    full_definition:
      "The Convention on Supplementary Compensation for Nuclear Damage (CSC), adopted at the IAEA in September 1997 and entered into force in April 2015, is the umbrella treaty designed to harmonise civil nuclear liability across both Paris and Vienna regime parties and any state with national legislation that meets the Annex requirements. It establishes a two-layer compensation regime: a national tier provided by the installation state to a floor of 300 million Special Drawing Rights, and an international fund contributed by all CSC parties.\n\nIndia ratified the CSC on 4 February 2016. Its operator-liability framework, both under the CLNDA 2010 and now under the SHANTI Act 2025 graded cap, is calibrated to the 300 million SDR ceiling. The CSC also entrenches channelling of liability to the operator and limits recourse against suppliers to terms set by contract or intent, the model adopted by the SHANTI Act.",
    related_to: ['shanti-act', 'clnda', 'iaea'],
    citations: [
      { label: 'IAEA: India ratifies the CSC', url: 'https://www.iaea.org/newscenter/news/india-joins-convention-supplementary-compensation-nuclear-damage' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'eo-14301',
    term: 'Executive Order 14301',
    topic: 'nuclear',
    aliases: ['EO 14301', 'Reforming Nuclear Reactor Testing at the Department of Energy'],
    short_definition:
      'EO 14301, "Reforming Nuclear Reactor Testing at the Department of Energy", signed 23 May 2025, established the DOE Advanced Reactor Pilot Program to authorise at least three privately funded test reactors to reach criticality by 4 July 2026 outside the national laboratories.',
    full_definition:
      "Executive Order 14301, \"Reforming Nuclear Reactor Testing at the Department of Energy,\" was signed by President Donald J. Trump on 23 May 2025 as part of a four-order package targeting a quadrupling of installed United States nuclear capacity from roughly 100 GW to 400 GW by 2050. Section 5(a) of EO 14301 directs the Secretary of Energy to approve at least three reactors under a new pilot program with the goal of achieving criticality in each by 4 July 2026. The order compresses the legacy DOE reactor authorisation workflow from more than 1,500 pages and 17 sequential steps down to roughly 600 pages and 11 steps, and runs on DOE's standalone Atomic Energy Act authority under Sections 31, 91, and 110, implemented through 10 CFR Part 830 and DOE-STD-3009, the same regime governing more than 70 reactors at Idaho National Laboratory and Oak Ridge.\n\nDOE issued the Request for Application on 18 June 2025 and announced 11 selected projects from 10 companies on 12 August 2025. Antares Nuclear Mark-0 achieved first criticality on 3 June 2026 at Idaho National Laboratory's RACE facility, becoming the first private advanced reactor to reach criticality under the pilot.",
    related_to: ['part-810', 'eo-14335', 'iaea'],
    citations: [
      { label: 'White House: EO 14301', url: 'https://www.whitehouse.gov/presidential-actions/2025/05/reforming-nuclear-reactor-testing-at-the-department-of-energy/' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'eo-14335',
    term: 'Executive Order 14335',
    topic: 'space',
    aliases: ['EO 14335', 'Enabling Competition in the Commercial Space Industry'],
    short_definition:
      'EO 14335, "Enabling Competition in the Commercial Space Industry", signed August 2025, directed the Department of Transportation to reevaluate, amend, or rescind portions of 14 CFR Part 450 within 120 days and referenced AI in commercial space safety research.',
    full_definition:
      'Executive Order 14335, "Enabling Competition in the Commercial Space Industry," signed in August 2025, directed the Department of Transportation to reevaluate, amend, or rescind portions of 14 CFR Part 450 within 120 days. The order responded to mounting industry criticism of FAA Part 450 backlog documented in Congressional Research Service report R48582 and in 2024 to 2025 reporting in SpaceNews and SpacePolicyOnline. The order also referenced artificial intelligence in commercial space safety research and signalled federal openness to AI-assisted licensing workflows. The FAA ended the Part 450 legacy transition period in March 2026, forcing every active applicant onto the new regime regardless of whether their application had cleared.',
    related_to: ['faa-part-450', 'eo-14301'],
    citations: [
      { label: 'White House: EO 14335', url: 'https://www.whitehouse.gov/presidential-actions/2025/08/enabling-competition-in-the-commercial-space-industry/' },
      { label: 'CRS Report R48582', url: 'https://www.congress.gov/crs-product/R48582' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'part-810',
    term: '10 CFR Part 810',
    topic: 'nuclear',
    aliases: ['Part 810', 'DOE Part 810', '10 CFR 810'],
    short_definition:
      "10 CFR Part 810 is the US Department of Energy regulation governing transfer of unclassified nuclear technology to foreign nationals or facilities, administered through general and specific authorisations under DOE's Atomic Energy Act Section 57b.(2) authority.",
    full_definition:
      "10 CFR Part 810 is the US Department of Energy regulation governing the export and transfer of unclassified nuclear technology, derived from Section 57b.(2) of the Atomic Energy Act of 1954. It distinguishes between general authorisation, which applies to specified destinations and activities without case-by-case approval, and specific authorisation, which requires written DOE approval for transfers to non-listed countries or controlled activities. Part 810 is administered by DOE's National Nuclear Security Administration and runs in parallel with Nuclear Regulatory Commission export licensing under 10 CFR Part 110 and Commerce Department dual-use controls under the EAR.\n\nFor India, the operating breakthrough came on 26 March 2025 when DOE issued specific authorisation IN-2023-001 to Holtec International to transfer SMR-300 unclassified small modular reactor technology to named Indian counterparties Larsen and Toubro, Tata Consulting Engineers, and Holtec Asia. The authorisation runs for ten years with a five-year review and is limited to peaceful use under IAEA safeguards. It is the first SMR-specific Part 810 authorisation for India and the operating template under which other US vendors can pursue equivalent authorisations.",
    related_to: ['shanti-act', 'iaea'],
    citations: [
      { label: '10 CFR Part 810 (eCFR)', url: 'https://www.ecfr.gov/current/title-10/chapter-III/part-810' },
      { label: 'Holtec Part 810 authorisation for SMR-300', url: 'https://holtecinternational.com/wp-content/uploads/2025/03/40.07.pdf' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'helion-512',
    term: 'Helion-512',
    topic: 'nuclear',
    aliases: ['Helion 512', 'Invariant Helion-512'],
    short_definition:
      'Helion-512 is the Invariant retrieval model that scores 0.9693 nDCG at 10 on FermiBench, the published state of the art on retrieval over the NRC regulatory corpus.',
    full_definition:
      "Helion-512 is the retrieval model developed by Invariant and evaluated on FermiBench, the published benchmark for retrieval over the United States Nuclear Regulatory Commission ADAMS corpus. Helion-512 scores 0.9693 nDCG at 10 on FermiBench, the published state of the art at the time of writing. The model uses 512-dimensional embeddings tuned on regulatory language and is integrated into the Invariant compliance platform for NRC, FAA, FCC, NOAA, AERB, and IN-SPACe workflows. The model card, methodology, and harness are documented at invariant-ai.com/blog/fermibench-sota.",
    related_to: ['fermi-bench', 'adams'],
    citations: [
      { label: 'Invariant: FermiBench state of the art writeup', url: 'https://invariant-ai.com/blog/fermibench-sota' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'fermi-bench',
    term: 'FermiBench',
    topic: 'nuclear',
    aliases: ['Fermi Bench', 'Fermi-Bench'],
    short_definition:
      'FermiBench is the Invariant-published benchmark for retrieval over the NRC ADAMS regulatory corpus, with the public ADAMS search interface as the comparison probe. The Helion-512 model scores 0.9693 nDCG at 10.',
    full_definition:
      "FermiBench is a public benchmark constructed by Invariant for retrieval evaluation over the United States Nuclear Regulatory Commission ADAMS document corpus, the largest single nuclear regulatory corpus in the world. The benchmark uses the public ADAMS search interface as the comparison probe, scores retrieval with nDCG at 10, and reports recall at 1 for the controlling clause. The Invariant Helion-512 model scores 0.9693 nDCG at 10, the published state of the art at the time of writing. The benchmark is intended to make AI-for-nuclear-compliance vendor claims comparable on the underlying retrieval problem rather than on slideware. Full methodology is at invariant-ai.com/blog/fermibench-sota.",
    related_to: ['helion-512', 'adams'],
    citations: [
      { label: 'Invariant: FermiBench writeup', url: 'https://invariant-ai.com/blog/fermibench-sota' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'atomic-canyon',
    term: 'Atomic Canyon',
    topic: 'nuclear',
    aliases: ['Atomic Canyon Neutron'],
    short_definition:
      'Atomic Canyon is a US AI-for-nuclear-compliance company that ships Neutron, an ADAMS-indexed search product backed by the open-source FERMI sentence-embedding model family trained on the Oak Ridge Frontier supercomputer.',
    full_definition:
      "Atomic Canyon emerged from stealth on 11 March 2024 with Neutron, an AI search platform trained on the NRC's Agencywide Documents Access and Management System (ADAMS). The launch release cited 52 million pages of ADAMS content; Oak Ridge National Laboratory's later coverage cited the corpus as more than 3 million documents covering roughly 53 million pages of US reactor history since 1980. Founders Trey Lauderdale and Kristian Kielhofner came from healthcare and unified communications. The technical core is FERMI, a family of open-source sentence-embedding models trained for nuclear vocabulary on the Frontier exascale supercomputer at Oak Ridge.\n\nOn 24 February 2026, ORNL formally announced a memorandum of understanding with Atomic Canyon combining ORNL's HPC infrastructure with Atomic Canyon's AI to automate portions of the NRC license-application review process. Atomic Canyon also runs a parallel partnership with Idaho National Laboratory to build a comprehensive benchmark suite for nuclear RAG and LLM systems under permissive open-source licences. Atomic Canyon's flagship enterprise reference is Pacific Gas and Electric's Diablo Canyon Power Plant.",
    related_to: ['adams', 'fermi-bench', 'helion-512'],
    citations: [
      { label: 'Atomic Canyon', url: 'https://atomiccanyon.com' },
      { label: 'ORNL: Atomic Canyon MoU', url: 'https://www.ornl.gov/news/ornl-and-atomic-canyon-sign-memorandum-understanding-advance-ai-nuclear-energy' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'inductive',
    term: 'Inductive (Nuclear Licensing Accelerator)',
    topic: 'nuclear',
    aliases: ['Inductive', 'Nuclear Licensing Accelerator', 'Trueclean Energy Technologies'],
    short_definition:
      'Inductive, operating as Nuclear Licensing Accelerator and headquartered in San Francisco, is an AI-for-nuclear-compliance startup that markets itself as "TurboTax for nuclear licensing" with a collaborative authoring workspace built on the OpenPRA schema.',
    full_definition:
      "Inductive, operating under the brand Nuclear Licensing Accelerator at nuclearcore.ai, pitches itself as TurboTax for nuclear licensing. The legal entity is Trueclean Energy Technologies Inc., headquartered in San Francisco. Co-founders Rahul Agarwal (API platform and cloud infrastructure software) and Mihai A. Diaconeasa (North Carolina State University Nuclear Engineering, 2023 ANS David Okrent Award) anchor the team. The product is a collaborative authoring workspace for licensing submittals with section-by-section drafting, requirement tracking, multi-user review, role-based access control, and audit logging. The underlying data layer uses the OpenPRA schema as the canonical representation for probabilistic risk assessment models, with conversion pipelines from SAPHIRE file formats.",
    related_to: ['atomic-canyon', 'everstar', 'fermi-bench'],
    citations: [
      { label: 'Nuclear Licensing Accelerator', url: 'https://nuclearcore.ai' },
    ],
    last_updated: TODAY,
  },
  {
    slug: 'everstar',
    term: 'Everstar Gordian',
    topic: 'nuclear',
    aliases: ['Everstar', 'Gordian', 'Everstar AI'],
    short_definition:
      "Everstar is a New York-based AI-for-nuclear-compliance startup whose Gordian product is a retrieval-augmented platform with deterministic compute paths for numerical claims, used in the NRIC HTGR demonstration with Idaho National Laboratory and Microsoft.",
    full_definition:
      "Everstar is a New York-based company founded by CEO Kevin Kong with a founding team drawn from financial-services AI and nuclear engineering. Its Gordian product is a retrieval-augmented generation platform paired with deterministic compute paths for numerical claims, so that any number reproduced from a regulatory or engineering source can be traced through the computation that produced it. Gordian was named in the Department of Energy press release on the National Reactor Innovation Center (NRIC) High-Temperature Gas-cooled Reactor demonstration at Idaho National Laboratory with Microsoft, which is the most visible public deployment of an AI-for-nuclear-compliance product as of mid-2026.",
    related_to: ['atomic-canyon', 'inductive', 'fermi-bench'],
    citations: [
      { label: 'Everstar', url: 'https://everstar.ai' },
    ],
    last_updated: TODAY,
  },
]

function main() {
  const g = JSON.parse(readFileSync(FILE, 'utf8'))
  const existingSlugs = new Set(g.entries.map((e) => e.slug))
  let added = 0
  for (const e of NEW_ENTRIES) {
    if (existingSlugs.has(e.slug)) {
      console.log('skip existing:', e.slug)
      continue
    }
    g.entries.push(e)
    added++
  }
  // Sort by slug for deterministic diffs
  g.entries.sort((a, b) => a.slug.localeCompare(b.slug))
  writeFileSync(FILE, JSON.stringify(g, null, 2) + '\n')
  console.log(`added ${added} of ${NEW_ENTRIES.length} entries; total now ${g.entries.length}`)
}

main()
