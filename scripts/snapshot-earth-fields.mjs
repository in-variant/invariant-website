import { readFile, writeFile } from 'node:fs/promises'

const product = JSON.parse(await readFile(new URL('../src/data/earth-product.json', import.meta.url), 'utf8'))
const manifests = [
  ['point', product.links.pointFields],
  ['parcel', product.links.parcelFields],
]
const fields = new Map()
const counts = {}
const publisherLinks = new Map([
  ['https://doi.org/10.25921/rjys-b235', 'https://www.ncei.noaa.gov/sites/default/files/2022-04/Readme_Monthly_Gridded_Normals.pdf'],
  ['https://www.usgs.gov/national-structures-dataset', 'https://data.usgs.gov/datacatalog/data/USGS%3Adb4fb1b6-1282-4e5b-9866-87a68912c5d1'],
])
const countyPermitFields = new Set([
  'county_building_permits_total_annual',
  'county_building_permits_sf_annual',
  'county_building_permits_yoy_pct',
])
const responses = await Promise.all(manifests.map(async ([operation, url]) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error(`${operation} manifest returned HTTP ${response.status}`)
  const { fields: rows } = await response.json()
  if (!Array.isArray(rows) || rows.length === 0) throw new Error(`Empty ${operation} field manifest`)
  return [operation, rows]
}))

for (const [operation, rows] of responses) {
  const names = new Set()
  for (const { name, label, description, unit, source, source_url } of rows) {
    if (!/^[a-z_][a-z_0-9]*$/.test(name) || names.has(name) ||
        !description || !source || new URL(source_url).protocol !== 'https:') {
      throw new Error(`Invalid or repeated ${operation} field ${name}`)
    }
    names.add(name)
    const field = fields.get(name) ?? { name, definitions: {} }
    if (label) field.label = label
    const operatorOnly = /\boperator keys only\b/i.test(description)
    // The manifest groups the Building Permits Survey metrics with Census market fields.
    const isCountyPermit = source === 'CENSUS_ACS_TRACT_STATS' && countyPermitFields.has(name)
    const sourceUrl = isCountyPermit
      ? 'https://www.census.gov/construction/bps/index.html'
      : publisherLinks.get(source_url) ?? source_url
    field.definitions[operation] = {
      description, unit, source, sourceUrl,
      ...(isCountyPermit && { sourceLabel: 'Census Building Permits Survey' }),
      ...(operatorOnly && { operatorOnly }),
    }
    fields.set(name, field)
  }
  counts[operation] = names.size
}

const summary = {
  checkedDate: new Date().toISOString().slice(0, 10),
  distinct: fields.size,
  point: counts.point,
  parcel: counts.parcel,
  shared: counts.point + counts.parcel - fields.size,
  operatorOnly: [...fields.values()].filter(field => Object.values(field.definitions).some(definition => definition.operatorOnly)).length,
}
const sortedFields = [...fields.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
const snapshot = `[\n${sortedFields.map(field => '  ' + JSON.stringify(field)).join(',\n')}\n]\n`
await writeFile(new URL('../public/data-coverage-fields.json', import.meta.url), snapshot)
await writeFile(new URL('../src/data/earth-coverage-summary.json', import.meta.url), JSON.stringify(summary, null, 2) + '\n')
console.log(`Captured ${summary.distinct} names from ${summary.point} point and ${summary.parcel} parcel fields`)
