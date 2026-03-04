import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import Lottie from 'lottie-react'

const lottieItems = [
  {
    slug: 'blooming-eth-flower',
    name: 'Blooming Eth Flower',
    description: 'Animated Ethereum glyph with a blooming flower motif.',
    file: '/Eth-Glyph-Flower-Motion.json',
  },
]

export default function LottieFiles() {
  const navigate = useNavigate()
  const [animationDataMap, setAnimationDataMap] = useState<Record<string, object>>({})

  useEffect(() => {
    lottieItems.forEach((item) => {
      fetch(item.file)
        .then((res) => res.json())
        .then((data) => setAnimationDataMap((prev) => ({ ...prev, [item.slug]: data })))
    })
  }, [])

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Lottie Files
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed">
          Animated Lottie illustrations and motion graphics.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lottieItems.map((item) => (
          <Card
            key={item.slug}
            className="group cursor-pointer overflow-hidden border-border-default shadow-none hover:border-text-tertiary transition-colors duration-200"
            onClick={() => navigate(`/lottie-files/${item.slug}`)}
          >
            <div className="bg-white h-48 flex items-center justify-center overflow-hidden border-b border-border-subtle">
              <div className="w-full h-full pointer-events-none flex items-center justify-center p-6">
                {animationDataMap[item.slug] && (
                  <Lottie
                    animationData={animationDataMap[item.slug]}
                    loop
                    className="h-full w-auto"
                  />
                )}
              </div>
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
