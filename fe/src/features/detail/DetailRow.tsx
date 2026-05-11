import React from 'react'

interface DetailRowProps {
  label: string
  value: string | number
}

export function DetailRow({
  label,
  value,
}: DetailRowProps): React.ReactElement {
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  )
}
