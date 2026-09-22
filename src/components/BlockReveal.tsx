import { useId, useLayoutEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import './BlockReveal.css'
import { smallViewportHeight } from './screenHeight'

type BlockRevealProps = Omit<HTMLAttributes<HTMLElement>, 'color'> & {
  as?: ElementType
  children: ReactNode
  color?: string
  secondaryColor?: string
  /** A moving gradient block. Defaults to one pass when supplied. */
  gradient?: readonly string[]
  singlePass?: boolean
  /** Delay in seconds after the heading enters the viewport. */
  delay?: number
  once?: boolean
  /** Reveal each measured visual line directly from scroll position. */
  mode?: 'enter' | 'scroll'
  /** Optional ancestor track whose sticky stage holds the text during the reveal. */
  scrollTrack?: string
}

type TextLine = { x: number; y: number; width: number; height: number }

// Two overlapping passes: the accent enters first and is the last to leave.
const PASS_MS = 470
const SEPARATION_MS = 75
const PAUSE_MS = 15
const REVEAL_AT = PASS_MS + SEPARATION_MS + PAUSE_MS
const COMPLETE_AT = REVEAL_AT + SEPARATION_MS + PASS_MS + 80

/** A compact lookup table for cubic-bezier(.85, 0, .15, 1). */
const timing = Array.from({ length: 201 }, (_, index) => {
  const x = index / 200
  let low = 0
  let high = 1
  for (let iteration = 0; iteration < 16; iteration += 1) {
    const t = (low + high) / 2
    const point = 3 * (1 - t) * (1 - t) * t * 0.85 + 3 * (1 - t) * t * t * 0.15 + t * t * t
    if (point < x) low = t
    else high = t
  }
  const t = (low + high) / 2
  return 3 * (1 - t) * t * t + t * t * t
})

function progress(time: number, start: number) {
  const amount = Math.max(0, Math.min(1, (time - start) / PASS_MS)) * 200
  const index = Math.floor(amount)
  return timing[index] + ((timing[Math.min(index + 1, 200)] - timing[index]) * (amount - index))
}

function noise(column: number, row: number, seed: number) {
  const value = Math.sin(column * 127.1 + row * 311.7 + seed * 74.7) * 43758.5453
  return value - Math.floor(value)
}

/** Keeps the real text in the document; only the decorative wipe is canvas. */
export default function BlockReveal({
  as: Tag = 'span',
  children,
  color = '#022fdb',
  secondaryColor,
  gradient,
  singlePass = Boolean(gradient?.length),
  delay = 0,
  once = true,
  mode = 'enter',
  scrollTrack,
  className = '',
  ...attributes
}: BlockRevealProps) {
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskPathRef = useRef<SVGPathElement>(null)
  const maskId = `block-reveal-${useId().replace(/:/g, '')}`
  const gradientKey = gradient?.join('|') || ''

  useLayoutEffect(() => {
    const root = rootRef.current
    const content = contentRef.current
    const canvas = canvasRef.current
    if (!root || !content || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let disposed = false
    let running = false
    let completed = false
    let inView = false
    let width = 0
    let height = 0
    let lines: TextLine[] = []
    let observer: IntersectionObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    let contentObserver: MutationObserver | undefined

    const clear = () => context.clearRect(0, 0, width, height)
    const stop = () => {
      cancelAnimationFrame(frame)
      running = false
      clear()
    }
    const show = () => {
      stop()
      root.dataset.revealState = 'done'
    }

    const measure = () => {
      const bounds = root.getBoundingClientRect()
      width = Math.ceil(bounds.width)
      height = Math.ceil(bounds.height)
      const density = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * density))
      canvas.height = Math.max(1, Math.round(height * density))
      context.setTransform(density, 0, 0, density, 0, 0)
      lines = []
      const outlined = content.querySelector<HTMLElement>('[data-figma-lines]')
      const artwork = outlined?.querySelector('img')
      if (outlined && artwork && getComputedStyle(artwork).display !== 'none') {
        const box = outlined.getBoundingClientRect()
        const scale = box.width / Number(outlined.dataset.figmaWidth)
        const outlineLines = JSON.parse(outlined.dataset.figmaLines || '[]') as TextLine[]
        lines = outlineLines.map(line => ({ x: box.left - bounds.left + line.x * scale, y: box.top - bounds.top + line.y * scale, width: line.width * scale, height: line.height * scale }))
        return
      }
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent?.trim()) continue
        range.selectNodeContents(walker.currentNode)
        for (const rect of Array.from(range.getClientRects())) {
          if (!rect.width || !rect.height) continue
          const x = rect.left - bounds.left
          const y = rect.top - bounds.top
          const match = lines.find(line => Math.abs(line.y + line.height / 2 - y - rect.height / 2) < rect.height * 0.4)
          if (match) {
            const right = Math.max(match.x + match.width, x + rect.width)
            match.x = Math.min(match.x, x)
            match.width = right - match.x
            match.height = Math.max(match.height, rect.height)
          } else {
            lines.push({ x, y, width: rect.width, height: rect.height })
          }
        }
      }
      lines.sort((first, second) => first.y - second.y)
    }

    const paint = (line: TextLine, position: number, paintColor: string, seed: number, colors?: string[]) => {
      const cell = Math.min(colors?.length ? 2.5 : 5, Math.max(2, line.height / 10))
      const feather = Math.min(38, line.width / 4)
      const left = position * line.width
      const right = left + line.width
      if (colors?.length) {
        const fill = context.createLinearGradient(line.x + left, 0, line.x + right, 0)
        colors.forEach((stop, index) => fill.addColorStop(index / Math.max(1, colors.length - 1), stop))
        context.fillStyle = fill
      } else context.fillStyle = paintColor
      context.save()
      context.beginPath()
      context.rect(line.x, line.y, line.width, line.height)
      context.clip()
      const solidLeft = Math.max(0, left + feather)
      const solidRight = Math.min(line.width, right - feather)
      if (solidRight > solidLeft) context.fillRect(line.x + solidLeft, line.y, solidRight - solidLeft, line.height)
      for (const edge of [{ x: left, direction: 1 }, { x: right, direction: -1 }]) {
        const firstColumn = Math.floor((edge.x - feather) / cell)
        const lastColumn = Math.ceil((edge.x + feather) / cell)
        for (let column = firstColumn; column <= lastColumn; column += 1) {
          const center = (column + 0.5) * cell
          if (center < 0 || center > line.width) continue
          for (let row = 0; row * cell < line.height; row += 1) {
            const depth = ((center - edge.x) * edge.direction + feather) / (2 * feather)
            if (depth > noise(column, row, seed)) {
              context.fillRect(line.x + column * cell, line.y + row * cell, cell + 0.8, cell + 0.8)
            }
          }
        }
      }
      context.restore()
    }

    if (mode === 'scroll') {
      const maskPath = maskPathRef.current
      if (!maskPath) return
      const gradientColors = gradientKey ? gradientKey.split('|') : undefined
      const track = scrollTrack ? root.closest<HTMLElement>(scrollTrack) : null
      const stage = track?.querySelector<HTMLElement>('[data-reveal-stage]')
      const stageContent = track?.querySelector<HTMLElement>('[data-reveal-stage-content]')
      let lastProgress = -1
      const clamp = (value: number) => Math.max(0, Math.min(1, value))
      const rectangle = (x: number, y: number, w: number, h: number) =>
        w > 0 && h > 0 ? `M${x.toFixed(2)},${y.toFixed(2)}h${w.toFixed(2)}v${h.toFixed(2)}h${(-w).toFixed(2)}Z` : ''

      const renderScroll = () => {
        frame = 0
        if (disposed) return
        if (preference.matches || !lines.length || !width || !height) {
          content.style.removeProperty('clip-path')
          maskPath.setAttribute('d', '')
          root.dataset.revealState = 'done'
          clear()
          return
        }
        const bounds = root.getBoundingClientRect()
        const firstY = Math.min(...lines.map(line => line.y))
        const lastY = Math.max(...lines.map(line => line.y + line.height))
        const viewport = window.innerHeight
        const travel = Math.max(1, viewport * .32 + lastY - firstY)
        const pinned = track?.dataset.revealPinned === 'true' && stage
        const amount = pinned
          ? clamp(-track.getBoundingClientRect().top / Math.max(1, track.offsetHeight - stage.offsetHeight))
          : clamp((viewport * .72 - bounds.top - firstY) / travel)
        if (amount === lastProgress) return
        lastProgress = amount
        clear()
        root.dataset.revealState = 'scroll'
        root.dataset.revealProgress = amount.toFixed(5)
        root.dataset.revealLines = String(lines.length)
        content.style.clipPath = `url(#${maskId})`
        let path = ''
        lines.forEach((line, index) => {
          const lineProgress = clamp(amount * lines.length - index)
          if (lineProgress <= 0) return
          if (lineProgress >= 1) {
            path += rectangle(line.x - 1, line.y - 1, line.width + 2, line.height + 2)
            return
          }
          // A brief incoming block, followed by the longer text reveal. Both are
          // positions on the same scroll segment, never elapsed-time animations.
          const position = lineProgress < .18 ? lineProgress / .18 - 1 : (lineProgress - .18) / .82
          const seed = index * 37
          paint(line, position, color, seed, gradientColors)
          if (position <= 0) return
          const cell = Math.min(gradientColors?.length ? 2.5 : 5, Math.max(2, line.height / 10))
          const feather = Math.min(38, line.width / 4)
          const edge = position * line.width
          const solidWidth = Math.max(0, edge - feather)
          path += rectangle(line.x - 1, line.y - 1, solidWidth + 1, line.height + 2)
          // Complement the decorative block's exact seeded pixel edge, exposing
          // the real SVG/live text beneath it. Reverse scroll restores that edge.
          const firstColumn = Math.floor((edge - feather) / cell)
          const lastColumn = Math.ceil((edge + feather) / cell)
          for (let column = firstColumn; column <= lastColumn; column += 1) {
            const center = (column + .5) * cell
            if (center < 0 || center > line.width) continue
            for (let row = 0; row * cell < line.height; row += 1) {
              const depth = (center - edge + feather) / (2 * feather)
              if (depth <= noise(column, row, seed)) {
                path += rectangle(line.x + column * cell, line.y + row * cell, cell + .8, cell + .8)
              }
            }
          }
        })
        maskPath.setAttribute('d', path)
      }
      const scheduleScroll = () => {
        if (!frame) frame = requestAnimationFrame(renderScroll)
      }
      const measureScroll = () => {
        if (disposed) return
        measure()
        if (track && stage && stageContent) {
          // Measured against svh, the height the sticky stage is sized in, so a
          // phone's retracting address bar cannot change the scroll distance
          // mid-reveal. Reading the stage's own height here would feed the pin
          // decision back into itself, because pinning is what fixes that height.
          const viewport = smallViewportHeight(track)
          const header = window.innerWidth < 1024 ? 78 : 0
          const fits = stageContent.getBoundingClientRect().height + header + 48 <= viewport
          const canPin = !preference.matches && fits && lines.length > 0
          track.dataset.revealPinned = String(canPin)
          track.style.setProperty('--reveal-scroll-travel', `${canPin ? Math.round(Math.max(viewport * .9, lines.length * viewport * .18)) : 0}px`)
        }
        lastProgress = -1
        scheduleScroll()
      }
      const preferenceScroll = () => {
        measureScroll()
      }
      root.dataset.revealState = preference.matches ? 'done' : 'pending'
      measureScroll()
      resizeObserver = new ResizeObserver(measureScroll)
      resizeObserver.observe(root)
      if (stageContent) resizeObserver.observe(stageContent)
      contentObserver = new MutationObserver(measureScroll)
      contentObserver.observe(content, { childList: true, characterData: true, subtree: true })
      window.addEventListener('scroll', scheduleScroll, { passive: true })
      window.addEventListener('resize', measureScroll, { passive: true })
      preference.addEventListener('change', preferenceScroll)
      content.addEventListener('load', measureScroll, true)
      document.fonts.addEventListener('loadingdone', measureScroll)
      void document.fonts.ready.then(measureScroll)
      return () => {
        disposed = true
        stop()
        resizeObserver?.disconnect()
        contentObserver?.disconnect()
        window.removeEventListener('scroll', scheduleScroll)
        window.removeEventListener('resize', measureScroll)
        preference.removeEventListener('change', preferenceScroll)
        content.removeEventListener('load', measureScroll, true)
        document.fonts.removeEventListener('loadingdone', measureScroll)
        content.style.removeProperty('clip-path')
        if (track) {
          delete track.dataset.revealPinned
          track.style.removeProperty('--reveal-scroll-travel')
        }
        delete root.dataset.revealState
        delete root.dataset.revealProgress
        delete root.dataset.revealLines
      }
    }

    const play = () => {
      if (disposed || running || (completed && once)) return
      if (preference.matches) { show(); return }
      measure()
      if (!width || !height || !lines.length) { show(); return }
      running = true
      root.dataset.revealState = 'pending'
      const foreground = secondaryColor || getComputedStyle(content).color
      const gradientColors = gradientKey ? gradientKey.split('|') : undefined
      const start = performance.now() + Math.max(0, delay) * 1000
      const tick = (now: number) => {
        if (disposed) return
        const elapsed = now - start
        clear()
        if (elapsed >= REVEAL_AT) root.dataset.revealState = 'revealed'
        if (elapsed >= 0) {
          const accentPosition = progress(elapsed, 0) - 1 + progress(elapsed, REVEAL_AT + SEPARATION_MS)
          const foregroundPosition = progress(elapsed, SEPARATION_MS) - 1 + progress(elapsed, REVEAL_AT)
          lines.forEach(line => {
            paint(line, accentPosition, color, 0, gradientColors)
            if (!singlePass) paint(line, foregroundPosition, foreground, 91)
          })
        }
        if (elapsed < COMPLETE_AT) frame = requestAnimationFrame(tick)
        else {
          completed = true
          show()
          if (once) observer?.disconnect()
        }
      }
      frame = requestAnimationFrame(tick)
    }

    const onPreferenceChange = () => {
      if (preference.matches) show()
      else if (inView) play()
    }

    if (preference.matches) show()
    else root.dataset.revealState = 'pending'
    preference.addEventListener('change', onPreferenceChange)

    // Font metrics determine each visual line, including naturally wrapped text.
    void document.fonts.ready.then(() => {
      if (disposed) return
      measure()
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => {
          const entry = entries[0]
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            inView = true
            play()
          } else if (entry.intersectionRatio <= 0.001) {
            inView = false
            stop()
            if (!once && !preference.matches) root.dataset.revealState = 'pending'
          }
        }, { threshold: [0, 0.35], rootMargin: '0px 0px -8% 0px' })
        observer.observe(root)
      } else {
        inView = true
        play()
      }
      resizeObserver = new ResizeObserver(() => {
        const bounds = root.getBoundingClientRect()
        if (Math.ceil(bounds.width) === width && Math.ceil(bounds.height) === height) return
        // Toolbar movement or a late font load must not cancel the entrance.
        // The next animation frame paints these freshly measured lines.
        measure()
      })
      resizeObserver.observe(root)
      // React may recreate the children array when a nearby control changes.
      // Only restart when the rendered text actually changes.
      contentObserver = new MutationObserver(() => {
        completed = false
        stop()
        measure()
        if (inView) play()
      })
      contentObserver.observe(content, { childList: true, characterData: true, subtree: true })
    })

    return () => {
      disposed = true
      stop()
      observer?.disconnect()
      resizeObserver?.disconnect()
      contentObserver?.disconnect()
      preference.removeEventListener('change', onPreferenceChange)
      delete root.dataset.revealState
    }
  }, [color, secondaryColor, gradientKey, singlePass, delay, once, mode, scrollTrack, maskId])

  return (
    <Tag {...attributes} ref={rootRef} className={`block-reveal ${className}`} data-reveal-mode={mode}>
      <span ref={contentRef} className="block-reveal__content">{children}</span>
      <canvas ref={canvasRef} className="block-reveal__canvas" aria-hidden="true" />
      {mode === 'scroll' && <svg className="block-reveal__mask" width="0" height="0" aria-hidden="true" focusable="false">
        <defs><clipPath id={maskId} clipPathUnits="userSpaceOnUse"><path ref={maskPathRef} /></clipPath></defs>
      </svg>}
    </Tag>
  )
}
