import { z } from 'zod'

export const rfpInputSchema = z.object({
  rfpText: z.string().trim().min(50, 'Paste at least a few sentences of the RFP.').max(40000),
  companyName: z.string().trim().min(1, 'Company name is required.').max(200),
  companyProfile: z.string().trim().max(8000).default(''),
  tone: z.enum(['formal', 'confident', 'friendly']).default('confident'),
})

export type RfpInput = z.infer<typeof rfpInputSchema>

export const rfpOutputSchema = z.object({
  title: z.string().describe('Title of the proposal response'),
  clientName: z.string().describe('Name of the issuing organization, or "the client" if unknown'),
  executiveSummary: z.string().describe('2-3 paragraph executive summary, paragraphs separated by blank lines'),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string().describe('Section content, paragraphs separated by blank lines'),
      }),
    )
    .describe('Response sections that map to the RFP requirements, e.g. Understanding of Need, Approach, Team, Timeline, Pricing Approach'),
  complianceMatrix: z
    .array(
      z.object({
        requirement: z.string().describe('A requirement stated in the RFP'),
        response: z.string().describe('One sentence on how the vendor meets it'),
        status: z.enum(['meets', 'partial', 'clarify']),
      }),
    )
    .describe('Key RFP requirements and compliance status'),
  slides: z
    .array(
      z.object({
        title: z.string(),
        bullets: z.array(z.string()).describe('3-5 concise bullets'),
        speakerNotes: z.string(),
      }),
    )
    .describe('8-10 slide presentation deck summarizing the proposal'),
})

export type RfpOutput = z.infer<typeof rfpOutputSchema>
