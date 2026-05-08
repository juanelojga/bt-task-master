import MapContainer from './features/map/MapContainer.tsx'
import { useCount } from './features/store/useCount.ts'
import { useStore } from './features/store/useStore.ts'
import type { MapConfig } from './types/map.ts'

const defaultConfig: MapConfig = {
  center: { lng: -74.006, lat: 40.7128 },
  zoom: 10,
  style: {
    url: 'https://demotiles.maplibre.org/style.json',
  },
}

function App() {
  const count = useCount()
  const increment = useStore((state) => state.increment)
  const decrement = useStore((state) => state.decrement)

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="p-4 bg-white shadow flex items-center gap-4 z-10">
        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={decrement}
        >
          -
        </button>
        <span className="font-mono text-lg">{count}</span>
        <button
          type="button"
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={increment}
        >
          +
        </button>
      </div>
      <div className="flex-1">
        <MapContainer config={defaultConfig} />
      </div>
    </div>
  )
}

export default App
