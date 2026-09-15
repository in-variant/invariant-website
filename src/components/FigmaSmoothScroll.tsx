import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let smoothScroll: Lenis | null = null

/** A continuous effort map makes a large flick meet the same resistance as small inputs. */
function sectionResistance(centers: number[], radius: number) {
  const ordered = [...new Set(centers)].sort((a, b) => a - b)
  const primitive = (offset: number) => offset / 2 + Math.sin(Math.PI * offset / radius) * radius / (2 * Math.PI)
  const zones = ordered.map((center, index) => {
    // Split overlapping zones at their midpoint so their resistance never stacks.
    const left = Math.max(-radius, index ? (ordered[index - 1] - center) / 2 : -radius)
    const right = Math.min(radius, index < ordered.length - 1 ? (ordered[index + 1] - center) / 2 : radius)
    return { center, left, right, initial: primitive(left) }
  })
  const effort = (position: number, strength: number) => position + strength * zones.reduce((total, zone) => {
    const offset = Math.max(zone.left, Math.min(zone.right, position - zone.center))
    return total + primitive(offset) - zone.initial
  }, 0)
  return (position: number, delta: number, touch: boolean) => {
    if (!delta || !zones.length) return delta
    const strength = touch ? .8 : 1.35
    const destination = effort(position, strength) + delta
    let low = Math.min(position, position + delta)
    let high = Math.max(position, position + delta)
    for (let index = 0; index < 20; index += 1) {
      const middle = (low + high) / 2
      if (effort(middle, strength) < destination) low = middle
      else high = middle
    }
    return (low + high) / 2 - position
  }
}

export function scrollFigmaTo(position: number) {
  if (smoothScroll) smoothScroll.scrollTo(position, { duration: .9, lerp: 0, easing: t => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top: position, behavior: 'auto' })
}

/** Soft resistance at homepage section entrances, with light inertia between them. */
export default function FigmaSmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const homepage = document.querySelector<HTMLElement>('.figma-home')
    const sections = homepage ? [...homepage.querySelectorAll<HTMLElement>('.figma-problem-track, .figma-solution, .figma-audience, .figma-workflow, .figma-safety, .figma-next-step, .figma-site-footer')] : []
    let resist = (_position: number, delta: number, _touch: boolean) => delta
    let geometryFrame = 0
    let disposed = false
    let gesture = 0
    let multiTouch = false
    const measure = () => {
      geometryFrame = 0
      const viewport = window.innerHeight
      const limit = Math.max(0, document.documentElement.scrollHeight - viewport)
      const centers = sections.map(section => {
        let offset = Math.min(64, viewport * .075)
        if (section.matches('.figma-next-step')) offset = viewport * .45
        else if (section.matches('.figma-site-footer')) offset = viewport * .65
        const position = section.getBoundingClientRect().top + window.scrollY - offset
        return Math.max(0, Math.min(limit, position))
      })
      resist = sectionResistance(centers, Math.max(100, Math.min(190, viewport * .18)))
    }
    const scheduleMeasure = () => { if (!disposed && !geometryFrame) geometryFrame = requestAnimationFrame(measure) }
    const configure = () => {
      smoothScroll?.stop()
      smoothScroll?.destroy()
      smoothScroll = null
      gesture += 1
      multiTouch = false
      if (preference.matches) return
      let instance: Lenis
      instance = new Lenis({
        autoRaf: true,
        lerp: .085,
        wheelMultiplier: .92,
        syncTouch: Boolean(homepage),
        syncTouchLerp: .09,
        allowNestedScroll: true,
        virtualScroll: data => {
          const { event } = data
          if (!homepage) return true
          if ('touches' in event) {
            if (event.touches.length > 1) multiTouch = true
            if (multiTouch) {
              if (event.type === 'touchend' && !event.touches.length) multiTouch = false
              gesture += 1
              return false
            }
          }
          if (event.ctrlKey || Math.abs(data.deltaX) > Math.abs(data.deltaY)) { gesture += 1; return false }
          const touch = event.type.startsWith('touch')
          const token = ++gesture
          if (event.type === 'touchend') {
            const origin = instance.targetScroll
            // Lenis calculates release inertia after this hook. Remap that target
            // before the next paint, just like wheel input, so a fling cannot skip a zone.
            queueMicrotask(() => {
              if (disposed || token !== gesture || smoothScroll !== instance || instance.isTouching || instance.isStopped || instance.isLocked) return
              const delta = instance.targetScroll - origin
              const adjusted = resist(origin, delta, true)
              if (Math.abs(delta - adjusted) > .01) instance.scrollTo(origin + adjusted, { programmatic: false, lerp: .09 })
            })
          } else data.deltaY = resist(instance.targetScroll, data.deltaY, touch)
          return true
        },
        // Phone navigation remains fixed above the pinned section headings.
        anchors: { offset: window.innerWidth < 1024 ? -90 : -40, duration: 1.2, lerp: 0 },
        stopInertiaOnNavigate: true,
      })
      smoothScroll = instance
      scheduleMeasure()
    }
    const resize = new ResizeObserver(scheduleMeasure)
    sections.forEach(section => resize.observe(section))
    if (homepage) resize.observe(homepage)
    window.addEventListener('resize', scheduleMeasure)
    void document.fonts.ready.then(scheduleMeasure)
    measure()
    configure()
    preference.addEventListener('change', configure)
    return () => {
      disposed = true
      gesture += 1
      cancelAnimationFrame(geometryFrame)
      resize.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      preference.removeEventListener('change', configure)
      smoothScroll?.stop()
      smoothScroll?.destroy()
      smoothScroll = null
    }
  }, [])
  return null
}
