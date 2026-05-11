import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailRow } from './DetailRow.tsx'
import { DetailSection } from './DetailSection.tsx'
import { formatPassengers } from './utils/format.ts'

export function PassengersSection({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <DetailSection title="Passengers">
      <DetailRow
        label="Onboard"
        value={formatPassengers(plane.numberOfPassengers, plane.maxPassengers)}
      />
      <div className="mt-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${(plane.numberOfPassengers / plane.maxPassengers) * 100}%`,
            }}
          />
        </div>
      </div>
    </DetailSection>
  )
}
