import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useDragControls, useMotionValue } from 'motion/react'
import { Move } from 'lucide-react'
import { autoLayout, buildTables, dragBounds } from '../../lib/floorPlan'
import FloorTable from './FloorTable'
import PlanControls from './PlanControls'
import ReservationDetailsCard from '../reservations/ReservationDetailsCard'

// Zoom is relative to the "fit" size, where the whole room is visible.
const ZOOM_STEP = 1.25
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5

export default function FloorPlan({ reservations, highlightedIds, positions, onTableMove, onArrive, onCancel, onEdit }) {
  const viewportRef = useRef(null)
  const [fitScale, setFitScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const panControls = useDragControls()
  const panX = useMotionValue(0)
  const panY = useMotionValue(0)

  const tables = buildTables(reservations)
  const room = autoLayout(tables)
  const scale = fitScale * zoom
  const selectedReservation = reservations.find((r) => r.id === selectedId)

  // Shrink the room to fit small screens. Never enlarge it past 100%.
  useEffect(() => {
    const viewport = viewportRef.current
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setFitScale(Math.min(1, width / room.width, height / room.height))
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [room.width, room.height])

  function zoomBy(factor) {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current * factor)))
  }

  function toggleEditing() {
    setIsEditing((current) => !current)
    setSelectedId(null)
  }

  // Dragging empty floor pans the view. Tables being moved, the controls
  // and the details card opt out with data-no-pan.
  function handlePointerDown(event) {
    if (event.target.closest('[data-no-pan]')) return
    panControls.start(event)
  }

  if (tables.length === 0) {
    return (
      <div className="flex h-115 items-center justify-center rounded-panel bg-surface text-sm text-muted">
        Aucune table réservée pour ce service.
      </div>
    )
  }

  return (
    <div
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      className={`relative h-115 touch-none overflow-hidden rounded-panel bg-surface select-none ${
        isEditing ? 'outline-2 -outline-offset-2 outline-primary/40 outline-dashed' : ''
      } cursor-grab active:cursor-grabbing`}
    >
      {/* Drag distances are divided by the zoom so a dragged table stays under the pointer. */}
      <MotionConfig transformPagePoint={(point) => ({ x: point.x / scale, y: point.y / scale })}>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          <motion.div
            className="absolute inset-0"
            drag
            dragListener={false}
            dragControls={panControls}
            dragMomentum={false}
            style={{ x: panX, y: panY }}
          >
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: room.width,
                height: room.height,
                marginLeft: -room.width / 2,
                marginTop: -room.height / 2,
              }}
            >
              {tables.map((table) => (
                <FloorTable
                  key={table.id}
                  table={table}
                  position={positions[table.id] ?? room.positions[table.id]}
                  bounds={dragBounds(table.shape, room)}
                  isEditing={isEditing}
                  isSelected={table.reservation.id === selectedId}
                  isDimmed={!highlightedIds.has(table.reservation.id)}
                  onSelect={setSelectedId}
                  onMove={onTableMove}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </MotionConfig>

      {isEditing && (
        <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-button border border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-xs">
          <Move className="size-3.5" strokeWidth={2.5} />
          Mode déplacement : faites glisser les tables
        </div>
      )}

      <PlanControls
        canZoomIn={zoom < MAX_ZOOM}
        canZoomOut={zoom > MIN_ZOOM}
        onZoomIn={() => zoomBy(ZOOM_STEP)}
        onZoomOut={() => zoomBy(1 / ZOOM_STEP)}
        isEditing={isEditing}
        onToggleEditing={toggleEditing}
      />

      <AnimatePresence>
        {selectedReservation && !isEditing && (
          <ReservationDetailsCard
            key={selectedReservation.id}
            reservation={selectedReservation}
            onClose={() => setSelectedId(null)}
            onArrive={onArrive}
            onCancel={onCancel}
            onEdit={(id) => {
              setSelectedId(null)
              onEdit(id)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
