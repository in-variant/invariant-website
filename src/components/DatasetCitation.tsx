import { useState } from 'react'
import './DatasetCitation.css'

export default function DatasetCitation({ name, datePublished, url }: { name: string; datePublished: string; url: string }) {
  const [message, setMessage] = useState('')
  const reference = `Invariant (${datePublished.slice(0, 4)}). ${name} [Data set].`

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${reference} ${url}`)
      setMessage('Citation copied')
    } catch {
      setMessage('Select the citation text to copy it.')
    }
  }

  return (
    <details className="dataset-citation">
      <summary>Cite dataset</summary>
      <div className="dataset-citation-panel">
        <p>{reference} <a href={url}>{url}</a></p>
        <div className="dataset-citation-actions">
          <button type="button" onClick={copy}>Copy citation</button>
          <span role="status">{message}</span>
        </div>
      </div>
    </details>
  )
}
