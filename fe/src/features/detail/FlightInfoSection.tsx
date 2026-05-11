import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailRow } from './DetailRow.tsx'
import { DetailSection } from './DetailSection.tsx'

export function FlightInfoSection({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <DetailSection title="Flight Information">
      <DetailRow label="Flight Number" value={plane.flightNumber} />
      <DetailRow label="Airline" value={plane.airline} />
      <DetailRow label="Aircraft Model" value={plane.model} />
      <DetailRow label="Registration" value={plane.registration} />
      <DetailRow
        label="Status"
        value={plane.status.charAt(0).toUpperCase() + plane.status.slice(1)}
      />
    </DetailSection>
  )
}
