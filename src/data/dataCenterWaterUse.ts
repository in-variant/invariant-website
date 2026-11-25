export const WATER_USE_SLUG = 'data-center-water-use'
export const WATER_USE_PATH = `/calculators/${WATER_USE_SLUG}`
export const WATER_USE_TITLE = 'Data center water use calculator'
export const WATER_USE_DESCRIPTION = 'Estimate on-site water use from average IT load and water usage effectiveness, or calculate WUE from annual water and IT energy records.'

export type WaterUseInputs = {
  mode: 'estimate' | 'derive'
  energyBasis: 'load' | 'metered'
  days: '365' | '366'
  averageMw: string
  annualGwh: string
  wue: string
  annualGallonsMillion: string
}

export const WATER_USE_EXAMPLE: WaterUseInputs = {
  mode: 'estimate',
  energyBasis: 'load',
  days: '365',
  averageMw: '100',
  annualGwh: '876',
  wue: '0.6',
  annualGallonsMillion: '138.848831',
}

const LITERS_PER_US_GALLON = 3.785411784

export function calculateWaterUse(inputs: WaterUseInputs) {
  const days = Number(inputs.days)
  const energyInput = Number(inputs.energyBasis === 'load' ? inputs.averageMw : inputs.annualGwh)
  const rawWater = inputs.mode === 'estimate' ? inputs.wue : inputs.annualGallonsMillion
  const waterInput = Number(rawWater)
  if (!Number.isFinite(energyInput) || energyInput <= 0) {
    return { error: 'Enter a positive IT load or annual IT energy value.' } as const
  }
  if (!rawWater.trim() || !Number.isFinite(waterInput) || waterInput < 0) {
    return { error: 'Enter zero or a positive number for water use or WUE.' } as const
  }

  const annualGwh = inputs.energyBasis === 'load' ? energyInput * (days * 24 / 1000) : energyInput
  const annualLitersMillion = inputs.mode === 'estimate' ? waterInput * annualGwh : waterInput * LITERS_PER_US_GALLON
  const annualGallonsMillion = annualLitersMillion / LITERS_PER_US_GALLON
  const dailyGallons = annualGallonsMillion * (1_000_000 / days)
  const wue = inputs.mode === 'estimate' ? waterInput : annualLitersMillion / annualGwh
  if (![annualGwh, annualLitersMillion, annualGallonsMillion, dailyGallons, wue].every(Number.isFinite)) {
    return { error: 'Reduce the magnitude of the entered values.' } as const
  }

  return { annualGwh, annualLitersMillion, annualGallonsMillion, dailyGallons, wue } as const
}
