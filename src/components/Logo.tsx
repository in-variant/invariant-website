import { Link } from 'react-router-dom'

/** The Invariant "I", a serif capital split into two mirrored halves.
 *  Symmetric under reflection: the form is literally invariant. */
export function KeystoneMark({ className = 'h-5 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="12 8 76 84" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 12L82 12L82 19C67 21 62 31 60 44L40 44C38 31 33 21 18 19Z M18 88L82 88L82 81C67 79 62 69 60 56L40 56C38 69 33 79 18 81Z" />
    </svg>
  )
}

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Invariant, home"
      className={`flex items-center gap-2.5 transition-opacity hover:opacity-80 ${className}`}
    >
      <KeystoneMark className="h-[20px] w-auto" />
      <span className="font-serif text-[22px] font-normal leading-none tracking-[-0.015em]">Invariant</span>
    </Link>
  )
}
