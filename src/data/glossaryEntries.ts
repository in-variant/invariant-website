import type { GlossaryEntry } from './glossary'

const entries = import.meta.glob<GlossaryEntry>('/src/data/.generated-glossary/entries/*.json', { import: 'default' })

export const glossaryModulePath = (slug: string) => `/src/data/.generated-glossary/entries/${slug}.json`
export const glossaryLoader = (slug: string) => entries[glossaryModulePath(slug)]
