import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo, ORG_SCHEMA, breadcrumbSchema, SITE_URL } from '../components/Seo'
import { GLOSSARY, GLOSSARY_TOPICS, GLOSSARY_TOPIC_LABELS, entriesByTopic, getGlossarySummary } from '../data/glossary'
import { articleSearchWords, prepareSearch, rankSearch } from '../data/blogSearch'
import directory from '../data/glossary-directory.json'
import '../styles/invariant-brand.css'
import './Glossary.css'

const URL = `${SITE_URL}/glossary`

const index = prepareSearch(GLOSSARY, entry => ({
  title: entry.term,
  relatedTitle: entry.aliases?.join(' '),
  metadata: entry.short_definition,
}))

const groups = entriesByTopic()
for (const entries of groups.values()) entries.sort((a, b) => a.term.localeCompare(b.term))
const activeTopics = GLOSSARY_TOPICS.filter(topic => groups.get(topic)?.length)
const examples = directory.examples.flatMap(example => {
  const term = getGlossarySummary(example.definition)
  return term ? [{ ...example, term }] : []
})
const glossarySeo = {
  title: directory.title,
  description: directory.description,
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
  const [query, setQuery] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const words = articleSearchWords(query.replace(/^define\s+/i, '').replace(/\s+(?:mean|stand for)\W*$/i, ''))
  const searching = query.trim().length > 0
  const matches = words.length ? rankSearch(index, words) : []

  return (
    <>
      <Seo {...glossarySeo} />
      <article className="glossary-directory bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">Glossary</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            {directory.title}
          </h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl">
            {directory.description}
          </p>
          <div className="glossary-search">
            <label htmlFor="glossary-search">Find a definition</label>
            <input id="glossary-search" type="search" value={query} disabled={!ready}
              placeholder="Try SOV, load flow or DSCR" onChange={event => setQuery(event.target.value)} />
            <p role="status">{searching ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}` : `${GLOSSARY.length} definitions`}</p>
          </div>
          {searching ? (
            <section className="glossary-matches" aria-labelledby="glossary-match-heading">
              <h2 id="glossary-match-heading">Matching definitions</h2>
              {matches.length ? (
                <ul className="mt-3 divide-y divide-ink/10">
                  {matches.map(entry => (
                    <li key={entry.slug} className="py-4">
                      <Link to={`/glossary/${entry.slug}`} className="glossary-term-link">{entry.term}</Link>
                      <p className="mt-1 text-ink/65">{entry.short_definition}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-ink/65">Try the full term or its acronym.</p>}
            </section>
          ) : (
            <section className="glossary-examples" aria-labelledby="glossary-examples-heading">
              <h2 id="glossary-examples-heading">Definitions in practice</h2>
              <ul>
                {examples.map(({ label, guide, term }) => (
                  <li key={term.slug}>
                    <Link to={guide}>{label}</Link>
                    <Link className="glossary-definition-link" to={`/glossary/${term.slug}`}>{term.term}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!searching && activeTopics.length > 0 && (
            <nav aria-label="Glossary topics" className="mt-6 flex flex-wrap gap-x-5">
              {activeTopics.map(topic => (
                <a key={topic} href={`#${topic}`} className="inline-flex min-h-11 items-center font-sans text-sm text-copper underline underline-offset-4">
                  {GLOSSARY_TOPIC_LABELS[topic]}
                </a>
              ))}
            </nav>
          )}
          {!searching && (
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
