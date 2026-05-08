import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import {
  usePlanes,
  useSelectedPlaneId,
  useDetailedPlane,
} from '../store/useFlightSelectors.ts'
import { useMapMarkers } from './useMapMarkers.ts'
import { useMapSelection } from './useMapSelection.ts'
import type { MapConfig } from '../../types/map.ts'

interface MapViewProps {
  config: MapConfig
}

export function MapView({ config }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const planes = usePlanes()
  const selectedPlaneId = useSelectedPlaneId()
  const detailedPlane = useDetailedPlane()

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: config.style.url,
      center: [config.center.lng, config.center.lat],
      zoom: config.zoom,
    })

    mapRef.current = map

    map.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      setMapLoaded(false)
      map.remove()
      mapRef.current = null
    }
  }, [config])

  // Bind map markers hook
  useMapMarkers(mapRef, mapLoaded, planes)

  // Bind map selection hook
  useMapSelection(mapRef, mapLoaded, selectedPlaneId, planes, detailedPlane)

  return <div ref={containerRef} className="w-full h-full" />
}
