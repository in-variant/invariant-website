import { useState, type CSSProperties, type ReactNode } from 'react'
import './FigmaType.css'
import { figmaTypeLines } from './figma-type-lines'

const dimensions = {
  '6386': [633, 160], '6424': [1068, 208], '6471': [580, 104],
  '6532': [580, 104], '6812': [316, 104], '6612': [341, 104],
  '6712': [739, 152], '6479': [99, 34], '6489': [123, 34],
  '6501': [196, 34], '6510': [126, 34], '6562': [424, 34],
  '6570': [251, 34], '6538': [410, 34], '6545': [320, 34],
  '6818': [186, 68], '6845': [333, 68], '6620': [249, 68],
  '6671': [249, 68], '6675': [212, 68],
} as const

/** Exact designer-supplied outlines; the semantic, selectable text is retained.
 * On small screens live type reflows to fit rather than scaling a desktop frame.
 */
export default function FigmaType({ node, children }: { node: keyof typeof dimensions; children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [width, height] = dimensions[node]
  return <span className={`figma-type ${loaded ? 'is-loaded' : ''}`} data-figma-lines={JSON.stringify(figmaTypeLines[node])} data-figma-width={width} style={{ '--type-width': width, '--type-height': height } as CSSProperties}>
    <span className="figma-type-live">{children}</span>
    <img className="figma-type-art" src={`/figma/type/398-${node}.svg`} width={width} height={height} alt="" aria-hidden="true" onLoad={() => setLoaded(true)} onError={() => setLoaded(false)} />
  </span>
}
