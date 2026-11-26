import { useCallback, useState } from 'react'
import { datasetCitationPath } from '../data/datasetCitationPath.mjs'
import type { ArchivedDatasetRelease } from '../data/industryArticles'
import './DatasetCitation.css'

export default function DatasetCitation({ name, datePublished, url, archivedRelease, onDemand = false }: {
  name: string
  datePublished: string
  url: string
  archivedRelease?: ArchivedDatasetRelease
  onDemand?: boolean
}) {
  const [message, setMessage] = useState('')
  const [showCopy, setShowCopy] = useState(!onDemand)
  const activateOpenCitation = useCallback((disclosure: HTMLDetailsElement | null) => {
    if (disclosure?.open) setShowCopy(true)
  }, [])
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
    <details className="dataset-citation"
      ref={onDemand ? activateOpenCitation : undefined}
      onToggle={onDemand ? event => activateOpenCitation(event.currentTarget) : undefined}>
      <summary>Cite dataset</summary>
      <div className="dataset-citation-panel">
        <p>{reference} <a href={url}>{url}</a></p>
        {archivedRelease && <p><a href={archivedRelease.url}>Archived release v{archivedRelease.version}</a> · {archivedRelease.datePublished}</p>}
        <div className="dataset-citation-actions">
          {showCopy && <>
            <button type="button" onClick={() => copy(`${reference} ${url}`, 'Citation copied')}>Copy citation</button>
            <button type="button" onClick={() => copy(url, 'Dataset link copied')}>Copy dataset link</button>
          </>}
          <a href={datasetCitationPath(url)} download>Download citation (CSL JSON)</a>
          {showCopy && <span role="status">{message}</span>}
        </div>
      </div>
    </details>
  )
}
