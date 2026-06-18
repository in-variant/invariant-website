import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../../components/Seo'

const URL = `${SITE_URL}/calculators/cfr-citation-formatter`

type ParsedRef = {
  title: number
  part: number
  section?: string
  paragraph?: string
  appendix?: string
  raw: string
}

const TITLE_LABELS: Record<number, string> = {
  10: 'Energy',
  14: 'Aeronautics and Space',
  15: 'Commerce and Foreign Trade',
  22: 'Foreign Relations',
  47: 'Telecommunication',
  49: 'Transportation',
}

const TITLE_AGENCIES: Record<number, string> = {
  10: 'NRC and DOE',
  14: 'FAA',
  15: 'NOAA, BIS, ITA',
  22: 'State Department, DDTC',
  47: 'FCC',
  49: 'PHMSA, DOT',
}

function parseRef(input: string): ParsedRef | null {
  const cleaned = input
    .trim()
    .replace(/[§  ]/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase()
  if (!cleaned) return null

  const re = /^(\d{1,2})\s*(?:CFR|C\.F\.R\.)?\s*(?:PART\s+)?(\d+)(?:\.(\d+[a-z]?))?(\([a-z0-9]+\)(?:\([a-z0-9]+\))*)?(?:\s+APP(?:ENDIX)?\.?\s*([A-Z0-9]+))?/i.exec(
    cleaned,
  )
  if (!re) return null
  const [, title, part, section, paragraph, appendix] = re
  return {
    title: parseInt(title, 10),
    part: parseInt(part, 10),
    section: section || undefined,
    paragraph: paragraph || undefined,
    appendix: appendix || undefined,
    raw: input.trim(),
  }
}

function ecfrUrl(p: ParsedRef): string {
  const base = `https://www.ecfr.gov/current/title-${p.title}`
  if (p.appendix) return `${base}/part-${p.part}/appendix-${p.appendix}`
  if (p.section) return `${base}/section-${p.part}.${p.section}`
  return `${base}/part-${p.part}`
}

function plainCite(p: ParsedRef): string {
  let s = `${p.title} CFR `
  if (p.appendix) s += `Part ${p.part}, Appendix ${p.appendix}`
  else if (p.section) s += `${p.part}.${p.section}`
  else s += `Part ${p.part}`
  if (p.paragraph) s += p.paragraph
  return s
}

function bluebookCite(p: ParsedRef): string {
  let s = `${p.title} C.F.R. `
  if (p.appendix) s += `pt. ${p.part} app. ${p.appendix}`
  else if (p.section) s += `Section ${p.part}.${p.section}`
  else s += `pt. ${p.part}`
  if (p.paragraph) s += p.paragraph
  s += ` (${new Date().getFullYear()})`
  return s
}

function fedRegSearchUrl(p: ParsedRef): string {
  const q = encodeURIComponent(`${p.title} CFR ${p.part}${p.section ? '.' + p.section : ''}`)
  return `https://www.federalregister.gov/documents/search?conditions[term]=${q}`
}

function jsonLdCite(p: ParsedRef, url: string): string {
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    legislationType: 'Regulation',
    legislationIdentifier: plainCite(p),
    name: plainCite(p),
    url,
    legislationJurisdiction: 'US',
    legislationLegalForce: 'InForce',
  }
  return JSON.stringify(obj, null, 2)
}

const EXAMPLES = [
  { input: '10 CFR 50.34', label: 'NRC PSAR content (Part 50)' },
  { input: '10 CFR 52.79', label: 'NRC COL applications (Part 52)' },
  { input: '10 CFR 53.420', label: 'Part 53 PRA requirements' },
  { input: '14 CFR 450.101', label: 'FAA Part 450 public safety' },
  { input: '14 CFR 450.43', label: 'FAA payload review' },
  { input: '47 CFR 25.114', label: 'FCC orbital debris plan' },
  { input: '47 CFR 25.122', label: 'FCC streamlined smallsat' },
  { input: '15 CFR 960.8', label: 'NOAA Tier 1 remote sensing' },
  { input: '22 CFR 120.5', label: 'ITAR jurisdiction' },
  { input: '22 CFR 125.4', label: 'ITAR license exemptions' },
  { input: '15 CFR 774', label: 'EAR Commerce Control List' },
  { input: '10 CFR 73.55', label: 'NRC physical security' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper transition-colors hover:text-ink"
      aria-label="Copy"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function CfrCitationFormatter() {
  const [input, setInput] = useState('10 CFR 50.34')
  const parsed = useMemo(() => parseRef(input), [input])

  return (
    <>
      <Seo
        title="CFR citation formatter: build eCFR deep links and Bluebook cites"
        description="Free tool to format any Code of Federal Regulations citation: plain text, Bluebook, eCFR URL, and JSON-LD. Covers 10 CFR (NRC), 14 CFR (FAA), 47 CFR (FCC), 22 CFR (ITAR), 15 CFR (NOAA and EAR)."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        ogType="website"
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            '@id': `${URL}#app`,
            name: 'CFR citation formatter',
            url: URL,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description:
              'Format any CFR reference into plain text, Bluebook, eCFR URL, and JSON-LD citations. Covers NRC, FAA, FCC, NOAA, ITAR, and EAR.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Calculators', url: `${SITE_URL}/calculators` },
            { name: 'CFR citation formatter', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
            <Link to="/calculators" className="hover:text-ink">Calculators</Link> · Free tool
          </p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            CFR citation formatter.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Paste a Code of Federal Regulations reference. Get a clean eCFR deep link, a Bluebook citation, and schema.org JSON-LD for your filings, briefs, and pleadings.
          </p>
          <aside className="mt-8 rounded-[3px] border-l-2 border-copper bg-white/70 px-5 py-4 md:px-6 md:py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-copper">In one paragraph</p>
            <p className="mt-2 font-serif text-lg leading-relaxed text-ink md:text-xl">
              A CFR citation has three numbers: the title (the broad subject area like Energy or Telecommunication), the part (the rule set within that title), and the section (the specific provision). Standard format is "TITLE CFR PART.SECTION", for example "10 CFR 50.34". The current authoritative copy lives on eCFR.gov.
            </p>
          </aside>

          <div className="mt-10 rounded-[3px] border border-ink/15 bg-white p-6 md:p-7">
            <label htmlFor="cfr-input" className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
              CFR reference
            </label>
            <input
              id="cfr-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="10 CFR 50.34"
              className="mt-2 w-full rounded-[3px] border border-ink/15 bg-paper px-4 py-3 font-mono text-base text-ink placeholder:text-ink/30 focus:border-copper focus:outline-none"
              spellCheck={false}
              autoCapitalize="characters"
              autoComplete="off"
            />
            <p className="mt-2 font-sans text-xs text-ink/50">
              Examples: 10 CFR 50.34, 14 CFR 450.101, 47 CFR 25.122, 22 CFR 120.5
            </p>
          </div>

          {parsed && (
            <div className="mt-8 space-y-6">
              <ResultRow label="Plain text" value={plainCite(parsed)} />
              <ResultRow label="Bluebook" value={bluebookCite(parsed)} />
              <ResultRow label="eCFR deep link" value={ecfrUrl(parsed)} isUrl />
              <ResultRow label="Federal Register search" value={fedRegSearchUrl(parsed)} isUrl />
              <div className="rounded-[3px] border border-ink/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">JSON-LD (schema.org/Legislation)</p>
                  <CopyButton text={jsonLdCite(parsed, ecfrUrl(parsed))} />
                </div>
                <pre className="mt-3 overflow-x-auto whitespace-pre font-mono text-xs text-ink/75">
                  {jsonLdCite(parsed, ecfrUrl(parsed))}
                </pre>
              </div>
              <div className="rounded-[3px] border border-ink/10 bg-white/70 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper">Resolved</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-2 font-sans text-sm text-ink/70 md:grid-cols-4">
                  <dt className="text-ink/55">Title</dt>
                  <dd>{parsed.title} ({TITLE_LABELS[parsed.title] || 'unknown title'})</dd>
                  <dt className="text-ink/55">Agency</dt>
                  <dd>{TITLE_AGENCIES[parsed.title] || 'unmapped'}</dd>
                  <dt className="text-ink/55">Part</dt>
                  <dd>{parsed.part}</dd>
                  <dt className="text-ink/55">Section</dt>
                  <dd>{parsed.section || 'whole part'}</dd>
                </dl>
              </div>
            </div>
          )}
          {!parsed && input.trim() && (
            <p className="mt-6 font-sans text-sm text-ink/55">
              That format is not recognised. Try the canonical pattern "TITLE CFR PART.SECTION", for example "10 CFR 50.34".
            </p>
          )}

          <h2 className="mt-16 font-serif text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            Frequently formatted citations.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {EXAMPLES.map((e) => (
              <li key={e.input}>
                <button
                  onClick={() => setInput(e.input)}
                  className="block w-full rounded-[3px] border border-ink/10 bg-white px-4 py-3 text-left transition-colors hover:border-copper/40 hover:bg-paper"
                >
                  <span className="font-mono text-sm text-ink">{e.input}</span>
                  <span className="mt-1 block font-sans text-xs text-ink/55">{e.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-serif text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            How CFR citations work.
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/70 md:text-lg">
            The Code of Federal Regulations is divided into 50 titles by broad subject area. Each title is divided into chapters by agency, parts by topic, and sections by individual provision. A canonical citation reads as "Title CFR Part.Section", with optional paragraph levels in parentheses. For example, 10 CFR 50.34(a)(1)(ii) points to a specific subparagraph of the Part 50 PSAR content rule.
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink/70 md:text-lg">
            The current authoritative copy is hosted at eCFR.gov, the electronic Code of Federal Regulations. The annual published Code is the official record, but most regulated industries cite to eCFR by URL because it carries the current text and a permanent revision history.
          </p>

          <h2 className="mt-16 font-serif text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            Title map for compliance work.
          </h2>
          <ul className="mt-6 space-y-3 font-sans text-base text-ink/70 md:text-lg">
            <li><span className="font-semibold text-ink">10 CFR</span>, Energy. NRC reactor licensing (Parts 50, 52, 53), physical security (Part 73), siting (Part 100), special nuclear material (Part 70), export (Part 110), DOE safety basis (Part 830).</li>
            <li><span className="font-semibold text-ink">14 CFR</span>, Aeronautics and Space. FAA commercial space transportation (<Link to="/faa-part-450-license-timeline" className="text-copper underline decoration-copper/40 underline-offset-4">Part 450</Link>), legacy launch (Parts 415, 417, 431, 435 superseded).</li>
            <li><span className="font-semibold text-ink">15 CFR</span>, Commerce and Foreign Trade. NOAA commercial remote sensing (<Link to="/noaa-remote-sensing-license-tiers" className="text-copper underline decoration-copper/40 underline-offset-4">Part 960</Link>), BIS Export Administration Regulations (Parts 730-774, including the Commerce Control List).</li>
            <li><span className="font-semibold text-ink">22 CFR</span>, Foreign Relations. State Department ITAR (<Link to="/itar-commodity-jurisdiction" className="text-copper underline decoration-copper/40 underline-offset-4">Parts 120-130</Link>), including the US Munitions List in Part 121.</li>
            <li><span className="font-semibold text-ink">47 CFR</span>, Telecommunication. FCC satellite communications (<Link to="/fcc-schedule-s" className="text-copper underline decoration-copper/40 underline-offset-4">Part 25</Link>) including the orbital debris rule, broadcast and common-carrier services.</li>
            <li><span className="font-semibold text-ink">49 CFR</span>, Transportation. PHMSA hazardous materials in transport (Parts 171-180), including launch vehicle propellants and pressurants.</li>
          </ul>

          <h2 className="mt-16 font-serif text-3xl font-normal tracking-[-0.02em] text-ink md:text-4xl">
            FAQs.
          </h2>
          <div className="mt-8 divide-y divide-ink/10">
            <Faq q="What is the right URL to cite a CFR section?">
              eCFR deep links of the form https://www.ecfr.gov/current/title-X/section-Y.Z are stable and resolve to the current version. The annual paper Code is the record of authority, but most filings and AI search engines accept the eCFR URL as the canonical link.
            </Faq>
            <Faq q="Should I use the section sign in filings?">
              The section sign is the traditional notation, but most modern regulatory submittals and AI-readable formats prefer the spelled word Section or just CFR followed by the numbers. ChatGPT, Claude, and Gemini all parse the spelled form more reliably.
            </Faq>
            <Faq q="What if my reference is to an appendix or a subpart?">
              For appendices, use the form Title CFR Part, Appendix Letter, for example 10 CFR Part 50, Appendix B. For a subpart, use Title CFR Part Subpart Letter, for example 10 CFR Part 50 Subpart C. The formatter resolves single-section references; whole-part references resolve to the part landing page on eCFR.
            </Faq>
            <Faq q="Is this tool free?">
              Yes. It runs entirely in your browser. No reference is sent to a server. If you want the same formatting embedded in your own compliance workflow, the Invariant platform handles bulk CFR resolution with full citation chains and ADAMS docket linking.
            </Faq>
          </div>

          <div className="mt-16 rounded-[3px] border border-ink/15 bg-white p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">For licensing teams</p>
            <h2 className="mt-3 font-serif text-2xl font-normal text-ink md:text-3xl">
              Want this inside your submittal workflow?
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Invariant generates, links, and stress-tests CFR citations across PSAR, FSAR, COL, Part 450 application, and FCC Schedule S workflows. Citations are checked against the current eCFR text, linked to ADAMS dockets where they exist, and updated when the underlying section is amended.
            </p>
            <Link
              to="/product"
              className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-copper bg-copper px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink hover:border-ink"
            >
              See the Invariant platform
              <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

function ResultRow({ label, value, isUrl }: { label: string; value: string; isUrl?: boolean }) {
  return (
    <div className="rounded-[3px] border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">{label}</p>
        <CopyButton text={value} />
      </div>
      <p className="mt-2 break-all font-mono text-sm text-ink">
        {isUrl ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="py-6">
      <h3 className="font-serif text-xl font-normal text-ink">{q}</h3>
      <p className="mt-3 font-sans text-base leading-relaxed text-ink/65">{children}</p>
    </div>
  )
}
