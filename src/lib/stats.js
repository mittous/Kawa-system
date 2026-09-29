export function getServiceStats(reservations) {
  const active = reservations.filter((r) => r.status !== 'cancelled')

  return {
    reservations: reservations.length,
    covers: reservations.reduce((sum, r) => sum + r.guests, 0),
    unassigned: active.filter((r) => r.tables.length === 0).length,
    waiting: reservations.filter((r) => r.status === 'waiting').length,
  }
}

export function countByStatus(reservations) {
  const counts = { all: reservations.length }
  for (const r of reservations) {
    counts[r.status] = (counts[r.status] ?? 0) + 1
  }
  return counts
}
