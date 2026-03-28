import { useParams } from 'react-router'
import { FileText } from 'lucide-react'
import { useWorkspaceContext } from '../components/WorkspaceContext'
import { Document } from '../components/Document'
import { Empty } from '../components/Empty'

export function DocumentByKeyPage() {
  const { key } = useParams<{ key: string }>()
  const { state } = useWorkspaceContext()

  const documents = Object.values(state.documents)
    .filter(d => d.key === key!)
    .sort((a, b) => b.version - a.version)

  if (documents.length === 0)
    return <Empty icon={FileText} message="Document not found." />

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        <h1 className="font-mono text-sm text-neutral-400">${key}</h1>
        {documents.map(doc => (
          <Document key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}
