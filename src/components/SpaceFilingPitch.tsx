import { Link } from 'react-router-dom'

const AGENCIES = ['FAA', 'FCC', 'ITU', 'NOAA', 'DDTC']

const FILINGS = [
  {
    title: 'Launch and reentry',
    body: 'FAA Part 450 applications, means of compliance, safety analyses, and regulator responses.',
  },
  {
    title: 'Spectrum and satellites',
    body: 'FCC Part 25 and Schedule S, ITU coordination, bringing-into-use, and orbital-debris showings.',
  },
  {
    title: 'Remote sensing and exports',
    body: 'NOAA Part 960 licensing and DDTC filings, including export-control workflows around technical data.',
  },
]

const CONTROLS = [
  'ITAR-aware data handling',
  'On-premises or GovCloud deployment',
  'U.S.-citizen subject-matter experts',
]

export default function SpaceFilingPitch() {
  return (
    <section className="bg-paper px-6 py-20 text-ink md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-copper">
              From mission plan to submission
            </p>
            <h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.06] tracking-[-0.02em] md:text-5xl">
              One team across every space regulator.
            </h2>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink/65">
              Built for launch providers, satellite operators, Earth-observation teams, and aerospace
              manufacturers that need filings completed—not another compliance dashboard to manage.
            </p>
            <div className="mt-7 flex flex-wrap gap-2" aria-label="Agencies covered">
              {AGENCIES.map((agency) => (
                <span key={agency} className="rounded-full border border-ink/15 px-3 py-1.5 font-sans text-xs font-medium">
                  {agency}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
              {FILINGS.map((filing) => (
                <article key={filing.title} className="bg-paper p-6 sm:min-h-56">
                  <h3 className="font-sans text-base font-semibold">{filing.title}</h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">{filing.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-ink p-6 text-cloud sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <p className="font-sans text-sm font-semibold">Controlled data stays controlled.</p>
                <ul className="mt-3 flex flex-col gap-2 font-sans text-sm text-cloud/65 sm:flex-row sm:flex-wrap sm:gap-x-5">
                  {CONTROLS.map((control) => (
                    <li key={control} className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-1 bg-copper" />
                      {control}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/trust"
                className="mt-5 inline-flex shrink-0 items-center font-sans text-sm font-medium text-cloud underline decoration-cloud/35 underline-offset-4 hover:decoration-cloud sm:mt-0"
              >
                Review data handling
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
