import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JSZip from 'jszip'
import { getFontEmbedCSS, toJpeg } from 'html-to-image'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  FORMATS,
  SocialsAsset,
  TEMPLATES,
  type FormatKey,
  type TemplateKey,
} from '@/components/ui/socials-asset'

const TEMPLATE_ORDER: TemplateKey[] = ['standard', 'ticketing', 'ecosystem']

const FORMAT_ORDER: FormatKey[] = ['landscape', 'portrait', 'vertical']

const PREVIEW_MAX_HEIGHT = 560
const ARROW_SIZE = 48
const ARROW_GAP = 40

// Arrow position is anchored to the widest format (landscape) so the buttons
// don't jump around when switching to narrower formats.
const LANDSCAPE_PREVIEW_WIDTH =
  PREVIEW_MAX_HEIGHT * (FORMATS.landscape.width / FORMATS.landscape.height)
const PREVIEW_CONTAINER_WIDTH =
  LANDSCAPE_PREVIEW_WIDTH + 2 * (ARROW_GAP + ARROW_SIZE)

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

interface StyleState {
  fontSizeOne: number
  fontSizeTwo: number
  lineGap: number
  centerYOffset: number
}

// html-to-image's getFontEmbedCSS filters @font-face rules by fonts found via
// HTML traversal — its `instanceof HTMLElement` recursion never descends into
// SVG, so Chloe (set on the SVG <text> headline) is dropped from the embedded
// CSS and exports fall back to Poppins. Inline it explicitly on the side.
let chloeFontFaceCSSPromise: Promise<string> | null = null

async function getChloeFontFaceCSS(): Promise<string> {
  if (chloeFontFaceCSSPromise) return chloeFontFaceCSSPromise
  chloeFontFaceCSSPromise = (async () => {
    const res = await fetch('/fonts/Chloe-Regular.otf')
    const blob = await res.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
    return (
      '@font-face{font-family:"Chloe";' +
      `src:url("${dataUrl}") format("opentype");` +
      'font-weight:normal;font-style:normal;}'
    )
  })()
  return chloeFontFaceCSSPromise
}

function defaultStyleFor(key: FormatKey): StyleState {
  const h = FORMATS[key].headline
  return {
    fontSizeOne: h.fontSizeOne,
    fontSizeTwo: h.fontSizeTwo,
    lineGap: h.lineGap,
    centerYOffset: 0,
  }
}

function initialStyleByFormat(): Record<FormatKey, StyleState> {
  return {
    landscape: defaultStyleFor('landscape'),
    portrait: defaultStyleFor('portrait'),
    vertical: defaultStyleFor('vertical'),
  }
}

export default function SocialsDetail() {
  const navigate = useNavigate()

  // Template style
  const [template, setTemplate] = useState<TemplateKey>('standard')

  // Shared content
  const [lineOne, setLineOne] = useState('Devcon 8 Tickets')
  const [lineTwo, setLineTwo] = useState('Available from 20 May')
  const [showLineTwo, setShowLineTwo] = useState(true)
  const [pillText, setPillText] = useState(
    'Early Bird payment via ETH only',
  )
  const [showPill, setShowPill] = useState(true)
  const [showCredits, setShowCredits] = useState(true)
  const [writerName, setWriterName] = useState('Candela')

  // Per-format style overrides
  const [styleByFormat, setStyleByFormat] = useState<
    Record<FormatKey, StyleState>
  >(initialStyleByFormat)

  // Carousel
  const [activeFormat, setActiveFormat] = useState<FormatKey>('landscape')

  // Download selection
  const [selectedFormats, setSelectedFormats] = useState<Set<FormatKey>>(
    new Set(FORMAT_ORDER),
  )
  const [downloading, setDownloading] = useState(false)

  // One off-screen ref per format so any of them can be rendered to JPEG.
  const landscapeRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const verticalRef = useRef<HTMLDivElement>(null)
  const refByFormat: Record<
    FormatKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    landscape: landscapeRef,
    portrait: portraitRef,
    vertical: verticalRef,
  }

  const activeCfg = FORMATS[activeFormat]
  const activeStyle = styleByFormat[activeFormat]
  const previewWidth = PREVIEW_MAX_HEIGHT * (activeCfg.width / activeCfg.height)
  const previewScale = PREVIEW_MAX_HEIGHT / activeCfg.height

  const cycleFormat = (delta: 1 | -1) => {
    const idx = FORMAT_ORDER.indexOf(activeFormat)
    const next = (idx + delta + FORMAT_ORDER.length) % FORMAT_ORDER.length
    setActiveFormat(FORMAT_ORDER[next])
  }

  const updateActiveStyle = (patch: Partial<StyleState>) => {
    setStyleByFormat((prev) => ({
      ...prev,
      [activeFormat]: { ...prev[activeFormat], ...patch },
    }))
  }

  const resetActiveStyle = () => {
    setStyleByFormat((prev) => ({
      ...prev,
      [activeFormat]: defaultStyleFor(activeFormat),
    }))
  }

  const toggleSelected = (key: FormatKey) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const renderJpeg = async (key: FormatKey): Promise<string> => {
    const node = refByFormat[key].current
    if (!node) throw new Error(`Missing ref for format ${key}`)
    const cfg = FORMATS[key]
    const [baseFontCSS, chloeFontCSS] = await Promise.all([
      getFontEmbedCSS(node),
      getChloeFontFaceCSS(),
    ])
    const fontEmbedCSS = `${chloeFontCSS}\n${baseFontCSS}`
    return toJpeg(node, {
      width: cfg.width,
      height: cfg.height,
      pixelRatio: 1,
      cacheBust: true,
      quality: 1,
      backgroundColor: '#1A1040',
      fontEmbedCSS,
    })
  }

  const handleDownload = async () => {
    if (selectedFormats.size === 0) return
    setDownloading(true)
    try {
      await Promise.all([
        document.fonts.load(`normal 200px "Chloe"`, `${lineOne} ${lineTwo}`),
        document.fonts.load(`800 32px "Poppins"`, pillText || ' '),
      ])
      await document.fonts.ready

      const keys = FORMAT_ORDER.filter((k) => selectedFormats.has(k))

      if (keys.length === 1) {
        const k = keys[0]
        const dataUrl = await renderJpeg(k)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `devcon-social-${FORMATS[k].fileSuffix}.jpg`
        a.click()
        return
      }

      const zip = new JSZip()
      for (const k of keys) {
        const dataUrl = await renderJpeg(k)
        // dataUrl is "data:image/jpeg;base64,...." — strip the prefix.
        const base64 = dataUrl.split(',')[1]
        zip.file(`devcon-social-${FORMATS[k].fileSuffix}.jpg`, base64, {
          base64: true,
        })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'devcon-social-bundle.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const downloadLabel =
    selectedFormats.size > 1
      ? `Download (${selectedFormats.size})`
      : 'Download'

  const sharedAssetProps = {
    template,
    lineOne,
    lineTwo,
    showLineTwo,
    pillText,
    showPill,
    showCredits,
    writerName,
  }

  return (
    <div className="space-y-8">
      {/* Off-screen full-resolution renders so every format is exportable
          regardless of which one is currently on-screen. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -1,
        }}
      >
        {FORMAT_ORDER.map((k) => (
          <SocialsAsset
            key={k}
            ref={refByFormat[k]}
            format={k}
            {...sharedAssetProps}
            fontSizeOne={styleByFormat[k].fontSizeOne}
            fontSizeTwo={styleByFormat[k].fontSizeTwo}
            lineGap={styleByFormat[k].lineGap}
            centerYOffset={styleByFormat[k].centerYOffset}
          />
        ))}
      </div>

      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
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
          <p className="mt-3 text-text-secondary text-base font-light">
            Add one or two headline texts, plus an optional pill — download
            ready-to-post JPEGs in three formats.
          </p>
        </div>
        <TemplateSwitcher value={template} onChange={setTemplate} />
      </header>

      <section className="space-y-3">
        <div
          className="flex items-baseline justify-between mx-auto"
          style={{ width: PREVIEW_CONTAINER_WIDTH }}
        >
          <h2 className="text-base font-medium text-text-primary">Preview</h2>
          <span className="text-xs text-text-tertiary font-light">
            {activeCfg.label} — {activeCfg.width} × {activeCfg.height} —
            exports at full resolution
          </span>
        </div>

        <div
          className="relative mx-auto flex items-center justify-center"
          style={{
            width: PREVIEW_CONTAINER_WIDTH,
            height: PREVIEW_MAX_HEIGHT,
          }}
        >
          <CarouselArrow
            direction="left"
            onClick={() => cycleFormat(-1)}
            label="Previous format"
          />

          <div
            className="relative rounded-xl border border-border overflow-hidden bg-surface-overlay shrink-0 transition-[width] duration-300 ease-out"
            style={{
              width: previewWidth,
              height: PREVIEW_MAX_HEIGHT,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
              }}
            >
              <SocialsAsset
                format={activeFormat}
                {...sharedAssetProps}
                fontSizeOne={activeStyle.fontSizeOne}
                fontSizeTwo={activeStyle.fontSizeTwo}
                lineGap={activeStyle.lineGap}
                centerYOffset={activeStyle.centerYOffset}
              />
            </div>
          </div>

          <CarouselArrow
            direction="right"
            onClick={() => cycleFormat(1)}
            label="Next format"
          />
        </div>
      </section>

      <section className="bg-[#F9F8FA] rounded-xl px-4 md:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
            Customize
            <span className="ml-2 text-sm font-medium text-text-secondary">
              {activeCfg.label}
            </span>
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="lg"
              className={`gap-2 rounded-full hover:bg-[#7235ED]/10 ${accentCtaClass} hover:scale-[1.03] active:scale-[0.97] transition-[scale,color,background-color] duration-200 ease-out`}
              onClick={resetActiveStyle}
            >
              <RotateCcw size={14} strokeWidth={2} />
              Reset sizes
            </Button>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              {FORMAT_ORDER.map((k) => (
                <FormatCheckbox
                  key={k}
                  checked={selectedFormats.has(k)}
                  onChange={() => toggleSelected(k)}
                  label={FORMATS[k].label}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || selectedFormats.size === 0}
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
              {downloading ? 'Rendering…' : downloadLabel}
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-end flex-wrap">
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
              sizeValue={activeStyle.fontSizeOne}
              onSizeChange={(v) => updateActiveStyle({ fontSizeOne: v })}
              sizeMin={activeCfg.sizeOneMin}
              sizeMax={activeCfg.sizeOneMax}
            />
          </FieldColumn>

          <FieldColumn narrow>
            <FieldHeader label="Line gap" />
            <SliderInBox
              value={activeStyle.lineGap}
              onChange={(v) => updateActiveStyle({ lineGap: v })}
              min={activeCfg.lineGapMin}
              max={activeCfg.lineGapMax}
              step={1}
            />
          </FieldColumn>

          <FieldColumn narrow>
            <FieldHeader label="Vertical offset" />
            <SliderInBox
              value={activeStyle.centerYOffset}
              onChange={(v) => updateActiveStyle({ centerYOffset: v })}
              min={activeCfg.centerYOffsetMin}
              max={activeCfg.centerYOffsetMax}
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
              sizeValue={activeStyle.fontSizeTwo}
              onSizeChange={(v) => updateActiveStyle({ fontSizeTwo: v })}
              sizeMin={activeCfg.sizeTwoMin}
              sizeMax={activeCfg.sizeTwoMax}
            />
          </FieldColumn>

          {TEMPLATES[template].showPill ? (
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
              <textarea
                id="socials-pill"
                value={pillText}
                onChange={(e) => setPillText(e.target.value)}
                placeholder="Early Bird payment via ETH only"
                disabled={!showPill}
                rows={1}
                className="block h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs px-3 py-1.5 text-base leading-6 outline-none transition-colors hover:border-text-tertiary focus-visible:border-input focus-visible:ring-0 resize-none disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
              />
            </FieldColumn>
          ) : (
            <FieldColumn>
              <FieldHeader htmlFor="socials-writer" label="Credits">
                <button
                  type="button"
                  onClick={() => setShowCredits((v) => !v)}
                  className={`${accentCtaClass} hover:underline underline-offset-2`}
                >
                  {showCredits ? 'Hide' : 'Show'}
                </button>
              </FieldHeader>
              <input
                id="socials-writer"
                type="text"
                value={writerName}
                onChange={(e) => setWriterName(e.target.value)}
                placeholder="Candela"
                disabled={!showCredits}
                className="block h-9 w-full min-w-0 rounded-md border border-input bg-white shadow-xs px-3 py-1.5 text-base leading-6 outline-none transition-colors hover:border-text-tertiary focus-visible:border-input focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FieldColumn>
          )}
        </div>
      </section>
    </div>
  )
}

function TemplateSwitcher({
  value,
  onChange,
}: {
  value: TemplateKey
  onChange: (k: TemplateKey) => void
}) {
  return (
    <div className="flex items-start gap-3">
      {TEMPLATE_ORDER.map((k) => {
        const t = TEMPLATES[k]
        const active = value === k
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            aria-pressed={active}
            className={`group flex flex-col items-center gap-1.5 cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.97]`}
          >
            <span
              className={`block w-24 h-[54px] rounded-md overflow-hidden border-2 transition-colors ${
                active
                  ? 'border-[#7235ED] ring-2 ring-[#7235ED]/30'
                  : 'border-border group-hover:border-[#7235ED]/60'
              }`}
            >
              <img
                src={t.thumbSrc}
                alt=""
                className="w-full h-full object-cover block"
                draggable={false}
              />
            </span>
            <span
              className={`text-xs font-medium transition-colors ${
                active
                  ? 'text-[#7235ED]'
                  : 'text-text-secondary group-hover:text-[#7235ED]'
              }`}
            >
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  label: string
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  const positionClass = direction === 'left' ? 'left-0' : 'right-0'
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-md border border-border text-text-primary flex items-center justify-center cursor-pointer hover:bg-[#7235ED]/10 hover:text-[#7235ED] hover:border-[#7235ED] hover:scale-[1.05] active:scale-[0.95] transition-[scale,background-color,color,border-color] duration-200 ease-out`}
    >
      <Icon size={24} strokeWidth={2.25} />
    </button>
  )
}

function FormatCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-text-primary select-none hover:text-[#7235ED] transition-colors">
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 transition-colors ${
          checked
            ? 'bg-[#7235ED] border-[#7235ED]'
            : 'bg-white border-text-tertiary'
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6.5 L5 9.5 L10 3" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
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
      className={`space-y-2 min-w-0 ${narrow ? 'w-32 shrink-0' : 'flex-1 min-w-[220px]'}`}
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
  sizeMin: number
  sizeMax: number
}

function InputWithSizeSlider({
  id,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  sizeValue,
  onSizeChange,
  sizeMin,
  sizeMax,
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
          min={sizeMin}
          max={sizeMax}
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
