import { useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { STATUS } from '../../lib/status'

// A pointer that moves further than this between press and release was a pan, not a tap.
const TAP_TOLERANCE = 6

function SeatRow({ count, length, vertical, className, seatClass }) {
  return (
    <span className={`pointer-events-none absolute flex ${vertical ? 'flex-col justify-center' : 'justify-evenly'} ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`block rounded-seat border-[1.5px] ${seatClass}`}
          style={vertical ? { width: 12, height: length } : { width: length, height: 12 }}
        />
      ))}
    </span>
  )
}

export default function FloorTable({
  table,
  position,
  bounds,
  isEditing,
  isSelected,
  isDimmed,
  onSelect,
  onMove,
}) {
  const { id, shape, reservation } = table
  const colors = STATUS[reservation.status]
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)
  const pointerStart = useRef(null)

  useEffect(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position.x, position.y, x, y])

  function handleClick(event) {
    const start = pointerStart.current
    pointerStart.current = null
    if (isEditing) return

    // event.detail is 0 for keyboard activation, which is always a tap.
    const moved = event.detail !== 0 && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_TOLERANCE
    if (!moved) onSelect(reservation.id)
  }

  return (
    <motion.button
      type="button"
      data-no-pan={isEditing || undefined}
      aria-label={`Table ${id}, ${reservation.name}, ${colors.label}`}
      onPointerDown={(event) => {
        pointerStart.current = { x: event.clientX, y: event.clientY }
      }}
      onClick={handleClick}
      drag={isEditing}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onDragEnd={() => onMove(id, { x: x.get(), y: y.get() })}
      whileHover={isEditing ? undefined : { scale: 1.04 }}
      whileDrag={{ scale: 1.06, zIndex: 20 }}
      style={{ x, y, width: shape.width, height: shape.height }}
      className={`absolute top-0 left-0 rounded-table transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
        isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
    >
      <SeatRow count={shape.seatsPerSide} length={shape.seatLength} className="inset-x-0 -top-3" seatClass={colors.seat} />
      <SeatRow count={shape.seatsPerSide} length={shape.seatLength} className="inset-x-0 -bottom-3" seatClass={colors.seat} />
      <SeatRow count={1} length={28} vertical className="inset-y-0 -left-3" seatClass={colors.seat} />
      <SeatRow count={1} length={28} vertical className="inset-y-0 -right-3" seatClass={colors.seat} />

      <span
        className={`relative flex size-full items-center justify-center rounded-table border-2 text-[11px] font-bold transition-shadow ${colors.table} ${
          isSelected ? `ring-2 ring-[${colors.table}] ring-offset-2 ring-offset-surface` : ''
        } ${isEditing ? 'shadow-md' : ''}`}
      >
        {id}
      </span>
    </motion.button>
  )
}
