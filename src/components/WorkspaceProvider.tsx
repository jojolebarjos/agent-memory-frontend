import { useState, useCallback } from 'react'
import { WorkspaceContext } from '@/contexts/WorkspaceContext'
import { useWorkspace } from '@/hooks/useWorkspace'

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
