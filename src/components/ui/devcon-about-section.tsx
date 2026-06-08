import { University, Sprout, ArrowRight, type LucideIcon } from 'lucide-react'
import { HERO_BLEED } from '@/components/ui/road-to-devcon-hero'

type Program = {
  icon: LucideIcon
  title: string
  description: string
}

const PROGRAMS: Program[] = [
  {
    icon: University,
    title: 'Academic Program',
    description:
      'Connecting students, researchers, and academic institutions with the Ethereum community.',
  },
  {
    icon: Sprout,
    title: 'Ecosystem Program',
    description:
      'Grants and activations supporting local events and community initiatives across India.',
  },
]

export function DevconAboutSection() {
  return (
    <section
      // relative + z-10 so this section paints above the hero's bleed: its
      // transparent gradient top reveals the bleeding artwork behind, while the
      // text/cards stay on top.
      className="relative z-10 w-full text-white px-6 md:px-16 py-16"
      style={{
        // Transparent at the very top so the hero composition bleeding down
        // (HERO_BLEED px) shows through, fading to solid #211447 over the same
        // distance — per the Figma CLS Section spec.
        background: `linear-gradient(180deg, rgba(33,20,71,0) 0px, #211447 ${HERO_BLEED}px, #211447 100%)`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: copy */}
        <div className="max-w-[632px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#b08df5]">
            About
          </p>
          <h2 className="mt-3 text-[32px] leading-tight font-extrabold tracking-[-0.5px]">
            Road to Devcon India
          </h2>
          <p className="mt-6 text-xl font-medium text-white">
            Devcon's impact starts months before the event.
          </p>
          <p className="mt-4 text-base font-light leading-relaxed text-white">
            Road to Devcon brings together communities, local organizations, and new
            audiences through programs designed to amplify grassroots efforts and create
            long-term impact.
          </p>
          <p className="mt-4 text-base font-light leading-relaxed text-white">
            Together, our programs keep the community active, amplify local efforts and
            voices, and serve as preparation for the culmination of the year: Devcon.
          </p>
        </div>

        {/* Right: program cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROGRAMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/20 bg-[rgba(242,241,244,0.08)] p-6 shadow-[0_2px_8px_0_rgba(34,17,68,0.15)] backdrop-blur-[6px]"
            >
              <Icon size={32} strokeWidth={1.5} className="text-[#b08df5]" />
              <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-white">
                {description}
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#b08df5] hover:text-white transition-colors cursor-pointer"
              >
                Learn more
                <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
