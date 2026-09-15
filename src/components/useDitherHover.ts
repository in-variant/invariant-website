import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, PointerEvent } from 'react'

/** One hover-intent rhythm for all of the homepage's dither illustrations. */
export default function useDitherHover() {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancel = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
  }, [])
  useEffect(() => cancel, [cancel])
  const active = hovered || focused
  return {
    active,
    bind: {
      'data-tint-active': active,
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === 'touch') return
        cancel()
        timer.current = setTimeout(() => { timer.current = null; setHovered(true) }, 300)
      },
      onPointerLeave: () => { cancel(); setHovered(false) },
      onPointerCancel: () => { cancel(); setHovered(false) },
      onFocus: (event: FocusEvent<HTMLElement>) => setFocused(event.target.matches(':focus-visible')),
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      },
    },
  }
}
