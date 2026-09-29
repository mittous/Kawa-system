import { TABLE_BY_ID } from '../data/tables'

// Builds the floor plan from the reservations: one table per table number,
// sized from the table list (or the guest count for unknown tables) and
// placed automatically in rows.

// How far chairs stick out from the table top, in px.
export const SEAT_DEPTH = 12

export const TABLE_SHAPES = {
  4: { seats: 4, width: 80, height: 80, seatsPerSide: 1, seatLength: 28 },
  6: { seats: 6, width: 108, height: 88, seatsPerSide: 2, seatLength: 28 },
  8: { seats: 8, width: 140, height: 72, seatsPerSide: 3, seatLength: 24 },
}

const LAYOUT = {
  slotWidth: 220,
  maxPerRow: 4,
  rowGap: 40,
  padding: 24,
}

function shapeForGuests(guests) {
  if (guests <= 4) return TABLE_SHAPES[4]
  if (guests <= 6) return TABLE_SHAPES[6]
  return TABLE_SHAPES[8]
}

function tableNumber(id) {
  return Number.parseInt(id.replace(/\D/g, ''), 10) || 0
}

export function buildTables(reservations) {
  const tables = new Map()

  for (const reservation of reservations) {
    // A group on several tables is split evenly: 12 guests on 2 tables = 6 seats each.
    const guestsPerTable = Math.ceil(reservation.guests / Math.max(reservation.tables.length, 1))

    for (const id of reservation.tables) {
      const existing = tables.get(id)
      // A cancelled booking never hides an active one on the same table.
      if (existing && existing.reservation.status !== 'cancelled') continue
      const known = TABLE_BY_ID.get(id)
      const shape = TABLE_SHAPES[known?.seats] ?? shapeForGuests(guestsPerTable)
      tables.set(id, { id, reservation, shape })
    }
  }

  return [...tables.values()].sort(
    (a, b) => a.shape.seats - b.shape.seats || tableNumber(a.id) - tableNumber(b.id),
  )
}

// Rows of up to 4 tables, a new row for each table size, every row centered.
export function autoLayout(tables) {
  const rows = []
  for (const table of tables) {
    const row = rows.at(-1)
    if (row && row.seats === table.shape.seats && row.tables.length < LAYOUT.maxPerRow) {
      row.tables.push(table)
    } else {
      rows.push({ seats: table.shape.seats, tables: [table] })
    }
  }

  const width = LAYOUT.slotWidth * LAYOUT.maxPerRow + LAYOUT.padding * 2
  const positions = {}
  let top = LAYOUT.padding

  for (const row of rows) {
    const rowHeight = Math.max(...row.tables.map((t) => t.shape.height)) + SEAT_DEPTH * 2
    const rowStart = (width - row.tables.length * LAYOUT.slotWidth) / 2

    row.tables.forEach((table, index) => {
      positions[table.id] = {
        x: rowStart + index * LAYOUT.slotWidth + (LAYOUT.slotWidth - table.shape.width) / 2,
        y: top + (rowHeight - table.shape.height) / 2,
      }
    })

    top += rowHeight + LAYOUT.rowGap
  }

  const height = rows.length > 0 ? top - LAYOUT.rowGap + LAYOUT.padding : 240
  return { width, height, positions }
}

// Keeps a dragged table, chairs included, inside the room.
export function dragBounds(shape, room) {
  return {
    left: SEAT_DEPTH,
    top: SEAT_DEPTH,
    right: room.width - shape.width - SEAT_DEPTH,
    bottom: room.height - shape.height - SEAT_DEPTH,
  }
}
