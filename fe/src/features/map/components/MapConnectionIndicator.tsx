import React from 'react'
import type { ConnectionStatus } from '../../../types/domain.ts'
import { deriveAggregateStatus } from '../utils/connection.ts'

interface MapConnectionIndicatorProps {
  basicStatus: ConnectionStatus
  detailsStatus: ConnectionStatus
}

/**
 * MapConnectionIndicator is the single connection status indicator for the
 * entire map view. It shows when either the basic or details WebSocket is
 * not connected. The DetailPanelHeader no longer carries its own indicator
 * since it is part of the MapView and covered by this single indicator.
 */
export function MapConnectionIndicator({
  basicStatus,
  detailsStatus,
}: MapConnectionIndicatorProps): React.ReactElement | null {
  const status = deriveAggregateStatus(basicStatus, detailsStatus)

  if (status === 'connected') {
    return null
  }

  const isConnecting = status === 'connecting'

  return (
    <div className="absolute bottom-4 right-4 z-40">
      <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 shadow-lg">
        <span
          className={`h-2 w-2 rounded-full ${
            isConnecting ? 'animate-pulse bg-amber-400' : 'bg-red-400'
          }`}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-white">
          {isConnecting ? 'Reconnecting…' : 'Connection lost'}
        </span>
      </div>
    </div>
  )
}
