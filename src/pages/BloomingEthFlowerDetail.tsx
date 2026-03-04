import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code } from 'lucide-react'
import Lottie from 'lottie-react'

const LOTTIE_URL = '/Eth-Glyph-Flower-Motion.json'

const componentSource = `import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'

export function BloomingEthFlower({ className }: { className?: string }) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/Eth-Glyph-Flower-Motion.json')
      .then((res) => res.json())
      .then(setAnimationData)
  }, [])

  if (!animationData) return null

  return (
    <Lottie
      animationData={animationData}
      loop
      className={className}
    />
  )
}`

export default function BloomingEthFlowerDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((res) => res.json())
      .then(setAnimationData)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/lottie-files')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Blooming Eth Flower
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-base"
            onClick={() => setExportOpen(true)}
          >
            <Code size={16} strokeWidth={1.5} />
            Export
          </Button>
        </div>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed max-w-2xl">
          An animated Ethereum glyph with a blooming flower motif. Loops continuously as a Lottie animation.
        </p>
      </header>

      {/* Preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden bg-white">
        <div className="w-full min-h-[320px] flex items-center justify-center p-12">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              style={{ width: 400 }}
            />
          )}
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={componentSource}
        installCommand="npm install lottie-react"
        fileName="blooming-eth-flower.tsx"
        assetDownloadUrl={LOTTIE_URL}
        assetDownloadName="Eth-Glyph-Flower-Motion.json"
      />
    </div>
  )
}
