import { Link } from 'react-router-dom'

const BENCHMARK_ROWS = [
  { model: 'fermi-512', score: '0.74', highlight: false },
  { model: 'fermi-1024', score: '0.72', highlight: false },
  { model: 'splade-cocondenser-ensembledistil', score: '0.64', highlight: false },
  { model: 'helion-512', score: '0.97', highlight: true },
]

export default function FermiBenchSOTA() {
  return (
    <article className="min-h-screen py-24 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-10">
          <Link
            to="/blog"
            className="font-mono text-sm text-ink/40 hover:text-ink/70 transition-colors"
          >
            &larr; Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-16 text-center">
          <p className="font-mono text-sm text-ink/40 mb-4">April 2, 2026</p>
          <h1 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-6">
            Invariant Sets State-of-the-Art on FermiBench
          </h1>
          <p className="font-serif text-xl md:text-2xl text-ink/60 leading-relaxed tracking-[-0.01em] max-w-3xl mx-auto">
            0.97 NDCG@10 on the only published information retrieval benchmark for the nuclear domain
          </p>
        </header>

        {/* Lead */}
        <div className="mb-16 space-y-6">
          <div className="section-rule" />
          <p className="font-sans text-base text-ink/75 leading-relaxed">
            We are pleased to announce that Invariant has achieved state-of-the-art
            performance on FermiBench with our model <strong className="text-ink">helion-512</strong>,
            the only published information retrieval benchmark for the nuclear domain.
            This is a milestone that reflects months of focused work on a problem that
            sits at the core of what we are building: reliable, citation-grounded
            document generation for nuclear licensing.
          </p>
        </div>

        {/* Benchmark table */}
        <div className="mb-16">
          <div className="border border-ink/[0.08] rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-ink/[0.03]">
                  <th className="text-left font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 px-5 py-3">
                    Model
                  </th>
                  <th className="text-right font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 px-5 py-3">
                    FermiBench NDCG@10
                  </th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARK_ROWS.map((row) => (
                  <tr
                    key={row.model}
                    className={`border-t border-ink/[0.06] ${row.highlight ? 'bg-blue-50/60' : ''}`}
                  >
                    <td className={`px-5 py-3 font-mono text-sm ${row.highlight ? 'text-ink font-semibold' : 'text-ink/70'}`}>
                      {row.model}
                    </td>
                    <td className={`px-5 py-3 text-right font-mono text-sm tabular-nums ${row.highlight ? 'text-ink font-semibold' : 'text-ink/70'}`}>
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-ink/40 mt-3 text-center">
            Other results: <strong className="text-ink/60">Precision@1: 0.93</strong>
          </p>
        </div>

        {/* Body sections */}
        <div className="space-y-14">
          {/* What we built */}
          <section>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              What we built
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                We trained a domain-adapted retrieval model over NRC ADAMS, the U.S.
                Nuclear Regulatory Commission's Agency-wide Documents Access and
                Management System, which serves as the authoritative repository for
                nuclear regulatory documents in the United States. The model takes a
                natural language query and surfaces the most relevant regulatory
                documents from the corpus in response.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The training pipeline was built entirely on nuclear-domain data, using
                a corpus curated specifically for regulatory and technical documents
                from NRC ADAMS. FermiBench evaluation documents were excluded from our
                training corpus. Rather than adapting a general-purpose retrieval model,
                we built the training process around the vocabulary, query patterns, and
                document structure native to nuclear licensing, ensuring the model
                reflects how nuclear engineers and licensing professionals actually
                search for regulatory guidance.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The result is a retrieval model that understands the language of nuclear
                regulation natively, not as a downstream adaptation of a general-purpose
                search system.
              </p>
            </div>
          </section>

          {/* What these numbers mean */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              What these numbers mean
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                <strong className="text-ink">NDCG@10 of 0.97</strong> means that for a
                given nuclear regulatory query, the correct document appears within the
                top 10 retrieved results 97% of the time. This is the standard metric
                for evaluating ranked retrieval quality and accounts for the position of
                the correct document within the result list, rewarding systems that
                surface the right answer higher.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                <strong className="text-ink">Precision@1 of 0.93</strong> is the sharper
                number. It means that when our system returns a result, the top-ranked
                document is the correct one 93% of the time. There is no averaging over
                positions, no credit for getting it right at rank 5. The first document
                is right, nine times out of ten.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                For context, the previous published state-of-the-art on FermiBench was
                0.74 NDCG@10, achieved by fermi-512, a model trained on the
                general-domain MS MARCO passage ranking dataset. The gap between 0.74
                and 0.97 is not incremental. It reflects the difference between a
                general-purpose retrieval system applied to nuclear documents and a
                retrieval system that was built for them.
              </p>
            </div>

            {/* Visual comparison callout */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-ink/[0.02] border border-ink/[0.06] rounded-md p-5 text-center">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">
                  Previous SOTA
                </p>
                <p className="font-mono text-3xl font-semibold text-ink/40 mb-1">0.74</p>
                <p className="font-mono text-xs text-ink/30">fermi-512</p>
              </div>
              <div className="bg-blue-50/60 border border-blue-200/60 rounded-md p-5 text-center">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-600/70 mb-2">
                  Invariant
                </p>
                <p className="font-mono text-3xl font-semibold text-ink mb-1">0.97</p>
                <p className="font-mono text-xs text-ink/50">helion-512</p>
              </div>
            </div>
          </section>

          {/* Why retrieval quality is the foundation */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              Why retrieval quality is the foundation of what we are building
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                Invariant is building language models for nuclear compliance
                documentation. Our platform generates PSARs, FSARs, topical reports,
                and supporting technical documents, the kinds of documents that go to
                the NRC for review, that underpin reactor licensing decisions, and that
                sit at the center of the safety case for every nuclear facility.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The hardest unsolved problem in applying language models to this task is
                not generation quality. Modern language models are capable of producing
                fluent, technically coherent text. The problem is grounding. When a model
                generates a claim in a PSAR, that claim needs to be traceable to a
                specific regulatory document. It needs a citation. And that citation
                needs to be real, accurate, and pointing to the document that actually
                supports the claim.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                This is where most AI systems fail in regulated industries. Hallucinated
                citations are not a minor formatting issue. In a licensing document, a
                fabricated reference to a non-existent NRC guidance document, or a real
                document cited in the wrong context, is a technical deficiency that
                triggers an NRC Request for Additional Information, extends the review
                timeline, and in some cases requires rewriting entire sections of the
                submission. The downstream cost of a single bad citation in a PSAR can
                run into weeks of engineering time.
              </p>
            </div>

            <div className="mt-6 pl-4 border-l-2 border-ink/10 space-y-4">
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                Our retrieval system is the component that prevents this. Every clause
                our document generation pipeline produces is grounded in a retrieved
                ADAMS document. The retrieval model identifies the most relevant
                regulatory source, the generation model drafts the corresponding
                language, and the citation is attached before the output ever reaches a
                human reviewer. The 93% Precision@1 figure is not an abstract benchmark
                result. It is the rate at which our system gets the grounding right on
                the first try, before any human review or correction.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The improvement from 0.74 to 0.97 on NDCG@10 directly translates to
                fewer bad citations, fewer RAIs, and licensing submissions that hold up
                under NRC scrutiny.
              </p>
            </div>
          </section>

          {/* Will this be limited to NRC ADAMS? */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              Will this be limited to NRC ADAMS?
            </h2>
            <div className="space-y-4">
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                The short answer is no. NRC ADAMS is where we started because it is the
                most comprehensive and well-structured corpus available for nuclear
                regulatory retrieval, and FermiBench gave us a rigorous way to measure
                progress against a published baseline. But the retrieval system we have
                built is not coupled to ADAMS specifically. It is coupled to the problem
                of finding the right document in a large corpus of dense regulatory
                text, which is a problem that exists everywhere in nuclear compliance.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                Nuclear plant owners, operators, and licensing teams work across a wide
                range of regulatory frameworks beyond 10 CFR Part 50. Part 70 covers
                special nuclear material licensing. Part 100 governs reactor site
                criteria. Advanced reactor developers are navigating Part 53, the new
                risk-informed licensing framework that came into effect this year. Each
                of these domains has its own corpus of guidance documents, regulatory
                precedents, and technical references. The challenge in each case is the
                same: finding the right document quickly and reliably, so that the
                compliance work built on top of it is grounded.
              </p>
              <p className="font-sans text-base text-ink/75 leading-relaxed">
                Our training pipeline is modular and designed to ingest
                customer-uploaded data directly. When a new corpus is provided, the
                pipeline trains on it and produces a retrieval model calibrated to that
                specific regulatory environment. The performance holds consistently
                across corpora we have tested beyond ADAMS. The broader ambition is
                straightforward: anywhere there is a compliance documentation
                requirement in the nuclear sector, Invariant should be able to serve it.
                The retrieval layer is what makes that possible across domains without
                reengineering the system from scratch for each one.
              </p>
            </div>
          </section>

          {/* Try it */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              Try it
            </h2>
            <p className="font-sans text-base text-ink/75 leading-relaxed mb-6">
              We are building a lightweight search interface where you can submit a
              nuclear regulatory query and retrieve the most relevant ADAMS document
              directly, powered by <strong className="text-ink">helion-512</strong>. If
              you are working on reactor licensing, safety analysis, or any
              documentation that draws on NRC regulatory guidance, this will be the
              fastest way to see the retrieval quality firsthand.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-ink/[0.04] border border-ink/[0.08]">
              <span className="font-mono text-sm text-ink/50 tracking-wide uppercase">Coming Soon</span>
            </div>
          </section>

          {/* Acknowledgements */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              Acknowledgements
            </h2>
            <p className="font-sans text-base text-ink/75 leading-relaxed">
              We thank Atomic Canyon for open-sourcing the fermi model family and for
              creating FermiBench, the only publicly available benchmark for nuclear
              domain information retrieval. Our retrieval model builds on the
              fermi-bert-512 encoder released by Atomic Canyon, and we are grateful
              for the foundation their work provided. We also thank the domain experts
              and PhD researchers in the nuclear community who supported training data
              validation and helped ensure the quality of the query-document pairs used
              in our training pipeline.
            </p>
          </section>

          {/* Open-source contribution */}
          <section>
            <div className="section-rule mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-[-0.01em] mb-6">
              Open-source contribution
            </h2>
            <p className="font-sans text-base text-ink/75 leading-relaxed mb-4">
              Our team has long contributed to open-source research communities and we
              are continuing that practice here. We are releasing 500 samples from our
              training dataset publicly. The full training dataset and trained models
              remain proprietary, but we hope the released samples are useful to
              researchers working on domain-specific retrieval in technical and
              regulatory domains.
            </p>
            <a
              href="https://huggingface.co/datasets/in-variant-ai/helion-reduced-dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-ink/70 hover:text-ink transition-colors border-b border-ink/20 hover:border-ink/40 pb-0.5"
            >
              View dataset on Hugging Face &rarr;
            </a>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-ink/10">
          <div className="max-w-3xl mx-auto">
            <p className="font-sans text-sm text-ink/50 leading-relaxed text-center">
              FermiBench benchmark created by Atomic Canyon. NDCG@10 and Precision@1
              evaluated on the published FermiBench test set. FermiBench evaluation
              documents were excluded from our training corpus.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
