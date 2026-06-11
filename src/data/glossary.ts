import raw from '../pages/_data/glossary.json'

export type GlossaryEntry = {
  slug: string
  term: string
  aliases?: string[]
  short_definition: string
  full_definition: string
  related_to: string[]
  citations: { label: string; url: string }[]
  topic: 'space' | 'nuclear' | 'aerospace'
  last_updated: string
}

export const GLOSSARY: GlossaryEntry[] = (raw.entries ?? []) as GlossaryEntry[]

export function getEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((e) => e.slug === slug)
}

export function entriesByTopic(): Record<'space' | 'nuclear' | 'aerospace', GlossaryEntry[]> {
  const groups = { space: [] as GlossaryEntry[], nuclear: [] as GlossaryEntry[], aerospace: [] as GlossaryEntry[] }
  for (const e of GLOSSARY) groups[e.topic]?.push(e)
  return groups
}
