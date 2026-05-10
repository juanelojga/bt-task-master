import { useEffect, useRef } from 'react'
import type { Map } from 'maplibre-gl'
import { createEmptyFeatureCollection } from '../utils/geojson.ts'

const SELECTED_SOURCE_ID = 'selected-plane'
const SELECTED_LAYER_ID = 'selected-plane'

/**
 * Hook that manages the lifecycle of the selected-plane GeoJSON source
 * and circle layer on the MapLibre map.
 *
 * Returns a ref that indicates whether the source has been added,
 * so downstream hooks can use it as a readiness gate.
 */
export function useMapSelectionLayer(
  mapRef: React.RefObject<Map | null>,
  mapLoaded: boolean
): React.MutableRefObject<boolean> {
  const sourceAddedRef = useRef(false)

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    if (!map.getSource(SELECTED_SOURCE_ID)) {
      map.addSource(SELECTED_SOURCE_ID, {
        type: 'geojson',
        data: createEmptyFeatureCollection(),
      })
      sourceAddedRef.current = true
    }

    if (!map.getLayer(SELECTED_LAYER_ID)) {
      map.addLayer({
        id: SELECTED_LAYER_ID,
        type: 'circle',
        source: SELECTED_SOURCE_ID,
        paint: {
          'circle-radius': 20,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.5,
          'circle-stroke-width': 6,
          'circle-stroke-color': '#FFD700',
          'circle-stroke-opacity': 1,
        },
      })
    }

    return () => {
      if (map.getLayer(SELECTED_LAYER_ID)) {
        map.removeLayer(SELECTED_LAYER_ID)
      }
      if (map.getSource(SELECTED_SOURCE_ID)) {
        map.removeSource(SELECTED_SOURCE_ID)
      }
      sourceAddedRef.current = false
    }
  }, [mapRef, mapLoaded])

  return sourceAddedRef
}
