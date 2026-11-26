import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { calculatePowerPhase, EXAMPLE_PHASES } from '../../data/dataCenterPowerSchedule'
import { hundredths } from '../../data/dataCenterPowerCapacity'
import './SiteComparison.css'

const REQUIREMENTS = {
  land: 'Site control and easements',
  approvals: 'Zoning and approvals',
  water: 'Water and sewer plan',
  fiber: 'Fiber connectivity',
}
type Requirement = keyof typeof REQUIREMENTS
type ReviewStatus = 'open' | 'supported' | 'conflict'
type PowerEvidence = 'unverified' | 'study' | 'agreement' | 'in-service'
type Phase = Pick<(typeof EXAMPLE_PHASES)[number], 'demandMw' | 'opening' | 'commissioningDays'>
type Candidate = {
  evidence: PowerEvidence
  record: string
  supplyMw: string
  service: string
  checks: Record<Requirement, ReviewStatus>
}
const requirementKeys = Object.keys(REQUIREMENTS) as Requirement[]
const reviewLabels: Record<ReviewStatus, string> = { open: 'Needs evidence', supported: 'Supported', conflict: 'Known constraint' }
const evidenceLabels: Record<PowerEvidence, string> = {
  unverified: 'Seller claim or no utility record',
  study: 'Utility study',
  agreement: 'Written service agreement',
  'in-service': 'In-service utility record',
}
const { demandMw, opening, commissioningDays } = EXAMPLE_PHASES[0]
const examplePhase: Phase = { demandMw, opening, commissioningDays }
const exampleCandidates: [Candidate, Candidate] = [
  { evidence: 'unverified', record: '', supplyMw: '100', service: '', checks: { land: 'open', approvals: 'open', water: 'open', fiber: 'open' } },
  { evidence: 'study', record: 'Illustrative preliminary study', supplyMw: '50', service: '2028-06-15',
    checks: { land: 'open', approvals: 'supported', water: 'supported', fiber: 'supported' } },
]
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })
const candidateLabel = (index: number) => index === 0 ? 'Site A' : 'Site B'
const dateLabel = (value: string) => date.format(new Date(value))
const daysFromDeadline = (value: number) => {
  if (value === 0) return 'On the deadline'
  const unit = Math.abs(value) === 1 ? 'day' : 'days'
  return `${number.format(Math.abs(value))} ${unit} ${value < 0 ? 'late' : 'early'}`
}

function screenCandidate(phase: Phase, candidate: Candidate) {
  const hasUtilityRecord = candidate.evidence !== 'unverified' && candidate.record.trim() !== ''
  const result = calculatePowerPhase({ ...phase, supplyMw: candidate.supplyMw, service: candidate.service })
  const power = hasUtilityRecord ? result.powerMargin : null
  const timing = hasUtilityRecord ? result.scheduleMargin : null
  const issues: string[] = []
  const open: string[] = []
  if (power === null) open.push('Document the MW in a utility record.')
  else if (power < 0) issues.push(`${number.format(-power)} MW below the requirement.`)
  if (timing === null) open.push('Confirm the earliest utility service date.')
  else if (timing < 0) issues.push('Ask the utility whether service can start sooner.')
  for (const requirement of requirementKeys) {
    if (candidate.checks[requirement] === 'conflict') issues.push(`Resolve the constraint on ${REQUIREMENTS[requirement].toLowerCase()}.`)
    if (candidate.checks[requirement] === 'open') open.push(`Verify ${REQUIREMENTS[requirement].toLowerCase()}.`)
  }
  const decision = issues.length ? 'Requirement at risk' : open.length ? 'Evidence needed' : 'Advance to detailed diligence'
  return { power, timing, issues, open, decision }
}

export default function SiteComparison() {
  const [phase, setPhase] = useState(examplePhase)
  const [candidates, setCandidates] = useState(exampleCandidates)
  const [ready, setReady] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  useEffect(() => setReady(true), [])

  function setCandidate(index: number, next: Partial<Candidate>) {
    setCopyStatus('')
    setCandidates(previous => index === 0 ? [{ ...previous[0], ...next }, previous[1]]
      : [previous[0], { ...previous[1], ...next }])
  }

  function setPhaseField(key: keyof Phase, value: string) {
    setCopyStatus('')
    setPhase(previous => ({ ...previous, [key]: value }))
  }

  const project = calculatePowerPhase({ ...phase, supplyMw: '', service: '' })
  const demand = hundredths(phase.demandMw)
  const latestService = demand !== null && demand > 0 ? project.latestService : null
  const results = latestService ? candidates.map(candidate => screenCandidate(phase, candidate)) : []

  async function copyComparison() {
    if (!latestService) return
    const summary = [
      `First phase needs ${phase.demandMw} MW at the meter, operational by ${phase.opening}.`,
      `Latest service date ${latestService} with ${phase.commissioningDays} calendar days for commissioning.`,
      ...results.flatMap((result, index) => {
        const candidate = candidates[index]
        return [
          '',
          `${candidateLabel(index)}. ${result.decision}.`,
          `Power source ${evidenceLabels[candidate.evidence]}. ${candidate.record || 'Add a dated record.'}`,
          `Entered power ${candidate.supplyMw ? candidate.supplyMw + ' MW' : 'unknown'}. Entered service date ${candidate.service || 'unknown'}.`,
          ...(result.power === null ? [] : [`Power margin ${number.format(result.power)} MW.`]),
          ...(result.timing === null ? [] : [`Service timing: ${daysFromDeadline(result.timing)}.`]),
          ...result.issues,
          ...result.open,
        ]
      }),
      '',
      'https://invariant-ai.com/blog/data-center-site-selection-checklist#compare-two-sites',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(summary)
      setCopyStatus('Copied')
    } catch {
      setCopyStatus('Clipboard unavailable. Select and copy the comparison.')
    }
  }

  return (
    <div className="site-comparison">
      <fieldset className="site-comparison-inputs" disabled={!ready}>
        <legend>First-phase requirements</legend>
        <label><span>Facility load at the meter in MW</span>
          <input type="number" min="0.01" step="0.01" inputMode="decimal" value={phase.demandMw}
            onChange={event => setPhaseField('demandMw', event.target.value)} /></label>
        <label><span>Required opening date</span>
          <input type="date" value={phase.opening} onChange={event => setPhaseField('opening', event.target.value)} /></label>
        <label><span>Days from power to opening</span>
          <input type="number" min="0" step="1" inputMode="numeric" value={phase.commissioningDays}
            onChange={event => setPhaseField('commissioningDays', event.target.value)} /></label>
      </fieldset>
      <div id="site-comparison-results" className="site-comparison-results" aria-live="polite" tabIndex={-1}>
        {latestService ? (
          <>
            <p><strong>Latest utility service date</strong> <time dateTime={latestService}>{dateLabel(latestService)}</time></p>
            <div className="site-comparison-grid">
              {results.map(({ decision, power, timing, issues, open }, index) => (
                <div key={index} className="site-comparison-result">
                  <h3>{candidateLabel(index)}</h3>
                  <p><strong>{decision}</strong></p>
                  <dl>
                    <div><dt>Power margin</dt><dd>{power === null ? 'Unknown' : `${number.format(power)} MW`}</dd></div>
                    <div><dt>Service timing</dt><dd>{timing === null ? 'Unknown' : daysFromDeadline(timing)}</dd></div>
                  </dl>
                  {issues.length + open.length > 0 && <ul>{[...issues, ...open].map(item => <li key={item}>{item}</li>)}</ul>}
                </div>
              ))}
            </div>
          </>
        ) : <p>Enter a positive facility load, a valid opening date, and whole days to compare sites.</p>}
      </div>
      <div className="site-comparison-grid">
        {candidates.map((candidate, index) => (
          <fieldset className="site-comparison-candidate" key={index} disabled={!ready}>
            <legend>{candidateLabel(index)} evidence</legend>
            <label><span>Power evidence</span>
              <select value={candidate.evidence} onChange={event => setCandidate(index, { evidence: event.target.value as PowerEvidence })}>
                {Object.entries(evidenceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label><span>Utility record name and date</span>
              <input type="text" value={candidate.record} onChange={event => setCandidate(index, { record: event.target.value })} />
            </label>
            <div className="site-comparison-pair">
              <label><span>Facility MW in the record</span>
                <input type="number" min="0" step="0.01" inputMode="decimal" value={candidate.supplyMw}
                  onChange={event => setCandidate(index, { supplyMw: event.target.value })} /></label>
              <label><span>Earliest service date</span>
                <input type="date" value={candidate.service} onChange={event => setCandidate(index, { service: event.target.value })} /></label>
            </div>
            {requirementKeys.map(requirement => (
              <label key={requirement}><span>{REQUIREMENTS[requirement]}</span>
                <select value={candidate.checks[requirement]} onChange={event => setCandidate(index, {
                  checks: { ...candidate.checks, [requirement]: event.target.value as ReviewStatus },
                })}>
                  {Object.entries(reviewLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <div className="site-comparison-actions">
        <button type="button" disabled={!ready || !latestService} onClick={copyComparison}>Copy comparison</button>
        <Link to="/contact?request=site-selection">Request a site shortlist ↗</Link>
        <a href="#site-comparison-results">Back to results</a>
        <button className="site-comparison-reset" type="button" disabled={!ready} onClick={() => {
          setPhase(examplePhase)
          setCandidates(exampleCandidates)
          setCopyStatus('')
        }}>Reset example</button>
        <span role="status">{copyStatus}</span>
      </div>
    </div>
  )
}
