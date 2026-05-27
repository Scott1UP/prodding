import { forwardRef, useMemo } from 'react'

export type FormatKey = 'landscape' | 'portrait' | 'vertical'
export type TemplateKey = 'standard' | 'ecosystem' | 'ticketing'

export interface CreditsStyle {
  bottom: number
  smallSize: number
  largeSize: number
  maxWidth: number
}

export interface TemplateConfig {
  key: TemplateKey
  label: string
  thumbSrc: string
  bgArtByFormat: Record<FormatKey, string>
  showLogo: boolean
  showPill: boolean
  showCredits: boolean
  creditsByFormat?: Record<FormatKey, CreditsStyle>
  haloColor?: string
}

export const TEMPLATES: Record<TemplateKey, TemplateConfig> = {
  standard: {
    key: 'standard',
    label: 'Standard',
    thumbSrc: '/socials/base-art.jpg',
    bgArtByFormat: {
      landscape: '/socials/base-art.jpg',
      portrait: '/socials/base-art-1080x1350.jpg',
      vertical: '/socials/base-art-1080x1920.jpg',
    },
    showLogo: true,
    showPill: true,
    showCredits: false,
    haloColor: '#BEECEE',
  },
  ticketing: {
    key: 'ticketing',
    label: 'Ticketing',
    thumbSrc: '/socials/Ticketing-x-landscape.jpg',
    bgArtByFormat: {
      landscape: '/socials/Ticketing-x-landscape.jpg',
      portrait: '/socials/Ticketing-IG-portrait.jpg',
      vertical: '/socials/Ticketing-Vertical-1920x1080.jpg',
    },
    showLogo: false,
    showPill: true,
    showCredits: false,
    haloColor: '#BEECEE',
  },
  ecosystem: {
    key: 'ecosystem',
    label: 'Ecosystem',
    thumbSrc: '/socials/X-landscape-ecosystem-bg-art.jpg',
    bgArtByFormat: {
      landscape: '/socials/X-landscape-ecosystem-bg-art.jpg',
      portrait: '/socials/IG-vertical-ecosystem-bg-art.jpg',
      vertical: '/socials/Vertical-ecosystem-bg-art.jpg',
    },
    showLogo: false,
    showPill: false,
    showCredits: true,
    creditsByFormat: {
      // Landscape: sit in the bottom strip, vertically aligned with the
      // baked-in DEVCON logo (bottom-left) and dates (bottom-right), small
      // enough to fit in the gap between them.
      landscape: { bottom: 110, smallSize: 17, largeSize: 25, maxWidth: 1100 },
      // Portrait & Vertical: positioned above the baked-in logo/dates band.
      portrait: { bottom: 240, smallSize: 21, largeSize: 30, maxWidth: 940 },
      vertical: { bottom: 230, smallSize: 21, largeSize: 30, maxWidth: 940 },
    },
  },
}

export interface HeadlineStyle {
  fontSizeOne: number
  fontSizeTwo: number
  borderWidth: number
  borderColor: string
  highlightWidth: number
  highlightColor: string
  gradientTop: string
  gradientBottom: string
  shadowDepth: number
  shadowColor: string
  curveAmount: number
  lineGap: number
  letterSpacing: number
  innerShadowOffset: number
  innerShadowColor: string
  innerShadowOpacity: number
}

const SHARED_HEADLINE_STYLE: Omit<
  HeadlineStyle,
  'fontSizeOne' | 'fontSizeTwo' | 'curveAmount' | 'lineGap'
> = {
  borderWidth: 10,
  borderColor: '#AD1E10',
  highlightWidth: 3,
  highlightColor: '#FFF0C7',
  gradientTop: '#FEBF5D',
  gradientBottom: '#FDF4CE',
  shadowDepth: 12,
  shadowColor: '#621109',
  letterSpacing: -1,
  innerShadowOffset: 1.5,
  innerShadowColor: '#662E00',
  innerShadowOpacity: 0.4,
}

export interface PillStyle {
  bottom: number
  fontSize: number
  paddingX: number
  paddingY: number
  allowWrap: boolean
  maxWidth: number
}

export interface FormatConfig {
  key: FormatKey
  label: string
  fileSuffix: string
  width: number
  height: number
  bgArt: string
  logoTop: number
  logoHeight: number
  arcMargin: number
  // Y coordinate the headline block visually centers on. The baseline of
  // line 1 is computed at render-time from this center plus the actual
  // number of visual lines (1, 2, or N after wrap), so the block stays
  // centered regardless of whether headline 2 is shown / how it wraps.
  headlineCenterY: number
  pill: PillStyle
  headline: HeadlineStyle
  // Per-format slider ranges. Headline 1 and headline 2 get independent ranges
  // since they typically want different size envelopes per format.
  sizeOneMin: number
  sizeOneMax: number
  sizeTwoMin: number
  sizeTwoMax: number
  lineGapMin: number
  lineGapMax: number
  // Manual vertical shift applied on top of headlineCenterY. The slider
  // value is added directly to the center coordinate (px in canvas space).
  centerYOffsetMin: number
  centerYOffsetMax: number
  // Narrow formats wrap headline 2 to fit. Landscape renders headline 2 as a
  // single arc to preserve current behavior.
  wrapHeadlineTwo: boolean
}

export const FORMATS: Record<FormatKey, FormatConfig> = {
  landscape: {
    key: 'landscape',
    label: 'X Landscape',
    fileSuffix: '1920x1080',
    width: 1920,
    height: 1080,
    bgArt: '/socials/base-art.jpg',
    logoTop: 70,
    logoHeight: 220,
    arcMargin: 80,
    headlineCenterY: 555,
    pill: {
      bottom: 80,
      fontSize: 32,
      paddingX: 40,
      paddingY: 24,
      allowWrap: false,
      maxWidth: 1680,
    },
    headline: {
      ...SHARED_HEADLINE_STYLE,
      fontSizeOne: 186,
      fontSizeTwo: 158,
      curveAmount: 100,
      lineGap: 168,
    },
    sizeOneMin: 140,
    sizeOneMax: 220,
    sizeTwoMin: 120,
    sizeTwoMax: 200,
    lineGapMin: 140,
    lineGapMax: 200,
    centerYOffsetMin: -150,
    centerYOffsetMax: 150,
    wrapHeadlineTwo: false,
  },
  portrait: {
    key: 'portrait',
    label: 'IG Portrait',
    fileSuffix: '1080x1350',
    width: 1080,
    height: 1350,
    bgArt: '/socials/base-art-1080x1350.jpg',
    logoTop: 90,
    logoHeight: 255,
    arcMargin: 40,
    headlineCenterY: 739,
    pill: {
      bottom: 120,
      fontSize: 38,
      paddingX: 42,
      paddingY: 24,
      allowWrap: true,
      maxWidth: 880,
    },
    headline: {
      ...SHARED_HEADLINE_STYLE,
      fontSizeOne: 156,
      fontSizeTwo: 128,
      curveAmount: 40,
      lineGap: 170,
      borderWidth: 10,
      highlightWidth: 3,
    },
    sizeOneMin: 110,
    sizeOneMax: 240,
    sizeTwoMin: 90,
    sizeTwoMax: 220,
    lineGapMin: 130,
    lineGapMax: 240,
    centerYOffsetMin: -200,
    centerYOffsetMax: 200,
    wrapHeadlineTwo: true,
  },
  vertical: {
    key: 'vertical',
    label: 'IG Vertical',
    fileSuffix: '1080x1920',
    width: 1080,
    height: 1920,
    bgArt: '/socials/base-art-1080x1920.jpg',
    logoTop: 220,
    logoHeight: 380,
    arcMargin: 40,
    headlineCenterY: 1140,
    pill: {
      bottom: 120,
      fontSize: 46,
      paddingX: 48,
      paddingY: 28,
      allowWrap: true,
      maxWidth: 880,
    },
    headline: {
      ...SHARED_HEADLINE_STYLE,
      fontSizeOne: 150,
      fontSizeTwo: 124,
      curveAmount: 40,
      lineGap: 150,
      borderWidth: 10,
      highlightWidth: 3,
    },
    sizeOneMin: 110,
    sizeOneMax: 240,
    sizeTwoMin: 90,
    sizeTwoMax: 220,
    lineGapMin: 120,
    lineGapMax: 190,
    centerYOffsetMin: -300,
    centerYOffsetMax: 300,
    wrapHeadlineTwo: true,
  },
}

export interface SocialsAssetProps {
  format: FormatKey
  template: TemplateKey
  lineOne: string
  lineTwo?: string
  showLineTwo: boolean
  pillText: string
  showPill: boolean
  showCredits: boolean
  writerName: string

  // Optional per-instance overrides — fall back to FORMATS[format].headline.
  fontSizeOne?: number
  fontSizeTwo?: number
  lineGap?: number
  curveAmount?: number
  centerYOffset?: number
}

const PILL_BG = '#8048EF'

// Approximate vertical extents of a glyph relative to its baseline, used
// to anchor the gradient stops in user space so the gradient spans the
// actual letter range rather than the text element's bbox (which would
// otherwise include the arc rise from textPath and stretch the gradient).
const CAP_HEIGHT_RATIO = 0.85
const DESCENDER_RATIO = 0.2

// Greedy whitespace-split fit. Uses canvas measureText so widths reflect the
// actual rendered font; falls back to a character-count heuristic if canvas
// isn't available (e.g. SSR — not a concern here, but cheap to guard).
function wrapTextToWidth(
  text: string,
  maxWidth: number,
  fontSize: number,
  letterSpacing: number,
): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const words = trimmed.split(/\s+/)
  const ctx =
    typeof document !== 'undefined'
      ? document.createElement('canvas').getContext('2d')
      : null
  const measure = (s: string) => {
    if (ctx) {
      ctx.font = `${fontSize}px Chloe, "Poppins", sans-serif`
      return ctx.measureText(s).width + letterSpacing * Math.max(0, s.length - 1)
    }
    return s.length * fontSize * 0.55
  }
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (measure(test) <= maxWidth) {
      current = test
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

export const SocialsAsset = forwardRef<HTMLDivElement, SocialsAssetProps>(
  function SocialsAsset(
    {
      format,
      template,
      lineOne,
      lineTwo,
      showLineTwo,
      pillText,
      showPill,
      showCredits,
      writerName,
      fontSizeOne,
      fontSizeTwo,
      lineGap,
      curveAmount,
      centerYOffset,
    },
    ref,
  ) {
    const cfg = FORMATS[format]
    const tpl = TEMPLATES[template]
    const h = cfg.headline
    const bgArt = tpl.bgArtByFormat[format]
    const haloColor = tpl.haloColor ?? '#FCF4D2'

    // Scope SVG IDs per format so multiple instances on one page (e.g. visible
    // preview + hidden export nodes) don't collide on shared filter/gradient IDs.
    const idPrefix = `socials-${format}`
    const gradientIdBase = `${idPrefix}-gradient`
    const haloId = `${idPrefix}-halo`
    const innerShadowId = `${idPrefix}-inner-shadow`
    const shadowOffsets = Array.from(
      { length: Math.floor(h.shadowDepth / 2) },
      (_, i) => (i + 1) * 2,
    )
    const sizeOne = fontSizeOne ?? h.fontSizeOne
    const sizeTwo = fontSizeTwo ?? h.fontSizeTwo
    const gap = lineGap ?? h.lineGap
    const curve = curveAmount ?? h.curveAmount
    const yOffset = centerYOffset ?? 0

    const { width, height, arcMargin } = cfg
    const arcLeft = arcMargin
    const arcRight = width - arcMargin
    const arcCenter = width / 2

    const hasLineTwo = showLineTwo && !!lineTwo?.trim()

    // For narrow formats, wrap headline 2 into multiple visible lines.
    const lineTwoChunks = useMemo(() => {
      if (!hasLineTwo) return []
      if (!cfg.wrapHeadlineTwo) return [lineTwo!.trim()]
      return wrapTextToWidth(
        lineTwo!,
        width - 2 * arcMargin,
        sizeTwo,
        h.letterSpacing,
      )
    }, [hasLineTwo, lineTwo, cfg.wrapHeadlineTwo, width, arcMargin, sizeTwo, h.letterSpacing])

    // Visual-line count: line 1 always + N chunks of line 2 after wrap.
    // Baseline of line 1 is derived so the block's geometric center sits at
    // cfg.headlineCenterY, no matter how many visual lines are rendered.
    const visualLineCount = 1 + lineTwoChunks.length
    const capH = sizeOne * CAP_HEIGHT_RATIO
    const descender =
      (visualLineCount === 1 ? sizeOne : sizeTwo) * DESCENDER_RATIO
    const blockHeight =
      capH + Math.max(0, visualLineCount - 1) * gap + descender
    const baselineY = cfg.headlineCenterY + yOffset - blockHeight / 2 + capH

    // Arc geometry: line 1 spans the full arc width, line 2 (and wrap chunks)
    // sit slightly narrower to mimic the original landscape look.
    const arcOnePath = `M ${arcLeft} ${baselineY} Q ${arcCenter} ${baselineY - curve} ${arcRight} ${baselineY}`

    const lineTwoArcs = lineTwoChunks.map((chunk, i) => {
      const y = baselineY + gap * (i + 1)
      const inset = 20 // pinch line 2 family slightly like the original
      return {
        id: `${idPrefix}-arc-two-${i}`,
        path: `M ${arcLeft + inset} ${y} Q ${arcCenter} ${y - curve} ${arcRight - inset} ${y}`,
        y,
        text: chunk,
      }
    })

    // Per-line gradients in user space, pinned to each line's own letter
    // height so the gradient looks consistent across line counts.
    const gradOneTopY = baselineY - sizeOne * CAP_HEIGHT_RATIO
    const gradOneBottomY = baselineY + sizeOne * DESCENDER_RATIO

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width,
          height,
          overflow: 'hidden',
          backgroundColor: '#1A1040',
        }}
      >
        <img
          src={bgArt}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {tpl.showLogo && (
          <img
            src="/socials/logo.png"
            alt=""
            style={{
              position: 'absolute',
              top: cfg.logoTop,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              height: cfg.logoHeight,
              display: 'block',
            }}
          />
        )}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient
              id={`${gradientIdBase}-1`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={gradOneTopY}
              x2="0"
              y2={gradOneBottomY}
            >
              <stop offset="0%" stopColor={h.gradientTop} />
              <stop offset="100%" stopColor={h.gradientBottom} />
            </linearGradient>
            {lineTwoArcs.map((arc, i) => {
              const top = arc.y - sizeTwo * CAP_HEIGHT_RATIO
              const bottom = arc.y + sizeTwo * DESCENDER_RATIO
              return (
                <linearGradient
                  key={`grad-two-${i}`}
                  id={`${gradientIdBase}-two-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1={top}
                  x2="0"
                  y2={bottom}
                >
                  <stop offset="0%" stopColor={h.gradientTop} />
                  <stop offset="100%" stopColor={h.gradientBottom} />
                </linearGradient>
              )
            })}

            <path id={`${idPrefix}-arc-one`} d={arcOnePath} fill="none" />
            {lineTwoArcs.map((arc) => (
              <path key={arc.id} id={arc.id} d={arc.path} fill="none" />
            ))}

            {/* Halo filter — emits ONLY the three-stop glow generated from
                the source's alpha, not the source itself. */}
            <filter
              id={haloId}
              x="-50%"
              y="-400%"
              width="200%"
              height="900%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="b1" />
              <feFlood floodColor={haloColor} result="c1" />
              <feComposite in="c1" in2="b1" operator="in" result="g1" />

              <feGaussianBlur in="SourceAlpha" stdDeviation="30" result="b2" />
              <feFlood floodColor={haloColor} result="c2" />
              <feComposite in="c2" in2="b2" operator="in" result="g2" />

              <feGaussianBlur in="SourceAlpha" stdDeviation="80" result="b3" />
              <feFlood floodColor={haloColor} floodOpacity="0.91" result="c3" />
              <feComposite in="c3" in2="b3" operator="in" result="g3" />

              <feMerge>
                <feMergeNode in="g3" />
                <feMergeNode in="g2" />
                <feMergeNode in="g1" />
              </feMerge>
            </filter>

            {/* Inner shadow filter — paints a soft colored rim along the
                edges OPPOSITE the offset direction (inset shadow). */}
            <filter
              id={innerShadowId}
              x="-5%"
              y="-5%"
              width="110%"
              height="120%"
            >
              <feOffset
                in="SourceAlpha"
                dx={h.innerShadowOffset}
                dy={h.innerShadowOffset}
                result="offset"
              />
              <feComposite
                in="SourceAlpha"
                in2="offset"
                operator="out"
                result="rim"
              />
              <feFlood
                floodColor={h.innerShadowColor}
                floodOpacity={h.innerShadowOpacity}
                result="color"
              />
              <feComposite
                in="color"
                in2="rim"
                operator="in"
                result="shadow"
              />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shadow" />
              </feMerge>
            </filter>

          </defs>

          <CurvedHeadline
            pathId={`${idPrefix}-arc-one`}
            gradientId={`${gradientIdBase}-1`}
            haloId={haloId}
            innerShadowId={innerShadowId}
            shadowOffsets={shadowOffsets}
            shadowColor={h.shadowColor}
            text={lineOne}
            fontSize={sizeOne}
            borderWidth={h.borderWidth}
            borderColor={h.borderColor}
            highlightWidth={h.highlightWidth}
            highlightColor={h.highlightColor}
            letterSpacing={h.letterSpacing}
          />
          {lineTwoArcs.map((arc, i) => (
            <CurvedHeadline
              key={arc.id}
              pathId={arc.id}
              gradientId={`${gradientIdBase}-two-${i}`}
              haloId={haloId}
              innerShadowId={innerShadowId}
              shadowOffsets={shadowOffsets}
              shadowColor={h.shadowColor}
              text={arc.text}
              fontSize={sizeTwo}
              borderWidth={h.borderWidth}
              borderColor={h.borderColor}
              highlightWidth={h.highlightWidth}
              highlightColor={h.highlightColor}
              letterSpacing={h.letterSpacing}
            />
          ))}
        </svg>

        {tpl.showPill && showPill && !!pillText.trim() && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: cfg.pill.bottom,
              transform: 'translateX(-50%)',
              backgroundColor: PILL_BG,
              color: '#ffffff',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              fontSize: cfg.pill.fontSize,
              lineHeight: 1.3,
              padding: `${cfg.pill.paddingY}px ${cfg.pill.paddingX}px`,
              borderRadius: 9999,
              // width: max-content makes the pill expand to fit text on a
              // single line; maxWidth then caps it, forcing a wrap only once
              // the natural width exceeds the bound.
              width: 'max-content',
              maxWidth: cfg.pill.maxWidth,
              boxSizing: 'border-box',
              textAlign: 'center',
              // pre-wrap / pre preserve user-entered line breaks. The wrap
              // variant also lets text fall to a new line once maxWidth is hit.
              whiteSpace: cfg.pill.allowWrap ? 'pre-wrap' : 'pre',
              wordBreak: 'normal',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            {pillText}
          </div>
        )}

        {tpl.showCredits && showCredits && tpl.creditsByFormat && (
          <Credits
            writerName={writerName}
            style={tpl.creditsByFormat[format]}
          />
        )}
      </div>
    )
  },
)

interface CreditsProps {
  writerName: string
  style: CreditsStyle
}

function Credits({ writerName, style }: CreditsProps) {
  const { bottom, smallSize, largeSize, maxWidth } = style
  const name = (writerName || '').trim().toUpperCase() || 'ADAM'

  const small = { fontSize: smallSize }
  const large = { fontSize: largeSize }

  return (
    <p
      style={{
        position: 'absolute',
        bottom,
        left: '50%',
        transform: 'translateX(-50%)',
        margin: 0,
        width: 'max-content',
        maxWidth,
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 700,
        color: '#FCE6B7',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1.15,
        textShadow: '0px 2px 8px rgba(34, 17, 68, 0.7)',
        wordBreak: 'break-word',
      }}
    >
      <span style={small}>produced by </span>
      <span style={large}>DEVCON TEAM</span>
      <br />
      <span style={small}>written by </span>
      <span style={large}>{name}</span>
      <span style={small}> creative producers </span>
      <span style={large}>TOMO </span>
      <span style={small}>and </span>
      <span style={large}>SCOTT</span>
      <br />
      <span style={small}>an </span>
      <span style={large}>ETHEREUM FOUNDATION </span>
      <span style={small}>production</span>
    </p>
  )
}

interface CurvedHeadlineProps {
  pathId: string
  gradientId: string
  haloId: string
  innerShadowId: string
  shadowOffsets: number[]
  shadowColor: string
  text: string
  fontSize: number
  borderWidth: number
  borderColor: string
  highlightWidth: number
  highlightColor: string
  letterSpacing: number
}

function CurvedHeadline({
  pathId,
  gradientId,
  haloId,
  innerShadowId,
  shadowOffsets,
  shadowColor,
  text,
  fontSize,
  borderWidth,
  borderColor,
  highlightWidth,
  highlightColor,
  letterSpacing,
}: CurvedHeadlineProps) {
  const sharedTextProps = {
    fontFamily: 'Chloe, "Poppins", sans-serif',
    fontSize,
    letterSpacing: `${letterSpacing}px`,
  }

  const textPathNode = (
    <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
      {text}
    </textPath>
  )

  return (
    <g>
      {/* Halo layer — invisible source, outputs only the soft glow halo */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={2}
        paintOrder="stroke"
        filter={`url(#${haloId})`}
      >
        {textPathNode}
      </text>

      {/* Shadow extrusion — offset copies of the stroked text shape, painted
          in solid shadowColor. Largest offset first so smaller ones stack on
          top, filling in the extrusion. No filters — works in all browsers. */}
      {shadowOffsets.map((dy) => (
        <text
          key={`shadow-${dy}`}
          {...sharedTextProps}
          fill={shadowColor}
          stroke={shadowColor}
          strokeWidth={borderWidth}
          strokeLinejoin="miter"
          strokeMiterlimit={2}
          paintOrder="stroke"
          transform={`translate(0,${dy})`}
        >
          {textPathNode}
        </text>
      )).reverse()}

      {/* Back layer — thick outer border */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={2}
        paintOrder="stroke"
      >
        {textPathNode}
      </text>

      {/* Front layer — gradient fill + thin highlight rim */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        stroke={highlightColor}
        strokeWidth={highlightWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={2}
        paintOrder="stroke"
      >
        {textPathNode}
      </text>

      {/* Inner shadow layer — gradient fill (no stroke) + inset shadow so the
          shadow only appears within the bright gradient area. */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        filter={`url(#${innerShadowId})`}
      >
        {textPathNode}
      </text>
    </g>
  )
}
