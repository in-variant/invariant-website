import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import product from '../data/earth-product.json'
import { ResourceArrow } from './ResourceCards'

export default function EarthAgentSetup({ linkToOverview = false }: { linkToOverview?: boolean }) {
  const [ready, setReady] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')

  useEffect(() => setReady(true), [])

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(product.setupPrompt)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
  }
  return (
    <div className="earth-agent-setup">
      <div>
        <h2>Use Earth in your coding agent</h2>
        {linkToOverview && (
          <div className="earth-agent-setup-links">
            <a href={product.links.mcp}>MCP setup instructions <ResourceArrow diagonal /></a>
            <Link to="/mcp">MCP server overview <ResourceArrow diagonal /></Link>
          </div>
        )}
      </div>
      <button type="button" className="earth-product-button earth-product-button-outline" disabled={!ready} onClick={copyPrompt}>
        {copyState === 'copied' ? 'Prompt copied' : 'Copy setup prompt'}
      </button>
      <p role="status" className="sr-only">
        {copyState === 'copied' ? 'Paste the setup prompt into your coding agent.' : ''}
      </p>
      {copyState === 'manual' && (
        <label>
          Select and copy the setup prompt.
          <textarea aria-label="Agent setup prompt" readOnly value={product.setupPrompt} rows={5} onFocus={event => event.currentTarget.select()} />
        </label>
      )}
    </div>
  )
}
