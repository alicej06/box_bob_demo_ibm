import { PromptInput } from '@/components/studio/prompt-input'

const SUGGESTIONS = [
  'Help me write an RFP response for Northwind Health',
  'Draft a security questionnaire answer set for Northwind',
  'Summarize what Northwind is asking for',
]

export function HomeScreen({ onSubmit }: { onSubmit: (text: string) => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Bidwright
          </span>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            What are we bidding on today?
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Describe the RFP. Bidwright pulls the RFP, your product docs, and past responses from Box, then drafts the response with you.
          </p>
        </div>

        <PromptInput size="large" onSubmit={onSubmit} placeholder="Help me write an RFP response for…" />

        <ul className="flex flex-wrap justify-center gap-2" aria-label="Suggested prompts">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => onSubmit(s)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
