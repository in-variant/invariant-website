import { useParams, Link, Navigate } from 'react-router-dom'
import { Seo, ORG_SCHEMA, breadcrumbSchema, SITE_URL } from '../components/Seo'
import { getEntry, GLOSSARY } from '../data/glossary'

const TOPIC_LABEL: Record<'space' | 'nuclear' | 'aerospace', string> = {
  space: 'Space',
  nuclear: 'Nuclear',
  aerospace: 'Aerospace',
}

export default function GlossaryEntryPage() {
  const { slug } = useParams<{ slug: string }>()
  const entry = slug ? getEntry(slug) : undefined
  if (!entry) return <Navigate to="/glossary" replace />

  const url = `${SITE_URL}/glossary/${entry.slug}`
  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': url,
    name: entry.term,
    alternateName: entry.aliases,
    description: entry.short_definition,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}/glossary#defined-term-set`,
      name: 'Invariant compliance glossary',
      url: `${SITE_URL}/glossary`,
    },
  }
  const related = (entry.related_to || [])
    .map((s) => GLOSSARY.find((e) => e.slug === s))
    .filter(Boolean) as typeof GLOSSARY

  const ogImage = `${SITE_URL}/og/glossary/${entry.slug}.png`
  return (
    <>
      <Seo
        title={`${entry.term} — definition`}
        description={entry.short_definition}
        canonical={url}
        ogImage={ogImage}
        jsonLd={[
          ORG_SCHEMA,
          definedTerm,
          breadcrumbSchema([
            { name: 'Invariant', url: `${SITE_URL}/` },
            { name: 'Glossary', url: `${SITE_URL}/glossary` },
            { name: entry.term, url },
          ]),
        ]}
      />
      <section className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/glossary"
            className="font-sans text-sm text-ink/45 transition-colors hover:text-copper"
          >
            ← Glossary
          </Link>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
            {TOPIC_LABEL[entry.topic]} compliance · Definition
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.025em] text-ink md:text-5xl">
            {entry.term}
          </h1>
          {entry.aliases && entry.aliases.length > 0 && (
            <p className="mt-3 font-sans text-sm text-ink/55">
              Also known as: {entry.aliases.join(', ')}
            </p>
          )}

          <p className="mt-6 font-sans text-lg leading-relaxed text-ink/75 md:text-xl">
            {entry.short_definition}
          </p>

          <div className="mt-10 space-y-4 font-sans text-base leading-relaxed text-ink/70">
            {entry.full_definition.split(/\n\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {related.length > 0 && (
            <section className="mt-12 rounded-[3px] border border-ink/10 bg-white p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
                Related terms
              </p>
              <ul className="mt-4 space-y-3">
                {related.map((e) => (
                  <li key={e.slug}>
                    <Link
                      to={`/glossary/${e.slug}`}
                      className="font-serif text-lg font-normal text-ink transition-colors hover:text-copper"
                    >
                      {e.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {entry.citations.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-normal text-ink md:text-3xl">Sources</h2>
              <ul className="mt-4 ml-5 list-disc space-y-2 font-sans text-sm text-ink/65">
                {entry.citations.map((c) => (
                  <li key={c.url}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ink/20 underline-offset-4 hover:text-copper hover:decoration-copper/60"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
            Last updated {formatDate(entry.last_updated)}
          </p>
        </div>
      </section>
    </>
  )
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
