import { useEffect, useRef } from 'react'
import type { Map, Marker } from 'maplibre-gl'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'
import {
  createSelectedFeature,
  createEmptyFeatureCollection,
} from '../utils/geojson.ts'
import { clearMarker, syncMarker } from '../utils/selection.ts'

const SELECTED_SOURCE_ID = 'selected-plane'

/**
 * Hook that updates the selected-plane GeoJSON source data and manages
 * the heading marker based on the current selection state.
 *
 * Prerequisites:
 * - `sourceAddedRef` must be true (set by useMapSelectionLayer)
 * - Source and layer must already exist on the map
 */
export function useMapSelectionState(
  mapRef: React.RefObject<Map | null>,
  sourceAddedRef: React.MutableRefObject<boolean>,
  selectedPlaneId: string | null,
  planes: PlaneBasic[],
  detailedPlane: PlaneDetailed | null
): void {
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (!map || !sourceAddedRef.current) return

    const source = map.getSource(SELECTED_SOURCE_ID) as
      | { setData: (data: unknown) => void }
      | undefined
    if (!source) return

    if (selectedPlaneId === null) {
      source.setData(createEmptyFeatureCollection())
      clearMarker(markerRef)
      return
    }

    const selectedPlane = planes.find((p) => p.id === selectedPlaneId)
    if (!selectedPlane) {
      source.setData(createEmptyFeatureCollection())
      clearMarker(markerRef)
      return
    }

    source.setData(createSelectedFeature(selectedPlane))

    if (detailedPlane && detailedPlane.heading !== undefined) {
      syncMarker(map, markerRef, selectedPlane, detailedPlane)
    } else {
      clearMarker(markerRef)
    }
  }, [selectedPlaneId, planes, detailedPlane, mapRef, sourceAddedRef])

  useEffect(() => () => clearMarker(markerRef), [])
}
