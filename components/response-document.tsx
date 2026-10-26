'use client'

import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RfpOutput } from '@/lib/rfp-schema'
import { cn } from '@/lib/utils'

const statusLabel = { meets: 'Meets', partial: 'Partial', clarify: 'Clarify' } as const

function toMarkdown(doc: RfpOutput, companyName: string) {
  const lines = [
    `# ${doc.title}`,
    `Prepared by ${companyName} for ${doc.clientName}`,
    '',
    '## Executive Summary',
    doc.executiveSummary,
    '',
    ...doc.sections.flatMap((s) => [`## ${s.heading}`, s.body, '']),
    '## Compliance Matrix',
    '| Requirement | Response | Status |',
    '| --- | --- | --- |',
    ...doc.complianceMatrix.map((r) => `| ${r.requirement} | ${r.response} | ${statusLabel[r.status]} |`),
  ]
  return lines.join('\n')
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="text-pretty leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
    </>
  )
}

export function ResponseDocument({ doc, companyName }: { doc: RfpOutput; companyName: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(toMarkdown(doc, companyName))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function download() {
    const blob = new Blob([toMarkdown(doc, companyName)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" onClick={download}>
          <Download aria-hidden="true" />
          Markdown
        </Button>
      </div>

      <article className="flex flex-col gap-10 rounded-lg border border-border bg-card px-6 py-10 shadow-sm md:px-14 md:py-14">
        <header className="flex flex-col gap-3 border-b border-border pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Proposal response &middot; {doc.clientName}
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">{doc.title}</h2>
          <p className="text-sm text-muted-foreground">Prepared by {companyName}</p>
        </header>

        <section className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Executive Summary</h3>
          <Paragraphs text={doc.executiveSummary} />
        </section>

        {doc.sections.map((s) => (
          <section key={s.heading} className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">{s.heading}</h3>
            <Paragraphs text={s.body} />
          </section>
        ))}

        <section className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Compliance Matrix</h3>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Requirement</th>
                  <th scope="col" className="px-4 py-3 font-medium">Response</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {doc.complianceMatrix.map((row, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-medium">{row.requirement}</td>
                    <td className="px-4 py-3 leading-relaxed text-foreground/80">{row.response}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-sm px-2 py-0.5 font-mono text-xs',
                          row.status === 'meets' && 'bg-primary text-primary-foreground',
                          row.status === 'partial' && 'bg-accent text-accent-foreground',
                          row.status === 'clarify' && 'border border-border text-muted-foreground',
                        )}
                      >
                        {statusLabel[row.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  )
}
