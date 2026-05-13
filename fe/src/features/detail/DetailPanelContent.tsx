import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { FlightInfoSection } from './FlightInfoSection.tsx'
import { RouteSection } from './RouteSection.tsx'
import { PositionSection } from './PositionSection.tsx'
import { FlightTimeSection } from './FlightTimeSection.tsx'
import { PassengersSection } from './PassengersSection.tsx'
import {
  FlightInfoSkeleton,
  RouteSkeleton,
  PositionSkeleton,
  FlightTimeSkeleton,
  PassengersSkeleton,
} from './skeletons/index.ts'

interface DetailPanelContentProps {
  plane: PlaneDetailed | null
  selectedPlaneId: string | null
}

export function DetailPanelContent({
  plane,
  selectedPlaneId,
}: DetailPanelContentProps): React.ReactElement {
  const showSkeletons = selectedPlaneId !== null && plane === null

  return (
    <div className="h-[calc(100%-60px)] overflow-y-auto px-4 pb-6">
      {showSkeletons ? (
        <>
          <FlightInfoSkeleton />
          <RouteSkeleton />
          <PositionSkeleton />
          <FlightTimeSkeleton />
          <PassengersSkeleton />
        </>
      ) : plane !== null ? (
        <>
          <FlightInfoSection plane={plane} />
          <RouteSection plane={plane} />
          <PositionSection plane={plane} />
          <FlightTimeSection plane={plane} />
          <PassengersSection plane={plane} />
        </>
      ) : null}
    </div>
  )
}
