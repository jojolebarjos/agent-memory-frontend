import {
  AlertTriangle,
  CheckCheck,
  CheckCircle,
  ChevronRight,
  Info,
  Loader2,
  XCircle,
} from 'lucide-react'

import type { Kind } from '@/types/domain'
import type { FragmentState } from '@/types/state'

import { Content } from './Content'

export interface FragmentTreeNode extends FragmentState {
  children: FragmentTreeNode[]
}

function SpinnerIcon({ className }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className ?? ''}`} />
}

type IconComponent = React.ComponentType<{ className?: string }>

interface KindConfig {
  style: string
  icon: IconComponent
}

const kindConfig: Record<Kind, KindConfig> = {
  normal: { style: 'text-neutral-900', icon: ChevronRight },
  success: { style: 'text-success-dark', icon: CheckCircle },
  info: { style: 'text-info-dark', icon: Info },
  warning: { style: 'text-warning-dark', icon: AlertTriangle },
  error: { style: 'text-error-dark', icon: XCircle },
  pending: { style: 'text-neutral-400 italic', icon: SpinnerIcon },
  end: { style: 'text-neutral-400 italic', icon: CheckCheck },
}

export function Fragment({ node }: { node: FragmentTreeNode }) {
  if (!node.content) return null
  const { style, icon: Icon } = kindConfig[node.kind]
  return (
    <div>
      <div className={`flex items-center gap-1.5 py-0.5 ${style}`}>
        <Icon className="size-[1em] shrink-0" />
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
