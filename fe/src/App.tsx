import { MapView } from './features/map/MapView.tsx'
import { useBasicWebSocket } from './lib/useBasicWebSocket.ts'
import { useDetailWebSocket } from './lib/useDetailWebSocket.ts'
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

  return (
    <div className="h-screen w-screen">
      <MapView config={defaultConfig} />
    </div>
  )
}

export default App
