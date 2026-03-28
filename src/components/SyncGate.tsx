import type { SyncState } from '../types/state'

interface Props {
  sync: SyncState
  children: React.ReactNode
}

export function SyncGate({ sync, children }: Props) {
  if (sync.phase === 'error')
    return (
      <div className="flex h-screen items-center justify-center text-sm text-red-500">
        Connection lost. Please reload the page.
      </div>
    )

  if (sync.phase === 'connecting' || sync.phase === 'syncing')
    return (
      <div className="flex h-screen items-center justify-center text-sm text-neutral-400">
        {sync.phase === 'syncing'
          ? `Loading... ${sync.received} / ${sync.total}`
          : 'Connecting...'}
      </div>
    )

  return <>{children}</>
}
