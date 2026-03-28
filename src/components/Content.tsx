interface Props {
  content: string
}

export function Content({ content }: Props) {
  return <p className="whitespace-pre-wrap">{content}</p>
}
