export const BATTERY_RECHARGE_SLUG = 'battery-recharge-window'
export const BATTERY_RECHARGE_PATH = `/calculators/${BATTERY_RECHARGE_SLUG}`
export const BATTERY_RECHARGE_TITLE = 'Battery storage recharge calculator'
export const BATTERY_RECHARGE_DESCRIPTION = 'Check whether a grid-scale battery can recharge before its next dispatch. Enter the MW available in each charging window, usable MWh, round-trip efficiency and the site’s export limit.'

export const BATTERY_INPUTS = {
  targetMw: '100', targetHours: '4', exportMw: '100', usableMwh: '400', efficiency: '90',
  firstMw: '50', firstHours: '8', secondMw: '0', secondHours: '0',
}

export type BatteryInputs = typeof BATTERY_INPUTS

function exceeds(value: number, limit: number) {
  return value - limit > Math.max(value, limit) * 4 * Number.EPSILON
}

export function calculateBatteryRecharge(inputs: BatteryInputs) {
  const values = Object.values(inputs)
  if (values.some(value => value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0)) {
    return { error: 'Enter a nonnegative number in each field. Set unused charging hours or unavailable import power to zero.' } as const
  }

  const { targetMw, targetHours, exportMw, usableMwh, efficiency, firstMw, firstHours, secondMw, secondHours } =
    Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, Number(value)]))
  if (targetMw === 0 || targetHours === 0) return { error: 'Enter a positive dispatch power and duration.' } as const
  if (efficiency <= 0 || efficiency > 100) return { error: 'Enter a round-trip efficiency above 0% and at most 100%.' } as const
  const cycleHours = firstHours + secondHours + targetHours
  if (!Number.isFinite(cycleHours) || exceeds(cycleHours, 24)) {
    return { error: 'Keep the two charging windows and the dispatch within one 24-hour cycle.' } as const
  }

  const targetMwh = targetMw * targetHours
  const inputMwh = firstMw * firstHours + secondMw * secondHours
  const gridEnergyNeeded = targetMwh / (efficiency / 100)
  const availableMwh = Math.min(usableMwh, inputMwh * (efficiency / 100))
  const duration = availableMwh / targetMw
  if (![targetMwh, inputMwh, gridEnergyNeeded, duration].every(Number.isFinite)) {
    return { error: 'Reduce the magnitude of the entered values.' } as const
  }

  return {
    targetMwh,
    inputMwh,
    gridEnergyNeeded,
    availableMwh,
    duration,
    energyShortfall: exceeds(targetMwh, availableMwh) ? targetMwh - availableMwh : 0,
    capacityShortfall: exceeds(targetMwh, usableMwh),
    exportShortfall: exceeds(targetMw, exportMw) ? targetMw - exportMw : 0,
  } as const
}
