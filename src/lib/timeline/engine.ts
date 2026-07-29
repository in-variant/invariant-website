import { FILINGS, SPECIALIST_TRACKS, TRACK_LABELS, smallsatEligible } from '../../data/timeline/filings'
import type { MissionProfile, Plan, PlanItem, Track } from './types'

const TRACK_ORDER: Track[] = ['spectrum', 'imaging', 'export', 'mission', 'launch', 'india', 'insurance']

/**
 * Derive the filing plan from a mission profile. Pure and deterministic:
 * the same profile always yields the same plan, and every entry traces to
 * src/data/timeline/filings.ts.
 */
export function buildPlan(profile: MissionProfile): Plan {
  const applicable = FILINGS.filter((f) => f.triggers(profile))

  const items: PlanItem[] = applicable.map((filing) => {
    const startT = filing.window.start
    const solidEndT = Math.max(0, startT - filing.window.durationMin)
    const tailEndT = Math.max(0, startT - filing.window.durationMax)
    return {
      filing,
      startT,
      solidEndT,
      tailEndT,
      critical: filing.critical ? filing.critical(profile) : false,
      overrun: startT - filing.window.durationMax < 0,
    }
  })

  // Group by track, ordered; inside a track, earliest start first.
  const tracks = TRACK_ORDER.map((track) => ({
    track,
    label: TRACK_LABELS[track],
    items: items
      .filter((i) => i.filing.track === track)
      .sort((a, b) => b.startT - a.startT),
  })).filter((t) => t.items.length > 0)

  const preLaunch = items.filter((i) => !i.filing.recurring)
  const horizon = Math.max(12, ...preLaunch.map((i) => i.startT))
  const longest = preLaunch.reduce(
    (a, b) => (b.filing.window.durationMax > a.filing.window.durationMax ? b : a),
    preLaunch[0]
  )

  const notes = SPECIALIST_TRACKS.filter((s) => s.triggers(profile)).map((s) => s.id)

  return {
    items,
    tracks,
    stats: {
      filingCount: preLaunch.length,
      startByMonths: horizon,
      longestPole: longest ? longest.filing.name : '',
      feeSummary: feeSummary(profile),
      recurringCount: items.filter((i) => i.filing.recurring).length,
    },
    horizon,
    notes,
  }
}

/** Rough government-fee picture for the stat tile. Deliberately conservative. */
function feeSummary(p: MissionProfile): string {
  if (p.operatorKind === 'launch-vehicle') return 'No fee, per-launch user fee from 2026'
  if (p.usNexus === 'none' && p.indiaNexus) return 'Modest fees, the schedule is the cost'
  if (smallsatEligible(p)) return 'About 2,600 dollars up front'
  if (p.orbit === 'GEO') return 'About 4,200 dollars, bond to 3 million'
  return 'About 17,700 dollars, bond to 5 million'
}

export { SPECIALIST_TRACKS }
