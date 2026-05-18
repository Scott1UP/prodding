import { useRef } from "react"
import type { CSSProperties } from "react"
import { motion, useInView } from "motion/react"

type TextSegment = {
  text: string
  className?: string
}

type WritingTextProps = {
  text?: string
  segments?: TextSegment[]
  className?: string
  style?: CSSProperties
  stagger?: number
  stiffness?: number
  damping?: number
  wordSpacing?: number
  segmentGap?: number
  triggerOnScroll?: boolean
}

function WritingText({
  text,
  segments,
  className,
  style,
  stagger = 0.08,
  stiffness = 100,
  damping = 15,
  wordSpacing = 0.25,
  segmentGap,
  triggerOnScroll = false,
}: WritingTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  const shouldAnimate = triggerOnScroll ? isInView : true

  // Build a flat list of words; mark the last word of each segment so we can add inter-segment spacing
  const words: { word: string; className?: string; isSegmentEnd?: boolean }[] = []
  if (segments) {
    for (const seg of segments) {
      const segWords = seg.text.split(" ").filter(Boolean)
      segWords.forEach((w, idx) => {
        words.push({ word: w, className: seg.className, isSegmentEnd: idx === segWords.length - 1 })
      })
    }
  } else if (text) {
    for (const w of text.split(" ")) {
      if (w) words.push({ word: w })
    }
  }

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", flexWrap: "wrap", ...style }}>
      {words.map((entry, i) => {
        const isLast = i === words.length - 1
        const useSegmentGap = !isLast && entry.isSegmentEnd && segmentGap != null
        const marginRight = isLast
          ? 0
          : useSegmentGap
            ? `${segmentGap}em`
            : `${wordSpacing}em`
        return (
        <span
          key={i}
          className={entry.className}
          style={{
            display: "inline-block",
            marginRight,
            overflow: "hidden",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: "0.5em" }}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.5em" }}
            transition={{
              type: "spring",
              stiffness,
              damping,
              delay: i * stagger,
            }}
          >
            {entry.word}
          </motion.span>
        </span>
        )
      })}
    </span>
  )
}

export { WritingText }
export type { WritingTextProps, TextSegment }
