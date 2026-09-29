import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Pencil } from 'lucide-react'
import StatusBadge from './StatusBadge'
import GuestMeta from './GuestMeta'
import VipBadge from './VipBadge'
import { ArriveButton, CancelButton } from './ReservationActions'
import CloseButton from '../ui/CloseButton'

function Field({ label, value, className = '' }) {
  return (
    <div className={`rounded-button border border-border bg-card px-3 py-2 ${className}`}>
      <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
      {value && <p className="mt-0.5 text-sm font-semibold whitespace-pre-line">{value}</p>}
    </div>
  )
}

// Card shown over the floor plan when a table is clicked.
// Closes with the X button, on Escape, or on a click outside the card.
export default function ReservationDetailsCard({ reservation, onClose, onArrive, onCancel, onEdit }) {
  const cardRef = useRef(null)
  const { name, phone, occasion, vip, allergies, comments, time, guests, tables, status } = reservation
  const tableLabel = tables.join(' + ')
  const notes = [allergies && `Allergies : ${allergies}`, comments].filter(Boolean).join('\n')

  useEffect(() => {
    cardRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      data-no-pan
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="absolute inset-0 z-30 flex cursor-default items-center justify-center p-3"
    >
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-labelledby="reservation-details-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="max-h-full w-88 max-w-full overflow-y-auto rounded-panel border border-border bg-card p-5 shadow-[0_16px_40px_-16px_rgb(17_22_19/0.25)] focus:outline-none scrollbar-thin scrollbar-thumb-border scrollbar-track-surface"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 id="reservation-details-title" className="text-lg leading-7 font-bold whitespace-nowrap">
            Détails de réservation
          </h3>
          <CloseButton onClick={onClose} className="-mr-2" />
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-[13px] text-muted">
            Table {tableLabel} • {time}
          </p>
          <StatusBadge status={status} />
        </div>

        <div className="mt-3 rounded-panel border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold">{name}</p>
            {vip && <VipBadge />}
          </div>
          <GuestMeta phone={phone} occasion={occasion} className="mt-0.5" />

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Field label="Heure" value={time} />
            <Field label="Couverts" value={`${guests} pers.`} />
            <Field label="Table" value={tableLabel} className="col-span-2" />
            <Field label="Notes" value={notes} className="col-span-2 min-h-13" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ArriveButton reservation={reservation} onArrive={onArrive} doneStyle="success" />
          <CancelButton reservation={reservation} onCancel={onCancel} />
          <button
            type="button"
            onClick={() => onEdit(reservation.id)}
            aria-label="Modifier la réservation"
            title="Modifier la réservation"
            className="ml-auto flex size-8 items-center justify-center rounded-control border border-border-strong bg-card text-info transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Pencil className="size-4" strokeWidth={2.25} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
