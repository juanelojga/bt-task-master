import React from 'react'

export function SkeletonBlock(): React.ReactElement {
  return (
    <div className="space-y-3 py-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
    </div>
  )
}
