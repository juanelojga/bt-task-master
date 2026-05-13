import React from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'
import { DetailPanelHeader } from './DetailPanelHeader.tsx'
import { DetailPanelContent } from './DetailPanelContent.tsx'

/**
 * DetailPanel displays detailed flight information for the selected plane.
 * Slides in from the right on desktop (md breakpoint and above) or as a
 * bottom sheet on mobile when a plane is selected, with loading skeleton
 * while waiting for data. Includes a backdrop overlay that dims the map.
 */
export function DetailPanel(): React.ReactElement | null {
  const selectedPlaneId = useFlightStore((state) => state.selectedPlaneId)
  const detailedPlane = useFlightStore((state) => state.detailedPlane)
  const deselectPlane = useFlightStore((state) => state.deselectPlane)

  const isOpen = selectedPlaneId !== null

  const handleClose = (): void => {
    deselectPlane()
  }

  const handleBackdropClick = (): void => {
    deselectPlane()
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        data-testid="detail-panel-backdrop"
      />
      {/* Panel container - desktop: right-side panel, mobile: bottom sheet */}
      <div
        className={`fixed z-40 bg-white shadow-xl transition-all duration-300 ease-in-out bottom-0 left-0 right-0 max-h-[50vh] w-full md:right-0 md:top-0 md:h-full md:w-[350px] ${
          isOpen
            ? 'visible translate-y-0 opacity-100 md:translate-x-0'
            : 'invisible translate-y-full opacity-0 md:translate-x-full'
        }`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
      >
        <DetailPanelHeader plane={detailedPlane} onClose={handleClose} />
        <DetailPanelContent
          plane={detailedPlane}
          selectedPlaneId={selectedPlaneId}
        />
      </div>
    </>
  )
}
