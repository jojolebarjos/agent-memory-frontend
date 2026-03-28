import { NavLink } from 'react-router'
import type { Document } from '../types/protocol'
import { formatDateLong, formatDateShort } from '../utils/date'

interface Props {
  document: Document
}

export function Document({ document }: Props) {
  const createdAt = new Date(document.createdAt);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium font-mono text-neutral-500">
          {document.key}@{document.version}
        </span>
        <time
          className="text-xs text-neutral-400"
          dateTime={createdAt.toISOString()}
          title={formatDateLong(createdAt)}
        >
          {formatDateShort(createdAt)}
        </time>
      </div>

      <div className="space-y-2">
        <div className="text-base font-semibold text-neutral-900">{document.title}</div>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.map(tag => (
              <NavLink
                key={tag}
                to={`/t/${tag}`}
                className="font-mono text-xs text-neutral-400 hover:text-neutral-600"
              >
                #{tag}
              </NavLink>
            ))}
          </div>
        )}

        {document.description && (
          <p className="text-sm italic text-neutral-500">{document.description}</p>
        )}

        <p className="whitespace-pre-wrap text-sm text-neutral-900">{document.content}</p>
      </div>
    </div>
  )
}
