import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { TABLES, TABLE_BY_ID } from '../../data/tables'
import { STATUS } from '../../lib/status'
import { OCCASIONS, findOccasion } from '../../lib/occasions'
import { DateInput, FormField, Select, Switch, TimeSelect, inputClass } from '../ui/form'
import CloseButton from '../ui/CloseButton'

const STATUS_ORDER = ['confirmed', 'cancelled', 'arrived', 'waiting']
// Fields checked on save, in the order the cursor visits them when invalid.
const CHECKED_ORDER = ['name', 'date', 'guests', 'time', 'tables']

// Table dropdown values are table ids joined with "+", e.g. "T40+T41". "" = no table.
function toFormValues(reservation, defaultDate) {
  return {
    name: reservation?.name ?? '',
    phone: reservation?.phone ?? '',
    date: reservation?.date ?? defaultDate,
    guests: String(reservation?.guests ?? 2),
    time: reservation?.time ?? '',
    tables: reservation?.tables.join('+') ?? '',
    status: reservation?.status ?? 'confirmed',
    vip: reservation?.vip ?? false,
    allergies: reservation?.allergies ?? '',
    occasion: reservation?.occasion ?? '',
    comments: reservation?.comments ?? '',
  }
}

function toReservation(values) {
  return {
    name: values.name.trim(),
    phone: values.phone.trim() || null,
    date: values.date,
    guests: Number(values.guests),
    time: values.time,
    tables: values.tables ? values.tables.split('+') : [],
    status: values.status,
    vip: values.vip,
    allergies: values.allergies.trim(),
    occasion: values.occasion.trim(),
    comments: values.comments.trim(),
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Indiquez le nom du client.'
  if (!values.date) errors.date = 'Choisissez une date.'
  const guests = Number(values.guests)
  if (!Number.isInteger(guests) || guests < 1) errors.guests = 'Au moins 1 couvert.'
  if (!values.time) errors.time = 'Choisissez une heure.'
  return errors
}

function seatsOf(tableValue) {
  return tableValue
    .split('+')
    .reduce((sum, id) => sum + (TABLE_BY_ID.get(id)?.seats ?? 0), 0)
}

function tableLabel(tableValue) {
  const ids = tableValue.split('+')
  const zone = TABLE_BY_ID.get(ids[0])?.zone
  const seats = seatsOf(tableValue)
  return [ids.join(' + '), seats ? `${seats} couverts` : null, zone].filter(Boolean).join(' · ')
}

export default function ReservationForm({ mode, reservation, defaultDate, serviceReservations, onCancel, onSave }) {
  const [values, setValues] = useState(() => toFormValues(reservation, defaultDate))
  const [errors, setErrors] = useState({})
  const initialTables = useRef(values.tables).current

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Tables already booked that day by another active reservation of this service.
  // Cancelled reservations free their table.
  const occupied = new Set(
    serviceReservations
      .filter((r) => r.date === values.date && r.id !== reservation?.id && r.status !== 'cancelled')
      .flatMap((r) => r.tables),
  )
  const isTaken = (tableValue) => tableValue.split('+').some((id) => occupied.has(id))

  // The dropdown only offers free tables.
  const tableOptions = TABLES.filter((table) => !occupied.has(table.id)).map((table) => ({
    value: table.id,
    label: tableLabel(table.id),
  }))
  // Also keep the current choice visible when it isn't a single free table:
  // a combined assignment such as "T40+T41", or a table booked by someone
  // else after the date was changed.
  for (const value of new Set([values.tables, initialTables])) {
    if (!value || tableOptions.some((option) => option.value === value)) continue
    if (value !== values.tables && isTaken(value)) continue
    tableOptions.unshift({ value, label: tableLabel(value) + (isTaken(value) ? ' · déjà réservée' : '') })
  }

  function set(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    if (values.status !== 'cancelled' && values.tables && isTaken(values.tables)) {
      nextErrors.tables = 'Cette table est déjà réservée ce jour-là.'
    }
    setErrors(nextErrors)

    const firstInvalid = CHECKED_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(`reservation-${firstInvalid}`)?.focus()
      return
    }
    onSave(toReservation(values))
  }

  const seats = values.tables ? seatsOf(values.tables) : 0
  const guests = Number(values.guests)
  const isOverCapacity = seats > 0 && guests > seats

  const field = (name) => ({
    id: `reservation-${name}`,
    name,
    value: values[name],
    onChange: (event) => set(name, event.target.value),
    'aria-invalid': errors[name] ? true : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-7 pb-4">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="reservation-form-title" className="text-xl font-bold tracking-tight">
              {mode === 'edit' ? 'Modifier la réservation' : 'Nouvelle réservation'}
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">Informations client, timing et table attribuée</p>
          </div>
          <CloseButton onClick={onCancel} className="-mt-1 -mr-2" />
        </header>

        <div className="flex flex-col gap-3">
          <FormField label="Nom du client" required htmlFor="reservation-name" error={errors.name}>
            <input {...field('name')} autoFocus autoComplete="off" className={inputClass} />
          </FormField>

          <FormField label="Téléphone" htmlFor="reservation-phone">
            <input {...field('phone')} type="tel" placeholder="NA" autoComplete="off" className={inputClass} />
          </FormField>

          <FormField label="Date" required htmlFor="reservation-date" error={errors.date}>
            <DateInput
              id="reservation-date"
              name="date"
              value={values.date}
              onChange={(value) => set('date', value)}
              invalid={Boolean(errors.date)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Couverts" required htmlFor="reservation-guests" error={errors.guests}>
              <input {...field('guests')} type="number" min="1" max="99" inputMode="numeric" className={inputClass} />
            </FormField>
            <FormField label="Heure" required htmlFor="reservation-time" error={errors.time}>
              <TimeSelect {...field('time')} />
            </FormField>
          </div>

          <FormField label="Table" htmlFor="reservation-tables" error={errors.tables}>
            <Select {...field('tables')}>
              <option value="">Non assignée</option>
              {tableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {tableOptions.length === 0 && <option disabled>Aucune table libre ce jour-là</option>}
            </Select>
            {isOverCapacity && (
              <p className="mt-1 text-xs font-medium text-waiting-fg">
                Cette table compte {seats} places pour {guests} couverts.
              </p>
            )}
          </FormField>

          <FormField label="Statut" labelId="reservation-status-label">
            <div role="group" aria-labelledby="reservation-status-label" className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
              {STATUS_ORDER.map((status) => {
                const isActive = values.status === status
                const style = STATUS[status]

                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => set('status', status)}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-control border text-[13px] font-semibold transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${style.choice} ${
                      isActive ? `${style.choiceActive} ring-2 ring-current/20` : style.choiceIdle
                    }`}
                  >
                    {isActive && <Check className="size-3.5" strokeWidth={3} />}
                    {style.label}
                  </button>
                )
              })}
            </div>
          </FormField>

          <div className="flex h-11 items-center justify-between rounded-control border border-border-strong px-3">
            <label htmlFor="reservation-vip" className="text-sm font-semibold">
              VIP
            </label>
            <Switch id="reservation-vip" checked={values.vip} onChange={(checked) => set('vip', checked)} />
          </div>

          <FormField label="Allergies" htmlFor="reservation-allergies">
            <input {...field('allergies')} placeholder="gluten, lactose..." autoComplete="off" className={inputClass} />
          </FormField>

          <FormField label="Occasion" htmlFor="reservation-occasion">
            <input {...field('occasion')} autoComplete="off" className={inputClass} />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {OCCASIONS.map((occasion) => {
                const Icon = occasion.icon
                const isActive = findOccasion(values.occasion) === occasion

                return (
                  <button
                    key={occasion.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => set('occasion', occasion.label)}
                    className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${occasion.chip} ${
                      isActive ? 'ring-2 ring-current/30' : ''
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={2.25} />
                    {occasion.label}
                  </button>
                )
              })}
            </div>
          </FormField>

          <FormField label="Commentaires" htmlFor="reservation-comments">
            <textarea
              {...field('comments')}
              rows={3}
              placeholder="Leur offrir le café / digestif"
              className={`${inputClass} h-17 resize-none py-2.5`}
            />
          </FormField>
        </div>
      </div>

      <footer className="grid grid-cols-2 gap-3 px-5 pt-3 pb-5">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-button border border-border-strong bg-card text-sm font-semibold text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="h-10 rounded-button bg-primary text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Enregistrer
        </button>
      </footer>
    </form>
  )
}
