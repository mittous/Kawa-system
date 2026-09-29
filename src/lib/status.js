// Single source of truth for reservation statuses.
// Class names are written in full so Tailwind can detect them.
//   badge   status pill in the list and the details card
//   table   table top on the floor plan, seat: its chairs
//   choice  status button in the reservation form, with its idle and active borders

export const STATUS = {
  confirmed: {
    label: 'Confirmée',
    badge: 'bg-confirmed-bg text-confirmed-fg',
    table: 'bg-confirmed-bg border-confirmed-fg/40 text-confirmed-fg',
    seat: 'bg-confirmed-bg border-confirmed-fg/40',
    choice: 'bg-confirmed-bg text-confirmed-fg',
    choiceIdle: 'border-confirmed-fg/35',
    choiceActive: 'border-confirmed-fg',
  },
  arrived: {
    label: 'Arrivée',
    badge: 'bg-arrived-bg text-arrived-fg',
    table: 'bg-arrived-bg border-arrived-fg/40 text-arrived-fg',
    seat: 'bg-arrived-bg border-arrived-fg/40',
    choice: 'bg-arrived-bg text-arrived-fg',
    choiceIdle: 'border-arrived-fg/35',
    choiceActive: 'border-arrived-fg',
  },
  waiting: {
    label: 'En attente',
    badge: 'bg-waiting-bg text-waiting-fg',
    table: 'bg-waiting-bg border-waiting-fg/40 text-waiting-fg',
    seat: 'bg-waiting-bg border-waiting-fg/40',
    choice: 'bg-waiting-bg text-waiting-fg',
    choiceIdle: 'border-waiting-fg/35',
    choiceActive: 'border-waiting-fg',
  },
  cancelled: {
    label: 'Annulée',
    badge: 'bg-cancelled-bg text-cancelled-fg',
    table: 'bg-cancelled-bg border-cancelled-fg/40 text-cancelled-fg',
    seat: 'bg-cancelled-bg border-cancelled-fg/40',
    choice: 'bg-cancelled-bg text-cancelled-fg',
    choiceIdle: 'border-cancelled-fg/35',
    choiceActive: 'border-cancelled-fg',
  },
}

export const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'confirmed', label: 'Confirmée' },
  { id: 'arrived', label: 'Arrivée' },
  { id: 'cancelled', label: 'Annulée / Libre' },
  { id: 'waiting', label: 'En attente' },
]
