import React from 'react'
import { DetailSectionSkeleton } from './DetailSectionSkeleton.tsx'
import { SkeletonRow } from './SkeletonRow.tsx'

export function PositionSkeleton(): React.ReactElement {
  return (
    <DetailSectionSkeleton title="Position">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </DetailSectionSkeleton>
  )
}
