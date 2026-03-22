import { useEffect, useRef, useCallback } from 'react'
import type { ConversationState } from '../types/state'
import { Message } from './Message'

interface Props {
  conversation: ConversationState
}

export function MessageList({ conversation }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (el)
      isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100
  }, [])

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation.messages])

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {Object.values(conversation.messages).map(message => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
