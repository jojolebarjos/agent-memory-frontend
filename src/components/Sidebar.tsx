import { FileText, Hash, Home, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router'
import { useWorkspaceContext } from './WorkspaceContext'
import { SidebarSection } from './SidebarSection'

export function Sidebar() {
  const { state, createConversation } = useWorkspaceContext()

  const documents = Object.values(state.keyToDocument)
    .map(id => state.documents[id])
    .sort((a, b) => a.key.localeCompare(b.key))

  const tags = [...new Set(
    Object.values(state.keyToDocument)
      .map(id => state.documents[id])
      .flatMap(doc => doc.tags)
  )].sort()

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
          <Home className="size-[1em]" />
          Home
        </NavLink>

        <SidebarSection
          icon={<MessageSquare className="size-[1em]" />}
          label="Conversations"
          onAdd={() => createConversation('New conversation')}
        >
          {Object.values(state.conversations).map(conversation => (
            <NavLink
              key={conversation.id}
              to={`/c/${conversation.id}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {conversation.title}
            </NavLink>
          ))}
        </SidebarSection>

        <SidebarSection
          icon={<FileText className="size-[1em]" />}
          label="Documents"
        >
          {documents.map(document => (
            <NavLink
              key={document.key}
              to={`/k/${document.key}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-1.5 font-mono text-xs ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {document.key}
            </NavLink>
          ))}
        </SidebarSection>

        <SidebarSection
          icon={<Hash className="size-[1em]" />}
          label="Tags"
        >
          {tags.map(tag => (
            <NavLink
              key={tag}
              to={`/t/${tag}`}
              className={({ isActive }) =>
                `block truncate rounded-md px-3 py-1.5 font-mono text-xs ${isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {tag}
            </NavLink>
          ))}
        </SidebarSection>

      </nav>
    </aside>
  )
}