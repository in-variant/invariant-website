import type { Filing, MissionProfile } from '../../lib/timeline/types'

/*
 * The filing knowledge base behind the mission timeline.
 *
 * Every entry is drawn from the primary sources named in its cite field:
 * the CFR, Federal Register orders, statute, and published agency practice
 * as of mid 2026. Where the statutory clock and observed reality diverge,
 * both are stated. Fee amounts are from the current fee schedules and
 * change annually.
 *
 * Curation rule: nothing in this file is generated at request time.
 * The research agent only fills a MissionProfile; the plan is derived
 * deterministically from these entries.
 */

const isSatellite = (p: MissionProfile) => p.operatorKind !== 'launch-vehicle'
const isLaunchCo = (p: MissionProfile) => p.operatorKind !== 'satellite'
const hasUsNexus = (p: MissionProfile) => p.usNexus !== 'none'

/**
 * FCC streamlined small-satellite route, 47 CFR 25.122: all gates must hold.
 * The altitude gate is disjunctive: deploy at or below 600 km OR carry
 * collision-avoidance propulsion.
 */
export const smallsatEligible = (p: MissionProfile) =>
  p.usNexus === 'us-operator' &&
  p.orbit !== 'GEO' &&
  p.orbit !== 'beyond-earth' &&
  p.spacecraftCount <= 10 &&
  (p.massKg === null || p.massKg <= 180) &&
  (p.propulsion || (p.altitudeKm !== null && p.altitudeKm <= 600))

export const FILINGS: Filing[] = [
  /* ------------------------------------------------------------ */
  /* Spectrum: FCC                                                 */
  /* ------------------------------------------------------------ */
  {
    id: 'itu-advance-publication',
    track: 'spectrum',
    agency: 'ITU via FCC',
    name: 'ITU advance publication and coordination',
    plain: 'Establishes international date priority for your frequencies. First in time wins.',
    cite: '47 CFR 25.111(b) to (e); ITU Radio Regulations Articles 9 and 11',
    window: { start: 36, durationMin: 1, durationMax: 3 },
    clock: {
      statutory: 'No FCC clock. ITU invoice deadlines are set by the ITU.',
      reality:
        'Date priority is first in time. The FCC allows up to five advance publication filings before a full licence application, and almost nobody uses them.',
    },
    fees: 'ITU cost-recovery invoices, set by the ITU. An unpaid ITU invoice can get the FCC application dismissed.',
    dependsOn: [],
    keyFacts: [
      'Up to five advance publication filings are allowed with no full licence application on file, a cheap way to lock date priority.',
      'The applicant must sign an unconditional acceptance of all ITU cost-recovery responsibility before the FCC submits anything.',
      'No protection from interference is guaranteed unless ITU procedures are completed on time.',
    ],
    failureModes: [
      'Missing the cost-recovery declaration because it is administrative, not technical.',
      'An overdue ITU invoice quietly putting the FCC application at risk of dismissal.',
    ],
    triggers: (p) => isSatellite(p) && p.usNexus === 'us-operator',
  },
  {
    id: 'fcc-ngso-licence',
    track: 'spectrum',
    agency: 'FCC Space Bureau',
    name: 'Part 25 NGSO space station licence',
    plain: 'The licence your constellation cannot transmit without. Includes the full orbital debris showing.',
    cite: '47 CFR 25.114, 25.157, 25.283(e); Form 312 plus Schedule S',
    window: { start: 30, durationMin: 12, durationMax: 30 },
    clock: {
      statutory: 'None. There is no deadline by which the FCC must act on a space station application.',
      reality:
        'A non-binding 60-day acceptability target, then public notice, then an open-ended review. Processing rounds batch competing NGSO applications, and anyone quoting you a fixed grant date is guessing.',
    },
    fees: 'Application 17,670 dollars per system. Annual regulatory fees start at grant, roughly 409,000 dollars per year for systems under 1,000 stations on the proposed FY2026 schedule.',
    dependsOn: ['itu-advance-publication', 'debris-plan'],
    keyFacts: [
      'The five-year deorbit rule binds: LEO disposal no later than five years after end of mission, where end of mission means loss of collision-avoidance capability, not end of service.',
      'Milestones run from grant, not launch: half the constellation in six years, all of it in nine, then a continuing duty to keep half in service.',
      'Since 2025 the regime is being replaced by the proposed Part 100 licensing assembly line. Templates written today will need migration.',
      'Telemetry-only spacecraft are still licensed radio stations. There is no TT and C exemption: the licence trigger is radio, not the business model.',
    ],
    failureModes: [
      'A thin debris showing. Missing deployment re-contact analysis is the single most common source of staff information requests.',
      'Schedule S data inconsistent with the narrative exhibits, which gets the application returned.',
      'Missing a processing-round cut-off and waiting for the next one.',
    ],
    triggers: (p) =>
      isSatellite(p) &&
      p.usNexus === 'us-operator' &&
      p.orbit !== 'GEO' &&
      p.orbit !== 'beyond-earth' &&
      !smallsatEligible(p),
    critical: () => true,
  },
  {
    id: 'fcc-gso-licence',
    track: 'spectrum',
    agency: 'FCC Space Bureau',
    name: 'Part 25 GSO space station licence',
    plain: 'The geostationary licence, with the graveyard-orbit disposal showing.',
    cite: '47 CFR 25.114, 25.158, 25.283(a)',
    window: { start: 24, durationMin: 6, durationMax: 24 },
    clock: {
      statutory: 'None. A non-binding 30-day acceptability target is the only published number.',
      reality:
        'First come first served in the GSO queue, then an indefinite review. Launch, position and operate within five years of grant or the licence terminates automatically.',
    },
    fees: 'Application 4,175 dollars per satellite. Annual regulatory fee roughly 178,700 dollars per satellite on the proposed FY2026 schedule. Licence term 15 years.',
    dependsOn: ['itu-advance-publication', 'debris-plan'],
    keyFacts: [
      'GSO disposal is the graveyard formula: a disposal orbit with perigee of at least 36,021 km, roughly 235 km above the GSO arc, plus a spacecraft-dependent term. The five-year rule does not apply.',
      'A surety bond is due 30 days after grant. Miss it and the licence is null and void automatically.',
    ],
    failureModes: [
      'Disposal propellant not explicitly ring-fenced in the propellant budget.',
      'Starting surety underwriting after grant, when 30 days is not enough for a pre-revenue company.',
    ],
    triggers: (p) => isSatellite(p) && p.usNexus === 'us-operator' && p.orbit === 'GEO',
    critical: () => true,
  },
  {
    id: 'fcc-smallsat-licence',
    track: 'spectrum',
    agency: 'FCC Space Bureau',
    name: 'Streamlined small satellite licence',
    plain: 'The fast lane, if every gate holds: ten or fewer satellites, 180 kg or less, six-year life.',
    cite: '47 CFR 25.122',
    window: { start: 12, durationMin: 4, durationMax: 12 },
    clock: {
      statutory: 'None. Streamlined processing is a practice, not a clock.',
      reality:
        'Fail any single certification, even by 5 kg, and the application drops into the full Part 25 track, adding a year or more. Run the gates before filling a single form field.',
    },
    fees: 'Application 2,555 dollars. Annual regulatory fee roughly 14,635 dollars, against 409,000 dollars for the smallest standard NGSO system. That delta is the real reason to fit the gates.',
    dependsOn: ['debris-plan'],
    keyFacts: [
      'Gates: ten or fewer satellites, 180 kg or less including propellant, at least 10 cm smallest dimension, six years or less in orbit, deploy at or below 600 km or carry collision-avoidance propulsion, zero casualty risk on re-entry.',
      'The licence term is six years with no extension and no replacement authorisation. A system meant to operate in year seven must refile on the standard route.',
    ],
    failureModes: [
      'The casualty-risk certification is zero, not one in ten thousand. A materially different bar than the standard route.',
      'Taking the route for speed and discovering the six-year cliff when replenishment planning starts.',
    ],
    triggers: (p) => isSatellite(p) && smallsatEligible(p),
    critical: () => true,
  },
  {
    id: 'fcc-market-access',
    track: 'spectrum',
    agency: 'FCC Space Bureau',
    name: 'US market access for a foreign-licensed system',
    plain: 'Your home licence does not carry into the US. Market access imports nearly the whole domestic technical burden.',
    cite: '47 CFR 25.137',
    window: { start: 30, durationMin: 12, durationMax: 30 },
    clock: {
      statutory: 'None. Same absent clock as domestic applications.',
      reality:
        'Rides the same queues and processing rounds as US applicants. Executive Branch review of foreign ownership is empirically the long pole, and its 120-day clock starts only when the committee decides your responses are complete.',
    },
    fees: 'Petition fees mirror domestic: 4,175 dollars GSO, 17,670 dollars NGSO. Surety bond, milestones and annual regulatory fees all apply through 25.137(d).',
    dependsOn: ['debris-plan'],
    keyFacts: [
      'The home-state licence does not substitute for the FCC technical showing. A near-complete second submission in FCC format is required, debris showing included.',
      'Market access travels on an earth station filing, not a space station filing. Non-US teams misread this consistently and lose a filing cycle.',
      'The five-year deorbit rule applies to market-access grantees exactly as to US licensees.',
    ],
    failureModes: [
      'Serving the unredacted filing on the Executive Branch committee later than three business days after filing.',
      'Missing the inherited bond and milestone obligations.',
    ],
    triggers: (p) => isSatellite(p) && p.usNexus === 'foreign-us-market',
    critical: () => true,
  },
  {
    id: 'debris-plan',
    track: 'spectrum',
    agency: 'FCC filing input',
    name: 'Orbital debris mitigation plan and NASA DAS runs',
    plain: 'The debris showing is a design constraint before it is paperwork. Altitude and propulsion trades freeze here.',
    cite: '47 CFR 25.114(d)(14); NASA Debris Assessment Software',
    window: { start: 32, durationMin: 3, durationMax: 8 },
    clock: {
      statutory: 'Not a separate filing, but the licence cannot be accepted without it.',
      reality:
        'The binding standard is substantially not in the CFR. It lives in the 2024 reconsideration order and in conditions attached to granted licences, which is why templates copied from the regulation alone get information requests.',
    },
    fees: 'None directly. The cost is engineering time and, done late, redesign.',
    dependsOn: [],
    keyFacts: [
      'Numbers that must hold: collision probability under 0.001 over total lifetime, debris-generation probability at or under 0.01, casualty risk under 1 in 10,000, disposal reliability at least 0.9.',
      'Every system must describe manoeuvrability whether or not it has propulsion. Differential drag and magnetorquers must be characterised.',
      'Rich filings become binding licence conditions. What you describe, you must later do.',
    ],
    failureModes: [
      'Deployment-device re-contact analysis omitted, the top-ranked schedule slip source.',
      'Computing the five-year clock from end of service instead of loss of collision-avoidance capability, which mis-sizes the window by years.',
    ],
    triggers: (p) => isSatellite(p) && hasUsNexus(p),
  },
  {
    id: 'fcc-earth-station',
    track: 'spectrum',
    agency: 'FCC Space Bureau',
    name: 'Earth station licences for gateways and TT and C',
    plain: 'The satellite grant does not cover the ground. Every transmitting site needs its own licence.',
    cite: '47 CFR 25.115, 25.218',
    window: { start: 12, durationMin: 2, durationMax: 9 },
    clock: {
      statutory: 'A 30-day acceptability target. Form 312EZ sites inside the routine antenna envelope are deemed granted 35 days after public notice.',
      reality:
        'Non-routine antennas die not on FCC review but on coordination agreements a competitor is in no hurry to sign. The routine envelope is an antenna design decision made years earlier.',
    },
    fees: 'From 425 dollars for a single transmit site to 7,650 dollars for multi-site. A blanket licence covers an entire terminal fleet for 425 dollars.',
    dependsOn: [],
    keyFacts: [
      'A foreign operator running a TT and C ground station on US soil needs its own earth station licence even with no US customers.',
      'Design the antenna inside the Section 25.218 off-axis envelope at PDR and the filing becomes a 35-day automatic grant.',
    ],
    failureModes: [
      'Treating earth stations as covered by the space station licence.',
      'Discovering the routine-envelope constraint at filing time instead of at antenna design.',
    ],
    triggers: (p) => isSatellite(p) && hasUsNexus(p),
  },
  {
    id: 'fcc-surety-bond',
    track: 'spectrum',
    agency: 'FCC',
    name: 'Surety bond, due 30 days after grant',
    plain: 'A hard kill. No bond within 30 days of grant and the licence is null and void automatically.',
    cite: '47 CFR 25.165',
    window: { start: 15, durationMin: 2, durationMax: 4 },
    clock: {
      statutory: '30 days from grant. No notice, no cure.',
      reality:
        'Underwriting a pre-revenue space company takes longer than 30 days, so surety capacity must be arranged before grant, not after.',
    },
    fees: 'NGSO bond starts at 1 million dollars and escalates to 5 million. GSO starts at 1 million and escalates to 3 million. The streamlined small satellite route has bond relief, with a delayed posting window referenced in the rule. Confirm the current text before relying on it.',
    dependsOn: ['fcc-ngso-licence'],
    keyFacts: [
      'The bond escalates with time from grant, so exposure grows as milestones approach.',
      'This is a milestone bond, not a disposal bond. A disposal bond has been an open FCC proposal since 2020.',
    ],
    failureModes: ['Starting surety underwriting after grant.'],
    triggers: (p) => isSatellite(p) && hasUsNexus(p) && !smallsatEligible(p),
    recurring: true,
  },
  {
    id: 'ssa-registration',
    track: 'spectrum',
    agency: 'US Space Force 18th SDS',
    name: 'Space surveillance registration and conjunction data sharing',
    plain: 'Registration and data-sharing commitments made in the FCC filing, in place before deployment.',
    cite: '47 CFR 25.114(d)(14)(v)',
    window: { start: 6, durationMin: 1, durationMax: 3 },
    clock: {
      statutory: 'None. A pre-deployment condition.',
      reality: 'Drafted with the licence application, executed before launch. Omitting the commitment is a listed cause of debris-showing rejection.',
    },
    fees: 'None.',
    dependsOn: ['fcc-ngso-licence'],
    keyFacts: [
      'Trackability is presumed at 10 cm smallest dimension. Smaller than that and you carry the burden.',
      'Under the proposed Part 100, trackability and conjunction response become affirmative operating duties with enforcement exposure.',
    ],
    failureModes: ['Treating the disclosure as boilerplate.'],
    triggers: (p) => isSatellite(p) && hasUsNexus(p),
  },

  /* ------------------------------------------------------------ */
  /* Imaging: NOAA                                                 */
  /* ------------------------------------------------------------ */
  {
    id: 'noaa-initial-contact',
    track: 'imaging',
    agency: 'NOAA CRSRA',
    name: 'Initial contact and scope determination',
    plain: 'File at PDR, not at launch minus six months. Jurisdiction is capability-based: any outward-facing optic counts.',
    cite: '15 CFR 960.5(a)',
    window: { start: 24, durationMin: 1, durationMax: 3 },
    clock: {
      statutory: 'No clock. Informal and non-binding.',
      reality:
        'The dominant failure in the regime is scoping: inspection cameras, hosted demonstrators and star-tracker adjacent optics discover the requirement at FAA payload review or customer diligence.',
    },
    fees: 'Zero. The entire NOAA regime has no filing or maintenance fees.',
    dependsOn: [],
    keyFacts: [
      'A system capable of 1 m resolution is assessed at 1 m even if you plan to collect at 5 m. Capability controls, not intent.',
      'The licence follows whoever holds tasking authority, not who owns the bus.',
    ],
    failureModes: [
      'Assuming no intent to image the Earth is a defence. It is not.',
    ],
    triggers: (p) => isSatellite(p) && hasUsNexus(p) && p.remoteSensing,
  },
  {
    id: 'noaa-licence',
    track: 'imaging',
    agency: 'NOAA CRSRA',
    name: 'Part 960 remote sensing licence',
    plain: 'The fastest clock in US space licensing, and the only one with a genuine forcing mechanism.',
    cite: '15 CFR Part 960',
    window: { start: 9, durationMin: 2.5, durationMax: 5 },
    clock: {
      statutory: 'Seven days to completeness, seven to tier, 60 days to grant from the completeness notice. If day 60 passes, you may demand grant and the Secretary must issue within three days.',
      reality:
        'The entire delay surface is the first seven days: an incomplete filing is a full restart, and the 60-day clock runs from the completeness notice, not from filing. File only on a frozen sensor spec.',
    },
    fees: 'Zero. The only zero-fee regime in US space licensing.',
    dependsOn: ['noaa-initial-contact'],
    keyFacts: [
      'Your tier turns on foreign availability of comparable data, and the evidence must be on file before categorisation, which closes seven days after completeness.',
      'Tier 2 and 3 attach shutter control, 256-bit encryption on TT and C, and consent rules for imaging other spacecraft.',
      'The licence runs for the life of the system with no renewal cycle, and the condition set is closed by rule.',
    ],
    failureModes: [
      'Filing on an unfrozen design and restarting completeness.',
      'Marketing-grade resolution figures copied into the application, buying a worse tier and an encryption retrofit.',
      'A financing round closing mid-review without the required correction filing.',
    ],
    triggers: (p) => isSatellite(p) && hasUsNexus(p) && p.remoteSensing,
    critical: (p) => p.remoteSensing && !p.commsService,
  },
  {
    id: 'noaa-postgrant',
    track: 'imaging',
    agency: 'NOAA CRSRA',
    name: 'NOAA post-grant duties: 7-day notices, annual certification',
    plain: 'Launch, disposal, anomalies and insolvency are each 7-day notifiable events. Certification due every 15 October.',
    cite: '15 CFR 960.8(e) to (g)',
    window: { start: 0, durationMin: 0, durationMax: 0 },
    clock: {
      statutory: 'Seven days per event, immediately for deviations. Annual certification 15 October.',
      reality: 'Operators calibrated to looser FCC and FAA habits under-report against this standard.',
    },
    fees: 'Zero.',
    dependsOn: ['noaa-licence'],
    keyFacts: [
      'Anomaly is defined broadly and includes security events.',
      'A bare no-change certification over drifted facts converts a missed modification into false-statement exposure.',
    ],
    failureModes: ['Treating the annual certification as a formality.'],
    triggers: (p) => isSatellite(p) && hasUsNexus(p) && p.remoteSensing,
    recurring: true,
  },

  /* ------------------------------------------------------------ */
  /* Export control                                                */
  /* ------------------------------------------------------------ */
  {
    id: 'export-classification',
    track: 'export',
    agency: 'State DDTC / Commerce BIS',
    name: 'Jurisdiction and classification of the system, part by part',
    plain: 'The long pole of the whole programme. Everything in export control keys off classification, decided at concept stage.',
    cite: '22 CFR 120.12; 15 CFR 748.3; USML Category XV; ECCN 9x515',
    window: { start: 24, durationMin: 2, durationMax: 6 },
    clock: {
      statutory: 'A commodity jurisdiction request has a 10-working-day preliminary response and a 45-day escalation right, not a deadline. A Commerce classification has no clock at all.',
      reality:
        'Contested space items run well past 45 days. Classification must be part-level: an ITAR component stays ITAR inside an EAR satellite, the single most common structural error in space export compliance.',
    },
    fees: 'None for the requests themselves. ITAR registration runs 3,000 to 4,000 dollars per year once manufacturing begins.',
    dependsOn: [],
    keyFacts: [
      'Only a commodity jurisdiction determination settles the ITAR versus EAR boundary. A Commerce classification explicitly cannot.',
      'A projected September 2026 rewrite of USML Category XV moves the remote sensing thresholds and forces industry-wide reclassification, effective on publication.',
      'Manufacturing a defense article triggers registration on day one, export or not.',
    ],
    failureModes: [
      'Classifying at vehicle level instead of part level.',
      'Treating a Commerce classification as jurisdictional cover.',
      'Missing the 5-day ownership-change notification during a financing round.',
    ],
    triggers: (p) => p.usNexus === 'us-operator',
    critical: (p) => p.foreignPartners || p.launch.site !== 'us',
  },
  {
    id: 'itar-taa',
    track: 'export',
    agency: 'State DDTC',
    name: 'Technical assistance agreement with foreign partners',
    plain: 'Required before the first technical exchange with a foreign supplier or launch provider, not after the term sheet.',
    cite: '22 CFR 124.1',
    window: { start: 18, durationMin: 2, durationMax: 9 },
    clock: {
      statutory: 'None. ITAR has no review clock anywhere.',
      reality:
        'Under-scoped agreements force amendment cycles, each with its own approval delay. Scope it for the full programme up front.',
    },
    fees: 'No per-agreement fee. Registration is a precondition.',
    dependsOn: ['export-classification'],
    keyFacts: [
      'Applies even when every piece of information is public. Assembling public information into assistance is still a defense service.',
      'The agreement does not enter into force without prior written State approval.',
    ],
    failureModes: [
      'Furnishing the service before approval because the information seemed public.',
      'Missing the 30-day post-signature filing and termination-notice clocks.',
    ],
    triggers: (p) => p.usNexus === 'us-operator' && (p.foreignPartners || p.launch.site !== 'us'),
  },
  {
    id: 'itar-dsp5',
    track: 'export',
    agency: 'State DDTC',
    name: 'Export licences for hardware and technical data',
    plain: 'Shipping the spacecraft abroad, sending data to a partner, or briefing a foreign national each needs authorisation.',
    cite: '22 CFR 123.1; 15 CFR 750.4',
    window: { start: 12, durationMin: 2, durationMax: 6 },
    clock: {
      statutory: 'ITAR: none. EAR: 90 calendar days, with eight tolling categories.',
      reality:
        'The EAR clock is real but tolls freely. For satellite launches the Defense and NSA reviews toll it indefinitely. Every incomplete block on a DSP-5 is a mechanical return without action.',
    },
    fees: 'No per-licence fee.',
    dependsOn: ['export-classification', 'itar-taa'],
    keyFacts: [
      'Licences run four years and expire on the earlier of date or exhausted value.',
      'Deemed exports: releasing controlled technology to a foreign national engineer in the US is an export to their most recent country of citizenship or permanent residency.',
      'The Australia, UK and Canada corridors are materially cheaper than the rest of the world after the 2024 to 2025 reforms.',
    ],
    failureModes: [
      'Writing Not Applicable or See Attached in any required block, an automatic return.',
      'Missing pre-departure electronic filing windows, eight hours for air, 24 for sea.',
    ],
    triggers: (p) =>
      p.usNexus === 'us-operator' &&
      (p.foreignPartners ||
        p.launch.site === 'foreign-allied' ||
        p.launch.site === 'foreign-non-allied' ||
        p.launch.site === 'india'),
  },
  {
    id: 'itar-12415',
    track: 'export',
    agency: 'State DDTC, DoD, NSA',
    name: 'Non-allied launch package: monitoring plan and encryption plan',
    plain: 'A launch outside NATO and major allies adds a Defense technology control plan, an NSA encryption plan, and monitoring you reimburse.',
    cite: '22 CFR 124.15',
    window: { start: 9, durationMin: 6, durationMax: 12 },
    clock: {
      statutory: 'None. Explicitly not clock-bound, and it tolls the EAR 90-day clock indefinitely.',
      reality:
        'Start a minimum of two quarters before the campaign, because no agency is on a deadline and the plan requires advance notice to Defense of every meeting with foreign entities.',
    },
    fees: 'Full reimbursement of Defense monitoring costs, an open-ended line item covering technical discussions, processing, launch, and any failure investigation.',
    dependsOn: ['itar-dsp5'],
    keyFacts: [
      'The per-meeting advance-notification duty is incompatible with normal launch-campaign tempo unless systematised.',
      'A compliance certification is due within 30 days after launch.',
      'Participation in any launch failure investigation needs its own separate licence.',
    ],
    failureModes: [
      'Building the campaign schedule as if these reviews had deadlines.',
      'Not budgeting the reimbursable monitoring.',
    ],
    triggers: (p) =>
      p.usNexus === 'us-operator' &&
      (p.launch.site === 'foreign-non-allied' || p.launch.site === 'india'),
    critical: () => true,
  },
  {
    id: 'deemed-export-program',
    track: 'export',
    agency: 'State DDTC / Commerce BIS',
    name: 'Technology control plan and foreign-national screening',
    plain: 'In place before the first foreign-national hire, not after.',
    cite: '22 CFR 120.50, 126.18; 15 CFR 734.13',
    window: { start: 15, durationMin: 1, durationMax: 3 },
    clock: {
      statutory: 'None.',
      reality:
        'Keyed to hiring, not launch. An engineer from a controlled country is a walking licence requirement for controlled technology, and the university research carve-out dies the moment a publication restriction appears.',
    },
    fees: 'None. Screening records and plans are kept five years.',
    dependsOn: ['export-classification'],
    keyFacts: [
      'The foreign-entity screening exemption is not a domestic hiring exemption, one of the most consequential misreadings in the sector. Dual nationals are assessed by most recent citizenship or permanent residency, not most restrictive nationality.',
      'Cloud storage of technical data is fine only if end-to-end encrypted with the provider unable to decrypt.',
    ],
    failureModes: [
      'Assessing dual nationals by most-restrictive nationality instead of most recent citizenship or permanent residency.',
    ],
    triggers: (p) => p.usNexus === 'us-operator' && p.foreignNationalStaff,
  },

  /* ------------------------------------------------------------ */
  /* Mission and payload                                           */
  /* ------------------------------------------------------------ */
  {
    id: 'faa-payload-determination',
    track: 'mission',
    agency: 'FAA AST',
    name: 'FAA payload determination',
    plain: 'Rides your launch provider\'s licence, and fails if any of your other authorisations are missing.',
    cite: '14 CFR 450.43',
    window: { start: 9, durationMin: 3, durationMax: 6 },
    clock: {
      statutory: 'No standalone clock. Runs inside the launch operator\'s 180-day review.',
      reality:
        'The FAA will not second-guess FCC or NOAA regulated aspects, but their absence still sinks the determination. The trap is external: the FAA can be ready and the determination still fails on a missing grant.',
    },
    fees: 'None directly. The 60-day pre-mission payload weight report now also drives the new per-launch user fee.',
    dependsOn: ['fcc-ngso-licence', 'fcc-smallsat-licence', 'noaa-licence'],
    keyFacts: [
      'A payload owner may apply for its own determination independent of the launch operator, on its own timeline. Chronically under-used and the right move for novel missions.',
      'Rideshare aggregators inherit content disclosure down to sub-customers.',
    ],
    failureModes: [
      'Waiting inside the launch operator\'s process with no standing and no visibility.',
      'A reentry capsule flown as a payload without reentry authorisation blocks the launch itself.',
    ],
    triggers: (p) => isSatellite(p) && p.launch.site === 'us',
  },
  {
    id: 'launch-insurance',
    track: 'insurance',
    agency: 'Market placement',
    name: 'Launch and in-orbit insurance placement',
    plain: 'Start eight to ten months before launch. The declared value must match every filing it appears in.',
    cite: 'Market practice; policy conditions vary by jurisdiction',
    window: { start: 10, durationMin: 3, durationMax: 6 },
    clock: {
      statutory: 'None. Commercial placement.',
      reality:
        'Underwriters price the regulatory record you have built by then. A clean filing history is a pricing input.',
    },
    fees: 'Premium. Indian-licensed missions face domestic placement requirements; confirm the current IRDAI position before structuring the tower.',
    dependsOn: [],
    keyFacts: [
      'The insured value, the export declarations, the invoice and the filings must state one identical number. Divergence is a legal problem, not housekeeping.',
    ],
    failureModes: ['Starting placement after the launch contract locks the schedule.'],
    triggers: (p) => isSatellite(p),
  },

  /* ------------------------------------------------------------ */
  /* Launch operator track (Part 450)                              */
  /* ------------------------------------------------------------ */
  {
    id: 'faa-preapplication',
    track: 'launch',
    agency: 'FAA AST',
    name: 'Mandatory pre-application consultation',
    plain: 'Where the real review happens, entirely outside any statutory clock. Months to years.',
    cite: '14 CFR 413.5',
    window: { start: 36, durationMin: 3, durationMax: 24 },
    clock: {
      statutory: 'None. The consultation is mandatory but the FAA is on no deadline.',
      reality:
        'The industry advisory committee calls this the single largest source of schedule loss, invisible in any statutory metric. Scope of licence, compliance methods and waivers are all negotiated here.',
    },
    fees: 'None.',
    dependsOn: [],
    keyFacts: [
      'Five means-of-compliance acceptances are required before the application can even be accepted.',
      'The FAA expects design-review-level maturity evidence before the formal stage.',
    ],
    failureModes: [
      'Entering before the programme is mature and stalling in the early stage.',
      'Treating pre-application as scheduling slack.',
    ],
    triggers: (p) => isLaunchCo(p),
    critical: () => true,
  },
  {
    id: 'faa-nepa',
    track: 'launch',
    agency: 'FAA, NEPA',
    name: 'Environmental review: exclusion, assessment, or full EIS',
    plain: 'The application must contain the approved environmental document. On greenfield sites this is the critical path, not safety review.',
    cite: '14 CFR 450.47; 42 USC 4336a',
    window: { start: 36, durationMin: 6, durationMax: 24 },
    clock: {
      statutory: 'One year for an assessment, two for an impact statement, from the earliest formal trigger.',
      reality:
        'Post-reform EISs at established ranges now run 10 to 21 months. The wildlife, marine mammal, historic and coastal consultations got no deadline reform at all and start at programme month zero, not with the assessment. Starting marine-mammal work when the assessment starts is a year late.',
    },
    fees: 'No application fee, but where an EIS is required the applicant funds the FAA-selected contractor, typically a seven-figure line item.',
    dependsOn: [],
    keyFacts: [
      'Buy analysed headroom up front. One operator burned four environmental actions in four years by scoping to first-year cadence.',
      'A state coastal-zone objection is a veto on a federal licence, subject only to appeal to the Secretary of Commerce.',
    ],
    failureModes: [
      'Scheduling the environmental document in parallel with the licence review. The clock never starts without it.',
      'Applying with a draft assessment and no path to a finding of no significant impact.',
    ],
    triggers: (p) => isLaunchCo(p),
    critical: () => true,
  },
  {
    id: 'faa-part450',
    track: 'launch',
    agency: 'FAA AST',
    name: 'Part 450 vehicle operator licence',
    plain: 'The only US launch and reentry licence since March 2026. The 180-day clock is real, and freely tolled.',
    cite: '14 CFR Part 450; 51 USC 50905',
    window: { start: 30, durationMin: 6, durationMax: 36 },
    clock: {
      statutory: '180 days from acceptance, with a 120-day pending-issues notice and congressional notification on a miss.',
      reality:
        'Acceptance itself has no deadline, tolling has no cap, and two of the first eight licences exceeded 180 days. The FAA reported a 151 day average in 2024, scope unspecified. New entrants should count 30 months or more end to end.',
    },
    fees: 'No application fee. A new per-launch user fee applies from 2026, 25 cents per pound of payload capped at 30,000 dollars, rising yearly.',
    dependsOn: ['faa-preapplication', 'faa-nepa'],
    keyFacts: [
      'One licence covers a vehicle family and multiple sites for up to five years.',
      'Core risk criteria are numeric and non-negotiable: collective casualty expectation at or under 1 in 10,000 per launch, individual risk at or under 1 in 1,000,000.',
      'Licence applications received complete by 30 September 2028 carry government indemnification above insurance for the life of the licence.',
    ],
    failureModes: [
      'A single unaddressed requirement section is a rejection under the draft acceptance checklist.',
      'Assuming incremental module review works in practice. The advisory committee found it essentially impossible.',
    ],
    triggers: (p) => isLaunchCo(p),
    critical: () => true,
  },
  {
    id: 'faa-mpl-insurance',
    track: 'launch',
    agency: 'FAA AST',
    name: 'Maximum probable loss determination and financial responsibility',
    plain: 'The MPL sets your insurance requirement. Evidence is due 30 days before licensed activity begins, which is well before ignition.',
    cite: '14 CFR Part 440',
    window: { start: 18, durationMin: 3, durationMax: 8 },
    clock: {
      statutory: '90 days, but only from complete submission of the Appendix A package. An incomplete package means the clock never starts.',
      reality:
        'Trajectory data in the wrong coordinate frame is a routine multi-week slip. An early standalone MPL request decouples this from the licence clock entirely and almost nobody files one.',
    },
    fees: 'Insurance to the MPL, capped at 500 million dollars third-party and 100 million for government property. Highest published MPL, from the 2016 dataset: 261 million.',
    dependsOn: ['faa-part450'],
    keyFacts: [
      'The reciprocal waiver of claims must flow down through every tier of the supply chain. The sanction for a gap is an uncapped, uninsured indemnity triggered by drafting error, not by mishap.',
      'Nine mandatory policy conditions mean placement takes a broker with a space book months, not weeks.',
    ],
    failureModes: [
      'A generic certificate of insurance with no broker opinion letter is not evidence of insurance.',
      'The waiver chain never actually executed down the supply chain, the highest-severity latent defect in the regime.',
    ],
    triggers: (p) => isLaunchCo(p),
  },
  {
    id: 'faa-per-mission',
    track: 'launch',
    agency: 'FAA AST',
    name: 'Per-mission reports: 60-day and 30-day gates',
    plain: 'Mission data 60 days out, safety analysis products 30 days out, nothing changes inside the final 30.',
    cite: '14 CFR 450.213',
    window: { start: 3, durationMin: 1, durationMax: 2 },
    clock: {
      statutory: '60 and 30 days before each mission, negotiable in advance by alternative time frame request.',
      reality: 'The payload weight reported at 60 days is now also the basis for the federal user fee, so accuracy carries both safety and financial stakes.',
    },
    fees: 'The per-launch user fee is computed from the 60-day report.',
    dependsOn: ['faa-part450'],
    keyFacts: [
      'Alternative time frames are a routine, under-used negotiation for high-cadence operators.',
    ],
    failureModes: ['Analysis changes inside the final 30 days without an approved change process.'],
    triggers: (p) => isLaunchCo(p),
    recurring: true,
  },

  /* ------------------------------------------------------------ */
  /* India: IN-SPACe                                               */
  /* ------------------------------------------------------------ */
  {
    id: 'inspace-authorization',
    track: 'india',
    agency: 'IN-SPACe',
    name: 'IN-SPACe authorization under NGP 2024',
    plain: 'The Indian mission authorization. The clock runs only from a complete application, and completeness is strict.',
    cite: 'Norms, Guidelines and Procedures 2024, Chapter V',
    window: { start: 9, durationMin: 2.5, durationMax: 8 },
    clock: {
      statutory: '75 to 120 days from a complete application.',
      reality:
        'An incomplete application is returned and the clock resets, and observed processing has run well past the envelope. Apply at least six months ahead, and expect an explicitly iterative back and forth.',
    },
    fees: 'Application fees are modest. The cost is the consolidated form, typically an 80-plus page submission with supporting annexes.',
    dependsOn: [],
    keyFacts: [
      'Only around 38 authorizations were issued in the first two years of the regime, so precedent is thin and the process is still forming.',
      'Launch date, lift-off timing and injection parameters are intimation-only changes. A change of launch vehicle or provider is not clearly covered, so ask, do not refile.',
      'Every launch additionally needs an advisory note for the NOTAM and danger-zone notification, a fixed 45-day gate no urgency compresses.',
    ],
    failureModes: [
      'Refiling instead of intimating a change on the existing ticket, which surrenders queue position.',
      'Declared values that differ across the authorization, export and insurance paperwork.',
    ],
    triggers: (p) => p.indiaNexus,
    critical: (p) => p.indiaNexus && p.usNexus === 'none',
  },
  {
    id: 'india-export',
    track: 'india',
    agency: 'DGFT / RBI',
    name: 'SCOMET export authorisation and EDF waiver for foreign launch',
    plain: 'Launching an Indian satellite abroad is an export in law even with no money changing hands.',
    cite: 'Foreign Trade Policy, SCOMET list; FEMA Section 2(l); RBI Master Direction 16/2015-16',
    window: { start: 8, durationMin: 2, durationMax: 6 },
    clock: {
      statutory: 'No reliable published clock for either instrument.',
      reality:
        'The export declaration waiver for a no-consideration export is granted by the Reserve Bank regional office, not your bank, via a reasoned letter. Any timeline quoted for it is invented, so start early.',
    },
    fees: 'Modest government fees. The exposure is schedule, not cash.',
    dependsOn: ['inspace-authorization'],
    keyFacts: [
      'Fix the declared value once and freeze it across the waiver, the SCOMET application, the end-use certificate, the invoice, the shipping bill and the insured value.',
      'A domestic launch makes this entire track disappear.',
    ],
    failureModes: [
      'Routing the waiver through the wrong instrument or the wrong office.',
      'Two-hop exports, factory to staging country to launch site, papered as one hop.',
    ],
    triggers: (p) => p.indiaNexus && p.launch.site !== 'india' && p.launch.site !== 'unknown',
  },
  {
    id: 'itu-wpc',
    track: 'india',
    agency: 'ITU via WPC',
    name: 'ITU filings through the Indian administration',
    plain: 'Frequency coordination through WPC. Date priority works the same everywhere: file early.',
    cite: 'ITU Radio Regulations, filed via the national administration',
    window: { start: 24, durationMin: 3, durationMax: 12 },
    clock: {
      statutory: 'ITU coordination stages have published procedures, not delivery dates.',
      reality: 'Coordination runs years ahead for contested bands. Treat it as a design input, not an admin task.',
    },
    fees: 'ITU cost recovery plus national fees.',
    dependsOn: [],
    keyFacts: ['Bringing-into-use deadlines attach once filings mature. A missed one surrenders the slot.'],
    failureModes: ['Leaving ITU work until the licence application, years too late for a contested band.'],
    triggers: (p) => p.indiaNexus,
  },
]

/** Specialist overlays surfaced as cards, not chart bars. */
export const SPECIALIST_TRACKS: {
  id: string
  title: string
  body: string
  triggers: (p: MissionProfile) => boolean
}[] = [
  {
    id: 'nuclear',
    title: 'Space nuclear systems',
    body: 'A nuclear payload adds the NSPM-20 tier process and, for commercial missions, a multi-year NRC ground campaign that gates the FAA determination. Fuel form is decided at concept stage and locks the tier: low-enriched fission is Tier II, anything hotter is Tier III. The safety analysis report must be complete 12 months before launch and the interagency safety review nine months before. Programmes that discover this at critical design review have already lost.',
    triggers: (p) => p.nuclear,
  },
  {
    id: 'human',
    title: 'Human spaceflight',
    body: 'Humans aboard add the Part 460 overlay: crew qualification, an integrated verification flight test that must be complete and FAA-verified before any participant flies, and written informed consent that must precede any ticket sale or agreement to fly. Three statutory cliffs converge in 2027 and 2028, including the end of the occupant-safety learning period.',
    triggers: (p) => p.humanSpaceflight,
  },
  {
    id: 'novel',
    title: 'Novel in-space activity',
    body: 'Servicing, ISAM, debris removal and lunar missions sit in the mission authorization gap. Today the practical instruments are an independent FAA payload determination filed on your own timeline, an FCC filing that will be waiver-heavy until the new Part 100 category lands, and the proposed voluntary Commerce certification. The rules here are moving quarter to quarter, which is exactly why the plan needs a named owner.',
    triggers: (p) => p.novelActivity,
  },
]

export const TRACK_LABELS: Record<string, string> = {
  spectrum: 'Spectrum, FCC',
  imaging: 'Remote sensing, NOAA',
  export: 'Export control, State and Commerce',
  mission: 'Payload and mission, FAA',
  launch: 'Launch licence, FAA',
  india: 'India, IN-SPACe',
  insurance: 'Insurance',
}
