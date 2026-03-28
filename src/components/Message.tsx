import { useMemo } from 'react'
import type { Fragment } from '../types/protocol'
import type { MessageState } from '../types/state'
import { formatDateLong, formatDateShort } from '../utils/date'
import { Content } from './Content'

interface TreeNode extends Fragment {
  children: TreeNode[]
}

function buildTree(fragments: Record<string, Fragment>): TreeNode[] {
  const values = Object.values(fragments)
  const build = (f: Fragment): TreeNode => ({
    ...f,
    children: values.filter(c => c.parentId === f.id).map(build)
  })
  return values.filter(f => !f.parentId).map(build)
}

const fragmentStyles: Record<string, string> = {
  text: 'text-neutral-900',
  info: 'bg-blue-50 text-blue-900 rounded-md px-3 py-2',
  warning: 'bg-yellow-50 text-yellow-900 rounded-md px-3 py-2',
  error: 'bg-red-50 text-red-900 rounded-md px-3 py-2',
  call: 'bg-neutral-100 text-neutral-700 rounded-md px-3 py-2 font-mono text-sm',
  structured: 'bg-neutral-100 text-neutral-700 rounded-md px-3 py-2 font-mono text-sm',
}

function FragmentView({ node }: { node: TreeNode }) {
  return (
    <div>
      <div className={fragmentStyles[node.kind]}>
        <Content content={node.content} />
      </div>
      {node.children.length > 0 && (
        <div className="mt-1 space-y-1 pl-4">
          {node.children.map(child => (
            <FragmentView key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}

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
          <FragmentView key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}
