import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ScrollingNarrativeBlock } from '@/components/ui/scrolling-narrative-block'

export default function ScrollingNarrativeDetail() {
  const navigate = useNavigate()

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
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Scrolling Narrative Block
        </h1>
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
        <p>Click the dots on the right to jump to a specific section.</p>
      </div>
    </div>
  )
}
