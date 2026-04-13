import { useCallback, useRef } from 'react'

import type { ClientRequest, ServerEvent, ServerPayload, ServerResponse } from '@/types/protocol'

import { useWebSocket, type WebSocketStatus } from './useWebSocket'

type PendingRequest = {
  resolve: (response: ServerResponse) => void
  reject: (error: Error) => void
}

export function useProtocol(
  url: string,
  onEvent: (event: ServerEvent) => void,
  onStatusChange?: (status: WebSocketStatus) => void,
) {
  const pendingRef = useRef(new Map<string, PendingRequest>())

  const handlePayload = useCallback((raw: unknown) => {
    const payload = raw as ServerPayload
    if ('requestId' in payload) {
      const pending = pendingRef.current.get(payload.requestId)
      if (pending) {
        pendingRef.current.delete(payload.requestId)
        pending.resolve(payload)
      } else {
        console.warn('Unexpected server response', payload)
      }
    } else {
      onEvent(payload)
    }
  }, [onEvent])

  const handleStatusChange = useCallback((status: WebSocketStatus) => {
    if (status === 'error' || status === 'closed') {
      for (const pending of pendingRef.current.values()) {
        pending.reject(new Error(`WebSocket ${status}`))
      }
      pendingRef.current.clear()
    }
    onStatusChange?.(status)
  }, [onStatusChange])

  const { send } = useWebSocket(url, handlePayload, handleStatusChange)

  const request = useCallback((command: ClientRequest) => {
    return new Promise<ServerResponse>((resolve, reject) => {
      const requestId = crypto.randomUUID()
      // TODO should add timeout
      pendingRef.current.set(requestId, { resolve, reject })
      send({ ...command, requestId })
    })
  }, [send])

  return { request }
}
