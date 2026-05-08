import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { Map, Marker, MapMouseEvent } from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import { useFlightStore } from '../store/useFlightStore.ts'
import type { PlaneBasic, PlaneDetailed } from '../../types/domain.ts'

const SELECTED_SOURCE_ID = 'selected-plane'
const SELECTED_LAYER_ID = 'selected-plane'
const PLANES_LAYER_ID = 'planes'

/**
 * Creates a GeoJSON FeatureCollection for a single selected plane
 */
function createSelectedFeature(plane: PlaneBasic): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
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
      },
    ],
  }
}

/**
 * Creates an empty FeatureCollection
 */
function createEmptyFeatureCollection(): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}

/**
 * Hook that manages map selection interaction
 * - Highlights selected plane with a distinct circle layer
 * - Adds rotated HTML marker for heading indication
 * - Handles click to select/deselect
 * - Changes cursor on hover
 */
export function useMapSelection(
  mapRef: React.RefObject<Map | null>,
  mapLoaded: boolean,
  selectedPlaneId: string | null,
  planes: PlaneBasic[],
  detailedPlane: PlaneDetailed | null
): void {
  const markerRef = useRef<Marker | null>(null)
  const sourceAddedRef = useRef(false)
  const clickHandlerRef = useRef<((e: MapMouseEvent) => void) | null>(null)
  const mouseEnterHandlerRef = useRef<(() => void) | null>(null)
  const mouseLeaveHandlerRef = useRef<(() => void) | null>(null)

  // Initialize source and layer
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Add source if it doesn't exist
    if (!map.getSource(SELECTED_SOURCE_ID)) {
      map.addSource(SELECTED_SOURCE_ID, {
        type: 'geojson',
        data: createEmptyFeatureCollection(),
      })
      sourceAddedRef.current = true
    }

    // Add layer if it doesn't exist (draws on top of planes layer)
    if (!map.getLayer(SELECTED_LAYER_ID)) {
      map.addLayer({
        id: SELECTED_LAYER_ID,
        type: 'circle',
        source: SELECTED_SOURCE_ID,
        paint: {
          'circle-radius': 14,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 4,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8,
        },
      })
    }

    return () => {
      // Remove event handlers
      if (clickHandlerRef.current) {
        map.off('click', PLANES_LAYER_ID, clickHandlerRef.current)
      }
      if (mouseEnterHandlerRef.current) {
        map.off('mouseenter', PLANES_LAYER_ID, mouseEnterHandlerRef.current)
      }
      if (mouseLeaveHandlerRef.current) {
        map.off('mouseleave', PLANES_LAYER_ID, mouseLeaveHandlerRef.current)
      }

      // Remove marker
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }

      // Remove layer and source
      if (map.getLayer(SELECTED_LAYER_ID)) {
        map.removeLayer(SELECTED_LAYER_ID)
      }
      if (map.getSource(SELECTED_SOURCE_ID)) {
        map.removeSource(SELECTED_SOURCE_ID)
      }
      sourceAddedRef.current = false
    }
  }, [mapRef, mapLoaded])

  // Update selection highlight and marker based on selectedPlaneId
  useEffect(() => {
    const map = mapRef.current
    if (!map || !sourceAddedRef.current) return

    const source = map.getSource(SELECTED_SOURCE_ID) as
      | { setData: (data: unknown) => void }
      | undefined
    if (!source) return

    if (selectedPlaneId === null) {
      // Clear selection
      source.setData(createEmptyFeatureCollection())

      // Remove marker
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    // Find selected plane in planes array
    const selectedPlane = planes.find((p) => p.id === selectedPlaneId)
    if (!selectedPlane) {
      // Plane not found, clear selection
      source.setData(createEmptyFeatureCollection())
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    // Update selected source
    source.setData(createSelectedFeature(selectedPlane))

    // Update or create rotated marker with heading
    if (detailedPlane && detailedPlane.heading !== undefined) {
      const heading = detailedPlane.heading

      // Create marker element
      const el = document.createElement('div')
      el.className = 'plane-marker'
      el.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4.5 20.29L12 17L19.5 20.29L12 2Z" fill="${selectedPlane.color}" stroke="white" stroke-width="2"/>
      </svg>`
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.transform = `rotate(${heading}deg)`
      el.style.transformOrigin = 'center'
      el.style.pointerEvents = 'none'

      if (markerRef.current) {
        // Update existing marker
        markerRef.current.setLngLat([
          selectedPlane.longitude,
          selectedPlane.latitude,
        ])
        markerRef.current.getElement().innerHTML = el.innerHTML
        markerRef.current
          .getElement()
          .querySelector('svg')
          ?.style.setProperty('transform', `rotate(${heading}deg)`)
      } else {
        // Create new marker
        markerRef.current = new maplibregl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([selectedPlane.longitude, selectedPlane.latitude])
          .addTo(map)
      }
    } else {
      // No detailed data yet, remove marker but keep highlight
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [selectedPlaneId, planes, detailedPlane, mapRef])

  // Set up click handlers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    const selectPlane = useFlightStore.getState().selectPlane
    const deselectPlane = useFlightStore.getState().deselectPlane

    // Remove old handlers if they exist
    if (clickHandlerRef.current) {
      map.off('click', PLANES_LAYER_ID, clickHandlerRef.current)
    }
    if (mouseEnterHandlerRef.current) {
      map.off('mouseenter', PLANES_LAYER_ID, mouseEnterHandlerRef.current)
    }
    if (mouseLeaveHandlerRef.current) {
      map.off('mouseleave', PLANES_LAYER_ID, mouseLeaveHandlerRef.current)
    }

    // Click handler
    clickHandlerRef.current = (e: MapMouseEvent) => {
      // Query features at click point
      const features = map.queryRenderedFeatures(e.point, {
        layers: [PLANES_LAYER_ID],
      })
      if (features.length > 0) {
        const feature = features[0]
        const planeId = feature.id as string
        const currentSelectedId = useFlightStore.getState().selectedPlaneId

        if (planeId === currentSelectedId) {
          deselectPlane()
        } else {
          selectPlane(planeId)
        }
      }
    }

    // Cursor handlers
    mouseEnterHandlerRef.current = () => {
      map.getCanvas().style.cursor = 'pointer'
    }
    mouseLeaveHandlerRef.current = () => {
      map.getCanvas().style.cursor = ''
    }

    // Add handlers
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
