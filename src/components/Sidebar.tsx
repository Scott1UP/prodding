import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Type, Layers, Play, FlaskConical, Share2, PanelLeftOpen, PanelLeftClose } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Text Effects', icon: Type },
  { to: '/backgrounds', label: 'Backgrounds', icon: Layers },
  { to: '/lottie-files', label: 'Lottie Files', icon: Play },
  { to: '/socials', label: 'Socials', icon: Share2 },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
]

interface SidebarProps {
  open: boolean
  overlay?: boolean
  onClose?: () => void
  onToggle?: () => void
}

export default function Sidebar({ open, overlay, onClose, onToggle }: SidebarProps) {
  const isMini = !overlay && !open

  return (
    <aside
      className={cn(
        'h-screen shrink-0 border-r border-border bg-surface-raised flex flex-col transition-all duration-300 ease-out',
        overlay ? 'fixed top-0 left-0 z-40 shadow-2xl w-[280px]' : 'sticky top-0',
        !overlay && (open ? 'w-[280px]' : 'w-[72px]')
      )}
      style={
        overlay
          ? { transform: open ? 'translateX(0)' : 'translateX(-100%)' }
          : undefined
      }
    >
      {isMini ? (
        <>
          {/* Logo glyph only */}
          <div className="pt-8 pb-6 flex justify-center">
            <svg
              viewBox="0 0 93 160"
              className="h-8 w-auto text-text-primary"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Devcon"
              role="img"
            >
              <path d="M93.0242 81.6344L46.5002 0L0 81.6344L46.524 111.584L93.0242 81.6344ZM49.8791 54.2933V19.6206L79.2615 71.1769L49.8791 54.2933ZM82.0141 80.6205L49.8791 101.319V62.1567L82.0141 80.6205ZM43.1195 54.2933L13.7677 71.1597L43.1195 19.6292V54.2933V54.2933ZM43.1195 62.1567V101.289L10.9999 80.6119L43.1195 62.1567Z" fill="currentColor"/>
              <path d="M46.4998 121.26L0.0268555 91.3105L46.5015 160L93.0255 91.3105L46.4998 121.26ZM42.8689 127.025L43.1208 127.188V142.899L24.2736 115.042L42.8689 127.025ZM68.7668 115.03L49.8804 142.913V127.186L50.1307 127.025L68.7668 115.03Z" fill="currentColor"/>
            </svg>
          </div>

          {/* Toggle */}
          <div className="px-4 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="bg-surface-raised text-text-secondary hover:text-text-primary"
                  aria-label="Show sidebar"
                >
                  <PanelLeftOpen className="size-5" strokeWidth={1.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>

          {/* Divider */}
          <div className="px-4 pt-6">
            <Separator />
          </div>

          {/* Nav icons */}
          <nav className="flex-1 px-4 pt-6 space-y-1 flex flex-col items-center">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <NavLink to={to} end aria-label={label}>
                    {({ isActive }) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild={false}
                        className={cn(
                          isActive
                            ? 'bg-nav-active text-text-primary'
                            : 'text-text-tertiary hover:text-text-primary'
                        )}
                      >
                        <Icon className="size-5" strokeWidth={1.5} />
                      </Button>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </>
      ) : (
        <>
          {/* Logo */}
          <div className="px-6 pt-8 pb-6 relative">
            <div className="flex flex-col gap-1">
              <img src="/devcon-logo.svg" alt="Devcon" className="h-8 w-auto self-start" />
              <p className="text-lg text-text-primary font-bold">
                Component Lab
              </p>
            </div>
            {!overlay && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="absolute top-5 right-4 bg-surface-raised text-text-secondary hover:text-text-primary"
                aria-label="Hide sidebar"
              >
                <PanelLeftClose className="size-5" strokeWidth={1.5} />
              </Button>
            )}
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
        </>
      )}
    </aside>
  )
}
