import { useEffect, useRef } from 'react'
import type { Map } from 'maplibre-gl'
import type { FeatureCollection, Feature, Point } from 'geojson'
import type { PlaneBasic } from '../../types/domain.ts'

const PLANES_SOURCE_ID = 'planes'
const PLANES_LAYER_ID = 'planes'

/**
 * Converts PlaneBasic array to GeoJSON FeatureCollection
 */
function planesToFeatureCollection(planes: PlaneBasic[]): FeatureCollection {
  const features: Feature<Point>[] = planes.map((plane) => ({
    type: 'Feature',
    id: plane.id,
    geometry: {
      type: 'Point',
      coordinates: [plane.longitude, plane.latitude],
    },
    properties: {
      id: plane.id,
      color: plane.color,
      altitude: plane.altitude,
    },
  }))

  return {
    type: 'FeatureCollection',
    features,
  }
}

/**
 * Hook that binds plane data to a MapLibre GeoJSON source
 * Creates the source and circle layer on mount, updates data on planes change
 */
export function useMapMarkers(
  mapRef: React.RefObject<Map | null>,
  mapLoadedRef: React.RefObject<boolean>,
  planes: PlaneBasic[]
): void {
  const sourceAddedRef = useRef(false)

  // Add source and layer when map is loaded
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoadedRef.current) return

    // Add source if it doesn't exist
    if (!map.getSource(PLANES_SOURCE_ID)) {
      map.addSource(PLANES_SOURCE_ID, {
        type: 'geojson',
        data: planesToFeatureCollection(planes),
      })
      sourceAddedRef.current = true
    }

    // Add layer if it doesn't exist
    if (!map.getLayer(PLANES_LAYER_ID)) {
      map.addLayer({
        id: PLANES_LAYER_ID,
        type: 'circle',
        source: PLANES_SOURCE_ID,
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })
    }

    // Cleanup on unmount
    return () => {
      if (map.getLayer(PLANES_LAYER_ID)) {
        map.removeLayer(PLANES_LAYER_ID)
      }
      if (map.getSource(PLANES_SOURCE_ID)) {
        map.removeSource(PLANES_SOURCE_ID)
      }
      sourceAddedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, mapLoadedRef])

  // Update source data when planes change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !sourceAddedRef.current) return

    const source = map.getSource(PLANES_SOURCE_ID) as
      | { setData: (data: unknown) => void }
      | undefined
    if (source) {
      source.setData(planesToFeatureCollection(planes))
    }
  }, [mapRef, planes])
}
