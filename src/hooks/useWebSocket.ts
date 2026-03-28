import { useEffect, useRef, useCallback } from 'react'

export type WebSocketStatus =
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error'

// TODO rename "Message" to avoid confusion with actual messages

export function useWebSocket(
  url: string,
  onMessage: (msg: unknown) => void,
  onStatusChange?: (status: WebSocketStatus) => void,
) {
  const webSocketRef = useRef<WebSocket | null>(null)
  const onMessageRef = useRef(onMessage)
  const onStatusChangeRef = useRef(onStatusChange)

  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])
  useEffect(() => { onStatusChangeRef.current = onStatusChange }, [onStatusChange])

  useEffect(() => {
    const webSocket = new WebSocket(url)
    webSocketRef.current = webSocket

    webSocket.onopen = () => onStatusChangeRef.current?.('open')
    webSocket.onclose = () => onStatusChangeRef.current?.('closed')
    webSocket.onerror = () => onStatusChangeRef.current?.('error')
    webSocket.onmessage = (e) => {
      try {
        onMessageRef.current(JSON.parse(e.data))
      }
      catch {
        console.error('Failed to parse server message', e.data)
      }
    }

    return () => webSocket.close()
  }, [url])

  const send = useCallback((msg: unknown) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify(msg))
    } else {
      console.warn('Attempted to send while socket not open', msg)
    }
  }, [])

  return { send }
}
