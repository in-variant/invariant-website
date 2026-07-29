import { AnimatePresence, motion } from 'framer-motion'
import type { PlanItem } from '../../lib/timeline/types'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The dossier for the selected filing. One highlighted truth (what actually
 * happens), the statutory clock as the quiet counterpoint, and at most three
 * items per list. Everything traces to the curated knowledge base.
 */
export default function FilingDossier({ item }: { item: PlanItem | null }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {item && (
        <motion.div
          key={item.filing.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-4 rounded-[3px] bg-ink p-6 text-cloud md:p-9"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper">
              {item.filing.agency}
            </div>
            <div className="font-sans text-[11px] tabular-nums text-cloud/45">
              {item.filing.recurring
                ? 'Recurring after grant'
                : `Start T-${item.startT} · ${item.filing.window.durationMin} to ${item.filing.window.durationMax} months`}
            </div>
          </div>

          <h3 className="mt-2 max-w-2xl font-serif text-2xl leading-snug md:text-3xl">
            {item.filing.name}.
          </h3>
          <p className="mt-2 max-w-2xl font-sans text-[14px] leading-relaxed text-cloud/65">
            {item.filing.plain}
          </p>

          <div className="mt-6 border-l-2 border-copper pl-5">
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-copper/90">
              What actually happens
            </div>
            <p className="mt-1.5 max-w-2xl font-sans text-[15px] leading-relaxed text-cloud/90">
              {item.filing.clock.reality}
            </p>
            <p className="mt-2 font-sans text-[12.5px] italic text-cloud/45">
              On paper: {item.filing.clock.statutory}
            </p>
          </div>

          <div className="mt-7 grid gap-7 border-t border-cloud/10 pt-6 md:grid-cols-2">
            <DossierList label="Worth knowing" items={item.filing.keyFacts.slice(0, 3)} />
            <DossierList label="Where applicants fail" items={item.filing.failureModes.slice(0, 3)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1.5 border-t border-cloud/10 pt-4 font-sans text-[12px] text-cloud/45">
            <span className="max-w-xl">
              <span className="uppercase tracking-[0.12em] text-cloud/35">Fees </span>
              {item.filing.fees}
            </span>
            <span className="ml-auto whitespace-nowrap">
              <span className="uppercase tracking-[0.12em] text-cloud/35">Authority </span>
              {item.filing.cite}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DossierList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-cloud/40">{label}</div>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-3 font-sans text-[13px] leading-relaxed text-cloud/70">
            <span className="mt-[9px] h-px w-4 shrink-0 bg-copper/70" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
