import { findOccasion } from '../../lib/occasions'

// "Sans téléphone • Anniversaire 🎂" line under a guest name.
export default function GuestMeta({ phone, occasion, className = '' }) {
  const known = findOccasion(occasion)
  const Icon = known?.icon

  return (
    <div className={`flex items-center gap-1.5 text-xs whitespace-nowrap text-muted ${className}`}>
      <span>{phone || 'Sans téléphone'}</span>
      {occasion && (
        <>
          <span aria-hidden="true">•</span>
          <span>{occasion}</span>
          {Icon && <Icon className={`size-3.5 ${known.iconClass}`} strokeWidth={2} />}
        </>
      )}
    </div>
  )
}
