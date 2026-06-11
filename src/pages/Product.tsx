import { motion } from 'framer-motion'
import { KeystoneMark } from '../components/Logo'

/* ----------------------------------------------------------------- data */

const FILE_TREE = [
  { name: 'Design Basis', open: true, files: ['Core_Design_Basis_Rev2.pdf', 'RCS_Design_Spec.pdf'] },
  { name: 'NRC Regulations', open: true, files: ['NUREG-0800_Ch15.pdf', '10CFR50_App_K.pdf', 'RG_1.157.pdf'] },
  { name: 'Vendor Specs', open: false, files: ['WEC-TR-2023-LOCA.pdf'] },
  { name: 'Prior RAI Responses', open: false, files: ['RAI_2024_Ch15.docx'] },
]

/* ----------------------------------------------------------------- panels */

function Docs() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-ink/[0.015] md:flex">
      <div className="border-b border-ink/10 px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Documents</span>
      </div>
      <div className="flex-1 overflow-hidden py-2">
        {FILE_TREE.map((folder) => (
          <div key={folder.name} className="px-2">
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-ink/70">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={folder.open ? 'rotate-90' : ''}>
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              </svg>
              <span className="truncate font-sans text-[13px] font-medium">{folder.name}</span>
            </div>
            {folder.open &&
              folder.files.map((f) => (
                <div key={f} className="ml-4 flex items-center gap-2 rounded-md px-2 py-1 text-ink/50">
                  <span className="h-1 w-1 rounded-full bg-ink/25" />
                  <span className="truncate font-sans text-xs">{f}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-ink/10 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        <span className="font-sans text-[11px] text-ink/45">124,800 embeddings indexed</span>
      </div>
    </aside>
  )
}

function Cite({ children }: { children: string }) {
  return <span className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-sans text-[11px] font-medium text-ink/55">{children}</span>
}

function Editor() {
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 6 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  })

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-paper">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-2.5">
        <span className="font-sans text-[11px] text-ink/45">Section 15.6.5 · Transient &amp; Accident Analyses</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-sans text-[11px] font-medium text-cloud">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            Generate
          </span>
          <span className="inline-flex items-center gap-1 font-sans text-[11px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Saved
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-2xl">
          <motion.h3 {...reveal(0)} className="font-sans text-lg font-medium text-ink">
            15.6.5 Loss-of-Coolant Accidents
          </motion.h3>
          <motion.p {...reveal(0.1)} className="mt-4 font-sans text-sm leading-relaxed text-ink/70">
            This section analyses loss-of-coolant accidents resulting from postulated breaks in the
            reactor coolant pressure boundary, demonstrating compliance with{' '}
            <span className="font-medium text-ink">10 CFR 50.46</span> and the requirements of{' '}
            <span className="font-medium text-ink">10 CFR 50, Appendix&nbsp;K</span>. <Cite>NUREG-0800 015.6.5</Cite>
          </motion.p>
          <motion.p {...reveal(0.2)} className="mt-4 font-sans text-sm leading-relaxed text-ink/70">
            The emergency core cooling system is designed to provide adequate core cooling across the
            full break spectrum. The design basis requires:
          </motion.p>
          <motion.ol {...reveal(0.28)} className="mt-3 space-y-1.5 font-sans text-sm leading-relaxed text-ink/70">
            <li>1. Peak cladding temperature ≤ <span className="font-medium text-ink">2200°F</span></li>
            <li>2. Local cladding oxidation ≤ <span className="font-medium text-ink">17%</span></li>
            <li>3. Hydrogen generation ≤ <span className="font-medium text-ink">1%</span></li>
            <li>4. Core geometry remains coolable</li>
            <li>
              5. Long-term cooling is maintained
              <span className="cursor-blink ml-0.5 inline-block h-4 w-[2px] -translate-y-px bg-ink/50 align-middle" />
            </li>
          </motion.ol>
          <motion.p {...reveal(0.36)} className="mt-3"><Cite>10 CFR 50.46(b)</Cite></motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            className="mt-6 rounded-lg border border-ink/10 bg-ink/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] font-semibold text-cloud">AI</span>
              <span className="font-sans text-xs font-medium text-ink/70">Review note</span>
              <span className="font-sans text-[10px] text-ink/35">just now</span>
            </div>
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-ink/55">
              Criteria 4 and 5 are listed but not yet substantiated. Generate a coolable-geometry
              paragraph traced to the Rev 2 evaluation-model topical report?
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function Chat() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-ink/10 bg-paper lg:flex">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">Assistant</span>
        <span className="inline-flex items-center gap-1.5 font-sans text-[11px] text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> KB ready
        </span>
      </div>
      <div className="flex-1 space-y-4 overflow-hidden px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-end"
        >
          <div className="max-w-[92%] rounded-2xl bg-ink px-3.5 py-2.5 text-[13px] leading-relaxed text-cloud">
            What acceptance criteria from 10 CFR 50.46 must Section 15.6.5 address?
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="max-w-[92%] rounded-2xl bg-ink/[0.04] px-3.5 py-2.5 text-[13px] leading-relaxed text-ink/80">
            <p>
              Five criteria apply: peak cladding temperature ≤ 2200°F, local oxidation ≤ 17%, hydrogen
              ≤ 1%, coolable geometry, and long-term cooling. Your draft covers 1–3, I'd add explicit
              treatment of 4 and 5 in 15.6.5.4.
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {['10CFR50_App_K.pdf', 'NUREG-0800_Ch15.pdf'].map((s) => (
                <span key={s} className="rounded bg-paper px-1.5 py-0.5 font-sans text-[10px] text-ink/45 ring-1 ring-ink/10">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="border-t border-ink/10 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-ink/12 px-3 py-2">
          <span className="flex-1 font-sans text-[13px] text-ink/35">Ask about a regulation, request a draft…</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-cloud">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2v4l5 1-5 1v4z" fill="currentColor" /></svg>
          </span>
        </div>
      </div>
    </aside>
  )
}

/* ----------------------------------------------------------------- page */

export default function Product() {
  return (
    <div className="bg-paper">
      <section className="px-6 pt-14 pb-10 text-center md:px-12 md:pt-20 lg:px-20">
        <h1 className="mx-auto max-w-xl font-serif text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-ink md:text-4xl">
          The platform behind the service.
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-ink/55 md:text-lg">
          Draft defensible compliance sections, with every claim traced to its rule.
        </p>
      </section>

      <section className="px-4 pb-28 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_40px_100px_-35px_rgba(13,13,13,0.3)]"
        >
          <div className="flex items-center justify-between border-b border-ink/10 bg-ink/[0.015] px-4 py-2.5">
            <div className="flex items-center gap-3 text-ink">
              <KeystoneMark className="h-[14px] w-auto" />
              <span className="font-grotesk text-sm font-semibold tracking-[-0.01em]">Invariant</span>
              <span className="hidden items-center rounded-md bg-paper px-2 py-1 font-sans text-[11px] text-ink/55 ring-1 ring-ink/10 sm:inline-flex">
                Advanced PWR · Unit 3 FSAR
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-sans text-[11px] text-ink/35 sm:inline">synced 2m ago</span>
              <div className="flex -space-x-1.5">
                {['JM', 'RC', 'AP'].map((u) => (
                  <span key={u} className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-[9px] font-semibold text-cloud ring-2 ring-paper">{u}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex h-[460px] md:h-[520px]">
            <Docs />
            <Editor />
            <Chat />
          </div>
        </motion.div>
      </section>
    </div>
  )
}
