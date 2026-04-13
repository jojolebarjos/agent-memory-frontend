export type Kind =
  | 'normal'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'pending'
  | 'end'

export interface Document {
  id: string
  createdAt: string
  key: string
  version: number
  title: string
  tags: string[]
  description: string
  content: string
}

export interface Conversation {
  id: string
  createdAt: string
  title: string
}

export interface Message {
  id: string
  createdAt: string
  conversationId: string
  userName: string
}

export interface Fragment {
  id: string
  createdAt: string
  messageId: string
  parentId?: string
  kind: Kind
  content: string
}
