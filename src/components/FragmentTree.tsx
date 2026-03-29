import { useMemo } from 'react'
import type { FragmentState } from '@/types/state'
import { Fragment } from './Fragment'

interface FragmentTreeNode extends FragmentState {
  children: FragmentTreeNode[]
}

function buildTree(fragments: Record<string, FragmentState>): FragmentTreeNode[] {
  const values = Object.values(fragments)
  const build = (f: FragmentState): FragmentTreeNode => ({
    ...f,
    children: values.filter(c => c.parentId === f.id).map(build)
  })
  return values.filter(f => !f.parentId).map(build)
}

interface Props {
  fragments: Record<string, FragmentState>
}

export function FragmentTree({ fragments }: Props) {
  const tree = useMemo(() => buildTree(fragments), [fragments])
  return (
    <div className="space-y-1">
      {tree.map(node => (
        <Fragment key={node.id} node={node} />
      ))}
    </div>
  )
}
