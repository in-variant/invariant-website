import snapshotData from './virginia-industrial-sites-snapshot.json' with { type: 'json' }

export const VIRGINIA_SITES_PATH = '/virginia-industrial-land-for-sale'
export const VIRGINIA_SITES_TITLE = 'Virginia industrial land for sale by acreage'
export const VIRGINIA_SITES_DESCRIPTION = 'Screen Virginia land listings by total acreage, largest contiguous block, and acres reported suitable for construction. Review local zoning and open the original listings.'
export const VEDP_DIRECTORY = 'https://sites.vedp.org/'
export const VEDP_SITE_LAYER = 'https://maps.vedp.org/arcgis/rest/services/OpenData/PropertiesSites/MapServer/1'
const pageSize = 1000
const fields = ['OBJECTID', 'PropertyID', 'Name', 'LocalityName', 'TotalAcreage', 'LargestContiguousAcreage',
  'AcreageSuitableForConstruction', 'ZoningClassification', 'DateModified']

export type VirginiaSite = {
  recordId: number
  propertyId: number
  name: string
  locality: string | null
  gross: number | null
  contiguous: number | null
  construction: number | null
  zoning: string | null
  sourceUpdated: string | null
}

export const virginiaSitesSnapshot: {
  checkedAt: string
  sourceQuery: string
  saleListings: number
  screens: { minimum: number; gross: number; contiguous: number; construction: number }[]
  examples: VirginiaSite[]
} = snapshotData

export function vedpListingUrl(id: number) {
  return `${VEDP_DIRECTORY}PropertyByID/${id}`
}

export function screenVirginiaSites(sites: readonly VirginiaSite[], minimum: number) {
  const gross = sites.filter(site => site.gross !== null && site.gross >= minimum)
  const contiguous = gross.filter(site => site.contiguous !== null && site.contiguous >= minimum)
  const construction = contiguous.filter(site => site.construction !== null && site.construction >= minimum)
  return { gross: gross.length, contiguous: contiguous.length, construction: construction.length, matches: construction }
}

export function hasVirginiaAcreageConflict(site: VirginiaSite) {
  return site.gross !== null && ((site.contiguous ?? 0) > site.gross || (site.construction ?? 0) > site.gross)
}

function readAcreage(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
}

function readText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function readRecord({ attributes }: { attributes?: Record<string, unknown> }): VirginiaSite {
  const { OBJECTID, PropertyID, Name, LocalityName, TotalAcreage, LargestContiguousAcreage,
    AcreageSuitableForConstruction, ZoningClassification, DateModified } = attributes ?? {}
  if (typeof OBJECTID !== 'number' || !Number.isSafeInteger(OBJECTID) || OBJECTID <= 0 ||
    typeof PropertyID !== 'number' || !Number.isSafeInteger(PropertyID) || PropertyID <= 0) {
    throw new Error('Invalid site identity returned by the public directory.')
  }
  return {
    recordId: OBJECTID, propertyId: PropertyID, name: readText(Name) ?? `Listing ${PropertyID}`, locality: readText(LocalityName),
    gross: readAcreage(TotalAcreage), contiguous: readAcreage(LargestContiguousAcreage),
    construction: readAcreage(AcreageSuitableForConstruction), zoning: readText(ZoningClassification),
    sourceUpdated: readText(DateModified)?.match(/^\d{4}-\d{2}-\d{2}\b/)?.[0] ?? null,
  }
}

export async function fetchVirginiaSites(signal: AbortSignal) {
  const sites: VirginiaSite[] = []
  let lastRecord = 0
  while (true) {
    const params = new URLSearchParams({
      f: 'json', where: lastRecord ? `Sale=1 AND OBJECTID>${lastRecord}` : 'Sale=1',
      outFields: fields.join(','), returnGeometry: 'false', orderByFields: 'OBJECTID ASC',
      resultRecordCount: String(pageSize),
    })
    const response = await fetch(`${VEDP_SITE_LAYER}/query?${params}`, { signal })
    if (!response.ok) throw new Error('The public directory did not return a successful response.')
    const data = await response.json()
    if (!Array.isArray(data?.features) || data.error) throw new Error('The public directory returned an invalid result.')
    for (const feature of data.features) {
      const site = readRecord(feature)
      if (site.recordId <= lastRecord) throw new Error('The public directory returned overlapping results.')
      lastRecord = site.recordId
      sites.push(site)
    }
    if (data.features.length === 0 || (data.features.length < pageSize && data.exceededTransferLimit !== true)) return sites
  }
}
