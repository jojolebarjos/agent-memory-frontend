import { useReducer, useCallback } from 'react'
import { useWebSocket, type WebSocketStatus } from './useWebSocket'
import type { WorkspaceState, SyncState } from '../types/state'
import type { ServerEvent, ClientCommand } from '../types/protocol'

const notificationConsole: Record<string, (...args: unknown[]) => void> = {
  info: console.info,
  warning: console.warn,
  error: console.error,
}

const initialState: WorkspaceState = {
  sync: { phase: 'connecting' },
  documents: {},
  conversations: {},
  messageToConversations: {},
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
        messageToConversations: {
          ...state.messageToConversations,
          [action.message.id]: action.message.conversationId,
        }
      }
    }

    case 'fragment.created': {
      const conversationId = state.messageToConversations[action.fragment.messageId]
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

    case 'notification':
      notificationConsole[action.kind]?.(action.message)
      return state
  }
}

export function useWorkspace(url: string) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)

  const handleMessage = useCallback((raw: unknown) => {
    dispatch(raw as ServerEvent)
  }, [])

  const handleStatusChange = useCallback((status: WebSocketStatus) => {
    if (status === 'error' || status === 'closed')
      dispatch({ type: 'socket.error' })
  }, [])

  const { send } = useWebSocket(url, handleMessage, handleStatusChange)

  const createConversation = useCallback((title: string) => {
    send({ type: 'conversation.create', title } satisfies ClientCommand)
  }, [send])

  const createMessage = useCallback((conversationId: string, content: string) => {
    send({ type: 'message.create', conversationId, content } satisfies ClientCommand)
  }, [send])

  return { state, createConversation, createMessage }
}
