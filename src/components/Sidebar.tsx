import { Home, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router'
import { useWorkspaceContext } from './WorkspaceContext'
import { SidebarSection } from './SidebarSection'

export function Sidebar() {
  const { state, createConversation } = useWorkspaceContext()

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

      </nav>
    </aside>
  )
}