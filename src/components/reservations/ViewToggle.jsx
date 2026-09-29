const OPTIONS = [
  { id: 'plan', label: 'Plan' },
  { id: 'list', label: 'Liste' },
]

export default function ViewToggle({ value, onChange }) {
  return (
    <div role="group" aria-label="Affichage" className="flex rounded-button border border-border-strong bg-card p-1">
      {OPTIONS.map((option) => {
        const isActive = option.id === value

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`h-8 rounded-control px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive ? 'bg-primary text-on-primary' : 'text-ink hover:bg-surface'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
