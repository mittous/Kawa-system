import { useState } from 'react'
import { RESERVATIONS, SERVICES } from '../data/reservations'
import { addDays, toISODate } from '../lib/date'
import { countByStatus, getServiceStats } from '../lib/stats'
import ReservationsHeader from '../components/reservations/ReservationsHeader'
import ServiceTabs from '../components/reservations/ServiceTabs'
import StatCards from '../components/reservations/StatCards'
import ReservationToolbar from '../components/reservations/ReservationToolbar'
import ViewToggle from '../components/reservations/ViewToggle'
import ReservationTable from '../components/reservations/ReservationTable'
import FloorPlan from '../components/floor-plan/FloorPlan'
import ReservationFormDrawer from '../components/reservation-form/ReservationFormDrawer'

// Accent- and case-insensitive search: "anais" matches "Anaïs".
function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function byTime(a, b) {
  return a.time.localeCompare(b.time)
}

export default function ReservationsPage() {
  const [date, setDate] = useState(() => new Date())
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [reservationsByService, setReservationsByService] = useState(RESERVATIONS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')
  // Tables moved on the plan, by table id. Kept here so positions survive
  // switching views. Not saved anywhere: a reload resets the room.
  const [tablePositions, setTablePositions] = useState({})
  // null when closed, { mode: 'create' } or { mode: 'edit', id } when open.
  const [form, setForm] = useState(null)

  const selectedDate = toISODate(date)
  const forSelectedDate = (list) => list.filter((r) => r.date === selectedDate).sort(byTime)

  const service = SERVICES.find((s) => s.id === serviceId)
  const reservations = forSelectedDate(reservationsByService[serviceId])

  const statsByService = Object.fromEntries(
    SERVICES.map((s) => [s.id, getServiceStats(forSelectedDate(reservationsByService[s.id]))]),
  )
  const counts = countByStatus(reservations)

  const query = normalize(search.trim())
  const visibleReservations = reservations.filter(
    (r) => (filter === 'all' || r.status === filter) && (!query || normalize(r.name).includes(query)),
  )
  const visibleIds = new Set(visibleReservations.map((r) => r.id))

  // The service a reservation belongs to. New reservations go to the selected service tab.
  const formServiceId =
    form?.mode === 'edit'
      ? SERVICES.find((s) => reservationsByService[s.id].some((r) => r.id === form.id))?.id ?? serviceId
      : serviceId
  const editedReservation =
    form?.mode === 'edit' ? reservationsByService[formServiceId].find((r) => r.id === form.id) : null

  function updateReservation(id, changes) {
    setReservationsByService((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([key, list]) => [
          key,
          list.map((r) => (r.id === id ? { ...r, ...changes } : r)),
        ]),
      ),
    )
  }

  function saveReservation(values) {
    if (form.mode === 'edit') {
      updateReservation(form.id, values)
    } else {
      setReservationsByService((previous) => {
        const nextId = Math.max(0, ...Object.values(previous).flat().map((r) => r.id)) + 1
        return { ...previous, [serviceId]: [...previous[serviceId], { id: nextId, ...values }] }
      })
    }
    setForm(null)
  }

  const editReservation = (id) => setForm({ mode: 'edit', id })
  const markArrived = (id) => updateReservation(id, { status: 'arrived' })
  const markCancelled = (id) => updateReservation(id, { status: 'cancelled' })

  return (
    <div className="flex flex-col gap-4">
      <ReservationsHeader
        date={date}
        onPrevious={() => setDate((d) => addDays(d, -1))}
        onNext={() => setDate((d) => addDays(d, 1))}
        onToday={() => setDate(new Date())}
      />

      <ServiceTabs
        services={SERVICES}
        statsByService={statsByService}
        activeId={serviceId}
        onChange={setServiceId}
      />

      <StatCards stats={statsByService[serviceId]} />

      <ReservationToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
        onCreate={() => setForm({ mode: 'create' })}
      />

      <section className="rounded-panel border border-border bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Plan de salle</h2>
            <p className="text-[13px] text-muted">Vue interactive du service de {service.period}</p>
          </div>
          <ViewToggle value={view} onChange={setView} />
        </div>

        {view === 'list' ? (
          <ReservationTable
            reservations={visibleReservations}
            onArrive={markArrived}
            onCancel={markCancelled}
            onEdit={editReservation}
          />
        ) : (
          <FloorPlan
            key={serviceId}
            reservations={reservations}
            highlightedIds={visibleIds}
            positions={tablePositions}
            onTableMove={(id, position) => setTablePositions((previous) => ({ ...previous, [id]: position }))}
            onArrive={markArrived}
            onCancel={markCancelled}
            onEdit={editReservation}
          />
        )}
      </section>

      <ReservationFormDrawer
        form={form}
        reservation={editedReservation}
        defaultDate={selectedDate}
        serviceReservations={reservationsByService[formServiceId]}
        onClose={() => setForm(null)}
        onSave={saveReservation}
      />
    </div>
  )
}
