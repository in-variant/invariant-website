export const LEASE_RENT_SLUG = 'net-effective-rent'
export const LEASE_RENT_PATH = `/calculators/${LEASE_RENT_SLUG}`
export const LEASE_RENT_TITLE = 'Net effective rent calculator'
export const LEASE_RENT_DESCRIPTION = 'Compare two commercial leases using rent per rentable square foot, annual increases, free months, and build-out allowances.'

export const LEASE_FIELDS = [
  { key: 'area', label: 'Rentable square feet', min: 1, max: 100000000, step: 1 },
  { key: 'months', label: 'Lease term (months)', min: 1, max: 1200, step: 1 },
  { key: 'rent', label: 'Starting rent ($/RSF/year)', min: 0, max: 100000, step: 0.01 },
  { key: 'increase', label: 'Annual rent increase (%)', min: -99.99, max: 100, step: 0.01 },
  { key: 'free', label: 'Initial months of free base rent', min: 0, max: 1200, step: 1 },
  { key: 'allowance', label: 'Build-out allowance used ($/RSF)', min: 0, max: 100000, step: 0.01 },
] as const

export type LeaseInputs = Record<(typeof LEASE_FIELDS)[number]['key'], string>

export const LEASE_EXAMPLES: [LeaseInputs, LeaseInputs] = [
  { area: '10000', months: '60', rent: '48', increase: '3', free: '6', allowance: '40' },
  { area: '10000', months: '60', rent: '45', increase: '3', free: '2', allowance: '20' },
]

export function calculateLeaseRent(inputs: LeaseInputs) {
  const invalidField = LEASE_FIELDS.find(({ key, min, max, step }) => {
    const value = Number(inputs[key])
    return inputs[key].trim() === '' || !Number.isFinite(value) || value < min || value > max ||
      (step === 1 && !Number.isInteger(value))
  })
  if (invalidField) return { error: `Enter a valid value for ${invalidField.label.toLowerCase()}.` }
  const area = Number(inputs.area)
  const months = Number(inputs.months)
  const rent = Number(inputs.rent)
  const increase = Number(inputs.increase) / 100
  const free = Number(inputs.free)
  const allowance = Number(inputs.allowance)
  if (free > months) return { error: 'Free months must fit within the lease term.' }

  // Raises begin in month 13, even if the first twelve months are abated.
  let paidRentPerSqFt = 0
  for (let month = free; month < months; month++) {
    paidRentPerSqFt += rent * (1 + increase) ** Math.floor(month / 12) / 12
  }
  return {
    totalBaseRent: paidRentPerSqFt * area,
    startingMonthlyRent: rent * area / 12,
    averageBaseRent: paidRentPerSqFt * 12 / months,
    rentAfterAllowance: (paidRentPerSqFt - allowance) * 12 / months,
  }
}
