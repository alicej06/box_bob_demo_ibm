'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { ChatMessageView } from '@/components/studio/chat-message'
import { PromptInput } from '@/components/studio/prompt-input'
import type { ArtifactType, ChatMessage } from '@/lib/studio-types'

export function ChatPanel({
  messages,
  busy,
  canPrompt,
  onSubmit,
  onConfirm,
  onOpenArtifact,
  onReset,
}: {
  messages: ChatMessage[]
  busy: string | null
  canPrompt: boolean
  onSubmit: (text: string) => void
  onConfirm: () => void
  onOpenArtifact: (id: ArtifactType) => void
  onReset: () => void
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, busy])

  return (
    <section aria-label="Chat" className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <button type="button" onClick={onReset} className="font-mono text-xs uppercase tracking-widest text-foreground">
          Bidwright
        </button>
        <span className="truncate text-sm text-muted-foreground">Northwind Health RFP</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <ChatMessageView key={m.id} message={m} onConfirm={onConfirm} onOpenArtifact={onOpenArtifact} />
          ))}
          {busy && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {busy}
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <PromptInput
          onSubmit={onSubmit}
          disabled={!!busy || !canPrompt}
          placeholder={canPrompt ? 'Ask for changes, or "make a presentation"…' : 'Confirm the brief to continue…'}
        />
      </div>
    </section>
  )
}
