import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

/* ================================================================
   STATIC DATA
   ================================================================ */

const FILE_TREE = [
  { name: 'Design Basis Documents', open: true, files: [
    'NSSS_Vendor_Thermal_Hydraulics_Rev3.pdf',
    'Core_Design_Basis_Rev2.pdf',
    'Reactor_Coolant_System_Design_Spec.pdf',
  ]},
  { name: 'NRC Regulations & Review Guides', open: true, files: [
    'NUREG-0800_Ch15.pdf',
    '10CFR50_Appendix_K.pdf',
    'RG_1.157_Best_Estimate_Calcs.pdf',
  ]},
  { name: 'Vendor Specifications', open: false, files: [
    'WEC-TR-2023-LOCA_Analysis.pdf',
    'Fuel_Assembly_Spec_Rev4.pdf',
  ]},
  { name: 'Site Characterization', open: false, files: [
    'Site_Seismic_Hazard_Analysis_2024.pdf',
    'Hydrology_Report_Rev1.pdf',
  ]},
  { name: 'Previous RAI Responses', open: false, files: [
    'RAI_Response_2024_Ch6.docx',
    'RAI_Response_2024_Ch15_Set1.docx',
  ]},
]

const CHAPTERS = [
  { num: '1', title: 'Introduction and General Description', status: 'complete', progress: 100 },
  { num: '2', title: 'Site Characteristics', status: 'complete', progress: 100 },
  { num: '3', title: 'Design of Structures, Components & Systems', status: 'review', progress: 78 },
  { num: '4', title: 'Reactor', status: 'draft', progress: 52 },
  { num: '5', title: 'Reactor Coolant System', status: 'draft', progress: 45 },
  { num: '6', title: 'Engineered Safety Features', status: 'draft', progress: 38 },
  { num: '15', title: 'Transient and Accident Analyses', status: 'draft', progress: 22 },
]

const EDITOR_CONTENT = `## 15.6.5 Loss-of-Coolant Accidents Resulting from Spectrum of Postulated Piping Breaks Within the Reactor Coolant Pressure Boundary

### 15.6.5.1 Introduction and Summary

This section presents the analysis of loss-of-coolant accidents (LOCAs) resulting from postulated breaks in the reactor coolant pressure boundary (RCPB). The analysis demonstrates compliance with the acceptance criteria of **10 CFR 50.46** and the requirements of **10 CFR 50, Appendix K**.

The LOCA analysis considers a spectrum of break sizes ranging from small breaks up to and including the double-ended guillotine break (DEGB) of the largest pipe in the reactor coolant system. [Ref: NUREG-0800, Section 15.6.5]

### 15.6.5.2 Design Basis

The emergency core cooling system (ECCS) is designed to provide adequate core cooling for the entire spectrum of postulated LOCAs. The design basis requires that:

1. The calculated peak cladding temperature (PCT) shall not exceed **2200°F** (1204°C)
2. The calculated total local oxidation of the cladding shall not exceed **17 percent** of the total cladding thickness
3. The calculated total amount of hydrogen generated shall not exceed **1 percent** of the hypothetical amount generated if all the metal in the cladding were to react
4. Calculated changes in core geometry shall be such that the core remains amenable to cooling
5. Long-term cooling shall be provided following successful initial operation of the ECCS

[Ref: 10 CFR 50.46(b), Acceptance Criteria for ECCS]`

const CHAT_MESSAGES = [
  {
    role: 'user' as const,
    content: 'What are the key acceptance criteria from 10 CFR 50.46 that Section 15.6.5 must address?',
  },
  {
    role: 'assistant' as const,
    content: `Based on the uploaded regulatory documents, 10 CFR 50.46(b) establishes five acceptance criteria for ECCS performance:

1. Peak Cladding Temperature: PCT shall not exceed 2200°F (1204°C)
2. Maximum Local Oxidation: Shall not exceed 17% of total cladding thickness before oxidation
3. Maximum Hydrogen Generation: Shall not exceed 1% of hypothetical total if all cladding reacted
4. Coolable Geometry: Core geometry changes must still permit adequate cooling
5. Long-term Cooling: Must be maintained after initial ECCS operation

Your current draft addresses criteria 1-3 explicitly. I recommend adding explicit discussion of criteria 4 and 5 in Section 15.6.5.4.

Sources: 10CFR50_Appendix_K.pdf, NUREG-0800_Ch15.pdf`,
  },
  {
    role: 'user' as const,
    content: 'Draft a paragraph for criterion 4 (coolable geometry) that I can add to 15.6.5.4.',
  },
  {
    role: 'assistant' as const,
    content: `Here is a draft paragraph for the coolable geometry criterion:

The analysis confirms that calculated changes in core geometry during and following the limiting LOCA do not result in conditions that would preclude effective core cooling. The fuel rod ballooning and relocation models employed in the evaluation demonstrate that flow blockage remains below the threshold that would impede coolant penetration to the core.

The cladding deformation analysis, performed in accordance with the methodology described in the approved evaluation model topical report [Ref: TR-ECCS-Evaluation-Model-Rev2], shows that the maximum local blockage ratio does not exceed 60% at any axial elevation, preserving adequate flow area for long-term cooling.

This traces to 10 CFR 50.46(b)(4) and references your uploaded evaluation model topical report.

Sources: TR-ECCS-Evaluation-Model-Rev2.pdf, 10CFR50_Appendix_K.pdf`,
  },
]

const INLINE_COMMENTS: Record<string, Array<{
  id: number
  author: string
  authorFull: string
  color: string
  body: string
  time: string
  replies?: Array<{
    id: number
    author: string
    authorFull: string
    color: string
    body: string
    time: string
    isAI?: boolean
  }>
}>> = {
  '15.6.5.1': [
    {
      id: 3,
      author: 'JM',
      authorFull: 'J. Martinez',
      color: '#6366f1',
      body: 'The break spectrum description needs to specify the limiting break size and location per the DCD.',
      time: '4h ago',
      replies: [],
    },
  ],
  '15.6.5.2': [
    {
      id: 1,
      author: 'RC',
      authorFull: 'R. Chen',
      color: '#2563eb',
      body: 'Should we reference the updated Appendix K evaluation model here? The Rev2 topical report has the latest acceptance basis.',
      time: '2h ago',
      replies: [
        {
          id: 2,
          author: 'AI',
          authorFull: 'Licensing AI',
          color: '#1f2937',
          body: 'Yes, referencing TR-ECCS-Evaluation-Model-Rev2 would strengthen the traceability chain.',
          time: '2h ago',
          isAI: true,
        },
      ],
    },
  ],
}

/* ================================================================
   COMPONENTS
   ================================================================ */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    review: 'bg-amber-50 text-amber-700 border-amber-200',
    draft: 'bg-blue-50 text-blue-700 border-blue-200',
    'not-started': 'bg-gray-50 text-gray-500 border-gray-200',
  }
  const labels: Record<string, string> = {
    complete: 'Complete',
    review: 'In Review',
    draft: 'Draft',
    'not-started': 'Not Started',
  }
  return (
    <span className={`text-[10px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border ${styles[status] || styles['not-started']}`}>
      {labels[status] || status}
    </span>
  )
}

function InlineComment({ section }: { section: string }) {
  const comments = INLINE_COMMENTS[section]
  if (!comments || comments.length === 0) return null

  return (
    <div className="mt-2 mb-4 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: comment.color }}
            >{comment.author}</div>
            <span className="text-xs font-medium text-gray-700">{comment.authorFull}</span>
            <span className="text-[10px] text-gray-400">{comment.time}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed ml-7">{comment.body}</p>
          {comment.replies?.map((reply) => (
            <div key={reply.id} className="ml-7 mt-2 pl-3 border-l-2 border-amber-200">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: reply.color }}
                >{reply.author}</div>
                <span className="text-[11px] font-medium text-gray-700">{reply.authorFull}</span>
                {reply.isAI && <span className="text-[9px] font-mono bg-gray-200/60 text-gray-500 px-1 rounded">AI</span>}
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{reply.body}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function FileTreePanel({ openFolders, toggleFolder }: { openFolders: Record<string, boolean>; toggleFolder: (name: string) => void }) {
  return (
    <div className="w-[260px] flex-shrink-0 border-r border-gray-200 bg-[#fafbfc] flex flex-col overflow-hidden">
      <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-gray-700 uppercase tracking-wider">Documents</span>
        <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1.5 text-[13px]">
        {FILE_TREE.map((folder) => {
          const isOpen = openFolders[folder.name] ?? folder.open
          return (
            <div key={folder.name}>
              <button
                onClick={() => toggleFolder(folder.name)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 transition-colors text-left"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                  <path d="M4 2l4 4-4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                  <path d="M1.5 3.5a1 1 0 011-1h3l1.5 1.5h4.5a1 1 0 011 1v5.5a1 1 0 01-1 1h-9a1 1 0 01-1-1z" stroke="#C4820E" strokeWidth="1.2" fill="#C4820E18" />
                </svg>
                <span className="font-medium text-gray-700 truncate">{folder.name}</span>
              </button>
              {isOpen && (
                <div className="ml-5">
                  {folder.files.map((file) => (
                    <button
                      key={file}
                      className="w-full flex items-center gap-1.5 px-3 py-1 hover:bg-gray-100 transition-colors text-left"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                        <rect x="1.5" y="1" width="9" height="10" rx="1" stroke="#9ca3af" strokeWidth="1" fill="none" />
                        <line x1="4" y1="4" x2="8" y2="4" stroke="#d1d5db" strokeWidth="0.8" />
                        <line x1="4" y1="6" x2="8" y2="6" stroke="#d1d5db" strokeWidth="0.8" />
                        <line x1="4" y1="8" x2="6.5" y2="8" stroke="#d1d5db" strokeWidth="0.8" />
                      </svg>
                      <span className="text-gray-600 truncate text-xs">{file}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-3 py-2.5 border-t border-gray-200 bg-emerald-50/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] text-emerald-700 font-medium uppercase tracking-wider">Knowledge Base Ready</span>
        </div>
        <p className="font-mono text-[10px] text-gray-500 mt-0.5">124,800 embeddings indexed</p>
      </div>
    </div>
  )
}

function EditorPanel() {
  const [mode, setMode] = useState<'preview' | 'write'>('preview')
  const [activeChapter, setActiveChapter] = useState('15')

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
      {/* Chapter tabs */}
      <div className="flex items-center border-b border-gray-200 bg-[#fafbfc] px-2 gap-0 overflow-x-auto">
        {CHAPTERS.filter(c => ['4', '5', '15'].includes(c.num)).map((ch) => (
          <button
            key={ch.num}
            onClick={() => setActiveChapter(ch.num)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono border-b-2 transition-colors whitespace-nowrap ${
              activeChapter === ch.num
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Ch. {ch.num}</span>
            <StatusBadge status={ch.status} />
          </button>
        ))}
        <button className="ml-1 px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded p-0.5">
            <button
              onClick={() => setMode('write')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                mode === 'write' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >Write</button>
            <button
              onClick={() => setMode('preview')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                mode === 'preview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >Preview</button>
          </div>
          <span className="text-[11px] font-mono text-gray-400">Section 15.6.5</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 rounded text-xs font-mono font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Generate
          </button>
          <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M3 5l1.5 1.5L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Saved
          </span>
        </div>
      </div>

      {/* Editor content with inline comments */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {mode === 'preview' ? (
            <div>
              <h2 className="text-lg font-mono font-semibold text-gray-900 mb-4">
                15.6.5 Loss-of-Coolant Accidents Resulting from Spectrum of Postulated Piping Breaks Within the Reactor Coolant Pressure Boundary
              </h2>

              <h3 className="text-base font-mono font-semibold text-gray-800 mt-6 mb-3">15.6.5.1 Introduction and Summary</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-3">
                This section presents the analysis of loss-of-coolant accidents (LOCAs) resulting from postulated breaks in the reactor coolant pressure boundary (RCPB). The analysis demonstrates compliance with the acceptance criteria of <strong>10 CFR 50.46</strong> and the requirements of <strong>10 CFR 50, Appendix K</strong>.
              </p>
              <p className="text-sm leading-relaxed text-gray-700 mb-3">
                The LOCA analysis considers a spectrum of break sizes ranging from small breaks up to and including the double-ended guillotine break (DEGB) of the largest pipe in the reactor coolant system.{' '}
                <span className="text-blue-600 text-xs font-mono bg-blue-50 px-1 py-0.5 rounded">[Ref: NUREG-0800, Section 15.6.5]</span>
              </p>

              <InlineComment section="15.6.5.1" />

              <h3 className="text-base font-mono font-semibold text-gray-800 mt-6 mb-3">15.6.5.2 Design Basis</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-3">
                The emergency core cooling system (ECCS) is designed to provide adequate core cooling for the entire spectrum of postulated LOCAs. The design basis requires that:
              </p>
              <ol className="text-sm leading-relaxed text-gray-700 space-y-2 list-decimal list-inside mb-3">
                <li>The calculated peak cladding temperature (PCT) shall not exceed <strong>2200°F</strong> (1204°C)</li>
                <li>The calculated total local oxidation of the cladding shall not exceed <strong>17 percent</strong> of the total cladding thickness</li>
                <li>The calculated total amount of hydrogen generated shall not exceed <strong>1 percent</strong> of the hypothetical amount generated if all the metal in the cladding were to react</li>
                <li>Calculated changes in core geometry shall be such that the core remains amenable to cooling</li>
                <li>Long-term cooling shall be provided following successful initial operation of the ECCS</li>
              </ol>
              <p className="text-sm leading-relaxed text-gray-700">
                <span className="text-blue-600 text-xs font-mono bg-blue-50 px-1 py-0.5 rounded">[Ref: 10 CFR 50.46(b), Acceptance Criteria for ECCS]</span>
              </p>

              <InlineComment section="15.6.5.2" />
            </div>
          ) : (
            <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{EDITOR_CONTENT}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatPanel() {
  const [input, setInput] = useState('')
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chatScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  return (
    <div className="w-[340px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
      <div className="px-3 py-2.5 border-b border-gray-200 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-gray-700 uppercase tracking-wider">AI Assistant</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] text-emerald-600">KB Ready</span>
        </div>
      </div>

      <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {CHAT_MESSAGES.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="w-4 h-4 rounded bg-gray-800 text-white flex items-center justify-center text-[8px] font-bold">AI</div>
                  <span className="font-mono text-[10px] font-medium text-gray-500">Licensing AI</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2.5 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about regulations, request drafts..."
            className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition-colors"
            rows={2}
          />
          <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 7L2 2v4l5 1-5 1v4z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectTracker() {
  const chapters = CHAPTERS
  const total = chapters.length
  const complete = chapters.filter(c => c.status === 'complete').length
  const review = chapters.filter(c => c.status === 'review').length
  const draft = chapters.filter(c => c.status === 'draft').length

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="font-mono text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="14" rx="2" stroke="#6b7280" strokeWidth="1.2" fill="none" />
          <line x1="1" y1="5.5" x2="15" y2="5.5" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="5.5" y1="1" x2="5.5" y2="15" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
        Program Tracker
      </h3>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-gray-800">{total}</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Total</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-emerald-600">{complete}</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Complete</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-amber-600">{review}</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Review</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-blue-600">{draft}</div>
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Draft</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Overall Completion</span>
          <span className="font-mono text-xs font-medium text-gray-700">{Math.round((complete / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 transition-all" style={{ width: `${(complete / total) * 100}%` }} />
          <div className="bg-amber-400 transition-all" style={{ width: `${(review / total) * 100}%` }} />
          <div className="bg-blue-400 transition-all" style={{ width: `${(draft / total) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-1.5">
        {chapters.map((ch) => (
          <div key={ch.num} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors">
            <span className="font-mono text-xs text-gray-400 w-6 text-right">{ch.num}</span>
            <span className="text-xs text-gray-700 flex-1 truncate">{ch.title}</span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  ch.status === 'complete' ? 'bg-emerald-500' :
                  ch.status === 'review' ? 'bg-amber-400' : 'bg-blue-400'
                }`}
                style={{ width: `${ch.progress}%` }}
              />
            </div>
            <StatusBadge status={ch.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function Prototype() {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})
  const [activeView, setActiveView] = useState<'authoring' | 'project'>('authoring')

  const toggleFolder = useCallback((name: string) => {
    setOpenFolders(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <section className="px-6 md:px-12 lg:px-24 xl:px-32 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink/15 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-ink/70">Interactive Prototype</span>
          </div>
          <h1 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-4">
            See the authoring environment.
          </h1>
          <p className="body-technical max-w-2xl mb-8">
            A preview of how Invariant's AI-assisted authoring platform works in practice. Upload regulatory documents, generate draft sections with full citation traceability, and collaborate with AI that understands your domain.
          </p>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveView('authoring')}
              className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 rounded transition-colors ${
                activeView === 'authoring'
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink/60 border border-ink/15 hover:text-ink'
              }`}
            >Authoring Environment</button>
            <button
              onClick={() => setActiveView('project')}
              className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 rounded transition-colors ${
                activeView === 'project'
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink/60 border border-ink/15 hover:text-ink'
              }`}
            >Project Tracker</button>
          </div>
        </motion.div>
      </section>

      {/* Mockup */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-xl border border-gray-300 shadow-2xl overflow-hidden bg-white"
          style={{ height: activeView === 'authoring' ? '680px' : 'auto' }}
        >
          {activeView === 'authoring' ? (
            <>
              {/* Top bar */}
              <div className="flex items-center justify-between h-11 px-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[9px] font-bold text-white">IN</div>
                    <span className="font-mono text-xs font-bold text-gray-800">Invariant</span>
                  </div>
                  <div className="w-px h-5 bg-gray-200" />
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded text-xs font-mono text-gray-600">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="1" y="2" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                      <path d="M4 2V1M8 2V1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    Advanced PWR - Unit 3 FSAR
                  </div>
                  <div className="flex gap-0.5">
                    {['Documents', 'Project', 'Comments'].map((tab, i) => (
                      <button
                        key={tab}
                        className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                          i === 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >{tab}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-gray-400">Last synced 2 min ago</span>
                  <div className="w-px h-5 bg-gray-200" />
                  <div className="flex -space-x-1.5">
                    {[{ initials: 'JM', color: '#6366f1' }, { initials: 'RC', color: '#2563eb' }, { initials: 'AP', color: '#059669' }].map((u) => (
                      <div
                        key={u.initials}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white"
                        style={{ backgroundColor: u.color }}
                      >{u.initials}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-panel body */}
              <div className="flex" style={{ height: 'calc(100% - 44px)' }}>
                <FileTreePanel openFolders={openFolders} toggleFolder={toggleFolder} />
                <EditorPanel />
                <ChatPanel />
              </div>
            </>
          ) : (
            <div className="p-6 md:p-8">
              <ProjectTracker />
            </div>
          )}
        </motion.div>

        <p className="font-mono text-xs text-center text-ink/40 mt-4">
          Static prototype. Functional product in development.
        </p>
      </section>
    </div>
  )
}
