import { createContext } from 'react'

import type { Kind } from '@/types/protocol'
import type { WorkspaceState } from '@/types/state'

interface WorkspaceContextValue {
  state: WorkspaceState
  drafts: Record<string, string>
  setDraft: (conversationId: string, draft: string) => void
  createDocument: (key: string, title: string, tags: string[], description: string, content: string) => void
  createConversation: (title: string) => void
  createMessage: (conversationId: string) => void
  createFragment: (messageId: string, kind: Kind, content: string, parentId?: string) => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
