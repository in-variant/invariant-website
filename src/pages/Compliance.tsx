import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../components/Seo'
import { LIVE_PAGES, type PageRef } from '../data/page-registry'
import { GLOSSARY } from '../data/glossary'

const URL = `${SITE_URL}/compliance`

const REGIONAL_SUFFIXES = ['-eu', '-india', '-japan']
function isRegional(slug: string) {
  return REGIONAL_SUFFIXES.some((s) => slug.endsWith(s))
}

export default function Compliance() {
  const pillars = LIVE_PAGES.filter((p) => p.type === 'pillar')
  const nuclearUS = LIVE_PAGES.filter((p) => p.type === 'cluster' && p.pillar === 'nuclear' && !isRegional(p.slug))
  const spaceUS = LIVE_PAGES.filter((p) => p.type === 'cluster' && p.pillar === 'space' && !isRegional(p.slug))
  const regional = LIVE_PAGES.filter((p) => p.type === 'cluster' && isRegional(p.slug))

  const COLLECTION = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${URL}#collection`,
    name: 'Compliance content library',
    description:
      'Every published Invariant resource on space, nuclear, and aerospace regulatory and qualification compliance.',
    url: URL,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: LIVE_PAGES.length + GLOSSARY.length,
      itemListElement: [
        ...LIVE_PAGES.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/${p.slug}`,
          name: p.shortTitle || p.title,
        })),
        ...GLOSSARY.map((e, i) => ({
          '@type': 'ListItem',
          position: LIVE_PAGES.length + i + 1,
          url: `${SITE_URL}/glossary/${e.slug}`,
          name: e.term,
        })),
      ],
    },
  }

  return (
    <>
      <Seo
        title="Compliance library: every Invariant resource for space, nuclear, and aerospace"
        description="The complete Invariant library: pillar guides, cluster explainers, and 60+ glossary definitions for space, nuclear, and aerospace regulatory and qualification compliance."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          COLLECTION,
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Compliance', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Compliance library</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            The Invariant compliance library.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Every guide, every glossary entry, every research note we have published. Sourced from primary regulators. Updated as rules change.
          </p>

          <PillarSection title="Pillars" pages={pillars} />
          <PillarSection title="Nuclear guides" pages={nuclearUS} />
          <PillarSection title="Space guides" pages={spaceUS} />
          <PillarSection title="Region guides (EU, India, Japan)" pages={regional} />

          <section className="mt-16">
            <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.02em] text-ink md:text-4xl">
              Glossary
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/65">
              {GLOSSARY.length} citation-backed definitions across space, nuclear, and aerospace compliance.
            </p>
            <Link
              to="/glossary"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2 font-sans text-[11px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-copper/40 hover:text-copper"
            >
              <span className="text-copper/80">→</span>
              <span>Open the glossary</span>
            </Link>
          </section>

          <section className="mt-16 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Research</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              Helion-512, our domain-adapted retrieval model, is the published state of the art on FermiBench at 0.9693 nDCG@10. The full write-up and the rest of our research notes are at {' '}
              <Link to="/research" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">/research</Link>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  )
}

function PillarSection({ title, pages }: { title: string; pages: PageRef[] }) {
  if (pages.length === 0) return null
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.02em] text-ink md:text-4xl">
        {title}
      </h2>
      <ul className="mt-6 divide-y divide-ink/10">
        {pages.map((p) => (
          <li key={p.slug} className="py-5">
            <Link to={`/${p.slug}`} className="group block">
              <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                {p.shortTitle || p.title}
              </h3>
              <p className="mt-1 line-clamp-2 font-sans text-sm leading-relaxed text-ink/60">
                {p.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
