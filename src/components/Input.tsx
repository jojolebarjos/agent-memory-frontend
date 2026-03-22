import { useRef, useCallback } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export function Input({ value, onChange, onSubmit }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        onSubmit(trimmed)
        onChange('')
        if (ref.current) {
          ref.current.style.height = 'auto'
        }
      }
    }
  }, [value, onSubmit, onChange])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Say something..."
      rows={1}
      className="w-full resize-none overflow-hidden bg-transparent p-4 text-sm outline-none placeholder:text-neutral-400"
    />
  )
}