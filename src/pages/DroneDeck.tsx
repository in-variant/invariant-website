import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  render: () => React.ReactNode
}

function SlideShell({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`w-full h-full min-h-0 overflow-y-auto overscroll-contain flex flex-col
        px-5 sm:px-10 md:px-20 lg:px-32 xl:px-40
        pt-8 pb-20 sm:pt-10 sm:pb-20 md:pt-14 md:pb-20 lg:pt-16 lg:pb-16
        ${dark ? 'bg-ink text-white' : 'bg-white text-ink'}`}
    >
      {children}
    </div>
  )
}

function SlideLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-8 ${
        dark ? 'text-white/50' : 'text-ink/50'
      }`}
    >
      {children}
    </p>
  )
}

function TableRow({ cells, header, dark }: { cells: string[]; header?: boolean; dark?: boolean }) {
  const Tag = header ? 'th' : 'td'
  return (
    <tr className={header ? (dark ? 'border-b border-white/20' : 'border-b border-ink/15') : ''}>
      {cells.map((cell, i) => (
        <Tag
          key={i}
          className={`text-left py-2 pr-4 sm:pr-6 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed ${
            header
              ? dark
                ? 'text-white/60 font-medium tracking-wide uppercase'
                : 'text-ink/50 font-medium tracking-wide uppercase'
              : i === 0
                ? dark ? 'text-white/90 font-medium' : 'text-ink/90 font-medium'
                : dark ? 'text-white/60' : 'text-ink/60'
          }`}
        >
          {cell}
        </Tag>
      ))}
    </tr>
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
    'Yes': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Risky': 'bg-amber-100 text-amber-800 border-amber-200',
    'High risk': 'bg-red-100 text-red-800 border-red-200',
    'D-1 restart': 'bg-red-200 text-red-900 border-red-300',
  }
  return (
    <span className={`inline-block font-mono text-[9px] sm:text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded border font-medium ${colors[level] || 'bg-ink/5 text-ink/60 border-ink/10'}`}>
      {level}
    </span>
  )
}

const PROCESS_STEPS = [
  'BOM Finalised',
  'Choose a Certification Body (CB)',
  'Stage 1: Document Verification (CB reviews D-1 package)',
  'Submit Form D-1 on eGCA + pay fee',
  'CB assigned by DGCA',
  'Stage 2: Physical Inspection + Bench Tests + Flight Test',
  'CB issues Statement of Conformity (SoC) to DGCA',
  'DGCA issues Type Certificate (TC)',
  'Apply for UIN via Form D-2 on eGCA',
  'Get Remote Pilot Certificate (D-4 on eGCA)',
  'Legal commercial operation',
]

const slides: Slide[] = [
  /* ── Slide 1: Title ── */
  {
    id: 'title',
    render: () => (
      <SlideShell dark>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-white/40 mb-4">
              Invariant AI / Compliance Intelligence
            </p>
          </div>
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-[-0.03em] text-white mb-5 md:mb-8 max-w-5xl leading-[1.05]">
              Getting Your Agri Drone Type Certified in India
            </h1>
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-white/60 leading-tight tracking-[-0.01em] max-w-2xl">
              A practical guide from BOM to flying legally
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-8 md:pt-16">
            <span className="font-mono text-sm text-white/30">invariant-ai.com</span>
            <span className="font-mono text-xs text-white/50 tracking-wide hidden sm:flex items-center gap-2">
              Use
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded border border-white/40 text-[11px] text-white/70">&rarr;</kbd>
              to navigate
            </span>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 2: Why This Matters Now ── */
  {
    id: 'why-now',
    render: () => (
      <SlideShell>
        <SlideLabel>Why This Matters Now</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          No TC = no legal operation = no subsidy eligibility.
        </h2>
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          {[
            'You cannot register a drone (get UIN) without a Type Certificate.',
            'You cannot operate commercially without a UIN.',
            'DGCA suspended registration of all non-TC drones. No exceptions, no timeline.',
            'Pesticide interim approval under CIB&RC expired April 18, 2025. Status unclear.',
            'Everything flows through eGCA now (as of July 2025). Digital Sky is dead for regulatory filings.',
          ].map((point, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-ink/30 mt-2.5 shrink-0" />
              <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-ink/70">{point}</p>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 3: Two Regulatory Bodies ── */
  {
    id: 'two-bodies',
    render: () => (
      <SlideShell>
        <SlideLabel>Regulatory Landscape</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Two regulatory bodies. Both required independently.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mb-6 sm:mb-10">
          <div className="rounded-lg px-5 sm:px-6 py-5 sm:py-6 border border-[#2A9D8F]/40 bg-[#2A9D8F]/[0.06]">
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-medium mb-3 text-[#2A9D8F]">
              DGCA
            </h3>
            <p className="font-mono text-xs sm:text-sm text-ink/50 mb-3">Aviation regulator</p>
            <p className="font-mono text-xs sm:text-sm text-ink/70 leading-relaxed">
              Controls the drone itself: Type Certificate, UIN, RPC, RPTO.
            </p>
          </div>
          <div className="rounded-lg px-5 sm:px-6 py-5 sm:py-6 border border-[#C4820E]/40 bg-[#C4820E]/[0.06]">
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase font-medium mb-3 text-[#C4820E]">
              CIB&RC / MoAFW
            </h3>
            <p className="font-mono text-xs sm:text-sm text-ink/50 mb-3">Agriculture / pesticide regulator</p>
            <p className="font-mono text-xs sm:text-sm text-ink/70 leading-relaxed">
              Controls the chemicals being sprayed.
            </p>
          </div>
        </div>
        <p className="font-serif text-base sm:text-lg md:text-xl text-ink/50 italic max-w-3xl">
          Getting DGCA TC does not authorise pesticide spraying. Getting pesticide approval does not mean your drone is airworthy.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 4: Full Process ── */
  {
    id: 'process',
    render: () => (
      <SlideShell>
        <SlideLabel>The Full Process</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 max-w-4xl">
          End to end: BOM to legal commercial operation.
        </h2>
        <div className="max-w-2xl mb-6 sm:mb-8">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="flex items-stretch gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                  i === 0 || i === PROCESS_STEPS.length - 1
                    ? 'bg-ink text-white'
                    : 'border border-ink/20 text-ink/60'
                }`}>
                  <span className="font-mono text-[9px] sm:text-[10px] font-medium">{i + 1}</span>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-ink/10 my-1" />
                )}
              </div>
              <div className="pb-3 sm:pb-4 pt-1">
                <p className="font-mono text-xs sm:text-sm md:text-base text-ink/80 leading-relaxed">{step}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs sm:text-sm text-ink/50 max-w-2xl">
          Timeline: 3-6 months typically. 60 days for CB to submit SoC + 15 days for DGCA to issue TC.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 5: CSUAS Technical Criteria ── */
  {
    id: 'csuas',
    render: () => (
      <SlideShell>
        <SlideLabel>Technical Criteria</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 max-w-4xl">
          The 10 CSUAS criteria. Every drone must pass all 10.
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

  /* ── Slide 6a: Change Management - Phase 0 ── */
  {
    id: 'change-phase0',
    render: () => (
      <SlideShell>
        <SlideLabel>Change Management / Phase 0</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Before D-1 submission. Full freedom.
        </h2>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-5 sm:px-8 py-5 sm:py-8 max-w-3xl mb-6 sm:mb-10">
          <p className="font-mono text-sm sm:text-base text-ink/70 leading-relaxed mb-5">
            Nothing is locked. You can change:
          </p>
          <div className="space-y-3">
            {[
              'Any component: motors, ESCs, frame, battery cells, spray system, flight controller.',
              'Supplier, manufacturer, spec.',
              'Design configuration.',
              'Weight class (changes which CSUAS clauses apply).',
            ].map((point, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2 shrink-0" />
                <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-ink/70">{point}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-xs sm:text-sm text-ink/50 max-w-3xl leading-relaxed">
          Only constraint: your CB/ATE relationship and any pre-testing work you have done. No regulatory consequence.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 6b: Change Management - Phase 1 ── */
  {
    id: 'change-phase1',
    render: () => (
      <SlideShell>
        <SlideLabel>Change Management / Phase 1</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 max-w-4xl">
          After D-1 submitted, before Stage 2. Conditional freedom.
        </h2>
        <p className="font-mono text-xs sm:text-sm text-ink/50 mb-5 sm:mb-8 max-w-3xl">
          D-1 locks your declared design. Same spec, different supplier = notify + resubmit docs. Different spec = assume Stage 1 restart.
        </p>
        <div className="overflow-x-auto max-w-5xl">
          <table className="w-full border-collapse">
            <thead>
              <TableRow header cells={['Change Type', 'Can You?', 'Impact']} />
            </thead>
            <tbody>
              {PHASE1_CHANGES.map((row, i) => (
                <tr key={i} className="border-b border-ink/[0.05]">
                  <td className="py-1.5 sm:py-2 pr-3 sm:pr-4 font-mono text-[10px] sm:text-xs text-ink/70 leading-relaxed">{row.type}</td>
                  <td className="py-1.5 sm:py-2 pr-3 sm:pr-4"><RiskBadge level={row.can} /></td>
                  <td className="py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs text-ink/55 leading-relaxed">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 6b: Change Management - Phase 2 ── */
  {
    id: 'change-stage1-cleared',
    render: () => (
      <SlideShell>
        <SlideLabel>Change Management / After Stage 1 Clearance</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Stage 1 cleared. The design is approved on paper.
        </h2>
        <div className="rounded-lg border border-red-200 bg-red-50/40 px-5 sm:px-8 py-5 sm:py-8 max-w-3xl mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase font-medium text-red-700">Phase 2</span>
            <span className="font-mono text-xs sm:text-sm text-red-600/60">Very limited freedom</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[
              'Any component change re-triggers Stage 1 for affected clauses.',
              'CB will flag mismatches between submitted docs and physical drone during Stage 2.',
              'Mismatches = rejection, not a warning.',
              'If physical drone does not match D-1 docs exactly: Stage 2 fails, you restart from Stage 1 for affected clauses.',
              'Battery BIS certificate must match the physical cells installed, not the cells in the doc.',
            ].map((point, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-2 shrink-0" />
                <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-ink/70">{point}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="font-serif text-base sm:text-lg md:text-xl text-ink/50 italic max-w-3xl">
          After Stage 1 clearance, freeze the BOM. Any change = cost and time.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 6c: Change Management - Phase 3 ── */
  {
    id: 'change-post-tc',
    render: () => (
      <SlideShell dark>
        <SlideLabel dark>Change Management / TC in Hand</SlideLabel>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-white mb-6 sm:mb-10 max-w-4xl">
          TC issued. No freedom.
        </h2>
        <div className="space-y-4 sm:space-y-6 max-w-3xl">
          <div className="border-t border-white/15 pt-4 sm:pt-5">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-3">What's locked</h3>
            <div className="space-y-2.5">
              {[
                'TC is issued to a specific type design.',
                'Any design modification after TC must be reported to DGCA.',
                'Manufacturing variance (batch to batch component drift) must stay within declared tolerances.',
                'Selling a drone with different specs than TC\'d design = illegal manufacture.',
              ].map((point, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                  <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-white/65">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/15 pt-4 sm:pt-5">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-3">If you must change</h3>
            <div className="space-y-2.5">
              {[
                'Minor changes: amendment application via D-1 on eGCA.',
                'Significant changes: may require partial or full re-certification.',
              ].map((point, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 shrink-0" />
                  <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-white/65">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/[0.04] px-4 sm:px-6 py-4 sm:py-5 mt-4">
            <p className="font-mono text-xs sm:text-sm text-white/50 leading-relaxed">
              Practical example: if you switch battery supplier mid-production run, you need to check if the new cell is BIS registered and within the tolerances of your TC'd battery spec. If not, amendment required.
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 7: Battery ── */
  {
    id: 'battery',
    render: () => (
      <SlideShell>
        <SlideLabel>Battery</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          The most regulated component.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 max-w-5xl">
          <div className="rounded-lg border border-ink/10 px-5 sm:px-6 py-5 sm:py-6">
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/50 mb-4">
              1. BIS Registration (MeitY mandate)
            </h3>
            <ul className="space-y-2.5">
              {[
                'Every lithium battery cell must be BIS registered.',
                'Every battery pack must be BIS registered separately.',
                'Applies regardless of import or domestic.',
                'Supplier change post-TC: new BIS certificate required, amendment filing likely needed.',
              ].map((item, i) => (
                <li key={i} className="font-mono text-xs sm:text-sm text-ink/65 leading-relaxed pl-3 border-l-2 border-ink/10">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-ink/10 px-5 sm:px-6 py-5 sm:py-6">
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/50 mb-4">
              2. CSUAS Clause 3 Testing
            </h3>
            <ul className="space-y-2.5">
              {[
                'QCI Battery Testing Guidelines V3 (Feb 2023).',
                'Covers charge/discharge cycles, thermal behaviour, safety thresholds.',
                'NABL-accredited labs required for battery testing.',
                'OEM report acceptable for Stage 1; bench test may be done in Stage 2.',
              ].map((item, i) => (
                <li key={i} className="font-mono text-xs sm:text-sm text-ink/65 leading-relaxed pl-3 border-l-2 border-ink/10">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="font-serif text-base sm:text-lg text-ink/50 italic max-w-3xl mt-6 sm:mt-10">
          Battery is the component where a supplier change most frequently triggers regulatory re-work. Freeze your battery spec and supplier before D-1.
        </p>
      </SlideShell>
    ),
  },

  /* ── Slide 8: ESC & Motors ── */
  {
    id: 'esc-motors',
    render: () => (
      <SlideShell>
        <SlideLabel>ESC & Motors</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          Less regulated, but still documented.
        </h2>
        <div className="space-y-3 sm:space-y-4 max-w-3xl mb-6 sm:mb-10">
          {[
            'No published Indian standard for motors or ESCs.',
            'CSUAS Clause 5 evaluated against manufacturer-declared specs.',
            'Off-the-shelf ESC: datasheet submission sufficient for Stage 1; bench test in Stage 2.',
            'In-house ESC: full test reports required.',
            'Motor-propeller combination load used for structural load calculations (Clause 4).',
          ].map((point, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-ink/30 mt-2.5 shrink-0" />
              <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-ink/70">{point}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50/40 px-4 sm:px-6 py-4 sm:py-5 max-w-3xl">
          <p className="font-mono text-xs sm:text-sm text-red-800/80 leading-relaxed">
            Changing motor KV or propeller diameter post-D1 affects both Clause 5 and Clause 4 calculations. High risk. Assume Stage 1 restart.
          </p>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 9: Pesticide Layer ── */
  {
    id: 'pesticide',
    render: () => (
      <SlideShell dark>
        <SlideLabel dark>The Pesticide Layer</SlideLabel>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-white mb-5 sm:mb-8 max-w-4xl">
          Completely separate from DGCA. Often missed.
        </h2>
        <p className="font-mono text-sm sm:text-base text-white/50 mb-6 sm:mb-10 max-w-2xl leading-relaxed" style={{ fontWeight: 350 }}>
          Governed by Insecticides Act 1968 via CIB&RC.
        </p>
        <div className="space-y-4 sm:space-y-6 max-w-3xl">
          <div className="border-t border-white/15 pt-4 sm:pt-5">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Timeline</h3>
            <div className="space-y-2">
              <p className="font-mono text-xs sm:text-sm text-white/60">April 2022: Interim approval for ~479 pesticide formulations for drone spraying.</p>
              <p className="font-mono text-xs sm:text-sm text-white/60">April 2024: Extended by 1 year, valid until April 18, 2025.</p>
              <p className="font-mono text-xs sm:text-sm text-white/80 font-medium">April 2025 onwards: Status unclear. No confirmed further extension found.</p>
            </div>
          </div>
          <div className="border-t border-white/15 pt-4 sm:pt-5">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 mb-2">What This Means</h3>
            <div className="space-y-2">
              <p className="font-mono text-xs sm:text-sm text-white/60">Your drone can have a valid DGCA TC + UIN + RPC.</p>
              <p className="font-mono text-xs sm:text-sm text-white/60">But if CIB&RC interim approval has lapsed, spraying pesticides is technically illegal under the Insecticides Act.</p>
              <p className="font-mono text-xs sm:text-sm text-white/80 font-medium">This is the single biggest unresolved compliance risk for agri drone operators right now.</p>
            </div>
          </div>
          <p className="font-mono text-xs text-white/40 mt-4">
            Must be verified directly with ppqs.gov.in or CIB&RC before any commercial spraying operation.
          </p>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 10: eGCA Migration ── */
  {
    id: 'egca',
    render: () => (
      <SlideShell>
        <SlideLabel>eGCA Migration</SlideLabel>
        <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-10 max-w-4xl">
          What the eGCA migration changed (July 2025).
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 max-w-5xl">
          <div>
            <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/50 mb-4">Forms on eGCA</h3>
            <div className="space-y-2.5">
              {EGCA_FORMS.map((f) => (
                <div key={f.form} className="flex gap-3 sm:gap-4 py-1.5 border-b border-ink/[0.06]">
                  <span className="font-mono text-xs sm:text-sm font-medium text-ink/80 w-8 shrink-0">{f.form}</span>
                  <span className="font-mono text-xs sm:text-sm text-ink/60 leading-relaxed">{f.purpose}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/50 mb-3">Key Changes</h3>
              <ul className="space-y-2.5">
                {[
                  'All in-flight D-1 applications on Digital Sky were voided. Had to be resubmitted on eGCA from scratch.',
                  'RPTOs can no longer generate offline RPCs. Everything is digital only.',
                  'Digital Sky still used only for: flight plan, airspace map, NPNT clearance per flight.',
                ].map((item, i) => (
                  <li key={i} className="font-mono text-xs sm:text-sm text-ink/65 leading-relaxed pl-3 border-l-2 border-ink/10">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-ink/10 bg-ink/[0.02] px-4 py-3">
              <p className="font-mono text-[10px] sm:text-xs text-ink/50">
                Old: digitalsky.dgca.gov.in &rarr; New: egca.dgca.gov.in
              </p>
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 11: Critical Path / What to Do Now ── */
  {
    id: 'critical-path',
    render: () => (
      <SlideShell dark>
        <SlideLabel dark>What to Do Now</SlideLabel>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.02em] text-white mb-6 sm:mb-10 max-w-4xl">
          The critical path if you are starting today.
        </h2>
        <div className="space-y-3 sm:space-y-4 max-w-3xl mb-8 sm:mb-12">
          {[
            'Freeze BOM. Especially battery supplier and motor/ESC spec.',
            'Ensure all batteries (cells + packs) are BIS registered before D-1.',
            'Choose CB. NTH is cheapest at Rs 1.5L. SGS/UL/BVIL also provisionally approved.',
            'Prepare D-1 documentation package before filing (Stage 1 pre-check with CB recommended).',
            'File D-1 on eGCA.',
            'Do NOT change any component spec after D-1 without CB notification.',
            'Verify CIB&RC pesticide approval status independently before commercial spraying.',
            'Register on eGCA now. Account setup takes time.',
          ].map((step, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <span className="font-mono text-xs sm:text-sm text-white/30 tabular-nums w-5 sm:w-6 shrink-0 text-right pt-0.5 font-medium">
                {i + 1}
              </span>
              <p className="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-white/70">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 md:pt-10">
          <a
            href="mailto:founders@invariant-ai.com?subject=Drone TC Inquiry"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-white font-mono text-sm sm:text-base tracking-wide hover:bg-white/10 transition-colors"
          >
            founders@invariant-ai.com
          </a>
          <p className="font-mono text-xs text-white/30 mt-4">invariant-ai.com</p>
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

  const isDark = slides[current].id === 'title' || slides[current].id === 'change-post-tc' || slides[current].id === 'pesticide' || slides[current].id === 'critical-path'

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

      {current === 0 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 border border-white/40 rounded-full hover:border-white/80 hover:bg-white/10 transition-all group"
        >
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-white/80 group-hover:text-white transition-colors">
            Begin
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/80 group-hover:text-white transition-colors">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className={`absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 ${isDark ? 'text-white' : 'text-ink'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 disabled:opacity-20 transition-opacity"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isDark ? 'text-white/50' : 'text-ink/50'}
              />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            className="p-2 disabled:opacity-20 transition-opacity"
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isDark ? 'text-white/50' : 'text-ink/50'}
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? isDark ? 'w-6 bg-white/70' : 'w-6 bg-ink/70'
                  : isDark ? 'w-2 bg-white/20 hover:bg-white/40' : 'w-2 bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>

        <span className={`font-mono text-xs tabular-nums min-w-[3rem] text-right ${isDark ? 'text-white/40' : 'text-ink/40'}`}>
          {current + 1} / {total}
        </span>
      </div>
    </div>
  )
}
