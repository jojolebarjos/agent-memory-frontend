import type { ConversationState } from '@/types/state'

import { Input } from './Input'
import { MessageList } from './MessageList'

interface Props {
  conversation: ConversationState
  draft: string
  onDraftChange: (draft: string) => void
  onSubmit: (content: string) => void
}

export function Conversation({ conversation, draft, onDraftChange, onSubmit }: Props) {
  return (
    <div className="flex h-full flex-col">
      <MessageList conversation={conversation} />
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-3xl">
          <Input value={draft} onChange={onDraftChange} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  )
}
