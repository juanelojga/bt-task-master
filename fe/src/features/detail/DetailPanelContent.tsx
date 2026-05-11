import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { FlightInfoSection } from './FlightInfoSection.tsx'
import { RouteSection } from './RouteSection.tsx'
import { PositionSection } from './PositionSection.tsx'
import { FlightTimeSection } from './FlightTimeSection.tsx'
import { PassengersSection } from './PassengersSection.tsx'

export function DetailPanelContent({
  plane,
}: {
  plane: PlaneDetailed
}): React.ReactElement {
  return (
    <>
      <FlightInfoSection plane={plane} />
      <RouteSection plane={plane} />
      <PositionSection plane={plane} />
      <FlightTimeSection plane={plane} />
      <PassengersSection plane={plane} />
    </>
  )
}
