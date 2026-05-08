import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { MapConfig } from '../../types/map.ts'

interface MapContainerProps {
  config: MapConfig
}

function MapContainer({ config }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: config.style.url,
      center: [config.center.lng, config.center.lat],
      zoom: config.zoom,
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [config])

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}

export default MapContainer
