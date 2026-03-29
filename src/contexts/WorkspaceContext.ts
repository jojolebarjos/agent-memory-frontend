import { createContext } from 'react'
import type { WorkspaceState } from '@/types/state'

interface WorkspaceContextValue {
  state: WorkspaceState
  drafts: Record<string, string>
  setDraft: (conversationId: string, draft: string) => void
  createConversation: (title: string) => void
  createMessage: (conversationId: string, content: string) => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
