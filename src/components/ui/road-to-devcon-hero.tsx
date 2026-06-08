import { useRef, type RefObject } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from 'motion/react'

const ASSET_BASE = '/road-to-devcon'

// Concentric rings, ordered back-to-front. `factor` keeps the Art Director's
// 3:2:1 rotation ratio (the middle ring counter-rotates). `spring` makes each
// ring trail the scroll with momentum — near-critically damped (no bounce),
// with the outer ring heaviest/slowest so the rings stagger instead of moving
// in lockstep.
const RINGS = [
  { src: `${ASSET_BASE}/l3.webp`, width: '81.5%', z: 1, factor: 0.05, spring: { stiffness: 60, damping: 20, mass: 1.4 } },
  { src: `${ASSET_BASE}/l2.webp`, width: '71.25%', z: 2, factor: -0.1, spring: { stiffness: 75, damping: 20, mass: 1.2 } },
  { src: `${ASSET_BASE}/l1.webp`, width: '52.4%', z: 3, factor: 0.15, spring: { stiffness: 90, damping: 20, mass: 1 } },
] as const

// Total scroll-driven rotation (deg) applied to a factor of 1.0 across the
// hero's travel through the viewport. Tune here to taste.
const MAX_ROTATION = 600

// How far (px) the hero composition bleeds below its box into the next
// section, where it fades out. The About section's gradient fades over this
// same distance so the artwork is one continuous, seamless composition.
export const HERO_BLEED = 200

// Lemniscate (figure-8) float for the mascot.
const DEVA_RADIUS = 25 // px
const DEVA_SPEED = 0.24 // rad/sec (~26s per full cycle)

function Ring({ progress, reduceMotion, src, width, z, factor, spring }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduceMotion: boolean
} & (typeof RINGS)[number]) {
  const target = useTransform(progress, [0, 1], [0, MAX_ROTATION * factor])
  const springRotate = useSpring(target, spring)
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      className="absolute left-1/2 top-1/2 max-w-none"
      style={{ width, zIndex: z, x: '-50%', y: '-50%', rotate: reduceMotion ? target : springRotate }}
    />
  )
}

export function RoadToDevconHero({
  scrollContainerRef,
  height = '100vh',
}: {
  /** Scroll container the hero lives in. Omit to track the window. */
  scrollContainerRef?: RefObject<HTMLElement | null>
  /** CSS height of the hero section. */
  height?: string
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
    ...(scrollContainerRef ? { container: scrollContainerRef } : {}),
  })

  // Mascot drifts along a lemniscate; offsets are layered on top of the
  // wrapper's centering transform.
  const devaX = useMotionValue(0)
  const devaY = useMotionValue(0)
  useAnimationFrame((elapsed) => {
    if (reduceMotion) return
    const t = (elapsed / 1000) * DEVA_SPEED
    const sin = Math.sin(t)
    const denom = 1 + sin * sin
    devaX.set((DEVA_RADIUS * Math.cos(t)) / denom)
    devaY.set((DEVA_RADIUS * sin * Math.cos(t)) / denom)
  })

  return (
    <section ref={ref} className="relative w-full bg-black" style={{ height }}>
      {/* Composition is clipped at the top and sides, but extends HERO_BLEED px
          below the hero box so the artwork bleeds into the next section. */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: `calc(${height} + ${HERO_BLEED}px)` }}
      >
        {/* Background mandala — fills the bleeding box so it travels down too */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${ASSET_BASE}/bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Foreground anchored to the hero box so the rings stay centered on
            the visible hero while bleeding below it. */}
        <div className="absolute inset-x-0 top-0" style={{ height }}>
          {/* Mascot — wrapper handles centering, inner image handles the float */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[19%] z-[5]"
            style={{ top: 'calc(28% - 150px)' }}
          >
            <motion.img
              src={`${ASSET_BASE}/deva.webp`}
              alt="Deva"
              className="w-full"
              style={{ x: devaX, y: devaY }}
            />
          </div>

          {/* Static centered logo */}
          <img
            src={`${ASSET_BASE}/logo.webp`}
            alt="Road to Devcon"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] max-w-none z-[4]"
          />

          {/* Scroll-driven rotating rings */}
          {RINGS.map((ring) => (
            <Ring key={ring.src} progress={scrollYProgress} reduceMotion={!!reduceMotion} {...ring} />
          ))}
        </div>
      </div>
    </section>
  )
}
