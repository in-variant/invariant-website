import { Link } from 'react-router-dom'
import SpaceMarket from '../../components/SpaceMarket'
import RocketLaunchesMarket from '../../components/RocketLaunchesMarket'

const TABLE: { year: string; sats: string; spend: string; compliance: string }[] = [
  { year: '2024', sats: '11,500', spend: '$613B', compliance: '$4.4B' },
  { year: '2028', sats: '27,000', spend: '$776B', compliance: '$12.5B' },
  { year: '2030', sats: '37,000', spend: '$900B', compliance: '$19.5B' },
  { year: '2032', sats: '48,000', spend: '$1.08T', compliance: '$29.5B' },
  { year: '2035', sats: '66,000', spend: '$1.8T', compliance: '$52.0B' },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-16 mb-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-ink/10" />
      <h2 className="whitespace-nowrap font-serif text-2xl font-normal tracking-[-0.01em] text-ink md:text-3xl">
        {children}
      </h2>
      <div className="h-px flex-1 bg-ink/10" />
    </div>
  )
}

export default function SpaceComplianceTAM() {
  return (
    <article className="min-h-screen px-6 py-24 md:px-12 lg:px-24 xl:px-32">
      <div className="mx-auto max-w-3xl">
        <Link to="/blog" className="font-sans text-sm text-ink/45 transition-colors hover:text-copper">
          ← Back to Blog
        </Link>

        <div
          className="mt-6 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: 'url(/blog/space-tam.png), linear-gradient(135deg, #DCE6EC, #F3D9CE 50%, #F4E4C1)' }}
        />

        <header className="mb-14 mt-10 text-center">
          <p className="mb-4 font-sans text-sm text-ink/40">June 3, 2026</p>
          <h1 className="mb-5 font-serif text-3xl font-normal leading-[1.12] tracking-[-0.02em] text-ink md:text-4xl lg:text-5xl">
            The $1.8 Trillion Space Industry Has a $52 Billion Toll Gate
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-ink/55 md:text-xl">
            The satellite count is the story. Nobody is reading it that way.
          </p>
        </header>

        <div className="section-rule" />

        <div className="mt-10 space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            By 2035, 66,000 satellites will be active in orbit. The global space industry will spend
            $1.8 trillion that year alone. Buried inside that number is a line item growing faster
            than any other: <strong className="text-ink">$52 billion</strong> spent purely on getting
            permission to operate.
          </p>
        </div>

        <div className="mt-12">
          <SpaceMarket />
          <p className="mt-3 text-center font-sans text-sm text-ink/45">
            Satellites in orbit and space compliance spend, 2024,2035. Two metrics, two scales, one
            timeline.
          </p>
        </div>

        <SectionHeading>The orbital count is a filing count</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Every satellite in orbit represents a regulatory event. ITU coordination. FCC spectrum
            licensing. FAA launch authorization. NOAA remote sensing approval. ITAR review if any
            US-origin component touched the supply chain. In 2024, there were 11,500 active satellites
            and $4.4 billion in compliance spend. By 2030, there will be 37,000 satellites and $19.5
            billion in compliance spend. The ratio does not stay flat. It expands.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Notice what that means structurally: compliance spend is not a percentage of revenue. It
            is a function of orbital complexity. The more crowded the environment, the more expensive
            it is for each new entrant to prove they belong in it.
          </p>
        </div>

        <div className="mt-12">
          <RocketLaunchesMarket />
          <p className="mt-3 text-center font-sans text-sm text-ink/45">
            Orbital launches per year and compliance spend, 2024,2035. Launch cadence nearly
            quadruples while compliance spend grows 15x, two scales, one timeline.
          </p>
        </div>

        <SectionHeading>22% CAGR while the industry grows at 10%</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Total industry spend grows from $613 billion in 2024 to $1.8 trillion in 2035, a compound
            annual growth rate of roughly 10%. Compliance spend over the same period goes from $4.4
            billion to $52 billion, a CAGR closer to 22%. The gap between those two numbers is the
            market.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The reason is not regulatory malice. It is regulatory surface area. A company operating 10
            satellites files very differently from one operating 1,000. Modification requests,
            coordination updates, deorbit plan revisions, export control re-reviews when components
            change. Each satellite added to a constellation multiplies the number of live filings, not
            just the total count.
          </p>
        </div>

        <SectionHeading>The ITU queue is already broken</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The ITU spectrum coordination process was designed for an era of geostationary satellites
            filed one at a time. The queue today reflects that mismatch. Major constellation operators
            have waited three to seven years for coordination on a single filing. They file dozens
            across orbital shells and frequency bands.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The word "coordination" understates what this actually is. A priority claim registered
            with the ITU is a property right enforceable under international law. Every new entrant
            negotiates with every existing operator who holds priority in the same band and orbital
            regime. That negotiation has legal costs, technical costs, and time costs. None of them
            are going down.
          </p>
        </div>

        <SectionHeading>New mission types have no regulatory template</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Orbital data centers. In-space manufacturing platforms. Commercial space stations. None of
            these fit cleanly into existing agency frameworks. An operator building a compute facility
            in low Earth orbit does not map to FCC satellite rules designed for communications
            payloads. It does not map to FAA launch licensing designed for vehicles, not
            infrastructure.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Regulators at every major agency are writing review frameworks in real time, alongside the
            operators they are reviewing. That process is billable on both sides. The operators pay
            lawyers and engineers to make the case. The agencies take longer because the precedent
            does not exist. Every novel mission type adds months and dollars to every operator in that
            category who comes after.
          </p>
        </div>

        <SectionHeading>The 5-year deorbit rule changed the engineering cost</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            In 2022, the FCC shortened the post-mission deorbit standard from 25 years to 5 years. The
            number is worth sitting with: a reduction of 20 years in allowable orbital lifetime,
            applied retroactively to the planning assumptions of every operator who had filed under
            the old standard.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The language of the rule frames this as an environmental protection measure. What it
            actually did was make deorbit capability a primary engineering requirement, not a
            secondary one. Designing, testing, documenting, and certifying a deorbit system that meets
            a 5-year standard costs more than one designed for 25. That cost lands in the compliance
            column, not the launch column. It repeats for every satellite in every constellation.
          </p>
        </div>

        <SectionHeading>Headcount is the largest single cost</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Software and filings get the attention. Headcount is where the money actually goes. A
            mid-size constellation operator today runs 15 to 30 people dedicated to regulatory affairs,
            spectrum management, and export control. Senior spectrum attorneys in the US bill between
            $800 and $1,200 per hour. Government affairs teams in Washington, Brussels, and Geneva are
            not optional for any operator competing at scale across jurisdictions.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            This headcount scales with satellite count and with geography. Every new market an operator
            enters adds a national licensing requirement, often with its own agency, its own timeline,
            and its own documentation standard. The people who navigate that are expensive and scarce.
          </p>
        </div>

        <SectionHeading>What this means</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The $52 billion compliance figure is not a tax on success. It is the cost of operating in a
            commons that is filling up faster than the rules governing it can adapt. Operators who
            treat compliance as a back-office function will find it becoming a front-office problem. The
            regulatory surface area of the space industry is expanding permanently, driven by orbital
            congestion, new mission categories, and tightening debris rules. That expansion has a
            dollar value, and it is larger than most market maps acknowledge.
          </p>
        </div>

        <SectionHeading>The numbers, simply</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-ink/15">
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Year</th>
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Satellites</th>
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Industry spend</th>
                <th className="py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Compliance spend</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row) => (
                <tr key={row.year} className="border-b border-ink/[0.08]">
                  <td className="py-3 pr-4 font-medium text-ink">{row.year}</td>
                  <td className="py-3 pr-4 text-ink/70">{row.sats}</td>
                  <td className="py-3 pr-4 text-ink/70">{row.spend}</td>
                  <td className="py-3 font-medium text-copper">{row.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The gap between industry spend growth and compliance spend growth is the story. An industry
            that grows at roughly 10% annually generates a compliance obligation that grows at 22%. The
            two are not proportional, and the delta only widens as the orbital commons fills up.
          </p>
          <p className="font-serif text-xl leading-relaxed text-ink">
            Space is being built on a commons that fills faster than its rules can adapt. The
            compliance bill for that is just beginning to come due.
          </p>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-8">
          <p className="font-sans text-sm leading-relaxed text-ink/45">
            Invariant AI provides regulatory compliance infrastructure for space-tech, nuclear, and
            drone operators, combining forward-deployed technical and legal experts with an AI platform
            built for the specific document types and agency workflows of these industries.
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink/45">
            Disclaimer: Projections are Invariant AI internal estimates based on UCS Satellite
            Database, FCC filing records, Morgan Stanley Space Economy report, and Space Foundation
            Space Report 2024. They are directional, not audited.
          </p>
        </div>
      </div>
    </article>
  )
}
