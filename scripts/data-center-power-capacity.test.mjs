import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DEFAULT_POWER_CASE, DEFAULT_GRID_CASE, HYBRID_POWER_EXAMPLE,
  calculatePowerCapacity, calculateBatteryBridge,
} from '../src/data/dataCenterPowerCapacity.ts'

test('the original capacity check still accepts total power in each case', () => {
  assert.deepEqual(calculatePowerCapacity(DEFAULT_POWER_CASE), {
    facilityMw: 62.5, normalMarginMw: 7.5, outageMarginMw: -7.5, islandMarginMw: null,
  })
})

test('grid import is independent in each case and unavailable when islanded', () => {
  const { power, grid } = HYBRID_POWER_EXAMPLE
  assert.deepEqual(calculatePowerCapacity(power, grid), {
    facilityMw: 62.5, normalMarginMw: 7.5, outageMarginMw: -2.5, islandMarginMw: -12.5,
  })
  const exact = calculatePowerCapacity(power, { ...grid, importsAfterTrip: '22.50' })
  assert.equal(exact.outageMarginMw, 0)
  assert.equal(exact.normalMarginMw, 7.5)
  assert.equal(exact.islandMarginMw, -12.5)
})

test('unknown islanded power stays distinct from a confirmed zero', () => {
  assert.equal(calculatePowerCapacity(DEFAULT_POWER_CASE, DEFAULT_GRID_CASE).islandMarginMw, null)
  assert.equal(calculatePowerCapacity(DEFAULT_POWER_CASE, {
    ...DEFAULT_GRID_CASE, islandGeneration: '0',
  }).islandMarginMw, -62.5)
  assert.equal(calculatePowerCapacity(DEFAULT_POWER_CASE, {
    ...DEFAULT_GRID_CASE, islandGeneration: '-1',
  }), null)
})

test('the battery needs both adequate discharge power and usable energy', () => {
  const capacity = calculatePowerCapacity(HYBRID_POWER_EXAMPLE.power, HYBRID_POWER_EXAMPLE.grid)
  const battery = { power: '10', energy: '4', duration: '15' }
  const generatorTrip = calculateBatteryBridge(-capacity.outageMarginMw, battery)
  const island = calculateBatteryBridge(-capacity.islandMarginMw, battery)
  assert.equal(generatorTrip.requiredEnergyMwh, 0.625)
  assert.equal(generatorTrip.coversDuration, true)
  assert.equal(island.requiredEnergyMwh, 3.125)
  assert.equal(island.runtimeMinutes, null)
  assert.equal(island.coversDuration, false)
  assert.equal(calculateBatteryBridge(-capacity.islandMarginMw, {
    power: '12.50', energy: '3.00', duration: '14.40',
  }).coversDuration, true)
})

test('calculates the energy during recovery and the settled shortfall separately', () => {
  const battery = { power: '100', energy: '31.25', duration: '35' }
  const ramp = { initialShortfall: '100', recoveryMinutes: '5' }
  const exact = calculateBatteryBridge(50, battery, ramp)
  assert.equal(exact.requiredPowerMw, 100)
  assert.equal(exact.requiredEnergyMwh, 31.25)
  assert.equal(exact.coversDuration, true)
  assert.equal(calculateBatteryBridge(50, { ...battery, power: '99.99' }, ramp).meetsPower, false)
  assert.equal(calculateBatteryBridge(50, { ...battery, energy: '31.24' }, ramp).coversDuration, false)
})

test('handles a temporary shortfall when generation eventually covers all demand', () => {
  const battery = { power: '30', energy: '1.25', duration: '5' }
  const ramp = { initialShortfall: '30', recoveryMinutes: '5' }
  assert.equal(calculateBatteryBridge(0, battery, ramp).requiredEnergyMwh, 1.25)
  assert.equal(calculateBatteryBridge(0, battery, ramp).coversDuration, true)
  assert.equal(calculateBatteryBridge(0, battery), null)
  assert.equal(calculateBatteryBridge(0, battery, { ...ramp, recoveryMinutes: '6' }), null)
  assert.equal(calculateBatteryBridge(50, battery, ramp), null)
})
