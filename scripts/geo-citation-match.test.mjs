import assert from 'node:assert/strict'
import test from 'node:test'
import { matchTargetCitations } from './geo-citation-match.mjs'

const page = 'https://invariant-ai.com/blog/data-center-sites-for-sale-oregon'
const section = 'redmond-powered-shell'
const target = `${page}#${section}`
const match = (expected, ...destinations) => matchTargetCitations(expected, destinations.map(destination => ({ destination })))

test('an article URL or a different heading does not satisfy a section target', () => {
  assert.deepEqual(match(target, page, `${page}#sites-available`), {
    html: true, markdown: false, section: false,
  })
})

test('a canonical section can include tracking parameters, URL encoding, and a text selector', () => {
  const special = 'checklist,-in-order'
  const encoded = encodeURIComponent(special)
  const citation = `${page.replace('://', '://www.')}/?source=answer#${encoded}:~:text=scope`
  assert.deepEqual(match(`${page}#${special}`, citation), {
    html: true, markdown: false, section: true,
  })
})

test('Markdown and unrelated HTML URLs cannot satisfy a canonical section target', () => {
  assert.deepEqual(match(target, `${page}.md#${section}`, `https://example.com${new URL(page).pathname}#${section}`, null), {
    html: false, markdown: true, section: false,
  })
})

test('page-only targets keep section results unscored', () => {
  assert.deepEqual(match(page, target), { html: true, markdown: false, section: null })
  assert.deepEqual(match(null, target), { html: false, markdown: false, section: null })
})

test('malformed or text-only fragments do not satisfy a named section', () => {
  assert.deepEqual(match(target, `${page}#%ff`, `${page}#:~:text=${section}`), {
    html: true, markdown: false, section: false,
  })
})
