import { Link } from 'react-router-dom'
import { KeystoneMark } from './Logo'

const COLUMNS = [
  {
    title: 'Compliance',
    links: [
      { label: 'Space compliance', to: '/space-compliance' },
      { label: 'Nuclear compliance', to: '/nuclear-compliance' },
      { label: 'Regulators', to: '/regulators' },
      { label: 'Glossary', to: '/glossary' },
      { label: 'Library', to: '/compliance' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Part 50 vs 52 vs 53', to: '/part-50-vs-52-vs-53' },
      { label: 'NRC license timeline', to: '/how-long-does-nrc-license-take' },
      { label: 'How to write a PSAR', to: '/how-to-write-a-psar' },
      { label: 'NRC pre-application', to: '/nrc-pre-application-engagement-guide' },
      { label: 'FAA Part 450 timeline', to: '/faa-part-450-license-timeline' },
      { label: 'Part 450 MoC', to: '/how-to-write-faa-part-450-means-of-compliance' },
      { label: 'Part 450 vs legacy', to: '/faa-part-450-vs-legacy' },
      { label: 'ITAR vs EAR for space', to: '/itar-vs-ear-for-space-companies' },
      { label: 'FCC 5-year deorbit rule', to: '/fcc-5-year-deorbit-rule' },
      { label: 'NOAA tier system', to: '/noaa-remote-sensing-license-tiers' },
      { label: 'ECSS vs MIL-STD', to: '/ecss-vs-mil-std' },
      { label: 'ITU coordination filing', to: '/how-to-draft-itu-coordination-filing' },
      { label: 'Calculators', to: '/calculators' },
    ],
  },
  {
    title: 'Deep dives',
    links: [
      { label: 'AI for nuclear compliance', to: '/ai-for-nuclear-compliance' },
      { label: 'AI for space compliance', to: '/ai-for-space-compliance' },
      { label: 'DOE Reactor Pilot Program', to: '/doe-advanced-reactor-pilot-program' },
      { label: 'India SHANTI Act and Bharat SMR', to: '/india-shanti-act-bharat-smr' },
      { label: 'Which agency licenses my satellite', to: '/which-agency-licenses-my-satellite' },
      { label: 'Part 53 subparts', to: '/part-53-subparts' },
      { label: 'NRC RAI management', to: '/nrc-rai-management' },
      { label: 'ITAAC closure', to: '/itaac-closure' },
      { label: '10 CFR Part 73 security', to: '/nrc-part-73-security' },
      { label: 'FAA AC 450 series', to: '/faa-ac-450-series' },
      { label: 'FAA vehicle operator license', to: '/faa-vehicle-operator-license' },
      { label: 'FCC Schedule S', to: '/fcc-schedule-s' },
      { label: 'ITAR Commodity Jurisdiction', to: '/itar-commodity-jurisdiction' },
      { label: 'ITU Bringing Into Use', to: '/itu-bringing-into-use' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Product', to: '/product' },
      { label: 'Probe', to: '/probe' },
      { label: 'Research', to: '/research' },
      { label: 'Blog', to: '/blog' },
      { label: 'About', to: '/about' },
      { label: 'Trust', to: '/trust' },
      { label: 'Contact', to: 'mailto:founders@invariant-ai.com' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-midnight text-cloud">
      {/* Painterly dusk landscape, washed in Midnight so it stays cool/on-brand and text reads. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/footer-dawn.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/55 via-midnight/45 to-midnight/75" />
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-24 md:px-12 lg:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 text-cloud">
              <KeystoneMark className="h-[20px] w-auto" />
              <span className="font-serif text-[22px] font-normal leading-none tracking-[-0.015em]">Invariant</span>
            </div>
            <p className="mt-5 font-sans text-sm leading-relaxed text-cloud/55">
              Autonomous AI agents for mission-critical compliance.
            </p>
            <a
              href="mailto:founders@invariant-ai.com"
              className="mt-4 inline-block font-sans text-sm text-cloud/75 underline decoration-cloud/25 underline-offset-4 transition-colors hover:text-copper"
            >
              founders@invariant-ai.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4 md:gap-x-12">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cloud/45">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((lnk) => (
                    <li key={lnk.to}>
                      {lnk.to.startsWith('mailto:') || lnk.to.startsWith('http') ? (
                        <a href={lnk.to} className="font-sans text-sm text-cloud/70 transition-colors hover:text-copper">
                          {lnk.label}
                        </a>
                      ) : (
                        <Link to={lnk.to} className="font-sans text-sm text-cloud/70 transition-colors hover:text-copper">
                          {lnk.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-3 border-t border-cloud/12 pt-6 text-cloud/45 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Invariant · Backed by Entrepreneurs First
          </p>
          <a href="mailto:founders@invariant-ai.com" className="font-sans text-xs transition-colors hover:text-copper">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
