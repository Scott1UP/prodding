import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { AnimatedGradientBorder } from '@/components/ui/animated-gradient-border'

const experiments = [
  {
    slug: 'scrolling-narrative-block',
    name: 'Scrolling Narrative Block',
    description: 'A split-panel content block with scroll-triggered narrative sections.',
  },
  {
    slug: 'wallet-pass-designer',
    name: 'Wallet Pass Designer',
    description: 'Design and preview Apple Wallet and Google Wallet event ticket passes.',
  },
  {
    slug: 'animated-gradient-border',
    name: 'Animated Gradient Border',
    description: 'A pill container with a rotating conic gradient border animation.',
  },
  {
    slug: 'rotating-speakers',
    name: 'Rotating Speakers',
    description: 'Speaker portraits orbiting in concentric elliptical rings with hover-pause and click-to-reveal.',
  },
]

export default function Experiments() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Experiments
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed">
          Prototypes and experimental components. These may not ship.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp) => (
          <Card
            key={exp.slug}
            className="group cursor-pointer overflow-hidden border-border-default shadow-none hover:border-text-tertiary transition-colors duration-200 py-0 gap-0"
            onClick={() => navigate(`/experiments/${exp.slug}`)}
          >
            {/* Preview thumbnail */}
            {exp.slug === 'scrolling-narrative-block' && (
              <div className="h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle relative"
                style={{ background: 'linear-gradient(180deg, #1A0D33 -65%, #45326C 88.89%)' }}
              >
                <div className="w-full px-5 py-4 pointer-events-none flex items-center gap-3">
                  <img src="/eth-logo.svg" alt="" className="h-8 w-auto shrink-0 opacity-80" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white/90 leading-tight truncate">
                      Building the infrastructure<br />for tomorrow's world
                    </p>
                    <p className="mt-1 text-[8px] text-white/40 font-light">The technology is no longer theoretical.</p>
                  </div>
                  <div className="ml-auto text-[9px] text-white/50 font-light shrink-0 max-w-[45%] leading-snug">
                    It is infrastructure.<br />Real systems are being built.
                  </div>
                </div>
              </div>
            )}
            {exp.slug === 'wallet-pass-designer' && (
              <div className="h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle relative bg-[#f0efed]">
                {/* Miniature pass mockup */}
                <div
                  className="w-[140px] rounded-lg overflow-hidden pointer-events-none"
                  style={{
                    backgroundColor: '#45326C',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="h-[32px] bg-gradient-to-br from-purple-500/30 to-purple-900/40" />
                  <div className="px-2.5 pt-2 pb-1">
                    <div className="text-[7px] text-white/40 uppercase tracking-wider">Event</div>
                    <div className="text-[10px] text-white font-semibold leading-tight">Devcon 8</div>
                  </div>
                  <div className="px-2.5 pb-1.5 flex justify-between">
                    <div>
                      <div className="text-[6px] text-white/35 uppercase">Venue</div>
                      <div className="text-[7px] text-white/80">Jio World Centre</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[6px] text-white/35 uppercase">Date</div>
                      <div className="text-[7px] text-white/80">Nov 12</div>
                    </div>
                  </div>
                  <div className="mx-2 mb-2 mt-1 flex items-center justify-center rounded bg-white/10 py-1.5">
                    <svg width="24" height="24" viewBox="0 0 7 7" fill="white" opacity={0.3}>
                      <rect x="0" y="0" width="3" height="3" />
                      <rect x="4" y="0" width="3" height="3" />
                      <rect x="0" y="4" width="3" height="3" />
                      <rect x="3" y="3" width="1" height="1" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {exp.slug === 'animated-gradient-border' && (
              <div className="h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle relative bg-[#E8E5F1]">
                <AnimatedGradientBorder borderWidth={2} speed={3}>
                  <div className="px-5 py-2.5 flex items-center gap-3">
                    <span className="text-[11px] text-[#1A1040]/60 font-light">Deadline</span>
                    <span className="text-[14px] font-bold text-[#1A1040]">30 Apr</span>
                    <span className="bg-[#6535C9] text-white text-[10px] px-3 py-1.5 rounded-full font-medium">
                      Apply &rarr;
                    </span>
                  </div>
                </AnimatedGradientBorder>
              </div>
            )}

            {exp.slug === 'rotating-speakers' && (
              <div className="h-48 overflow-hidden border-b border-border-subtle relative">
                <img
                  src="/imgs/rotating-speakers-thumb.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="px-5 py-4">
              <h3 className="text-base font-medium text-text-primary">
                {exp.name}
              </h3>
              <p className="mt-1 text-base text-text-secondary font-light leading-relaxed">
                {exp.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
