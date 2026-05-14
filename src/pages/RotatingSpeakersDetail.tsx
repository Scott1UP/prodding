import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LivingConstellationV2 } from '@/components/ui/living-constellation-v2'
import { LivingConstellationV2Mobile } from '@/components/ui/living-constellation-v2-mobile'
import AnimatedGradient from '@/components/fancy/background/animated-gradient-with-svg'
import { speakers } from '@/data/speakers'
import { Button } from '@/components/ui/button'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import livingConstellationV2Source from '@/components/ui/living-constellation-v2.tsx?raw'
import livingConstellationV2MobileSource from '@/components/ui/living-constellation-v2-mobile.tsx?raw'
import speakersDataSource from '@/data/speakers.ts?raw'
import animatedGradientSource from '@/components/fancy/background/animated-gradient-with-svg.tsx?raw'
import speakerDetailOverlaySource from '@/components/ui/speaker-detail-overlay.tsx?raw'
import speakerBlurDataSource from '@/data/speaker-blur-data.ts?raw'
import useDebouncedDimensionsSource from '@/hooks/use-debounced-dimensions.ts?raw'
import generateBlurScript from '../../scripts/generate-blur-placeholders.mjs?raw'

const GRADIENT_COLORS = ['#fff0e6', '#f5f0ff', '#c4aaf7', '#FFE0CC']
const GRADIENT_SPEED = 15

const combinedSource = `// living-constellation-v2.tsx\n${livingConstellationV2Source}\n\n// living-constellation-v2-mobile.tsx\n${livingConstellationV2MobileSource}\n\n// speaker-detail-overlay.tsx\n${speakerDetailOverlaySource}\n\n// animated-gradient-with-svg.tsx\n${animatedGradientSource}\n\n// use-debounced-dimensions.ts\n${useDebouncedDimensionsSource}\n\n// speakers.ts (data)\n${speakersDataSource}\n\n// speaker-blur-data.ts (generated blur placeholders)\n${speakerBlurDataSource}\n\n// generate-blur-placeholders.mjs (run: node scripts/generate-blur-placeholders.mjs)\n${generateBlurScript}`

export default function RotatingSpeakersDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)
  const isMobile = useIsMobile(1024)

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
          <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight">
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
          className="relative -mx-4 md:-mx-8 overflow-hidden"
          style={{
            background: 'var(--BG-Main, linear-gradient(0deg, #E5EBFF 19.98%, #FBFAFC 100%))',
            height: 'min(170vw, calc(100vh - 180px))',
            minHeight: 740,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FBFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#E8EDFF] to-transparent z-10 pointer-events-none" />
          <AnimatedGradient colors={GRADIENT_COLORS} speed={GRADIENT_SPEED} blur="heavy" />
          <img
            src="/speakers/bg/DC8-Moon-BG-Element.svg"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ height: '88%', objectFit: 'contain' }}
          />
          <LivingConstellationV2Mobile speakers={speakers} />
        </div>
      ) : (
        <div
          className="relative w-full rounded-xl border border-border overflow-hidden"
          style={{
            height: 'calc(70vh + 128px)',
            minHeight: 828,
            background: 'var(--BG-Main, linear-gradient(0deg, #E5EBFF 19.98%, #FBFAFC 100%))',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FBFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#E8EDFF] to-transparent z-10 pointer-events-none" />
          <AnimatedGradient colors={GRADIENT_COLORS} speed={GRADIENT_SPEED} blur="heavy" />
          <img
            src="/speakers/bg/DC8-Moon-BG-Element.svg"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'overlay',
            }}
          />
          <LivingConstellationV2 speakers={speakers} />
        </div>
      )}

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={combinedSource}
        installCommand="npm install motion sharp"
        fileName="rotating-speakers.tsx"
        setupNotes={`1. Copy the public/speakers/ directory into your project's public folder:\n   speakers/*.jpg              (speaker portraits)\n   speakers/company-logos/*.png (company/org logos)\n   speakers/past-event-logos/*.png (Devcon event logos)\n   speakers/bg/*.svg           (background element)\n\n2. If you add, remove, or replace speaker images, regenerate the blur placeholders:\n   node scripts/generate-blur-placeholders.mjs\n\n3. Speaker data lives in speakers.ts — update that file to change the roster, then update images and re-run the blur script.`}
        setupNotesLabel="Asset Setup"
      />
    </div>
  )
}
