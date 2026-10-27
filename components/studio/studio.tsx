'use client'

import { useRef, useState } from 'react'
import { ArtifactPanel, type SaveState } from '@/components/studio/artifact-panel'
import { ChatPanel } from '@/components/studio/chat-panel'
import { HomeScreen } from '@/components/studio/home-screen'
import { SourcePreview } from '@/components/studio/source-preview'
import { MOCK_EMAIL, MOCK_RESPONSE, SYNC_STEPS, type BoxFile } from '@/lib/mock-data'
import type { RfpOutput } from '@/lib/rfp-schema'
import type { Artifact, ArtifactType, ChatMessage } from '@/lib/studio-types'

const TITLES: Record<ArtifactType, string> = {
  brief: 'Research brief',
  response: 'RFP response',
  deck: 'Presentation',
  email: 'Cover email',
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function shorten(doc: RfpOutput): RfpOutput {
  const first = (t: string) => t.split(/\n\s*\n/)[0]
  return {
    ...doc,
    executiveSummary: first(doc.executiveSummary),
    sections: doc.sections.map((s) => ({ ...s, body: first(s.body) })),
  }
}

function sharpenPricing(doc: RfpOutput): RfpOutput {
  return {
    ...doc,
    sections: doc.sections.map((s) =>
      s.heading === 'Pricing Approach'
        ? {
            ...s,
            body: `${s.body}\n\nTo lower the Year 1 cost, we offer a 10% multi-year commitment discount, which brings the three-year total to $1.41M. Implementation fees are fixed, with no change orders for in-scope work.`,
          }
        : s,
    ),
    slides: doc.slides.map((slide) =>
      slide.title === 'Investment'
        ? { ...slide, bullets: [...slide.bullets.slice(0, 2), '$1.41M three-year total with a 10% multi-year discount'] }
        : slide,
    ),
  }
}

export function Studio() {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [activeId, setActiveId] = useState<ArtifactType | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [doc, setDoc] = useState<RfpOutput>(MOCK_RESPONSE)
  const [email, setEmail] = useState(MOCK_EMAIL)
  const idRef = useRef(0)
  const nextId = () => `m${++idRef.current}`

  const push = (m: ChatMessage) => setMessages((prev) => [...prev, m])
  const patch = (id: string, update: Partial<ChatMessage>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? ({ ...m, ...update } as ChatMessage) : m)))

  const [generatingId, setGeneratingId] = useState<ArtifactType | null>(null)
  const [unseen, setUnseen] = useState<ArtifactType[]>([])
  const [saved, setSaved] = useState<Partial<Record<ArtifactType, number>>>({})
  const [saving, setSaving] = useState(false)
  const [previewFile, setPreviewFile] = useState<BoxFile | null>(null)
  const versionsRef = useRef<Partial<Record<ArtifactType, number>>>({})

  function select(id: ArtifactType) {
    setActiveId(id)
    setUnseen((prev) => prev.filter((u) => u !== id))
  }

  function upsertArtifact(id: ArtifactType, note: string, { focus = true } = {}) {
    const version = (versionsRef.current[id] ?? 0) + 1
    versionsRef.current[id] = version
    setArtifacts((prev) =>
      prev.some((a) => a.id === id)
        ? prev.map((a) => (a.id === id ? { ...a, version } : a))
        : [...prev, { id, title: TITLES[id], version }],
    )
    if (focus) select(id)
    else setUnseen((prev) => (prev.includes(id) ? prev : [...prev, id]))
    push({ id: nextId(), role: 'assistant', kind: 'artifact', artifactId: id, title: TITLES[id], version, note })
  }

  async function generate(id: ArtifactType, busyText: string, ms: number, note: string) {
    setBusy(busyText)
    setArtifacts((prev) => (prev.some((a) => a.id === id) ? prev : [...prev, { id, title: TITLES[id], version: 0 }]))
    setGeneratingId(id)
    select(id)
    await wait(ms)
    setGeneratingId(null)
    setBusy(null)
    upsertArtifact(id, note)
  }

  async function saveActive() {
    if (!activeId) return
    const id = activeId
    setSaving(true)
    await wait(900)
    setSaving(false)
    setSaved((prev) => ({ ...prev, [id]: versionsRef.current[id] }))
  }

  async function start(prompt: string) {
    setStarted(true)
    push({ id: nextId(), role: 'user', text: prompt })
    const syncId = nextId()
    push({ id: syncId, role: 'assistant', kind: 'sync', completed: 0, done: false })
    for (let i = 1; i <= SYNC_STEPS.length; i++) {
      await wait(650)
      patch(syncId, { completed: i })
    }
    patch(syncId, { done: true })
    await wait(300)
    versionsRef.current.brief = 1
    setArtifacts([{ id: 'brief', title: TITLES.brief, version: 1 }])
    setActiveId('brief')
    push({ id: nextId(), role: 'assistant', kind: 'context', status: 'pending' })
  }

  async function confirmBrief() {
    if (confirmed) return
    setConfirmed(true)
    setMessages((prev) =>
      prev.map((m) => (m.role === 'assistant' && m.kind === 'context' ? { ...m, status: 'confirmed' } : m)),
    )
    await generate(
      'response',
      'Writing response from 10 Box sources…',
      2200,
      'I drafted the full response, including a compliance matrix. The on-prem residency question is flagged in Security & Compliance. You can ask for edits, or ask for a presentation or cover email.',
    )
  }

  async function handlePrompt(text: string) {
    push({ id: nextId(), role: 'user', text })
    const t = text.toLowerCase()

    if (/deck|presentation|slides|pitch/.test(t)) {
      await generate(
        'deck',
        'Building presentation…',
        2000,
        'Here is an 8-slide deck built from the response, with speaker notes. You can export it to PowerPoint.',
      )
      return
    }
    if (/email|cover letter|cover note/.test(t)) {
      await generate('email', 'Drafting cover email…', 1500, 'I drafted a cover email to send with the submission.')
      return
    }
    if (/brief|research|sources/.test(t)) {
      select('brief')
      push({ id: nextId(), role: 'assistant', kind: 'text', text: 'I opened the research brief in the panel on the right.' })
      return
    }

    if (/pric|cost|cheap|discount|budget/.test(t)) {
      setBusy('Updating pricing…')
      await wait(1400)
      setBusy(null)
      setDoc((d) => sharpenPricing(d))
      const onDeck = activeId === 'deck'
      upsertArtifact('response', 'I added a multi-year discount option to the pricing section.', { focus: !onDeck })
      if (versionsRef.current.deck) {
        upsertArtifact('deck', 'I also updated the Investment slide to match.', { focus: onDeck })
      }
      return
    }

    const target: ArtifactType = activeId && activeId !== 'brief' ? activeId : 'response'
    setBusy(`Updating ${TITLES[target].toLowerCase()}…`)
    await wait(1400)
    setBusy(null)

    if (target === 'response' && /short|concise|trim|tighten/.test(t)) {
      setDoc((d) => shorten(d))
      upsertArtifact('response', 'I tightened every section to its key paragraph.')
    } else if (target === 'email' && /short|concise/.test(t)) {
      setEmail((e) => e.split('\n\n').filter((_, i) => i !== 3).join('\n\n'))
      upsertArtifact('email', 'I shortened the email by removing the reference paragraph.')
    } else {
      upsertArtifact(target, `I applied "${text}" to the ${TITLES[target].toLowerCase()}. (Demo mode: this edit is simulated.)`)
    }
  }

  function reset() {
    versionsRef.current = {}
    setStarted(false)
    setMessages([])
    setArtifacts([])
    setActiveId(null)
    setConfirmed(false)
    setDoc(MOCK_RESPONSE)
    setEmail(MOCK_EMAIL)
    setGeneratingId(null)
    setUnseen([])
    setSaved({})
    setPreviewFile(null)
  }

  if (!started) return <HomeScreen onSubmit={start} />

  const saveState: SaveState = saving
    ? 'saving'
    : activeId && saved[activeId] && saved[activeId] === versionsRef.current[activeId]
      ? 'saved'
      : 'idle'

  return (
    <main className="relative grid h-dvh grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[380px_minmax(0,1fr)] md:grid-rows-1 lg:grid-cols-[420px_minmax(0,1fr)]">
      <div className="min-h-0 border-b border-border md:border-b-0 md:border-r">
        <ChatPanel
          title={messages.find((m) => m.role === 'user')?.text ?? 'New chat'}
          messages={messages}
          busy={busy}
          canPrompt={confirmed}
          onSubmit={handlePrompt}
          onConfirm={confirmBrief}
          onOpenArtifact={select}
          onReset={reset}
        />
      </div>
      <ArtifactPanel
        artifacts={artifacts}
        activeId={activeId}
        onSelect={select}
        doc={doc}
        email={email}
        generatingId={generatingId}
        unseen={unseen}
        saveState={saveState}
        onSave={saveActive}
        onOpenSource={setPreviewFile}
      />
      {previewFile && <SourcePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
    </main>
  )
}
