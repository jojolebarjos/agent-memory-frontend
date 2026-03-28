import { NavLink } from 'react-router'
import { useWorkspaceContext } from './WorkspaceContext'

export function Sidebar() {
  const { state, createConversation } = useWorkspaceContext()

  return (
    <aside className="flex w-60 flex-col border-r border-neutral-200">
      <div className="p-3">
        <button
          onClick={() => createConversation('New conversation')}
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-200"
        >
          + New conversation
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2">
        {Object.values(state.conversations).map(c => (
          <NavLink
            key={c.id}
            to={`/c/${c.id}`}
            className={({ isActive }) =>
              `block truncate rounded-md px-3 py-2 text-sm ${isActive ? 'bg-neutral-200 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`
            }
          >
            {c.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
