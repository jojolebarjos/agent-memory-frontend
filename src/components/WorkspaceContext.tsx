import { createContext, useContext, useState, useCallback } from 'react'
import { useWorkspace } from '../hooks/useWorkspace'
import type { WorkspaceState } from '../types/state'

interface WorkspaceContextValue {
  state: WorkspaceState
  drafts: Record<string, string>
  setDraft: (conversationId: string, draft: string) => void
  createConversation: (title: string) => void
  createMessage: (conversationId: string, content: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

interface Props {
  url: string
  children: React.ReactNode
}

export function WorkspaceProvider({ url, children }: Props) {
  const { state, createConversation, createMessage } = useWorkspace(url)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const setDraft = useCallback((conversationId: string, draft: string) => {
    setDrafts(prev => ({ ...prev, [conversationId]: draft }))
  }, [])

  return (
    <WorkspaceContext.Provider value={{ state, drafts, setDraft, createConversation, createMessage }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx)
    throw new Error('useWorkspaceContext must be used inside WorkspaceProvider')
  return ctx
}
