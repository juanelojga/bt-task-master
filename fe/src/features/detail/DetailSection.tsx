import React from 'react'

interface DetailSectionProps {
  title: string
  children: React.ReactNode
}

export function DetailSection({
  title,
  children,
}: DetailSectionProps): React.ReactElement {
  return (
    <div className="border-t border-slate-200 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  )
}
