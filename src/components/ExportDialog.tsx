import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Check, Copy, Download } from 'lucide-react'

type ExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  componentSource: string
  installCommand: string
  fontInstructions?: string
  fontDownloadUrl?: string
  fontFileName?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 text-sm text-text-secondary hover:text-text-primary"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check size={14} strokeWidth={1.5} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} strokeWidth={1.5} />
          Copy
        </>
      )}
    </Button>
  )
}

export function ExportDialog({
  open,
  onOpenChange,
  componentSource,
  installCommand,
  fontInstructions,
  fontDownloadUrl,
  fontFileName,
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold">Export Component</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="component" className="flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="component">Component</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="component" className="min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary font-light">text-hover-effect.tsx</span>
              <CopyButton text={componentSource} />
            </div>
            <div className="rounded-lg border border-border bg-[#fafafa] overflow-auto max-h-[50vh]">
              <pre className="p-4 text-[13px] leading-relaxed">
                <code>{componentSource}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="setup" className="min-h-0 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-primary font-medium">Dependencies</span>
                <CopyButton text={installCommand} />
              </div>
              <div className="rounded-lg border border-border bg-[#fafafa] overflow-auto">
                <pre className="p-4 text-[13px] leading-relaxed">
                  <code>{installCommand}</code>
                </pre>
              </div>
            </div>

            {fontInstructions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-primary font-medium">Font Setup</span>
                  <CopyButton text={fontInstructions} />
                </div>
                <div className="rounded-lg border border-border bg-[#fafafa] overflow-auto">
                  <pre className="p-4 text-[13px] leading-relaxed whitespace-pre-wrap">
                    <code>{fontInstructions}</code>
                  </pre>
                </div>
                {fontDownloadUrl && (
                  <a
                    href={fontDownloadUrl}
                    download={fontFileName}
                    className="inline-flex items-center gap-2 mt-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Download {fontFileName}
                  </a>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
