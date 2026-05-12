import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen, Menu, X } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile(1024)

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isMobile, sidebarOpen])

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
      <Sidebar open={sidebarOpen} overlay={isMobile} onClose={() => setSidebarOpen(false)} />

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="flex-1 min-h-screen px-4 md:px-8 lg:px-16 py-6 md:py-8 lg:py-12">
        <Outlet />
      </main>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen((v) => !v)}
        className={cn(
          'fixed z-40 transition-[left] duration-300 ease-out',
          isMobile
            ? 'top-4 right-4 bg-black text-white hover:bg-black/90'
            : 'bg-surface-raised text-text-secondary hover:text-text-primary'
        )}
        style={isMobile ? undefined : { top: 28, left: sidebarOpen ? 228 : 16 }}
        aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isMobile ? (
          sidebarOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />
        ) : (
          sidebarOpen ? <PanelLeftClose className="size-5" strokeWidth={1.5} /> : <PanelLeftOpen className="size-5" strokeWidth={1.5} />
        )}
      </Button>
    </div>
  )
}
