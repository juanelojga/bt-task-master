import React from 'react'
import type { PlaneDetailed } from '../../types/domain.ts'
import { FlightInfoSection } from './FlightInfoSection.tsx'
import { RouteSection } from './RouteSection.tsx'
import { PositionSection } from './PositionSection.tsx'
import { FlightTimeSection } from './FlightTimeSection.tsx'
import { PassengersSection } from './PassengersSection.tsx'
import { SkeletonBlock } from './SkeletonBlock.tsx'

export function DetailPanelContent({
  plane,
}: {
  plane: PlaneDetailed | null
}): React.ReactElement {
  return (
    <div className="h-[calc(100%-60px)] overflow-y-auto px-4">
      {plane === null ? (
        <>
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </>
      ) : (
        <>
          <FlightInfoSection plane={plane} />
          <RouteSection plane={plane} />
          <PositionSection plane={plane} />
          <FlightTimeSection plane={plane} />
          <PassengersSection plane={plane} />
        </>
      )}
    </div>
  )
}
