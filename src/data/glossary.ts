import summaries from './.generated-glossary/index.json'
import topicLabels from './glossary-topics.json'

export type GlossarySummary = Pick<GlossaryEntry, 'slug' | 'term' | 'aliases' | 'short_definition' | 'topic'>
export type GlossaryTopic = keyof typeof topicLabels
export const GLOSSARY_TOPICS = Object.keys(topicLabels) as GlossaryTopic[]
export const GLOSSARY_TOPIC_LABELS = topicLabels

export type GlossaryEntry = {
  slug: string
  term: string
  aliases?: string[]
  seo_title?: string
  short_definition: string
  full_definition: string
  related_to: string[]
  citations: { label: string; url: string }[]
  topic: GlossaryTopic
  last_updated: string
  /** Optional long-form guide this term points readers to. */
  guide?: { label: string; path: string }
}

export const GLOSSARY: GlossarySummary[] = summaries as GlossarySummary[]
export const getGlossarySummary = (slug: string) => GLOSSARY.find(entry => entry.slug === slug)

export function entriesByTopic() {
  const groups = new Map<GlossaryTopic, GlossarySummary[]>(GLOSSARY_TOPICS.map(topic => [topic, []]))
  for (const e of GLOSSARY) groups.get(e.topic)?.push(e)
  return groups
}
