export const DEBT_COVERAGE_SLUG = 'dscr-debt-yield'
export const DEBT_COVERAGE_PATH = `/calculators/${DEBT_COVERAGE_SLUG}`
export const DEBT_COVERAGE_TITLE = 'Commercial real estate DSCR and debt yield calculator'
export const DEBT_COVERAGE_DESCRIPTION = 'Calculate debt-service coverage and debt yield from annual net operating income, debt payments, and loan principal. Compare a second payment schedule against your lender’s thresholds.'

export const DEBT_COVERAGE_FIELDS = {
  noi: { label: 'Annual net operating income', unit: 'USD', min: undefined },
  loan: { label: 'Loan principal', unit: 'USD', min: 0.01 },
  service: { label: 'Annual debt service', unit: 'USD', min: 0.01 },
  secondService: { label: 'Second annual debt service', unit: 'USD', min: 0.01 },
  dscrTarget: { label: 'Minimum DSCR', unit: '×', min: 0.01 },
  yieldTarget: { label: 'Minimum debt yield', unit: '%', min: 0.01 },
}

export type DebtCoverageField = keyof typeof DEBT_COVERAGE_FIELDS
export type DebtCoverageInputs = Record<DebtCoverageField, string>

export const DEBT_COVERAGE_EXAMPLE: DebtCoverageInputs = {
  noi: '600000', loan: '6000000', service: '420000', secondService: '540000', dscrTarget: '1.25', yieldTarget: '9',
}

function meetsThreshold(value: number, threshold: number) {
  const roundingTolerance = 2 * Number.EPSILON * threshold
  return value >= threshold || threshold - value <= roundingTolerance
}

export function calculateDebtCoverage(inputs: DebtCoverageInputs) {
  const fields = Object.keys(DEBT_COVERAGE_FIELDS) as DebtCoverageField[]
  for (const field of fields) {
    const raw = inputs[field].trim()
    if (field === 'secondService' && !raw) continue
    const { label, min } = DEBT_COVERAGE_FIELDS[field]
    const value = Number(raw)
    if (!raw || !Number.isFinite(value) || (min !== undefined && value < min)) {
      return { error: `Enter a valid value for ${label}.`, field } as const
    }
  }

  const noi = Number(inputs.noi)
  const loan = Number(inputs.loan)
  const dscrTarget = Number(inputs.dscrTarget)
  const yieldTarget = Number(inputs.yieldTarget)
  const minimumYield = yieldTarget / 100
  const yieldRatio = noi / loan
  const debtYield = yieldRatio * 100
  const meetsYield = meetsThreshold(yieldRatio, minimumYield)
  const incomeForYield = loan * minimumYield
  const availableIncome = Math.max(noi, 0)
  const serviceLimit = availableIncome / dscrTarget
  const loanLimitByYield = availableIncome / minimumYield

  function schedule(annualService: number) {
    const dscr = noi / annualService
    const meetsDscr = meetsThreshold(dscr, dscrTarget)
    const incomeForDscr = annualService * dscrTarget
    const minimumIncome = Math.max(incomeForDscr, incomeForYield)
    return {
      annualService, dscr, meetsDscr, minimumIncome,
      incomeShortfall: meetsDscr && meetsYield ? 0 : Math.max(0, minimumIncome - noi),
    }
  }

  const base = schedule(Number(inputs.service))
  const comparison = inputs.secondService.trim() ? schedule(Number(inputs.secondService)) : null
  const numbers = [debtYield, serviceLimit, loanLimitByYield, base.dscr, base.minimumIncome, base.incomeShortfall]
  if (comparison) numbers.push(comparison.dscr, comparison.minimumIncome, comparison.incomeShortfall)
  if (!numbers.every(Number.isFinite)) return { error: 'Reduce the magnitude of the entered amounts or ratios.', field: undefined } as const

  return { base, comparison, debtYield, meetsYield, serviceLimit, loanLimitByYield } as const
}
