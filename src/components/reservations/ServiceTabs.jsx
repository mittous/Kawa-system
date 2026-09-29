function plural(count, singular, pluralForm) {
  return count > 1 ? pluralForm : singular
}

export default function ServiceTabs({ services, statsByService, activeId, onChange }) {
  return (
    <div role="tablist" aria-label="Service" className="grid grid-cols-2 gap-3">
      {services.map((service) => {
        const isActive = service.id === activeId
        const { reservations, covers } = statsByService[service.id]

        return (
          <button
            key={service.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(service.id)}
            className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-panel border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? 'border-primary bg-card text-ink'
                : 'border-border bg-border/40 text-muted hover:bg-card'
            }`}
          >
            <span className="text-base font-semibold">{service.label}</span>
            <span className="text-[13px] text-muted">
              {reservations} {plural(reservations, 'résa', 'résas')} • {covers} couv.
            </span>
          </button>
        )
      })}
    </div>
  )
}
