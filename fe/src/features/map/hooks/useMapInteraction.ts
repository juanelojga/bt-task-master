import { useEffect, useRef } from 'react'
import type { Map, MapMouseEvent } from 'maplibre-gl'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

const PLANES_LAYER_ID = 'planes'

function createClickHandler(map: Map): (e: MapMouseEvent) => void {
  const selectPlane = useFlightStore.getState().selectPlane
  const deselectPlane = useFlightStore.getState().deselectPlane

  return (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [PLANES_LAYER_ID],
    })
    if (features.length === 0) return

    const feature = features[0]
    const planeId: unknown = feature?.properties?.id ?? feature?.id
    if (typeof planeId !== 'string') return

    const currentSelectedId = useFlightStore.getState().selectedPlaneId
    if (planeId === currentSelectedId) {
      deselectPlane()
    } else {
      selectPlane(planeId)
    }
  }
}

function createHoverHandlers(map: Map): {
  enter: () => void
  leave: () => void
} {
  return {
    enter: () => {
      map.getCanvas().style.cursor = 'pointer'
    },
    leave: () => {
      map.getCanvas().style.cursor = ''
    },
  }
}

/**
 * Hook that manages click-to-select/deselect and cursor hover
 * interactions on the planes layer.
 */
export function useMapInteraction(
  mapRef: React.RefObject<Map | null>,
  mapLoaded: boolean
): void {
  const clickHandlerRef = useRef<((e: MapMouseEvent) => void) | null>(null)
  const mouseEnterHandlerRef = useRef<(() => void) | null>(null)
  const mouseLeaveHandlerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Remove previous handlers before registering new ones
    if (clickHandlerRef.current) {
      map.off('click', PLANES_LAYER_ID, clickHandlerRef.current)
    }
    if (mouseEnterHandlerRef.current) {
      map.off('mouseenter', PLANES_LAYER_ID, mouseEnterHandlerRef.current)
    }
    if (mouseLeaveHandlerRef.current) {
      map.off('mouseleave', PLANES_LAYER_ID, mouseLeaveHandlerRef.current)
    }

    clickHandlerRef.current = createClickHandler(map)
    const hover = createHoverHandlers(map)
    mouseEnterHandlerRef.current = hover.enter
    mouseLeaveHandlerRef.current = hover.leave

    map.on('click', PLANES_LAYER_ID, clickHandlerRef.current)
    map.on('mouseenter', PLANES_LAYER_ID, mouseEnterHandlerRef.current)
    map.on('mouseleave', PLANES_LAYER_ID, mouseLeaveHandlerRef.current)

    return () => {
      if (clickHandlerRef.current) {
        map.off('click', PLANES_LAYER_ID, clickHandlerRef.current)
      }
      if (mouseEnterHandlerRef.current) {
        map.off('mouseenter', PLANES_LAYER_ID, mouseEnterHandlerRef.current)
      }
      if (mouseLeaveHandlerRef.current) {
        map.off('mouseleave', PLANES_LAYER_ID, mouseLeaveHandlerRef.current)
      }
    }
  }, [mapRef, mapLoaded])
}
