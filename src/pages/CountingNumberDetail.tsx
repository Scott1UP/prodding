import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountingNumber } from '@/components/ui/counting-number'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ExportDialog } from '@/components/ExportDialog'
import { ArrowLeft, Code, RotateCcw, ExternalLink } from 'lucide-react'
import countingNumberSource from '@/components/ui/counting-number.tsx?raw'

const stats = [
  {
    prefix: '#',
    number: 1,
    fromNumber: 10,
    suffix: '',
    decimalPlaces: 0,
    label: 'India leads in new crypto developer onboarding',
    source: 'Electric Capital',
    url: 'https://www.developerreport.com/reports/devs/2024?s=table-of-contents',
  },
  {
    prefix: '',
    number: 17,
    suffix: '%',
    decimalPlaces: 0,
    label: 'Of all new global crypto developers in 2024',
    source: 'Electric Capital',
    url: 'https://www.developerreport.com/reports/devs/2024?s=table-of-contents',
  },
  {
    prefix: '',
    number: 2.55,
    suffix: 'M',
    decimalPlaces: 2,
    label: 'STEM graduates per year – 2nd globally',
    source: 'Airswift',
    url: 'https://www.airswift.com/blog/stem-talent-top-countries',
  },
  {
    prefix: '$',
    number: 564,
    suffix: 'M',
    decimalPlaces: 0,
    label: 'Web3 funding raised in 2024 (up 109% YoY)',
    source: 'Hashed Emergent',
    url: 'https://www.hashedem.com/public/uploads/reports/1667628521064.pdf',
  },
]

export default function CountingNumberDetail() {
  const navigate = useNavigate()
  const [stiffness, setStiffness] = useState(90)
  const [damping, setDamping] = useState(50)
  const [animKey, setAnimKey] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)

  const transformedSource = useMemo(() => {
    let source = countingNumberSource
    source = source.replace('stiffness: 90', `stiffness: ${stiffness}`)
    source = source.replace('damping: 50', `damping: ${damping}`)
    return source
  }, [stiffness, damping])

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2 text-text-secondary hover:text-text-primary gap-2 text-base"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Counting Number
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
          Animated number counter with spring physics. Numbers roll from zero to their target
          value with configurable stiffness and damping.
        </p>
      </header>

      {/* Controls row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Stiffness */}
        <div className="flex items-center gap-2 w-48">
          <Label className="text-base text-text-secondary font-light shrink-0">Stiffness</Label>
          <Slider
            value={[stiffness]}
            onValueChange={([v]) => {
              setStiffness(v)
              setAnimKey((k) => k + 1)
            }}
            min={10}
            max={300}
            step={5}
          />
          <span className="text-base text-text-tertiary font-mono w-8 text-right shrink-0">
            {stiffness}
          </span>
        </div>

        <div className="w-px h-6 bg-border shrink-0" />

        {/* Damping */}
        <div className="flex items-center gap-2 w-48">
          <Label className="text-base text-text-secondary font-light shrink-0">Damping</Label>
          <Slider
            value={[damping]}
            onValueChange={([v]) => {
              setDamping(v)
              setAnimKey((k) => k + 1)
            }}
            min={5}
            max={100}
            step={1}
          />
          <span className="text-base text-text-tertiary font-mono w-8 text-right shrink-0">
            {damping}
          </span>
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-base gap-2"
            onClick={() => setAnimKey((k) => k + 1)}
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            Replay
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full rounded-xl border border-border overflow-hidden bg-[#F9F9FC]">
        <div
          key={animKey}
          className="w-full min-h-[200px] grid grid-cols-4 gap-x-10 p-10 md:p-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <p className="text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
                {stat.prefix}
                <CountingNumber
                  number={stat.number}
                  fromNumber={stat.fromNumber ?? 0}
                  decimalPlaces={stat.decimalPlaces}
                  transition={{ stiffness, damping }}
                  className="tabular-nums"
                />
                {stat.suffix}
              </p>
              <p className="text-base text-[#1A1A2E]/70 font-light leading-relaxed max-w-[260px]">
                {stat.label}
              </p>
              <a
                href={stat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#5B2EBF] hover:text-[#7235ED] underline transition-colors w-fit"
              >
                {stat.source}
                <ExternalLink size={13} strokeWidth={2} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        componentSource={transformedSource}
        installCommand="npm install motion"
        fileName="counting-number.tsx"
      />
    </div>
  )
}
