export const DEFAULT_POWER_CASE = {
  it: '50',
  multiplier: '1.25',
  normal: '70',
  outage: '55',
}

export type PowerCase = typeof DEFAULT_POWER_CASE

export const DEFAULT_GRID_CASE = { imports: '0', importsAfterTrip: '0', islandGeneration: '' }
export type GridPowerCase = typeof DEFAULT_GRID_CASE

export const HYBRID_POWER_EXAMPLE = {
  power: { it: '50', multiplier: '1.25', normal: '50', outage: '40' },
  grid: { imports: '20', importsAfterTrip: '20', islandGeneration: '50' },
} satisfies { power: PowerCase; grid: GridPowerCase }

export const DEFAULT_BATTERY_BRIDGE = { power: '10', energy: '2', duration: '15' }
export type BatteryBridge = typeof DEFAULT_BATTERY_BRIDGE

export const DEFAULT_BATTERY_RAMP = { initialShortfall: '', recoveryMinutes: '' }
export type BatteryRamp = typeof DEFAULT_BATTERY_RAMP

export const ISLANDED_POWER_EXAMPLE = {
  power: { it: '500', multiplier: '1.20', normal: '660', outage: '550' },
  battery: { power: '100', energy: '31.25', duration: '35' },
  ramp: { initialShortfall: '100', recoveryMinutes: '5' },
} satisfies { power: PowerCase; battery: BatteryBridge; ramp: BatteryRamp }

export function hundredths(value: string) {
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)) return null
  const scaled = Math.round(Number(value) * 100)
  return Number.isSafeInteger(scaled) ? scaled : null
}

export function calculatePowerCapacity(caseInputs: PowerCase, grid?: GridPowerCase) {
  const it = hundredths(caseInputs.it)
  const multiplier = hundredths(caseInputs.multiplier)
  const normal = hundredths(caseInputs.normal)
  const outage = hundredths(caseInputs.outage)
  const imports = grid ? hundredths(grid.imports) : 0
  const importsAfterTrip = grid ? hundredths(grid.importsAfterTrip) : 0
  const islandPower = grid?.islandGeneration ? hundredths(grid.islandGeneration) : null
  if (it === null || it <= 0 || multiplier === null || multiplier < 100 ||
      normal === null || outage === null || imports === null || importsAfterTrip === null ||
      (grid?.islandGeneration && islandPower === null)) return null

  // In units of 0.0001 MW to keep zero margins and decimal thresholds exact.
  const demand = it * multiplier
  const normalPower = (normal + imports) * 100
  const outagePower = (outage + importsAfterTrip) * 100
  const islandNet = islandPower === null ? null : islandPower * 100
  if (![demand, normalPower, outagePower, islandNet ?? 0].every(Number.isSafeInteger)) return null

  return {
    facilityMw: demand / 10000,
    normalMarginMw: (normalPower - demand) / 10000,
    outageMarginMw: (outagePower - demand) / 10000,
    islandMarginMw: islandNet === null ? null : (islandNet - demand) / 10000,
  }
}

export function calculateBatteryBridge(shortfallMw: number, inputs: BatteryBridge, ramp?: BatteryRamp) {
  const power = hundredths(inputs.power)
  const energy = hundredths(inputs.energy)
  const minutes = hundredths(inputs.duration)
  const recoveryMinutes = ramp ? hundredths(ramp.recoveryMinutes) : 0
  const immediateShortfall = ramp ? hundredths(ramp.initialShortfall) : null
  if (power === null || energy === null || minutes === null || minutes === 0 || recoveryMinutes === null) return null

  const settled = Math.round(shortfallMw * 10000)
  const peak = immediateShortfall === null ? settled : immediateShortfall * 100
  if (ramp && (immediateShortfall === null || recoveryMinutes === 0 || recoveryMinutes > minutes || peak < settled)) return null

  const availablePower = power * 100
  // Add the area above the settled shortfall during a linear recovery.
  // Both energy values use 1 / 120,000,000 MWh to compare limits exactly.
  const required = 2 * settled * minutes + (peak - settled) * recoveryMinutes
  const usable = energy * 1200000
  if (settled < 0 || peak <= 0 || ![settled, peak, availablePower, required, usable].every(Number.isSafeInteger)) return null

  const meetsPower = availablePower >= peak
  return {
    requiredPowerMw: peak / 10000,
    requiredEnergyMwh: required / 120000000,
    runtimeMinutes: meetsPower && !ramp ? usable / settled / 200 : null,
    meetsPower,
    coversDuration: meetsPower && usable >= required,
  }
}
