// The restaurant's tables, used by the reservation form's "Table" dropdown
// and by the floor plan to size each table.
// seats must be 4, 6 or 8: the table shapes the floor plan can draw.

export const TABLES = [
  { id: 'T1', seats: 4, zone: 'Salle' },
  { id: 'T2', seats: 4, zone: 'Salle' },
  { id: 'T3', seats: 4, zone: 'Salle' },
  { id: 'T4', seats: 4, zone: 'Salle' },
  { id: 'T5', seats: 6, zone: 'Salle' },
  { id: 'T6', seats: 6, zone: 'Salle' },
  { id: 'T7', seats: 4, zone: 'Salle' },
  { id: 'T8', seats: 8, zone: 'Salle' },
  { id: 'T9', seats: 4, zone: 'Salle' },
  { id: 'T12', seats: 4, zone: 'Salle' },
  { id: 'T15', seats: 4, zone: 'Salle' },
  { id: 'T18', seats: 4, zone: 'Salle' },
  { id: 'T21', seats: 4, zone: 'Salle' },
  { id: 'T30', seats: 6, zone: 'Salle' },
  { id: 'T40', seats: 6, zone: 'Terrasse' },
  { id: 'T41', seats: 6, zone: 'Terrasse' },
  { id: 'T45', seats: 4, zone: 'Terrasse' },
]

export const TABLE_BY_ID = new Map(TABLES.map((table) => [table.id, table]))
