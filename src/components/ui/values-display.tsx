import type { CSSProperties } from "react"
import { WritingText } from "@/components/ui/writing-text"

type ValuesDisplayProps = {
  label?: string
  backgroundWord?: string
  terms?: string[]
  color?: string
  labelColor?: string
  backgroundOpacity?: number
  fontSize?: number
  backgroundFontSize?: number
  backgroundLetterSpacing?: number
  /** Gap between terms in em (scales with overlay font size) */
  termGap?: number
  stagger?: number
  stiffness?: number
  damping?: number
  className?: string
  style?: CSSProperties
}

const DEFAULT_TERMS = ["Censorship Resistance", "Open Source", "Privacy", "Security"]

function ValuesDisplay({
  label = "OUR VALUES",
  backgroundWord = "CROPS",
  terms = DEFAULT_TERMS,
  color = "#7235ED",
  labelColor = "#594D73",
  backgroundOpacity = 0.04,
  fontSize = 2.75,
  backgroundFontSize = 10.5,
  backgroundLetterSpacing = 0.14,
  termGap = 1,
  stagger = 0.08,
  stiffness = 170,
  damping = 15,
  className,
  style,
}: ValuesDisplayProps) {
  const segments = terms.map((t) => ({ text: t }))

  return (
    <div
      className={className}
      style={{
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: labelColor,
        }}
      >
        {label}
      </span>

      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: `${backgroundFontSize * 0.85}rem`,
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: `${backgroundFontSize}rem`,
            letterSpacing: `${backgroundLetterSpacing}em`,
            lineHeight: 1,
            color,
            opacity: backgroundOpacity,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {backgroundWord}
        </span>

        <WritingText
          segments={segments}
          stagger={stagger}
          stiffness={stiffness}
          damping={damping}
          wordSpacing={0.25}
          segmentGap={termGap}
          style={{
            position: "relative",
            justifyContent: "center",
            fontSize: `${fontSize}rem`,
            fontFamily: "Poppins, sans-serif",
            color,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        />
      </div>
    </div>
  )
}

export { ValuesDisplay }
export type { ValuesDisplayProps }
