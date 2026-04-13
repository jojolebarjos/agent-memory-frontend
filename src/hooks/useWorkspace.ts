import { useCallback, useReducer } from 'react'
import { toast } from 'sonner'

import type { Kind } from '@/types/domain'
import type { ServerEvent } from '@/types/protocol'
import type { SyncState, WorkspaceState } from '@/types/state'

import { useProtocol } from './useProtocol'
import { type WebSocketStatus } from './useWebSocket'

const initialState: WorkspaceState = {
  sync: { phase: 'connecting' },
  documents: {},
  conversations: {},
  messageToConversation: {},
  keyToDocument: {},
}

function bumpSync(sync: SyncState): SyncState {
  if (sync.phase !== 'syncing')
    return sync
  const received = sync.received + 1
  if (received >= sync.total)
    return { phase: 'ready' }
  return { ...sync, received }
}

type WorkspaceAction = ServerEvent | { type: 'socket.error' }

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'socket.error':
      return {
        ...initialState,
        sync: { phase: 'error' },
      }

    case 'workspace.sync':
      if (action.count <= 0)
        return {
          ...initialState,
          sync: {
            phase: 'ready',
          },
        }
      return {
        ...initialState,
        sync: {
          phase: 'syncing',
          total: action.count,
          received: 0,
        },
      }

    case 'conversation.created':
      return {
        ...state,
        sync: bumpSync(state.sync),
        conversations: {
          ...state.conversations,
          [action.conversation.id]: { ...action.conversation, messages: {} },
        },
      }

    case 'document.created':
      return {
        ...state,
        sync: bumpSync(state.sync),
        documents: {
          ...state.documents,
          [action.document.id]: action.document,
        },
        keyToDocument: {
          ...state.keyToDocument,
          [action.document.key]: action.document.id,
        }
      }

    case 'message.created': {
      const conversation = state.conversations[action.message.conversationId]
      return {
        ...state,
        sync: bumpSync(state.sync),
        conversations: {
          ...state.conversations,
          [action.message.conversationId]: {
            ...conversation,
            messages: {
              ...conversation.messages,
              [action.message.id]: { ...action.message, fragments: {} },
            },
          },
        },
        messageToConversation: {
          ...state.messageToConversation,
          [action.message.id]: action.message.conversationId,
        }
      }
    }

    case 'fragment.created': {
      const conversationId = state.messageToConversation[action.fragment.messageId]
      const conversation = state.conversations[conversationId]
      const message = conversation.messages[action.fragment.messageId]
      return {
        ...state,
        sync: bumpSync(state.sync),
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            messages: {
              ...conversation.messages,
              [message.id]: {
                ...message,
                fragments: {
                  ...message.fragments,
                  [action.fragment.id]: action.fragment,
                },
              },
            },
          },
        },
      }
    }
  }
  return state
}

function notify(kind: Kind, content: string) {
  switch (kind) {
    case 'pending':
    case 'normal': {
      console.info(content)
      toast(content)
      break
    }
    case 'end':
    case 'success': {
      console.info(content)
      toast.success(content)
      break
    }
    case 'info': {
      console.info(content)
      toast.info(content)
      break
    }
    case 'warning': {
      console.warn(content)
      toast.warning(content)
      break
    }
    case 'error': {
      console.error(content)
      toast.error(content)
      break
    }
  }
}

export function useWorkspace(url: string) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)

  const handleEvent = useCallback((event: ServerEvent) => {
    if (event.type === 'notification')
      notify(event.kind, event.content)
    else
      dispatch(event)
  }, [])

  const handleStatusChange = useCallback((status: WebSocketStatus) => {
    if (status === 'error' || status === 'closed')
      dispatch({ type: 'socket.error' })
  }, [])

  const { request } = useProtocol(url, handleEvent, handleStatusChange)

  const createDocument = useCallback(async (key: string, title: string, tags: string[], description: string, content: string) => {
    const response = await request({ type: 'document.create', key, title, tags, description, content })
    if (response.type !== 'document.create.response')
      throw new Error(`Unexpected response type: ${response.type}`)
    return response.document
  }, [request])

  const createConversation = useCallback(async (title: string) => {
    const response = await request({ type: 'conversation.create', title })
    if (response.type !== 'conversation.create.response')
      throw new Error(`Unexpected response type: ${response.type}`)
    return response.conversation
  }, [request])

  const createMessage = useCallback(async (conversationId: string) => {
    const response = await request({ type: 'message.create', conversationId })
    if (response.type !== 'message.create.response')
      throw new Error(`Unexpected response type: ${response.type}`)
    return response.message
  }, [request])

  const createFragment = useCallback(async (messageId: string, kind: Kind, content: string, parentId?: string) => {
    const response = await request({ type: 'fragment.create', messageId, kind, content, parentId })
    if (response.type !== 'fragment.create.response')
      throw new Error(`Unexpected response type: ${response.type}`)
    return response.fragment
  }, [request])

  return { state, createDocument, createConversation, createMessage, createFragment }
}
