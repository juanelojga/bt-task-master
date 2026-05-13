import React, { useState, useEffect, useRef } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'

const DISPLAY_DELAY_MS = 1000

/**
 * ConnectionBanner displays a non-intrusive banner at the top of the map
 * when the basic WebSocket connection is reconnecting or disconnected.
 * Shows "Reconnecting…" with animated indicator for 'connecting' state,
 * and "Connection lost" for 'disconnected' state.
 * Includes a 1-second delay to avoid flickering on brief disconnects.
 * Animates in with slide-down and out with slide-up.
 */
export function ConnectionBanner(): React.ReactElement | null {
  const basicStatus = useFlightStore((state) => state.connectionStatus.basic)
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const statusRef = useRef(basicStatus)

  // Keep ref in sync without triggering re-renders
  useEffect(() => {
    statusRef.current = basicStatus
  })

  useEffect(() => {
    let showTimerId: ReturnType<typeof setTimeout> | null = null
    let hideTimerId: ReturnType<typeof setTimeout> | null = null

    const updateBanner = (): void => {
      const currentStatus = statusRef.current

      if (currentStatus === 'connected') {
        // Start hide animation
        setIsVisible(false)
        // Remove from DOM after animation
        hideTimerId = setTimeout(() => {
          setIsRendered(false)
        }, 200)
      } else {
        // Show banner
        setIsRendered(true)
        // Start show animation after DOM render
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      }
    }

    if (basicStatus === 'connected') {
      // Hide when connected
      updateBanner()
    } else {
      // Delay showing banner to avoid flickering on brief disconnects
      showTimerId = setTimeout(updateBanner, DISPLAY_DELAY_MS)
    }

    return () => {
      if (showTimerId !== null) {
        clearTimeout(showTimerId)
      }
      if (hideTimerId !== null) {
        clearTimeout(hideTimerId)
      }
    }
  }, [basicStatus])

  if (!isRendered) {
    return null
  }

  const isConnecting = basicStatus === 'connecting'

  return (
    <div
      className={`absolute left-0 right-0 top-0 z-40 flex transform items-center justify-center gap-2 bg-slate-800 px-4 py-2 text-white shadow-md transition-transform duration-200 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
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
