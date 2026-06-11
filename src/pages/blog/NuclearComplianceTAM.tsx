import { Link } from 'react-router-dom'
import NuclearMarket from '../../components/NuclearMarket'

const TABLE: { year: string; spend: string; capacity: string; tam: string }[] = [
  { year: '2024', spend: '$425B', capacity: '102 GW', tam: '$9.5B' },
  { year: '2028', spend: '$460B', capacity: '112 GW', tam: '$13.1B' },
  { year: '2032', spend: '$495B', capacity: '138 GW', tam: '$20.3B' },
  { year: '2035', spend: '$515B', capacity: '164 GW', tam: '$26.2B' },
  { year: '2040', spend: '$560B', capacity: '200 GW', tam: '$35.8B' },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-16 mb-6 flex items-center gap-3">
      <div className="hidden h-px flex-1 bg-ink/10 sm:block" />
      <h2 className="font-serif text-2xl font-normal tracking-[-0.01em] text-ink sm:whitespace-nowrap md:text-3xl">
        {children}
      </h2>
      <div className="h-px flex-1 bg-ink/10" />
    </div>
  )
}

export default function NuclearComplianceTAM() {
  return (
    <article className="min-h-screen px-6 py-24 md:px-12 lg:px-24 xl:px-32">
      <div className="mx-auto max-w-3xl">
        <Link to="/blog" className="font-sans text-sm text-ink/45 transition-colors hover:text-copper">
          ← Back to Blog
        </Link>

        <div
          className="mt-6 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: 'url(/blog/nuclear-tam.png), linear-gradient(135deg, #DCE6EC, #F3D9CE 50%, #F4E4C1)' }}
        />

        <header className="mb-14 mt-10 text-center">
          <p className="mb-4 font-sans text-sm text-ink/40">June 2, 2026</p>
          <h1 className="mb-5 font-serif text-3xl font-normal leading-[1.12] tracking-[-0.02em] text-ink md:text-4xl lg:text-5xl">
            The $35 Billion Problem Nobody Is Talking About in Nuclear
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-ink/55 md:text-xl">
            The US nuclear industry is about to double in size. The compliance infrastructure
            required to make that expansion legal is the part nobody is pricing in.
          </p>
        </header>

        <div className="section-rule" />

        <div className="mt-10 space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The US nuclear industry is about to double in size. If you follow energy policy, you
            already know this. What gets less attention is the compliance infrastructure required to
            make that expansion legal.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Here is the number that matters: by 2040, the nuclear compliance market in the US will be
            worth an estimated <strong className="text-ink">$35.8 billion</strong> annually. In 2024,
            it was $9.5 billion. That is a near-4x increase in sixteen years, driven not by regulatory
            overreach but by the sheer volume of new reactors entering the licensing pipeline.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            This post breaks down where that number comes from, why it keeps climbing, and why the
            three SMR milestones between now and 2040 are the inflection points every compliance
            operator needs to understand.
          </p>
        </div>

        <div className="mt-12">
          <NuclearMarket />
          <p className="mt-3 text-center font-sans text-sm text-ink/45">
            US nuclear installed capacity and compliance TAM, 2022,2040. Two metrics, two scales,
            one timeline.
          </p>
        </div>

        <SectionHeading>The baseline: a $425 billion industry growing quietly</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The US nuclear power market was worth approximately $425 billion in 2024. That figure
            encompasses power generation revenue, fuel cycle costs, plant operations, and new-build
            capital expenditure. It grows at roughly 2% annually on current trends, not explosive, but
            steady and largely recession-proof.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            What makes the next sixteen years different is capacity. The US currently operates 94
            reactors producing approximately 97 GW net capacity. The Department of Energy's build-out framework targets an
            additional 35 GW by 2035, with a sustained 15 GW per year pace through 2040. On the
            aggressive path, total installed capacity reaches approximately 200 GW by 2040, nearly
            double today's fleet.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            Every gigawatt added to that fleet generates compliance obligations that do not expire.
          </p>
        </div>

        <SectionHeading>Why compliance TAM grows faster than the market</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The total nuclear market spend grows at roughly 2% CAGR. The compliance TAM grows at
            closer to 8%. The gap is structural, not accidental.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">Three forces drive it.</p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            <strong className="text-ink">The fleet compounds.</strong> An operating reactor never
            exits the compliance universe. It generates annual NRC reporting obligations, scheduled
            inspection cycles, license condition tracking, and eventual renewal filings. Each new unit
            added to the fleet raises the permanent compliance floor. By 2040, a fleet of 200 GW
            carries roughly four times the ongoing compliance load of today's 102 GW fleet.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            <strong className="text-ink">New reactor types restart the clock.</strong> A licence
            renewal for an existing Westinghouse AP1000 is a known, well-trodden process. A
            first-of-kind SMR design going through NRC Part 53 review is not. Every new reactor
            architecture that enters the pipeline, and there are at least six distinct SMR designs and
            multiple Gen IV concepts in the US pipeline today, requires a full fresh-start licensing
            engagement. The compliance intensity per MW is significantly higher for new designs than
            for renewals.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            <strong className="text-ink">Fleet diversity multiplies oversight burden.</strong> A
            homogeneous fleet of light-water reactors is relatively straightforward to oversee. A
            mixed fleet of LWRs, small modular reactors, sodium-cooled fast reactors, and molten salt
            units is substantially harder. Compliance operators must maintain fluency across multiple
            regulatory frameworks simultaneously. That cost is real and it accrues to every participant
            in the ecosystem.
          </p>
        </div>

        <SectionHeading>Three SMR milestones, three step-changes in demand</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The compliance TAM does not grow in a straight line. It accelerates at each of the three
            SMR milestones now visible on the horizon.
          </p>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-ink/50">
              2028 · Demonstration units online
            </h3>
            <p className="mt-3 font-sans text-base leading-relaxed text-ink/75">
              The first commercial SMR units, Holtec's SMR-300 at Palisades and TerraPower's Natrium
              reactor at Kemmerer, are targeted for first power by the late 2020s. This is when NRC
              Part 53, the new advanced reactor licensing framework, gets its first real-world stress
              test. The licensing precedent set here will shape compliance requirements for every
              subsequent SMR design. The compliance load at this stage is concentrated and intensive:
              it is the most uncertain and document-heavy phase of any new reactor programme.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-ink/50">
              2032 · Commercial wave
            </h3>
            <p className="mt-3 font-sans text-base leading-relaxed text-ink/75">
              By the early 2030s, the first-mover licences have been granted and a broader commercial
              wave begins. Google's Kairos Power PPA, Meta's TerraPower agreements, Amazon's nuclear
              partnerships, the tech-sector demand signal has already pulled forward investment
              timelines across the industry. An estimated 10,15 GW of SMR capacity will be online or in
              final commissioning by this point. The compliance load transitions from peak
              new-licensing intensity toward a higher steady-state operational base. The floor rises
              and does not come back down.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-ink/50">
              2037 · Gen IV enters the pipeline
            </h3>
            <p className="mt-3 font-sans text-base leading-relaxed text-ink/75">
              The third inflection is less discussed but equally significant. Generation IV reactor
              designs, sodium-cooled fast reactors beyond Natrium, molten salt concepts, gas-cooled
              designs, begin entering the commercial licensing pipeline around 2034,2036. By 2037, a
              second distinct licensing wave is underway. These designs require not just new Part 53
              applications but in some cases new regulatory guidance documents, new inspection
              protocols, and new fuel cycle oversight frameworks. The compliance intensity resets to
              peak levels for a second time.
            </p>
          </div>
        </div>

        <SectionHeading>What this means for the industry</SectionHeading>
        <div className="space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The pattern is clear. The compliance TAM grows monotonically, it does not dip after a
            licensing wave clears, because the operational fleet that wave created continues generating
            compliance obligations indefinitely. The bell curves in new licensing activity sit on top
            of an ever-rising floor of operational compliance.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            For utilities, this means compliance is increasingly a core operational competency rather
            than a periodic project cost. For regulators, it means the NRC's capacity constraints will
            be tested repeatedly as concurrent licensing loads peak. For technology vendors and
            compliance infrastructure providers, it means a market that reliably expands regardless of
            which specific reactor designs succeed.
          </p>
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The question is not whether nuclear compliance spend will grow. It will, and substantially.
            The question is whether the infrastructure exists to handle it efficiently, or whether the
            industry absorbs the cost the same way it has always absorbed it: slowly, manually, and
            expensively.
          </p>
        </div>

        <SectionHeading>The numbers, simply</SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-ink/15">
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Year</th>
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Market spend</th>
                <th className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Installed capacity</th>
                <th className="py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">Compliance TAM</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row) => (
                <tr key={row.year} className="border-b border-ink/[0.08]">
                  <td className="py-3 pr-4 font-medium text-ink">{row.year}</td>
                  <td className="py-3 pr-4 text-ink/70">{row.spend}</td>
                  <td className="py-3 pr-4 text-ink/70">{row.capacity}</td>
                  <td className="py-3 font-medium text-copper">{row.tam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-6">
          <p className="font-sans text-base leading-relaxed text-ink/75">
            The gap between market spend growth and compliance TAM growth is the story. A market that
            grows 32% over sixteen years generates a compliance obligation that grows 277% over the
            same period. The two are not proportional, and the delta only widens as the fleet
            diversifies.
          </p>
          <p className="font-serif text-xl leading-relaxed text-ink">
            Nuclear's next era is being built right now. The compliance infrastructure for it is not.
          </p>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-8">
          <p className="font-sans text-sm leading-relaxed text-ink/45">
            Sources: US Department of Energy advanced reactor deployment framework; World Nuclear
            Association US country profile (2025); Statifacts US nuclear power market report; Nuclear
            Innovation Alliance Advanced Reactor Timeline (June 2025).
          </p>
        </div>
      </div>
    </article>
  )
}
