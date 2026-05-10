import { useEffect, useRef } from 'react'
import { useFlightStore } from '../../features/store/hooks/useFlightStore.ts'
import { WebSocketService } from '../websocketService.ts'
import {
  wsBasicUrl,
  wsReconnectInitialDelay,
  wsReconnectMaxDelay,
  wsReconnectMaxAttempts,
} from '../../config.ts'
import type { IncomingWsMessage } from '../../types/domain.ts'

/**
 * Hook that manages the basic planes WebSocket connection
 * Connects on mount, disconnects on unmount, and dispatches messages to the flight store
 */
export function useBasicWebSocket(): void {
  const storeRef = useRef({
    setConnectionStatus: useFlightStore((state) => state.setConnectionStatus),
    updatePlanes: useFlightStore((state) => state.updatePlanes),
    setError: useFlightStore((state) => state.setError),
  })

  useEffect(() => {
    const store = storeRef.current

    // Set connecting status
    store.setConnectionStatus('basic', 'connecting')

    // Create WebSocket service
    const service = new WebSocketService({
      url: wsBasicUrl,
      onOpen: () => {
        store.setConnectionStatus('basic', 'connected')
      },
      onClose: () => {
        store.setConnectionStatus('basic', 'disconnected')
      },
      onMessage: (message: IncomingWsMessage) => {
        if (message.type === 'planes') {
          store.updatePlanes(message.data)
        } else if (message.type === 'error') {
          store.setError(message.message)
        }
      },
      onError: () => {
        // Connection errors are handled via onClose
      },
      reconnectInitialDelay: wsReconnectInitialDelay,
      reconnectMaxDelay: wsReconnectMaxDelay,
      reconnectMaxAttempts: wsReconnectMaxAttempts,
    })

    // Connect
    service.connect()

    // Cleanup on unmount
    return () => {
      service.disconnect()
    }
  }, [])
}
