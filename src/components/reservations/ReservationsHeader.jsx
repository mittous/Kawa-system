import { BookOpen, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatLongDate } from '../../lib/date'

const outlineButton =
  'flex h-9 items-center justify-center rounded-button border border-border-strong bg-card text-sm font-semibold text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export default function ReservationsHeader({ date, onPrevious, onNext, onToday }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <BookOpen className="size-6 text-primary" strokeWidth={2.25} />
        <h1 className="text-[22px] font-bold tracking-tight">Réservations du service</h1>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={onPrevious} aria-label="Jour précédent" className={`${outlineButton} w-9`}>
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </button>

        <div className="flex h-9 items-center gap-2 rounded-button border border-border-strong bg-card px-3.5 text-sm font-semibold">
          <CalendarDays className="size-4 text-primary" strokeWidth={2.25} />
          <span className="whitespace-nowrap">{formatLongDate(date)}</span>
        </div>

        <button type="button" onClick={onNext} aria-label="Jour suivant" className={`${outlineButton} w-9`}>
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </button>

        <button type="button" onClick={onToday} className={`${outlineButton} ml-2 px-4`}>
          Aujourd'hui
        </button>
      </div>
    </header>
  )
}
