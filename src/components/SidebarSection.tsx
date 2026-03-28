import { Plus } from 'lucide-react'

interface Props {
  icon: React.ReactNode
  label: string
  onAdd?: () => void
  children?: React.ReactNode
}

export function SidebarSection({ icon, label, onAdd, children }: Props) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-neutral-400">{icon}</span>
        <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      {children && <div className="px-2">{children}</div>}
    </div>
  )
}
