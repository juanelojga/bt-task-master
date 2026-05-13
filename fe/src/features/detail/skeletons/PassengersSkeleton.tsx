import React from 'react'
import { DetailSectionSkeleton } from './DetailSectionSkeleton.tsx'
import { SkeletonRow } from './SkeletonRow.tsx'

export function PassengersSkeleton(): React.ReactElement {
  return (
    <DetailSectionSkeleton title="Passengers">
      <SkeletonRow />
      <div className="mt-2">
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
      </div>
    </DetailSectionSkeleton>
  )
}
