export const DEFAULT_POWER_CASE = {
  it: '50',
  multiplier: '1.25',
  normal: '70',
  outage: '55',
}

export type PowerCase = typeof DEFAULT_POWER_CASE

export const DEFAULT_BATTERY_BRIDGE = { power: '10', energy: '2', duration: '15' }
export type BatteryBridge = typeof DEFAULT_BATTERY_BRIDGE

export function hundredths(value: string) {
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)) return null
  const scaled = Math.round(Number(value) * 100)
  return Number.isSafeInteger(scaled) ? scaled : null
}

export function calculatePowerCapacity(caseInputs: PowerCase) {
  const it = hundredths(caseInputs.it)
  const multiplier = hundredths(caseInputs.multiplier)
  const normal = hundredths(caseInputs.normal)
  const outage = hundredths(caseInputs.outage)
  if (it === null || it <= 0 || multiplier === null || multiplier < 100 ||
      normal === null || outage === null) return null

  // In units of 0.0001 MW to keep zero margins and decimal thresholds exact.
  const demand = it * multiplier
  const normalPower = normal * 100
  const outagePower = outage * 100
  if (![demand, normalPower, outagePower].every(Number.isSafeInteger)) return null

  return {
    facilityMw: demand / 10000,
    normalMarginMw: (normalPower - demand) / 10000,
    outageMarginMw: (outagePower - demand) / 10000,
  }
}

export function calculateBatteryBridge(shortfallMw: number, inputs: BatteryBridge) {
  const power = hundredths(inputs.power)
  const energy = hundredths(inputs.energy)
  const minutes = hundredths(inputs.duration)
  if (power === null || energy === null || minutes === null || minutes === 0) return null

  const shortfall = Math.round(shortfallMw * 10000)
  const availablePower = power * 100
  const required = shortfall * minutes
  // Compare energy in units of 1 / 60,000,000 MWh to preserve exact thresholds.
  const usable = energy * 600000
  if (shortfall <= 0 || ![shortfall, availablePower, required, usable].every(Number.isSafeInteger)) return null

  const meetsPower = availablePower >= shortfall
  return {
    requiredEnergyMwh: required / 60000000,
    runtimeMinutes: meetsPower ? usable / shortfall / 100 : null,
    coversDuration: meetsPower && usable >= required,
  }
}
