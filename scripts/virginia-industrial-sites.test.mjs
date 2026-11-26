import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchVirginiaSites, hasVirginiaAcreageConflict, screenVirginiaSites, virginiaSitesSnapshot, vedpListingUrl } from '../src/data/virginiaIndustrialSites.ts'

test('acreage checks are cumulative and keep missing acreage out of matches', () => {
  const site = virginiaSitesSnapshot.examples.find(row => row.propertyId === 233928)
  const result = screenVirginiaSites([
    site,
    { ...site, recordId: 2, contiguous: null },
    { ...site, recordId: 3, construction: 99.99 },
    { ...site, recordId: 4, gross: 60 },
  ], 100)
  assert.deepEqual(result, { gross: 3, contiguous: 2, construction: 1, matches: [site] })
  assert.equal(vedpListingUrl(site.propertyId), 'https://sites.vedp.org/PropertyByID/233928')
  assert.equal(hasVirginiaAcreageConflict(site), false)
  assert.equal(hasVirginiaAcreageConflict({ ...site, construction: 204 }), true)
  assert.equal(hasVirginiaAcreageConflict({ ...site, gross: null }), false)
})

test('reads all live pages without dropping source IDs or confusing unknown with zero', async t => {
  const responses = [
    { features: [{ attributes: { OBJECTID: 451, PropertyID: 21, Name: 'First', TotalAcreage: 115, LargestContiguousAcreage: 106 } }], exceededTransferLimit: true },
    { features: [{ attributes: { OBJECTID: 452, PropertyID: 22, Name: 'Second', DateModified: '2026-11-05 15:30:00', TotalAcreage: 0 } }] },
  ]
  const visited = []
  t.mock.method(globalThis, 'fetch', async url => {
    visited.push(new URL(url).searchParams.get('where'))
    return Response.json(responses.shift())
  })
  const sites = await fetchVirginiaSites(new AbortController().signal)
  assert.deepEqual(visited, ['Sale=1', 'Sale=1 AND OBJECTID>451'])
  assert.deepEqual(sites.map(site => [site.recordId, site.propertyId, site.gross, site.construction, site.sourceUpdated]), [
    [451, 21, 115, null, null],
    [452, 22, 0, null, '2026-11-05'],
  ])
})

test('rejects invalid ArcGIS responses and non-increasing IDs', async t => {
  const responses = [
    { error: { code: 400, message: 'Invalid request' } },
    { features: [{ attributes: { OBJECTID: 451, PropertyID: 21 } }], exceededTransferLimit: true },
    { features: [{ attributes: { OBJECTID: 451, PropertyID: 21 } }] },
  ]
  t.mock.method(globalThis, 'fetch', async () => Response.json(responses.shift()))
  await assert.rejects(fetchVirginiaSites(new AbortController().signal), /invalid result/)
  await assert.rejects(fetchVirginiaSites(new AbortController().signal), /overlapping results/)
})
