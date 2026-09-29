import Sidebar from './components/layout/Sidebar'
import ReservationsPage from './pages/ReservationsPage'

export default function App() {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-6 lg:px-8">
        <ReservationsPage />
      </main>
    </div>
  )
}
