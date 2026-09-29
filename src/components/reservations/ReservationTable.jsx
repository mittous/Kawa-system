import { Clock, Table2, User } from 'lucide-react'
import StatusBadge from './StatusBadge'
import GuestMeta from './GuestMeta'
import VipBadge from './VipBadge'
import { ArriveButton, CancelButton } from './ReservationActions'

const COLUMNS = [
  { label: 'Heure', className: 'w-[124px] pl-5' },
  { label: 'Invité', className: '' },
  { label: 'Pers.', className: 'w-[104px]' },
  { label: 'Table', className: 'w-[168px]' },
  { label: 'Statut', className: 'w-[136px]' },
  { label: 'Actions', className: 'w-[168px] pr-5' },
]

function TableCell({ tables }) {
  if (tables.length === 0) {
    return <span className="text-[13px] font-semibold text-primary">Non assigné</span>
  }

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-chip bg-border px-2.5 text-[13px] font-semibold whitespace-nowrap">
      <Table2 className="size-3.5 text-muted" strokeWidth={2.25} />
      {tables.join(' + ')}
    </span>
  )
}

function ReservationRow({ reservation, onArrive, onCancel, onEdit }) {
  const { time, name, phone, occasion, vip, guests, tables, status } = reservation

  // A click anywhere on the row edits the reservation, except on its buttons.
  function handleRowClick(event) {
    if (event.target.closest('button')) return
    onEdit(reservation.id)
  }

  return (
    <tr onClick={handleRowClick} className="cursor-pointer transition-colors hover:bg-surface/60">
      <td className="py-3.5 pr-3 pl-5">
        <div className="flex items-center gap-2.5 text-[15px] font-bold">
          <Clock className="size-4 text-muted" strokeWidth={2.25} />
          {time}
        </div>
      </td>

      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(reservation.id)}
            className="rounded-sm text-left text-[15px] font-semibold transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {name}
          </button>
          {vip && <VipBadge />}
        </div>
        <GuestMeta phone={phone} occasion={occasion} className="mt-0.5" />
      </td>

      <td className="px-3 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <User className="size-4 text-muted" strokeWidth={2.25} />
          {guests}
        </div>
      </td>

      <td className="px-3 py-3.5">
        <TableCell tables={tables} />
      </td>

      <td className="px-3 py-3.5">
        <StatusBadge status={status} />
      </td>

      <td className="py-3.5 pr-5 pl-3">
        <div className="flex items-center gap-5">
          <ArriveButton reservation={reservation} onArrive={onArrive} />
          <CancelButton reservation={reservation} onCancel={onCancel} />
        </div>
      </td>
    </tr>
  )
}

export default function ReservationTable({ reservations, onArrive, onCancel, onEdit }) {
  return (
    <div className="overflow-x-auto rounded-button border border-border">
      <table className="w-full min-w-205 border-collapse text-left">
        <thead className="bg-surface">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-3 py-3 text-xs font-semibold tracking-wide text-muted uppercase ${column.className}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border border-t border-border">
          {reservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              onArrive={onArrive}
              onCancel={onCancel}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>

      {reservations.length === 0 && (
        <p className="px-5 py-12 text-center text-sm text-muted">Aucune réservation à afficher.</p>
      )}
    </div>
  )
}
