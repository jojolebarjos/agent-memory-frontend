import { FileText, Home, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router'
import { useWorkspaceContext } from './WorkspaceContext'
import { SidebarSection } from './SidebarSection'

export function Sidebar() {
  const { state, createConversation } = useWorkspaceContext()

  const latestDocuments = Object.values(
    Object.values(state.documents).reduce<Record<string, typeof state.documents[string]>>(
      (acc, doc) => {
        if (!acc[doc.key] || doc.version > acc[doc.key].version)
          acc[doc.key] = doc
        return acc
      },
      {}
    )
  ).sort((a, b) => a.key.localeCompare(b.key))

  return (
    <aside className="flex w-60 flex-col border-r border-neutral-200">
      <nav className="flex-1 overflow-y-auto py-2">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 text-sm ${isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`
          }
        >
          <Home size={16} />
          Home
        </NavLink>

        <SidebarSection
          icon={<MessageSquare size={14} />}
          label="Conversations"
          onAdd={() => createConversation('New conversation')}
        >
          {Object.values(state.conversations).map(c => (
            <NavLink
              key={c.id}
              to={`/c/${c.id}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {c.title}
            </NavLink>
          ))}
        </SidebarSection>

        <SidebarSection
          icon={<FileText size={14} />}
          label="Documents"
        >
          {latestDocuments.map(doc => (
            <NavLink
              key={doc.key}
              to={`/k/${doc.key}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-1.5 font-mono text-xs ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {doc.key}
            </NavLink>
          ))}
        </SidebarSection>

      </nav>
    </aside>
  )
}