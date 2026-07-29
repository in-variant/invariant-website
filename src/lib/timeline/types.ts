/*
 * Mission timeline data model.
 *
 * A MissionProfile describes a company's mission in regulatory-relevant terms.
 * The research agent (api/research.ts) fills as much of it as it can from the
 * public record; the user confirms or corrects the rest via question chips.
 * The rules engine (engine.ts) then derives the filing plan deterministically
 * from src/data/timeline/filings.ts. No filing on the chart is model-generated.
 */

export type OperatorKind = 'satellite' | 'launch-vehicle' | 'both'

export type UsNexus = 'us-operator' | 'foreign-us-market' | 'none'

export type Orbit = 'LEO' | 'SSO' | 'MEO' | 'GEO' | 'beyond-earth'

export type LaunchSite = 'us' | 'india' | 'foreign-allied' | 'foreign-non-allied' | 'unknown'

export interface MissionProfile {
  company: {
    name: string
    website: string
    /** One-paragraph plain-language summary of what the company is building. */
    summary: string
    hqCountry: string
  }
  operatorKind: OperatorKind
  usNexus: UsNexus
  /** Indian operator or Indian nexus: adds the IN-SPACe track. */
  indiaNexus: boolean
  orbit: Orbit
  /** Number of spacecraft planned in the near-term system. */
  spacecraftCount: number
  /** Wet mass per spacecraft, kg. Drives the FCC streamlined small-sat gates. */
  massKg: number | null
  /** Deployment altitude in km, if known. Drives the 600 km streamlined gate. */
  altitudeKm: number | null
  /** True if the design carries propulsion capable of collision avoidance. */
  propulsion: boolean
  /**
   * Any outward-facing optic capable of imaging the Earth's surface.
   * NOAA jurisdiction is capability-based, not intent-based.
   */
  remoteSensing: boolean
  /** Comms is a primary service (payload spectrum beyond TT and C). */
  commsService: boolean
  launch: {
    provider: string | null
    site: LaunchSite
    /** Target launch window, e.g. "Q3 2027". Null if unknown. */
    target: string | null
    /** Months from today to the target launch. Null if unknown. */
    monthsFromNow: number | null
  }
  /** Foreign suppliers, partners, or a foreign launch integrator. */
  foreignPartners: boolean
  /** Foreign-national engineers on staff in the US (deemed exports). */
  foreignNationalStaff: boolean
  humanSpaceflight: boolean
  nuclear: boolean
  /** RPO, servicing, ISAM, debris removal, stations, lunar. */
  novelActivity: boolean
}

/** A clarifying question the agent could not answer from the public record. */
export interface ProfileQuestion {
  id: string
  /** Dot-path into MissionProfile that the answer writes to. */
  field: string
  question: string
  options: { label: string; value: string | number | boolean }[]
  /** Why the answer changes the plan. Shown as the small print under the chips. */
  why: string
}

export interface ResearchFinding {
  label: string
  value: string
  confidence: 'confirmed' | 'inferred'
  source?: string
}

export interface ResearchResult {
  profile: MissionProfile
  findings: ResearchFinding[]
  questions: ProfileQuestion[]
  /** Mission-specific caveats worth surfacing, in plain language. */
  notes: string[]
}

/* ------------------------------------------------------------------ */
/* Filings knowledge base                                              */
/* ------------------------------------------------------------------ */

export type Track =
  | 'spectrum'
  | 'imaging'
  | 'export'
  | 'launch'
  | 'mission'
  | 'india'
  | 'insurance'

export interface FilingWindow {
  /** Months before launch to start work. */
  start: number
  /** Best-case duration in months. */
  durationMin: number
  /** Realistic worst-case duration in months. */
  durationMax: number
}

export interface Filing {
  id: string
  track: Track
  agency: string
  name: string
  /** One-line plain-language explanation for the chart row. */
  plain: string
  cite: string
  window: FilingWindow
  /**
   * The honest clock: what the statute says, and what actually happens.
   * This pair is the credibility core of the product. Keep both truthful.
   */
  clock: { statutory: string; reality: string }
  fees: string
  dependsOn: string[]
  keyFacts: string[]
  failureModes: string[]
  /** Applies-test over the profile. */
  triggers: (p: MissionProfile) => boolean
  /** Critical-path candidates get the copper treatment. */
  critical?: (p: MissionProfile) => boolean
  /** Post-grant or recurring obligation rather than a pre-launch filing. */
  recurring?: boolean
}

export interface PlanItem {
  filing: Filing
  /** Months before launch, positive numbers. startT >= solidEndT >= tailEndT. */
  startT: number
  solidEndT: number
  tailEndT: number
  critical: boolean
  /** True when the worst-case window runs past the launch date. */
  overrun: boolean
}

export interface Plan {
  items: PlanItem[]
  tracks: { track: Track; label: string; items: PlanItem[] }[]
  stats: {
    filingCount: number
    startByMonths: number
    longestPole: string
    feeSummary: string
    recurringCount: number
  }
  /** Earliest start across the plan, in months before launch. */
  horizon: number
  notes: string[]
}
