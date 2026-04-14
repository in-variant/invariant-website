import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDE_TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }

interface Slide {
  id: string
  render: () => React.ReactNode
}

function SlideShell({ children }: { children: React.ReactNode }) {
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

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative group rounded-xl border border-ink/[0.08] bg-ink/[0.02] px-6 py-4 w-full font-mono text-xs sm:text-sm text-ink/70 leading-relaxed overflow-x-auto">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md border border-ink/10 bg-white hover:bg-ink/[0.04] text-ink/40 hover:text-ink/70 text-[10px] font-mono tracking-wide uppercase"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="whitespace-pre-wrap">{children}</pre>
    </div>
  )
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-5 sm:py-6">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-3">
        {number}
      </span>
      <h3 className="font-mono text-sm sm:text-base font-medium text-ink/80 leading-snug mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}

function ArchBox({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div
      className="rounded-xl border-2 px-5 py-5 flex flex-col items-center gap-2.5 min-w-[140px] sm:min-w-[160px]"
      style={{ borderColor: `${color}40`, backgroundColor: `${color}06` }}
    >
      <span
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium"
        style={{ color: `${color}99` }}
      >
        {label}
      </span>
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center rounded-lg border px-3 py-1.5 sm:py-2 w-full"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
        >
          <span className="font-mono text-[10px] sm:text-xs font-medium whitespace-nowrap" style={{ color }}>{item}</span>
        </div>
      ))}
    </div>
  )
}

function FlowArrow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 sm:px-3 shrink-0">
      <svg width="48" height="24" viewBox="0 0 48 24" className="shrink-0">
        <line x1="0" y1="12" x2="38" y2="12" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        <polyline points="34,6 44,12 34,18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <circle cx="8" cy="12" r="2" fill={color} opacity="0.6">
          <animate attributeName="cx" values="4;40;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      <span className="font-mono text-[8px] sm:text-[9px] whitespace-nowrap" style={{ color, opacity: 0.6 }}>{label}</span>
    </div>
  )
}

const slides: Slide[] = [
  /* ── Slide 1: Title ── */
  {
    id: 'title',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ink/40 mb-6">
            Technical Onboarding · Confidential
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink mb-5 md:mb-8 leading-[1.1]">
            Invariant AI
            <span className="text-ink/30 mx-3 font-light">×</span>
            InTomes
          </h1>
          <p className="font-mono text-sm sm:text-base md:text-lg text-ink/50 leading-relaxed max-w-2xl mb-10 md:mb-14">
            Implementation workflow & local development setup for Jim.
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

  /* ── Slide 2: High-Level Architecture ── */
  {
    id: 'architecture',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Architecture</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            High-level system design.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            Both frontend and backend are deployed on GCP services.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-0 overflow-x-auto pb-2">
          <ArchBox label="User" items={['Browser']} color="#2A9D8F" />
          <FlowArrow label="HTTPS" color="#2A9D8F" />
          <ArchBox label="Frontend" items={['React App', 'Nginx']} color="#5C6370" />
          <FlowArrow label="API calls" color="#5C6370" />
          <ArchBox label="Backend" items={['FastAPI', 'Uvicorn']} color="#6366f1" />
          <FlowArrow label="services" color="#C4820E" />
          <ArchBox label="GCP" items={['Cloud Run', 'Cloud Storage']} color="#C4820E" />
        </div>

        <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-4 sm:py-5 max-w-3xl mx-auto mt-8 sm:mt-10">
          <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">Deployment</span>
          </div>
          <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
            Frontend served via <strong className="text-ink/80 font-medium">Nginx on GCP Cloud Run</strong> · Backend runs as a <strong className="text-ink/80 font-medium">Python container on GCP Cloud Run</strong>
          </p>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 3: Tech Stack ── */
  {
    id: 'tech-stack',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Tech Stack</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Frontend & Backend.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            Key technologies powering the Invariant IDE.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-6 sm:py-8">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-5">
              Frontend
            </span>
            <div className="flex flex-col gap-3">
              {[
                { name: 'React 19', detail: 'UI framework' },
                { name: 'TypeScript', detail: 'Type safety' },
                { name: 'Vite 6', detail: 'Build tool & dev server' },
                { name: 'Tailwind CSS', detail: 'Styling' },
                { name: 'Monaco Editor', detail: 'Code editing' },
                { name: 'Tiptap', detail: 'Rich text editing' },
                { name: 'Zustand', detail: 'State management' },
              ].map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm font-medium text-ink/80">{t.name}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-ink/40">{t.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-ink/[0.08] bg-ink/[0.015] px-6 sm:px-8 py-6 sm:py-8">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/25 font-medium block mb-5">
              Backend
            </span>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Python 3.12', detail: 'Runtime' },
                { name: 'FastAPI', detail: 'Web framework' },
                { name: 'Uvicorn', detail: 'ASGI server' },
                { name: 'OpenAI SDK', detail: 'LLM integration' },
                { name: 'ChromaDB', detail: 'Vector search' },
                { name: 'PyMuPDF', detail: 'PDF processing' },
                { name: 'GCS', detail: 'Cloud storage' },
              ].map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm font-medium text-ink/80">{t.name}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-ink/40">{t.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 4: Install NPM ── */
  {
    id: 'install-npm',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Frontend Setup · Step 1</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Install Node.js & NPM.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            NPM ships with Node.js. Install Node to get both.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          <StepCard number="01" title="Install nvm & Node.js">
            <CodeBlock>{`# Download and install nvm:\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash\n\n# In lieu of restarting the shell:\n\\. "$HOME/.nvm/nvm.sh"\n\n# Download and install Node.js:\nnvm install 24`}</CodeBlock>
          </StepCard>

          <StepCard number="02" title="Verify installation">
            <CodeBlock>{`node -v  # Should print "v24.14.1"\nnpm -v   # Should print "11.11.0"`}</CodeBlock>
          </StepCard>

          <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-4 sm:py-5">
            <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">Reference</span>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
              <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-ink/15 hover:decoration-ink/30 hover:text-ink/70 transition-colors">nodejs.org/en/download</a>
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 5: Unzip & Run Frontend ── */
  {
    id: 'run-frontend',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Frontend Setup · Step 2</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Unzip & run the frontend.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            Extract the provided zip, install dependencies, and start the dev server.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          <StepCard number="01" title="Unzip the project">
            <CodeBlock>{`unzip ide.zip`}</CodeBlock>
          </StepCard>

          <StepCard number="02" title="Install dependencies">
            <CodeBlock>{`cd invariant-ide-frontend/frontend\nnpm install`}</CodeBlock>
          </StepCard>

          <StepCard number="03" title="Start the dev server">
            <CodeBlock>{`npm run dev`}</CodeBlock>
          </StepCard>

          <div className="relative rounded-xl border border-emerald-200/60 bg-emerald-50/30 px-6 sm:px-8 py-4 sm:py-5">
            <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-500/70 font-medium">Result</span>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
              Frontend live at <strong className="text-emerald-600 font-medium">http://localhost:5173</strong>
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 6: Backend Setup ── */
  {
    id: 'run-backend',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Backend Setup</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Deploy the backend locally.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            Create a virtual environment, install requirements, and start the server.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          <StepCard number="01" title="Create a Python virtual environment">
            <CodeBlock>{`cd invariant-ide-frontend/backend\npython3 -m venv venv\nsource venv/bin/activate   # macOS / Linux\n# venv\\Scripts\\activate    # Windows`}</CodeBlock>
          </StepCard>

          <StepCard number="02" title="Install dependencies">
            <CodeBlock>{`pip install -r requirements.txt`}</CodeBlock>
          </StepCard>

          <StepCard number="03" title="Start the backend server">
            <CodeBlock>{`PYTHONPATH=. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`}</CodeBlock>
          </StepCard>

          <div className="relative rounded-xl border border-emerald-200/60 bg-emerald-50/30 px-6 sm:px-8 py-4 sm:py-5">
            <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-emerald-500/70 font-medium">Result</span>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
              Backend API live at <strong className="text-emerald-600 font-medium">http://localhost:8000</strong>
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 7: Helion-512 Model via Docker ── */
  {
    id: 'helion-512',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Model Setup</SlideLabel>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 max-w-4xl">
            Helion-512 via Docker.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-ink/50 mb-10 sm:mb-14 max-w-2xl">
            The Helion-512 model ships as a Docker image — same React frontend, Python backend with the model hosted on it.
          </p>
        </div>

        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          <StepCard number="01" title="Build the Docker image">
            <CodeBlock>{`docker build -t helion-512 .`}</CodeBlock>
          </StepCard>

          <StepCard number="02" title="Run the container">
            <CodeBlock>{`docker run -d -p 8000:8000 --name helion-512 helion-512`}</CodeBlock>
          </StepCard>

          <StepCard number="03" title="Verify it's running">
            <CodeBlock>{`docker ps\ncurl http://localhost:8000/health`}</CodeBlock>
          </StepCard>

          <div className="relative rounded-xl border border-ink/10 bg-ink/[0.02] px-6 sm:px-8 py-4 sm:py-5">
            <div className="absolute -top-3 left-6 sm:left-8 bg-white px-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-ink/35 font-medium">Note</span>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/55 text-center">
              The Docker image bundles the <strong className="text-ink/80 font-medium">React frontend + Python backend + Helion-512 model</strong> — no separate setup needed.
            </p>
          </div>
        </div>
      </SlideShell>
    ),
  },

  /* ── Slide 8: Questions ── */
  {
    id: 'questions',
    render: () => (
      <SlideShell>
        <div className="flex flex-col items-center text-center">
          <SlideLabel>Next Steps</SlideLabel>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.03em] text-ink mb-6 sm:mb-8">
            Questions?
          </h2>
          <p className="font-mono text-sm sm:text-base text-ink/50 leading-relaxed max-w-xl mb-8 sm:mb-10">
            Start building your workflow.
          </p>
          <div className="flex flex-col items-center gap-4 mb-8 sm:mb-12">
            <a
              href="mailto:founders@invariant-ai.com?subject=InTomes Technical Setup"
              className="font-mono text-sm tracking-[0.1em] uppercase bg-ink text-white px-8 py-3.5 rounded hover:bg-ink/90 transition-colors"
            >
              founders@invariant-ai.com
            </a>
            <span className="font-mono text-xs text-ink/35">invariant-ai.com</span>
          </div>
        </div>
      </SlideShell>
    ),
  },
]

export default function IntomesDeck() {
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

  const goNext = useCallback(() => go(current + 1), [go, current])
  const goPrev = useCallback(() => go(current - 1), [go, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
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
  }, [goNext, goPrev, go, total])

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
        if (dx < 0) goNext()
        else goPrev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goNext, goPrev])

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

      {current > 0 && (
        <button
          onClick={goPrev}
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
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-ink/25 hover:bg-white transition-all shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-sm border-t border-ink/[0.04]">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-ink/25 font-medium">
          Invariant × InTomes
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
