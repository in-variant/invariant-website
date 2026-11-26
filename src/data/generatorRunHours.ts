export const GENERATOR_HOURS_SLUG = 'generator-run-hours'
export const GENERATOR_HOURS_PATH = '/calculators/' + GENERATOR_HOURS_SLUG
export const GENERATOR_HOURS_TITLE = 'Backup generator run-hour calculator'
export const GENERATOR_HOURS_DESCRIPTION = 'Estimate how a planned generator run changes rolling 12-month engine-hours for a permit group and an individual engine.'
export const GENERATOR_LOG_PATH = '/blog/generator-run-hours-log.csv'
export const GENERATOR_PERMIT_GUIDE = '/blog/data-center-backup-generator-air-permits'
export const LOUDOUN_PERMIT = 'https://www.deq.virginia.gov/home/showpublisheddocument/25746/638778906125130000#page=16'

export type Ledger = { previous: string; current: string; limit: string }
type RunHoursCase = { engines: string; duration: string; group: Ledger; engine: Ledger }

const emptyLedger = { previous: '', current: '', limit: '' }
export const EMPTY_RUN: RunHoursCase = { engines: '', duration: '', group: emptyLedger, engine: emptyLedger }
export const LOUDOUN_EXAMPLE: RunHoursCase = {
  engines: '21',
  duration: '2',
  group: { previous: '1050', current: '30', limit: '1100' },
  engine: { previous: '38', current: '1', limit: '500' },
}

// Keep the arithmetic exact at the input precision of one hundredth of an hour.
export function hundredthsOfHour(value: string): number | null {
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value.trim())) return null
  const [whole, fraction = ''] = value.trim().split('.')
  const hundredths = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(hundredths) ? hundredths : null
}

export function engineCount(value: string): number | null {
  const count = Number(value)
  return /^\d+$/.test(value.trim()) && Number.isSafeInteger(count) && count > 0 ? count : null
}

function summarizeLedger(ledger: Ledger, added: number | null) {
  const previous = hundredthsOfHour(ledger.previous)
  const current = hundredthsOfHour(ledger.current)
  if (previous === null || current === null || added === null) return null
  const projected = previous + current + added
  if (!Number.isSafeInteger(projected)) return null
  const limit = hundredthsOfHour(ledger.limit)
  return {
    projected: projected / 100,
    remaining: limit === null ? null : (limit - projected) / 100,
  }
}

export function calculateRunHours({ engines, duration, group, engine }: RunHoursCase) {
  const count = engineCount(engines)
  const run = hundredthsOfHour(duration)
  const perEngine = run !== null && run > 0 ? run : null
  const combined = count !== null && perEngine !== null ? count * perEngine : null
  const groupAddition = combined !== null && Number.isSafeInteger(combined) ? combined : null
  return {
    added: groupAddition === null ? null : groupAddition / 100,
    engineAdded: perEngine === null ? null : perEngine / 100,
    group: summarizeLedger(group, groupAddition),
    engine: summarizeLedger(engine, perEngine),
  }
}
