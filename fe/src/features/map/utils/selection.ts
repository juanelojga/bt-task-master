import maplibregl from 'maplibre-gl'
import type { Map, Marker } from 'maplibre-gl'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'
import { createMarkerElement, updateMarkerHeading } from './marker.ts'

/**
 * Removes a marker from the map and nullifies the ref.
 */
export function clearMarker(
  markerRef: React.MutableRefObject<Marker | null>
): void {
  if (markerRef.current) {
    markerRef.current.remove()
    markerRef.current = null
  }
}

/**
 * Creates or updates a heading marker on the map for the given plane.
 * If a marker already exists, its position and heading are updated.
 * Otherwise, a new marker is created and added to the map.
 */
export function syncMarker(
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
