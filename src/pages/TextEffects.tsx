import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { WritingText } from '@/components/ui/writing-text'
import { CountingNumber } from '@/components/ui/counting-number'

const effects = [
  {
    slug: 'text-hover-effect',
    name: 'Text Hover Effect',
    description: 'Gradient stroke reveal that follows your cursor.',
    preview: <TextHoverEffect text="Hover" />,
  },
  {
    slug: 'writing-text',
    name: 'Writing Text',
    description: 'Word-by-word reveal with staggered spring animations.',
    preview: (
      <WritingText
        text="Hello World"
        className="text-3xl font-semibold"
        style={{ color: '#7235ED' }}
        stagger={0.12}
      />
    ),
  },
  {
    slug: 'counting-number',
    name: 'Counting Number',
    description: 'Spring-animated number counter with configurable physics.',
    preview: (
      <span className="text-3xl font-extrabold text-[#1A1A2E] tabular-nums tracking-tight">
        $<CountingNumber number={564} transition={{ stiffness: 90, damping: 50 }} />M
      </span>
    ),
  },
]

export default function TextEffects() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Text Effects
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed">
          Typography animations, reveals, and kinetic text experiments.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {effects.map((effect) => (
          <Card
            key={effect.slug}
            className="group cursor-pointer overflow-hidden border-border-default shadow-none hover:border-text-tertiary transition-colors duration-200"
            onClick={() => navigate(`/text-effects/${effect.slug}`)}
          >
            <div className="bg-white h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle">
              <div className="w-full h-full pointer-events-none flex items-center justify-center">
                {effect.preview}
              </div>
            </div>
            <div className="px-5 py-4">
              <h3 className="text-base font-medium text-text-primary">
                {effect.name}
              </h3>
              <p className="mt-1 text-base text-text-secondary font-light leading-relaxed">
                {effect.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
