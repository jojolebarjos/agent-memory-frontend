import { useCallback, useEffect, useRef } from 'react'

export type WebSocketStatus =
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error'

export function useWebSocket(
  url: string,
  onPayload: (payload: unknown) => void,
  onStatusChange?: (status: WebSocketStatus) => void,
) {
  const webSocketRef = useRef<WebSocket | null>(null)
  const onPayloadRef = useRef(onPayload)
  const onStatusChangeRef = useRef(onStatusChange)

  useEffect(() => { onPayloadRef.current = onPayload }, [onPayload])
  useEffect(() => { onStatusChangeRef.current = onStatusChange }, [onStatusChange])

  useEffect(() => {
    const webSocket = new WebSocket(url)
    webSocketRef.current = webSocket

    webSocket.onopen = () => onStatusChangeRef.current?.('open')
    webSocket.onclose = () => onStatusChangeRef.current?.('closed')
    webSocket.onerror = () => onStatusChangeRef.current?.('error')
    webSocket.onmessage = (e) => {
      try {
        onPayloadRef.current(JSON.parse(e.data))
      }
      catch {
        console.error('Failed to parse WebSocket payload', e.data)
      }
    }

    return () => webSocket.close()
  }, [url])

  const send = useCallback((payload: unknown) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify(payload))
    } else {
      console.warn('Attempted to send while socket not open', payload)
    }
  }, [])

  return { send }
}
