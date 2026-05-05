import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Speaker } from '@/data/speakers'

const RING_CONFIG = [
  { radiusPct: 0.17, duration: 20, sizes: [[46,66],[50,72],[48,68],[52,74],[47,68],[50,70],[46,66],[49,71]] as const, radius: 4 },
  { radiusPct: 0.30, duration: 34, sizes: [[66,96],[72,104],[68,98],[74,106],[70,100],[66,96],[72,102],[68,98],[70,100]] as const, radius: 8 },
  { radiusPct: 0.46, duration: 48, sizes: [[90,128],[98,140],[86,122],[94,134],[92,130],[88,126],[96,136],[90,128]] as const, radius: 12 },
] as const

const CARD_TILTS = [
  { rx: -8, ry: 12 },
  { rx: 5, ry: -10 },
  { rx: -12, ry: -6 },
  { rx: 10, ry: 8 },
  { rx: -6, ry: -14 },
  { rx: 8, ry: 10 },
  { rx: -10, ry: 5 },
  { rx: 14, ry: -8 },
  { rx: -5, ry: 12 },
  { rx: 12, ry: -5 },
  { rx: -8, ry: -10 },
  { rx: 6, ry: 14 },
  { rx: -14, ry: 8 },
  { rx: 10, ry: -12 },
  { rx: -6, ry: 6 },
  { rx: 8, ry: -14 },
  { rx: -12, ry: 10 },
  { rx: 14, ry: -6 },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
}

interface RotatingSpeakersProps {
  speakers: Speaker[]
  className?: string
}

export function RotatingSpeakers({ speakers, className = '' }: RotatingSpeakersProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [hoveredSpeaker, setHoveredSpeaker] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedSpeaker) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSpeaker(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedSpeaker])

  const handleSelect = useCallback((speaker: Speaker) => {
    setSelectedSpeaker(speaker)
  }, [])

  const dismissing = useRef(false)

  const handleDismiss = useCallback(() => {
    dismissing.current = true
    setSelectedSpeaker(null)
    setIsPaused(false)
    setHoveredSpeaker(null)
    requestAnimationFrame(() => {
      dismissing.current = false
    })
  }, [])

  const ringGroups = useMemo(() => {
    const speakersOnly = speakers.filter((s) => s.type !== 'logo')
    const groups: Speaker[][] = [[], [], []]
    speakersOnly.forEach((s, i) => groups[i % 3].push(s))
    const moved = groups[0].splice(-1, 1)
    groups[1].push(...moved)
    return groups
  }, [speakers])

  const animState = isPaused || selectedSpeaker ? 'paused' : 'running'

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden ${className}`}
      style={{ height: '100%' }}
    >
      {/* Center logo behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
        {speakers.filter((s) => s.eventLogo).map((s) => (
          <img
            key={s.id}
            src={s.eventLogo}
            alt=""
            className="absolute"
            style={{
              width: 128,
              height: 128,
              objectFit: 'contain',
              opacity: hoveredSpeaker === s.id ? 0.15 : 0,
              transition: 'opacity 150ms ease-out',
            }}
          />
        ))}
      </div>

      {/* Center title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center" style={{ height: 48 }}>
          <AnimatePresence>
            {hoveredSpeaker ? (
              <motion.p
                key={hoveredSpeaker}
                className="text-text-primary tracking-tight whitespace-nowrap absolute"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: 32,
                }}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.12 }}
              >
                {speakers.find((s) => s.id === hoveredSpeaker)?.name}
              </motion.p>
            ) : (
              <motion.h2
                key="default"
                className="text-text-primary tracking-tight absolute whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: 32,
                }}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.12 }}
              >
                Past speakers
              </motion.h2>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rotating rings */}
      {ringGroups.map((group, ringIndex) => {
        const config = RING_CONFIG[ringIndex]
        const radius = containerWidth * config.radiusPct

        return (
          <div
            key={ringIndex}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              animation: `ring-orbit ${config.duration}s linear infinite`,
              animationPlayState: animState,
            }}
          >
            {group.map((speaker, i) => {
              const angle = ((2 * Math.PI) / group.length) * i
              const x = radius * Math.cos(angle)
              const y = radius * Math.sin(angle)
              const [w, h] = config.sizes[i % config.sizes.length]
              const tilt = CARD_TILTS[(ringIndex * 10 + i) % CARD_TILTS.length]
              const isSelected = selectedSpeaker?.id === speaker.id
              const isHovered = hoveredSpeaker === speaker.id

              const angleDeg = (360 / group.length) * i

              const isLogo = speaker.type === 'logo'
              const itemW = isLogo ? Math.round(w * 0.5) : w
              const itemH = isLogo ? Math.round(w * 0.5) : h

              return (
                <div
                  key={speaker.id}
                  className="absolute"
                  style={{
                    left: x - itemW / 2,
                    top: y - itemH / 2,
                    width: itemW,
                    height: itemH,
                    transform: `rotate(${angleDeg + 90}deg)`,
                    zIndex: isHovered ? 20 : 1,
                  }}
                >
                  {isLogo ? (
                    <div
                      className="w-full h-full pointer-events-none"
                      style={{
                        transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                      }}
                    >
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-contain opacity-60"
                      />
                    </div>
                  ) : isSelected ? (
                    <div style={{ width: itemW, height: itemH }} />
                  ) : (
                    <motion.div
                      layoutId={`speaker-${speaker.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!dismissing.current) handleSelect(speaker)
                      }}
                      onMouseEnter={() => {
                        if (dismissing.current) return
                        setHoveredSpeaker(speaker.id)
                        setIsPaused(true)
                      }}
                      onMouseLeave={() => {
                        setHoveredSpeaker(null)
                        setIsPaused(false)
                      }}
                      className="w-full h-full cursor-pointer"
                      style={{
                        transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                        pointerEvents: selectedSpeaker ? 'none' : 'auto',
                      }}
                      whileHover={{ scale: 1.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div
                        className="w-full h-full overflow-hidden flex items-center justify-center text-white font-semibold"
                        style={{
                          backgroundColor: speaker.color,
                          fontSize: w * 0.3,
                          borderRadius: config.radius,
                          outline: '1px solid rgba(34, 17, 68, 0.1)',
                          outlineOffset: 0,
                        }}
                      >
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <span className="hidden absolute">{getInitials(speaker.name)}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Center card overlay */}
      <AnimatePresence>
        {selectedSpeaker && (
          <>
            <motion.div
              className="absolute inset-0 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleDismiss}
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)' }}
            />
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <motion.div
                layoutId={`speaker-${selectedSpeaker.id}`}
                onClick={handleDismiss}
                className="pointer-events-auto cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  width: 260,
                  boxShadow: '0 4px 6px -1px rgba(34, 17, 68, 0.1), 0 2px 4px -2px rgba(34, 17, 68, 0.1)',
                  outline: '1px solid rgba(34, 17, 68, 0.1)',
                  outlineOffset: 0,
                }}
              >
                {/* Image area */}
                <div
                  className="relative flex items-center justify-center text-white font-bold overflow-hidden"
                  style={{
                    height: 220,
                    backgroundColor: selectedSpeaker.color,
                    fontSize: 56,
                  }}
                >
                  <img
                    src={selectedSpeaker.image}
                    alt={selectedSpeaker.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                {/* Info area with logo */}
                <motion.div
                  className="flex items-center justify-between p-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.2 }}
                >
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-lg font-bold text-[#1a1a1a] tracking-tight leading-tight">
                      {selectedSpeaker.name}
                    </h3>
                    <p className="text-sm text-[#3a3a3a] font-regular mt-0.5">
                      {selectedSpeaker.title}
                    </p>
                    <p className="text-sm text-[#6b6b6b] font-regular">
                      {selectedSpeaker.company}
                    </p>
                  </div>
                  {(selectedSpeaker.eventLogo || '/devcon-logo.svg') && (
                    <img
                      src={selectedSpeaker.eventLogo || '/devcon-logo.svg'}
                      alt=""
                      className="object-contain shrink-0 ml-3"
                      style={{ height: 54 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
