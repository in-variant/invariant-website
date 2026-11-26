import { editorialSearchWords, prepareSearch, rankSearch } from './blogSearch.ts'
import directory from './physical-world-provider-comparisons.json' with { type: 'json' }

const comparisonWords = new Set('alternative best better compare compared comparison competitor recommendation replacement'.split(' '))

function normalizeNames(text: string) {
  return text
    .replace(/\b(?:geo\s+forge|light\s+box|permit\s+pal|west\s+kite)\b/gi, name => name.replace(/\s+/g, ''))
    .replace(/\b(?:www\.)?(regrid|paces|permitpal|landstats|batchdata|parceled|permitintel)\.(?:ai|com|io|us)\b/gi, '$1')
    .replace(/\b(?:www\.)?landrecords(?:\.us)?\b/gi, 'Landstats')
    .replace(/\b(?:www\.)?buildingactivity\.com\b/gi, 'Building Activity')
}

const namesFor = (name: string) => editorialSearchWords(normalizeNames(name)).join(' ')
const searchable = prepareSearch(directory.workflows, workflow => ({
  title: workflow.title,
  relatedTitle: workflow.guide,
  metadata: workflow.test,
  details: workflow.providers.map(({ name }) => normalizeNames(name)).join(' '),
}))

const namesByWorkflow = new Map(directory.workflows.map(workflow => [
  workflow.id,
  workflow.providers.map(({ name }) => ` ${namesFor(name)} `),
]))
const shortProviderNames = ['Arcadia', 'ArcGIS', 'Chmura', 'Esri', 'EVI-FAST', 'HazardHub', 'JobsEQ', 'MAIA']
const providerNames = [...new Set([
  ...[...namesByWorkflow.values()].flat(),
  ...shortProviderNames.map(name => ` ${namesFor(name)} `),
])]
const ranking = { allowPartialMatches: true, longQuestionRanking: true }

export function searchProviderComparisons(query: string) {
  const words = editorialSearchWords(normalizeNames(query)).filter(word => !comparisonWords.has(word))
  // "Here" can be part of a question or the name of the mapping provider.
  const searchingHere = words.join(' ') === 'here' || /\bHERE\b/.test(query) ||
    /\b(?:here\s+(?:maps|vs|versus)|(?:vs|versus)\s+here)\b/i.test(query)
  const phrase = ` ${words.join(' ')} `
  const searchingBuildingActivity = words.join(' ') === 'building activity'
    || /\bBuilding Activity\b/.test(query) || /\bbuildingactivity\.com\b/i.test(query)
    || /\b(?:building activity\s+(?:vs|versus|alternatives?)|(?:vs|versus)\.?\s+building activity)\b/i.test(query)
  const namedProviders = providerNames.filter(name => phrase.includes(name)
    && (name !== ' here ' || searchingHere)
    && (name !== ' building activity ' || searchingBuildingActivity))
  const candidates = namedProviders.length
    ? searchable.filter(({ entry }) => namedProviders.every(name =>
        namesByWorkflow.get(entry.id)?.some(candidateName => candidateName.includes(name))))
    : searchable

  const providerWords = new Set(namedProviders.flatMap(name => name.trim().split(' ')))
  const topic = words.filter(word => !providerWords.has(word) && (word !== 'here' || searchingHere))
  // A vendor-name-only search keeps the directory's order and lists every matching workflow.
  if (!topic.length) return { workflows: candidates.map(({ entry }) => entry), providerOnly: false }

  const workflows = rankSearch(candidates, topic, ranking)
  if (workflows.length || !namedProviders.length || !candidates.length) return { workflows, providerOnly: false }

  // Keep the supplier matches even if the directory cannot answer the full question.
  const indexedTopic = topic.filter(word => /^[a-z]+$/.test(word) && candidates.some(item =>
    item.title.includes(word) || item.relatedTitle.includes(word) || item.metadata.has(word)))
  const related = indexedTopic.length ? rankSearch(candidates, indexedTopic, ranking) : []
  return {
    workflows: [...new Set([...related, ...candidates.map(({ entry }) => entry)])],
    providerOnly: true,
  }
}
