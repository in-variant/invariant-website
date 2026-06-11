import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../../components/Seo'

const URL = `${SITE_URL}/calculators`

const TOOLS = [
  {
    slug: 'faa-part-450-timeline',
    title: 'FAA Part 450 timeline estimator',
    description:
      'Estimate how long a 14 CFR Part 450 launch or reentry license will take from kickoff to license, based on vehicle class, accepted Means of Compliance, novel design features, and environmental review type.',
  },
  {
    slug: 'nrc-license-timeline',
    title: 'NRC license timeline estimator',
    description:
      'Estimate an NRC reactor license duration under 10 CFR Part 50, 52, or 53 from pre-application engagement, approved topical reports, TICAP alignment, design novelty, and existing ESP.',
  },
  {
    slug: 'fcc-deorbit-feasibility',
    title: 'FCC 5-year deorbit feasibility checker',
    description:
      'Check whether your LEO satellite design satisfies the FCC 22-74 five-year post-mission disposal rule under 47 CFR 25.283(e), based on altitude, ballistic coefficient, and disposal strategy.',
  },
]

export default function CalculatorsIndex() {
  return (
    <>
      <Seo
        title="Compliance calculators, FAA Part 450 and NRC license timelines"
        description="Free interactive tools for estimating commercial space and nuclear regulatory timelines. FAA Part 450 launch licensing and NRC reactor licensing under Parts 50, 52, and 53."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${URL}#collection`,
            name: 'Invariant compliance calculators',
            url: URL,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: TOOLS.length,
              itemListElement: TOOLS.map((t, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${URL}/${t.slug}`,
                name: t.title,
              })),
            },
          },
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Calculators', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Calculators</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl">
            Compliance calculators.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Interactive estimators for regulatory timelines, anchored to real precedent and primary-source data. First-order tools, not forecasts.
          </p>

          <ul className="mt-12 divide-y divide-ink/10">
            {TOOLS.map((t) => (
              <li key={t.slug} className="py-6">
                <Link to={`/calculators/${t.slug}`} className="group block">
                  <h2 className="font-serif text-2xl font-normal text-ink transition-colors group-hover:text-copper">
                    {t.title}
                  </h2>
                  <p className="mt-2 font-sans text-base leading-relaxed text-ink/65">
                    {t.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-copper">
                    <span>Open tool →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-sans text-sm text-ink/55">
            More tools coming. If you want a specific compliance question turned into an interactive estimator, write to{' '}
            <a href="mailto:founders@invariant-ai.com" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
              founders@invariant-ai.com
            </a>
            .
          </p>
        </div>
      </article>
    </>
  )
}
