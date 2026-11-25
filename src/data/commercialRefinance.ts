export const REFINANCE_SLUG = 'commercial-refinance-gap'
export const REFINANCE_PATH = `/calculators/${REFINANCE_SLUG}`
export const REFINANCE_TITLE = 'Commercial real estate refinance gap calculator'
export const REFINANCE_DESCRIPTION = 'Find the maximum commercial refinance loan under DSCR, LTV, and debt yield, then see the cash, income, and property value needed to cover the payoff and costs.'

export const REFINANCE_FIELDS = {
  noi: { label: 'Annual net operating income', unit: 'USD', min: -Infinity, max: Infinity },
  value: { label: 'Property value', unit: 'USD', min: 0.01, max: Infinity },
  payoff: { label: 'Existing loan payoff', unit: 'USD', min: 0, max: Infinity },
  ltv: { label: 'Maximum loan-to-value', unit: '%', min: 0.01, max: 100 },
  dscr: { label: 'Minimum debt-service coverage ratio', unit: '×', min: 0.01, max: Infinity },
  yield: { label: 'Minimum debt yield', unit: '%', min: 0, max: Infinity },
  rate: { label: 'New loan interest rate', unit: '%', min: 0, max: Infinity },
  amortization: { label: 'Amortization period', unit: 'years', min: 1, max: 50 },
  feeRate: { label: 'Fees based on new loan amount', unit: '%', min: 0, max: 99.99 },
  fixedFees: { label: 'Other closing costs and reserves', unit: 'USD', min: 0, max: Infinity },
}

type RefinanceField = keyof typeof REFINANCE_FIELDS
export type RefinanceInputs = Record<RefinanceField, string> & { repayment: 'amortizing' | 'interestOnly' }

export const REFINANCE_EXAMPLE: RefinanceInputs = {
  noi: '600000', value: '9000000', payoff: '6000000', ltv: '65', dscr: '1.25', yield: '10',
  rate: '7', amortization: '25', feeRate: '1', fixedFees: '25000', repayment: 'amortizing',
}

export function calculateCommercialRefinance(inputs: RefinanceInputs) {
  const interestOnly = inputs.repayment === 'interestOnly'
  const invalid = (Object.keys(REFINANCE_FIELDS) as RefinanceField[]).find(key => {
    if (interestOnly && key === 'amortization') return false
    const { min, max } = REFINANCE_FIELDS[key]
    const value = Number(inputs[key])
    return !inputs[key].trim() || !Number.isFinite(value) || value < min || value > max ||
      (key === 'amortization' && !Number.isInteger(value))
  })
  if (invalid) return { error: `Enter a valid value for ${REFINANCE_FIELDS[invalid].label.toLowerCase()}.` } as const

  const noi = Number(inputs.noi)
  const propertyValue = Number(inputs.value)
  const payoff = Number(inputs.payoff)
  const ltv = Number(inputs.ltv) / 100
  const dscr = Number(inputs.dscr)
  const debtYield = Number(inputs.yield) / 100
  const rate = Number(inputs.rate) / 100
  const monthlyRate = rate / 12
  const months = Number(inputs.amortization) * 12
  const monthlyDebtPerDollar = interestOnly ? monthlyRate : monthlyRate === 0
    ? 1 / months
    : monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate))
  const annualDebtPerDollar = 12 * monthlyDebtPerDollar
  const variableFees = Number(inputs.feeRate) / 100
  const fixedFees = Number(inputs.fixedFees)

  const limits = [
    { name: 'Loan-to-value', amount: propertyValue * ltv },
    { name: 'Debt-service coverage', amount: annualDebtPerDollar > 0 ? Math.max(0, noi) / (dscr * annualDebtPerDollar) : null },
    { name: 'Debt yield', amount: debtYield > 0 ? Math.max(0, noi) / debtYield : null },
  ]
  const grossLoan = Math.min(...limits.map(limit => limit.amount ?? Infinity))
  const binding = limits.filter(limit => limit.amount !== null && Math.abs(limit.amount - grossLoan) < 0.01).map(limit => limit.name)
  const fees = grossLoan * variableFees + fixedFees
  const netProceeds = grossLoan - fees
  const cashAfterPayoff = netProceeds - payoff
  const grossNeeded = (payoff + fixedFees) / (1 - variableFees)
  const noiRatio = Math.max(dscr * annualDebtPerDollar, debtYield)
  const noiNeeded = noiRatio > 0 ? grossNeeded * noiRatio : null
  const valueNeeded = grossNeeded / ltv
  const annualDebtService = grossLoan * annualDebtPerDollar
  if (![annualDebtPerDollar, grossLoan, cashAfterPayoff, grossNeeded, noiNeeded ?? 0, valueNeeded, annualDebtService,
    ...limits.map(limit => limit.amount ?? 0)].every(Number.isFinite)) {
    return { error: 'Reduce the magnitude of the entered amounts or ratios.' } as const
  }

  return { limits, binding, fees, netProceeds, cashAfterPayoff, grossLoan, grossNeeded, noiNeeded, valueNeeded,
    annualDebtService } as const
}
