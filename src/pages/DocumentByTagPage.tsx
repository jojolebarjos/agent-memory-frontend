import { useParams } from 'react-router'
import { Hash } from 'lucide-react'
import { Document } from '../components/Document'
import { Empty } from '../components/Empty'
import { useWorkspaceContext } from '../hooks/useWorkspaceContext'

export function DocumentByTagPage() {
  const { tag } = useParams<{ tag: string }>()
  const { state } = useWorkspaceContext()

  const documents = Object.values(state.keyToDocument)
    .map(id => state.documents[id])
    .filter(doc => doc.tags.includes(tag!))
    .sort((a, b) => a.key.localeCompare(b.key))

  if (documents.length === 0)
    return <Empty icon={Hash} message={`No documents tagged #${tag}.`} />

  return <>
    <title>{`#${tag}`}</title>
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        <h1 className="font-mono text-sm text-neutral-400">#{tag}</h1>
        {documents.map(doc => (
          <Document key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  </>
}
