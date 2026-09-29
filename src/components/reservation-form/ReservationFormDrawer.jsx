import { AnimatePresence, motion } from 'motion/react'
import ReservationForm from './ReservationForm'

// Side panel that slides in from the right, like the mockup.
// The page behind stays usable: clicking another reservation switches the form to it.
export default function ReservationFormDrawer({ form, reservation, defaultDate, serviceReservations, onClose, onSave }) {
  const formKey = form?.mode === 'edit' ? `edit-${form.id}` : 'create'

  return (
    <AnimatePresence>
      {form && (
        <motion.aside
          role="dialog"
          aria-labelledby="reservation-form-title"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 40 }}
          className="fixed inset-y-0 right-0 z-40 w-120 max-w-full border-l border-border bg-card shadow-[-16px_0_40px_-24px_rgb(17_22_19/0.3)]"
        >
          <ReservationForm
            key={formKey}
            mode={form.mode}
            reservation={reservation}
            defaultDate={defaultDate}
            serviceReservations={serviceReservations}
            onCancel={onClose}
            onSave={onSave}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
