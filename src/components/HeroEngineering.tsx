import { useId, useLayoutEffect, useRef, useState } from 'react'
import './HeroEngineering.css'

type Point = [number, number]
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const ease = (n: number) => { const t = clamp(n); return t * t * t * (t * (t * 6 - 15) + 10) }
const polar = (radius: number, degrees: number): Point => [radius * Math.cos(degrees * Math.PI / 180), radius * Math.sin(degrees * Math.PI / 180)]
const arc = (radius: number, from: number, to: number): Point[] => {
  const a = from * Math.PI / 180, b = to * Math.PI / 180
  const k = 4 / 3 * Math.tan((b - a) / 4)
  const start = polar(radius, from), end = polar(radius, to)
  return [[start[0] - k * radius * Math.sin(a), start[1] + k * radius * Math.cos(a)], [end[0] + k * radius * Math.sin(b), end[1] - k * radius * Math.cos(b)], end]
}
const line = (from: Point, to: Point): Point[] => [from, to, to]

// One continuous contour: a curved quadrant resolves into the original mark.
// The other three are reflections, so the motion stays perfectly balanced.
const outerEnd = polar(14, -5), outerStart = polar(14, -85)
const innerStart = polar(10, -85), innerEnd = polar(10, -5)
const INITIAL: Point[] = [outerEnd, ...arc(14, -5, -85), ...line(outerStart, innerStart), ...arc(10, -85, -45), ...arc(10, -45, -5), ...line(innerEnd, outerEnd)]
const a: Point = [11.4247, -9.77462], b: Point = [11.4247, -12.5]
const c: Point = [0, -12.5], d: Point = [0, -1.0534], e: Point = [3.2642, -1.0534]
const FINAL: Point[] = [b, ...line(b, c), ...line(c, d), ...line(d, e), [3.2642, -6.72219], [8.7045, -9.22954], a, ...line(a, b)]
const contour = (progress: number) => INITIAL.map((point, i) => {
  const x = point[0] + (FINAL[i][0] - point[0]) * progress
  const y = point[1] + (FINAL[i][1] - point[1]) * progress
  return `${i === 0 ? 'M' : (i - 1) % 3 === 0 ? 'C' : ''}${x.toFixed(4)} ${y.toFixed(4)}`
}).join(' ') + 'Z'
type Phase = 'off' | 'forming' | 'revealing' | 'complete'

export default function HeroEngineering() {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markRef = useRef<SVGGElement>(null)
  const [phase, setPhase] = useState<Phase>('off')
  const id = `invariant-opening-${useId().replace(/:/g, '')}`

  useLayoutEffect(() => {
    const root = rootRef.current, path = pathRef.current, mark = markRef.current
    const hero = root?.closest<HTMLElement>('.figma-hero')
    const photo = hero?.querySelector<HTMLImageElement>('.figma-hero-image')
    if (!root || !path || !mark || !hero || !photo) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const events = new AbortController()
    // Reloading a scrolled homepage otherwise restores that scroll position before React
    // mounts, which read as "the visitor is already reading" and skipped the opening.
    const restoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const started = performance.now(), initialScroll = scrollY, initialWidth = innerWidth
    let frame = 0, deadline = 0, disposed = false, finished = false, ready = false, released = 0
    const update = (next: Phase) => { root.dataset.phase = next; setPhase(next) }
    const finish = () => {
      if (disposed || finished) return
      finished = true
      cancelAnimationFrame(frame)
      clearTimeout(deadline)
      update('complete')
    }
    const render = (now: number) => {
      frame = 0
      if (disposed || finished) return
      const elapsed = now - started
      // Exactly one full turn, stopping as the logo starts to form.
      const turn = ease(elapsed / 960)
      const formation = ease((elapsed - 960) / 440)
      path.setAttribute('d', contour(formation))
      mark.setAttribute('transform', `rotate(${-360 * (1 - turn)})`)
      if (!released && elapsed >= 1560 && (ready || elapsed >= 1720)) {
        released = now
        update('revealing')
      }
      const reveal = released ? now - released : 0
      mark.setAttribute('opacity', String(ease(elapsed / 140) * (1 - ease(reveal / 180))))
      root.style.setProperty('--intro-cover', String(1 - ease((reveal - 40) / 280)))
      if (released && reveal >= 330) finish()
      else frame = requestAnimationFrame(render)
    }
    root.style.setProperty('--intro-cover', '1')
    mark.setAttribute('opacity', '0')
    mark.setAttribute('transform', 'rotate(-360)')
    path.setAttribute('d', contour(0))
    const show = !preference.matches && (!location.hash || location.hash === '#top') && initialScroll < 12 && !document.hidden
    if (show) {
      update('forming')
      frame = requestAnimationFrame(render)
      Promise.allSettled([photo.decode(), document.fonts.load('500 24px "DIN"'), document.fonts.load('400 16px "Geist"')]).then(results => {
        if (disposed || finished) return
        if (results[0].status === 'rejected') finish()
        else ready = true
      })
      deadline = window.setTimeout(finish, 2200)
    } else finish()
    window.addEventListener('scroll', () => { if (Math.abs(scrollY - initialScroll) > 14) finish() }, { signal: events.signal, passive: true })
    window.addEventListener('resize', () => { if (Math.abs(innerWidth - initialWidth) > 1) finish() }, { signal: events.signal })
    hero.addEventListener('focusin', finish, { signal: events.signal })
    window.addEventListener('keydown', event => { if (event.key === 'Escape') finish() }, { signal: events.signal })
    document.addEventListener('visibilitychange', () => { if (document.hidden) finish() }, { signal: events.signal })
    preference.addEventListener('change', finish, { signal: events.signal })
    return () => { disposed = true; cancelAnimationFrame(frame); clearTimeout(deadline); events.abort(); history.scrollRestoration = restoration }
  }, [])

  return <div className="hero-engineering" ref={rootRef} data-phase={phase} aria-hidden="true">
    <div className="hero-opening">
      <svg className="hero-opening-symbol" viewBox="-18 -18 36 36">
        <defs><path id={id} ref={pathRef} d={contour(0)} /></defs>
        <g ref={markRef} fill="#fcfcf8" opacity="0">
          <use href={`#${id}`} />
          <use href={`#${id}`} transform="scale(-1 1)" />
          <use href={`#${id}`} transform="scale(1 -1)" />
          <use href={`#${id}`} transform="scale(-1 -1)" />
        </g>
      </svg>
    </div>
  </div>
}
