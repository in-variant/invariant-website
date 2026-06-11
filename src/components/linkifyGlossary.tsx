import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GLOSSARY } from '../data/glossary'

// Phrase → slug map. Longest first wins (matters for "10 CFR Part 50" vs "Part 50").
type Phrase = { phrase: string; slug: string }

const PHRASES: Phrase[] = (() => {
  const out: Phrase[] = []
  for (const e of GLOSSARY) {
    const names = new Set<string>()
    names.add(e.term)
    for (const a of e.aliases || []) names.add(a)
    for (const n of names) out.push({ phrase: n, slug: e.slug })
  }
  // sort by phrase length desc so longest matches win
  out.sort((a, b) => b.phrase.length - a.phrase.length)
  return out
})()

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Linkify the first occurrence of each glossary phrase in `text`.
 * `alreadyLinked` tracks slugs already linked higher in the same render scope (e.g. earlier
 * paragraphs in this section); these are skipped so we don't over-link.
 */
export function linkifyGlossary(text: string, alreadyLinked: Set<string>): ReactNode[] {
  type Match = { start: number; end: number; slug: string; raw: string }
  const matches: Match[] = []

  for (const { phrase, slug } of PHRASES) {
    if (alreadyLinked.has(slug)) continue
    // word boundary on each side; case-sensitive (preserves brand voice)
    const re = new RegExp(`(?:^|[^A-Za-z0-9])(${escapeRegex(phrase)})(?=$|[^A-Za-z0-9])`)
    const m = text.match(re)
    if (!m || m.index == null) continue
    const start = m.index + (m[0].length - m[1].length)
    const end = start + m[1].length
    if (matches.some((x) => !(end <= x.start || start >= x.end))) continue
    matches.push({ start, end, slug, raw: m[1] })
    alreadyLinked.add(slug)
  }

  if (matches.length === 0) return [text]

  matches.sort((a, b) => a.start - b.start)
  const out: ReactNode[] = []
  let cursor = 0
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    if (m.start > cursor) out.push(text.slice(cursor, m.start))
    out.push(
      <Link
        key={`${m.slug}-${i}`}
        to={`/glossary/${m.slug}`}
        className="underline decoration-ink/15 underline-offset-4 transition-colors hover:text-copper hover:decoration-copper/60"
      >
        {m.raw}
      </Link>,
    )
    cursor = m.end
  }
  if (cursor < text.length) out.push(text.slice(cursor))
  return out
}

/** Wrap each output piece in <Fragment key /> for React keying. */
export function renderLinkified(text: string, alreadyLinked: Set<string>): ReactNode {
  const pieces = linkifyGlossary(text, alreadyLinked)
  return pieces.map((p, i) => <Fragment key={i}>{p}</Fragment>)
}
