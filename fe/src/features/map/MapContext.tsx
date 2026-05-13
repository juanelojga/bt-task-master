import { createContext, type RefObject } from 'react'
import type { Map } from 'maplibre-gl'

/**
 * Context providing the MapLibre map instance ref to descendant components.
 * Allows components like DetailPanel to project geographic coordinates
 * to screen pixels for dynamic positioning.
 */
export interface MapContextValue {
  mapRef: RefObject<Map | null>
  mapLoaded: boolean
}

export const MapContext = createContext<MapContextValue | null>(null)
