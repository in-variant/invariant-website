import { Link } from 'react-router-dom'
import { SiteBrand } from './Nav'
import FigmaScrambleLabel from './FigmaScrambleLabel'

const columns = [
  { title: 'Platform', links: [['Overview', '/product'], ['Space', '/space-compliance'], ['Nuclear', '/nuclear-compliance'], ['Data Centers', '/data-center-compliance'], ['Oil & Gas', '/oil-gas-compliance'], ['Security', '/trust'], ['Talk to an expert', '/contact']] },
  { title: 'Resources', links: [['All resources', '/resources'], ['Field notes', '/blog'], ['Research', '/research'], ['Regulatory guides', '/compliance'], ['Tools & calculators', '/calculators']] },
  { title: 'Invariant', links: [['Why we exist', '/charter'], ['Our team', '/about'], ['Get in touch', '/contact'], ['Careers ↗', 'mailto:founders@invariant-ai.com?subject=Careers%20at%20Invariant']] },
]

export default function Footer() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-grid">
        <div className="site-footer-brand"><SiteBrand /><p>Autonomous agents for<br />mission-critical compliance.</p><a href="mailto:founders@invariant-ai.com" className="site-footer-email">founders@invariant-ai.com ↗</a></div>
        {columns.map(column => <nav key={column.title} aria-label={column.title}><h2>{column.title}</h2><ul>{column.links.map(([label, href]) => <li key={href}>{href.startsWith('mailto:') ? <a href={href}>{label}</a> : <Link to={href}><FigmaScrambleLabel>{label}</FigmaScrambleLabel></Link>}</li>)}</ul></nav>)}
      </div>
      <div className="site-footer-bottom"><p>© {new Date().getFullYear()} Invariant. All rights reserved.</p><div><Link to="/trust">Security &amp; trust</Link><a href="mailto:founders@invariant-ai.com?subject=Privacy%20policy%20request">Privacy</a></div></div>
    </div>
  </footer>
}
