'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { RfpInput } from '@/lib/rfp-schema'

const SAMPLE_RFP = `City of Riverton — Request for Proposal #2026-14
Citizen Services Portal Modernization

The City seeks a vendor to design, build, and maintain a new citizen services web portal. Requirements:
1. Online permit applications and payments, integrated with our existing Tyler Munis ERP.
2. WCAG 2.1 AA accessibility compliance.
3. Multilingual support (English and Spanish at minimum).
4. Hosting with 99.9% uptime SLA and SOC 2 Type II compliant infrastructure.
5. Staff training and 3 years of support and maintenance.
6. Project completion within 9 months of contract award.
Proposals must include approach, team qualifications, timeline, and pricing structure. Due November 30, 2026.`

const SAMPLE_PROFILE = `Northline Digital is a 60-person studio specializing in government and civic technology. We have delivered 14 public-sector portals since 2018, are hosted on AWS GovCloud, and hold SOC 2 Type II. Our in-house accessibility team audits every release against WCAG 2.1 AA.`

type Props = {
  onSubmit: (input: RfpInput) => void
  isLoading: boolean
  error: string | null
}

export function RfpForm({ onSubmit, isLoading, error }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    onSubmit({
      rfpText: String(data.get('rfpText') ?? ''),
      companyName: String(data.get('companyName') ?? ''),
      companyProfile: String(data.get('companyProfile') ?? ''),
      tone: (data.get('tone') as RfpInput['tone']) ?? 'confident',
    })
  }

  function fillSample(form: HTMLFormElement | null) {
    if (!form) return
    ;(form.elements.namedItem('rfpText') as HTMLTextAreaElement).value = SAMPLE_RFP
    ;(form.elements.namedItem('companyName') as HTMLInputElement).value = 'Northline Digital'
    ;(form.elements.namedItem('companyProfile') as HTMLTextAreaElement).value = SAMPLE_PROFILE
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-busy={isLoading}>
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">Brief</h2>
        <button
          type="button"
          onClick={(e) => fillSample(e.currentTarget.form)}
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Use sample RFP
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="rfpText">RFP document</Label>
        <Textarea
          id="rfpText"
          name="rfpText"
          required
          minLength={50}
          placeholder="Paste the full RFP text, scope of work, and requirements here..."
          className="min-h-56 bg-card font-mono text-xs leading-relaxed"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName">Your company</Label>
        <Input id="companyName" name="companyName" required placeholder="Acme Inc." className="bg-card" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="companyProfile">
          Capabilities <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="companyProfile"
          name="companyProfile"
          placeholder="Experience, certifications, team, differentiators, case studies..."
          className="min-h-28 bg-card leading-relaxed"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Tone</legend>
        <div className="grid grid-cols-3 gap-2">
          {(['formal', 'confident', 'friendly'] as const).map((tone) => (
            <label
              key={tone}
              className="flex cursor-pointer items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm capitalize transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input type="radio" name="tone" value={tone} defaultChecked={tone === 'confident'} className="sr-only" />
              {tone}
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isLoading} className="h-11">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Drafting response...
          </>
        ) : (
          <>
            <Sparkles aria-hidden="true" />
            Generate response and deck
          </>
        )}
      </Button>
    </form>
  )
}
