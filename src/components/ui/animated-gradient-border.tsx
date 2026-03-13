import { type ReactNode, type CSSProperties } from 'react'

export interface AnimatedGradientBorderProps {
  children: ReactNode
  colors?: string[]
  speed?: number
  direction?: 'cw' | 'ccw'
  borderWidth?: number
  className?: string
  style?: CSSProperties
}

export function AnimatedGradientBorder({
  children,
  colors = ['#DECFFB', '#B08DF5'],
  speed = 6,
  direction = 'cw',
  borderWidth = 1,
  className,
  style,
}: AnimatedGradientBorderProps) {
  const stops = colors
    .map((color, i) => `${color} ${(i / (colors.length - 1)) * 100}%`)
    .join(', ')

  return (
    <div
      className="relative rounded-full"
      style={style}
    >
      {/* Gradient layer — extends outside content by borderWidth */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{ inset: -borderWidth }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            aspectRatio: '1 / 1',
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(from 0deg, ${stops})`,
            animationName: 'gradient-border-spin',
            animationDuration: `${speed}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: direction === 'ccw' ? 'reverse' : 'normal',
            transition: 'none',
          }}
        />
      </div>

      {/* Content — sits above the gradient */}
      <div className={`relative bg-white rounded-full ${className ?? ''}`}>
        {children}
      </div>
    </div>
  )
}
