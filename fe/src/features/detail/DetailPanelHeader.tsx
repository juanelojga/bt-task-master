import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'

export interface DetailPanelHeaderProps {
  plane: PlaneDetailed | null
  onClose: () => void
}

/**
 * DetailPanelHeader displays the header section of the detail panel.
 * Shows flight number, airline, and color bar when plane data is available,
 * or a skeleton placeholder while loading.
 */
export function DetailPanelHeader({
  plane,
  onClose,
}: DetailPanelHeaderProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <div className="flex items-center gap-3">
        {plane !== null ? (
          <>
            <div
              className="h-8 w-1 rounded"
              style={{ backgroundColor: plane.color }}
            />
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {plane.flightNumber}
              </h2>
              <p className="text-sm text-slate-500">{plane.airline}</p>
            </div>
          </>
        ) : (
          <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
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
  )
}
