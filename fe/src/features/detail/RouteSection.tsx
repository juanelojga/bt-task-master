import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailSection } from './DetailSection.tsx'

export function RouteSection({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <DetailSection title="Route">
      <div className="flex items-center justify-between py-2">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800">
            {plane.origin.airport}
          </div>
          <div className="text-xs text-slate-500">{plane.origin.city}</div>
        </div>
        <div className="px-2 text-slate-400">
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800">
            {plane.destination.airport}
          </div>
          <div className="text-xs text-slate-500">{plane.destination.city}</div>
        </div>
      </div>
    </DetailSection>
  )
}
