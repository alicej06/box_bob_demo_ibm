'use client'

import { useState } from 'react'
import { FileText, Presentation } from 'lucide-react'
import { RfpForm } from '@/components/rfp-form'
import { ResponseDocument } from '@/components/response-document'
import { SlideDeck } from '@/components/slide-deck'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { RfpInput, RfpOutput } from '@/lib/rfp-schema'

export function RfpWorkspace() {
  const [result, setResult] = useState<{ doc: RfpOutput; companyName: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(input: RfpInput) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setResult({ doc: data, companyName: input.companyName })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <RfpForm onSubmit={generate} isLoading={isLoading} error={error} />
      </aside>

      <section aria-label="Generated output" className="min-w-0">
        {isLoading ? (
          <LoadingState />
        ) : result ? (
          <Tabs defaultValue="document">
            <TabsList className="mb-2">
              <TabsTrigger value="document" className="px-4">
                <FileText aria-hidden="true" />
                Response
              </TabsTrigger>
              <TabsTrigger value="deck" className="px-4">
                <Presentation aria-hidden="true" />
                Presentation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="document">
              <ResponseDocument doc={result.doc} companyName={result.companyName} />
            </TabsContent>
            <TabsContent value="deck">
              <SlideDeck slides={result.doc.slides} title={result.doc.title} companyName={result.companyName} />
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[480px] flex-col justify-center gap-6 rounded-lg border border-dashed border-border px-8 py-12 md:px-14">
      <h2 className="max-w-md text-balance text-2xl font-semibold tracking-tight">
        Paste an RFP. Get a full response and a pitch deck.
      </h2>
      <ul className="flex max-w-md flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        <li className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 bg-accent" aria-hidden="true" />
          A structured proposal with executive summary, approach, and tailored sections
        </li>
        <li className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 bg-accent" aria-hidden="true" />
          A compliance matrix mapping every requirement to your answer
        </li>
        <li className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 bg-accent" aria-hidden="true" />
          A presentation deck with speaker notes, exportable to PowerPoint
        </li>
      </ul>
    </div>
  )
}

function LoadingState() {
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">Generating your response, this can take up to a minute.</span>
      <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-10">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${90 - i * 7}%` }} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground" aria-hidden="true">
        Reading the RFP and drafting your response. This usually takes 30&ndash;60 seconds.
      </p>
    </div>
  )
}
