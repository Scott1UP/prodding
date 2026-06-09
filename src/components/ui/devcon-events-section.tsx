import { Search } from 'lucide-react'

type EventCard = {
  title: string
  organizer: string
  date: string
  location: string
  handle: string
  city: string
  gradient: string
}

// May 2026 events (placeholder gradients stand in for the real event images).
const MAY_2026: EventCard[] = [
  {
    title: 'Ethereum Node Operators Meetup',
    organizer: 'EthNoders India',
    date: '28 May 2026',
    location: 'Prithvi Cafe, Janki Kutir',
    handle: '@ethnodersindia',
    city: 'MUMBAI',
    gradient: 'from-[#2a2350] to-[#15112e]',
  },
  {
    title: 'Solidity Study Group: Bengaluru',
    organizer: 'Solidity Devs India',
    date: '30 May 2026',
    location: 'Benga Connect, Bundar',
    handle: '@soliditydevsin',
    city: 'DELHI',
    gradient: 'from-[#ff9d6c] to-[#ff6b3d]',
  },
  {
    title: 'ZK & Privacy Dev Day',
    organizer: 'PSE India',
    date: '30 May 2026',
    location: '91Springboard, Nehru Place',
    handle: '@pseindia',
    city: 'DELHI',
    gradient: 'from-[#ffd34e] to-[#eda221]',
  },
  {
    title: 'DeFi Founders Virtual Breakfast',
    organizer: 'ETHindia Alumni',
    date: '30 May 2026',
    location: 'via Google Meet link',
    handle: '@ethindia',
    city: 'VIRTUAL',
    gradient: 'from-[#ffa39a] to-[#ff6f91]',
  },
]

const FILTER_CHIPS = [
  'Conference', 'Meetup', 'Presentation', 'Educational', 'Virtual',
  'Open Source', 'Privacy', 'Security', 'AI', 'Policy',
]

function EventCardItem({ event }: { event: EventCard }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#221144]/10 bg-white">
      <div className={`relative h-[200px] bg-gradient-to-br ${event.gradient}`}>
        <span className="absolute right-3 top-3 rounded-[4px] bg-[#160b2b]/55 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide leading-none text-white">
          {event.city}
        </span>
      </div>
      <div className="p-5">
        <h4 className="text-base font-bold leading-none text-[#160b2b]">{event.title}</h4>
        <p className="mt-3 text-sm font-semibold leading-none text-[#160b2b]">{event.organizer}</p>
        <p className="mt-2 text-sm leading-none text-[#594d73]">
          {event.date} • {event.location}
        </p>
        <a
          href="#"
          className="mt-3 inline-block text-sm font-medium leading-none text-[#7235ed] hover:underline cursor-pointer"
        >
          {event.handle}
        </a>
      </div>
    </article>
  )
}

export function DevconEventsSection() {
  return (
    <section
      className="w-full text-[#160b2b] px-6 py-16 md:px-32"
      style={{ background: 'linear-gradient(0deg, #FBFAFC 19.98%, #E5EBFF 100%)' }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#7235ed]">
            Get involved
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-extrabold tracking-[-0.5px]">
            Road to Devcon events
          </h2>
        </div>

        <div className="flex items-center gap-4 max-[600px]:w-full max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3">
          {/* Show past events toggle (static) */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-6 w-10 items-center rounded-full bg-[#dddae2] cursor-pointer">
              <span className="ml-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
            </span>
            <span className="text-sm font-medium text-[#160b2b]">Show past events</span>
          </div>

          {/* Search (static) */}
          <div className="flex h-10 w-[280px] items-center gap-2 rounded-lg border border-[#2211441a] bg-white px-3 max-[600px]:w-full">
            <Search size={16} className="shrink-0 text-[#594d73]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search by event, type or city"
              className="w-full bg-transparent text-sm text-[#160b2b] placeholder:text-[#594d73] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            className="rounded-full border border-[#2211441a] bg-white px-4 py-1.5 text-sm font-medium text-[#160b2b] hover:border-[#7235ed]/40 hover:text-[#7235ed] transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Timeline + month */}
      <div className="mt-12 flex gap-6 md:gap-9">
        {/* Timeline rail */}
        <div className="flex flex-col items-center pt-1.5">
          <span className="h-3 w-3 shrink-0 rounded-full bg-[#7235ed]" />
          <span className="mt-2 w-px flex-1 bg-[#7235ed]/25" />
        </div>

        {/* Month block */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-[#160b2b]">May 2026</h3>
            <span className="text-base font-light text-[#594d73]">4 events</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {MAY_2026.map((event) => (
              <EventCardItem key={event.title} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
