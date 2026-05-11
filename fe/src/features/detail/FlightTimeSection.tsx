import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailRow } from './DetailRow.tsx'
import { DetailSection } from './DetailSection.tsx'
import { formatDuration, formatArrivalTime } from './utils/format.ts'

export function FlightTimeSection({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <DetailSection title="Flight Time">
      <DetailRow
        label="Duration"
        value={formatDuration(plane.flightDuration)}
      />
      <DetailRow
        label="Estimated Arrival"
        value={formatArrivalTime(plane.estimatedArrival)}
      />
    </DetailSection>
  )
}
