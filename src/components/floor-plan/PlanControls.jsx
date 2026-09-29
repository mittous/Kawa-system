import { Ellipsis, Minus, Plus } from 'lucide-react'

const iconButton =
  'flex size-8 items-center justify-center text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-muted/50 disabled:hover:bg-transparent'

export default function PlanControls({ canZoomIn, canZoomOut, onZoomIn, onZoomOut, isEditing, onToggleEditing }) {
  return (
    <div data-no-pan className="absolute right-4 bottom-4 flex flex-col items-center gap-2">
      <div className="flex flex-col overflow-hidden rounded-button border border-border-strong bg-card shadow-xs">
        <button type="button" onClick={onZoomIn} disabled={!canZoomIn} aria-label="Zoomer" className={iconButton}>
          <Plus className="size-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          aria-label="Dézoomer"
          className={`${iconButton} border-t border-border`}
        >
          <Minus className="size-4" strokeWidth={2.5} />
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleEditing}
        aria-pressed={isEditing}
        aria-label={isEditing ? 'Terminer le déplacement des tables' : 'Déplacer les tables'}
        title={isEditing ? 'Terminer le déplacement' : 'Déplacer les tables'}
        className={`flex size-8 items-center justify-center rounded-button border shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isEditing
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border-strong bg-card text-ink hover:bg-surface'
        }`}
      >
        <Ellipsis className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
