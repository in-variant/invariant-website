export type DitherPaletteState = {
  visible: boolean
  state: 'blue' | 'scrambling' | 'orange' | 'returning'
  progress: number
  phase: number
}

type PaletteTimeline = { seed: number; fields: Uint8Array[] }

const ENTER_DURATION = 480
const TICK = 42
const LEAD_IN = 12
const LAST_PHASE = Math.floor((ENTER_DURATION - LEAD_IN) / TICK)
const FIRST_PHASE = Math.max(2, Math.floor(LAST_PHASE * .28))
const SWATCHES = [
  [251, 77, 3], [229, 49, 36], [181, 44, 31], [255, 116, 61], [255, 173, 102],
  [2, 47, 219], [128, 168, 198], [7, 27, 53], [255, 250, 242],
] as const
const WEIGHTS = [7, 6, 4, 5, 4, 1, 1, 1, 1]
const POOL = WEIGHTS.flatMap((weight, color) => Array<number>(weight).fill(color))
const POOLS = SWATCHES.map((_, previous) => POOL.filter(color => color !== previous))
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const hash = (value: number) => {
  value = Math.imul(value ^ (value >>> 16), 1274126177)
  return (value ^ (value >>> 13)) >>> 0
}

function createTimeline(count: number, seed: number): PaletteTimeline {
  const activation = Uint8Array.from({ length: count }, (_, cell) => hash(seed ^ cell ^ 1779033703) % 3)
  const deadlines = Uint8Array.from({ length: count }, (_, cell) => FIRST_PHASE + hash(seed ^ cell ^ 1013904223) % (LAST_PHASE - FIRST_PHASE + 1))
  const fields: Uint8Array[] = []
  for (let phase = 0; phase <= LAST_PHASE; phase += 1) {
    const field = new Uint8Array(count)
    for (let cell = 0; cell < count; cell += 1) {
      if (phase < activation[cell]) field[cell] = 255
      else if (phase >= deadlines[cell]) field[cell] = 0
      else {
        const previous = phase ? fields[phase - 1][cell] : 255
        const pool = POOLS[previous] ?? POOL
        field[cell] = pool[hash(seed ^ cell ^ Math.imul(phase + 1, 1597334677)) % pool.length]
      }
    }
    fields.push(field)
  }
  return { seed, fields }
}

/** A color-only presentation pass. Its clock never mutates or advances its source. */
export class DitherPalettePass {
  private ctx: CanvasRenderingContext2D
  private source: HTMLCanvasElement | null = null
  private sourceVersion = -1
  private capturedSource: HTMLCanvasElement | null = null
  private capturedVersion = -2
  private original: ImageData | null = null
  private output: ImageData | null = null
  private width = 0
  private height = 0
  private density = 1
  private columns = 0
  private cellSize = 1
  private columnIds = new Uint16Array(0)
  private colors = new Uint8Array(0)
  private timeline: PaletteTimeline | null = null
  private playhead = 0
  private phase = -1
  private moving = false
  private presentationVisible = false
  private target = false
  private settled = false
  private inView = true
  private disposed = false
  private raf = 0
  private previousTime = 0
  private preference = window.matchMedia('(prefers-reduced-motion: reduce)')

  constructor(private canvas: HTMLCanvasElement, private onState: (state: DitherPaletteState) => void) {
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!
    document.addEventListener('visibilitychange', this.sync)
    this.preference.addEventListener('change', this.sync)
    this.publish(false)
  }

  setSource(source: HTMLCanvasElement, density: number, version: number) {
    if (this.disposed) return
    const changedSize = this.width !== source.width || this.height !== source.height || this.density !== density
    this.source = source; this.sourceVersion = version
    if (changedSize) {
      this.width = source.width; this.height = source.height; this.density = density
      this.canvas.width = this.width; this.canvas.height = this.height
      this.cellSize = Math.max(1, density * 3.5)
      this.columns = Math.ceil(this.width / this.cellSize)
      const count = this.columns * Math.ceil(this.height / this.cellSize)
      this.colors = new Uint8Array(count).fill(255)
      this.columnIds = Uint16Array.from({ length: this.width }, (_, x) => Math.floor(x / this.cellSize))
      this.original = this.output = null; this.capturedSource = null
      if (this.timeline) this.timeline = createTimeline(count, this.timeline.seed)
      this.selectField(true)
    }
    this.sync()
    if (this.moving) this.paint()
  }

  setActive(active: boolean) {
    if (this.disposed) return
    if (this.target !== active) { this.target = active; this.previousTime = performance.now() }
    this.sync()
  }

  setVisible(visible: boolean) {
    this.inView = visible; this.sync()
  }

  clearSource() {
    this.source = this.capturedSource = null; this.original = this.output = null
    cancelAnimationFrame(this.raf); this.raf = 0; this.publish(false)
  }

  private publish(visible: boolean) {
    this.presentationVisible = visible
    this.onState({
      visible,
      state: this.moving ? this.target ? 'scrambling' : 'returning' : this.settled ? 'orange' : 'blue',
      progress: clamp(this.playhead / ENTER_DURATION),
      phase: this.moving ? this.phase : -1,
    })
  }

  private finish(target: boolean) {
    cancelAnimationFrame(this.raf); this.raf = 0; this.moving = false; this.settled = target
    this.playhead = target ? ENTER_DURATION : 0; this.phase = target ? LAST_PHASE : -1
    this.colors.fill(target ? 0 : 255)
    if (target) {
      if (!this.timeline) this.timeline = createTimeline(this.colors.length, Math.floor(Math.random() * 4294967296))
      this.paint()
    }
    else {
      this.timeline = null
      this.original = this.output = null; this.capturedSource = null; this.capturedVersion = -2
      this.ctx.clearRect(0, 0, this.width, this.height); this.publish(false)
    }
  }

  private sync = () => {
    if (this.disposed || !this.source) return
    if (this.preference.matches) { this.finish(this.target); return }
    if (this.playhead === (this.target ? ENTER_DURATION : 0)) {
      if (this.moving) this.finish(this.target)
      else if (this.settled) this.paint()
      return
    }
    if (!this.timeline) this.timeline = createTimeline(this.colors.length, Math.floor(Math.random() * 4294967296))
    this.moving = true
    if (!this.inView || document.hidden) { cancelAnimationFrame(this.raf); this.raf = 0; return }
    if (!this.raf) { this.previousTime = performance.now(); this.raf = requestAnimationFrame(this.tick) }
  }

  private selectField(force = false) {
    const phase = this.playhead < LEAD_IN ? -1 : Math.min(LAST_PHASE, Math.floor((this.playhead - LEAD_IN) / TICK))
    if (!force && phase === this.phase) return false
    this.phase = phase
    if (phase < 0 || !this.timeline) this.colors.fill(255)
    else this.colors.set(this.timeline.fields[phase])
    return true
  }

  private tick = (now: number) => {
    this.raf = 0
    if (this.disposed || !this.moving || !this.source || !this.inView || document.hidden) return
    const delta = Math.min(40, Math.max(0, now - this.previousTime)); this.previousTime = now
    this.playhead = Math.max(0, Math.min(ENTER_DURATION, this.playhead + (this.target ? delta : -delta)))
    if (this.playhead === (this.target ? ENTER_DURATION : 0)) { this.finish(this.target); return }
    if (this.selectField()) this.paint()
    else this.publish(this.presentationVisible)
    this.raf = requestAnimationFrame(this.tick)
  }

  private paint() {
    const source = this.source
    if (!source || !this.inView || document.hidden || (!this.settled && !this.moving)) return
    if (this.capturedSource !== source || this.capturedVersion !== this.sourceVersion || !this.original) {
      // Read back only while tinting, from a separate presentation canvas. The
      // authoritative morph canvas keeps its original rendering path and pixels.
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.drawImage(source, 0, 0)
      try { this.original = this.ctx.getImageData(0, 0, this.width, this.height) }
      catch { this.publish(false); return }
      if (!this.output) this.output = this.ctx.createImageData(this.width, this.height)
      this.capturedSource = source; this.capturedVersion = this.sourceVersion
    }
    const input = this.original.data; const output = this.output!.data
    output.set(input)
    for (let y = 0; y < this.height; y += 1) {
      const cellRow = Math.floor(y / this.cellSize) * this.columns
      for (let x = 0, offset = y * this.width * 4; x < this.width; x += 1, offset += 4) {
        if (!input[offset + 3]) continue
        const red = input[offset]; const green = input[offset + 1]; const blue = input[offset + 2]
        if (blue <= red + 6 || blue <= green + 5) continue
        const color = this.colors[cellRow + this.columnIds[x]]
        if (color === 255) continue
        const swatch = SWATCHES[color]
        const paper = Math.min(red, green); const ink = (blue - paper) / 255
        output[offset] = paper + ink * swatch[0]
        output[offset + 1] = paper + ink * swatch[1]
        output[offset + 2] = paper + ink * swatch[2]
      }
    }
    this.ctx.putImageData(this.output!, 0, 0); this.publish(true)
  }

  destroy() {
    this.disposed = true; cancelAnimationFrame(this.raf)
    document.removeEventListener('visibilitychange', this.sync); this.preference.removeEventListener('change', this.sync)
    this.source = this.capturedSource = null; this.original = this.output = null; this.timeline = null
  }
}
