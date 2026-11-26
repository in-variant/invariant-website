import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, breadcrumbSchema, SITE_URL } from '../components/Seo'
import { GLOSSARY, GLOSSARY_TOPICS, GLOSSARY_TOPIC_LABELS, entriesByTopic } from '../data/glossary'

const URL = `${SITE_URL}/glossary`

const DESCRIPTION = 'Source-backed definitions for property due diligence, insurance, GIS, data center siting, and infrastructure compliance.'
const glossarySeo = {
  title: 'Infrastructure and Compliance Glossary',
  description: DESCRIPTION,
  canonical: URL,
  markdown: '/glossary.md',
  ogImage: `${SITE_URL}/og/glossary.png`,
  jsonLd: [
    ORG_SCHEMA,
    breadcrumbSchema([{ name: 'Invariant', url: SITE_URL + '/' }, { name: 'Glossary', url: URL }]),
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${URL}#defined-term-set`,
      name: 'Invariant Infrastructure and Compliance Glossary',
      url: URL,
      hasDefinedTerm: GLOSSARY.map(entry => ({
        '@type': 'DefinedTerm',
        '@id': `${URL}/${entry.slug}`,
        name: entry.term,
        alternateName: entry.aliases,
        description: entry.short_definition,
        url: `${URL}/${entry.slug}`,
      })),
    },
  ],
}

export default function Glossary() {
  const groups = entriesByTopic()
  for (const entries of groups.values()) {
    entries.sort((a, b) => a.term.localeCompare(b.term))
  }
  const activeTopics = GLOSSARY_TOPICS.filter(topic => groups.get(topic)?.length)

  return (
    <>
      <Seo {...glossarySeo} />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Glossary</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            Infrastructure and compliance glossary
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            {DESCRIPTION}
          </p>
          {activeTopics.length > 0 && (
            <nav aria-label="Glossary topics" className="mt-6 flex flex-wrap gap-x-5">
              {activeTopics.map(topic => (
                <a key={topic} href={`#${topic}`} className="inline-flex min-h-11 items-center font-sans text-sm text-copper underline underline-offset-4">
                  {GLOSSARY_TOPIC_LABELS[topic]}
                </a>
              ))}
            </nav>
          )}
          {GLOSSARY.length === 0 ? (
            <p className="mt-10 font-sans text-base text-ink/60">
              Compiling. Definitions are being written and reviewed; this page will fill in over the next 24 hours.
            </p>
          ) : (
            <div className="mt-12 space-y-12">
              {activeTopics.map((topic) => {
                const items = groups.get(topic) ?? []
                return (
                  <section key={topic} aria-labelledby={topic}>
                    <h2 id={topic} className="scroll-mt-24 font-sans text-[11px] uppercase tracking-[0.14em] text-ink/55">
                      {GLOSSARY_TOPIC_LABELS[topic]}
                    </h2>
                    <ul className="mt-4 divide-y divide-ink/10">
                      {items.map((e) => (
                        <li key={e.slug} className="py-5">
                          <Link to={`/glossary/${e.slug}`} className="group block">
                            <h3 className="font-serif text-xl font-normal text-ink transition-colors group-hover:text-copper">
                              {e.term}
                            </h3>
                            <p className="mt-2 line-clamp-2 font-sans text-base leading-relaxed text-ink/65">
                              {e.short_definition}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
