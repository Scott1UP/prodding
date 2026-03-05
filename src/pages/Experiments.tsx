import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'

const experiments = [
  {
    slug: 'scrolling-narrative-block',
    name: 'Scrolling Narrative Block',
    description: 'A split-panel content block with scroll-triggered narrative sections.',
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
            className="group cursor-pointer overflow-hidden border-border-default shadow-none hover:border-text-tertiary transition-colors duration-200"
            onClick={() => navigate(`/experiments/${exp.slug}`)}
          >
            {/* Preview — miniature static snapshot */}
            <div className="h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle relative"
              style={{ background: 'linear-gradient(180deg, #1A0D33 -65%, #45326C 88.89%)' }}
            >
              <div className="w-full px-5 py-4 pointer-events-none flex items-center gap-3">
                <img
                  src="/eth-logo.svg"
                  alt=""
                  className="h-8 w-auto shrink-0 opacity-80"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-white/90 leading-tight truncate">
                    Building the infrastructure
                    <br />
                    for tomorrow's world
                  </p>
                  <p className="mt-1 text-[8px] text-white/40 font-light">
                    The technology is no longer theoretical.
                  </p>
                </div>
                <div className="ml-auto text-[9px] text-white/50 font-light shrink-0 max-w-[45%] leading-snug">
                  It is infrastructure.
                  <br />
                  Real systems are being built.
                </div>
              </div>
            </div>

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
