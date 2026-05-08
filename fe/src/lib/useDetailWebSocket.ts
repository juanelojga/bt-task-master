import { useEffect, useRef } from 'react'
import { useFlightStore } from '../features/store/useFlightStore.ts'
import { WebSocketService } from './websocketService.ts'
import {
  wsDetailsUrl,
  wsReconnectInitialDelay,
  wsReconnectMaxDelay,
  wsReconnectMaxAttempts,
} from '../config.ts'
import type { IncomingWsMessage } from '../types/domain.ts'

/**
 * Hook that manages the plane details WebSocket connection
 * Opens when a plane is selected, closes on deselect
 * Handles subscription, plane switching, and error codes
 */
export function useDetailWebSocket(): void {
  const serviceRef = useRef<WebSocketService | null>(null)

  // Get individual store values to avoid object identity issues
  const selectedPlaneId = useFlightStore((state) => state.selectedPlaneId)
  const setConnectionStatus = useFlightStore(
    (state) => state.setConnectionStatus
  )
  const setDetailedPlane = useFlightStore((state) => state.setDetailedPlane)
  const deselectPlane = useFlightStore((state) => state.deselectPlane)
  const setError = useFlightStore((state) => state.setError)
  const clearError = useFlightStore((state) => state.clearError)

  // Store values in refs for callbacks
  const selectedPlaneIdRef = useRef(selectedPlaneId)

  // Main effect to manage connection based on selectedPlaneId
  useEffect(() => {
    // Update ref inside effect to avoid React's ref-during-render warning
    selectedPlaneIdRef.current = selectedPlaneId
    // Only connect if a plane is selected
    if (selectedPlaneId === null) {
      // Clean up existing service if any
      if (serviceRef.current) {
        serviceRef.current.disconnect()
        serviceRef.current = null
        setConnectionStatus('details', 'disconnected')
      }
      return
    }

    // If we already have a service, just send new subscribe for plane switch
    if (serviceRef.current) {
      serviceRef.current.send({
        type: 'subscribe',
        planeId: selectedPlaneId,
      })
      return
    }

    // Create new service
    setConnectionStatus('details', 'connecting')

    const service = new WebSocketService({
      url: wsDetailsUrl,
      onOpen: () => {
        setConnectionStatus('details', 'connected')
        // Send subscribe for the selected plane
        const currentPlaneId = selectedPlaneIdRef.current
        if (currentPlaneId) {
          service.send({
            type: 'subscribe',
            planeId: currentPlaneId,
          })
        }
      },
      onClose: (code: number) => {
        setConnectionStatus('details', 'disconnected')

        // Handle close code 1008 - invalid subscription
        if (code === 1008) {
          deselectPlane()
          setError('Plane not found or subscription invalid')
          serviceRef.current = null
        }
      },
      onMessage: (message: IncomingWsMessage) => {
        if (message.type === 'plane-details') {
          // Only accept if IDs match
          if (message.data.id === selectedPlaneIdRef.current) {
            setDetailedPlane(message.data)
            clearError()
          }
        } else if (message.type === 'error') {
          setError(message.message)
        }
      },
      onError: () => {
        // Connection errors are handled via onClose
      },
      reconnectInitialDelay: wsReconnectInitialDelay,
      reconnectMaxDelay: wsReconnectMaxDelay,
      reconnectMaxAttempts: wsReconnectMaxAttempts,
    })

    serviceRef.current = service
    service.connect()

    // Return cleanup function
    return () => {
      // Cleanup is called on re-render and unmount
      // We disconnect when selectedPlaneId is null (checked via closure, not ref)
      if (selectedPlaneId === null && serviceRef.current) {
        serviceRef.current.disconnect()
        serviceRef.current = null
      }
    }
  }, [
    selectedPlaneId,
    setConnectionStatus,
    setDetailedPlane,
    deselectPlane,
    setError,
    clearError,
  ])

  // Effect to handle max attempts exhaustion
  useEffect(() => {
    const service = serviceRef.current
    if (!service || selectedPlaneId === null) return

    // Check periodically if reconnection has given up
    const intervalId = setInterval(() => {
      // If service is disconnected and we still have a selected plane,
      // it means reconnection has given up
      if (
        service.state === 'disconnected' &&
        selectedPlaneIdRef.current !== null
      ) {
        deselectPlane()
        setError('Unable to reconnect to flight details')
        serviceRef.current = null
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [selectedPlaneId, deselectPlane, setError])
}
