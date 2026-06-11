import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../components/Seo'

const URL = `${SITE_URL}/regulators`

type Reg = {
  acronym: string
  name: string
  agency: string
  jurisdiction: string
  whatTheyDo: string
  primaryUrl: string
  glossarySlug?: string
  clusterSlug?: string
}

const US_NUCLEAR: Reg[] = [
  {
    acronym: 'NRC',
    name: 'Nuclear Regulatory Commission',
    agency: 'Independent federal agency',
    jurisdiction: 'Civilian commercial nuclear power plants, fuel-cycle facilities, materials',
    whatTheyDo:
      'Licenses commercial reactors under 10 CFR Parts 50, 52, 53; oversees PSAR/FSAR drafting, RAI handling, ITAAC closure, and operating-license review.',
    primaryUrl: 'https://www.nrc.gov',
    clusterSlug: 'nuclear-compliance',
  },
  {
    acronym: 'DOE',
    name: 'Department of Energy',
    agency: 'Cabinet department',
    jurisdiction: 'Government-owned nuclear assets, advanced reactor R&D, fuel supply',
    whatTheyDo:
      'Funds advanced reactor demonstrations through ARDP, regulates Section 123 Agreements, and operates the national laboratories.',
    primaryUrl: 'https://www.energy.gov/ne/nuclear-energy',
  },
  {
    acronym: 'DOE/NNSA',
    name: 'National Nuclear Security Administration',
    agency: 'Semi-autonomous DOE agency',
    jurisdiction: 'Weapons stockpile, naval reactors, non-proliferation',
    whatTheyDo:
      'Manages stockpile stewardship and naval nuclear propulsion. Not the civilian regulator. Many advanced reactor materials regimes intersect NNSA controls.',
    primaryUrl: 'https://www.energy.gov/nnsa',
  },
]

const US_SPACE: Reg[] = [
  {
    acronym: 'FAA AST',
    name: 'Office of Commercial Space Transportation',
    agency: 'FAA division',
    jurisdiction: 'Commercial launch, reentry, spaceports',
    whatTheyDo:
      'Issues launch and reentry licenses under 14 CFR Part 450, runs the pre-application consultation under 14 CFR 413.5, accepts Means of Compliance.',
    primaryUrl: 'https://www.faa.gov/space',
    glossarySlug: 'faa-ast',
    clusterSlug: 'faa-part-450-license-timeline',
  },
  {
    acronym: 'FCC Space Bureau',
    name: 'Space Bureau',
    agency: 'FCC bureau',
    jurisdiction: 'Satellite radio communications, orbital debris mitigation',
    whatTheyDo:
      'Licenses Part 25 space and earth stations, runs the FCC 22-74 5-year deorbit rule, processes Schedule S satellite engineering data.',
    primaryUrl: 'https://www.fcc.gov/space',
    clusterSlug: 'fcc-5-year-deorbit-rule',
  },
  {
    acronym: 'NOAA CRSRA',
    name: 'Commercial Remote Sensing Regulatory Affairs',
    agency: 'NESDIS office',
    jurisdiction: 'Commercial Earth observation satellites',
    whatTheyDo:
      'Licenses private remote-sensing systems under 15 CFR Part 960, assigns Tier 1/2/3 status, runs the 60-day shot clock under 15 CFR 960.7(c).',
    primaryUrl: 'https://www.nesdis.noaa.gov',
    clusterSlug: 'noaa-remote-sensing-license-tiers',
  },
  {
    acronym: 'DDTC',
    name: 'Directorate of Defense Trade Controls',
    agency: 'State Department',
    jurisdiction: 'ITAR-controlled defense articles and services',
    whatTheyDo:
      'Administers the United States Munitions List, particularly Category XV for spacecraft. Processes Commodity Jurisdiction requests on Form DS-4076.',
    primaryUrl: 'https://www.pmddtc.state.gov',
    clusterSlug: 'itar-vs-ear-for-space-companies',
  },
  {
    acronym: 'BIS',
    name: 'Bureau of Industry and Security',
    agency: 'Commerce Department',
    jurisdiction: 'EAR-controlled dual-use items, ECCN 9x515',
    whatTheyDo:
      'Administers the EAR Commerce Control List, including the 9A515 / 9B515 / 9D515 / 9E515 entries for space items.',
    primaryUrl: 'https://www.bis.doc.gov',
  },
]

const US_AEROSPACE: Reg[] = [
  {
    acronym: 'FAA AVS',
    name: 'Aviation Safety',
    agency: 'FAA service organization',
    jurisdiction: 'Civil aviation airworthiness, design and production approvals',
    whatTheyDo:
      'Issues Type Certificates under 14 CFR Part 21, oversees Parts 23, 25, 27, 29, 33, 35 airworthiness standards, runs the certification project process.',
    primaryUrl: 'https://www.faa.gov/about/office_org/headquarters_offices/avs',
  },
]

export default function Regulators() {
  return (
    <>
      <Seo
        title="Regulators directory — every US agency for space, nuclear, and aerospace compliance"
        description="A concise directory of every US regulator a space, nuclear, or aerospace operator may need to engage with, including NRC, FAA AST, FCC Space Bureau, NOAA CRSRA, DDTC, and BIS."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${URL}#collection`,
            url: URL,
            name: 'Regulators directory',
            isPartOf: { '@id': `${SITE_URL}/#website` },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Regulators', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Reference</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            US regulators, at a glance.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            A concise directory of every US agency a space, nuclear, or aerospace operator may need to engage with. Each entry points at our long-form coverage and the regulator's primary site.
          </p>

          <RegBlock title="Nuclear" rows={US_NUCLEAR} />
          <RegBlock title="Space" rows={US_SPACE} />
          <RegBlock title="Aerospace" rows={US_AEROSPACE} />

          <section className="mt-16 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Allied jurisdictions</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              For UK, EU, India, and Japan content, see the regional guides linked from the {' '}
              <Link to="/compliance" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                compliance library
              </Link>
              . Our US scope covers the agencies above plus DOE/NNSA, DOT/PHMSA for transportation of radioactive materials, EPA where environmental review intersects, and NASA where heritage standards (GEVS, MIL-STD-1540, MIL-STD-461) flow into commercial qualification.
            </p>
          </section>
        </div>
      </article>
    </>
  )
}

function RegBlock({ title, rows }: { title: string; rows: Reg[] }) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.02em] text-ink md:text-4xl">
        {title}
      </h2>
      <ul className="mt-6 space-y-6">
        {rows.map((r) => (
          <li key={r.acronym} className="rounded-[3px] border border-ink/10 bg-white p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-copper">{r.acronym}</p>
                <h3 className="mt-1 font-serif text-xl font-normal tracking-[-0.01em] text-ink">{r.name}</h3>
                <p className="mt-1 font-sans text-xs text-ink/50">{r.agency} · {r.jurisdiction}</p>
              </div>
              <a
                href={r.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-copper/40 hover:text-copper"
              >
                Visit
              </a>
            </div>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">{r.whatTheyDo}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.clusterSlug && (
                <Link
                  to={`/${r.clusterSlug}`}
                  className="rounded-full border border-ink/15 bg-paper px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-copper/40 hover:text-copper"
                >
                  Full guide →
                </Link>
              )}
              {r.glossarySlug && (
                <Link
                  to={`/glossary/${r.glossarySlug}`}
                  className="rounded-full border border-ink/15 bg-paper px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-copper/40 hover:text-copper"
                >
                  Glossary →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
