import React from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'
import { DetailPanelHeader } from './DetailPanelHeader.tsx'
import { DetailPanelContent } from './DetailPanelContent.tsx'

/**
 * DetailPanel displays detailed flight information for the selected plane.
 * Slides in from the right when a plane is selected, with loading skeleton
 * while waiting for data.
 */
export function DetailPanel(): React.ReactElement | null {
  const selectedPlaneId = useFlightStore((state) => state.selectedPlaneId)
  const detailedPlane = useFlightStore((state) => state.detailedPlane)
  const deselectPlane = useFlightStore((state) => state.deselectPlane)

  const isOpen = selectedPlaneId !== null

  const handleClose = (): void => {
    deselectPlane()
  }

  return (
    <div
      className={`fixed right-0 top-0 z-40 h-full w-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-[350px] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <DetailPanelHeader plane={detailedPlane} onClose={handleClose} />
      <DetailPanelContent plane={detailedPlane} />
    </div>
  )
}
