import React from 'react'
import { DetailSectionSkeleton } from './DetailSectionSkeleton.tsx'
import { SkeletonRow } from './SkeletonRow.tsx'

export function FlightTimeSkeleton(): React.ReactElement {
  return (
    <DetailSectionSkeleton title="Flight Time">
      <SkeletonRow />
      <SkeletonRow />
    </DetailSectionSkeleton>
  )
}
