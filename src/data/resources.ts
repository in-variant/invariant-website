import catalogArticles from './.generated-blog-search/dataset-articles.json'
import { publishedDatasets } from './publishedDatasets'
import type { ArticleDataset, ArticleSource, DatasetDownload } from './industryArticles'

export type ResourceTopic = 'Space' | 'Nuclear' | 'Aerospace' | 'Cross-industry' | 'Data Centers' | 'Oil & Gas' | 'Data & APIs'

export type ResourceDataset = Omit<ArticleDataset, 'sourceIds'> & {
  anchor?: string
  datePublished?: string
  sources: string[]
  sourceDetails: Omit<ArticleSource, 'id' | 'linkLabel'>[]
  downloads: DatasetDownload[]
}

export type ResourceArticle = {
  slug: string
  image: string
  date: string
  dateTime: string
  updatedDate?: string
  region?: string
  topic: ResourceTopic
  title: string
  summary: string
  dataset?: ResourceDataset
  additionalDatasets?: ResourceDataset[]
}

type CatalogDataset = Omit<ResourceDataset, 'sources' | 'sourceDetails'> & {
  sourceIndex: number
  sourceCount: number
}
type SourceRecord = ResourceDataset['sourceDetails'][number]
type CatalogArticle = Pick<ResourceArticle, 'slug' | 'title' | 'topic' | 'region' | 'dateTime' | 'image'> & {
  srcSet?: string
  dataset?: CatalogDataset
  additionalDatasets?: CatalogDataset[]
}

function readCatalogSources(entries: { id: string; dataset: CatalogDataset }[]) {
  if (typeof document === 'undefined') return
  const root = document.querySelector('#root[data-hydrate="catalog"]')
  if (!root) return
  const rows = new Map(Array.from(root.querySelectorAll('.dataset-row'), row => [row.id, row]))
  const records: SourceRecord[][] = []
  // Direct visits already have the complete source lists in their prerendered HTML.
  for (const { id, dataset } of entries) {
    const sources = rows.get(id)?.querySelectorAll('.dataset-sources > ul > li')
    if (!sources || sources.length !== dataset.sourceCount) return
    const details: SourceRecord[] = []
    for (const item of sources) {
      const [link, publisherLabel, licenseLabel] = item.children
      const title = link?.textContent
      const publisher = publisherLabel?.textContent
      const url = link?.getAttribute('href')
      const license = licenseLabel?.querySelector('a')?.getAttribute('href')
      if (!title || !publisher || !url?.startsWith('https://') || (licenseLabel && !license?.startsWith('https://'))) return
      details.push({ title, publisher, url, ...(license && { license }) })
    }
    records[dataset.sourceIndex] = details
  }
  return records
}

export async function loadResearchDatasets() {
  const entries = (catalogArticles as CatalogArticle[]).flatMap(article => publishedDatasets(article))
  const records = readCatalogSources(entries) ?? (await import('./.generated-blog-search/dataset-sources.json')).default
  return entries.map(({ dataset: { sourceIndex, sourceCount, ...dataset }, ...entry }) => ({
    ...entry,
    dataset: { ...dataset, sourceDetails: records[sourceIndex] },
  }))
}
