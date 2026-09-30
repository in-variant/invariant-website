import { useState, type CSSProperties } from 'react'
import lines from './brand-heading-lines.json'
import './BrandHeading.css'

/** Reuses the original DIN outlines while retaining real heading text. */
export default function BrandHeading({ names }: { names: (keyof typeof lines)[] }) {
  return <span className="brand-heading">{names.map(name => <HeadingLine key={name} name={name} />)}</span>
}

function HeadingLine({ name }: { name: keyof typeof lines }) {
  const line = lines[name]
  const [loaded, setLoaded] = useState(false)
  return <span className={`brand-heading-line${loaded ? ' is-loaded' : ''}`}
    data-heading-line data-outline-bounds={JSON.stringify(line.bounds)} data-outline-width={line.width}
    style={{ '--line-width': `${line.width / line.fontSize}em`, '--line-height': `${line.height / line.fontSize}em` } as CSSProperties}>
    <span className="brand-heading-text">{line.text}</span>
    <img src={`/figma/type/brand/${name}.svg`} width={line.width} height={line.height} alt="" aria-hidden="true"
      onLoad={() => setLoaded(true)} onError={() => setLoaded(false)} />
  </span>
}
