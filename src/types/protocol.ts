import type { Conversation, Document, Fragment, Kind, Message } from "./domain";

export type ServerEvent =
  | { type: 'workspace.sync'; count: number }
  | { type: 'document.created'; document: Document }
  | { type: 'conversation.created'; conversation: Conversation }
  | { type: 'message.created'; message: Message }
  | { type: 'fragment.created'; fragment: Fragment }
  | { type: 'notification'; kind: Kind; content: string }

export type ServerResponse =
  | { type: 'document.create.response'; requestId: string; document: Document }
  | { type: 'conversation.create.response'; requestId: string; conversation: Conversation }
  | { type: 'message.create.response'; requestId: string; message: Message }
  | { type: 'fragment.create.response'; requestId: string; fragment: Fragment }

export type ServerPayload = ServerEvent | ServerResponse

export type ClientRequest =
  | { type: 'document.create'; key: string; title: string, tags: string[]; description: string; content: string }
  | { type: 'conversation.create'; title: string }
  | { type: 'message.create'; conversationId: string }
  | { type: 'fragment.create'; messageId: string; kind: Kind; content: string; parentId?: string }
