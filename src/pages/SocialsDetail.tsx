import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFontEmbedCSS, toJpeg } from 'html-to-image'
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

const ACCENT = '#7235ED'
const ACCENT_HOVER = '#5F26D4'

// Scoped overrides for the shared <Slider> on this page: purple range, purple
// thumb border, and a tall rectangular thumb instead of a circle.
const SLIDER_CLASS =
  '[&_[data-slot=slider-range]]:bg-[#7235ED] ' +
  '[&_[data-slot=slider-thumb]]:border-[#7235ED] ' +
  '[&_[data-slot=slider-thumb]]:rounded-sm ' +
  '[&_[data-slot=slider-thumb]]:!h-5 ' +
  '[&_[data-slot=slider-thumb]]:!w-2 ' +
  '[&_[data-slot=slider-thumb]]:cursor-grab ' +
  '[&_[data-slot=slider-thumb]]:active:cursor-grabbing ' +
  '[&_[data-slot=slider-thumb]]:hover:ring-0 ' +
  '[&_[data-slot=slider-thumb]]:focus-visible:ring-0 ' +
  '[&_[data-slot=slider-thumb]]:focus-visible:outline-none'

const accentCtaClass =
  'text-sm font-bold text-[#7235ED] hover:text-[#5F26D4] cursor-pointer transition-colors'

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
      // Browsers lazy-load Google Font weights; force-load the pill's 800
      // weight before serializing so it's available to the SVG rasterizer.
      await document.fonts.load(`800 32px "Poppins"`, pillText || ' ')
      await document.fonts.ready

      const fontEmbedCSS = await getFontEmbedCSS(assetRef.current)
      const dataUrl = await toJpeg(assetRef.current, {
        width: ASSET_WIDTH,
        height: ASSET_HEIGHT,
        pixelRatio: 1,
        cacheBust: true,
        quality: 1,
        backgroundColor: '#1A1040',
        fontEmbedCSS,
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
          className={`mb-3 -ml-2 gap-2 hover:bg-[#7235ED]/10 ${accentCtaClass}`}
          onClick={() => navigate('/socials')}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </Button>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Asset Generator
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light whitespace-nowrap">
          Add one or two headline texts, plus an optional pill — download a 1920×1080 JPEG.
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              className={`gap-2 rounded-full hover:bg-[#7235ED]/10 ${accentCtaClass} hover:scale-[1.03] active:scale-[0.97] transition-[scale,color,background-color] duration-200 ease-out`}
              onClick={resetStyle}
            >
              <RotateCcw size={14} strokeWidth={2} />
              Reset sizes
            </Button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = ACCENT_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = ACCENT)
              }
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-bold text-white cursor-pointer transition-[scale,background-color,color] duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none"
            >
              <Download size={14} strokeWidth={2.25} />
              {downloading ? 'Rendering…' : 'Download JPEG'}
            </button>
          </div>
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
                className={`${accentCtaClass} hover:underline underline-offset-2`}
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
                className={`${accentCtaClass} hover:underline underline-offset-2`}
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
              className="text-base bg-white hover:border-text-tertiary focus-visible:border-input focus-visible:ring-0"
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
      className={`h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs flex items-center transition-colors hover:border-text-tertiary ${disabled ? 'opacity-50' : ''}`}
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
          className={SLIDER_CLASS}
        />
      </div>
    </div>
  )
}

interface SliderInBoxProps {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
}

function SliderInBox({ value, onChange, min, max, step }: SliderInBoxProps) {
  return (
    <div className="h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs flex items-center px-3 transition-colors hover:border-text-tertiary">
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className={SLIDER_CLASS}
      />
    </div>
  )
}
