'use client'

import { FileText, FolderSearch, Mail, Presentation } from 'lucide-react'
import { ContextBrief } from '@/components/studio/context-brief'
import { EmailDraft } from '@/components/studio/email-draft'
import { ResponseDocument } from '@/components/response-document'
import { SlideDeck } from '@/components/slide-deck'
import { VENDOR_NAME } from '@/lib/mock-data'
import type { RfpOutput } from '@/lib/rfp-schema'
import type { Artifact, ArtifactType } from '@/lib/studio-types'
import { cn } from '@/lib/utils'

const icons = { brief: FolderSearch, response: FileText, deck: Presentation, email: Mail } as const

export function ArtifactPanel({
  artifacts,
  activeId,
  onSelect,
  doc,
  email,
}: {
  artifacts: Artifact[]
  activeId: ArtifactType | null
  onSelect: (id: ArtifactType) => void
  doc: RfpOutput
  email: string
}) {
  const active = artifacts.find((a) => a.id === activeId)

  return (
    <section aria-label="Generated assets" className="flex h-full min-h-0 flex-col bg-secondary/60">
      <div role="tablist" aria-label="Assets" className="flex h-12 shrink-0 items-end gap-1 overflow-x-auto border-b border-border px-2">
        {artifacts.map((a) => {
          const Icon = icons[a.id]
          const selected = a.id === activeId
          return (
            <button
              key={a.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onSelect(a.id)}
              className={cn(
                '-mb-px flex shrink-0 items-center gap-2 rounded-t-md border border-b-0 px-3 py-2 text-sm transition-colors',
                selected
                  ? 'border-border bg-background text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {a.title}
              <span className="font-mono text-xs text-muted-foreground">v{a.version}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-8">
        {!active && (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
              Generated documents and presentations will open here as tabs.
            </p>
          </div>
        )}
        {active?.id === 'brief' && <ContextBrief />}
        {active?.id === 'response' && <ResponseDocument doc={doc} companyName={VENDOR_NAME} />}
        {active?.id === 'deck' && <SlideDeck slides={doc.slides} title={doc.title} companyName={VENDOR_NAME} />}
        {active?.id === 'email' && <EmailDraft text={email} />}
      </div>
    </section>
  )
}
