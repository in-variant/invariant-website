import type { ResearchResult } from './types'

export interface ResearchEvents {
  onStatus: (text: string) => void
  onResult: (result: ResearchResult) => void
  /**
   * hard: the input or quota is the problem, show the message and stop.
   * soft (hard=false): the service is unavailable, the worked example follows.
   */
  onError: (message: string, hard: boolean) => void
}

const API_URL = '/api/research'

/**
 * Run the live research agent against a company URL, streaming narration.
 * Falls back to the worked demo example when the endpoint is unavailable
 * (local dev without the function, missing key, network failure). Input
 * and quota errors are surfaced hard instead of masked by the demo.
 */
export async function runResearch(
  url: string,
  events: ResearchEvents,
  forceDemo = false,
  signal?: AbortSignal
): Promise<void> {
  if (forceDemo) {
    await runDemo(events, signal)
    return
  }
  let gotResult = false
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    })
    if (res.status === 400) {
      events.onError('That does not look like a reachable website address. Check it and try again.', true)
      return
    }
    if (res.status === 429) {
      events.onError('You have hit the research limit for now. Try again in a little while.', true)
      return
    }
    if (!res.ok || !res.body) throw new Error(`research endpoint returned ${res.status}`)

    reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    const handleFrame = (frame: string): 'error' | undefined => {
      const data = frame
        .split(/\r?\n/)
        .filter((l) => l.startsWith('data:'))
        .map((l) => l.replace(/^data: ?/, ''))
        .join('\n')
      if (!data) return
      let payload: { type: string; text?: string; message?: string; result?: ResearchResult }
      try {
        payload = JSON.parse(data)
      } catch {
        return
      }
      if (payload.type === 'status' && payload.text) events.onStatus(payload.text)
      if (payload.type === 'result' && payload.result) {
        gotResult = true
        events.onResult(payload.result)
      }
      if (payload.type === 'error') {
        events.onError(payload.message || 'The research run failed. Try again.', true)
        return 'error'
      }
      return
    }

    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split(/\r?\n\r?\n/)
      buffer = frames.pop() ?? ''
      for (const frame of frames) {
        if (handleFrame(frame) === 'error') return
      }
    }
    buffer += decoder.decode()
    if (buffer.trim()) handleFrame(buffer)
    if (!gotResult) throw new Error('stream ended without a result')
  } catch (err) {
    if (signal?.aborted || (err instanceof DOMException && err.name === 'AbortError')) return
    if (gotResult) {
      console.warn('[timeline] stream error after result, ignoring:', err)
      return
    }
    console.warn('[timeline] live research unavailable, using worked example:', err)
    events.onError('Live research is unavailable right now, so here is a worked example instead.', false)
    await runDemo(events, signal)
  } finally {
    try {
      reader?.cancel()
    } catch {
      /* already closed */
    }
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function runDemo(events: ResearchEvents, signal?: AbortSignal): Promise<void> {
  const script = [
    'Reading nimbus-space.example ...',
    'Found: Earth observation constellation, 8 spacecraft announced.',
    'Searching: Nimbus Space launch contract rideshare',
    'Found: rideshare launch from a US site targeted for next year.',
    'Checking spectrum and imaging exposure ...',
    'Cross-checking against the FCC small satellite gates.',
  ]
  for (const line of script) {
    if (signal?.aborted) return
    events.onStatus(line)
    await sleep(650)
  }
  if (signal?.aborted) return
  await sleep(400)
  events.onResult(DEMO_RESULT)
}

/**
 * Worked example. Nimbus Space is fictional. No real client data appears
 * anywhere in this tool.
 */
export const DEMO_RESULT: ResearchResult = {
  profile: {
    company: {
      name: 'Nimbus Space',
      website: 'nimbus-space.example',
      summary:
        'A fictional worked example: an eight-spacecraft Earth observation constellation, 110 kg per spacecraft, sun-synchronous orbit at about 550 km, first launch on a US rideshare.',
      hqCountry: 'US',
    },
    operatorKind: 'satellite',
    usNexus: 'us-operator',
    indiaNexus: false,
    orbit: 'SSO',
    spacecraftCount: 8,
    massKg: 110,
    altitudeKm: 550,
    propulsion: true,
    remoteSensing: true,
    commsService: false,
    launch: { provider: 'US rideshare', site: 'us', target: 'Q4 2027', monthsFromNow: 17 },
    foreignPartners: false,
    foreignNationalStaff: true,
    humanSpaceflight: false,
    nuclear: false,
    novelActivity: false,
  },
  findings: [
    { label: 'Mission', value: 'Earth observation constellation, 8 spacecraft', confidence: 'confirmed' },
    { label: 'Spacecraft', value: 'About 110 kg, sun-synchronous orbit near 550 km', confidence: 'confirmed' },
    { label: 'Launch', value: 'US rideshare, targeted Q4 2027', confidence: 'inferred' },
    { label: 'Team', value: 'US company with foreign-national engineers', confidence: 'inferred' },
  ],
  questions: [
    {
      id: 'launch-window',
      field: 'launch.monthsFromNow',
      question: 'When is your first launch?',
      options: [
        { label: 'Within 12 months', value: 10 },
        { label: '12 to 24 months', value: 18 },
        { label: '24 months or more', value: 30 },
        { label: 'Not decided', value: 24 },
      ],
      why: 'Everything on the chart is anchored to the launch date. A near-term launch turns several of these windows red.',
    },
    {
      id: 'imaging',
      field: 'remoteSensing',
      question: 'Does the spacecraft carry any outward-facing camera or sensor?',
      options: [
        { label: 'Yes, imaging is the mission', value: true },
        { label: 'No imaging capability', value: false },
      ],
      why: 'NOAA jurisdiction is capability-based. Any optic that can resolve the surface of the Earth counts, whatever the business model.',
    },
    {
      id: 'comms',
      field: 'commsService',
      question: 'Is communications a service you sell, beyond command and telemetry?',
      options: [
        { label: 'Yes, comms is a product', value: true },
        { label: 'No, TT and C only', value: false },
      ],
      why: 'Either way a spectrum licence is required, there is no telemetry-only exemption. A comms payload changes which FCC route applies and whether processing rounds come into play.',
    },
    {
      id: 'launch-site',
      field: 'launch.site',
      question: 'Where does the first launch fly from?',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'India', value: 'india' },
        { label: 'Allied country', value: 'foreign-allied' },
        { label: 'Elsewhere', value: 'foreign-non-allied' },
      ],
      why: 'A launch outside NATO and major allies adds a Defense monitoring plan and an NSA encryption plan with no clock on either.',
    },
  ],
  notes: [
    'At 110 kg, 8 spacecraft and about 550 km with propulsion, this mission fits the FCC streamlined small satellite gates. Hold every gate: one failed certification drops the filing into the full track and adds a year.',
  ],
}
