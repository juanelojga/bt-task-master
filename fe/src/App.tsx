import { useRef, useState } from 'react'
import type maplibregl from 'maplibre-gl'
import { MapView } from './features/map/MapView.tsx'
import { DetailPanel } from './features/detail/DetailPanel.tsx'
import { NoticeToast } from './features/ui/NoticeToast.tsx'
import { ConnectionBanner } from './features/ui/ConnectionBanner.tsx'
import { useBasicWebSocket } from './lib/hooks/useBasicWebSocket.ts'
import { useDetailWebSocket } from './lib/hooks/useDetailWebSocket.ts'
import { MapContext } from './features/map/MapContext.tsx'
import type { MapContextValue } from './features/map/MapContext.tsx'
import { mapStyleUrl, mapDefaultCenter, mapDefaultZoom } from './config.ts'
import type { MapConfig } from './types/map.ts'

const defaultConfig: MapConfig = {
  center: { lng: mapDefaultCenter[0], lat: mapDefaultCenter[1] },
  zoom: mapDefaultZoom,
  style: {
    url: mapStyleUrl,
  },
}

function App() {
  // Mount WebSocket hooks
  useBasicWebSocket()
  useDetailWebSocket()

  // Shared map ref and loaded state — filled by MapView, consumed by DetailPanel
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const contextValue: MapContextValue = { mapRef, mapLoaded }

  return (
    <MapContext.Provider value={contextValue}>
      <div className="relative h-screen w-screen overflow-hidden">
        <ConnectionBanner />
        <MapView
          config={defaultConfig}
          mapRef={mapRef}
          onMapLoaded={setMapLoaded}
        />
        <DetailPanel />
        <NoticeToast />
      </div>
    </MapContext.Provider>
  )
}

export default App
