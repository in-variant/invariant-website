export const AEP_DEMAND_SLUG = 'aep-ohio-data-center-demand-charge'
export const AEP_DEMAND_PATH = `/calculators/${AEP_DEMAND_SLUG}`
export const AEP_DEMAND_TITLE = 'AEP Ohio data center demand charge calculator'
export const AEP_DEMAND_DESCRIPTION = 'Calculate monthly billing demand and base distribution charges for an AEP Ohio Schedule DCT new-load contract during or after its load ramp.'

export const AEP_DEMAND_RATES = {
  primary: { distributionRate: 8.08, customerCharge: 186.30 },
  secondary: { distributionRate: 9.05, customerCharge: 21.00 },
}

export type AepDemandInputs = {
  phase: 'ramp' | 'after'
  voltage: keyof typeof AEP_DEMAND_RATES
  contractMw: string
  meteredMw: string
  rampMw: string
  priorBilledMw: string
}

export const AEP_DEMAND_EXAMPLE: AepDemandInputs = {
  phase: 'after',
  voltage: 'primary',
  contractMw: '100',
  meteredMw: '65',
  rampMw: '50',
  priorBilledMw: '100',
}

export function calculateAepDemandCharge(inputs: AepDemandInputs) {
  const ramping = inputs.phase === 'ramp'
  const reference = ramping ? inputs.rampMw : inputs.priorBilledMw
  const numericInputs = [inputs.contractMw, inputs.meteredMw, reference]
  if (numericInputs.some(value => !value.trim() || !Number.isFinite(Number(value)) || Number(value) < 0)) {
    return { error: 'Enter zero or a positive number for each visible demand field.' } as const
  }
  const [contractMw, meteredMw, referenceMw] = numericInputs.map(Number)
  if (contractMw < 25.001) return { error: 'Enter at least 25.001 MW of contract capacity for this single-contract example.' } as const
  if (ramping && (referenceMw <= 0 || referenceMw > contractMw)) {
    return { error: 'Enter an agreed ramp capacity above zero and at or below the contract capacity.' } as const
  }

  const contractFloor = contractMw <= 75
    ? 15 + 0.85 * (contractMw - 25)
    : Math.min(57.5 + contractMw - 75, 0.85 * contractMw)
  const minimumMw = ramping ? 0.85 * referenceMw : contractFloor
  const priorBillFloor = ramping ? 0 : 0.85 * referenceMw
  const billedMw = Math.max(meteredMw, minimumMw, priorBillFloor)
  const { distributionRate, customerCharge } = AEP_DEMAND_RATES[inputs.voltage]
  const distributionCharge = billedMw * (1_000 * distributionRate)
  const additionalCharge = (billedMw - meteredMw) * (1_000 * distributionRate)
  const baseMonthlyCharge = distributionCharge + customerCharge
  if (![baseMonthlyCharge, additionalCharge].every(Number.isFinite)) {
    return { error: 'Reduce the magnitude of the entered demands.' } as const
  }

  return { billedMw, minimumMw, priorBillFloor, distributionRate, distributionCharge,
    additionalCharge, customerCharge, baseMonthlyCharge, aboveContract: meteredMw > contractMw } as const
}
