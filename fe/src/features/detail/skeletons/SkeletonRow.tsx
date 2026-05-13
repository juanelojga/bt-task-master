import React from 'react'

export function SkeletonRow(): React.ReactElement {
  return (
    <div className="flex justify-between py-1">
      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
    </div>
  )
}
