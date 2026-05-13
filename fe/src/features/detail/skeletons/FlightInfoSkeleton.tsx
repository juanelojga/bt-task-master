import React from 'react'
import { DetailSectionSkeleton } from './DetailSectionSkeleton.tsx'
import { SkeletonRow } from './SkeletonRow.tsx'

export function FlightInfoSkeleton(): React.ReactElement {
  return (
    <DetailSectionSkeleton title="Flight Information">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </DetailSectionSkeleton>
  )
}
