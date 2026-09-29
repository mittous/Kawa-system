import { useRef } from 'react'
import { CalendarDays, ChevronDown, Clock } from 'lucide-react'
import { formatShortDate } from '../../lib/date'

// Shared form building blocks.

export const inputClass =
  'h-9.5 w-full rounded-control border border-border-strong bg-card px-3 text-sm text-ink transition-colors placeholder:text-muted/80 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none aria-invalid:border-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/15'

// Label + control + error message.
// Pass htmlFor for a single input, or labelId for a group of buttons.
export function FormField({ label, required, htmlFor, labelId, error, className = '', children }) {
  const labelClass = 'mb-1.5 block text-[13px] leading-4 font-medium text-muted'
  const text = (
    <>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </>
  )

  return (
    <div className={className}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {text}
        </label>
      ) : (
        <span id={labelId} className={labelClass}>
          {text}
        </span>
      )}
      {children}
      {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}

// Native <select> with the chevron (or any icon) drawn on the right.
export function Select({ icon: Icon = ChevronDown, className = '', children, ...props }) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-9 ${className}`}>
        {children}
      </select>
      <Icon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
}

// Always shows the date as "21/09/2026", whatever the browser language.
// The native date picker still opens on click; value is "2026-09-21".
export function DateInput({ id, name, value, onChange, invalid }) {
  const inputRef = useRef(null)

  function openPicker() {
    try {
      inputRef.current.showPicker()
    } catch {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        onClick={openPicker}
        aria-invalid={invalid || undefined}
        className={`${inputClass} flex items-center justify-between text-left`}
      >
        <span className={value ? '' : 'text-muted/80'}>{value ? formatShortDate(value) : 'jj/mm/aaaa'}</span>
        <CalendarDays className="size-4 text-muted" />
      </button>
      <input
        ref={inputRef}
        type="date"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
      />
    </div>
  )
}

// 24-hour time slots, "11:00" to "23:45" every 15 minutes.
export const TIME_SLOTS = Array.from({ length: (24 - 11) * 4 }, (_, index) => {
  const minutes = 11 * 60 + index * 15
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`
})

export function TimeSelect({ value, className = '', ...props }) {
  // Keep an existing time that isn't on a 15-minute slot selectable.
  const slots = value && !TIME_SLOTS.includes(value) ? [...TIME_SLOTS, value].sort() : TIME_SLOTS

  return (
    <Select {...props} value={value} icon={Clock} className={`${value ? '' : 'text-muted/80'} ${className}`}>
      <option value="" disabled>
        --:--
      </option>
      {slots.map((slot) => (
        <option key={slot} value={slot} className="text-ink">
          {slot}
        </option>
      ))}
    </Select>
  )
}

export function Switch({ id, checked, onChange }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? 'bg-primary' : 'bg-border-strong'
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-card shadow-sm transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
