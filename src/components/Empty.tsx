import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  message: string
}

export function Empty({ icon: Icon, message }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-300">
      <Icon size={48} strokeWidth={1} />
      <span className="text-sm text-neutral-400">{message}</span>
    </div>
  )
}
