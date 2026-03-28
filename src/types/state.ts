import type { Document, Conversation, Message, Fragment } from './protocol'

export type SyncState =
  | { phase: 'connecting' }
  | { phase: 'syncing'; total: number; received: number }
  | { phase: 'ready' }
  | { phase: 'error' }

export interface MessageState extends Message {
  fragments: Record<string, Fragment>
}

export interface ConversationState extends Conversation {
  messages: Record<string, MessageState>
}

export interface WorkspaceState {
  sync: SyncState
  documents: Record<string, Document>
  conversations: Record<string, ConversationState>
  messageToConversations: Record<string, string>
}
