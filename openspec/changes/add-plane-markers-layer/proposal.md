## Why

The map currently lacks a plane markers layer that visualizes aircraft positions in real time. Without this layer, users see an empty map with no indication of where planes are or how they move. This is the core visual feature of the flight radar — it must render all planes as colored circle markers on the map and update their positions as new data arrives from the WebSocket.

## What Changes

- Add a GeoJSON source (`planes`) and a `circle` layer (`planes`) to the MapLibre map, rendering all non-selected aircraft as colored circle markers
- Implement `planesToFeatureCollection` as an exported, independently testable utility in `features/map/utils/geojson.ts` that converts `PlaneBasic[]` to a GeoJSON `FeatureCollection`
- Wire the `planes` source to the flight store so that every time the `planes` array updates (via the basic WebSocket), the GeoJSON source data is refreshed via `setData`
- Use data-driven styling (`['get', 'color']`) so each circle's fill color matches the plane's `color` property
- Add unit tests for the GeoJSON conversion utility and hook tests for the marker binding logic

## Capabilities

### New Capabilities

_(None — this change fulfills the existing `plane-markers` spec)_

### Modified Capabilities

- `plane-markers`: Implementing the spec requirements that are currently unfulfilled — specifically the GeoJSON source, circle layer, store-driven data updates, and the `planesToFeatureCollection` utility with tests

## Impact

- **New files**: `fe/src/features/map/hooks/useMapMarkers.ts`, `fe/src/features/map/utils/geojson.ts`, plus corresponding test files in `__tests__/` directories
- **Modified files**: `fe/src/features/map/MapView.tsx` — integrate the `useMapMarkers` hook to bind the source and layer to the map instance
- **Dependencies**: Relies on `maplibre-gl` (already installed), the flight store (`useFlightStore` / `useFlightSelectors`), and the `PlaneBasic` type from `types/domain.ts`
- **No breaking changes** to existing APIs or components
