import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toJpeg } from 'html-to-image'
import { ArrowLeft, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  HEADLINE_DEFAULTS,
  SocialsAsset,
} from '@/components/ui/socials-asset'

const ASSET_WIDTH = 1920
const ASSET_HEIGHT = 1080

const SIZE_MIN = 160
const SIZE_MAX = 220

const LINE_GAP_RANGE = 30
const LINE_GAP_MIN = HEADLINE_DEFAULTS.lineGap - LINE_GAP_RANGE / 2
const LINE_GAP_MAX = HEADLINE_DEFAULTS.lineGap + LINE_GAP_RANGE / 2

export default function SocialsDetail() {
  const navigate = useNavigate()

  // Content state
  const [lineOne, setLineOne] = useState('Devcon 8 Tickets')
  const [lineTwo, setLineTwo] = useState('Available from 20 May')
  const [showLineTwo, setShowLineTwo] = useState(true)
  const [pillText, setPillText] = useState(
    'Early Bird payment via ETH only • Limited quantity',
  )
  const [showPill, setShowPill] = useState(true)

  // Headline style state
  const [fontSizeOne, setFontSizeOne] = useState(HEADLINE_DEFAULTS.fontSizeOne)
  const [fontSizeTwo, setFontSizeTwo] = useState(HEADLINE_DEFAULTS.fontSizeTwo)
  const [lineGap, setLineGap] = useState(HEADLINE_DEFAULTS.lineGap)

  const [downloading, setDownloading] = useState(false)

  const previewWrapRef = useRef<HTMLDivElement>(null)
  const assetRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = previewWrapRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setScale(w / ASSET_WIDTH)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const resetStyle = () => {
    setFontSizeOne(HEADLINE_DEFAULTS.fontSizeOne)
    setFontSizeTwo(HEADLINE_DEFAULTS.fontSizeTwo)
    setLineGap(HEADLINE_DEFAULTS.lineGap)
  }

  const handleDownload = async () => {
    if (!assetRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toJpeg(assetRef.current, {
        width: ASSET_WIDTH,
        height: ASSET_HEIGHT,
        pixelRatio: 1,
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#1A1040',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'devcon-social.jpg'
      a.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-8">
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
            Social Asset Generator
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-base"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={16} strokeWidth={1.5} />
            {downloading ? 'Rendering…' : 'Download JPEG'}
          </Button>
        </div>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed max-w-2xl">
          A social asset generator test for the Devcon team. Add one or two
          headline texts, and an optional pill element — Download a 1920×1080
          jpeg ready to post.
        </p>
      </header>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between max-w-5xl mx-auto">
          <h2 className="text-base font-medium text-text-primary">Preview</h2>
          <span className="text-xs text-text-tertiary font-light">
            1920 × 1080 — exported at full resolution
          </span>
        </div>

        <div
          ref={previewWrapRef}
          className="relative w-full max-w-5xl mx-auto rounded-xl border border-border overflow-hidden bg-surface-overlay"
          style={{ aspectRatio: `${ASSET_WIDTH} / ${ASSET_HEIGHT}` }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <SocialsAsset
              ref={assetRef}
              lineOne={lineOne}
              lineTwo={lineTwo}
              showLineTwo={showLineTwo}
              pillText={pillText}
              showPill={showPill}
              fontSizeOne={fontSizeOne}
              fontSizeTwo={fontSizeTwo}
              lineGap={lineGap}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F9F8FA] rounded-xl px-4 md:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
            Customize
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm text-text-secondary"
            onClick={resetStyle}
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            Reset sizes
          </Button>
        </div>

        <div className="flex gap-4 items-end">
          <FieldColumn>
            <FieldHeader htmlFor="socials-line-one" label="Headline 1">
              <span className="text-xs text-text-secondary font-light">
                ~22 chars
              </span>
            </FieldHeader>
            <InputWithSizeSlider
              id="socials-line-one"
              value={lineOne}
              onValueChange={setLineOne}
              placeholder="Devcon 8 Tickets"
              sizeValue={fontSizeOne}
              onSizeChange={setFontSizeOne}
            />
          </FieldColumn>

          <FieldColumn narrow>
            <FieldHeader label="Line gap" />
            <SliderInBox
              value={lineGap}
              onChange={setLineGap}
              min={LINE_GAP_MIN}
              max={LINE_GAP_MAX}
              step={1}
            />
          </FieldColumn>

          <FieldColumn>
            <FieldHeader htmlFor="socials-line-two" label="Headline 2">
              <button
                type="button"
                onClick={() => setShowLineTwo((v) => !v)}
                className="text-xs text-text-primary font-light underline underline-offset-2"
              >
                {showLineTwo ? 'Hide' : 'Show'}
              </button>
            </FieldHeader>
            <InputWithSizeSlider
              id="socials-line-two"
              value={lineTwo}
              onValueChange={setLineTwo}
              placeholder="Available from 20 May"
              disabled={!showLineTwo}
              sizeValue={fontSizeTwo}
              onSizeChange={setFontSizeTwo}
            />
          </FieldColumn>

          <FieldColumn>
            <FieldHeader htmlFor="socials-pill" label="Pill text">
              <button
                type="button"
                onClick={() => setShowPill((v) => !v)}
                className="text-xs text-text-primary font-light underline underline-offset-2"
              >
                {showPill ? 'Hide' : 'Show'}
              </button>
            </FieldHeader>
            <Input
              id="socials-pill"
              value={pillText}
              onChange={(e) => setPillText(e.target.value)}
              placeholder="Early Bird payment via ETH only • Limited quantity"
              disabled={!showPill}
              className="text-base bg-white"
            />
          </FieldColumn>
        </div>
      </section>
    </div>
  )
}

function FieldColumn({
  children,
  narrow = false,
}: {
  children: React.ReactNode
  narrow?: boolean
}) {
  return (
    <div
      className={`space-y-2 min-w-0 ${narrow ? 'w-44 shrink-0' : 'flex-1'}`}
    >
      {children}
    </div>
  )
}

function FieldHeader({
  htmlFor,
  label,
  children,
}: {
  htmlFor?: string
  label: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between min-h-[20px]">
      <Label htmlFor={htmlFor} className="text-base font-medium">
        {label}
      </Label>
      {children}
    </div>
  )
}

// Composite control: a standard-looking input field with a compact size
// slider tucked into the right edge, so the input and its size control
// read as a single field on one line.
interface InputWithSizeSliderProps {
  id: string
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  sizeValue: number
  onSizeChange: (v: number) => void
}

function InputWithSizeSlider({
  id,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  sizeValue,
  onSizeChange,
}: InputWithSizeSliderProps) {
  return (
    <div
      className={`h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs flex items-center transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] ${disabled ? 'opacity-50' : ''}`}
    >
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none px-3 text-base min-w-0 disabled:cursor-not-allowed"
      />
      <div className="h-5 w-px bg-border shrink-0" />
      <div className="flex items-center gap-2 px-3 w-32 shrink-0">
        <span className="text-xs text-text-tertiary font-light shrink-0">
          Size
        </span>
        <Slider
          value={[sizeValue]}
          onValueChange={([v]) => onSizeChange(v)}
          min={SIZE_MIN}
          max={SIZE_MAX}
          step={1}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

// A bare slider wrapped in input-style chrome so it matches the height
// and visual weight of the Headline 1/2/Pill inputs.
interface SliderInBoxProps {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
}

function SliderInBox({ value, onChange, min, max, step }: SliderInBoxProps) {
  return (
    <div className="h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs flex items-center px-3">
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}
