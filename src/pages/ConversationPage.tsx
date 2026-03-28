import { useCallback } from 'react'
import { useParams } from 'react-router'
import { useWorkspaceContext } from '../components/WorkspaceContext'
import { Conversation } from '../components/Conversation'

export function ConversationPage() {
  const { conversationId = "" } = useParams<{ conversationId: string }>()
  const { state, drafts, setDraft, createMessage } = useWorkspaceContext()

  const handleSubmit = useCallback((content: string) => {
    createMessage(conversationId, content)
  }, [conversationId, createMessage])

  const handleDraftChange = useCallback((draft: string) => {
    setDraft(conversationId, draft)
  }, [conversationId, setDraft])

  const conversation = state.conversations[conversationId]

  if (state.sync.phase === 'connecting' || state.sync.phase === 'syncing') {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        {state.sync.phase === 'syncing'
          ? `Loading... ${state.sync.received} / ${state.sync.total}`
          : 'Connecting...'}
      </div>
    )
  }

  if (state.sync.phase === 'error') {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Connection lost. Please reload the page.
      </div>
    )
  }

  return (
    <div className="h-full">
      <Conversation
        conversation={conversation}
        draft={drafts[conversationId] ?? ''}
        onDraftChange={handleDraftChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
