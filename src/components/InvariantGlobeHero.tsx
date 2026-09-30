import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Nav'
import DotGlobe from './DotGlobe'
import FigmaScrambleLabel from './FigmaScrambleLabel'
import BlockReveal from './BlockReveal'
import HeroEngineering from './HeroEngineering'
import './InvariantGlobeHero.css'

const revealGradient = ['#fb4d03', '#fffaf2', '#80a8c6', '#071b35']

export default function InvariantGlobeHero() {
  const [introComplete, setIntroComplete] = useState(false)
  const finishIntro = useCallback(() => setIntroComplete(true), [])
  return <section className="invariant-globe-hero" aria-labelledby="figma-hero-title">
    <HeroEngineering onComplete={finishIntro} />
    <Nav />
    <div className="globe-hero-layout">
      <div className="globe-hero-content">
        <div className="globe-hero-copy">
          <BlockReveal as="h1" id="figma-hero-title" gradient={revealGradient} enabled={introComplete} entrance="swift" lineStagger={.34}>
            <span className="globe-hero-line">The compliance layer</span>{' '}
            <span className="globe-hero-line">for the physical economy.</span>
          </BlockReveal>
          <p className="globe-hero-description">Autonomous agents for compliance.</p>
          <div className="globe-hero-actions">
            <Link className="globe-hero-button globe-hero-button-primary" to="/contact"><FigmaScrambleLabel>Start your mission</FigmaScrambleLabel><span aria-hidden="true">↗</span></Link>
            <a className="globe-hero-button globe-hero-button-secondary" href="#platform"><FigmaScrambleLabel>Explore Invariant</FigmaScrambleLabel><span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="globe-hero-backers">
          <p className="globe-hero-eyebrow">Backed by</p>
          <div className="globe-hero-backers-logos" role="list" aria-label="Our backers">
            <div className="globe-hero-backer globe-hero-backer-ef" role="listitem">
              <img className="globe-hero-backer-logo" src="/logos/backers/entrepreneurs-first.svg" alt="Entrepreneur First" width="174" height="12" />
            </div>
            <div className="globe-hero-backer globe-hero-backer-transpose" role="listitem">
              <img className="globe-hero-backer-logo" src="/logos/backers/transpose-platform.svg" alt="Transpose Platform" width="249" height="32" />
            </div>
            <div className="globe-hero-backer globe-hero-backer-boundless" role="listitem">
              <svg className="globe-hero-backer-logo globe-hero-backer-provided" viewBox="190 268 633 136" role="img" aria-label="Boundless Ventures">
                <defs>
                  <filter id="backer-boundless-invert" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="-1" intercept="1" /><feFuncG type="linear" slope="-1" intercept="1" /><feFuncB type="linear" slope="-1" intercept="1" /></feComponentTransfer></filter>
                  <mask id="backer-boundless-ink" maskUnits="userSpaceOnUse" x="190" y="268" width="633" height="136" style={{ maskType: 'luminance' }}><image href="/logos/backers/boundless-provided.png" width="1012" height="675" filter="url(#backer-boundless-invert)" /></mask>
                </defs>
                <path d="M190 268h633v136H190z" fill="white" mask="url(#backer-boundless-ink)" />
              </svg>
            </div>
            <div className="globe-hero-backer globe-hero-backer-npu" role="listitem">
              <img className="globe-hero-backer-logo globe-hero-backer-provided" src="/logos/backers/npu-provided.svg" alt="NPU Ventures" width="168" height="58" />
            </div>
          </div>
        </div>
      </div>
      <div className="globe-hero-visual">
        <DotGlobe className="globe-hero-canvas" landColor="#ffffff" coastColor="#809aee" />
      </div>
    </div>
  </section>
}
