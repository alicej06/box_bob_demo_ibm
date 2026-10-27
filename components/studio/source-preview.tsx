'use client'

import { useEffect } from 'react'
import { ExternalLink, FileText, X } from 'lucide-react'
import { BoxMark } from '@/components/studio/brand'
import { Button } from '@/components/ui/button'
import { SOURCE_EXCERPTS, type BoxFile } from '@/lib/mock-data'

export function SourcePreview({ file, onClose }: { file: BoxFile; onClose: () => void }) {
  const excerpt = SOURCE_EXCERPTS[file.name]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 z-20 flex justify-end">
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/20 animate-in fade-in duration-200"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${file.name}`}
        className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-xl animate-in slide-in-from-right duration-300"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <BoxMark className="text-xs" />
              <span className="truncate font-mono">{file.folder}</span>
            </span>
            <h2 className="flex items-start gap-2 text-sm font-semibold leading-snug text-foreground">
              <FileText className="mt-0.5 size-4 shrink-0 text-box" aria-hidden="true" />
              {file.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Modified {file.modified}
              {excerpt && ` · ${excerpt.location}`}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
            <X className="size-4" aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-secondary/60 p-4">
          <article className="flex flex-col gap-4 rounded-md border border-border bg-background p-5 text-sm leading-relaxed text-foreground/80 shadow-sm">
            {excerpt ? (
              <>
                {excerpt.before.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="rounded-sm bg-accent/40 px-1 py-0.5 text-foreground ring-1 ring-accent">
                  {excerpt.highlight}
                </p>
                {excerpt.after.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </>
            ) : (
              <p>Preview not available for this file.</p>
            )}
          </article>
          {excerpt && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              The highlighted passage is what Bob used from this file.
            </p>
          )}
        </div>

        <footer className="border-t border-border p-4">
          <Button variant="outline" className="w-full" disabled>
            <ExternalLink className="size-4" aria-hidden="true" />
            Open in Box
          </Button>
        </footer>
      </aside>
    </div>
  )
}
