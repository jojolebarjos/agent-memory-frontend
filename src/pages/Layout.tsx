import { Outlet } from 'react-router'
import { Toaster } from 'sonner'

import { Sidebar } from '@/components/Sidebar'
import { SyncGate } from '@/components/SyncGate'
import { useWorkspaceContext } from '@/hooks/useWorkspaceContext'

export function Layout() {
  const { state } = useWorkspaceContext()

  return <>
    <SyncGate sync={state.sync}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </SyncGate>
    <Toaster position="top-center" expand={true} closeButton richColors />
  </>
}
