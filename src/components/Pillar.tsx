import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo, articleSchema, faqSchema, breadcrumbSchema, howToSchema, ORG_SCHEMA, EDITORIAL_TEAM } from './Seo'
import RelatedGuides from './RelatedGuides'
import { getPage, type Pillar as PillarTopic } from '../data/page-registry'
import { renderLinkified } from './linkifyGlossary'

type SeeAlso = { slug: string; label?: string }
type Subsection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  see_also?: SeeAlso[]
}
type Section = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  subsections?: Subsection[]
  see_also?: SeeAlso[]
}
type Faq = { question: string; answer: string }
type Citation = { label: string; url: string }

export type PillarData = {
  h1: string
  meta_title: string
  meta_description: string
  canonical_summary: string
  sections: Section[]
  faqs: Faq[]
  citations: Citation[]
}

type Props = {
  data: PillarData
  eyebrow: string
  slug: string // e.g. 'space-compliance'
  breadcrumbLabel: string
  topic: PillarTopic // for RelatedGuides
  updatedAt?: string
  ogImage?: string
  /** Glossary entry slugs this article is canonically about (links to DefinedTerm in schema). */
  about?: string[]
  /** Keywords for schema. If absent, derived from breadcrumbLabel + topic. */
  keywords?: string[]
  /** Place name(s) the article specifically covers (e.g. ['India'] or ['European Union']). */
  spatialCoverage?: string[]
  /** When true, emits HowTo JSON-LD using section headings as steps (use only for actual how-tos). */
  howTo?: boolean
}

export default function Pillar({
  data,
  eyebrow,
  slug,
  breadcrumbLabel,
  topic,
  updatedAt = '2026-06-12',
  ogImage,
  about,
  keywords,
  spatialCoverage,
  howTo,
}: Props) {
  const url = `https://invariant-ai.com/${slug}`
  const summaryParas = data.canonical_summary.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)
  const sectionLabel =
    topic === 'nuclear' ? 'Nuclear compliance' : topic === 'space' ? 'Space compliance' : 'Aerospace compliance'
  const ld = [
    ORG_SCHEMA,
    EDITORIAL_TEAM,
    articleSchema({
      title: data.h1,
      description: data.meta_description,
      url,
      datePublished: updatedAt,
      dateModified: updatedAt,
      articleSection: sectionLabel,
      keywords,
      aboutSlugs: about,
      spatialCoverage,
    }),
    faqSchema(data.faqs),
    breadcrumbSchema([
      { name: 'Invariant', url: 'https://invariant-ai.com/' },
      { name: breadcrumbLabel, url },
    ]),
  ]
  if (howTo) {
    ld.push(
      howToSchema({
        name: data.h1,
        description: data.meta_description,
        url,
        steps: data.sections.map((s) => ({
          name: s.heading,
          text: s.paragraphs?.[0]?.slice(0, 280),
        })),
      }),
    )
  }
  return (
    <>
      <Seo
        title={data.meta_title || data.h1}
        description={data.meta_description}
        canonical={url}
        ogImage={ogImage}
        jsonLd={ld}
        ogType="article"
      />
      <article className="bg-paper px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">{eyebrow}</p>
          <h1 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink md:text-5xl lg:text-6xl">
            {data.h1}
          </h1>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
            By the Invariant editorial team · Updated {formatDate(updatedAt)}
          </p>
          {(() => {
            const linked = new Set<string>()
            return summaryParas.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'mt-6 font-sans text-lg leading-relaxed text-ink/70 md:text-xl'
                    : 'mt-4 font-sans text-base leading-relaxed text-ink/65'
                }
              >
                {renderLinkified(p, linked)}
              </p>
            ))
          })()}

          {data.sections.length >= 4 && <Toc sections={data.sections} />}

          {data.sections.map((s, i) => (
            <SectionBlock key={i} section={s} id={sectionId(s.heading, i)} />
          ))}

          <H2>Frequently asked questions</H2>
          <div className="mt-8 divide-y divide-ink/10">
            {(() => {
              const linked = new Set<string>()
              return data.faqs.map((f) => (
                <div key={f.question} className="py-6">
                  <h3 className="font-serif text-xl font-normal text-ink">{f.question}</h3>
                  <p className="mt-3 font-sans text-base leading-relaxed text-ink/65">
                    {renderLinkified(f.answer, linked)}
                  </p>
                </div>
              ))
            })()}
          </div>

          <H2 small>Primary sources</H2>
          <ul className="mt-6 ml-5 list-disc space-y-2 font-sans text-sm text-ink/65">
            {data.citations.map((c) => (
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

          <RelatedGuides currentSlug={slug} pillar={topic} />

          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">
            Last updated {formatDate(updatedAt)}
          </p>
        </div>
      </article>
    </>
  )
}

function sectionId(heading: string, idx: number) {
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
  return slug || `section-${idx + 1}`
}

function Toc({ sections }: { sections: Section[] }) {
  return (
    <nav
      aria-label="Table of contents"
      className="mt-12 rounded-[3px] border border-ink/10 bg-white p-6 md:p-7"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">In this guide</p>
      <ol className="mt-4 space-y-2 font-sans text-sm text-ink/70">
        {sections.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-[11px] tabular-nums text-ink/40 mt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${sectionId(s.heading, i)}`}
              className="hover:text-copper transition-colors"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function SectionBlock({ section, id }: { section: Section; id?: string }) {
  // Fresh "already linked" scope per section so each term can re-link once per section.
  const linked = new Set<string>()
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <H2>{section.heading}</H2>
      {section.paragraphs?.map((p, i) => (
        <p key={i} className="mt-5 font-sans text-base leading-relaxed text-ink/70">
          {renderLinkified(p, linked)}
        </p>
      ))}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-6 ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
          {section.bullets.map((b, i) => (
            <li key={i}>{renderLinkified(b, linked)}</li>
          ))}
        </ul>
      )}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-8 space-y-6">
          {section.subsections.map((sub, i) => {
            const sublinked = new Set(linked)
            return (
              <div key={i} className="rounded-[3px] border border-ink/10 bg-white p-6 md:p-7">
                <h3 className="font-serif text-xl font-normal tracking-[-0.01em] text-ink">{sub.heading}</h3>
                {sub.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-3 font-sans text-base leading-relaxed text-ink/70">
                    {renderLinkified(p, sublinked)}
                  </p>
                ))}
                {sub.bullets && sub.bullets.length > 0 && (
                  <ul className="mt-3 ml-5 list-disc space-y-2 font-sans text-base leading-relaxed text-ink/70">
                    {sub.bullets.map((b, k) => (
                      <li key={k}>{renderLinkified(b, sublinked)}</li>
                    ))}
                  </ul>
                )}
                <SeeAlsoBlock items={sub.see_also} inline />
              </div>
            )
          })}
        </div>
      )}
      <SeeAlsoBlock items={section.see_also} />
    </section>
  )
}

function SeeAlsoBlock({ items, inline }: { items?: SeeAlso[]; inline?: boolean }) {
  if (!items || items.length === 0) return null
  return (
    <div className={inline ? 'mt-4' : 'mt-6'}>
      {items.map((it) => {
        const page = getPage(it.slug)
        const label = it.label || page?.shortTitle || page?.title || it.slug
        return (
          <Link
            key={it.slug}
            to={`/${it.slug}`}
            className="mr-3 inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65 transition-colors hover:border-copper/40 hover:text-copper"
          >
            <span className="text-copper/80">↳</span>
            <span>Continue: {label}</span>
          </Link>
        )
      })}
    </div>
  )
}

function H2({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <h2
      className={`mt-16 font-serif font-normal leading-[1.1] tracking-[-0.02em] text-ink ${
        small ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
      }`}
    >
      {children}
    </h2>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
