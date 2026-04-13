import { MessageSquare } from 'lucide-react'
import { useCallback } from 'react'
import { useParams } from 'react-router'

import { Conversation } from '@/components/Conversation'
import { Empty } from '@/components/Empty'
import { useWorkspaceContext } from '@/hooks/useWorkspaceContext'

export function ConversationPage() {
  const { conversationId = "" } = useParams<{ conversationId: string }>()
  const { state, drafts, setDraft, createMessage, createFragment } = useWorkspaceContext()

  const handleSubmit = useCallback(async (content: string) => {
    const message = await createMessage(conversationId)
    await createFragment(message.id, "normal", content)
    await createFragment(message.id, "end", "")
    // TODO should probably disable submission until done?
  }, [conversationId, createMessage, createFragment])

  const handleDraftChange = useCallback((draft: string) => {
    setDraft(conversationId, draft)
  }, [conversationId, setDraft])

  const conversation = state.conversations[conversationId]

  if (!conversation)
    return <Empty icon={MessageSquare} message="Conversation not found." />

  return <>
    <title>{conversation.title}</title>
    <div className="h-full">
      <Conversation
        conversation={conversation}
        draft={drafts[conversationId] ?? ''}
        onDraftChange={handleDraftChange}
        onSubmit={handleSubmit}
      />
    </div>
  </>
}
