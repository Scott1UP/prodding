import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        if ((e.target as HTMLElement).isContentEditable) return
        setSidebarOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen bg-surface overflow-x-clip">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <main className="flex-1 min-h-screen px-16 py-12">
        <Outlet />
      </main>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed z-10 bg-surface-raised text-text-secondary hover:text-text-primary transition-[left] duration-300 ease-out"
        style={{ top: 28, left: sidebarOpen ? 228 : 16 }}
        aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="size-5" strokeWidth={1.5} />
        ) : (
          <PanelLeftOpen className="size-5" strokeWidth={1.5} />
        )}
      </Button>
    </div>
  )
}
