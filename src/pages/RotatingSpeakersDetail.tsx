import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotatingSpeakers } from '@/components/ui/rotating-speakers'
import { RotatingSpeakersMobile } from '@/components/ui/rotating-speakers-mobile'
import { speakers } from '@/data/speakers'
import { Button } from '@/components/ui/button'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code } from 'lucide-react'
import rotatingSpeakersSource from '@/components/ui/rotating-speakers.tsx?raw'
import rotatingSpeakersMobileSource from '@/components/ui/rotating-speakers-mobile.tsx?raw'
import speakersDataSource from '@/data/speakers.ts?raw'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(`(max-width: ${breakpoint}px)`).matches)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

export default function RotatingSpeakersDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)
  const isMobile = useIsMobile(1024)

  const combinedSource = `// rotating-speakers.tsx\n${rotatingSpeakersSource}\n\n// rotating-speakers-mobile.tsx\n${rotatingSpeakersMobileSource}\n\n// speakers.ts (data)\n${speakersDataSource}`

  return (
    <div className="space-y-6">
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/experiments')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Rotating Speakers
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-base"
            onClick={() => setExportOpen(true)}
          >
            <Code size={16} strokeWidth={1.5} />
            Export
          </Button>
        </div>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed max-w-2xl">
          Speaker portraits orbiting in concentric elliptical rings. Hover to
          pause, click a speaker to reveal their details in the center.
        </p>
      </header>

      {isMobile ? (
        <div
          className="relative -mx-16 overflow-x-clip"
          style={{ background: 'var(--BG-Main, linear-gradient(0deg, #E5EBFF 19.98%, #FBFAFC 100%))' }}
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FBFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#E8EDFF] to-transparent z-10 pointer-events-none" />
          <img
            src="/speakers/bg/DC8-Moon-BG-Element.svg"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ height: '50vh', objectFit: 'contain' }}
          />
          <RotatingSpeakersMobile speakers={speakers} />
        </div>
      ) : (
        <div
          className="relative w-full rounded-xl border border-border overflow-hidden"
          style={{ height: 'calc(70vh + 128px)', minHeight: 828, background: 'var(--BG-Main, linear-gradient(0deg, #E5EBFF 19.98%, #FBFAFC 100%))' }}
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FBFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#E8EDFF] to-transparent z-10 pointer-events-none" />
          <img
            src="/speakers/bg/DC8-Moon-BG-Element.svg"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ height: '92%', objectFit: 'contain' }}
          />
          <RotatingSpeakers speakers={speakers} />
        </div>
      )}

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={combinedSource}
        installCommand="npm install motion"
        fileName="rotating-speakers.tsx"
      />
    </div>
  )
}
