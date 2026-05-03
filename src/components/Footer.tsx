export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 xl:px-32 py-10 border-t border-ink/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-serif text-xl md:text-2xl font-medium tracking-[-0.02em] text-ink">
          Invariant AI
        </p>
        <p className="font-mono text-base text-ink/55">
          AI-native services for regulated compliance.
        </p>
        <a
          href="mailto:founders@invariant-ai.com"
          className="font-mono text-base text-ink/60 hover:text-ink transition-colors underline underline-offset-2 decoration-ink/25 hover:decoration-ink/50"
        >
          founders@invariant-ai.com
        </a>
      </div>
    </footer>
  )
}
