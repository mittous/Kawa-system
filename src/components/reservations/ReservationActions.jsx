import { Check, UserX } from 'lucide-react'

const DONE_STYLES = {
  // List view: an arrived guest greys the button out.
  muted: 'disabled:border-border disabled:text-muted/70',
  // Details card: an arrived guest shows the button in green.
  success: 'disabled:border-primary/40 disabled:text-primary',
}

export function ArriveButton({ reservation, onArrive, doneStyle = 'muted' }) {
  return (
    <button
      type="button"
      onClick={() => onArrive(reservation.id)}
      disabled={reservation.status === 'arrived'}
      className={`flex h-8 items-center gap-1.5 rounded-control border border-border-strong bg-card px-3 text-[13px] font-semibold text-ink shadow-xs transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-card ${DONE_STYLES[doneStyle]}`}
    >
      <Check className="size-3.5" strokeWidth={2.75} />
      Arrivé
    </button>
  )
}

export function CancelButton({ reservation, onCancel }) {
  return (
    <button
      type="button"
      onClick={() => onCancel(reservation.id)}
      disabled={reservation.status === 'cancelled'}
      aria-label={`Annuler la réservation de ${reservation.name}`}
      title="Annuler / libérer la table"
      className="flex size-8 items-center justify-center rounded-control border border-danger/35 bg-card text-danger transition-colors hover:bg-danger/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card"
    >
      <UserX className="size-4" strokeWidth={2.25} />
    </button>
  )
}
