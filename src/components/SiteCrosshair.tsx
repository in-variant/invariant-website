import { useEffect, useRef } from 'react'
import './SiteCrosshair.css'

/** One shared background guide, kept below the site's content and hero. */
export default function SiteCrosshair() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (any-pointer: fine)')
    const origin = () => ({ x: window.innerWidth * .6375, y: window.innerHeight * .2908 })
    let position = origin()
    let target = { ...position }
    let frame = 0
    let previous = 0
    let following = false

    const paint = () => {
      // Keep the hairlines on whole CSS pixels when the pointer settles.
      element.style.setProperty('--crosshair-x', `${Math.round(position.x)}px`)
      element.style.setProperty('--crosshair-y', `${Math.round(position.y)}px`)
    }
    const render = (now: number) => {
      const dt = Math.min((now - (previous || now - 16.67)) / 1000, .05)
      previous = now
      const blend = 1 - Math.exp(-10 * dt)
      position.x += (target.x - position.x) * blend
      position.y += (target.y - position.y) * blend
      const settled = Math.abs(target.x - position.x) + Math.abs(target.y - position.y) < .2
      if (settled) position = { ...target }
      paint()
      if (!settled) frame = requestAnimationFrame(render)
      else { frame = 0; previous = 0 }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render) }
    const move = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType === 'touch') return
      following = true
      target = {
        x: Math.max(8, Math.min(window.innerWidth - 8, event.clientX)),
        y: Math.max(8, Math.min(window.innerHeight - 8, event.clientY)),
      }
      schedule()
    }
    const reset = () => {
      following = false
      target = origin()
      if (motion.matches) schedule()
      else { position = { ...target }; paint() }
    }
    const change = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      following = false
      position = origin()
      target = { ...position }
      paint()
    }
    const resize = () => {
      if (!following) change()
      else {
        target.x = Math.min(window.innerWidth - 8, target.x)
        target.y = Math.min(window.innerHeight - 8, target.y)
        schedule()
      }
    }
    const visibility = () => {
      if (document.hidden) change()
    }

    paint()
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', change)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', change)
    }
  }, [])

  return <div ref={ref} className="site-crosshair" aria-hidden="true">
    <span className="site-crosshair-vertical" />
    <span className="site-crosshair-horizontal" />
    <span className="site-crosshair-mark" />
  </div>
}
