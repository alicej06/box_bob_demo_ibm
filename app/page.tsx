import { RfpWorkspace } from '@/components/rfp-workspace'

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-mono text-xs font-semibold text-primary-foreground">
              RF
            </span>
            <span className="font-semibold tracking-tight">Bidwright</span>
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:block">
            RFP response studio
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <RfpWorkspace />
      </main>
    </div>
  )
}
