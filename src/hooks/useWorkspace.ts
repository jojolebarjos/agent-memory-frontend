import { useReducer, useCallback } from 'react'
import { toast } from 'sonner'
import { useWebSocket, type WebSocketStatus } from './useWebSocket'
import type { WorkspaceState, SyncState } from '../types/state'
import type { ServerEvent, ClientCommand, Kind } from '../types/protocol'

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
    case 'normal': {
      console.info(content)
      toast(content)
      break
    }
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

  const handlePayload = useCallback((raw: unknown) => {
    const event = raw as ServerEvent
    if (event.type === 'notification')
      notify(event.kind, event.content)
    else
      dispatch(event)
  }, [])

  const handleStatusChange = useCallback((status: WebSocketStatus) => {
    if (status === 'error' || status === 'closed')
      dispatch({ type: 'socket.error' })
  }, [])

  const { send } = useWebSocket(url, handlePayload, handleStatusChange)

  const createConversation = useCallback((title: string) => {
    send({ type: 'conversation.create', title } satisfies ClientCommand)
  }, [send])

  const createMessage = useCallback((conversationId: string, content: string) => {
    send({ type: 'message.create', conversationId, content } satisfies ClientCommand)
  }, [send])

  return { state, createConversation, createMessage }
}
