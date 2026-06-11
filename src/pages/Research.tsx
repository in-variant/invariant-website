import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, EDITORIAL_TEAM, breadcrumbSchema, SITE_URL } from '../components/Seo'

const URL = `${SITE_URL}/research`

const SCHOLARLY_ARTICLE = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  '@id': `${SITE_URL}/blog/fermibench-sota#article`,
  headline: 'Invariant sets state of the art on FermiBench',
  name: 'Helion-512 achieves 0.9693 nDCG@10 on FermiBench',
  description:
    'Helion-512, a domain-adapted retrieval model for nuclear regulatory text, sets the published state of the art on FermiBench, the only public nuclear regulatory retrieval benchmark.',
  url: `${SITE_URL}/blog/fermibench-sota`,
  about: [
    { '@type': 'Thing', name: 'Information retrieval' },
    { '@type': 'Thing', name: 'Nuclear regulatory documents' },
    { '@type': 'Thing', name: 'NRC ADAMS' },
    { '@type': 'Thing', name: 'Domain-adapted embeddings' },
  ],
  author: { '@id': `${SITE_URL}/#editorial-team` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
  datePublished: '2026-04-15',
  inLanguage: 'en',
}

const DATASET_FERMIBENCH = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  '@id': `${SITE_URL}/research#fermibench`,
  name: 'FermiBench',
  alternateName: 'FermiBench retrieval benchmark',
  description:
    'A public retrieval benchmark for nuclear regulatory documents, indexed against NRC ADAMS, used to evaluate domain-adapted embedding models.',
  keywords: ['nuclear regulatory', 'NRC ADAMS', 'retrieval benchmark', 'IR', 'embeddings'],
  isAccessibleForFree: true,
}

const MODEL_HELION = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/research#helion-512`,
  name: 'Helion-512',
  applicationCategory: 'Retrieval model',
  description:
    'A 512-dimensional domain-adapted dense retrieval model for nuclear regulatory documents. State of the art on FermiBench (0.9693 nDCG@10).',
  operatingSystem: 'Server',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: `${SITE_URL}/probe`,
}

export default function Research() {
  return (
    <>
      <Seo
        title="Research: Helion-512, FermiBench, and Invariant's published work"
        description="Invariant's research: Helion-512 retrieval model at 0.97 nDCG@10 on FermiBench (the only public nuclear regulatory retrieval benchmark), siting comparisons, seismic design analyses, and field notes from regulator dockets."
        canonical={URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={[
          ORG_SCHEMA,
          EDITORIAL_TEAM,
          SCHOLARLY_ARTICLE,
          DATASET_FERMIBENCH,
          MODEL_HELION,
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Research', url: URL },
          ]),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Research</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            Research at Invariant.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            We publish what we ship. The retrieval models, the regulator-comparison notes, the seismic and siting analyses. Everything below is sourced from primary regulators and validated against published benchmarks.
          </p>

          <section className="mt-16 rounded-[3px] border border-ink/15 bg-white p-8 md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Headline result</p>
            <h2 className="mt-4 font-serif text-3xl font-normal leading-tight tracking-[-0.015em] text-ink md:text-4xl">
              Helion-512 reaches 0.9693 nDCG@10 on FermiBench.
            </h2>
            <p className="mt-5 font-sans text-base leading-relaxed text-ink/70">
              FermiBench is the only public retrieval benchmark for the nuclear regulatory domain. It is indexed against the NRC ADAMS document corpus and used to evaluate how well embedding models surface the right passage when an engineer searches for, say, &quot;single failure criterion under Part 53&quot; or &quot;ITAAC closure threshold for SSC categorization&quot;. Helion-512 is the 512-dimensional, domain-adapted dense retriever we trained for this. It sets the state of the art with a margin of more than 22 nDCG@10 points over the prior published baseline.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              The same model is in production behind {' '}
              <Link to="/probe" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">Probe</Link>
              , our public live semantic search over NRC ADAMS. The full write-up is at the {' '}
              <Link to="/blog/fermibench-sota" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">FermiBench post</Link>
              .
            </p>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-2xl font-normal text-ink md:text-3xl">Published notes</h2>
            <ul className="mt-6 divide-y divide-ink/10">
              <li className="py-5">
                <Link to="/blog/fermibench-sota" className="group block">
                  <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                    Invariant sets state of the art on FermiBench
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/60">
                    Helion-512 reaches 0.97 nDCG@10 on the only published nuclear-domain IR benchmark. Training data, ablations, and failure modes.
                  </p>
                </Link>
              </li>
              <li className="py-5">
                <Link to="/blog/part100-vs-part53-siting" className="group block">
                  <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                    10 CFR Part 100 vs Part 53 Subpart D: a siting comparison
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/60">
                    A line-by-line comparison of the legacy and the new technology-inclusive siting frameworks for U.S. commercial reactors.
                  </p>
                </Link>
              </li>
              <li className="py-5">
                <Link to="/blog/seismic-design-shift" className="group block">
                  <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                    SSE/OBE to GMRS/SDC: the seismic design shift to Part 53
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/60">
                    The deterministic two-tier seismic framework is replaced by risk-tiered ground motions and seismic design categories.
                  </p>
                </Link>
              </li>
              <li className="py-5">
                <Link to="/blog/nuclear-compliance-tam" className="group block">
                  <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                    Nuclear compliance: a TAM estimate
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/60">
                    The market size for nuclear compliance work, broken down by regulator, design phase, and geography.
                  </p>
                </Link>
              </li>
              <li className="py-5">
                <Link to="/blog/space-compliance-tam" className="group block">
                  <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                    Space compliance: a TAM estimate
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-ink/60">
                    The market size for space compliance work, broken down by launch, satellite, and Earth-observation segments.
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-16 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Contact</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/70">
              If you are researching retrieval, regulator workflows, or the application of AI to high-consequence compliance, we are happy to talk. Reach the team at {' '}
              <a href="mailto:founders@invariant-ai.com" className="text-copper underline decoration-copper/40 underline-offset-4 hover:decoration-copper">
                founders@invariant-ai.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  )
}
