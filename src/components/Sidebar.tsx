import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Type, Layers, Play } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Text Effects', icon: Type },
  { to: '/backgrounds', label: 'Backgrounds', icon: Layers },
  { to: '/lottie-files', label: 'Lottie Files', icon: Play },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 border-r border-border bg-surface-raised flex flex-col">
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
          <NavLink key={to} to={to} end>
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
