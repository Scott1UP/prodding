import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Speaker } from '@/data/speakers'

const ORBIT_DURATION = 27
const CARD_W = 80
const CARD_H = 112
const CARD_RADIUS = 10
const ELLIPSE_RX = '70vw'
const ELLIPSE_RY = '220px'

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

interface RotatingSpeakersMobileProps {
  speakers: Speaker[]
  className?: string
}

export function RotatingSpeakersMobile({ speakers, className = '' }: RotatingSpeakersMobileProps) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const dismissing = useRef(false)

  const allSpeakers = useMemo(() => {
    return speakers.filter((s) => s.type !== 'logo').slice(0, 15)
  }, [speakers])

  useEffect(() => {
    if (!selectedSpeaker) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedSpeaker])

  const handleSelect = useCallback((speaker: Speaker) => {
    setSelectedSpeaker(speaker)
    setActiveSpeaker(speaker.id)
  }, [])

  const handleDismiss = useCallback(() => {
    dismissing.current = true
    setSelectedSpeaker(null)
    setActiveSpeaker(null)
    requestAnimationFrame(() => {
      dismissing.current = false
    })
  }, [])

  const animState = selectedSpeaker ? 'paused' : 'running'

  return (
    <div className={`relative w-full select-none ${className}`} style={{ height: 700 }}>
      {/* Single elliptical orbit */}
      <div className="absolute inset-x-0" style={{ top: '50%', height: 0 }}>
        {allSpeakers.map((speaker, i) => {
          const tilt = CARD_TILTS[i % CARD_TILTS.length]
          const isSelected = selectedSpeaker?.id === speaker.id
          const delay = -(ORBIT_DURATION * i) / allSpeakers.length

          return (
            <div
              key={speaker.id}
              className="absolute"
              style={{
                left: '50%',
                top: 0,
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                offsetPath: `ellipse(${ELLIPSE_RX} ${ELLIPSE_RY})`,
                offsetRotate: '0deg',
                animation: `ellipse-orbit-slide ${ORBIT_DURATION}s linear infinite`,
                animationDelay: `${delay}s`,
                animationPlayState: animState,
              } as React.CSSProperties}
            >
              {isSelected ? (
                <div style={{ width: CARD_W, height: CARD_H }} />
              ) : (
                <motion.div
                  layoutId={`speaker-mobile-${speaker.id}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!dismissing.current) handleSelect(speaker)
                  }}
                  className="w-full h-full cursor-pointer"
                  style={{
                    transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    pointerEvents: selectedSpeaker ? 'none' : 'auto',
                  }}
                  whileTap={{ scale: 1.3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div
                    className="w-full h-full overflow-hidden flex items-center justify-center text-white font-semibold"
                    style={{
                      backgroundColor: speaker.color,
                      fontSize: CARD_W * 0.3,
                      borderRadius: CARD_RADIUS,
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

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center" style={{ height: 36 }}>
          <AnimatePresence>
            {activeSpeaker ? (
              <motion.p
                key={activeSpeaker}
                className="text-text-primary tracking-tight whitespace-nowrap absolute"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: 24,
                }}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.12 }}
              >
                {speakers.find((s) => s.id === activeSpeaker)?.name}
              </motion.p>
            ) : (
              <motion.h2
                key="default"
                className="text-text-primary tracking-tight absolute whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: 24,
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

      {/* Selected card overlay */}
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
                layoutId={`speaker-mobile-${selectedSpeaker.id}`}
                onClick={handleDismiss}
                className="pointer-events-auto cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  width: 300,
                  boxShadow: '0 4px 6px -1px rgba(34, 17, 68, 0.1), 0 2px 4px -2px rgba(34, 17, 68, 0.1)',
                  outline: '1px solid rgba(34, 17, 68, 0.1)',
                  outlineOffset: 0,
                }}
              >
                <div
                  className="relative flex items-center justify-center text-white font-bold overflow-hidden"
                  style={{
                    height: 260,
                    backgroundColor: selectedSpeaker.color,
                    fontSize: 48,
                  }}
                >
                  <img
                    src={selectedSpeaker.image}
                    alt={selectedSpeaker.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
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
