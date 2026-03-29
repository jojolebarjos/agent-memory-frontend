import { useMemo } from 'react'
import type { MessageState } from '@/types/state'
import { formatDateLong, formatDateShort } from '@/utils/date'
import { Fragment, buildTree } from './Fragment'

interface Props {
  message: MessageState
}

export function Message({ message }: Props) {
  const tree = useMemo(() => buildTree(message.fragments), [message.fragments])

  const createdAt = new Date(message.createdAt);

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
      <div className="space-y-1">
        {tree.map(node => (
          <Fragment key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}
