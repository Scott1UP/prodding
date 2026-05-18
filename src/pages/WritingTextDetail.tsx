import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { WritingText } from '@/components/ui/writing-text'
import { ValuesDisplay } from '@/components/ui/values-display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code, RotateCcw } from 'lucide-react'
import writingTextSource from '@/components/ui/writing-text.tsx?raw'
import valuesDisplaySource from '@/components/ui/values-display.tsx?raw'

const textSegments = [
  { text: 'India is not just where Ethereum is used.' },
  { text: "It's where Ethereum is built.", className: 'font-bold' },
]

const VALUE_TERMS = ['Censorship Resistance', 'Open Source', 'Privacy', 'Security']

export default function WritingTextDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)

  // Values component state
  const [valuesFontSize, setValuesFontSize] = useState(2.75)
  const [valuesBgFontSize, setValuesBgFontSize] = useState(10.5)
  const [valuesBgOpacity, setValuesBgOpacity] = useState(0.04)
  const [valuesTermGap, setValuesTermGap] = useState(1)
  const [valuesStagger, setValuesStagger] = useState(0.08)
  const [valuesStiffness, setValuesStiffness] = useState(170)
  const [valuesDamping, setValuesDamping] = useState(15)
  const [valuesColor, setValuesColor] = useState('#7235ED')
  const [valuesBgColor, setValuesBgColor] = useState('#EEF0FE')
  const [valuesAnimKey, setValuesAnimKey] = useState(0)

  // India sentence state (existing)
  const [fontSize, setFontSize] = useState(2)
  const [color, setColor] = useState('#7235ED')
  const [bgColor, setBgColor] = useState('#ffffff')
  const stagger = 0.04
  const stiffness = 170
  const damping = 15
  const [animKey, setAnimKey] = useState(0)

  const transformedWritingSource = useMemo(() => {
    let source = writingTextSource
    source = source.replace('stagger = 0.08', `stagger = ${stagger}`)
    source = source.replace('stiffness = 100', `stiffness = ${stiffness}`)
    source = source.replace('damping = 15', `damping = ${damping}`)
    return source
  }, [])

  const transformedValuesSource = useMemo(() => {
    let source = valuesDisplaySource
    source = source.replace('backgroundOpacity = 0.04', `backgroundOpacity = ${valuesBgOpacity}`)
    source = source.replace('fontSize = 2.75', `fontSize = ${valuesFontSize}`)
    source = source.replace('backgroundFontSize = 10.5', `backgroundFontSize = ${valuesBgFontSize}`)
    source = source.replace('termGap = 1', `termGap = ${valuesTermGap}`)
    source = source.replace('stagger = 0.08', `stagger = ${valuesStagger}`)
    source = source.replace('stiffness = 170', `stiffness = ${valuesStiffness}`)
    source = source.replace('damping = 15', `damping = ${valuesDamping}`)
    source = source.replace(`color = "#7235ED"`, `color = "${valuesColor}"`)
    return source
  }, [
    valuesBgOpacity,
    valuesFontSize,
    valuesBgFontSize,
    valuesTermGap,
    valuesStagger,
    valuesStiffness,
    valuesDamping,
    valuesColor,
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Writing Text
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
          A word-by-word text reveal with staggered spring animations.
          Each word fades in and slides up with configurable spring physics and timing.
        </p>
      </header>

      {/* ---------- Values component ---------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">Values</h2>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 w-40">
            <Label className="text-base text-text-secondary font-light shrink-0">Size</Label>
            <Slider
              value={[valuesFontSize]}
              onValueChange={([v]) => setValuesFontSize(v)}
              min={1.5}
              max={5}
              step={0.05}
            />
          </div>

          <div className="flex items-center gap-2 w-44">
            <Label className="text-base text-text-secondary font-light shrink-0">BG size</Label>
            <Slider
              value={[valuesBgFontSize]}
              onValueChange={([v]) => setValuesBgFontSize(v)}
              min={4}
              max={20}
              step={0.1}
            />
          </div>

          <div className="flex items-center gap-2 w-44">
            <Label className="text-base text-text-secondary font-light shrink-0">BG opacity</Label>
            <Slider
              value={[valuesBgOpacity]}
              onValueChange={([v]) => setValuesBgOpacity(v)}
              min={0}
              max={0.25}
              step={0.005}
            />
          </div>

          <div className="flex items-center gap-2 w-40">
            <Label className="text-base text-text-secondary font-light shrink-0">Gap</Label>
            <Slider
              value={[valuesTermGap]}
              onValueChange={([v]) => setValuesTermGap(v)}
              min={0.25}
              max={3}
              step={0.05}
            />
          </div>

          <div className="flex items-center gap-2 w-40">
            <Label className="text-base text-text-secondary font-light shrink-0">Stagger</Label>
            <Slider
              value={[valuesStagger]}
              onValueChange={([v]) => setValuesStagger(v)}
              min={0}
              max={0.3}
              step={0.005}
            />
          </div>

          <div className="flex items-center gap-2 w-44">
            <Label className="text-base text-text-secondary font-light shrink-0">Stiffness</Label>
            <Slider
              value={[valuesStiffness]}
              onValueChange={([v]) => setValuesStiffness(v)}
              min={20}
              max={400}
              step={5}
            />
          </div>

          <div className="flex items-center gap-2 w-44">
            <Label className="text-base text-text-secondary font-light shrink-0">Damping</Label>
            <Slider
              value={[valuesDamping]}
              onValueChange={([v]) => setValuesDamping(v)}
              min={1}
              max={40}
              step={1}
            />
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-base text-text-secondary font-light shrink-0">Color</span>
            <label className="relative cursor-pointer shrink-0">
              <input
                type="color"
                value={valuesColor}
                onChange={(e) => setValuesColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span
                className="block w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: valuesColor }}
              />
            </label>
            <Input
              value={valuesColor}
              onChange={(e) => setValuesColor(e.target.value)}
              className="text-base h-8 w-24 font-mono min-w-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base text-text-secondary font-light shrink-0">Background</span>
            <label className="relative cursor-pointer shrink-0">
              <input
                type="color"
                value={valuesBgColor}
                onChange={(e) => setValuesBgColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span
                className="block w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: valuesBgColor }}
              />
            </label>
            <Input
              value={valuesBgColor}
              onChange={(e) => setValuesBgColor(e.target.value)}
              className="text-base h-8 w-24 font-mono min-w-0"
            />
          </div>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-base gap-2"
              onClick={() => setValuesAnimKey((k) => k + 1)}
            >
              <RotateCcw size={14} strokeWidth={1.5} />
              Replay
            </Button>
          </div>
        </div>

        <div
          className="w-full rounded-xl border border-border overflow-hidden"
          style={{ backgroundColor: valuesBgColor }}
        >
          <div className="w-full min-h-[320px] flex items-center justify-center p-12">
            <ValuesDisplay
              key={valuesAnimKey}
              terms={VALUE_TERMS}
              color={valuesColor}
              fontSize={valuesFontSize}
              backgroundFontSize={valuesBgFontSize}
              backgroundOpacity={valuesBgOpacity}
              termGap={valuesTermGap}
              stagger={valuesStagger}
              stiffness={valuesStiffness}
              damping={valuesDamping}
            />
          </div>
        </div>
      </section>

      {/* ---------- India sentence component ---------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">India sentence</h2>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 w-32">
            <Label className="text-base text-text-secondary font-light shrink-0">Size</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([v]) => setFontSize(v)}
              min={1}
              max={6}
              step={0.25}
            />
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-base text-text-secondary font-light shrink-0">Color</span>
            <label className="relative cursor-pointer shrink-0">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span
                className="block w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: color }}
              />
            </label>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="text-base h-8 w-24 font-mono min-w-0"
            />
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-base text-text-secondary font-light shrink-0">Background</span>
            <label className="relative cursor-pointer shrink-0">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span
                className="block w-8 h-8 rounded-lg border border-border"
                style={{ backgroundColor: bgColor }}
              />
            </label>
            <Input
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="text-base h-8 w-24 font-mono min-w-0"
            />
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-base gap-2"
              onClick={() => setAnimKey((k) => k + 1)}
            >
              <RotateCcw size={14} strokeWidth={1.5} />
              Replay
            </Button>
          </div>
        </div>

        <div
          className="w-full rounded-xl border border-border overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div className="w-full min-h-[320px] flex items-center justify-center p-12">
            <WritingText
              key={animKey}
              segments={textSegments}
              className="leading-relaxed"
              style={{ fontSize: `${fontSize}rem`, color, letterSpacing: '-0.015em' }}
              stagger={stagger}
              stiffness={stiffness}
              damping={damping}
            />
          </div>
        </div>
      </section>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        components={[
          { fileName: 'values-display.tsx', source: transformedValuesSource, label: 'Values' },
          { fileName: 'writing-text.tsx', source: transformedWritingSource, label: 'India-sentence' },
        ]}
        installCommand="npm install motion"
      />
    </div>
  )
}
