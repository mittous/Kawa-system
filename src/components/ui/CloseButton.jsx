import { X } from 'lucide-react'

export default function CloseButton({ onClick, label = 'Fermer', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex size-8 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <X className="size-4.5" strokeWidth={2.25} />
    </button>
  )
}
