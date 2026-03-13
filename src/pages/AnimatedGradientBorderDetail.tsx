import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatedGradientBorder } from '@/components/ui/animated-gradient-border'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code, ArrowRight } from 'lucide-react'
import animatedGradientBorderSource from '@/components/ui/animated-gradient-border.tsx?raw'

const STOP_LABELS = ['0%', '100%']

export default function AnimatedGradientBorderDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)

  const [speed, setSpeed] = useState(6)
  const [direction, setDirection] = useState<'cw' | 'ccw'>('cw')
  const [colors, setColors] = useState(['#DECFFB', '#B08DF5'])

  const updateColor = (index: number, value: string) => {
    setColors((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const transformedSource = useMemo(() => {
    let source = animatedGradientBorderSource
    source = source.replace('speed = 6', `speed = ${speed}`)
    source = source.replace("direction = 'cw'", `direction = '${direction}'`)
    source = source.replace(
      "['#DECFFB', '#B08DF5']",
      `['${colors.join("', '")}']`,
    )
    return source
  }, [speed, direction, colors])

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/experiments')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Animated Gradient Border
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
          A pill-shaped container with a continuously rotating conic gradient
          border. Configurable speed, direction, and five-point color gradient.
        </p>
      </header>

      {/* Controls */}
      <div className="space-y-5">
        {/* Speed & Direction */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 w-56">
            <Label className="text-base text-text-secondary font-light shrink-0">
              Speed
            </Label>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.5}
              max={10}
              step={0.1}
            />
            <span className="text-base text-text-tertiary font-mono w-12 text-right shrink-0">
              {speed.toFixed(1)}s
            </span>
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <div className="flex items-center gap-2">
            <Label className="text-base text-text-secondary font-light shrink-0">
              Direction
            </Label>
            <div className="flex rounded-md border border-border-default overflow-hidden">
              <button
                className={`px-3 py-1.5 text-[14px] transition-colors ${
                  direction === 'cw'
                    ? 'bg-text-primary text-white'
                    : 'text-text-secondary hover:bg-surface-raised'
                }`}
                onClick={() => setDirection('cw')}
              >
                Clockwise
              </button>
              <button
                className={`px-3 py-1.5 text-[14px] transition-colors ${
                  direction === 'ccw'
                    ? 'bg-text-primary text-white'
                    : 'text-text-secondary hover:bg-surface-raised'
                }`}
                onClick={() => setDirection('ccw')}
              >
                Counter-clockwise
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Colors */}
        <div>
          <Label className="text-base text-text-secondary font-light mb-3 block">
            Gradient Colors
          </Label>
          <div className="flex items-start gap-4">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border-default cursor-pointer appearance-none bg-transparent p-0"
                  style={{ colorScheme: 'light' }}
                />
                <Input
                  value={color}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) updateColor(i, v)
                  }}
                  className="h-8 w-24 text-[13px] font-mono uppercase text-center"
                  maxLength={7}
                />
                <span className="text-[12px] text-text-tertiary">
                  {STOP_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden bg-[#E8E5F1] py-12 px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-center text-[#1A1040] text-sm font-light">
            Note: The budget and tickets are limited per round. In Round 1, we
            prioritize initiatives with the greatest impact.
          </p>

          <AnimatedGradientBorder
            colors={colors}
            speed={speed}
            direction={direction}
            borderWidth={1}
          >
            <div className="flex items-center justify-center px-8 py-5 gap-6">
              <p className="text-[#1A1040] text-sm font-light whitespace-nowrap leading-6">
                Deadline to apply:{' '}
                <span className="text-2xl font-bold ml-2">30 April, 2026</span>
              </p>
              <button className="bg-[#6535C9] hover:bg-[#5629B0] text-white rounded-full px-6 py-3 text-base font-extrabold flex items-center gap-2 shrink-0 transition-colors">
                Apply now
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </AnimatedGradientBorder>

          <div className="text-center space-y-1">
            <p className="text-[#1A1040] text-sm font-light">
              After applying, please wait for our response —{' '}
              <span className="font-bold">
                we'll get back to you within 7 days.
              </span>
            </p>
            <p className="text-[#1A1040] text-sm font-light">
              Our contact:{' '}
              <span className="font-semibold underline underline-offset-2">
                ecosystem@devcon.org
              </span>
            </p>
          </div>
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={transformedSource}
        installCommand="No additional dependencies required. Add the gradient-border-spin keyframe to your CSS:

@keyframes gradient-border-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}"
        fileName="animated-gradient-border.tsx"
      />
    </div>
  )
}
