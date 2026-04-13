import { createContext } from 'react'

import type { Conversation, Document, Fragment, Kind, Message } from '@/types/domain'
import type { WorkspaceState } from '@/types/state'

interface WorkspaceContextValue {
  state: WorkspaceState
  drafts: Record<string, string>
  setDraft: (conversationId: string, draft: string) => void
  createDocument: (key: string, title: string, tags: string[], description: string, content: string) => Promise<Document>
  createConversation: (title: string) => Promise<Conversation>
  createMessage: (conversationId: string) => Promise<Message>
  createFragment: (messageId: string, kind: Kind, content: string, parentId?: string) => Promise<Fragment>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
