import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Type, Layers, Play, FlaskConical } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Text Effects', icon: Type },
  { to: '/backgrounds', label: 'Backgrounds', icon: Layers },
  { to: '/lottie-files', label: 'Lottie Files', icon: Play },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
]

interface SidebarProps {
  open: boolean
  overlay?: boolean
  onClose?: () => void
}

export default function Sidebar({ open, overlay, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-screen w-[280px] shrink-0 border-r border-border bg-surface-raised flex flex-col transition-all duration-300 ease-out',
        overlay ? 'fixed top-0 left-0 z-40 shadow-2xl' : 'sticky top-0'
      )}
      style={
        overlay
          ? { transform: open ? 'translateX(0)' : 'translateX(-100%)' }
          : { marginLeft: open ? 0 : -280 }
      }
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex flex-col gap-1">
          <img src="/devcon-logo.svg" alt="Devcon" className="h-8 w-auto self-start" />
          <p className="text-lg text-text-primary font-bold">
            Component Lab
          </p>
        </div>
      </div>

      <div className="px-6">
        <Separator />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 pt-6 space-y-[4px]">
        <p className="px-3 pb-2 text-sm uppercase tracking-widest text-text-tertiary font-semibold">
          Pages
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end onClick={overlay ? onClose : undefined}>
            {({ isActive }) => (
              <Button
                variant="ghost"
                asChild={false}
                className={cn(
                  'w-full justify-start gap-3 h-11 px-3 text-base font-normal rounded-lg',
                  isActive
                    ? 'bg-nav-active text-text-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={cn(
                    isActive ? 'text-text-primary' : 'text-text-tertiary'
                  )}
                />
                {label}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
