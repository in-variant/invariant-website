import { Link, useLocation } from 'react-router-dom'
import FigmaScrambleLabel from './FigmaScrambleLabel'
import './CareersCallout.css'

export default function CareersCallout() {
  const { pathname } = useLocation()
  if (pathname === '/careers') return null

  return <aside className="careers-callout" aria-label="Careers at Invariant">
    <div className="careers-callout-copy">
      <p><span aria-hidden="true" />Careers at Invariant</p>
      <h2>Join the founding team.</h2>
    </div>
    <Link className="careers-callout-role" to="/careers">
      <span><FigmaScrambleLabel>Founding Engineer</FigmaScrambleLabel><small>San Francisco · On-site · Full time</small></span>
      <span className="careers-callout-arrow" aria-hidden="true">↗</span>
    </Link>
  </aside>
}
