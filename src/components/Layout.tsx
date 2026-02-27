import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <main className="flex-1 min-h-screen px-16 py-12">
        <Outlet />
      </main>
    </div>
  )
}
