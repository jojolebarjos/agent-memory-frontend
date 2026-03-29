import { useContext } from 'react'
import { WorkspaceContext } from '../contexts/WorkspaceContext'

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx)
    throw new Error('useWorkspaceContext must be used inside WorkspaceProvider')
  return ctx
}
