import type { Map, MapMouseEvent } from 'maplibre-gl'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

const PLANES_LAYER_ID = 'planes'

/**
 * Creates a click handler for plane selection/deselection on the map.
 * Clicking a plane feature selects it; clicking the already-selected
 * plane deselects it.
 */
export function createClickHandler(map: Map): (e: MapMouseEvent) => void {
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

/**
 * Creates mouseenter/mouseleave handlers that change the cursor
 * to a pointer when hovering over a plane feature.
 */
export function createHoverHandlers(map: Map): {
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
