import { Outlet } from 'react-router'
import { Toaster } from 'sonner'
import { useWorkspaceContext } from '../components/WorkspaceContext'
import { SyncGate } from '../components/SyncGate'
import { Sidebar } from '../components/Sidebar'

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
