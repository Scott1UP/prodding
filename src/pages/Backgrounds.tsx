import { Card, CardContent } from '@/components/ui/card'

export default function Backgrounds() {
  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight">
          Backgrounds
        </h1>
        <p className="mt-3 text-text-secondary text-base font-light leading-relaxed">
          Gradients, patterns, meshes, and atmospheric backdrops.
        </p>
      </header>

      <Card className="border-dashed border-border-default bg-surface-raised/50 shadow-none">
        <CardContent className="flex items-center justify-center min-h-[420px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-surface-overlay border border-border-subtle flex items-center justify-center">
              <span className="text-text-tertiary text-lg font-medium">B</span>
            </div>
            <p className="text-text-tertiary text-base font-light">
              Components will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
