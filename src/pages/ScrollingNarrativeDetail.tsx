import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, ExternalLink, CalendarPlus, Megaphone, Paintbrush, HeartHandshake } from 'lucide-react'
import { ScrollingNarrativeBlock } from '@/components/ui/scrolling-narrative-block'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ExportDialog } from '@/components/ExportDialog'
import scrollingNarrativeSource from '@/components/ui/scrolling-narrative-block.tsx?raw'

export default function ScrollingNarrativeDetail() {
  const navigate = useNavigate()
  const [exportOpen, setExportOpen] = useState(false)

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

      {/* === Dummy content: Contribute and support === */}
      <section className="w-full bg-[#EDECFF] p-10 md:p-12 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Contribute and support
          </h2>
          <p className="mt-2 text-base text-[#1A1A2E]/60 font-light leading-relaxed max-w-2xl">
            Devcon works best when builders ship, communities show up and connect, and supporters help bring it all together.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Megaphone size={20} strokeWidth={1.5} />,
              iconBg: 'bg-[#E0DEFF]',
              iconColor: 'text-[#5B2EBF]',
              title: 'Submit a DIP',
              description: 'Devcon Improvement Proposals (DIPs) are ways for the community to suggest things to add, remove, or improve at the upcoming Devcon.',
              cta: 'Visit Devcon forum',
              href: '#',
            },
            {
              icon: <Paintbrush size={20} strokeWidth={1.5} />,
              iconBg: 'bg-[#D5F5EC]',
              iconColor: 'text-[#0D9373]',
              title: 'Join our Creative Crew',
              description: "Create content. Build hype. Grow the community. If you've got reach and a genuine love for the ecosystem, we want to collaborate with you.",
              cta: 'Media Partners & Press',
              href: '#',
            },
            {
              icon: <CalendarPlus size={20} strokeWidth={1.5} />,
              iconBg: 'bg-[#E0DEFF]',
              iconColor: 'text-[#5B2EBF]',
              title: 'Host a community event',
              description: 'Host a meetup, workshop, or side event as part of our Ecosystem Program and make it a part of the broader Devcon India story.',
              cta: 'Coming soon!',
            },
            {
              icon: <HeartHandshake size={20} strokeWidth={1.5} />,
              iconBg: 'bg-[#FFE8EC]',
              iconColor: 'text-[#E05075]',
              title: 'Volunteer Program',
              description: 'Join a team of passionate contributors keeping Devcon running smoothly – from registration desks to behind-the-scenes management.',
              cta: 'Applications coming soon!',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 space-y-3"
            >
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-[#1A1A2E]">{card.title}</h3>
              <p className="text-[14px] text-[#1A1A2E]/60 font-light leading-relaxed">
                {card.description}
              </p>
              {card.href ? (
                <a
                  href={card.href}
                  className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#5B2EBF] hover:text-[#7235ED] transition-colors"
                >
                  {card.cta}
                  <ExternalLink size={12} strokeWidth={2} />
                </a>
              ) : (
                <p className="text-[14px] font-semibold text-[#5B2EBF]">{card.cta}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Preview */}
      <ScrollingNarrativeBlock />

      {/* === Dummy content: FAQ === */}
      <section className="w-full bg-[#EDECFF] p-10 md:p-12 space-y-6">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight text-center">
          Frequently asked questions
        </h2>
        <div className="max-w-2xl mx-auto bg-white rounded-xl">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="px-5">
              <AccordionTrigger className="text-base font-medium text-[#1A1A2E]">
                When will General ticket sales start?
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-[#1A1A2E]/60 font-light leading-relaxed">
                General Admission ticket sales for Devcon India will launch in early May. Stay tuned for updates as we get closer to this date.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="px-5">
              <AccordionTrigger className="text-base font-medium text-[#1A1A2E]">
                Will there be opportunities to obtain discounted tickets?
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-[#1A1A2E]/60 font-light leading-relaxed">
                Yes! We offer discounted tickets for students, builders from underrepresented regions, and active open-source contributors. Details will be announced closer to the sale date.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="px-5 border-b-0">
              <AccordionTrigger className="text-base font-medium text-[#1A1A2E]">
                Can I purchase tickets with crypto?
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-[#1A1A2E]/60 font-light leading-relaxed">
                Absolutely. We'll support payments in ETH and select stablecoins on Ethereum mainnet and popular L2s. Fiat options will also be available.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

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
