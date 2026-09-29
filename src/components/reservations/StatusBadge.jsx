import { STATUS } from '../../lib/status'

export default function StatusBadge({ status }) {
  const { label, badge } = STATUS[status]

  return (
    <span className={`inline-flex h-7 items-center rounded-chip px-2.5 text-xs font-semibold whitespace-nowrap ${badge}`}>
      {label}
    </span>
  )
}
