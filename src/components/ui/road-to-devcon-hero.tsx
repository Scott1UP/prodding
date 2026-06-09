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
import { useIsMobile } from '@/hooks/useIsMobile'

const ASSET_BASE = '/road-to-devcon'

// Two progressively-larger tiers below desktop. At ≤1024 the outer ring fills
// the viewport and bleeds off the edges; at ≤600 it scales up further (outer
// ring spilling slightly past the width is fine) for a full-screen feel where
// the logo reads large. Being fully contained isn't useful on a tall, narrow
// screen.
const MOBILE_BREAKPOINT = 1024
const SMALL_BREAKPOINT = 600

// Concentric rings, ordered back-to-front. `factor` keeps the Art Director's
// 3:2:1 rotation ratio (the middle ring counter-rotates). `spring` makes each
// ring trail the scroll with momentum — near-critically damped (no bounce),
// with the outer ring heaviest/slowest so the rings stagger instead of moving
// in lockstep. `mobileWidth`/`smallWidth` scale the whole set up while keeping
// the rings' relative spacing identical.
const RINGS = [
  { src: `${ASSET_BASE}/l3.webp`, width: '81.5%', mobileWidth: '118%', smallWidth: '225%', z: 1, factor: 0.05, spring: { stiffness: 60, damping: 20, mass: 1.4 } },
  { src: `${ASSET_BASE}/l2.webp`, width: '71.25%', mobileWidth: '103%', smallWidth: '196.5%', z: 2, factor: -0.1, spring: { stiffness: 75, damping: 20, mass: 1.2 } },
  { src: `${ASSET_BASE}/l1.webp`, width: '52.4%', mobileWidth: '76%', smallWidth: '145.5%', z: 3, factor: 0.15, spring: { stiffness: 90, damping: 20, mass: 1 } },
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

function Ring({ progress, reduceMotion, isMobile, isSmall, src, width, mobileWidth, smallWidth, z, factor, spring }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduceMotion: boolean
  isMobile: boolean
  isSmall: boolean
} & (typeof RINGS)[number]) {
  const target = useTransform(progress, [0, 1], [0, MAX_ROTATION * factor])
  const springRotate = useSpring(target, spring)
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      className="absolute left-1/2 top-1/2 max-w-none"
      style={{ width: isSmall ? smallWidth : isMobile ? mobileWidth : width, zIndex: z, x: '-50%', y: '-50%', rotate: reduceMotion ? target : springRotate }}
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
  const isMobile = useIsMobile(MOBILE_BREAKPOINT)
  const isSmall = useIsMobile(SMALL_BREAKPOINT)

  // On mobile the mascot is anchored inside a square whose width tracks the
  // outer ring, so it stays placed relative to the rings at every tier.
  const outerRing = RINGS[0]
  const devaAnchorWidth = isSmall ? outerRing.smallWidth : outerRing.mobileWidth

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
          {/* Mascot. On desktop a fixed wrapper sits it above the rings. On
              mobile it's anchored inside a centered, width-sized square so its
              position scales with the (width-driven) rings instead of drifting
              high on a tall viewport. Inner image handles the float either way. */}
          <div
            className={
              isMobile
                ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square z-[5]'
                : 'absolute left-1/2 -translate-x-1/2 w-[19%] z-[5]'
            }
            style={isMobile ? { width: devaAnchorWidth } : { top: 'calc(28% - 150px)' }}
          >
            <motion.img
              src={`${ASSET_BASE}/deva.webp`}
              alt="Deva"
              className={isMobile ? 'absolute left-1/2 top-[20%] -translate-x-1/2 w-[23%]' : 'w-full'}
              style={{ x: devaX, y: devaY }}
            />
          </div>

          {/* Static centered logo */}
          <img
            src={`${ASSET_BASE}/logo.webp`}
            alt="Road to Devcon"
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none z-[4] ${isSmall ? 'w-[108%]' : isMobile ? 'w-[58%]' : 'w-[40%]'}`}
          />

          {/* Scroll-driven rotating rings */}
          {RINGS.map((ring) => (
            <Ring key={ring.src} progress={scrollYProgress} reduceMotion={!!reduceMotion} isMobile={isMobile} isSmall={isSmall} {...ring} />
          ))}
        </div>
      </div>
    </section>
  )
}
