const formatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// "lundi 21 septembre 2026" -> "Lundi 21 septembre 2026"
export function formatLongDate(date) {
  const text = formatter.format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

const shortFormatter = new Intl.DateTimeFormat('fr-FR')

// "2026-09-21" -> "21/09/2026", whatever the browser language.
export function formatShortDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return shortFormatter.format(new Date(year, month - 1, day))
}

// Local date as "2026-09-21", the format of <input type="date">.
export function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
