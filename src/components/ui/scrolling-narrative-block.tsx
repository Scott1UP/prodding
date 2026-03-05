import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface NarrativeSection {
  content: React.ReactNode
}

const defaultSections: NarrativeSection[] = [
  {
    content: (
      <>
        <span className="font-semibold">It is infrastructure.</span>
        <br /><br />
        Real systems are being built.
        <br />
        Real problems are being solved.
      </>
    ),
  },
  {
    content: (
      <>
        Real communities around the world are advancing it.
        <br />
        Mumbai is one of its most important chapters.
      </>
    ),
  },
  {
    content: (
      <>
        Growth here is grassroots and builder-led.
        <br />
        Driven not by institutional mandates or market cycles,
        <br />
        but by engineers who see technology as a tool
        <br />
        to solve large-scale, real-world challenges.
      </>
    ),
  },
  {
    content: (
      <>
        Devcon 8 comes to Mumbai to be part of that.
        <br />
        To contribute to it.
        <br />
        And to demonstrate that Ethereum's commitment to decentralization,
        <br />
        openness, and long-term thinking isn't rhetoric.
      </>
    ),
  },
  {
    content: (
      <span className="font-semibold">It's how we show up.</span>
    ),
  },
]

interface ScrollingNarrativeBlockProps {
  sections?: NarrativeSection[]
  duration?: number
  interactive?: boolean
}

export function ScrollingNarrativeBlock({
  sections = defaultSections,
  duration = 0.3,
  interactive = true,
}: ScrollingNarrativeBlockProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(1)
  const [isHovering, setIsHovering] = useState(false)
  const isAnimating = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isHovering || !interactive) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isAnimating.current) return
      if (Math.abs(e.deltaY) < 5) return

      const dir = e.deltaY > 0 ? 1 : -1
      setScrollDirection(dir)
      setCurrentSection((prev) => {
        const next = prev + dir
        if (next < 0 || next >= sections.length) return prev
        isAnimating.current = true
        setTimeout(() => {
          isAnimating.current = false
        }, duration * 1000 + 600)
        return next
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [isHovering, interactive, sections.length, duration])

  const handleDotClick = useCallback(
    (index: number) => {
      if (isAnimating.current || index === currentSection) return
      setScrollDirection(index > currentSection ? 1 : -1)
      isAnimating.current = true
      setCurrentSection(index)
      setTimeout(() => {
        isAnimating.current = false
      }, duration * 1000 + 600)
    },
    [currentSection, duration]
  )

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{ background: 'linear-gradient(180deg, #1A0D33 -65%, #45326C 88.89%)' }}
    >
      <div className="flex items-stretch min-h-[200px]">
        {/* Left — static branding */}
        <div className="flex items-center gap-5 w-[44%] shrink-0 px-10 py-10">
          <img
            src="/eth-logo.svg"
            alt="Ethereum"
            className="h-[88px] w-auto shrink-0"
          />
          <div>
            <h2 className="text-[22px] font-bold text-white leading-[1.25] tracking-[-0.01em]">
              Building the infrastructure
              <br />
              for tomorrow's world
            </h2>
            <p className="mt-1.5 text-white text-[17px] font-light leading-snug">
              The technology is no longer theoretical.
            </p>
          </div>
        </div>

        {/* Right — scrollable narrative */}
        <div className="flex-1 flex items-center px-8 py-10 relative">
          <div className="flex-1 pr-14 min-h-[80px] flex items-center">
            <AnimatePresence mode="wait" initial={false} custom={scrollDirection}>
              <motion.div
                key={currentSection}
                custom={scrollDirection}
                variants={{
                  enter: (dir: number) => ({ opacity: 0, y: dir * 32 }),
                  center: { opacity: 1, y: 0 },
                  exit: (dir: number) => ({ opacity: 0, y: dir * -32 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration,
                  ease: [0.0, 0.0, 0.2, 1],
                }}
                className="text-white text-base font-light leading-[1.65] tracking-[0.005em]"
              >
                {sections[currentSection].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Section indicators */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-[6px]">
            {sections.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className="cursor-pointer transition-all duration-300"
                aria-label={`Go to section ${i + 1}`}
              >
                <span
                  className="block w-[3px] rounded-full transition-all duration-300"
                  style={{
                    height: i === currentSection ? '20px' : '10px',
                    backgroundColor:
                      i === currentSection
                        ? 'rgba(255,255,255,1)'
                        : 'rgba(255,255,255,0.3)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
