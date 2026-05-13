import React from 'react'

interface DetailSectionSkeletonProps {
  title: string
  children: React.ReactNode
}

export function DetailSectionSkeleton({
  title,
  children,
}: DetailSectionSkeletonProps): React.ReactElement {
  return (
    <div className="border-t border-slate-200 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  )
}
