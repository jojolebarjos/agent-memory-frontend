import type { MessageState } from '@/types/state'
import { formatDateLong, formatDateShort } from '@/utils/date'

import { Fragment } from './Fragment'
import { FragmentTree } from './FragmentTree'

interface Props {
  message: MessageState
}

const PENDING_NODE = {
  id: '__pending__',
  createdAt: '',
  messageId: '',
  kind: 'pending' as const,
  content: 'Typing…',
  children: [],
}

export function Message({ message }: Props) {
  const createdAt = new Date(message.createdAt)
  const hasEnded = Object.values(message.fragments).some(f => f.kind === 'end')
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{message.userName}</span>
        <time
          className="text-xs text-neutral-400"
          dateTime={createdAt.toISOString()}
          title={formatDateLong(createdAt)}
        >
          {formatDateShort(createdAt)}
        </time>
      </div>
      <FragmentTree fragments={message.fragments} />
      {!hasEnded && <Fragment node={PENDING_NODE} />}
    </div>
  )
}
