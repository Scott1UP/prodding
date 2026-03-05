import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code } from 'lucide-react'
import { ScrollingNarrativeBlock } from '@/components/ui/scrolling-narrative-block'
import { ExportDialog } from '@/components/ExportDialog'
import scrollingNarrativeSource from '@/components/ui/scrolling-narrative-block.tsx?raw'

export default function ScrollingNarrativeDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Scrolling Narrative Block
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
          A split-panel content block where the left side stays fixed while the right
          side scrolls through narrative sections. Only activates on hover — scroll
          within the component to advance through the story.
        </p>
      </header>

      {/* Preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden bg-[#13101f] p-8">
        <ScrollingNarrativeBlock />
      </div>

      {/* Behavior notes */}
      <div className="text-text-tertiary text-sm font-light space-y-1">
        <p>Hover over the block, then scroll to advance between sections.</p>
        <p>Click the indicators on the right to jump to a specific section.</p>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={scrollingNarrativeSource}
        installCommand="npm install motion"
        fileName="scrolling-narrative-block.tsx"
        assetDownloadUrl="/eth-logo.svg"
        assetDownloadName="eth-logo.svg"
      />
    </div>
  )
}
