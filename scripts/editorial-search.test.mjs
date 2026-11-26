import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleSearchWords, editorialSearchWords, expandArticleSearchDetails, prepareSearch, rankSearch } from '../src/data/blogSearch.ts'
import { searchProviderComparisons } from '../src/data/providerComparisonSearch.ts'

const index = prepareSearch([
  { title: 'Find a 100 MW data center site', metadata: 'Powered land and phased utility service' },
  { title: 'Find a 50 MW data center site', metadata: 'Powered land and phased utility service' },
  { title: 'Verify industrial rail spur service', metadata: 'Crossing rights and delivered railcars' },
  { title: 'Chicago workplace and resident job catchments', metadata: 'Logan Square and Washington/Wabash' },
  { title: 'Commercial property ownership records', metadata: 'Parcel and building records by address' },
  { title: 'Unrelated guide', metadata: '', bodyTerms: ['industrial', 'rail', 'spur', 'serve'] },
], entry => entry)
const search = query => rankSearch(index, editorialSearchWords(query), { allowPartialMatches: true })
  .map(result => result.title)

test('compressed search postings keep exact membership across adjacent and skipped documents', () => {
  const details = expandArticleSearchDetails({
    documents: [
      { slug: 'registry', headings: 'Recorded instruments' },
      { slug: 'forecast', headings: 'Load forecasts' },
      { slug: 'unindexed-body', headings: 'A short guide' },
      { slug: 'tax-lot', headings: 'Assessor records' },
    ],
    bodyPostings: { parcel: [1, 3], archive: [2], record: [1, 1, 2] },
  })
  assert.deepEqual(details, {
    registry: { headings: 'Recorded instruments', bodyTerms: ['parcel', 'record'] },
    forecast: { headings: 'Load forecasts', bodyTerms: ['archive', 'record'] },
    'unindexed-body': { headings: 'A short guide', bodyTerms: [] },
    'tax-lot': { headings: 'Assessor records', bodyTerms: ['parcel', 'record'] },
  })
})

test('editorial query cleanup retains the sites and evidence terms', () => {
  assert.deepEqual(editorialSearchWords('Could you show me workplace jobs near Logan Square?'),
    ['workplace', 'job', 'logan', 'square'])
  assert.deepEqual(editorialSearchWords('Can this industrial rail spur serve my warehouse?'),
    ['industrial', 'rail', 'spur', 'serve', 'warehouse'])
})

test('related terms and partial matching find the guide with strong title evidence', () => {
  assert.deepEqual(search('Where can I find employment near Logan Square?'),
    ['Chicago workplace and resident job catchments'])
  assert.deepEqual(search('Can this industrial rail spur serve my warehouse?'),
    ['Verify industrial rail spur service'])
  assert.deepEqual(search('Who owns this parcel?'),
    ['Commercial property ownership records'])
})

test('editorial search preserves matching power sizes and requires any numeric term', () => {
  assert.deepEqual(search('100MW land'), ['Find a 100 MW data center site'])
  assert.deepEqual(search('0.1 GW land'), ['Find a 100 MW data center site'])
  assert.deepEqual(search('50 MW land'), ['Find a 50 MW data center site'])
  assert.deepEqual(search('73 MW land ready for service'), [])
})

test('the field search uses the original token matching', () => {
  assert.deepEqual(rankSearch(index, articleSearchWords('employment')), [])
  assert.equal(rankSearch(index, articleSearchWords('parcel'))[0].title, 'Commercial property ownership records')
})

const questionIndex = prepareSearch([
  {
    title: 'Historical parcel boundaries by date',
    metadata: 'Reproduce boundary changes across a split or merger',
    bodyTerms: ['retained', 'lot', 'geometry', 'fiscal'],
  },
  {
    title: 'Commercial real estate ownership',
    metadata: 'Consider prior deeds and mortgage records',
    bodyTerms: ['parcel', 'transaction', 'boundaries', 'geometry', 'prior', 'county'],
  },
  {
    title: 'Commercial roof age underwriting',
    metadata: 'Insurance roof permits and inspections',
  },
], entry => entry)
const question = editorialSearchWords('How can I compare a parcel split with the prior geometry and retain the original lot record in my audit file?')
const editorialOptions = { allowPartialMatches: true, longQuestionRanking: true }

test('full questions recover a guide with specific overlap in title, summary, and records', () => {
  assert.equal(rankSearch(questionIndex, question, { allowPartialMatches: true }).length, 0)
  assert.equal(rankSearch(questionIndex, question, editorialOptions)[0].title, 'Historical parcel boundaries by date')
  assert.deepEqual(rankSearch(questionIndex, editorialSearchWords('mortgage records'), editorialOptions),
    [questionIndex[1].entry])
})

test('long unrelated searches do not fall back from a missing exact power size', () => {
  const words = editorialSearchWords('Find powered land with 73 MW, phased utility capacity, grid service, and a documented delivery schedule')
  assert.deepEqual(rankSearch(index, words, editorialOptions), [])
  assert.deepEqual(rankSearch(questionIndex, editorialSearchWords('Show recipes for raspberry pie and how I might make a pastry from scratch for dinner'), editorialOptions), [])
})

test('load flow questions can find a study guide for a project with an unfamiliar size', () => {
  const studyIndex = prepareSearch([
    { title: 'Power flow study for a data center', metadata: 'Commission a study for phased campus loads and contingencies' },
    { title: 'A 100 MW data center for sale', metadata: 'Utility service for a phased campus' },
  ], entry => entry)
  const words = editorialSearchWords('Where do I begin commissioning a load flow study for a 143 MW data center?')
  assert.deepEqual(rankSearch(studyIndex, words, editorialOptions), [studyIndex[0].entry])
  const listing = editorialSearchWords('Find a data center for sale with 143 MW and a load flow study')
  assert.deepEqual(rankSearch(studyIndex, listing, editorialOptions), [])
})

test('a worksheet request can find the guide without a listing at the requested MW', () => {
  const worksheetIndex = prepareSearch([
    { title: '100 MW data center site for sale', metadata: 'Find land with a utility service path' },
    { title: 'Data center site selection checklist', metadata: 'Verify the land option, utility service, dates and study', details: 'Land option and service date' },
  ], item => item)
  const request = editorialSearchWords('What should I verify before paying for a site option for a 60 MW data center? Is there a checklist I can use?')
  const offers = editorialSearchWords('Find land for sale for a 60 MW data center, including utility service and any checklist')
  assert.equal(rankSearch(worksheetIndex, request, editorialOptions)[0]?.title, 'Data center site selection checklist')
  assert.deepEqual(rankSearch(worksheetIndex, offers, editorialOptions), [])
})

test('a phrase in one heading carries more weight than words across neighboring headings', () => {
  const index = prepareSearch([
    { title: 'Grid review one', metadata: 'Verify the site connection before a utility load study', details: 'Ask the utility\nLoad study documentation' },
    { title: 'Grid review two', metadata: 'Verify the site connection before a utility load study', details: 'Ask the utility load study team\nDocumentation' },
    { title: 'Wildfire hazard guide', metadata: 'State severity maps' },
    { title: 'Historical zoning parcels', metadata: 'Track local ordinance amendments' },
    { title: 'Shopping district visits', metadata: 'Compare pedestrian counts' },
    { title: 'Agricultural productivity', metadata: 'Crop rotations and drainage' },
  ], item => item)
  const request = editorialSearchWords('Which utility load study documents should I verify before taking a loan for this land development with a site connection?')
  assert.equal(rankSearch(index, request, editorialOptions)[0]?.title, 'Grid review two')
})

test('editorial tokens normalize U.S. and notification phrasing', () => {
  assert.deepEqual(articleSearchWords('U.S. zoning permits'), articleSearchWords('United States zoning permits'))
  assert.deepEqual(editorialSearchWords('How do I get notified when nearby permits are issued?'),
    ['alert', 'nearby', 'permit', 'issued'])
})

test('comparison search recognizes provider names, variants and buyer phrasing', () => {
  const cases = [
    ['Regrid vs Light Box', 'parcel-boundaries'],
    ['Paces alternatives for a load flow study', 'power-flow'],
    ['Permit Pal alternatives for local opposition', 'development-risk'],
    ['Mireye.com API for flood zones', 'flood-hazard'],
    ['Regrid and LightBox MCP servers for US parcel data with provenance', 'gis-agents'],
    ['Which provider can verify contractor permit history in NYC?', 'contractor-permit-history'],
    ['Lightcast labor shed', 'manufacturing-labor-shed'],
    ['Which API covers parcel boundaries here?', 'parcel-boundaries'],
    ['HERE vs TomTom', 'charging-data'],
    ['Acres Intelligence vs Land id', 'site-screening'],
    ['Google Earth Engine vs CARTO', 'gis-integration'],
    ['Land Use Labs vs Zoneomics', 'zoning'],
    ['Jupiter Intelligence vs First Street', 'flood-hazard'],
    ['Paces vs GridUnity', 'power-flow'],
    ['Transect vs Enverus', 'renewable-siting'],
    ['PermitFlow vs Shovels', 'building-permits'],
    ['Moody’s CRE vs MSCI Real Capital Analytics', 'lending'],
    ['Kalibrate vs Placer.ai', 'retail-location'],
    ['Lens by Upstream Tech', 'agricultural-land'],
  ]
  for (const [query, expected] of cases) {
    const { workflows, providerOnly } = searchProviderComparisons(query)
    assert.equal(workflows[0]?.id, expected, query)
    assert.equal(providerOnly, false, query)
  }
})

test('comparison search requires named providers to share a workflow', () => {
  const { workflows, providerOnly } = searchProviderComparisons('Geoforge versus Paces')
  assert.deepEqual(workflows.map(({ id }) => id), ['power-flow', 'data-center-siting-platforms'])
  assert.equal(providerOnly, false)
  assert.deepEqual(searchProviderComparisons('Paces vs LightBox').workflows, [])
  assert.deepEqual(searchProviderComparisons('Regrid vs JobsEQ').workflows, [])
  assert.equal(searchProviderComparisons('Lightcast vs JobsEQ').workflows[0]?.id, 'manufacturing-labor-shed')
  assert.deepEqual(searchProviderComparisons('Recipe for a blueberry pie').workflows, [])
})

test('comparison search keeps provider matches visible for unsupported criteria', () => {
  const result = searchProviderComparisons('LightBox and Regrid for Arizona zoning')
  assert.equal(result.providerOnly, true)
  assert.equal(result.workflows[0].id, 'zoning')
  for (const { providers } of result.workflows) {
    assert(providers.some(({ name }) => name === 'Regrid'))
    assert(providers.some(({ name }) => name === 'LightBox'))
  }
})
