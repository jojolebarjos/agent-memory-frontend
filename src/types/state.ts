import type { Conversation, Document, Fragment, Message } from './protocol'

export type SyncState =
  | { phase: 'connecting' }
  | { phase: 'syncing'; total: number; received: number }
  | { phase: 'ready' }
  | { phase: 'error' }

export type FragmentState = Fragment

export interface MessageState extends Message {
  fragments: Record<string, FragmentState>
}

export interface ConversationState extends Conversation {
  messages: Record<string, MessageState>
}

export interface WorkspaceState {
  sync: SyncState
  documents: Record<string, Document>
  conversations: Record<string, ConversationState>
  messageToConversation: Record<string, string>
  keyToDocument: Record<string, string>
}
