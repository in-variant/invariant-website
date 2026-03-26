import { Shield, Clock, HardDrive, Cpu, Terminal, Layers, Crosshair } from 'lucide-react';

export function Nuclear() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-16 relative overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-16 text-center">
        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Nuclear Systems Licensing</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Solving the Engineering Bottleneck.
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-10">
          The timeline from concept to commercial operation for a nuclear power plant spans 6–8 years—with over 6 of those years consumed by drafting and obtaining licenses alone.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto max-w-4xl text-left mt-16">
          <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <Clock className="size-8 text-emerald-400 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">4 Years</h3>
            <p className="text-sm text-neutral-400">Average NRC Review Time</p>
          </div>
          <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <Layers className="size-8 text-emerald-400 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">120,000</h3>
            <p className="text-sm text-neutral-400">Total Staff-Hours Expended</p>
          </div>
          <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <Crosshair className="size-8 text-emerald-400 mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">$41.8M</h3>
            <p className="text-sm text-neutral-400">NRC Regulatory Fees Alone</p>
          </div>
        </div>
      </section>

      {/* 2. The Real Problem Insight */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-32 relative">
        <div className="bg-emerald-950/20 border border-emerald-900/50 p-8 md:p-12 rounded-3xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The bottleneck isn't review — it's authorship.</h2>
              <p className="text-neutral-300 text-lg leading-relaxed mb-4">
                Licensing teams hold the working knowledge of the reactor design and site, but translating that into concrete, citable technical content requires repeatedly scheduling coordination meetings with nuclear engineers.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                With the NRC's shift toward an <b>"Audit Process" model</b>, reviewers engage during the drafting phase to identify gaps in real time. The value is no longer in reviewing what was submitted — it's in making the submission dramatically better before it ever leaves the applicant's hands.
              </p>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 p-6 flex flex-col justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
               <Terminal className="text-emerald-400 size-10 mb-4" />
               <p className="font-mono text-sm text-neutral-300 break-words">
                 $ InVariant.ingest(corpus: ["PSAR", "Design Basis", "NUREG-0800"])<br/>
                 &gt; Vectorizing 4,200 source documents...<br/>
                 &gt; Assembling structural compliance mapping...<br/>
                 $ InVariant.author(chapter: "15", section: "Loss of Coolant")<br/>
                 &gt; Analyzing accident bounds...<br/>
                 &gt; Generating review-ready first draft... [SUCCESS]
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. System Architecture */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-32">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">System Architecture</h2>
          <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
            A three-layered platform built exclusively for securing, accelerating, and synthesizing complex engineering knowledge.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-start hover:border-emerald-500/30 transition-colors">
            <div className="bg-black p-4 rounded-xl shrink-0">
              <HardDrive className="text-emerald-400 size-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">1. Air-Gapped LLM Host Layer</h3>
              <p className="text-neutral-400 leading-relaxed">
                The entire intelligence stack runs on servers owned and operated by the client. The model server exposes a standard compatible REST API internally. All compute, inference, training, and data storage runs on your infrastructure, ensuring absolute data sovereignty.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-start hover:border-emerald-500/30 transition-colors">
            <div className="bg-black p-4 rounded-xl shrink-0">
              <Layers className="text-emerald-400 size-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">2. Product Vertical Pipeline</h3>
              <p className="text-neutral-400 leading-relaxed">
                Consists of Unified Data Ingestion across legacy formats, an advanced RAG pipeline, and Citation Enforcement to ensure every generated passage traces to a source document. Delivered via a <strong>Cursor-like Editor</strong> with an inline chat interface for contextual technical editing.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-start hover:border-emerald-500/30 transition-colors">
            <div className="bg-black p-4 rounded-xl shrink-0">
              <Cpu className="text-emerald-400 size-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">3. Training Vertical</h3>
              <p className="text-neutral-400 leading-relaxed">
                Continuous domain-adaptive pre-training combined with preference optimization using expert-ranked drafts. A composite loss function adds a citation-alignment penalty term, neutralizing unfounded hallucinations over training epochs. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Deep Fission Case Study */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-32 mb-16">
        <div className="bg-neutral-950 border border-neutral-800 p-8 md:p-12 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
             <Shield className="w-64 h-64 text-emerald-400" />
          </div>
          <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Case Study: Deep Fission</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl">
            The Mile-Deep Piping Challenge
          </h2>
          <div className="text-neutral-300 text-lg space-y-6 max-w-3xl">
            <p>
              Deep Fission is siting an SMR roughly 1.6km underground. Conventional piping codes (ASME Section III) assume horizontally supported runs. A mile of vertical pipe introduces running string tension, hydrostatic head gradients, and immense thermal expansion constraints.
            </p>
            <p>
              To license this, they must develop a project-specific design code by cross-referencing:
            </p>
            <ul className="list-disc pl-6 text-neutral-400 space-y-2">
              <li><strong>ASME B31.3</strong> (Process Piping)</li>
              <li><strong>API RP 1111</strong> (Submarine Pipeline Design)</li>
              <li><strong>DNV-ST-F101</strong> (Submarine Pipeline Systems)</li>
            </ul>
            <p>
              InVariant systematically ingests these 1,500+ pages of codes, building an 11×3 matrix mapping 11 failure modes against all clauses. It identifies gaps where none of the codes apply natively to the vertical borehole, proposes analytically defensible gap-fills, and generates a structured draft for PSAR Chapter 4—harmonizing the safety factor philosophy into a unified methodology for regulatory evaluation.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
