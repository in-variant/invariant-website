import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, breadcrumbSchema, SITE_URL } from '../components/Seo'
import glossaryData from './_data/glossary.json'

type Entry = {
  slug: string
  term: string
  aliases?: string[]
  short_definition: string
  topic: 'space' | 'nuclear' | 'aerospace'
}

const ENTRIES = (glossaryData.entries as Entry[]) || []

const URL = `${SITE_URL}/glossary`

export default function Glossary() {
  const groups: Record<string, Entry[]> = {}
  for (const e of ENTRIES) {
    ;(groups[e.topic] ||= []).push(e)
  }
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.term.localeCompare(b.term))
  }

  const definedTermSet = ENTRIES.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        '@id': `${URL}#glossary`,
        name: 'Invariant Compliance Glossary',
        description:
          'Authoritative definitions of regulatory, standards, and qualification terms used across space, aerospace, and nuclear compliance.',
        url: URL,
        hasDefinedTerm: ENTRIES.map((e) => ({
          '@type': 'DefinedTerm',
          '@id': `${SITE_URL}/glossary/${e.slug}`,
          name: e.term,
          alternateName: e.aliases,
          description: e.short_definition,
          inDefinedTermSet: `${URL}#glossary`,
          url: `${SITE_URL}/glossary/${e.slug}`,
        })),
      }
    : null

  return (
    <>
      <Seo
        title="Glossary of space, aerospace, and nuclear compliance terms"
        description="Authoritative, citation-backed definitions of every regulatory, standards, and qualification term across FAA Part 450, FCC, NOAA, IN-SPACe, ECSS, NRC 10 CFR Parts 50/52/53, and more."
        canonical={URL}
        jsonLd={[
          ORG_SCHEMA,
          breadcrumbSchema([
            { name: 'Invariant', url: SITE_URL + '/' },
            { name: 'Glossary', url: URL },
          ]),
          ...(definedTermSet ? [definedTermSet] : []),
        ]}
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">Glossary</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            A glossary of space, aerospace, and nuclear compliance.
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            Authoritative definitions of every regulatory, standards, and qualification term we work with — each one tied back to the primary source.
          </p>
          {ENTRIES.length === 0 ? (
            <p className="mt-10 font-sans text-base text-ink/60">
              Compiling. Definitions are being written and reviewed; this page will fill in over the next 24 hours.
            </p>
          ) : (
            <div className="mt-12 space-y-12">
              {(['space', 'nuclear', 'aerospace'] as const).map((topic) => {
                const items = groups[topic]
                if (!items?.length) return null
                return (
                  <section key={topic}>
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
                      {topic === 'space' ? 'Space' : topic === 'nuclear' ? 'Nuclear' : 'Aerospace'}
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
