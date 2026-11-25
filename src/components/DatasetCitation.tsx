import { useState } from 'react'
import { datasetCitationPath } from '../data/datasetCitationPath.mjs'
import './DatasetCitation.css'

export default function DatasetCitation({ name, datePublished, url }: { name: string; datePublished: string; url: string }) {
  const [message, setMessage] = useState('')
  const reference = `Invariant (${datePublished.slice(0, 4)}). ${name} [Data set].`

  async function copy(value: string, confirmation: string) {
    try {
      await navigator.clipboard.writeText(value)
      setMessage(confirmation)
    } catch {
      setMessage('Select the citation or link above to copy it.')
    }
  }

  return (
    <details className="dataset-citation">
      <summary>Cite dataset</summary>
      <div className="dataset-citation-panel">
        <p>{reference} <a href={url}>{url}</a></p>
        <div className="dataset-citation-actions">
          <button type="button" onClick={() => copy(`${reference} ${url}`, 'Citation copied')}>Copy citation</button>
          <button type="button" onClick={() => copy(url, 'Dataset link copied')}>Copy dataset link</button>
          <a href={datasetCitationPath(url)} download>Download citation (CSL JSON)</a>
          <span role="status">{message}</span>
        </div>
      </div>
    </details>
  )
}
