import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleSearchWords, editorialSearchWords, prepareSearch, rankSearch } from '../src/data/blogSearch.ts'

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
