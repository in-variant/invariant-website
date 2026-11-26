import { useEffect, useState } from 'react'
import './TradeAreaOverlap.css'

const INPUTS = {
  existing: 'Existing store households',
  candidate: 'Candidate store households',
  shared: 'Households reachable from both',
}
type Input = keyof typeof INPUTS
type Counts = Record<Input, string>

const examples: Record<string, Counts> = {
  '10': { existing: '101975', candidate: '58762', shared: '0' },
  '15': { existing: '278938', candidate: '181507', shared: '31236' },
  '20': { existing: '525711', candidate: '343137', shared: '145767' },
}
const DEFAULT_EXAMPLE = '15'
const count = new Intl.NumberFormat('en-US')
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })
const fields = Object.entries(INPUTS) as [Input, string][]

function readCount(value: string) {
  const number = Number(value)
  return /^\d+$/.test(value) && Number.isSafeInteger(number) ? number : null
}

export default function TradeAreaOverlap() {
  const [example, setExample] = useState(DEFAULT_EXAMPLE)
  const [inputs, setInputs] = useState(examples[DEFAULT_EXAMPLE])
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  function selectExample(value: string) {
    setExample(value)
    if (value !== 'custom') setInputs(examples[value])
  }

  const existing = readCount(inputs.existing)
  const candidate = readCount(inputs.candidate)
  const shared = readCount(inputs.shared)
  let error = ''
  let result: { existingOnly: number; candidateOnly: number; shared: number; total: number; overlap: number | null } | null = null
  if (existing === null || candidate === null || shared === null) {
    error = 'Enter three nonnegative whole household counts.'
  } else if (shared > Math.min(existing, candidate)) {
    error = 'Shared households must fit within both store counts.'
  } else if (!Number.isSafeInteger(existing + (candidate - shared))) {
    error = 'Enter smaller counts for an exact household total.'
  } else {
    result = {
      existingOnly: existing - shared,
      candidateOnly: candidate - shared,
      shared,
      total: existing + (candidate - shared),
      overlap: candidate === 0 ? null : shared / candidate,
    }
  }

  const segments = result ? [
    { label: 'Existing store only', count: result.existingOnly, kind: 'existing' },
    { label: 'Both stores', count: result.shared, kind: 'shared' },
    { label: 'Candidate store only', count: result.candidateOnly, kind: 'candidate' },
  ] : []

  return (
    <div className="trade-overlap">
      <fieldset disabled={!ready}>
        <legend>Households in each trade area</legend>
        <label className="trade-overlap-example"><span>Compare travel times</span>
          <select value={example} onChange={event => selectExample(event.target.value)}>
            <option value="10">Detroit example · 10-minute drive</option>
            <option value="15">Detroit example · 15-minute drive</option>
            <option value="20">Detroit example · 20-minute drive</option>
            <option value="custom">Your counts</option>
          </select>
        </label>
        <div className="trade-overlap-inputs">
          {fields.map(([name, label]) => (
            <label key={name}><span>{label}</span>
              <input type="number" min="0" step="1" inputMode="numeric" value={inputs[name]}
                onChange={event => {
                  setExample('custom')
                  setInputs({ ...inputs, [name]: event.target.value })
                }} />
            </label>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" className="trade-overlap-output">
        {result ? (
          <>
            <dl className="trade-overlap-highlights">
              <div><dt>Additional household reach</dt><dd>{count.format(result.candidateOnly)}</dd></div>
              <div><dt>Distinct households across both stores</dt><dd>{count.format(result.total)}</dd></div>
              <div><dt>Candidate households also reached by the existing store</dt>
                <dd>{result.overlap === null ? <span>No candidate households</span> : percent.format(result.overlap)}</dd></div>
            </dl>
            <div aria-hidden="true" className="trade-overlap-bar">
              {segments.map(segment => (
                <span key={segment.kind} data-kind={segment.kind}
                  style={{ flexGrow: result.total ? segment.count / result.total : 0 }} />
              ))}
            </div>
            <dl className="trade-overlap-legend">
              {segments.map(segment => (
                <div key={segment.kind} data-kind={segment.kind}>
                  <dt>{segment.label}</dt><dd>{count.format(segment.count)}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : <p>{error}</p>}
      </div>
      <noscript>Enable JavaScript to edit the sample counts.</noscript>
    </div>
  )
}
