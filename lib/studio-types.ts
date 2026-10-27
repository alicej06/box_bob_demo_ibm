export type ArtifactType = 'brief' | 'response' | 'deck' | 'email'

export type Artifact = {
  id: ArtifactType
  title: string
  version: number
}

export type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; kind: 'text'; text: string }
  | { id: string; role: 'assistant'; kind: 'sync'; completed: number; done: boolean }
  | { id: string; role: 'assistant'; kind: 'context'; status: 'pending' | 'confirmed' }
  | { id: string; role: 'assistant'; kind: 'artifact'; artifactId: ArtifactType; title: string; version: number; note: string }
