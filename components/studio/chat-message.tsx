'use client'

import { Check, FileText, Loader2, Presentation, Mail, FolderSearch } from 'lucide-react'
import { BoxMark } from '@/components/studio/brand'
import { Button } from '@/components/ui/button'
import { CONTEXT_GROUPS, OPEN_QUESTIONS, SYNC_STEPS } from '@/lib/mock-data'
import type { ArtifactType, ChatMessage } from '@/lib/studio-types'
import { cn } from '@/lib/utils'

const artifactIcon = { brief: FolderSearch, response: FileText, deck: Presentation, email: Mail } as const

function SyncProgress({ completed, done, scanning }: { completed: number; done: boolean; scanning?: string }) {
  const progress = Math.round((completed / SYNC_STEPS.length) * 100)
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <BoxMark className="text-xs" />
          {done ? 'Synced with Box' : 'Syncing with Box…'}
        </p>
        <span className="font-mono text-xs text-muted-foreground">{progress}%</span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Box sync progress"
      >
        <div className="h-full rounded-full bg-box transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <ol className="flex flex-col gap-1.5">
        {SYNC_STEPS.map((step, i) => {
          const state = i < completed ? 'done' : i === completed && !done ? 'active' : 'pending'
          return (
            <li key={step.label} className={cn('flex items-start gap-2 text-sm', state === 'pending' && 'opacity-40')}>
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                {state === 'done' ? (
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                ) : state === 'active' ? (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground" aria-hidden="true" />
                )}
              </span>
              <span className="flex flex-col">
                <span className="text-foreground">{step.label}</span>
                {state === 'done' && <span className="text-xs text-muted-foreground">{step.detail}</span>}
                {state === 'active' && scanning && (
                  <span
                    key={scanning}
                    className="flex items-center gap-1 truncate font-mono text-xs text-box animate-in fade-in slide-in-from-bottom-1 duration-150"
                  >
                    <FileText className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{scanning}</span>
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function ContextReview({
  status,
  onConfirm,
  onOpenBrief,
}: {
  status: 'pending' | 'confirmed'
  onConfirm: () => void
  onOpenBrief: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <p className="text-sm leading-relaxed text-foreground">
        Here is what I found. Review the brief and confirm, and I&apos;ll write the response from it.
      </p>
      <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
        {CONTEXT_GROUPS.map((g) => (
          <li key={g.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span className="font-medium text-foreground">{g.title}</span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {g.sources.length} {g.sources.length === 1 ? 'file' : 'files'}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1 rounded-md bg-accent/25 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-foreground/80">Needs your input</p>
        <ul className="flex flex-col gap-1">
          {OPEN_QUESTIONS.map((q) => (
            <li key={q} className="text-sm leading-relaxed text-foreground">
              {q}
            </li>
          ))}
        </ul>
      </div>
      {status === 'pending' ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={onConfirm}>
            Confirm and write response
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenBrief}>
            View full brief
          </Button>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Check className="size-4 text-success" aria-hidden="true" />
          Brief confirmed
        </p>
      )}
    </div>
  )
}

export function ChatMessageView({
  message,
  onConfirm,
  onOpenArtifact,
}: {
  message: ChatMessage
  onConfirm: () => void
  onOpenArtifact: (id: ArtifactType) => void
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-sm leading-relaxed text-primary-foreground">
          {message.text}
        </p>
      </div>
    )
  }

  if (message.kind === 'text') {
    return <p className="text-pretty text-sm leading-relaxed text-foreground">{message.text}</p>
  }

  if (message.kind === 'sync')
    return <SyncProgress completed={message.completed} done={message.done} scanning={message.scanning} />

  if (message.kind === 'context')
    return <ContextReview status={message.status} onConfirm={onConfirm} onOpenBrief={() => onOpenArtifact('brief')} />

  const Icon = artifactIcon[message.artifactId]
  return (
    <div className="flex flex-col gap-2">
      <p className="text-pretty text-sm leading-relaxed text-foreground">{message.note}</p>
      <button
        type="button"
        onClick={() => onOpenArtifact(message.artifactId)}
        className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/40"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-secondary">
          <Icon className="size-4 text-secondary-foreground" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{message.title}</span>
          <span className="font-mono text-xs text-muted-foreground">v{message.version}</span>
        </span>
      </button>
    </div>
  )
}
