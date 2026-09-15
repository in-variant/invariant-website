import { useLayoutEffect, useRef } from 'react'
import { DitherPalettePass } from './ditherPalette'
import './DitherTint.css'

type DitherTintProps = {
  src: string
  crop: { width: number; height: number; left: number; top: number }
  active: boolean
}

const images = new Map<string, Promise<HTMLImageElement | null>>()
const loadImage = (src: string) => {
  if (!images.has(src)) images.set(src, new Promise(resolve => {
    const image = new Image(); image.crossOrigin = 'anonymous'; image.decoding = 'async'
    image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = src
  }))
  return images.get(src)!
}

/** Static artwork uses the same palette field as the live morph renderer. */
export default function DitherTint({ src, crop, active }: DitherTintProps) {
  const rootRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active); const updateRef = useRef<(value: boolean) => void>(() => {})
  activeRef.current = active
  const cropKey = JSON.stringify(crop)

  useLayoutEffect(() => {
    const root = rootRef.current; const canvas = canvasRef.current
    if (!root || !canvas) return
    const bounds = JSON.parse(cropKey) as DitherTintProps['crop']
    const pass = new DitherPalettePass(canvas, state => {
      root.dataset.visible = String(state.visible); root.dataset.tintState = state.state
      root.dataset.progress = state.progress.toFixed(4)
      if (state.phase >= 0) root.dataset.phase = String(state.phase)
      else delete root.dataset.phase
    })
    let disposed = false; let revision = 0; let width = 0; let height = 0
    const prepare = async () => {
      const rect = root.getBoundingClientRect(); const density = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.round(rect.width * density)); const nextHeight = Math.max(1, Math.round(rect.height * density))
      if (width === nextWidth && height === nextHeight) return
      const token = ++revision; const image = await loadImage(src)
      if (disposed || token !== revision || !image) return
      width = nextWidth; height = nextHeight
      const surface = document.createElement('canvas'); surface.width = width; surface.height = height
      // Static sprite CSS stretches to these bounds; its original crop is retained.
      surface.getContext('2d')!.drawImage(image, width * bounds.left / 100, height * bounds.top / 100, width * bounds.width / 100, height * bounds.height / 100)
      pass.setSource(surface, density, revision); pass.setActive(activeRef.current)
    }
    updateRef.current = value => { pass.setActive(value) }
    const resize = new ResizeObserver(() => { void prepare() }); resize.observe(root)
    const intersection = new IntersectionObserver(entries => { pass.setVisible(entries[0].isIntersecting) }, { rootMargin: '80px' }); intersection.observe(root)
    void prepare()
    return () => {
      disposed = true; revision += 1; resize.disconnect(); intersection.disconnect(); pass.destroy(); updateRef.current = () => {}
    }
  }, [src, cropKey])

  useLayoutEffect(() => { updateRef.current(active) }, [active])
  return <div ref={rootRef} className="dither-tint" aria-hidden="true" data-visible="false"><canvas ref={canvasRef} className="dither-tint__canvas" /></div>
}
