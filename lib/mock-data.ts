import type { RfpOutput } from '@/lib/rfp-schema'

export const VENDOR_NAME = 'Meridian Cloud'

export type BoxFile = {
  name: string
  folder: string
  kind: 'pdf' | 'docx' | 'xlsx' | 'pptx'
  modified: string
}

export type ContextGroup = {
  id: string
  title: string
  summary: string
  items: string[]
  sources: BoxFile[]
}

export const SYNC_STEPS = [
  {
    label: 'Connecting to Box',
    detail: 'meridian-cloud.app.box.com',
    files: ['Authorizing Bob…', 'Loading folder index…'],
  },
  {
    label: 'Searching for the RFP',
    detail: 'Found "Northwind Health – Patient Engagement RFP.pdf"',
    files: ['/RFPs/Inbound/2026', 'Northwind Health – Patient Engagement RFP.pdf', 'Attachment A – Pricing Form.xlsx'],
  },
  {
    label: 'Extracting requirements',
    detail: '18 requirements across 6 sections',
    files: ['Section 3 – Scope of Work', 'Section 4 – Technical Requirements', 'Attachment B – Security Questionnaire.xlsx'],
  },
  {
    label: 'Reading product documentation',
    detail: '4 files in /Product/Specs',
    files: ['Meridian Engage – Product Overview 2026.pdf', 'Integration Catalog.xlsx', 'Security & Compliance Brief.docx'],
  },
  {
    label: 'Matching past RFP responses',
    detail: '3 similar healthcare bids',
    files: ['Lakeshore Medical – Response FINAL.docx', 'Cedar Valley – Response FINAL.docx', 'Summit Regional – Debrief.pptx'],
  },
  {
    label: 'Researching the client',
    detail: '2 account notes in /Sales/Accounts',
    files: ['/Sales/Accounts/Northwind', 'Northwind account notes.docx'],
  },
]

export type SourceExcerpt = {
  location: string
  before: string[]
  highlight: string
  after: string[]
}

export const SOURCE_EXCERPTS: Record<string, SourceExcerpt> = {
  'Northwind Health – Patient Engagement RFP.pdf': {
    location: 'Page 7 · Section 4.2',
    before: [
      '4.2 Technical Requirements. The selected vendor shall provide a single patient engagement platform that replaces the current portal, messaging, and scheduling tools in use across all fourteen (14) Northwind facilities.',
    ],
    highlight:
      'The platform must integrate with Northwind’s Epic EHR using FHIR R4, support single sign-on through Azure AD (SAML 2.0), and meet WCAG 2.1 AA for all patient-facing surfaces.',
    after: [
      'Vendors shall describe their approach to bilingual (English and Spanish) delivery, including how translated content is maintained over time.',
    ],
  },
  'Northwind account notes.docx': {
    location: 'Meeting notes · Oct 9',
    before: ['Call with Dana Whitfield (VP Digital Experience) and two members of the patient access team.'],
    highlight:
      'Dana said cost overruns on their last portal project are the main concern from the CFO. Fixed implementation fees will matter more than the lowest sticker price.',
    after: ['Next step: share a reference from a health system of similar size before the RFP closes.'],
  },
  'Attachment B – Security Questionnaire.xlsx': {
    location: 'Sheet "Hosting" · Row 14',
    before: ['Q13. Describe encryption practices for data at rest and in transit.'],
    highlight: 'Q14. Can the vendor support an on-premises deployment for patient data residency? If not, describe alternatives.',
    after: ['Q15. Provide the most recent SOC 2 Type II report or equivalent.'],
  },
  'Meridian Engage – Product Overview 2026.pdf': {
    location: 'Page 3 · Platform overview',
    before: ['Meridian Engage is the patient engagement platform trusted by more than 60 health systems across North America.'],
    highlight:
      'One platform for the patient portal, native iOS and Android apps, secure messaging with care-team routing, and self-scheduling built directly on Epic Cadence availability.',
    after: ['Every patient-facing surface ships in 12 languages and is audited annually against WCAG 2.1 AA.'],
  },
  'Integration Catalog.xlsx': {
    location: 'Sheet "EHR" · Row 2',
    before: ['EHR vendor: Epic. Status: Generally available.'],
    highlight: 'Connectors: FHIR R4 (read/write), HL7v2 ADT and SIU feeds. No custom middleware required.',
    after: ['Live customers on this connector: 38.'],
  },
  'Security & Compliance Brief.docx': {
    location: 'Page 2 · Certifications',
    before: ['Meridian Cloud maintains an information security program aligned to NIST 800-53.'],
    highlight: 'Current certifications: SOC 2 Type II (renewed June 2026) and HITRUST r2. A HIPAA Business Associate Agreement is available on request.',
    after: ['Customer data is hosted in dedicated US-region tenants and encrypted with AES-256 at rest.'],
  },
  'Lakeshore Medical – Response FINAL.docx': {
    location: 'Page 11 · Implementation plan',
    before: ['Lakeshore Medical operates nine hospitals on a single Epic instance.'],
    highlight: 'We delivered network-wide go-live in month 7, using a two-hospital pilot in months 4–6 to validate the Epic scheduling integration.',
    after: ['Outcome: contract awarded at $1.4M over three years.'],
  },
  'Cedar Valley – Response FINAL.docx': {
    location: 'Page 4 · References',
    before: ['Cedar Valley Health selected Meridian Engage in 2025 after a competitive evaluation.'],
    highlight: 'Their CIO has agreed to act as a reference for future healthcare bids, with a focus on adoption and call-center deflection.',
    after: ['Patient portal adoption rose from 31% to 58% within the first year.'],
  },
  'Summit Regional – Debrief.pptx': {
    location: 'Slide 5 · Why we lost',
    before: ['Summit scored us highest on solution fit and security.'],
    highlight: 'We lost on price. The evaluation team flagged variable implementation fees and change-order risk as the deciding factor.',
    after: ['Recommendation: lead with fixed implementation pricing on future bids.'],
  },
}

export const CONTEXT_GROUPS: ContextGroup[] = [
  {
    id: 'client',
    title: 'Client & RFP',
    summary: 'Northwind Health System is a 14-hospital regional network replacing its patient portal. Responses are due Nov 21, 2026.',
    items: [
      'Issuer: Northwind Health System, Procurement Office',
      'Scope: patient engagement platform (portal, messaging, scheduling)',
      'Submission deadline: November 21, 2026, 5:00 PM CT',
      'Evaluation: 40% solution fit, 25% security, 20% cost, 15% references',
      'Budget signal: "not to exceed $1.8M over 3 years"',
    ],
    sources: [
      { name: 'Northwind Health – Patient Engagement RFP.pdf', folder: '/RFPs/Inbound/2026', kind: 'pdf', modified: 'Oct 22' },
      { name: 'Northwind account notes.docx', folder: '/Sales/Accounts/Northwind', kind: 'docx', modified: 'Oct 9' },
    ],
  },
  {
    id: 'requirements',
    title: 'Key requirements',
    summary: '18 requirements extracted. 15 map directly to existing capabilities, 3 need your input.',
    items: [
      'HIPAA compliance and a signed BAA',
      'SSO via Azure AD (SAML 2.0)',
      'Epic EHR integration (FHIR R4)',
      'WCAG 2.1 AA accessibility',
      'Bilingual patient experience (English / Spanish)',
      'Go-live within 9 months of contract',
      'On-prem data residency option (needs your input)',
    ],
    sources: [
      { name: 'Northwind Health – Patient Engagement RFP.pdf', folder: '/RFPs/Inbound/2026', kind: 'pdf', modified: 'Oct 22' },
      { name: 'Attachment B – Security Questionnaire.xlsx', folder: '/RFPs/Inbound/2026', kind: 'xlsx', modified: 'Oct 22' },
    ],
  },
  {
    id: 'product',
    title: 'Your product capabilities',
    summary: 'Meridian Engage covers portal, secure messaging, and scheduling. It integrates with Epic and is SOC 2 Type II certified.',
    items: [
      'Meridian Engage portal, mobile apps, and secure messaging',
      'Native Epic integration via FHIR R4 and HL7v2',
      'SOC 2 Type II, HITRUST r2, HIPAA BAA available',
      'Azure AD, Okta, and Ping SSO',
      'Localization in 12 languages, including Spanish',
    ],
    sources: [
      { name: 'Meridian Engage – Product Overview 2026.pdf', folder: '/Product/Specs', kind: 'pdf', modified: 'Sep 30' },
      { name: 'Integration Catalog.xlsx', folder: '/Product/Specs', kind: 'xlsx', modified: 'Oct 2' },
      { name: 'Security & Compliance Brief.docx', folder: '/Product/Security', kind: 'docx', modified: 'Aug 18' },
    ],
  },
  {
    id: 'past',
    title: 'Past RFP responses',
    summary: 'Three similar healthcare bids. Two were wins, and their content can be reused.',
    items: [
      'Lakeshore Medical (2025): won, $1.4M, similar Epic scope',
      'Cedar Valley Health (2025): won, strong reference available',
      'Summit Regional (2024): lost on price, so the pricing structure needs to change',
    ],
    sources: [
      { name: 'Lakeshore Medical – Response FINAL.docx', folder: '/RFPs/Archive/2025', kind: 'docx', modified: 'Mar 14' },
      { name: 'Cedar Valley – Response FINAL.docx', folder: '/RFPs/Archive/2025', kind: 'docx', modified: 'Jun 3' },
      { name: 'Summit Regional – Debrief.pptx', folder: '/RFPs/Archive/2024', kind: 'pptx', modified: 'Nov 20' },
    ],
  },
]

export const OPEN_QUESTIONS = [
  'Should we offer on-prem data residency, or propose a dedicated US-region tenant instead?',
  'Which reference should lead: Lakeshore Medical or Cedar Valley Health?',
]

export const MOCK_RESPONSE: RfpOutput = {
  title: 'Response to RFP: Patient Engagement Platform',
  clientName: 'Northwind Health System',
  executiveSummary:
    'Northwind Health System is looking for a single patient engagement platform that brings its portal, secure messaging, and scheduling together for its 14 hospitals. Meridian Cloud proposes Meridian Engage, a HIPAA-compliant platform that already serves 60+ health systems and connects natively to Epic through FHIR R4.\n\nOur approach puts the go-live in month 7, two months ahead of the 9-month requirement. It reuses the integration playbook we delivered for Lakeshore Medical, which covers a similar Epic footprint. The proposed three-year investment is $1.52M, below the stated ceiling, with fixed implementation fees.',
  sections: [
    {
      heading: 'Understanding of Need',
      body: 'Patients currently use three disconnected tools to message care teams, book appointments, and view results. That fragmentation drives call-center volume and missed appointments.\n\nNorthwind needs one bilingual, accessible experience that works with Epic and its Azure AD identity stack, without adding work for clinical staff.',
    },
    {
      heading: 'Proposed Solution',
      body: 'Meridian Engage delivers a unified patient portal, native iOS and Android apps, secure messaging with care-team routing, and self-scheduling built on Epic Cadence availability.\n\nAll patient-facing surfaces meet WCAG 2.1 AA and ship with full English and Spanish localization.',
    },
    {
      heading: 'Implementation Approach',
      body: 'Phase 1 (months 1–3): discovery, Azure AD SSO, and Epic FHIR integration. Phase 2 (months 4–6): pilot at two hospitals. Phase 3 (month 7): network-wide rollout, with hypercare through month 9.',
    },
    {
      heading: 'Security & Compliance',
      body: 'Meridian Cloud holds SOC 2 Type II and HITRUST r2 certifications and will execute Northwind’s BAA. Data is encrypted in transit and at rest and hosted in a dedicated US-region tenant. [Confirm the on-prem residency position.]',
    },
    {
      heading: 'Pricing Approach',
      body: 'Fixed implementation fee of $280K, plus an annual subscription of $413K covering all 14 hospitals. The three-year total is $1.52M.',
    },
  ],
  complianceMatrix: [
    { requirement: 'HIPAA compliance and signed BAA', response: 'BAA available; HITRUST r2 certified.', status: 'meets' },
    { requirement: 'Azure AD SSO (SAML 2.0)', response: 'Supported natively and in production at 40+ customers.', status: 'meets' },
    { requirement: 'Epic integration (FHIR R4)', response: 'Native FHIR R4 and HL7v2 connectors.', status: 'meets' },
    { requirement: 'WCAG 2.1 AA', response: 'Audited annually by a third party.', status: 'meets' },
    { requirement: 'English / Spanish experience', response: 'Full localization across all surfaces.', status: 'meets' },
    { requirement: 'Go-live within 9 months', response: 'Planned go-live in month 7.', status: 'meets' },
    { requirement: 'On-prem data residency', response: 'Dedicated US tenant proposed instead.', status: 'clarify' },
  ],
  slides: [
    { title: 'Patient Engagement for Northwind Health', bullets: ['Proposal by Meridian Cloud', 'November 2026'], speakerNotes: 'Thank the panel, introduce the team, and set the agenda.' },
    { title: 'What we heard', bullets: ['Three disconnected patient tools', 'High call-center volume', 'Need for bilingual, accessible access', 'Must work with Epic and Azure AD'], speakerNotes: 'Mirror their language from section 2 of the RFP.' },
    { title: 'Meridian Engage', bullets: ['Unified portal and mobile apps', 'Secure messaging with care-team routing', 'Self-scheduling on Epic Cadence', 'English and Spanish from day one'], speakerNotes: 'Demo the scheduling flow if time allows.' },
    { title: 'Built for Epic', bullets: ['Native FHIR R4 and HL7v2', 'Proven at Lakeshore Medical', 'No custom middleware required'], speakerNotes: 'Reference the Lakeshore timeline.' },
    { title: 'Security you can audit', bullets: ['SOC 2 Type II and HITRUST r2', 'BAA ready to sign', 'Dedicated US-region tenant'], speakerNotes: 'Be ready for the on-prem question.' },
    { title: 'Live in 7 months', bullets: ['Months 1–3: SSO and Epic integration', 'Months 4–6: two-hospital pilot', 'Month 7: network rollout'], speakerNotes: 'Emphasize the two-month buffer.' },
    { title: 'Investment', bullets: ['$280K fixed implementation', '$413K per year subscription', '$1.52M three-year total, under the ceiling'], speakerNotes: 'Contrast with the Summit debrief: fixed fees, no surprises.' },
    { title: 'Why Meridian', bullets: ['60+ health systems live', 'Two-month schedule buffer', 'References from Lakeshore and Cedar Valley'], speakerNotes: 'Close with the ask and next steps.' },
  ],
}

export const MOCK_EMAIL = `Subject: Meridian Cloud response to the Patient Engagement Platform RFP

Dear Northwind Procurement Team,

Please find attached Meridian Cloud's response to the Patient Engagement Platform RFP.

In short, we propose Meridian Engage: a HIPAA-compliant platform with native Epic integration, full English and Spanish support, and a go-live in month 7. The three-year investment of $1.52M falls within your stated budget.

We would welcome the opportunity to present to your evaluation committee and to arrange a reference call with Lakeshore Medical, where we delivered a similar Epic program in 2025.

Kind regards,
Jordan Reyes
Director of Healthcare Partnerships, Meridian Cloud`
