import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { WritingText } from '@/components/ui/writing-text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code, RotateCcw } from 'lucide-react'
import writingTextSource from '@/components/ui/writing-text.tsx?raw'

const textSegments = [
  { text: 'India is not just where Ethereum is used.' },
  { text: "It's where Ethereum is built.", className: 'font-bold' },
]

export default function WritingTextDetail() {
  const navigate = useNavigate()
  const [fontSize, setFontSize] = useState(2)
  const [color, setColor] = useState('#7235ED')
  const [bgColor, setBgColor] = useState('#ffffff')
  const stagger = 0.04
  const stiffness = 170
  const damping = 15
  const [animKey, setAnimKey] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)

  const transformedSource = useMemo(() => {
    let source = writingTextSource

    source = source.replace('stagger = 0.08', `stagger = ${stagger}`)
    source = source.replace('stiffness = 100', `stiffness = ${stiffness}`)
    source = source.replace('damping = 15', `damping = ${damping}`)
    return source
  }, [])

  return (
    <div className="space-y-6">
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

      {/* Controls row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Size */}
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

        {/* Color */}
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

        {/* Background */}
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

      {/* Preview */}
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

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={transformedSource}
        installCommand="npm install motion"
        fileName="writing-text.tsx"
      />
    </div>
  )
}
