import { hundredths } from './dataCenterPowerCapacity'

export const POWER_SCHEDULE_SLUG = 'data-center-power-delivery-schedule'
export const POWER_SCHEDULE_PATH = `/calculators/${POWER_SCHEDULE_SLUG}`
export const POWER_SCHEDULE_TITLE = 'Data center power delivery schedule calculator'
export const POWER_SCHEDULE_DESCRIPTION = 'Work back from your opening date to the latest date you need power. Compare the proposed service date and facility megawatts for each phase.'

export const EXAMPLE_PHASES = [
  { demandMw: '40', opening: '2028-06-30', commissioningDays: '45', supplyMw: '50', service: '2028-06-15' },
  { demandMw: '80', opening: '2030-06-30', commissioningDays: '60', supplyMw: '', service: '' },
]
export type PowerPhase = typeof EXAMPLE_PHASES[number]

const DAY_MS = 86_400_000

function civilDay(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return null
  const time = Date.parse(value)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time / DAY_MS : null
}

function isoDay(day: number) {
  const date = new Date(day * DAY_MS)
  if (Number.isNaN(date.getTime())) return null
  const year = date.getUTCFullYear()
  return year >= 1 && year <= 9999 ? date.toISOString().slice(0, 10) : null
}

export function calculatePowerPhase(input: PowerPhase) {
  const opening = civilDay(input.opening)
  const service = civilDay(input.service)
  const days = /^\d+$/.test(input.commissioningDays) ? Number(input.commissioningDays) : null
  const lag = days !== null && Number.isSafeInteger(days) ? days : null
  const demand = hundredths(input.demandMw)
  const supply = hundredths(input.supplyMw)
  const latestService = opening === null || lag === null ? null : isoDay(opening - lag)
  const estimatedReady = service === null || lag === null ? null : isoDay(service + lag)
  return {
    latestService,
    estimatedReady,
    scheduleMargin: opening !== null && service !== null && lag !== null && estimatedReady && latestService
      ? opening - service - lag
      : null,
    powerMargin: demand !== null && demand > 0 && supply !== null ? (supply - demand) / 100 : null,
  }
}
