import React, { useContext, useEffect, useState } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'
import { DetailPanelHeader } from './DetailPanelHeader.tsx'
import { DetailPanelContent } from './DetailPanelContent.tsx'
import { MapContext } from '../map/MapContext.tsx'
import {
  calculatePanelPosition,
  type PanelPosition,
} from './utils/panelPosition.ts'

const PANEL_WIDTH = 350

/**
 * DetailPanel displays detailed flight information for the selected plane.
 *
 * Desktop (md+): full-height sidebar dynamically placed on the left or right
 * edge so the selected plane remains visible on the map. Position is
 * recalculated when the plane moves, the map pans, or the window resizes.
 *
 * Mobile (<md): bottom sheet (same behavior as before).
 *
 * Includes a backdrop overlay that dims the map.
 */
export function DetailPanel(): React.ReactElement | null {
  const selectedPlaneId = useFlightStore((state) => state.selectedPlaneId)
  const detailedPlane = useFlightStore((state) => state.detailedPlane)
  const deselectPlane = useFlightStore((state) => state.deselectPlane)

  const mapContext = useContext(MapContext)
  const mapRef = mapContext?.mapRef ?? null
  const mapLoaded = mapContext?.mapLoaded ?? false

  const [panelPosition, setPanelPosition] = useState<PanelPosition>('right')

  const isOpen = selectedPlaneId !== null

  // Recalculate panel position when detailedPlane or mapLoaded changes
  useEffect(() => {
    const map = mapRef?.current ?? null

    if (!map || !mapLoaded || !detailedPlane) {
      return
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (viewportWidth < 768) {
      return
    }

    const position = calculatePanelPosition({
      planeLat: detailedPlane.latitude,
      planeLng: detailedPlane.longitude,
      viewportWidth,
      viewportHeight,
      panelWidth: PANEL_WIDTH,
      project: (lngLat) => map.project(lngLat),
    })

    setPanelPosition(position)
  }, [mapRef, mapLoaded, detailedPlane])

  // Listen to map move events for repositioning on pan/zoom
  useEffect(() => {
    const map = mapRef?.current ?? null
    if (!map) return

    const handleMove = (): void => {
      if (!mapLoaded || !detailedPlane) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (viewportWidth < 768) return

      const position = calculatePanelPosition({
        planeLat: detailedPlane.latitude,
        planeLng: detailedPlane.longitude,
        viewportWidth,
        viewportHeight,
        panelWidth: PANEL_WIDTH,
        project: (lngLat) => map.project(lngLat),
      })

      setPanelPosition(position)
    }

    map.on('move', handleMove)

    return () => {
      map.off('move', handleMove)
    }
  }, [mapRef, mapLoaded, detailedPlane])

  // Listen to window resize
  useEffect(() => {
    const handleResize = (): void => {
      const map = mapRef?.current ?? null
      if (!map || !mapLoaded || !detailedPlane) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (viewportWidth < 768) return

      const position = calculatePanelPosition({
        planeLat: detailedPlane.latitude,
        planeLng: detailedPlane.longitude,
        viewportWidth,
        viewportHeight,
        panelWidth: PANEL_WIDTH,
        project: (lngLat) => map.project(lngLat),
      })

      setPanelPosition(position)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [mapRef, mapLoaded, detailedPlane])

  const handleClose = (): void => {
    deselectPlane()
  }

  const handleBackdropClick = (): void => {
    deselectPlane()
  }

  // Determine desktop edge classes based on calculated position
  const isPanelLeft = panelPosition === 'left'

  // Desktop: panel slides from the chosen edge
  // Mobile: bottom sheet (same as before)
  const panelContainerClasses = [
    'fixed',
    'z-40',
    'bg-white',
    'shadow-xl',
    'transition-all',
    'duration-300',
    'ease-in-out',
    // Mobile bottom sheet
    'bottom-0',
    'left-0',
    'right-0',
    'max-h-[50vh]',
    'w-full',
    // Desktop: full-height sidebar
    'md:top-0',
    'md:h-full',
    'md:w-[350px]',
    // Desktop edge: left or right
    isPanelLeft ? 'md:left-0' : 'md:right-0',
    // Visibility + animation
    isOpen
      ? `visible translate-y-0 opacity-100 ${
          isPanelLeft ? 'md:-translate-x-0' : 'md:translate-x-0'
        }`
      : `invisible translate-y-full opacity-0 ${
          isPanelLeft ? 'md:-translate-x-full' : 'md:translate-x-full'
        }`,
  ].join(' ')

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
      {/* Panel container */}
      <div
        className={panelContainerClasses}
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
