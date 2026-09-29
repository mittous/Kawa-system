import { toISODate } from '../lib/date'

// Mock data matching the Figma mockup. Replace with API data later.
// status: 'confirmed' | 'arrived' | 'waiting' | 'cancelled'
// tables: [] means the reservation has no table assigned yet.
// Optional fields: phone, vip, allergies, occasion, comments.

export const SERVICES = [
  { id: 'lunch', label: 'Déjeuner', period: 'midi' },
  { id: 'dinner', label: 'Dîner', period: 'soir' },
]

// Every sample reservation is dated today, so the demo always opens with data.
const TODAY = toISODate(new Date())

const LUNCH = [
  { id: 1, time: '19:00', name: 'Maria Suel', phone: null, guests: 3, tables: ['T45'], status: 'confirmed' },
  { id: 2, time: '19:00', name: 'Thomas Renard', phone: null, guests: 2, tables: ['T12'], status: 'arrived' },
  { id: 3, time: '19:00', name: 'Famille Benali', phone: null, guests: 8, tables: [], status: 'confirmed', occasion: 'Anniversaire' },
  { id: 4, time: '19:30', name: 'Claire Dumont', phone: null, guests: 2, tables: ['T7'], status: 'cancelled' },
  { id: 5, time: '19:30', name: 'Kevin Peraud', phone: null, guests: 4, tables: [], status: 'waiting' },
  { id: 6, time: '20:00', name: 'Sofia Marchetti', phone: null, guests: 2, tables: ['T21'], status: 'confirmed' },
  { id: 7, time: '20:00', name: 'Julien Ferrand', phone: null, guests: 5, tables: ['T30'], status: 'confirmed' },
  { id: 8, time: '20:00', name: 'Anaïs Lefort', phone: null, guests: 2, tables: ['T9'], status: 'arrived' },
  { id: 9, time: '20:30', name: 'Groupe Novatek', phone: null, guests: 12, tables: ['T40', 'T41'], status: 'confirmed' },
  { id: 10, time: '20:30', name: 'Marc Oliveira', phone: null, guests: 2, tables: [], status: 'waiting' },
  { id: 11, time: '21:00', name: 'Léa Bonnet', phone: null, guests: 3, tables: ['T15'], status: 'confirmed' },
  { id: 12, time: '21:00', name: 'Hugo Vasseur', phone: null, guests: 2, tables: ['T18'], status: 'confirmed' },
]

export const RESERVATIONS = {
  lunch: LUNCH.map((reservation) => ({ ...reservation, date: TODAY })),
  dinner: [],
}
