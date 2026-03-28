import { useMemo } from 'react'
import { NavLink } from 'react-router'

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'tag'; tag: string }
  | { kind: 'key'; key: string }

const TOKEN_PATTERN = /#([\w-]+)|\$([\w-]+)/g

function tokenize(content: string): Token[] {
  const tokens: Token[] = []
  let last = 0

  for (const match of content.matchAll(TOKEN_PATTERN)) {
    if (match.index > last)
      tokens.push({ kind: 'text', value: content.slice(last, match.index) })

    const [full, tag, key] = match
    if (tag)
      tokens.push({ kind: 'tag', tag })
    else
      tokens.push({ kind: 'key', key })

    last = match.index + full.length
  }

  if (last < content.length)
    tokens.push({ kind: 'text', value: content.slice(last) })

  return tokens
}

const linkClass = 'font-mono text-xs text-neutral-500 hover:text-neutral-700 hover:underline'

function renderToken(token: Token, index: number) {
  switch (token.kind) {
    case 'text':
      return <span key={index}>{token.value}</span>
    case 'tag':
      return <NavLink key={index} to={`/t/${token.tag}`} className={linkClass}>#{token.tag}</NavLink>
    case 'key':
      return <NavLink key={index} to={`/k/${token.key}`} className={linkClass}>${token.key}</NavLink>
  }
}

interface Props {
  content: string
}

export function Content({ content }: Props) {
  const tokens = useMemo(() => tokenize(content), [content])

  // TODO should maybe use multiple <p> elements (and maybe <br/>) on line breaks?

  return (
    <p className="whitespace-pre-wrap text-sm">
      {tokens.map(renderToken)}
    </p>
  )
}
