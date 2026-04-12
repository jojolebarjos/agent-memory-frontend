export type Kind =
  | 'normal'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'

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

export type ServerEvent =
  | { type: 'workspace.sync'; count: number }
  | { type: 'document.created'; document: Document }
  | { type: 'conversation.created'; conversation: Conversation }
  | { type: 'message.created'; message: Message }
  | { type: 'fragment.created'; fragment: Fragment }
  | { type: 'notification'; kind: Kind; content: string }

export type ClientCommand =
  | { type: 'document.create'; key: string; title: string, tags: string[]; description: string; content: string }
  | { type: 'conversation.create'; title: string }
  | { type: 'message.create'; conversationId: string }
  | { type: 'fragment.create'; messageId: string; kind: Kind; content: string; parentId?: string }
