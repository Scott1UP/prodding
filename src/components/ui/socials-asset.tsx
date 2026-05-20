import { forwardRef } from 'react'

export interface SocialsAssetProps {
  lineOne: string
  lineTwo?: string
  showLineTwo: boolean
  pillText: string
  showPill: boolean

  // Headline style — all optional; defaults below match the current "good" look
  fontSizeOne?: number
  fontSizeTwo?: number
  borderWidth?: number
  borderColor?: string
  highlightWidth?: number
  highlightColor?: string
  gradientTop?: string
  gradientBottom?: string
  shadowDepth?: number
  shadowColor?: string
  curveAmount?: number
  lineGap?: number
  letterSpacing?: number
  innerShadowOffset?: number
  innerShadowColor?: string
  innerShadowOpacity?: number
}

export const HEADLINE_DEFAULTS = {
  fontSizeOne: 186,
  fontSizeTwo: 158,
  borderWidth: 10,
  borderColor: '#AD1E10',
  highlightWidth: 3,
  highlightColor: '#FFF0C7',
  gradientTop: '#FEBF5D',
  gradientBottom: '#FDF4CE',
  shadowDepth: 6,
  shadowColor: '#621109',
  curveAmount: 100,
  lineGap: 168,
  letterSpacing: -1,
  innerShadowOffset: 1.5,
  innerShadowColor: '#662E00',
  innerShadowOpacity: 0.4,
} as const

const PILL_BG = '#8048EF'
const HEADLINE_GRADIENT_ONE_ID = 'socials-headline-gradient-1'
const HEADLINE_GRADIENT_TWO_ID = 'socials-headline-gradient-2'
const HEADLINE_HALO_ID = 'socials-headline-halo'
const HEADLINE_INNER_SHADOW_ID = 'socials-headline-inner-shadow'

// Approximate vertical extents of a glyph relative to its baseline, used
// to anchor the gradient stops in user space so the gradient spans the
// actual letter range rather than the text element's bbox (which would
// otherwise include the arc rise from textPath and stretch the gradient).
const CAP_HEIGHT_RATIO = 0.85
const DESCENDER_RATIO = 0.2

function buildShadowChain(depth: number, color: string) {
  const stops: string[] = []
  for (let i = 2; i <= depth; i += 2) {
    stops.push(`drop-shadow(0 ${i}px 0 ${color})`)
  }
  return stops.join(' ') || 'none'
}

export const SocialsAsset = forwardRef<HTMLDivElement, SocialsAssetProps>(
  function SocialsAsset(
    {
      lineOne,
      lineTwo,
      showLineTwo,
      pillText,
      showPill,
      fontSizeOne = HEADLINE_DEFAULTS.fontSizeOne,
      fontSizeTwo = HEADLINE_DEFAULTS.fontSizeTwo,
      borderWidth = HEADLINE_DEFAULTS.borderWidth,
      borderColor = HEADLINE_DEFAULTS.borderColor,
      highlightWidth = HEADLINE_DEFAULTS.highlightWidth,
      highlightColor = HEADLINE_DEFAULTS.highlightColor,
      gradientTop = HEADLINE_DEFAULTS.gradientTop,
      gradientBottom = HEADLINE_DEFAULTS.gradientBottom,
      shadowDepth = HEADLINE_DEFAULTS.shadowDepth,
      shadowColor = HEADLINE_DEFAULTS.shadowColor,
      curveAmount = HEADLINE_DEFAULTS.curveAmount,
      lineGap = HEADLINE_DEFAULTS.lineGap,
      letterSpacing = HEADLINE_DEFAULTS.letterSpacing,
      innerShadowOffset = HEADLINE_DEFAULTS.innerShadowOffset,
      innerShadowColor = HEADLINE_DEFAULTS.innerShadowColor,
      innerShadowOpacity = HEADLINE_DEFAULTS.innerShadowOpacity,
    },
    ref,
  ) {
    const twoLines = showLineTwo && !!lineTwo?.trim()

    // Arc geometry: vertically centered between logo (~y=282) and pill (~y=920)
    const baselineY = twoLines ? 510 : 640
    const arc1 = `M 80 ${baselineY} Q 960 ${baselineY - curveAmount} 1840 ${baselineY}`
    const arc2 = twoLines
      ? `M 100 ${baselineY + lineGap} Q 960 ${baselineY + lineGap - curveAmount} 1820 ${baselineY + lineGap}`
      : null

    // Per-line gradient ranges in user space — pinned to each line's
    // own letter height so the gradient looks identical regardless of
    // whether one or two lines are visible.
    const gradOneTopY = baselineY - fontSizeOne * CAP_HEIGHT_RATIO
    const gradOneBottomY = baselineY + fontSizeOne * DESCENDER_RATIO
    const baselineYTwo = baselineY + lineGap
    const gradTwoTopY = baselineYTwo - fontSizeTwo * CAP_HEIGHT_RATIO
    const gradTwoBottomY = baselineYTwo + fontSizeTwo * DESCENDER_RATIO

    const shadowChain = buildShadowChain(shadowDepth, shadowColor)

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: 1920,
          height: 1080,
          overflow: 'hidden',
          backgroundColor: '#1A1040',
        }}
      >
        <img
          src="/socials/base-art.jpg"
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

        <img
          src="/socials/logo.png"
          alt=""
          style={{
            position: 'absolute',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            height: 220,
            display: 'block',
          }}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient
              id={HEADLINE_GRADIENT_ONE_ID}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={gradOneTopY}
              x2="0"
              y2={gradOneBottomY}
            >
              <stop offset="0%" stopColor={gradientTop} />
              <stop offset="100%" stopColor={gradientBottom} />
            </linearGradient>
            {arc2 && (
              <linearGradient
                id={HEADLINE_GRADIENT_TWO_ID}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={gradTwoTopY}
                x2="0"
                y2={gradTwoBottomY}
              >
                <stop offset="0%" stopColor={gradientTop} />
                <stop offset="100%" stopColor={gradientBottom} />
              </linearGradient>
            )}
            <path id="socials-arc-1" d={arc1} fill="none" />
            {arc2 && <path id="socials-arc-2" d={arc2} fill="none" />}

            {/*
              Halo filter — emits ONLY the three-stop glow generated from
              the source's alpha, not the source itself (feMerge omits
              SourceGraphic). Lets us paint a soft cyan/cream halo behind
              the visible text layers without washing out their colors.
              stdDeviation ≈ CSS box-shadow blur / 2.
            */}
            <filter
              id={HEADLINE_HALO_ID}
              x="-50%"
              y="-400%"
              width="200%"
              height="900%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="b1" />
              <feFlood floodColor="#BEECEE" result="c1" />
              <feComposite in="c1" in2="b1" operator="in" result="g1" />

              <feGaussianBlur in="SourceAlpha" stdDeviation="30" result="b2" />
              <feFlood floodColor="#BEECEE" result="c2" />
              <feComposite in="c2" in2="b2" operator="in" result="g2" />

              <feGaussianBlur in="SourceAlpha" stdDeviation="80" result="b3" />
              <feFlood floodColor="#BEECEE" floodOpacity="0.91" result="c3" />
              <feComposite in="c3" in2="b3" operator="in" result="g3" />

              <feMerge>
                <feMergeNode in="g3" />
                <feMergeNode in="g2" />
                <feMergeNode in="g1" />
              </feMerge>
            </filter>

            {/*
              Inner shadow filter — paints a soft colored rim along the
              edges of the source OPPOSITE the offset direction (i.e. an
              inset shadow). Recipe: offset the alpha, subtract from the
              original alpha to get a one-sided rim, color it, then merge
              with the original source.
            */}
            <filter
              id={HEADLINE_INNER_SHADOW_ID}
              x="-5%"
              y="-5%"
              width="110%"
              height="120%"
            >
              <feOffset
                in="SourceAlpha"
                dx={innerShadowOffset}
                dy={innerShadowOffset}
                result="offset"
              />
              <feComposite
                in="SourceAlpha"
                in2="offset"
                operator="out"
                result="rim"
              />
              <feFlood
                floodColor={innerShadowColor}
                floodOpacity={innerShadowOpacity}
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
            pathId="socials-arc-1"
            gradientId={HEADLINE_GRADIENT_ONE_ID}
            text={lineOne}
            fontSize={fontSizeOne}
            borderWidth={borderWidth}
            borderColor={borderColor}
            highlightWidth={highlightWidth}
            highlightColor={highlightColor}
            shadowChain={shadowChain}
            letterSpacing={letterSpacing}
          />
          {arc2 && (
            <CurvedHeadline
              pathId="socials-arc-2"
              gradientId={HEADLINE_GRADIENT_TWO_ID}
              text={lineTwo ?? ''}
              fontSize={fontSizeTwo}
              borderWidth={borderWidth}
              borderColor={borderColor}
              highlightWidth={highlightWidth}
              highlightColor={highlightColor}
              shadowChain={shadowChain}
              letterSpacing={letterSpacing}
            />
          )}
        </svg>

        {showPill && !!pillText.trim() && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 80,
              transform: 'translateX(-50%)',
              backgroundColor: PILL_BG,
              color: '#ffffff',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 800,
              fontSize: 32,
              lineHeight: 1,
              padding: '24px 40px',
              borderRadius: 9999,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            {pillText}
          </div>
        )}
      </div>
    )
  },
)

interface CurvedHeadlineProps {
  pathId: string
  gradientId: string
  text: string
  fontSize: number
  borderWidth: number
  borderColor: string
  highlightWidth: number
  highlightColor: string
  shadowChain: string
  letterSpacing: number
}

function CurvedHeadline({
  pathId,
  gradientId,
  text,
  fontSize,
  borderWidth,
  borderColor,
  highlightWidth,
  highlightColor,
  shadowChain,
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
        filter={`url(#${HEADLINE_HALO_ID})`}
      >
        {textPathNode}
      </text>

      {/* Back layer — thick outer border + chunky 3D drop-shadow stack */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={2}
        paintOrder="stroke"
        style={{ filter: shadowChain }}
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

      {/* Inner shadow layer — gradient fill (no stroke) + inset shadow
          so the shadow only appears within the bright gradient area, not
          on the cream highlight rim. */}
      <text
        {...sharedTextProps}
        fill={`url(#${gradientId})`}
        filter={`url(#${HEADLINE_INNER_SHADOW_ID})`}
      >
        {textPathNode}
      </text>
    </g>
  )
}
