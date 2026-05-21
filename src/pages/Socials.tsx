import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'

const socials = [
  {
    slug: 'asset-generator',
    name: 'Asset Generator',
    description:
      'Customize headline and subtitle, export a 1920×1080 JPEG ready to post.',
  },
]

export default function Socials() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Socials
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed">
          Tools and templates for producing social media assets.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socials.map((item) => (
          <Card
            key={item.slug}
            className="group cursor-pointer overflow-hidden border-border-default shadow-none hover:border-text-tertiary transition-colors duration-200 py-0 gap-0"
            onClick={() => navigate(`/socials/${item.slug}`)}
          >
            <div className="h-48 overflow-hidden border-b border-border-subtle relative">
              <img
                src="/imgs/socials-thumb.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-5 py-4">
              <h3 className="text-base font-medium text-text-primary">
                {item.name}
              </h3>
              <p className="mt-1 text-base text-text-secondary font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
