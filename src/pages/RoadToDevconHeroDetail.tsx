import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, Monitor, X } from 'lucide-react'
import { RoadToDevconHero } from '@/components/ui/road-to-devcon-hero'
import {
  AnnouncementBanner,
  DevconNavbar,
  BANNER_H,
} from '@/components/ui/devcon-navbar'
import { DevconAboutSection } from '@/components/ui/devcon-about-section'
import { DevconEventsSection } from '@/components/ui/devcon-events-section'
import { ExportDialog } from '@/components/ExportDialog'
import roadToDevconHeroSource from '@/components/ui/road-to-devcon-hero.tsx?raw'
import devconAboutSectionSource from '@/components/ui/devcon-about-section.tsx?raw'

function WebsitePreview({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape and lock body scroll while open (Layout.tsx pattern).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[60] overflow-y-auto bg-[#1a0d33]">
      <AnnouncementBanner />
      {/* Navbar overlays the top of the hero so its translucent gradient fades
          over the hero artwork (per the Figma design). */}
      <div className="relative">
        <RoadToDevconHero
          height={`calc(100vh - ${BANNER_H}px)`}
          scrollContainerRef={overlayRef}
        />
        <div className="absolute inset-x-0 top-0 z-20">
          <DevconNavbar />
        </div>
      </div>
      <DevconAboutSection />
      <DevconEventsSection />

      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-full bg-[#160b2b]/80 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-[#160b2b] transition-colors cursor-pointer"
      >
        <X size={16} strokeWidth={2} />
        Exit preview
      </button>
    </div>,
    document.body,
  )
}

export default function RoadToDevconHeroDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div>
      {/* Header */}
      <header className="mb-6">
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
            Road to Devcon Hero
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-base"
              onClick={() => setPreviewOpen(true)}
            >
              <Monitor size={16} strokeWidth={1.5} />
              Website preview
            </Button>
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
        </div>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed max-w-2xl">
          A full-bleed hero with layered concentric rings that rotate as you scroll
          past, a static centered logo, and a mascot drifting along a figure-8 path.
          Scroll down to drive the ring rotation, or open the website preview to see it
          in context.
        </p>
      </header>

      {/* Preview */}
      <RoadToDevconHero />
      <DevconAboutSection />

      {previewOpen && <WebsitePreview onClose={() => setPreviewOpen(false)} />}

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        installCommand="npm install motion"
        components={[
          { fileName: 'road-to-devcon-hero.tsx', source: roadToDevconHeroSource, label: 'Hero' },
          { fileName: 'devcon-about-section.tsx', source: devconAboutSectionSource, label: 'About' },
        ]}
        assets={[
          { url: '/road-to-devcon/bg.jpg', name: 'bg.jpg' },
          { url: '/road-to-devcon/logo.webp', name: 'logo.webp' },
          { url: '/road-to-devcon/l1.webp', name: 'l1.webp' },
          { url: '/road-to-devcon/l2.webp', name: 'l2.webp' },
          { url: '/road-to-devcon/l3.webp', name: 'l3.webp' },
          { url: '/road-to-devcon/deva.webp', name: 'deva.webp' },
        ]}
        setupNotes={[
          'Place these assets under public/road-to-devcon/ :',
          '  bg.jpg      — background',
          '  logo.webp   — centered logo',
          '  l1.webp     — inner ring',
          '  l2.webp     — middle ring',
          '  l3.webp     — outer ring',
          '  deva.webp   — mascot',
        ].join('\n')}
        setupNotesLabel="Assets"
      />
    </div>
  )
}
