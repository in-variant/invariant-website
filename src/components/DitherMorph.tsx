import { useLayoutEffect, useRef } from 'react'
import { DitherPalettePass } from './ditherPalette'
import './DitherMorph.css'

export type DitherMorphFrame = {
  src: string
  /** Image bounds as percentages of the artwork viewport. */
  crop?: { width: number; height: number; left: number; top: number }
}
type DitherMorphProps = {
  frames: DitherMorphFrame[]
  active: number
  /** Continuous frame position. When supplied, scroll controls every rendered point. */
  position?: number
  tintActive?: boolean
  className?: string
}
type Surface = HTMLCanvasElement
type InkPoint = {
  x: number; y: number; r: number; g: number; b: number; alpha: number; size: number
  pivotX: number; pivotY: number; vx: number; vy: number
}
type Cloud = { points: InkPoint[]; top: number; bottom: number }
type Track = {
  start: InkPoint; end: InkPoint; c1x: number; c1y: number; c2x: number; c2y: number
  delay: number; span: number
}
type Flight = { tracks: Track[]; current: InkPoint[]; interrupted: boolean }
type ScrubPair = { source: Surface | null; destination: Surface | null; flight: Flight }

const DURATION = 1160
const POINT_COUNT = 8192
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const bound = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

/** Adjacent ranks follow a continuous spatial path through the actual silhouette. */
function hilbertOrder(px: number, py: number, width: number, height: number) {
  let x = Math.round(clamp(px / width) * 511)
  let y = Math.round(clamp(py / height) * 511)
  let order = 0
  for (let scale = 256; scale > 0; scale >>= 1) {
    const rx = (x & scale) ? 1 : 0
    const ry = (y & scale) ? 1 : 0
    order += scale * scale * ((3 * rx) ^ ry)
    if (!ry) {
      if (rx) { x = scale - 1 - x; y = scale - 1 - y }
      const previousX = x; x = y; y = previousX
    }
  }
  return order
}

function createCloud(surface: Surface, width: number, height: number): Cloud {
  const sampler = document.createElement('canvas')
  const ratio = Math.min(1.5, 512 / Math.max(width, height))
  sampler.width = Math.max(1, Math.round(width * ratio))
  sampler.height = Math.max(1, Math.round(height * ratio))
  const painter = sampler.getContext('2d', { willReadFrequently: true })!
  painter.drawImage(surface, 0, 0, sampler.width, sampler.height)
  let pixels: Uint8ClampedArray
  try { pixels = painter.getImageData(0, 0, sampler.width, sampler.height).data }
  catch { return { points: [], top: 0, bottom: height } }
  const candidates: Array<{ x: number; y: number; offset: number; weight: number; order: number }> = []
  let totalWeight = 0
  for (let y = 0; y < sampler.height; y += 1) {
    for (let x = 0; x < sampler.width; x += 1) {
      const offset = (y * sampler.width + x) * 4
      const alpha = pixels[offset + 3] / 255
      const ink = 1 - Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]) / 255
      if (alpha < .08 || ink < .09) continue
      const px = (x + .5) / sampler.width * width
      const py = (y + .5) / sampler.height * height
      const weight = alpha * (.4 + .6 * ink)
      totalWeight += weight
      candidates.push({ x: px, y: py, offset, weight, order: hilbertOrder(px, py, width, height) })
    }
  }
  if (!candidates.length) return { points: [], top: 0, bottom: height }
  candidates.sort((a, b) => a.order - b.order)
  // Equal-mass strata retain fine edges and denser blue planes. Every point is ink.
  const pixelArea = width * height / (sampler.width * sampler.height)
  const size = Math.max(.55, Math.min(2.5, Math.sqrt(candidates.length * pixelArea / POINT_COUNT) * .93))
  const points: InkPoint[] = []
  let cursor = 0; let cumulative = candidates[0].weight
  let left = width; let right = 0; let top = height; let bottom = 0
  for (let index = 0; index < POINT_COUNT; index += 1) {
    const mass = (index + .5) / POINT_COUNT * totalWeight
    while (cumulative < mass && cursor < candidates.length - 1) cumulative += candidates[++cursor].weight
    const candidate = candidates[cursor]
    const fractional = (mass - cumulative + candidate.weight) / candidate.weight - .5
    const x = candidate.x + fractional * width / sampler.width * .35
    const y = candidate.y; const offset = candidate.offset
    points.push({ x, y, r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2], alpha: pixels[offset + 3] / 255, size, pivotX: 0, pivotY: 0, vx: 0, vy: 0 })
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y)
  }
  const clusters = Array.from({ length: 16 }, () => ({ x: 0, y: 0, count: 0 }))
  const clusterFor = (point: InkPoint) => Math.min(3, Math.floor((point.x - left) / Math.max(1, right - left) * 4))
    + Math.min(3, Math.floor((point.y - top) / Math.max(1, bottom - top) * 4)) * 4
  points.forEach(point => { const cluster = clusters[clusterFor(point)]; cluster.x += point.x; cluster.y += point.y; cluster.count += 1 })
  points.forEach(point => { const cluster = clusters[clusterFor(point)]; point.pivotX = cluster.x / cluster.count; point.pivotY = cluster.y / cluster.count })
  return { points, top, bottom }
}

function makeFlight(source: InkPoint[], destination: Cloud, width: number, height: number, interrupted: boolean): Flight {
  let starts = source.map(point => ({ ...point }))
  let ends = destination.points
  if (!starts.length && ends.length) {
    // Entrances expand this image's own component shapes, never an arbitrary cloud.
    starts = ends.map(point => ({ ...point, x: point.x + bound((point.x - point.pivotX) * .13, 9), y: point.y + bound((point.y - point.pivotY) * .13, 9) + 3, alpha: 0 }))
  }
  if (!ends.length && starts.length) {
    ends = starts.map(point => ({ ...point, x: point.x + bound((point.x - point.pivotX) * .13, 9), y: point.y + bound((point.y - point.pivotY) * .13, 9) - 3, alpha: 0 }))
  }
  if (!starts.length || !ends.length) return { tracks: [], current: [], interrupted }
  if (interrupted) starts = starts.map(point => ({ point, rank: hilbertOrder(point.x, point.y, width, height) })).sort((a, b) => a.rank - b.rank).map(item => item.point)
  const matches = ends.map((_, index) => index)
  // Match equal-mass regions recursively. A plane stays a connected plane as it
  // changes shape, instead of crossing an unrelated region of the illustration.
  const partition = (sourceIndices: number[], targetIndices: number[]) => {
    if (sourceIndices.length === 1) { matches[sourceIndices[0]] = targetIndices[0]; return }
    let left = width; let right = 0; let top = height; let bottom = 0
    for (let index = 0; index < sourceIndices.length; index += 1) {
      const start = starts[sourceIndices[index]]; const end = ends[targetIndices[index]]
      left = Math.min(left, start.x, end.x); right = Math.max(right, start.x, end.x)
      top = Math.min(top, start.y, end.y); bottom = Math.max(bottom, start.y, end.y)
    }
    const axis = right - left > bottom - top ? 'x' : 'y'
    sourceIndices.sort((a, b) => starts[a][axis] - starts[b][axis])
    targetIndices.sort((a, b) => ends[a][axis] - ends[b][axis])
    const middle = sourceIndices.length >> 1
    partition(sourceIndices.slice(0, middle), targetIndices.slice(0, middle))
    partition(sourceIndices.slice(middle), targetIndices.slice(middle))
  }
  partition(starts.map((_, index) => index), ends.map((_, index) => index))
  const distance = (a: InkPoint, b: InkPoint) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2
  // Local transport refinement shortens paths without breaking spatial neighborhoods.
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let index = 0; index + stride < starts.length; index += 1) {
      const neighbor = index + stride; const a = ends[matches[index]]; const b = ends[matches[neighbor]]
      if (distance(starts[index], b) + distance(starts[neighbor], a) + .01 < distance(starts[index], a) + distance(starts[neighbor], b)) {
        const previous = matches[index]; matches[index] = matches[neighbor]; matches[neighbor] = previous
      }
    }
  }
  const tracks = starts.map((start, index): Track => {
    const end = { ...ends[matches[index]] }; const dx = end.x - start.x; const dy = end.y - start.y
    const layer = clamp((start.pivotY + end.pivotY) / (height * 2))
    const delay = interrupted ? 0 : .025 + layer * .095; const span = interrupted ? .93 : .9 - delay
    return {
      start, end, delay, span,
      c1x: interrupted ? start.x + bound(start.vx * DURATION * span / 3, width * .055) : start.x + dx / 3 + bound((start.x - start.pivotX) * .075, 6),
      c1y: interrupted ? start.y + bound(start.vy * DURATION * span / 3, height * .055) : start.y + dy / 3 + bound((start.y - start.pivotY) * .075, 6),
      c2x: interrupted ? end.x : end.x - dx / 3 + bound((end.x - end.pivotX) * .075, 6),
      c2y: interrupted ? end.y : end.y - dy / 3 + bound((end.y - end.pivotY) * .075, 6),
    }
  })
  return { tracks, current: starts.map(point => ({ ...point })), interrupted }
}

const colors = new Map<number, string>()
function paintFlight(ctx: CanvasRenderingContext2D, flight: Flight, progress: number, opacity: number, elapsed: number) {
  let lastColor = -1
  for (let index = 0; index < flight.tracks.length; index += 1) {
    const track = flight.tracks[index]; const point = flight.current[index]
    const local = clamp((progress - track.delay) / track.span)
    const t = flight.interrupted ? local : smooth(local); const inverse = 1 - t
    const x = inverse ** 3 * track.start.x + 3 * inverse ** 2 * t * track.c1x + 3 * inverse * t ** 2 * track.c2x + t ** 3 * track.end.x
    const y = inverse ** 3 * track.start.y + 3 * inverse ** 2 * t * track.c1y + 3 * inverse * t ** 2 * track.c2y + t ** 3 * track.end.y
    point.vx = local > 0 ? (x - point.x) / Math.max(1, elapsed) : track.start.vx
    point.vy = local > 0 ? (y - point.y) / Math.max(1, elapsed) : track.start.vy
    point.x = x; point.y = y
    point.r = mix(track.start.r, track.end.r, t); point.g = mix(track.start.g, track.end.g, t); point.b = mix(track.start.b, track.end.b, t)
    point.alpha = mix(track.start.alpha, track.end.alpha, smooth(local)); point.size = mix(track.start.size, track.end.size, t)
    point.pivotX = mix(track.start.pivotX, track.end.pivotX, t); point.pivotY = mix(track.start.pivotY, track.end.pivotY, t)
    if (point.alpha * opacity < .005) continue
    const red = Math.min(255, Math.round(point.r / 8) * 8); const green = Math.min(255, Math.round(point.g / 8) * 8); const blue = Math.min(255, Math.round(point.b / 8) * 8)
    const color = (red << 16) | (green << 8) | blue
    if (color !== lastColor) { if (!colors.has(color)) colors.set(color, `rgb(${red} ${green} ${blue})`); ctx.fillStyle = colors.get(color)!; lastColor = color }
    ctx.globalAlpha = point.alpha * opacity
    ctx.fillRect(x - point.size / 2, y - point.size / 2, point.size, point.size)
  }
  ctx.globalAlpha = 1
}

/** Image-specific point correspondence, with original Figma artwork at rest. */
export default function DitherMorph({ frames, active, position, tintActive = false, className = '' }: DitherMorphProps) {
  const rootRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null)
  const tintCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageRefs = useRef<Array<HTMLImageElement | null>>([])
  const initialIndex = useRef(Math.max(0, Math.min(frames.length - 1, Math.round(position ?? active) || 0)))
  const desiredRef = useRef(active); const requestRef = useRef<(index: number) => void>(() => {})
  const positionRef = useRef(position); const scrubRef = useRef<(value: number) => void>(() => {})
  const tintActiveRef = useRef(tintActive); const tintRequestRef = useRef<(value: boolean) => void>(() => {})
  const framesKey = JSON.stringify(frames); desiredRef.current = active; positionRef.current = position; tintActiveRef.current = tintActive

  useLayoutEffect(() => {
    const root = rootRef.current; const canvas = canvasRef.current; const tintCanvas = tintCanvasRef.current
    if (!root || !canvas || !tintCanvas || !frames.length) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const definitions = JSON.parse(framesKey) as DitherMorphFrame[]
    const normalize = (index: number) => Math.max(0, Math.min(definitions.length - 1, Math.trunc(index) || 0))
    const normalizePosition = (value: number) => Math.max(0, Math.min(definitions.length - 1, Number.isFinite(value) ? value : 0))
    const controlledPosition = () => typeof positionRef.current === 'number' ? normalizePosition(positionRef.current) : undefined
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ready = new Map<string, Promise<HTMLImageElement | null>>()
    const surfaces = new Map<number, Surface>(); const clouds = new Map<number, Cloud>()
    const pairs = new Map<number, ScrubPair>(); const pendingPairs = new Map<number, Promise<ScrubPair | null>>()
    const unavailable = new Set<number>()
    const tintPass = new DitherPalettePass(tintCanvas, state => {
      root.dataset.tintVisible = String(state.visible); root.dataset.tintState = state.state
      root.dataset.tintProgress = state.progress.toFixed(4)
      if (state.phase >= 0) root.dataset.tintPhase = String(state.phase)
      else delete root.dataset.tintPhase
    })
    let disposed = false; let generation = 0; let raf = 0
    let presentationRevision = 0
    let sizeRevision = 0; let warmHandle = 0; let warming = false; let nearView = false; let scrubbing = false
    let width = 0; let height = 0; let density = 1
    let resting = normalize(Math.round(controlledPosition() ?? desiredRef.current)); let target = resting; let queued: number | null = null
    let running = false; let inView = true; let pausedAt = 0; let startedAt = 0; let previousFrameAt = 0
    let sourceDetail: Surface | null = null; let destinationDetail: Surface | null = null; let flight: Flight | null = null
    const load = (src: string) => {
      if (!ready.has(src)) ready.set(src, new Promise(resolve => {
        const image = new Image(); image.crossOrigin = 'anonymous'; image.decoding = 'async'
        image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = src
      }))
      return ready.get(src)!
    }
    definitions.forEach(frame => { void load(frame.src) })
    const settle = (index: number) => {
      cancelAnimationFrame(raf); running = false; pausedAt = 0; resting = target = normalize(index); queued = null
      imageRefs.current.forEach((image, imageIndex) => { if (image) image.style.opacity = imageIndex === resting ? '1' : '0' })
      ctx.clearRect(0, 0, width, height); canvas.style.opacity = '0'
      root.dataset.morphState = 'rest'; root.dataset.frame = String(resting)
      sourceDetail = destinationDetail = null; flight = null
      refreshStillTint()
    }
    const measure = () => {
      const bounds = root.getBoundingClientRect(); const nextWidth = Math.max(1, Math.round(bounds.width)); const nextHeight = Math.max(1, Math.round(bounds.height))
      if (nextWidth === width && nextHeight === height) return false
      width = nextWidth; height = nextHeight; density = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * density); canvas.height = Math.round(height * density)
      ctx.setTransform(density, 0, 0, density, 0, 0)
      sizeRevision += 1; surfaces.clear(); clouds.clear(); pairs.clear(); pendingPairs.clear(); return true
    }
    const makeSurface = (image: HTMLImageElement, index: number) => {
      if (surfaces.has(index)) return surfaces.get(index)!
      const surface = document.createElement('canvas'); surface.width = canvas.width; surface.height = canvas.height
      const painter = surface.getContext('2d')!; painter.setTransform(density, 0, 0, density, 0, 0)
      const crop = definitions[index].crop
      const boxWidth = width * (crop?.width ?? 100) / 100; const boxHeight = height * (crop?.height ?? 100) / 100
      const left = width * (crop?.left ?? 0) / 100; const top = height * (crop?.top ?? 0) / 100
      const scale = Math.max(boxWidth / image.naturalWidth, boxHeight / image.naturalHeight)
      const drawnWidth = image.naturalWidth * scale; const drawnHeight = image.naturalHeight * scale
      painter.save(); painter.beginPath(); painter.rect(left, top, boxWidth, boxHeight); painter.clip()
      painter.drawImage(image, left + (boxWidth - drawnWidth) / 2, top + (boxHeight - drawnHeight) / 2, drawnWidth, drawnHeight)
      painter.restore(); surfaces.set(index, surface); return surface
    }
    const present = (surface: Surface) => { tintPass.setSource(surface, density, ++presentationRevision) }
    const refreshStillTint = () => {
      const index = resting; const surface = surfaces.get(index)
      if (surface) { present(surface); return }
      tintPass.clearSource()
      if (!tintActiveRef.current) return
      void load(definitions[index].src).then(image => {
        if (disposed || !image || resting !== index || root.dataset.morphState !== 'rest') return
        present(makeSurface(image, index))
      })
    }
    const getCloud = (surface: Surface, index: number) => {
      if (!clouds.has(index)) clouds.set(index, createCloud(surface, width, height))
      return clouds.get(index)!
    }
    const preparePair = (index: number): Promise<ScrubPair | null> => {
      if (pairs.has(index)) return Promise.resolve(pairs.get(index)!)
      if (pendingPairs.has(index)) return pendingPairs.get(index)!
      const revision = sizeRevision
      const pending = Promise.all([load(definitions[index].src), load(definitions[index + 1].src)]).then(([sourceImage, destinationImage]) => {
        if (disposed || revision !== sizeRevision) return null
        if (!sourceImage || !destinationImage) {
          if (!sourceImage) unavailable.add(index)
          if (!destinationImage) unavailable.add(index + 1)
          return null
        }
        const source = makeSurface(sourceImage, index); const destination = makeSurface(destinationImage, index + 1)
        const sourceCloud = getCloud(source, index); const destinationCloud = getCloud(destination, index + 1)
        const pair = {
          source: sourceCloud.points.length ? source : null,
          destination: destinationCloud.points.length ? destination : null,
          flight: makeFlight(sourceCloud.points, destinationCloud, width, height, false),
        }
        pairs.set(index, pair); return pair
      }).finally(() => { if (pendingPairs.get(index) === pending) pendingPairs.delete(index) })
      pendingPairs.set(index, pending); return pending
    }
    const warmOrder = () => {
      const current = controlledPosition() ?? 0
      return definitions.map((_, index) => index).sort((a, b) => Math.abs(a - current) - Math.abs(b - current))
    }
    const scheduleWarm = () => {
      if (disposed || warmHandle || warming || !nearView || document.hidden || preference.matches || controlledPosition() === undefined) return
      const order = warmOrder()
      if (!order.some(index => !clouds.has(index) && !unavailable.has(index))
        && !order.some(index => index < definitions.length - 1 && !pairs.has(index) && !unavailable.has(index) && !unavailable.has(index + 1))) return
      const step = async () => {
        warmHandle = 0
        if (disposed || !nearView || document.hidden || preference.matches || controlledPosition() === undefined) return
        warming = true
        const revision = sizeRevision
        try {
          const nextFrame = warmOrder().find(index => !clouds.has(index) && !unavailable.has(index))
          if (nextFrame !== undefined) {
            const image = await load(definitions[nextFrame].src)
            if (disposed || revision !== sizeRevision || !nearView) return
            if (image) getCloud(makeSurface(image, nextFrame), nextFrame)
            else unavailable.add(nextFrame)
          } else {
            const nextPair = warmOrder().find(index => index < definitions.length - 1 && !pairs.has(index) && !unavailable.has(index) && !unavailable.has(index + 1))
            if (nextPair !== undefined) await preparePair(nextPair)
          }
        } finally { warming = false; scheduleWarm() }
      }
      warmHandle = typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => { void step() }, { timeout: 600 })
        : window.setTimeout(() => { void step() }, 32)
    }
    const drawPosition = (pair: ScrubPair, value: number) => {
      if (!pair.flight.tracks.length) { settle(Math.round(value)); return }
      const progress = value - Math.floor(value)
      const departure = pair.source ? 1 - smooth(progress / .08) : 0
      const arrival = pair.destination ? smooth((progress - .92) / .08) : 0
      ctx.clearRect(0, 0, width, height)
      if (pair.source && departure > 0) { ctx.globalAlpha = departure; ctx.drawImage(pair.source, 0, 0, width, height) }
      paintFlight(ctx, pair.flight, progress, (1 - departure) * (1 - arrival), 16)
      if (pair.destination && arrival > 0) { ctx.globalAlpha = arrival; ctx.drawImage(pair.destination, 0, 0, width, height) }
      ctx.globalAlpha = 1
      imageRefs.current.forEach(image => { if (image) image.style.opacity = '0' }); canvas.style.opacity = '1'
      root.dataset.morphState = 'scrubbing'; root.dataset.frame = String(Math.round(value))
      root.dataset.particles = String(pair.flight.tracks.length)
      present(canvas)
    }
    const scrub = (requested: number) => {
      const value = normalizePosition(requested); const token = ++generation
      scrubbing = true; cancelAnimationFrame(raf); running = false; pausedAt = 0; queued = null
      sourceDetail = destinationDetail = null; flight = null
      root.dataset.morphMode = 'scrub-correspondence'; root.dataset.position = String(value)
      scheduleWarm()
      const nearest = Math.round(value)
      if (preference.matches || Math.abs(value - nearest) < .000001) { settle(nearest); return }
      if (!inView || document.hidden) { root.dataset.morphState = 'paused'; return }
      const index = Math.floor(value); const pair = pairs.get(index)
      if (pair) { drawPosition(pair, value); return }
      root.dataset.morphState = 'loading'
      void preparePair(index).then(prepared => {
        if (disposed || token !== generation) return
        if (!inView || document.hidden) { root.dataset.morphState = 'paused'; return }
        if (prepared) drawPosition(prepared, value)
        else settle(nearest)
      })
    }
    const tick = (now: number) => {
      if (disposed || !running || !flight) return
      const progress = clamp((now - startedAt) / DURATION)
      const departure = sourceDetail ? 1 - smooth(progress / (flight.interrupted ? .1 : .16)) : 0
      const arrival = destinationDetail ? smooth((progress - .86) / .14) : 0
      ctx.clearRect(0, 0, width, height)
      if (sourceDetail && departure > 0) { ctx.globalAlpha = departure; ctx.drawImage(sourceDetail, 0, 0, width, height) }
      paintFlight(ctx, flight, progress, (1 - departure) * (1 - arrival), previousFrameAt ? now - previousFrameAt : 16)
      if (destinationDetail && arrival > 0) { ctx.globalAlpha = arrival; ctx.drawImage(destinationDetail, 0, 0, width, height) }
      ctx.globalAlpha = 1; previousFrameAt = now
      if (progress >= 1) settle(target)
      else { present(canvas); raf = requestAnimationFrame(tick) }
    }
    const request = async (requested: number) => {
      if (scrubbing) {
        scrubbing = false; settle(Math.round(Number(root.dataset.position) || resting))
        delete root.dataset.position
      }
      const next = normalize(requested); const token = ++generation; queued = null
      if (next === target && (running || next === resting)) return
      if (preference.matches) { settle(next); return }
      if (!inView || document.hidden) { queued = next; return }
      const destination = await load(definitions[next].src); if (disposed || token !== generation) return
      const original = running ? null : await load(definitions[resting].src); if (disposed || token !== generation) return
      if (!destination || (!running && !original) || preference.matches) { settle(next); return }
      if (!inView || document.hidden) { queued = next; return }
      const interrupted = running && !!flight; cancelAnimationFrame(raf)
      destinationDetail = makeSurface(destination, next); const destinationCloud = getCloud(destinationDetail, next)
      let sourcePoints: InkPoint[]
      if (interrupted && flight) {
        // Keep point positions, colors and velocities; never resample a faded frame.
        sourcePoints = flight.current
        const bridge = document.createElement('canvas'); bridge.width = canvas.width; bridge.height = canvas.height
        bridge.getContext('2d')!.drawImage(canvas, 0, 0); sourceDetail = bridge
      } else {
        const surface = makeSurface(original!, resting); const cloud = getCloud(surface, resting)
        sourcePoints = cloud.points; sourceDetail = cloud.points.length ? surface : null
      }
      flight = makeFlight(sourcePoints, destinationCloud, width, height, interrupted)
      if (!destinationCloud.points.length) destinationDetail = null
      if (!flight.tracks.length) { settle(next); return }
      target = next; running = true; pausedAt = 0; startedAt = performance.now(); previousFrameAt = 0
      imageRefs.current.forEach(image => { if (image) image.style.opacity = '0' }); canvas.style.opacity = '1'
      root.dataset.morphState = 'running'; root.dataset.frame = String(next)
      root.dataset.particles = String(flight.tracks.length); root.dataset.morphMode = 'correspondence'; tick(startedAt)
    }
    const syncVisibility = () => {
      const value = controlledPosition()
      if (value !== undefined) {
        if (inView && !document.hidden) { scrub(value); scheduleWarm() }
        else root.dataset.morphState = 'paused'
        return
      }
      if (inView && !document.hidden && queued !== null) { const next = queued; queued = null; void request(next); return }
      if (!running) return
      if (!inView || document.hidden) {
        if (!pausedAt) { pausedAt = performance.now(); cancelAnimationFrame(raf); root.dataset.morphState = 'paused' }
      } else if (pausedAt) {
        startedAt += performance.now() - pausedAt; pausedAt = 0; previousFrameAt = 0
        root.dataset.morphState = 'running'; raf = requestAnimationFrame(tick)
      }
    }
    const onPreferenceChange = () => {
      const value = controlledPosition()
      if (value !== undefined) scrub(value)
      else if (preference.matches) { generation += 1; settle(normalize(desiredRef.current)) }
    }
    measure(); settle(resting); requestRef.current = index => { void request(index) }; scrubRef.current = scrub
    tintRequestRef.current = value => {
      tintPass.setActive(value)
      if (value && root.dataset.morphState === 'rest') refreshStillTint()
    }
    const resize = new ResizeObserver(() => {
      if (measure()) {
        generation += 1
        const value = controlledPosition()
        settle(Math.round(value ?? desiredRef.current))
        if (value !== undefined) scrub(value)
        scheduleWarm()
      }
    }); resize.observe(root)
    const intersection = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting; tintPass.setVisible(inView); syncVisibility()
    }, { rootMargin: '80px' }); intersection.observe(root)
    const warmIntersection = new IntersectionObserver(entries => { nearView = entries[0].isIntersecting; scheduleWarm() }, { rootMargin: '700px' }); warmIntersection.observe(root)
    document.addEventListener('visibilitychange', syncVisibility); preference.addEventListener('change', onPreferenceChange)
    return () => {
      disposed = true; generation += 1; cancelAnimationFrame(raf); resize.disconnect(); intersection.disconnect(); warmIntersection.disconnect()
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(warmHandle)
      else window.clearTimeout(warmHandle)
      document.removeEventListener('visibilitychange', syncVisibility); preference.removeEventListener('change', onPreferenceChange)
      tintPass.destroy(); tintRequestRef.current = () => {}
      requestRef.current = () => {}; scrubRef.current = () => {}; surfaces.clear(); clouds.clear(); pairs.clear(); pendingPairs.clear()
    }
  }, [framesKey])
  useLayoutEffect(() => {
    if (typeof position === 'number') scrubRef.current(position)
    else requestRef.current(active)
  }, [active, position, framesKey])
  useLayoutEffect(() => { tintRequestRef.current(tintActive) }, [tintActive, framesKey])
  return <div ref={rootRef} className={`dither-morph ${className}`} aria-hidden="true">
    {frames.map((frame, index) => <img key={`${index}:${frame.src}`} ref={image => { imageRefs.current[index] = image }}
      className="dither-morph__image" src={frame.src} alt="" draggable={false} decoding="async"
      style={{ width: `${frame.crop?.width ?? 100}%`, height: `${frame.crop?.height ?? 100}%`, left: `${frame.crop?.left ?? 0}%`, top: `${frame.crop?.top ?? 0}%`, opacity: index === initialIndex.current ? 1 : 0 }} />)}
    <canvas ref={canvasRef} className="dither-morph__canvas" />
    <canvas ref={tintCanvasRef} className="dither-morph__tint" />
  </div>
}
