import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { DetailRow } from './DetailRow.tsx'
import { DetailSection } from './DetailSection.tsx'
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  formatVerticalSpeed,
  formatPosition,
} from './utils/format.ts'

export function PositionSection({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <DetailSection title="Position">
      <DetailRow
        label="Coordinates"
        value={formatPosition(plane.latitude, plane.longitude)}
      />
      <DetailRow label="Altitude" value={formatAltitude(plane.altitude)} />
      <DetailRow label="Speed" value={formatSpeed(plane.speed)} />
      <DetailRow label="Heading" value={formatHeading(plane.heading)} />
      <DetailRow
        label="Vertical Speed"
        value={formatVerticalSpeed(plane.verticalSpeed)}
      />
    </DetailSection>
  )
}
