import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  acronyms?: string[]
  render: () => React.ReactNode
}

const ACRONYM_MAP: Record<string, string> = {
  'TC': 'Type Certificate',
  'UIN': 'Unique Identification Number',
  'DGCA': 'Directorate General of Civil Aviation',
  'BOM': 'Bill of Materials',
  'CB': 'Certification Body',
  'SoC': 'Statement of Conformity',
  'eGCA': 'Electronic Governance of Civil Aviation',
  'RPC': 'Remote Pilot Certificate',
  'RPTO': 'Remote Pilot Training Organisation',
  'CSUAS': 'Certification Scheme for Unmanned Aircraft Systems',
  'MTOW': 'Maximum Take-Off Weight',
  'BIS': 'Bureau of Indian Standards',
  'CG': 'Centre of Gravity',
  'FEA': 'Finite Element Analysis',
  'ESC': 'Electronic Speed Controller',
  'NPNT': 'No Permission No Takeoff',
  'RTH': 'Return to Home',
  'GNSS': 'Global Navigation Satellite System',
  'OEM': 'Original Equipment Manufacturer',
  'CIB&RC': 'Central Insecticides Board & Registration Committee',
  'MoAFW': 'Ministry of Agriculture & Farmers Welfare',
  'QCI': 'Quality Council of India',
  'NABL': 'National Accreditation Board for Testing and Calibration Laboratories',
  'MeitY': 'Ministry of Electronics & Information Technology',
  'ATE': 'Approved Test Entity',
  'NTH': 'National Test House',
  'D-1': 'Form D-1 (TC Application)',
  'KV': 'Motor Velocity Constant (RPM/Volt)',
}

function AcronymBar({ keys }: { keys: string[] }) {
  return (
    <div className="mt-auto pt-6 sm:pt-8">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {keys.map((k) => (
          <span key={k} className="font-mono text-[9px] sm:text-[10px] text-ink/35 leading-relaxed">
            <span className="font-medium text-ink/45">{k}</span> {ACRONYM_MAP[k] || k}
          </span>
        ))}
      </div>
    </div>
  )
}

function SlideShell({ children, acronyms }: { children: React.ReactNode; acronyms?: string[] }) {
  return (
    <div
      className="w-full h-full min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center
        px-5 sm:px-10 md:px-16 lg:px-20
        pt-14 pb-20 sm:pt-16 sm:pb-20 md:pt-18 md:pb-20 lg:pt-20 lg:pb-16
        bg-white text-ink"
    >
      <div className="absolute top-4 sm:top-5 left-5 sm:left-10 md:left-16 lg:left-20 z-10">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-ink/30 font-medium">
          Invariant
        </span>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-4xl">
        {children}
      </div>
      {acronyms && acronyms.length > 0 && (
        <div className="w-full max-w-4xl">
          <AcronymBar keys={acronyms} />
        </div>
      )}
    </div>
  )
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-8 text-ink/50">
      {children}
    </p>
  )
}


const CSUAS_CRITERIA = [
  { num: '1', name: 'General / Design Documentation', detail: 'Weight, CG, component specs, design docs' },
  { num: '2', name: 'Performance', detail: 'Range, endurance, max altitude at MTOW' },
  { num: '3', name: 'Battery', detail: 'BIS registered cells + packs, thermal, cycle performance' },
  { num: '4', name: 'Structure / Airframe', detail: 'Static load, drop test, FEA (small category), fatigue' },
  { num: '5', name: 'Propulsion / Motors & ESC', detail: 'Datasheet or in-house test report' },
  { num: '6', name: 'Flight Control System', detail: 'Autopilot, failsafe, emergency recovery' },
  { num: '7', name: 'Data Link / Communication', detail: 'RF range, latency, link-loss behaviour' },
  { num: '8', name: 'Navigation', detail: 'GPS/GNSS, geofencing, RTH' },
  { num: '9', name: 'Safety & Security (NPNT + Remote ID)', detail: 'Mandatory, no exceptions' },
  { num: '10', name: 'Application-Specific', detail: 'Spraying specs declared by OEM, no external standard' },
]

const PHASE1_CHANGES = [
  { type: 'Minor component substitution (same spec, different brand)', can: 'Yes', impact: 'Notify CB, update docs, resubmit affected clauses' },
  { type: 'Battery cell change (same chemistry, different supplier)', can: 'Yes', impact: 'New BIS certificate required, CB re-reviews Clause 3' },
  { type: 'Motor/ESC change (same spec)', can: 'Yes', impact: 'New datasheet or test report, CB re-reviews Clause 5' },
  { type: 'Motor/ESC change (different spec)', can: 'Risky', impact: 'May require Stage 1 re-evaluation; could restart doc review clock' },
  { type: 'Frame / structural change', can: 'High risk', impact: 'Clause 4 docs resubmitted; may need new FEA/static analysis' },
  { type: 'Flight controller change', can: 'High risk', impact: 'Clauses 6 + 7 + 8 affected; likely Stage 1 restart' },
  { type: 'Weight class change (crosses MTOW boundary)', can: 'D-1 restart', impact: 'New application required; different CSUAS clauses apply' },
  { type: 'NPNT module change', can: 'High risk', impact: 'Clause 9 core; mandatory feature tampering risk' },
]

const EGCA_FORMS = [
  { form: 'D-1', purpose: 'Type Certificate application + amendments' },
  { form: 'D-2', purpose: 'UIN issuance' },
  { form: 'D-3', purpose: 'UIN transfer / de-registration' },
  { form: 'D-4', purpose: 'RPC generation + renewal + instructor rating' },
  { form: 'D-5', purpose: 'RPTO authorisation + renewal' },
]

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    'Yes': 'text-emerald-700 border-emerald-300',
    'Risky': 'text-amber-700 border-amber-300',
    'High risk': 'text-red-700 border-red-300',
    'D-1 restart': 'text-red-800 border-red-400',
  }
  return (
    <span className={`inline-block font-mono text-[9px] sm:text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded border font-medium whitespace-nowrap ${colors[level] || 'bg-ink/5 text-ink/60 border-ink/10'}`}>
      {level}
    </span>
  )
}

const PROCESS_STEPS = [
  'BOM (Bill of Materials) Finalised',
  'Choose a Certification Body (CB)',
  'Stage 1: Document Verification (CB reviews D-1 package)',
  'Submit Form D-1 on eGCA + pay fee',
  'CB assigned by DGCA',
  'Stage 2: Physical Inspection + Bench Tests + Flight Test',
  'CB issues Statement of Conformity (SoC) to DGCA',
  'DGCA issues Type Certificate (TC)',
  'Apply for UIN via Form D-2 on eGCA',
  'Get Remote Pilot Certificate (RPC) via D-4 on eGCA',
  'Legal commercial operation',
]

const slides: Slide[] = [
  /* ── Slide 1: Title ── */
  {
    id: 'title',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/40 mb-6">
            Prepared by Invariant AI
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink mb-5 md:mb-8 max-w-4xl leading-[1.1]">
            Getting Your Agri Drone Type Certified In India
          </h1>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-10 md:mb-14">
            A practical guide from BOM to flying legally.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ink/35 tracking-wide hidden sm:flex items-center gap-2">
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&larr;</kbd>
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-ink/20 text-[11px] text-ink/45">&rarr;</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="font-mono text-xs text-ink/35 tracking-wide sm:hidden">
              Swipe to navigate
            </span>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 2: Why This Matters Now ── */
  {
    id: 'why-now',
    acronyms: ['TC', 'UIN', 'DGCA', 'eGCA'],
    render: () => (
      <SlideShell acronyms={['TC', 'UIN', 'DGCA', 'eGCA']}>
        <SlideLabel>Why This Matters Now</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Without A Type Certificate, There Is No Legal Path To Commercial Operation.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl">
          <div className="rounded-lg border border-ink/[0.08] px-4 sm:px-5 py-4 sm:py-5 bg-ink/[0.015]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium text-ink/80 block mb-2.5">No TC, no UIN</span>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">You <strong className="text-ink/80 font-medium">cannot register a drone</strong> without a Type Certificate. No UIN means no legal identity.</p>
          </div>
          <div className="rounded-lg border border-ink/[0.08] px-4 sm:px-5 py-4 sm:py-5 bg-ink/[0.015]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium text-ink/80 block mb-2.5">No UIN, no operations</span>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">Commercial operation requires a registered UIN. <strong className="text-ink/80 font-medium">There is no interim path.</strong></p>
          </div>
          <div className="rounded-lg border border-ink/[0.08] px-4 sm:px-5 py-4 sm:py-5 bg-ink/[0.015]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium text-ink/80 block mb-2.5">DGCA enforcement</span>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">Registration of all non-TC drones has been <strong className="text-ink/80 font-medium">suspended. No exceptions</strong>, no timeline given.</p>
          </div>
          <div className="rounded-lg border border-ink/[0.08] px-4 sm:px-5 py-4 sm:py-5 bg-ink/[0.015]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium text-ink/80 block mb-2.5">eGCA is the only portal</span>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">All regulatory filings moved to eGCA as of July 2025. <strong className="text-ink/80 font-medium">Digital Sky is no longer used.</strong></p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 3: Two Regulatory Bodies ── */
  {
    id: 'two-bodies',
    render: () => (
      <SlideShell acronyms={['DGCA', 'TC', 'UIN', 'RPC', 'RPTO', 'CIB&RC', 'MoAFW']}>
        <SlideLabel>Regulatory Landscape</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-12 max-w-4xl">
          Two Regulatory Bodies. Both Required Independently.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-0 items-stretch max-w-4xl mb-8 sm:mb-12">
          {/* DGCA Card */}
          <div className="rounded-xl border border-[#2A9D8F]/20 px-6 sm:px-8 py-6 sm:py-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-[#2A9D8F]/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-[#2A9D8F]">DGCA</h3>
                <p className="font-mono text-[10px] sm:text-xs text-ink/40">Aviation Regulator</p>
              </div>
            </div>
            <p className="font-mono text-xs sm:text-sm text-ink/55 leading-relaxed mb-5">
              Controls the <strong className="text-ink/80 font-medium">drone itself</strong> — airworthiness, pilot licensing, and registration.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              {['TC', 'UIN', 'RPC', 'RPTO'].map(tag => (
                <span key={tag} className="font-mono text-[10px] sm:text-xs font-medium tracking-wide px-2.5 py-1 rounded-md text-[#2A9D8F] border border-[#2A9D8F]/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-center px-5 lg:px-8">
            <div className="w-px flex-1 bg-ink/10" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/25 font-medium py-3">and</span>
            <div className="w-px flex-1 bg-ink/10" />
          </div>
          <div className="flex md:hidden items-center justify-center py-4">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/25 font-medium px-4">and</span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>

          {/* CIB&RC Card */}
          <div className="rounded-xl border border-[#C4820E]/20 px-6 sm:px-8 py-6 sm:py-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-[#C4820E]/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4820E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-mono text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase text-[#C4820E]">CIB&RC / MoAFW</h3>
                <p className="font-mono text-[10px] sm:text-xs text-ink/40">Agriculture Regulator</p>
              </div>
            </div>
            <p className="font-mono text-xs sm:text-sm text-ink/55 leading-relaxed mb-5">
              Controls the <strong className="text-ink/80 font-medium">chemicals being sprayed</strong> — pesticide registration and usage norms.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              {['Pesticide Reg.', 'Spray Norms'].map(tag => (
                <span key={tag} className="font-mono text-[10px] sm:text-xs font-medium tracking-wide px-2.5 py-1 rounded-md text-[#C4820E] border border-[#C4820E]/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Callout */}
        <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-5 sm:py-6 max-w-4xl">
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">Key Insight</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55">
            Getting DGCA TC <strong className="text-ink/80 font-medium">does not</strong> authorise pesticide spraying.
            <br className="hidden sm:block" />{' '}
            Getting pesticide approval <strong className="text-ink/80 font-medium">does not</strong> mean your drone is airworthy.
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-ink/40 mt-3">
            Both approvals must be obtained independently. Neither implies the other.
          </p>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 4a: Full Process (Steps 1-6) ── */
  {
    id: 'process-1',
    render: () => (
      <SlideShell acronyms={['BOM', 'CB', 'D-1', 'eGCA', 'DGCA']}>
        <SlideLabel>The Full Process — Part 1 of 2</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-12 max-w-4xl">
          End To End: BOM To Legal Commercial Operation.
        </h2>
        <div className="relative w-full">
          {/* Line that extends from last circle to the right edge of the screen */}
          <div className="absolute top-4 sm:top-[18px] left-full h-px bg-ink/15 w-screen" />
          <div className="relative flex items-start">
            {PROCESS_STEPS.slice(0, 6).map((step, i) => (
              <div key={i} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center w-full">
                    {i > 0 && <div className="h-px flex-1 bg-ink/15" />}
                    {i === 0 && <div className="flex-1" />}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-white ${
                      i === 0 ? '!bg-ink text-white' : 'border border-ink/20 text-ink/60'
                    }`}>
                      <span className="font-mono text-[9px] sm:text-[10px] font-medium">{i + 1}</span>
                    </div>
                    <div className="h-px flex-1 bg-ink/15" />
                  </div>
                  <p className="font-mono text-[10px] sm:text-xs text-ink/70 leading-snug text-center mt-3 px-1">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-[10px] sm:text-xs text-ink/30 mt-8 sm:mt-12 tracking-wide">
          Continued on next slide →
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 4b: Full Process (Steps 7-11) ── */
  {
    id: 'process-2',
    render: () => (
      <SlideShell acronyms={['SoC', 'TC', 'UIN', 'RPC', 'eGCA', 'DGCA']}>
        <SlideLabel>The Full Process — Part 2 of 2</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-12 max-w-4xl">
          From SoC To Legal Commercial Operation.
        </h2>
        <div className="relative w-full">
          {/* Line that extends from the left edge of the screen to the first circle */}
          <div className="absolute top-4 sm:top-[18px] right-full h-px bg-ink/15 w-screen" />
          <div className="relative flex items-start">
            {PROCESS_STEPS.slice(6).map((step, i) => (
              <div key={i} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center w-full">
                    <div className="h-px flex-1 bg-ink/15" />
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-white ${
                      i === PROCESS_STEPS.slice(6).length - 1 ? '!bg-ink text-white' : 'border border-ink/20 text-ink/60'
                    }`}>
                      <span className="font-mono text-[9px] sm:text-[10px] font-medium">{i + 7}</span>
                    </div>
                    {i < PROCESS_STEPS.slice(6).length - 1 && <div className="h-px flex-1 bg-ink/15" />}
                    {i === PROCESS_STEPS.slice(6).length - 1 && <div className="flex-1" />}
                  </div>
                  <p className="font-mono text-[10px] sm:text-xs text-ink/70 leading-snug text-center mt-3 px-1">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-xs sm:text-sm text-ink/50 max-w-3xl mt-8 sm:mt-12">
          Timeline: <strong className="text-ink/70 font-medium">3-6 months</strong> typically. <strong className="text-ink/70 font-medium">60 days</strong> for CB to submit SoC + <strong className="text-ink/70 font-medium">15 days</strong> for DGCA to issue TC.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 5: CSUAS Technical Criteria ── */
  {
    id: 'csuas',
    render: () => (
      <SlideShell acronyms={['CSUAS', 'CG', 'MTOW', 'BIS', 'FEA', 'ESC', 'NPNT', 'RTH', 'GNSS', 'OEM']}>
        <SlideLabel>Technical Criteria</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 max-w-4xl">
          The 10 CSUAS Criteria. Every Drone Must Pass All 10.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-3 sm:gap-y-4 max-w-5xl">
          {CSUAS_CRITERIA.map((c) => (
            <div key={c.num} className="flex gap-3 sm:gap-4 py-2 border-b border-ink/[0.06]">
              <span className="font-mono text-xs sm:text-sm text-ink/30 tabular-nums font-medium w-5 sm:w-6 shrink-0 text-right pt-0.5">
                {c.num}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs sm:text-sm font-medium text-ink/80 leading-snug">{c.name}</p>
                <p className="font-mono text-[10px] sm:text-xs text-ink/50 leading-relaxed mt-0.5">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 6: Change Management - Phase 0 ── */
  {
    id: 'change-phase0',
    render: () => (
      <SlideShell acronyms={['BOM', 'D-1', 'CB', 'ATE', 'ESC', 'CSUAS']}>
        <SlideLabel>Change Management / Phase 0</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          Before D-1 Submission. Full Freedom.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">Nothing is locked.</strong> Only constraint: your CB/ATE relationship and any pre-testing work. <strong className="text-ink/70 font-medium">No regulatory consequence.</strong>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: 'Components', desc: 'Motors, ESCs, frame, battery cells, spray system, flight controller.' },
            { label: 'Suppliers', desc: 'Manufacturer, brand, source — all swappable.' },
            { label: 'Design', desc: 'Configuration, layout, architecture — fully open.' },
            { label: 'Weight Class', desc: 'Can cross MTOW boundaries. Changes which CSUAS clauses apply.' },
          ]).map((item, i) => (
            <div key={i} className="rounded-lg border border-emerald-200 px-4 py-3 sm:py-4 flex flex-col">
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 7: Change Management - Phase 1 ── */
  {
    id: 'change-phase1',
    render: () => (
      <SlideShell acronyms={['D-1', 'CB', 'BIS', 'ESC', 'FEA', 'MTOW', 'NPNT', 'CSUAS']}>
        <SlideLabel>Change Management / Phase 1</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          After D-1 Submitted, Before Stage 2.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">D-1 locks your declared design.</strong> Same spec, different supplier = notify + resubmit. Different spec = assume <strong className="text-ink/70 font-medium">Stage 1 restart</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          {PHASE1_CHANGES.map((row, i) => {
            const borderColor: Record<string, string> = {
              'Yes': 'border-emerald-200',
              'Risky': 'border-amber-200',
              'High risk': 'border-red-200',
              'D-1 restart': 'border-red-300',
            }
            return (
              <div key={i} className={`rounded-lg border ${borderColor[row.can] || 'border-ink/10'} px-4 py-3 sm:py-4 flex flex-col`}>
                <div className="flex items-center justify-between mb-2">
                  <RiskBadge level={row.can} />
                </div>
                <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{row.type}</p>
                <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{row.impact}</p>
              </div>
            )
          })}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 8: Change Management - Phase 2 ── */
  {
    id: 'change-stage1-cleared',
    render: () => (
      <SlideShell acronyms={['CB', 'D-1', 'BIS', 'BOM']}>
        <SlideLabel>Change Management / Phase 2</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          Stage 1 Cleared. The Design Is Approved On Paper.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">Very limited freedom.</strong> After Stage 1 clearance, freeze the BOM. Any change = cost and time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: 'Component Change', desc: 'Re-triggers Stage 1 for affected clauses.' },
            { label: 'Doc Mismatch', desc: 'CB flags mismatches during Stage 2. Result: rejection, not a warning.' },
            { label: 'Physical Mismatch', desc: 'Drone doesn\'t match D-1 docs = Stage 2 fails. Restart from Stage 1.' },
            { label: 'Battery Cells', desc: 'BIS certificate must match the physical cells installed, not the cells in the doc.' },
            { label: 'Bottom Line', desc: 'Any change = cost and time. Freeze the BOM after Stage 1 clearance.' },
          ]).map((item, i) => (
            <div key={i} className={`rounded-lg border border-red-200 px-4 py-3 sm:py-4 flex flex-col ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 9: Change Management - Phase 3 ── */
  {
    id: 'change-post-tc',
    render: () => (
      <SlideShell acronyms={['TC', 'DGCA', 'D-1', 'eGCA', 'BIS']}>
        <SlideLabel>Change Management / Phase 3</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          TC Issued. No Freedom.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">Everything is locked.</strong> Minor changes need amendment via D-1 on eGCA. Significant changes may require <strong className="text-ink/70 font-medium">partial or full re-certification</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: 'Type Design', desc: 'TC is issued to a specific type design. No deviations.' },
            { label: 'Modifications', desc: 'Any design change after TC must be reported to DGCA.' },
            { label: 'Manufacturing', desc: 'Variance must stay within declared tolerances.' },
            { label: 'Sales', desc: 'Selling a drone with different specs = illegal manufacture.' },
            { label: 'Minor Changes', desc: 'Amendment application via D-1 on eGCA. CB reviews affected clauses only.' },
            { label: 'Significant Changes', desc: 'May require partial or full re-certification. Treat as a new TC process.' },
          ]).map((item, i) => (
            <div key={i} className="rounded-lg border border-red-200 px-4 py-3 sm:py-4 flex flex-col">
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 10: Battery ── */
  {
    id: 'battery',
    render: () => (
      <SlideShell acronyms={['BIS', 'MeitY', 'CSUAS', 'QCI', 'NABL', 'OEM', 'TC', 'D-1']}>
        <SlideLabel>Battery</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          The Most Regulated Component.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">Freeze your battery spec and supplier before D-1.</strong> Supplier changes most frequently trigger regulatory re-work.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: 'Cells', desc: 'Every lithium battery cell must be BIS registered.' },
            { label: 'Packs', desc: 'Every battery pack must be BIS registered separately.' },
            { label: 'Origin', desc: 'Applies regardless of import or domestic.' },
            { label: 'Post-TC', desc: 'Supplier change requires new BIS certificate + amendment filing.' },
            { label: 'Standard', desc: 'QCI Battery Testing Guidelines V3 (Feb 2023).' },
            { label: 'Scope', desc: 'Charge/discharge cycles, thermal behaviour, safety thresholds.' },
            { label: 'Labs', desc: 'NABL-accredited labs required for battery testing.' },
            { label: 'Staging', desc: 'OEM report for Stage 1; bench test may be done in Stage 2.' },
          ]).map((item, i) => (
            <div key={i} className="rounded-lg border border-ink/10 px-4 py-3 sm:py-4 flex flex-col">
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 11: ESC & Motors ── */
  {
    id: 'esc-motors',
    render: () => (
      <SlideShell acronyms={['ESC', 'CSUAS', 'KV', 'D-1']}>
        <SlideLabel>ESC & Motors</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          Less Regulated, But Still Documented.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">No published Indian standard</strong> for motors or ESCs. Changing <strong className="text-ink/70 font-medium">motor KV</strong> or <strong className="text-ink/70 font-medium">propeller diameter</strong> post-D-1 affects Clause 5 and 4. <strong className="text-ink/70 font-medium">Assume Stage 1 restart.</strong>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: 'Clause 5', desc: 'Evaluated against manufacturer-declared specs.' },
            { label: 'Off-the-shelf ESC', desc: 'Datasheet submission for Stage 1; bench test in Stage 2.' },
            { label: 'In-house ESC', desc: 'Full test reports required.' },
            { label: 'Motor-Prop Load', desc: 'Combination load used for structural calculations (Clause 4).' },
            { label: 'Motor KV Change', desc: 'Affects Clause 5 + Clause 4. High risk. Assume Stage 1 restart.' },
            { label: 'Propeller Change', desc: 'Affects structural load calculations. High risk post-D-1.' },
          ]).map((item, i) => (
            <div key={i} className={`rounded-lg border ${i >= 4 ? 'border-red-200' : 'border-ink/10'} px-4 py-3 sm:py-4 flex flex-col`}>
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 12: eGCA Migration ── */
  {
    id: 'egca',
    render: () => (
      <SlideShell acronyms={['eGCA', 'DGCA', 'TC', 'UIN', 'RPC', 'RPTO', 'NPNT', 'D-1']}>
        <SlideLabel>eGCA Migration</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          What The eGCA Migration Changed (July 2025).
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">All regulatory filings moved to eGCA.</strong> Old: digitalsky.dgca.gov.in → New: egca.dgca.gov.in. Invariant tracks these changes so you don't miss a deadline.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          {([
            ...EGCA_FORMS.map(f => ({ label: f.form, desc: f.purpose, color: 'border-ink/10' })),
            { label: 'D-1 Apps Voided', desc: 'All in-flight D-1 applications on Digital Sky were voided. Resubmitted on eGCA from scratch.', color: 'border-amber-200' },
            { label: 'No Offline RPCs', desc: 'RPTOs can no longer generate offline RPCs. Everything is digital only.', color: 'border-amber-200' },
            { label: 'Digital Sky Residual', desc: 'Still used only for: flight plan, airspace map, NPNT clearance per flight.', color: 'border-amber-200' },
          ]).map((item, i) => (
            <div key={i} className={`rounded-lg border ${item.color} px-4 py-3 sm:py-4 flex flex-col`}>
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{item.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 13: Critical Path / What to Do Now ── */
  {
    id: 'critical-path',
    render: () => (
      <SlideShell acronyms={['BOM', 'ESC', 'BIS', 'D-1', 'CB', 'NTH', 'eGCA', 'CIB&RC']}>
        <SlideLabel>What to Do Now</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          The Critical Path If You Are Starting Today.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-6 sm:mb-8 max-w-3xl">
          <strong className="text-ink/70 font-medium">8 steps to legal commercial operation.</strong> Questions? Reach out at{' '}
          <a href="mailto:founders@invariant-ai.com?subject=Drone TC Inquiry" className="underline underline-offset-2 hover:text-ink/70 transition-colors">founders@invariant-ai.com</a>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          {([
            { label: '1. Freeze BOM', desc: 'Especially battery supplier and motor/ESC spec.' },
            { label: '2. BIS Registration', desc: 'Ensure all batteries (cells + packs) are BIS registered before D-1.' },
            { label: '3. Choose CB', desc: 'NTH is cheapest at ₹1.5L. SGS/UL/BVIL also approved.' },
            { label: '4. Prepare D-1 Docs', desc: 'Stage 1 pre-check with CB recommended before filing.' },
            { label: '5. File D-1 on eGCA', desc: 'Submit application and pay fee.' },
            { label: '6. Lock Components', desc: 'Do NOT change any spec after D-1 without CB notification.' },
            { label: '7. Pesticide Approval', desc: 'Verify CIB&RC status independently before commercial spraying.' },
            { label: '8. Register on eGCA', desc: 'Account setup takes time. Do it now.' },
          ]).map((step, i) => (
            <div key={i} className="rounded-lg border border-ink/10 px-4 py-3 sm:py-4 flex flex-col">
              <p className="font-mono text-[10px] sm:text-xs font-medium text-ink/80 leading-snug mb-1.5">{step.label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-ink/45 leading-relaxed mt-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
]

export default function DroneDeck() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const total = slides.length

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total || next === current) return
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current, total],
  )

  const next = useCallback(() => go(current + 1), [go, current])
  const prev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      }
      if (e.key === 'End') {
        e.preventDefault()
        go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next()
        else prev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, prev])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white select-none relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SLIDE_TRANSITION}
          className="absolute inset-0"
        >
          {slides[current].render()}
        </motion.div>
      </AnimatePresence>

      {/* Side navigation arrows - always visible */}
      {current > 0 && (
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-sm border-t border-ink/[0.04]">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-ink/25 font-medium">
          Invariant
        </span>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-ink/60'
                  : 'w-2 bg-ink/12 hover:bg-ink/25'
              }`}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] sm:text-xs tabular-nums text-ink/30">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  )
}
