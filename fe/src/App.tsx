import { MapView } from './features/map/MapView.tsx'
import { DetailPanel } from './features/detail/DetailPanel.tsx'
import { NoticeToast } from './features/ui/NoticeToast.tsx'
import { ConnectionBanner } from './features/ui/ConnectionBanner.tsx'
import { useBasicWebSocket } from './lib/hooks/useBasicWebSocket.ts'
import { useDetailWebSocket } from './lib/hooks/useDetailWebSocket.ts'
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
    <div className="relative h-screen w-screen overflow-hidden">
      <ConnectionBanner />
      <MapView config={defaultConfig} />
      <DetailPanel />
      <NoticeToast />
    </div>
  )
}

export default App
