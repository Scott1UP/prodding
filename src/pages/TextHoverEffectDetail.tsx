import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import type { GradientStop } from '@/components/ui/text-hover-effect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code, Plus, X } from 'lucide-react'
import textHoverEffectSource from '@/components/ui/text-hover-effect.tsx?raw'

const defaultStops: GradientStop[] = [
  { offset: '0%', color: '#eab308' },
  { offset: '25%', color: '#ef4444' },
  { offset: '50%', color: '#3b82f6' },
  { offset: '75%', color: '#07d5c7' },
  { offset: '100%', color: '#8b5cf6' },
]

function distributeOffsets(count: number): string[] {
  if (count === 1) return ['0%']
  return Array.from({ length: count }, (_, i) =>
    `${Math.round((i / (count - 1)) * 100)}%`
  )
}

export default function TextHoverEffectDetail() {
  const navigate = useNavigate()
  const [text, setText] = useState('Devcon')
  const [fontSize, setFontSize] = useState(4.5)
  const [maskRadius, setMaskRadius] = useState(20)
  const [gradientStops, setGradientStops] = useState<GradientStop[]>(defaultStops)
  const [strokeColor, setStrokeColor] = useState('#e6e6e6')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [stopsExpanded, setStopsExpanded] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const gradientRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewHovered, setPreviewHovered] = useState(false)
  const [cursorPos, setCursorPos] = useState({ cx: 50, cy: 50 })

  const handlePreviewMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = previewRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursorPos({
      cx: ((e.clientX - rect.left) / rect.width) * 100,
      cy: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  const keywordMask = previewHovered
    ? (() => {
        const rect = previewRef.current?.getBoundingClientRect()
        const w = rect?.width ?? 1
        const h = rect?.height ?? 1
        const r = (maskRadius / 100) * Math.sqrt((w * w + h * h) / 2) * 2.5
        return `radial-gradient(circle ${r}px at ${cursorPos.cx}% ${cursorPos.cy}%, transparent 0%, transparent 20%, black 100%)`
      })()
    : undefined

  const transformedSource = useMemo(() => {
    let source = textHoverEffectSource

    // Replace default prop values with current settings
    source = source.replace(
      'strokeColor = "#e6e6e6"',
      `strokeColor = "${strokeColor}"`
    )
    source = source.replace(
      'fontFamily = "helvetica"',
      `fontFamily = "Chloe, serif"`
    )
    source = source.replace(
      'fontWeight = "bold"',
      `fontWeight = "normal"`
    )
    source = source.replace(
      'fontSize = "4.5rem"',
      `fontSize = "${fontSize}rem"`
    )
    source = source.replace(
      'maskRadius = 20',
      `maskRadius = ${maskRadius}`
    )

    // Replace the defaultGradientStops array
    const stopsArrayStr = gradientStops
      .map(s => `  { offset: "${s.offset}", color: "${s.color}" }`)
      .join(',\n')
    source = source.replace(
      /const defaultGradientStops: GradientStop\[\] = \[[\s\S]*?\];/,
      `const defaultGradientStops: GradientStop[] = [\n${stopsArrayStr},\n];`
    )

    return source
  }, [strokeColor, fontSize, maskRadius, gradientStops])

  const updateStopColor = useCallback((index: number, color: string) => {
    setGradientStops(prev => prev.map((stop, i) => i === index ? { ...stop, color } : stop))
  }, [])

  const addStop = useCallback(() => {
    setGradientStops(prev => {
      const newStops = [...prev, { offset: '100%', color: '#ffffff' }]
      const offsets = distributeOffsets(newStops.length)
      return newStops.map((stop, i) => ({ ...stop, offset: offsets[i] }))
    })
  }, [])

  const removeStop = useCallback((index: number) => {
    setGradientStops(prev => {
      if (prev.length <= 2) return prev
      const newStops = prev.filter((_, i) => i !== index)
      const offsets = distributeOffsets(newStops.length)
      return newStops.map((stop, i) => ({ ...stop, offset: offsets[i] }))
    })
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!stopsExpanded) return
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        gradientRef.current && !gradientRef.current.contains(e.target as Node)
      ) {
        setStopsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [stopsExpanded])

  return (
    <div className="space-y-6">
      {/* Back + Title */}
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
            Text Hover Effect
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
          An SVG text effect that reveals a gradient stroke as you move your cursor.
          The radial mask follows your mouse position, creating a spotlight reveal over the text.
        </p>
      </header>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Words */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Label htmlFor="text-input" className="text-base text-text-secondary font-light shrink-0">
            Words
          </Label>
          <Input
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text"
            className="text-base h-8 min-w-0"
          />
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Size */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Label className="text-base text-text-secondary font-light shrink-0">
            Size
          </Label>
          <Slider
            value={[fontSize]}
            onValueChange={([v]) => setFontSize(v)}
            min={2}
            max={8}
            step={0.25}
          />
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Stroke */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base text-text-secondary font-light shrink-0">Stroke</span>
          <label className="relative cursor-pointer shrink-0">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span
              className="block w-8 h-8 rounded-lg border border-border"
              style={{ backgroundColor: strokeColor }}
            />
          </label>
          <Input
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="text-base h-8 font-mono min-w-0"
          />
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Background */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
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
            className="text-base h-8 font-mono min-w-0"
          />
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Gradient */}
        <div className="flex items-center gap-2 flex-1 min-w-0 relative">
          <span className="text-base text-text-secondary font-light shrink-0">Gradient</span>
          <div
            ref={gradientRef}
            className="h-8 flex-1 rounded-lg border border-border cursor-pointer hover:border-text-tertiary transition-colors"
            style={{
              background: `linear-gradient(90deg, ${gradientStops.map((s) => `${s.color} ${s.offset}`).join(', ')})`,
            }}
            onClick={() => setStopsExpanded(!stopsExpanded)}
          />

          {/* Stop editor dropdown */}
          {stopsExpanded && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 z-50 rounded-xl border border-border bg-surface shadow-lg p-4 space-y-2 min-w-[300px]"
            >
              {gradientStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-base text-text-tertiary font-light w-10 shrink-0 text-right">
                    {stop.offset}
                  </span>
                  <label className="relative cursor-pointer">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStopColor(index, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span
                      className="block w-8 h-8 rounded-lg border border-border"
                      style={{ backgroundColor: stop.color }}
                    />
                  </label>
                  <Input
                    value={stop.color}
                    onChange={(e) => updateStopColor(index, e.target.value)}
                    className="text-base h-8 w-24 font-mono"
                  />
                  {gradientStops.length > 2 && (
                    <button
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                      onClick={() => removeStop(index)}
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-base"
                onClick={addStop}
              >
                <Plus size={14} strokeWidth={1.5} />
                Add stop
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Component preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden" style={{ backgroundColor: bgColor }}>
        <div
          ref={previewRef}
          className="w-full h-[480px] relative"
          onMouseEnter={() => setPreviewHovered(true)}
          onMouseLeave={() => setPreviewHovered(false)}
          onMouseMove={handlePreviewMouseMove}
        >
          <TextHoverEffect
            text={text}
            strokeColor={strokeColor}
            gradientStops={gradientStops}
            fontFamily="Chloe, serif"
            fontWeight="normal"
            letterSpacing={-0.03}
            fontSize={`${fontSize}rem`}
            maskRadius={maskRadius}
          />
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              maskImage: keywordMask,
              WebkitMaskImage: keywordMask,
            }}
          >
            <div
              className="text-center uppercase tracking-wide leading-relaxed"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 300,
                fontSize: '1.25rem',
                color: '#1a1a3e',
                letterSpacing: '0.05em',
              }}
            >
              <p>Talks&ensp;•&ensp;Workshops&ensp;•&ensp;Experiences&ensp;•&ensp;Cowork&ensp;•&ensp;AI</p>
              <p>Censorship Resistance&ensp;•&ensp;Open Source&ensp;•&ensp;Privacy&ensp;•&ensp;Security</p>
              <p>DeFi&ensp;•&ensp;Social&ensp;•&ensp;Cypherpunk&ensp;•&ensp;Art&ensp;•&ensp;Real World Ethereum</p>
            </div>
          </div>
        </div>
      </div>

      {/* Radius slider */}
      <div className="flex items-center gap-3 max-w-xs">
        <Label className="text-base text-text-secondary font-light shrink-0">
          Radius
        </Label>
        <Slider
          value={[maskRadius]}
          onValueChange={([v]) => setMaskRadius(v)}
          min={5}
          max={50}
          step={1}
        />
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={transformedSource}
        installCommand="npm install motion"
        fontInstructions={`This component uses the "Chloe" font.\n\nIf we don't already have it in our codebase:\n\n1. Download Chloe-Regular.otf below\n2. Place it in your public/fonts/ directory\n3. Add this @font-face rule to your CSS:\n\n@font-face {\n  font-family: "Chloe";\n  src: url("/fonts/Chloe-Regular.otf") format("opentype");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}`}
        fontDownloadUrl="/fonts/Chloe-Regular.otf"
        fontFileName="Chloe-Regular.otf"
      />
    </div>
  )
}
