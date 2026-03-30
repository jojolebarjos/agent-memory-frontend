import { Wifi, WifiOff } from 'lucide-react'

import type { SyncState } from '@/types/state'

import { Empty } from './Empty'

interface Props {
  sync: SyncState
  children: React.ReactNode
}

export function SyncGate({ sync, children }: Props) {
  if (sync.phase === 'error')
    return <Empty icon={WifiOff} message="Connection lost. Please reload the page." />

  if (sync.phase === 'connecting' || sync.phase === 'syncing')
    return (
      <Empty
        icon={Wifi}
        message={sync.phase === 'syncing' ? `Loading... ${sync.received} / ${sync.total}` : 'Connecting...'}
      />
    )

  return <>{children}</>
}
