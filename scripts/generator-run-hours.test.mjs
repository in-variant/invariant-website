import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateRunHours, EMPTY_RUN, LOUDOUN_EXAMPLE } from '../src/data/generatorRunHours.ts'

test('a two-hour test of 21 engines can exceed the group limit alone', () => {
  assert.deepEqual(calculateRunHours(LOUDOUN_EXAMPLE), {
    added: 42,
    engineAdded: 2,
    group: { projected: 1122, remaining: -22 },
    engine: { projected: 41, remaining: 459 },
  })
})

test('a ledger requires both prior and current hours, including a confirmed zero', () => {
  assert.equal(calculateRunHours(EMPTY_RUN).added, null)
  const group = { previous: '0', current: '', limit: '10' }
  const estimate = calculateRunHours({ ...LOUDOUN_EXAMPLE, group })
  assert.equal(estimate.group, null)
  assert.equal(estimate.engine.projected, 41)
  const zeroMonth = calculateRunHours({ ...LOUDOUN_EXAMPLE, group: { ...group, current: '0', limit: '' } })
  assert.deepEqual(zeroMonth.group, { projected: 42, remaining: null })
})

test('decimal hours compare exactly at the entered limit', () => {
  const group = { previous: '0.1', current: '0.2', limit: '0.6' }
  const estimate = calculateRunHours({ ...EMPTY_RUN, engines: '3', duration: '0.10', group })
  assert.equal(estimate.added, 0.3)
  assert.deepEqual(estimate.group, { projected: 0.6, remaining: 0 })
})

test('incomplete or invalid run inputs and unsafe totals cannot produce a group result', () => {
  for (const engines of ['', '0', '-1', '2.5', '4e2', '9007199254740991']) {
    assert.equal(calculateRunHours({ ...LOUDOUN_EXAMPLE, engines }).group, null)
  }
  for (const duration of ['0', '-1', '1.0001', '1e5', '']) {
    assert.equal(calculateRunHours({ ...LOUDOUN_EXAMPLE, duration }).engine, null)
  }
  const group = { previous: '90071992547409.00', current: '1', limit: '200' }
  assert.equal(calculateRunHours({ ...LOUDOUN_EXAMPLE, group }).group, null)
})
