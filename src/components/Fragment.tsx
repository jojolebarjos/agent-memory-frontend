import type { Kind } from '../types/protocol'
import type { FragmentState } from '../types/state'
import { Content } from './Content'

interface TreeNode extends FragmentState {
  children: TreeNode[]
}

export function buildTree(fragments: Record<string, FragmentState>): TreeNode[] {
  const values = Object.values(fragments)
  const build = (f: FragmentState): TreeNode => ({
    ...f,
    children: values.filter(c => c.parentId === f.id).map(build)
  })
  return values.filter(f => !f.parentId).map(build)
}

const fragmentStyles: Record<Kind, string> = {
  normal: 'text-neutral-900',
  success: 'bg-success-light text-success-dark rounded-md px-3 py-2',
  info: 'bg-info-light text-info-dark rounded-md px-3 py-2',
  warning: 'bg-warning-light text-warning-dark rounded-md px-3 py-2',
  error: 'bg-error-light text-error-dark rounded-md px-3 py-2',
}

export function Fragment({ node }: { node: TreeNode }) {
  return (
    <div>
      <div className={fragmentStyles[node.kind]}>
        <Content content={node.content} />
      </div>
      {node.children.length > 0 && (
        <div className="mt-1 space-y-1 pl-4">
          {node.children.map(child => (
            <Fragment key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}
