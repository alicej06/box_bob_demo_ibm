import { generateText, Output } from 'ai'
import { rfpInputSchema, rfpOutputSchema } from '@/lib/rfp-schema'

export const maxDuration = 120

const toneGuide = {
  formal: 'formal, precise, and measured',
  confident: 'confident, clear, and outcome-focused',
  friendly: 'warm, approachable, and plain-spoken',
}

export async function POST(req: Request) {
  const parsed = rfpInputSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' }, { status: 400 })
  }

  const { rfpText, companyName, companyProfile, tone } = parsed.data

  try {
    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-5.5',
      system: `You are a senior proposal manager who writes winning RFP responses. Write in a ${toneGuide[tone]} tone. Address every requirement in the RFP. Never invent certifications, client names, or statistics that are not supported by the vendor profile; when information is missing, write a clear placeholder in square brackets like [Insert case study].`,
      prompt: `Vendor: ${companyName}

Vendor profile and capabilities:
${companyProfile || '[No profile provided]'}

RFP document:
"""
${rfpText}
"""

Produce a complete RFP response document, a compliance matrix, and a matching presentation deck.`,
      output: Output.object({ schema: rfpOutputSchema }),
    })

    return Response.json(output)
  } catch (error) {
    console.error('[v0] RFP generation failed:', error)
    return Response.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}
