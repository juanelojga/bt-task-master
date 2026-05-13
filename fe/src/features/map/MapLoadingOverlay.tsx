import React from 'react'

interface MapLoadingOverlayProps {
  visible: boolean
}

/**
 * MapLoadingOverlay displays a centered loading indicator with "Loading map…" text
 * while the MapLibre map is initializing. Fades out when the map is loaded.
 */
export function MapLoadingOverlay({
  visible,
}: MapLoadingOverlayProps): React.ReactElement | null {
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
      role="status"
      aria-label="Loading map"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-pulse rounded-full bg-blue-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-6 w-6 animate-pulse text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">Loading map…</span>
      </div>
    </div>
  )
}
