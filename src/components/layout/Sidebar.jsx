// Grey silhouette placeholder for the navigation sidebar.
const NAV_ITEM_WIDTHS = ['62%', '54%', '66%', '48%', '72%', '58%']

function Bar({ className = '' }) {
  return <div className={`rounded-full bg-skeleton ${className}`} />
}

export default function Sidebar() {
  return (
    <aside
      aria-hidden="true"
      className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="size-6 rounded-control bg-skeleton" />
        <Bar className="h-4 w-32" />
      </div>

      <div className="mt-8 flex flex-col gap-1.5">
        {NAV_ITEM_WIDTHS.map((width, index) => (
          <div key={index} className="flex h-11 items-center gap-3 px-3">
            <div className="size-5 shrink-0 rounded-control bg-skeleton" />
            <div className="h-3 rounded-full bg-skeleton" style={{ width }} />
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 rounded-button border border-border p-3">
        <div className="size-9 shrink-0 rounded-full bg-skeleton" />
        <div className="flex flex-1 flex-col gap-2">
          <Bar className="h-3 w-24" />
          <Bar className="h-2.5 w-16" />
        </div>
      </div>
    </aside>
  )
}
