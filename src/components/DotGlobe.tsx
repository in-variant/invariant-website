import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import landTopology from 'world-atlas/land-110m.json'

const land = feature(landTopology as unknown as Topology, landTopology.objects.land as GeometryCollection)
const COLS = 153
const SAMPLE_PALETTE = [[255, 255, 255], [190, 138, 255], [255, 175, 80]]
const clamp = (n: number, low = 0, high = 1) => Math.max(low, Math.min(high, n))
const smooth = (n: number) => { const x = clamp(n); return x * x * (3 - 2 * x) }

/** Geographic land moves behind a stationary dot grid, with short luminance trails. */
export default function DotGlobe({ className, landColor = '#fff', coastColor = '#be8aff' }: {
  className: string
  landColor?: string
  coastColor?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    const source = document.createElement('canvas')
    source.width = source.height = 720
    const sourceContext = source.getContext('2d')!
    const sample = document.createElement('canvas')
    const sampleContext = sample.getContext('2d', { willReadFrequently: true })!
    const projection = geoOrthographic().scale(720 / 2 * .92).translate([360, 360]).clipAngle(90)
    const path = geoPath(projection, sourceContext)
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const events = new AbortController()
    let width = 1, height = 1, rows = 1, ratio = 1, raf = 0, last = 0
    // Open at the equator with north upright and the Atlantic continents in view.
    // Start at the normal rotation speed so the loader cannot hide this framing.
    let longitude = -25, tilt = 0, velocity = 0
    let paused = false, visible = true, disposed = false
    let pointer: { id: number; x: number; y: number; at: number; dx: number } | null = null
    let response = new Float32Array(0), error = new Float32Array(0)

    function draw(now: number) {
      raf = 0
      if (disposed || document.hidden || !visible) return
      const delta = Math.min(50, now - (last || now - 16.67)); last = now
      if (!pointer && !preference.matches && !paused) {
        longitude += (6 + velocity) * delta / 1000
        velocity *= Math.pow(.5, delta / 450)
        if (Math.abs(velocity) < .4) velocity = 0
      }
      sampleContext.clearRect(0, 0, COLS, rows)
      projection.rotate([-longitude, -tilt])
      sourceContext.clearRect(0, 0, 720, 720)
      sourceContext.beginPath(); path({ type: 'Sphere' })
      sourceContext.fillStyle = '#000'; sourceContext.fill()
      sourceContext.beginPath(); path(land)
      sourceContext.fillStyle = '#fff'; sourceContext.fill()
      const size = Math.min(COLS, rows)
      sampleContext.drawImage(source, (COLS - size) / 2, (rows - size) / 2, size, size)
      const pixels = sampleContext.getImageData(0, 0, COLS, rows).data
      const attack = preference.matches ? 1 : 1 - Math.exp(-delta / 42)
      const decay = preference.matches ? 1 : 1 - Math.exp(-delta / 643)
      const pitchX = width / COLS, pitchY = height / rows, radius = Math.min(pitchX, pitchY) * .425
      const batches = Array.from({ length: 3 }, () => Array.from({ length: 9 }, () => new Path2D()))
      error.fill(0)
      for (let y = 0; y < rows; y++) {
        const direction = y % 2 ? -1 : 1
        for (let step = 0; step < COLS; step++) {
          const x = direction === 1 ? step : COLS - step - 1
          const i = y * COLS + x
          const luminance = Math.pow(clamp((pixels[i * 4] / 255 - .5) * 2.98 + .49), 1 / 1.88)
          const raw = clamp(luminance - .05) + error[i]
          const quantized = clamp(Math.round(raw * 3) / 3)
          const remainder = raw - quantized
          for (const [dx, dy, weight] of [[1, 0, 7 / 16], [-1, 1, 3 / 16], [0, 1, 5 / 16], [1, 1, 1 / 16]]) {
            const nx = x + dx * direction, ny = y + dy
            if (nx >= 0 && nx < COLS && ny < rows) error[ny * COLS + nx] += remainder * weight
          }
          const target = pixels[i * 4 + 3] >= 128 ? quantized : 0
          response[i] += (target - response[i]) * (target > response[i] ? attack : decay)
          const alpha = Math.round(smooth((response[i] - .48) / .04) * 8)
          if (!alpha) continue
          // Keep luminance classification independent of the brand palette.
          // Recoloring the dots must not change the land silhouette or trails.
          let paletteIndex = 0, nearest = Infinity
          SAMPLE_PALETTE.forEach((color, index) => {
            const grey = luminance * 255
            const distance = .3 * (grey - color[0]) ** 2 + .59 * (grey - color[1]) ** 2 + .11 * (grey - color[2]) ** 2
            if (distance < nearest) { nearest = distance; paletteIndex = index }
          })
          if (paletteIndex === 2) continue
          const batch = batches[paletteIndex][alpha]
          const cx = (x + .5) * pitchX, cy = (y + .5) * pitchY
          batch.moveTo(cx + radius, cy); batch.arc(cx, cy, radius, 0, Math.PI * 2)
        }
      }
      context.clearRect(0, 0, width, height)
      for (let color = 0; color < 2; color++) {
        context.fillStyle = color === 0 ? landColor : coastColor
        for (let opacity = 1; opacity <= 8; opacity++) {
          context.globalAlpha = opacity / 8; context.fill(batches[color][opacity])
        }
      }
      context.globalAlpha = 1
      canvas.dataset.longitude = longitude.toFixed(2)
      canvas.dataset.tilt = tilt.toFixed(2)
      canvas.dataset.ready = 'true'
      if ((!preference.matches && !paused) || pointer) raf = requestAnimationFrame(draw)
    }

    function wake() {
      if (!raf && !disposed && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(draw) }
    }
    function resize() {
      width = canvas.clientWidth; height = canvas.clientHeight
      if (!width || !height) return
      ratio = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const nextRows = Math.max(2, Math.round(COLS * height / width))
      if (nextRows !== rows || !response.length) {
        rows = nextRows; sample.width = COLS; sample.height = rows
        response = new Float32Array(COLS * rows); error = new Float32Array(COLS * rows)
      }
      wake()
    }
    const observer = new ResizeObserver(resize); observer.observe(canvas); observer.observe(canvas.parentElement!)
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake() })
    visibility.observe(canvas)
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return
      event.preventDefault(); canvas.focus({ preventScroll: true })
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now(), dx: 0 }
      velocity = 0; canvas.setPointerCapture(event.pointerId); canvas.dataset.dragging = 'true'; wake()
    }, { signal: events.signal })
    canvas.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return
      const now = performance.now(), scale = Math.max(1, Math.min(width, height))
      const dx = (event.clientX - pointer.x) / scale, dy = (event.clientY - pointer.y) / scale
      const turn = -dx * 115 / .92
      longitude += turn; tilt = clamp(tilt + dy * 115 / .92, -90, 90)
      if (now - pointer.at > 4) velocity = clamp(turn / ((now - pointer.at) / 1000), -900, 900)
      pointer = { ...pointer, x: event.clientX, y: event.clientY, at: now, dx }; wake()
    }, { signal: events.signal })
    const release = () => {
      if (!pointer) return
      if (Math.abs(pointer.dx) < .0015 || performance.now() - pointer.at > 120) velocity = 0
      pointer = null; canvas.dataset.dragging = 'false'; wake()
    }
    canvas.addEventListener('pointerup', release, { signal: events.signal })
    canvas.addEventListener('pointercancel', release, { signal: events.signal })
    canvas.addEventListener('lostpointercapture', release, { signal: events.signal })
    canvas.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); paused = !paused; velocity = 0; wake() }
      if (event.key.startsWith('Arrow')) {
        event.preventDefault(); velocity = 0
        if (event.key === 'ArrowLeft') longitude -= 8
        if (event.key === 'ArrowRight') longitude += 8
        if (event.key === 'ArrowUp') tilt = clamp(tilt - 8, -90, 90)
        if (event.key === 'ArrowDown') tilt = clamp(tilt + 8, -90, 90)
        wake()
      }
    }, { signal: events.signal })
    preference.addEventListener('change', () => { velocity = 0; wake() }, { signal: events.signal })
    document.addEventListener('visibilitychange', wake, { signal: events.signal })
    resize()
    return () => { disposed = true; cancelAnimationFrame(raf); events.abort(); observer.disconnect(); visibility.disconnect() }
  }, [landColor, coastColor])

  return <canvas ref={canvasRef} className={className} data-lenis-prevent-touch tabIndex={0} role="img" aria-label="Rotating dot globe. Drag to rotate. Use arrow keys to turn, or space to pause." />
}
