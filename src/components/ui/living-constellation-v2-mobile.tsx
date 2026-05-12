import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Speaker } from '@/data/speakers'

const EVENT_LABEL: Record<string, string> = {
  '/speakers/past-event-logos/devcon4-prague.png': 'Devcon 4 Prague',
  '/speakers/past-event-logos/devcon5-osaka.png': 'Devcon 5 Osaka',
  '/speakers/past-event-logos/devcon6-bogota.png': 'Devcon 6 Bogota',
  '/speakers/past-event-logos/devcon7-sea.png': 'Devcon 7 SEA',
}

const ORBIT_DURATION = 50
const CARD_W = 80
const CARD_H = 112
const CARD_RADIUS = 10
const ELLIPSE_RX = '70vw'
const ELLIPSE_RY = '230px'
const LOGO_SIZE = Math.round(CARD_W * 0.3)
const LOGO_OFFSET = -Math.round(CARD_W * 0.1)
const CAPTION_GAP = 8

interface LivingConstellationV2MobileProps {
  speakers: Speaker[]
  className?: string
}

export function LivingConstellationV2Mobile({ speakers, className = '' }: LivingConstellationV2MobileProps) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const dismissing = useRef(false)

  const [speakerCount, setSpeakerCount] = useState(() => window.innerWidth > 480 ? 18 : 13)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 481px)')
    const handler = (e: MediaQueryListEvent) => setSpeakerCount(e.matches ? 18 : 13)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const allSpeakers = useMemo(() => {
    const order = [
      'vitalik', 'audrey', 'danny', 'aya', 'joseph', 'justin', 'brewster',
      'stani', 'sreeram', 'pooja', 'roger', 'mudit', 'tarun',
      'bruno', 'tomasz', 'sunny', 'puja', 'soham',
    ]
    const map = new Map(speakers.filter((s) => s.type !== 'logo').map((s) => [s.id, s]))
    return order.filter((id) => map.has(id)).map((id) => map.get(id)!).slice(0, speakerCount)
  }, [speakers, speakerCount])

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
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* Single elliptical orbit */}
      <div className="absolute inset-x-0" style={{ top: '50%', height: 0 }}>
        {allSpeakers.map((speaker, i) => {
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
                  layoutId={`speaker-v2-mobile-${speaker.id}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!dismissing.current) handleSelect(speaker)
                  }}
                  className="w-full h-full cursor-pointer relative"
                  style={{ pointerEvents: selectedSpeaker ? 'none' : 'auto' }}
                  whileTap={{ scale: 1.3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div
                    className="w-full h-full overflow-hidden flex items-center justify-center text-white font-semibold"
                    style={{
                      backgroundColor: speaker.color,
                      borderRadius: CARD_RADIUS,
                      outline: '1px solid rgba(34, 17, 68, 0.1)',
                      boxShadow: '0 2px 6px -2px rgba(34,17,68,0.12)',
                    }}
                  >
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {speaker.companyLogo && (
                    <div
                      className="absolute flex items-center justify-center overflow-hidden"
                      style={{
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        bottom: LOGO_OFFSET,
                        right: LOGO_OFFSET,
                        borderRadius: '50%',
                        background: '#fff',
                        boxShadow: '0 1px 4px -1px rgba(34,17,68,0.2)',
                        zIndex: 3,
                      }}
                    >
                      <img
                        src={speaker.companyLogo}
                        alt=""
                        className="object-contain"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
              {/* Name label */}
              {!isSelected && (
                <div
                  className="absolute left-1/2 pointer-events-none"
                  style={{
                    transform: 'translateX(-50%)',
                    top: CARD_H + CAPTION_GAP,
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'rgba(34,17,68,0.85)',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {speaker.name}
                </div>
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
                style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 32 }}
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
                style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 32 }}
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

      {/* Detail overlay */}
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
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4">
              <motion.div
                layoutId={`speaker-v2-mobile-${selectedSpeaker.id}`}
                className="pointer-events-auto bg-white rounded-2xl overflow-hidden shadow-xl relative"
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{
                  width: 'min(320px, calc(100vw - 48px))',
                  boxShadow: '0 18px 36px -12px rgba(34, 17, 68, 0.22), 0 6px 14px -8px rgba(34, 17, 68, 0.18)',
                  outline: '1px solid rgba(34, 17, 68, 0.08)',
                }}
              >
                <button
                  onClick={handleDismiss}
                  aria-label="Close speaker details"
                  className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#1a1a1a] flex items-center justify-center shadow-sm transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className="relative flex items-center justify-center text-white font-bold overflow-hidden"
                  style={{ height: 220, backgroundColor: selectedSpeaker.color, fontSize: 56 }}
                >
                  <img
                    src={selectedSpeaker.image}
                    alt={selectedSpeaker.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  {selectedSpeaker.eventLogo && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5"
                      style={{
                        height: 32,
                        background: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                      }}
                    >
                      <img src={selectedSpeaker.eventLogo} alt="" className="object-contain" style={{ height: 16 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                        {EVENT_LABEL[selectedSpeaker.eventLogo] ?? ''}
                      </span>
                    </div>
                  )}
                </div>
                <motion.div
                  className="p-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.22 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight leading-tight truncate">
                        {selectedSpeaker.name}
                      </h3>
                      <p className="text-sm text-[#3a3a3a] mt-1">{selectedSpeaker.title}</p>
                      <p className="text-sm text-[#6b6b6b]">{selectedSpeaker.company}</p>
                    </div>
                    {selectedSpeaker.companyLogo && (
                      <img
                        src={selectedSpeaker.companyLogo}
                        alt=""
                        className="object-contain shrink-0"
                        style={{ height: 48 }}
                      />
                    )}
                  </div>
                  <a
                    href={`https://archive.devcon.org/watch/?sort=eventId&order=desc&q=${encodeURIComponent(
                      selectedSpeaker.name.toLowerCase()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 flex items-center justify-center gap-2 w-full rounded-full bg-[#7235ED] hover:bg-[#6020d0] text-white text-sm font-bold py-2.5 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 2.5 L13 8 L3 13.5 Z" fill="currentColor" />
                    </svg>
                    Watch talks on Devcon Archive
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
