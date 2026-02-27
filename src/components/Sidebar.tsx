import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Type, Layers } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Text Effects', icon: Type },
  { to: '/backgrounds', label: 'Backgrounds', icon: Layers },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 border-r border-border bg-surface-raised flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <span className="text-base font-semibold">P</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary leading-tight">
              Playground
            </h1>
            <p className="text-base text-text-tertiary font-light mt-0.5">
              Component Lab
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <Separator />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 pt-6 space-y-[4px]">
        <p className="px-3 pb-2 text-base uppercase tracking-widest text-text-tertiary font-medium">
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
