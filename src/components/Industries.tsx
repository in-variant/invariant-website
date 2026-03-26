import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionDivider from './SectionDivider'

interface Stage {
  label: string
  assisted?: boolean
  detail: string
}

interface Industry {
  id: string
  name: string
  color: string
  colorLight: string
  stages: Stage[]
  description: string
}

const INDUSTRIES: Industry[] = [
  {
    id: 'drones',
    name: 'Drones',
    color: '#2A9D8F',
    colorLight: '#2A9D8F18',
    stages: [
      { label: 'Concept', detail: 'Initial mission profile, payload requirements, and operational envelope definition.' },
      { label: 'Prototype', assisted: true, detail: 'Airframe and avionics design validated against airworthiness standards from the start.' },
      { label: 'Flight Testing', assisted: true, detail: 'Test plans structured to produce the evidence regulators will require for type certification.' },
      { label: 'DGCA Type Cert', assisted: true, detail: 'Full type certificate application authored with traceability to every design input and test result.' },
      { label: 'Fleet Deployment', detail: 'Certified fleet enters commercial operation.' },
    ],
    description: 'From prototype airworthiness to DGCA type certification, our models train on the regulations your drone must satisfy.',
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    color: '#C4820E',
    colorLight: '#C4820E18',
    stages: [
      { label: 'Site Selection', assisted: true, detail: 'Environmental and seismic analyses structured to satisfy 10 CFR 100 siting criteria.' },
      { label: 'Preliminary Design', assisted: true, detail: 'Design basis documentation aligned with NRC acceptance criteria from first principles.' },
      { label: 'Safety Analysis', assisted: true, detail: 'Chapter-by-chapter PSAR content grounded in deterministic and probabilistic methods.' },
      { label: 'Topical Reports', assisted: true, detail: 'Standalone technical reports addressing specific regulatory questions with full citation chains.' },
      { label: 'NRC License App', assisted: true, detail: 'Complete license application assembled from verified components, review-ready on submission.' },
      { label: 'Construction', detail: 'Licensed facility enters the construction phase.' },
    ],
    description: 'From site selection through topical reports to the full license application. Regulatory understanding from day one.',
  },
  {
    id: 'maritime',
    name: 'Maritime',
    color: '#3A7CA5',
    colorLight: '#3A7CA518',
    stages: [
      { label: 'Vessel Design', assisted: true, detail: 'Structural and systems design validated against classification society rules from the outset.' },
      { label: 'Class Approval', assisted: true, detail: 'Class submission documentation authored with traceability to DNV, Lloyd\'s, or BV standards.' },
      { label: 'Safety Case', assisted: true, detail: 'Formal safety assessment structured to IMO guidelines with quantified risk arguments.' },
      { label: 'Flag State Review', assisted: true, detail: 'Flag state compliance documentation prepared for the specific jurisdiction of registration.' },
      { label: 'Commissioning', detail: 'Approved vessel enters service.' },
    ],
    description: 'From class society approval to flag state certification. Trained on IMO, DNV, and maritime safety frameworks.',
  },
  {
    id: 'aerospace',
    name: 'Aerospace',
    color: '#5C6370',
    colorLight: '#5C637018',
    stages: [
      { label: 'System Design', assisted: true, detail: 'Architecture decisions informed by certification requirements under DO-178C and DO-254.' },
      { label: 'DO-178C / DO-254', assisted: true, detail: 'Software and hardware assurance artifacts generated with full traceability to design inputs.' },
      { label: 'Safety Case', assisted: true, detail: 'System safety assessment structured for DER review with complete hazard analysis chains.' },
      { label: 'FAA / EASA Cert', assisted: true, detail: 'Type certificate application compiled from verified assurance artifacts, submission-ready.' },
      { label: 'Production', detail: 'Certified system enters manufacturing.' },
    ],
    description: 'From system design through DO-178C compliance to airworthiness certification. Regulatory fluency at every gate.',
  },
]

function Arrow() {
  return (
    <div className="flex-shrink-0 self-stretch flex items-center px-1 text-rule">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="15,2 21,6 15,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

function Pipeline({ industry }: { industry: Industry }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
        {industry.stages.map((stage, i) => (
          <div key={i} className="flex items-stretch">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="flex-shrink-0 group relative self-stretch"
            >
              <div
                className="w-[130px] md:w-[150px] h-full py-3 px-3 rounded text-center transition-all duration-200 border flex flex-col items-center justify-center"
                style={{
                  backgroundColor: stage.assisted
                    ? (expandedIndex === i ? industry.color : industry.colorLight)
                    : (expandedIndex === i ? '#E8E8E8' : '#F8F8F8'),
                  borderColor: stage.assisted
                    ? industry.color
                    : (expandedIndex === i ? '#BFBFBF' : '#E5E5E5'),
                  color: stage.assisted && expandedIndex === i ? '#FFFFFF' : '#0D0D0D',
                }}
              >
                <span className="font-mono text-xs md:text-sm font-medium block leading-tight">
                  {stage.label}
                </span>
                {stage.assisted && (
                  <span
                    className="font-mono text-[10px] md:text-xs tracking-[0.15em] uppercase mt-1 block"
                    style={{ color: expandedIndex === i ? 'rgba(255,255,255,0.8)' : industry.color }}
                  >
                    AI-assisted
                  </span>
                )}
              </div>
            </button>
            {i < industry.stages.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {expandedIndex !== null && (
          <motion.div
            key={expandedIndex}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 rounded px-5 py-4 border"
              style={{
                backgroundColor: industry.stages[expandedIndex].assisted ? industry.colorLight : '#F8F8F8',
                borderColor: industry.stages[expandedIndex].assisted ? `${industry.color}40` : '#E5E5E5',
              }}
            >
              <p className="font-mono text-xs md:text-sm tracking-[0.15em] uppercase mb-2" style={{
                color: industry.stages[expandedIndex].assisted ? industry.color : '#888',
              }}>
                {industry.stages[expandedIndex].label}
              </p>
              <p className="font-mono text-sm md:text-base leading-relaxed text-ink/70">
                {industry.stages[expandedIndex].detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Industries() {
  const [activeId, setActiveId] = useState(INDUSTRIES[0].id)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const active = INDUSTRIES.find(i => i.id === activeId)!

  return (
    <section>
      <SectionDivider label="§2" />
      <div ref={ref} className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-6"
        >
          Regulatory intelligence across the engineering lifecycle.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="body-technical max-w-2xl mb-14"
        >
          Invariant's models are trained on domain-specific regulations. They don't just write documentation at the end. They assist your team from early design through final certification.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex gap-0 border-b border-ink/10 mb-10">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveId(industry.id)}
                className={`font-mono text-xs md:text-sm tracking-[0.2em] uppercase px-5 py-3 transition-colors relative ${
                  activeId === industry.id
                    ? 'text-ink'
                    : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {industry.name}
                {activeId === industry.id && (
                  <motion.div
                    layoutId="industry-tab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Pipeline industry={active} />
              <p className="body-technical mt-8 max-w-xl">
                {active.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
