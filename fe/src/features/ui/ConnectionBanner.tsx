import React, { useState, useEffect, useRef } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'

const DISPLAY_DELAY_MS = 1000

/**
 * ConnectionBanner displays a non-intrusive banner at the top of the map
 * when the basic WebSocket connection is reconnecting or disconnected.
 * Shows "Reconnecting…" with animated indicator for 'connecting' state,
 * and "Connection lost" for 'disconnected' state.
 * Includes a 1-second delay to avoid flickering on brief disconnects.
 */
export function ConnectionBanner(): React.ReactElement | null {
  const basicStatus = useFlightStore((state) => state.connectionStatus.basic)
  const [showBanner, setShowBanner] = useState(false)
  const statusRef = useRef(basicStatus)

  // Keep ref in sync without triggering re-renders
  useEffect(() => {
    statusRef.current = basicStatus
  })

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null

    const updateBanner = (): void => {
      const currentStatus = statusRef.current

      if (currentStatus === 'connected') {
        // Hide when connected
        setShowBanner(false)
      } else {
        // Show for non-connected states
        setShowBanner(true)
      }
    }

    if (basicStatus === 'connected') {
      // Hide immediately when connected
      updateBanner()
    } else {
      // Delay showing banner to avoid flickering on brief disconnects
      timerId = setTimeout(updateBanner, DISPLAY_DELAY_MS)
    }

    return () => {
      if (timerId !== null) {
        clearTimeout(timerId)
      }
    }
  }, [basicStatus])

  if (!showBanner) {
    return null
  }

  const isConnecting = basicStatus === 'connecting'

  return (
    <div
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center gap-2 bg-slate-800 px-4 py-2 text-white shadow-md"
      role="status"
      aria-live="polite"
      aria-label={isConnecting ? 'Reconnecting' : 'Connection lost'}
    >
      {isConnecting ? (
        <>
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-green-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Reconnecting…</span>
        </>
      ) : (
        <>
          <span
            className="h-2 w-2 rounded-full bg-red-400"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Connection lost</span>
        </>
      )}
    </div>
  )
}
