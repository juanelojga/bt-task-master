import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { Map, Marker } from 'maplibre-gl'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'
import {
  createSelectedFeature,
  createEmptyFeatureCollection,
} from '../utils/geojson.ts'
import { createMarkerElement, updateMarkerHeading } from '../utils/marker.ts'

const SELECTED_SOURCE_ID = 'selected-plane'

function clearMarker(markerRef: React.MutableRefObject<Marker | null>): void {
  if (markerRef.current) {
    markerRef.current.remove()
    markerRef.current = null
  }
}

function syncMarker(
  map: Map,
  markerRef: React.MutableRefObject<Marker | null>,
  plane: PlaneBasic,
  detailedPlane: PlaneDetailed
): void {
  const heading = detailedPlane.heading

  if (markerRef.current) {
    markerRef.current.setLngLat([plane.longitude, plane.latitude])
    const el = markerRef.current.getElement()
    el.innerHTML = createMarkerElement(plane.color, heading).innerHTML
    updateMarkerHeading(el, heading)
  } else {
    const el = createMarkerElement(plane.color, heading)
    markerRef.current = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([plane.longitude, plane.latitude])
      .addTo(map)
  }
}

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
