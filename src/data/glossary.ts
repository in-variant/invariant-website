import summaries from './.generated-glossary/index.json'

export type GlossarySummary = Pick<GlossaryEntry, 'slug' | 'term' | 'aliases' | 'short_definition' | 'topic'>

export type GlossaryEntry = {
  slug: string
  term: string
  aliases?: string[]
  seo_title?: string
  short_definition: string
  full_definition: string
  related_to: string[]
  citations: { label: string; url: string }[]
  topic: 'space' | 'nuclear' | 'aerospace' | 'data-centers'
  last_updated: string
  /** Optional long-form guide this term points readers to. */
  guide?: { label: string; path: string }
}

export const GLOSSARY: GlossarySummary[] = summaries as GlossarySummary[]
export const getGlossarySummary = (slug: string) => GLOSSARY.find(entry => entry.slug === slug)

export function entriesByTopic() {
  const groups: Record<GlossaryEntry['topic'], GlossarySummary[]> = { space: [], nuclear: [], aerospace: [], 'data-centers': [] }
  for (const e of GLOSSARY) groups[e.topic]?.push(e)
  return groups
}
