import { useEffect, useRef, useState } from 'react'
import './FigmaScrambleLabel.css'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/[]<>*#+-'
const DURATION = 400
const TICK = 40

type FigmaScrambleLabelProps = {
  children: string
  className?: string
}

/** A decorative hover treatment; the accessible label is never changed. */
export default function FigmaScrambleLabel({ children, className = '' }: FigmaScrambleLabelProps) {
  const labelRef = useRef<HTMLSpanElement>(null)
  const [scramble, setScramble] = useState<string | null>(null)

  useEffect(() => {
    const label = labelRef.current
    if (!label) return
    const host = label.closest('a, button') || label
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let timer = 0
    let entered = false
    const characters = Array.from(children)
    setScramble(null)

    const restore = () => {
      window.clearInterval(timer)
      timer = 0
      entered = false
      setScramble(null)
    }

    const play = () => {
      if (reducedMotion.matches || entered || !children.trim()) return
      entered = true
      const started = performance.now()
      const update = () => {
        const elapsed = performance.now() - started
        if (elapsed >= DURATION) {
          window.clearInterval(timer)
          timer = 0
          setScramble(null)
          return
        }
        const resolved = Math.floor((elapsed / DURATION) * characters.length)
        setScramble(characters.map((character, index) => {
          if (index < resolved || /\s/.test(character)) return character
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }).join(''))
      }
      update()
      timer = window.setInterval(update, TICK)
    }

    const onPointerEnter = (event: Event) => {
      if (finePointer.matches && (event as PointerEvent).pointerType !== 'touch') play()
    }
    const onFocus = () => { if (host.matches(':focus-visible')) play() }
    const onPreferenceChange = () => { if (reducedMotion.matches) restore() }

    host.addEventListener('pointerenter', onPointerEnter)
    host.addEventListener('pointerleave', restore)
    host.addEventListener('focusin', onFocus)
    host.addEventListener('focusout', restore)
    reducedMotion.addEventListener('change', onPreferenceChange)

    return () => {
      window.clearInterval(timer)
      host.removeEventListener('pointerenter', onPointerEnter)
      host.removeEventListener('pointerleave', restore)
      host.removeEventListener('focusin', onFocus)
      host.removeEventListener('focusout', restore)
      reducedMotion.removeEventListener('change', onPreferenceChange)
    }
  }, [children])

  return (
    <span ref={labelRef} className={`figma-scramble-label ${className}`} data-scrambling={scramble !== null || undefined}>
      <span className="figma-scramble-label__text">{children}</span>
      <span className="figma-scramble-label__overlay" aria-hidden="true">{scramble}</span>
    </span>
  )
}
