import { Plus, Search } from 'lucide-react'
import { FILTERS, STATUS } from '../../lib/status'

function FilterChip({ label, count, countClass, isActive, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-button border px-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isActive
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border-strong bg-card text-ink hover:bg-surface'
      }`}
    >
      {label}
      <span
        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
          isActive ? 'bg-card text-ink' : countClass
        }`}
      >
        {count}
      </span>
    </button>
  )
}

export default function ReservationToolbar({ search, onSearchChange, filter, onFilterChange, counts, onCreate }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <label className="relative">
        <span className="sr-only">Rechercher un client</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher client..."
          className="h-9 w-56 rounded-control border border-border-strong bg-card pr-3 pl-9 text-sm placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map(({ id, label }) => (
          <FilterChip
            key={id}
            label={label}
            count={counts[id] ?? 0}
            countClass={STATUS[id]?.badge ?? 'bg-surface text-ink'}
            isActive={filter === id}
            onClick={() => onFilterChange(id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="ml-auto flex h-10 items-center gap-2 rounded-button bg-primary px-4 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Plus className="size-4" strokeWidth={2.5} />
        Nouvelle résa
      </button>
    </div>
  )
}
