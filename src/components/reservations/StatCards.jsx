const CARDS = [
  { key: 'covers', label: 'Couverts', highlight: true },
  { key: 'reservations', label: 'Réservations', valueClass: 'text-ink' },
  { key: 'unassigned', label: 'Tables non assignées', valueClass: 'text-primary' },
  { key: 'waiting', label: 'En attente', valueClass: 'text-waiting-fg' },
]

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map(({ key, label, highlight, valueClass }) => (
        <div
          key={key}
          className={`flex h-[88px] flex-col justify-center gap-2 rounded-panel border px-4 ${
            highlight ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card'
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              highlight ? 'text-on-primary/90' : 'text-muted'
            }`}
          >
            {label}
          </span>
          <span className={`text-[28px] leading-none font-bold ${highlight ? 'text-on-primary' : valueClass}`}>
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  )
}
