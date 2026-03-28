import { useParams } from 'react-router'
import { useWorkspaceContext } from '../components/WorkspaceContext'
import { Document } from '../components/Document'

export function DocumentKeyPage() {
  const { key } = useParams<{ key: string }>()
  const { state } = useWorkspaceContext()

  const versions = Object.values(state.documents)
    .filter(d => d.key === key!)
    .sort((a, b) => b.version - a.version)

  if (versions.length === 0)
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        Document not found.
      </div>
    )

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        {versions.map(doc => (
          <Document document={doc} />
        ))}
      </div>
    </div>
  )
}
