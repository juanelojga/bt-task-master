import React from 'react'
import { DetailSectionSkeleton } from './DetailSectionSkeleton.tsx'

export function RouteSkeleton(): React.ReactElement {
  return (
    <DetailSectionSkeleton title="Route">
      <div className="flex items-center justify-between py-2">
        <div className="text-center">
          <div className="mx-auto h-6 w-12 animate-pulse rounded bg-slate-200" />
          <div className="mx-auto mt-1 h-3 w-16 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="px-2">
          <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="text-center">
          <div className="mx-auto h-6 w-12 animate-pulse rounded bg-slate-200" />
          <div className="mx-auto mt-1 h-3 w-16 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </DetailSectionSkeleton>
  )
}
