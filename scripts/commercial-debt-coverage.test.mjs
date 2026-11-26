import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateDebtCoverage, DEBT_COVERAGE_EXAMPLE } from '../src/data/commercialDebtCoverage.ts'

test('a larger payment lowers DSCR and raises the NOI required without changing yield', () => {
  const result = calculateDebtCoverage(DEBT_COVERAGE_EXAMPLE)
  assert.equal(result.error, undefined)
  assert.equal(result.base.dscr, 600000 / 420000)
  assert.equal(result.base.meetsDscr, true)
  assert.equal(result.base.minimumIncome, 540000)
  assert.equal(result.base.incomeShortfall, 0)
  assert.equal(result.debtYield, 10)
  assert.equal(result.meetsYield, true)
  assert.equal(result.comparison.dscr, 600000 / 540000)
  assert.equal(result.comparison.meetsDscr, false)
  assert.equal(result.comparison.minimumIncome, 675000)
  assert.equal(result.comparison.incomeShortfall, 75000)
  assert.equal(result.serviceLimit, 480000)
  assert.equal(Math.round(result.loanLimitByYield), 6666667)
})

test('exact threshold matches pass despite percentage representation and multiplication rounding', () => {
  const yieldMatch = calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, noi: '29', loan: '100', yieldTarget: '29', service: '20', secondService: '' })
  assert.equal(yieldMatch.meetsYield, true)
  assert.equal(yieldMatch.comparison, null)
  const coverageMatch = calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, noi: '110', loan: '1000', service: '100', dscrTarget: '1.1' })
  assert.equal(coverageMatch.base.meetsDscr, true)
  assert.equal(coverageMatch.base.incomeShortfall, 0)
})

test('losses and zero NOI stay visible and support no positive debt capacity', () => {
  for (const noi of ['0', '-60000']) {
    const result = calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, noi })
    assert.equal(result.base.dscr, Number(noi) / 420000)
    assert.equal(result.debtYield, (Number(noi) / 6000000) * 100)
    assert.equal(result.base.meetsDscr, false)
    assert.equal(result.meetsYield, false)
    assert.equal(result.serviceLimit, 0)
    assert.equal(result.loanLimitByYield, 0)
  }
})

test('missing, invalid and non-positive denominators fail while an empty second schedule is allowed', () => {
  for (const input of [{ noi: '' }, { loan: '0' }, { service: '-1' }, { dscrTarget: 'abc' }, { secondService: '0' }, { yieldTarget: '0' }]) {
    const result = calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, ...input })
    assert.equal(result.field, Object.keys(input)[0])
    assert.match(result.error, /Enter a valid value/)
  }
  assert.equal(calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, secondService: ' ' }).comparison, null)
  assert.match(calculateDebtCoverage({ ...DEBT_COVERAGE_EXAMPLE, noi: '1e308', loan: '0.01' }).error, /magnitude/)
})
