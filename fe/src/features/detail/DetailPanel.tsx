import React from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'
import { DetailPanelContent } from './DetailPanelContent.tsx'

/**
 * DetailPanel displays detailed flight information for the selected plane.
 * Slides in from the right when a plane is selected, with loading skeleton
 * while waiting for data.
 */
export function DetailPanel(): React.ReactElement | null {
  const selectedPlaneId = useFlightStore((state) => state.selectedPlaneId)
  const detailedPlane = useFlightStore((state) => state.detailedPlane)
  const deselectPlane = useFlightStore((state) => state.deselectPlane)

  const isOpen = selectedPlaneId !== null

  const handleClose = (): void => {
    deselectPlane()
  }

  return (
    <div
      className={`fixed right-0 top-0 z-40 h-full w-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-[350px] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {detailedPlane && (
            <>
              <div
                className="h-8 w-1 rounded"
                style={{ backgroundColor: detailedPlane.color }}
              />
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {detailedPlane.flightNumber}
                </h2>
                <p className="text-sm text-slate-500">
                  {detailedPlane.airline}
                </p>
              </div>
            </>
          )}
          {!detailedPlane && (
            <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
          )}
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close detail panel"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <DetailPanelContent plane={detailedPlane} />
    </div>
  )
}
