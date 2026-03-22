export type FragmentKind =
  | 'text'
  | 'structured'
  | 'info'
  | 'warning'
  | 'error'
  | 'call'

export type NotificationKind =
  | 'info'
  | 'warning'
  | 'error'

export interface Document {
  id: string
  title: string
  description: string
  content: string
  version: number
  tags: string[]
}

export interface Conversation {
  id: string
  title: string
}

export interface Message {
  id: string
  createdAt: string
  userName: string
}

export interface Fragment {
  id: string
  messageId: string
  parentId?: string
  kind: FragmentKind
  content: string
}

export type ServerEvent =
  | { type: 'workspace.sync'; conversationCount: number; documentCount: number; messageCount: number; fragmentCount: number }
  | { type: 'document.created'; document: Document }
  | { type: 'conversation.created'; conversation: Conversation }
  | { type: 'message.created'; conversationId: string; message: Message }
  | { type: 'fragment.created'; conversationId: string; fragment: Fragment }
  | { type: 'notification'; kind: NotificationKind; message: string }

export type ClientCommand =
  | { type: 'conversation.create'; title: string }
  | { type: 'message.create'; conversationId: string; content: string }
