import { ChevronDown, Globe, Mail } from 'lucide-react'

// Chrome heights (px) — used by the hero to size itself to the remaining viewport.
export const BANNER_H = 44
export const NAV_H = 64

const NAV_LINKS = ['About', 'Get involved', 'Archive']

export function AnnouncementBanner() {
  return (
    <div
      className="flex items-center justify-between px-6 md:px-16 bg-[#1a0d33] text-white"
      style={{ height: BANNER_H }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 rounded bg-[#ffa366] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#160b2b]">
          Sold out
        </span>
        <span className="truncate text-[13px] font-bold">
          ETH Early Bird now sold out. Ticket sales reopen in June
        </span>
      </div>
      <button className="hidden sm:flex items-center gap-2 text-[13px] font-semibold text-[#b08df5] hover:text-white transition-colors cursor-pointer">
        Get a reminder
        <Mail size={16} strokeWidth={2} />
      </button>
    </div>
  )
}

export function DevconNavbar() {
  return (
    <nav
      className="flex items-center justify-between px-6 md:px-16 text-white"
      style={{
        height: NAV_H,
        background:
          'linear-gradient(180deg, rgba(22, 11, 43, 0.80) 0%, rgba(22, 11, 43, 0.00) 100%)',
      }}
    >
      <img
        src="/devcon-logo.svg"
        alt="Devcon"
        className="h-[38px] w-auto"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className="flex items-center gap-1 text-[15px] font-bold text-white hover:text-white/80 transition-colors cursor-pointer"
            >
              {link}
              <ChevronDown size={15} strokeWidth={2.5} className="opacity-70" />
            </button>
          ))}
        </div>

        <button className="rounded-full bg-[#7235ed] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#8049f0] transition-colors cursor-pointer">
          View tickets
        </button>

        <button className="hidden sm:flex items-center gap-1 text-[14px] font-bold text-white hover:text-white/80 transition-colors cursor-pointer">
          <Globe size={16} strokeWidth={2} />
          EN
          <ChevronDown size={15} strokeWidth={2.5} className="opacity-70" />
        </button>
      </div>
    </nav>
  )
}
