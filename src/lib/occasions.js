import { BriefcaseBusiness, Cake } from 'lucide-react'

// Quick-pick occasions shown under the "Occasion" field.
// chip: colors of the shortcut chip. iconClass: icon color next to the guest name.
export const OCCASIONS = [
  {
    label: 'Anniversaire',
    icon: Cake,
    chip: 'bg-waiting-bg text-waiting-fg',
    iconClass: 'text-danger',
  },
  {
    label: "Dîner d'affaires",
    icon: BriefcaseBusiness,
    chip: 'bg-arrived-bg text-arrived-fg',
    iconClass: 'text-info',
  },
]

export function findOccasion(label) {
  const key = label?.trim().toLowerCase()
  return OCCASIONS.find((occasion) => occasion.label.toLowerCase() === key)
}
