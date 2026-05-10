## Why

The map currently renders as a static MapLibre container (`MapContainer`) that displays tiles but shows no aircraft data. The flight store already holds live `planes` and `selectedPlaneId` state, and WebSocket hooks keep it updated — but none of this data reaches the map. We need a fully interactive MapView that visualizes planes as markers, highlights the selected plane, and lets users click markers to select planes — connecting the real-time data layer to the visual map layer.

## What Changes

- Replace the placeholder `MapContainer` with a `MapView` component that subscribes to the flight store and renders plane positions as a GeoJSON circle layer
- Add a `useMapMarkers` hook that converts `PlaneBasic[]` to GeoJSON `FeatureCollection` and keeps the map source updated on every store change
- Add a `useMapSelection` hook that highlights the selected plane (larger circle or ring) and renders a custom HTML marker for the selected plane that rotates based on heading from `PlaneDetailed`
- Add click interaction on the planes layer to dispatch `selectPlane` / `deselectPlane` via the store
- Add cursor change on hover over plane markers (pointer cursor)
- Wire `MapView` into `App.tsx`, removing the placeholder counter UI and the bare `MapContainer`
- Update map default config to a world-view center and zoom suitable for viewing all 20 planes

## Capabilities

### New Capabilities
- `plane-markers`: Renders all planes as colored circle markers on the map, kept in sync with the flight store's `planes` array via a GeoJSON source + circle layer
- `map-selection`: Interactive plane selection on the map — click to select, click again to deselect, highlighted selected plane with rotation, and cursor feedback

### Modified Capabilities
- `map-integration`: The existing `MapContainer` component is replaced by `MapView` which integrates store subscriptions and map interaction. The requirement for a basic map container is superseded by the new `MapView` component.

## Impact

- **Components**: `fe/src/features/map/MapContainer.tsx` → replaced by `MapView.tsx`; new hooks in `fe/src/features/map/`
- **State**: `MapView` reads from existing `useFlightStore` selectors (`usePlanes`, `useSelectedPlaneId`, `useDetailedPlane`, `useConnectionStatus`) — no store changes needed
- **App entry**: `fe/src/App.tsx` updated to use `MapView` and remove placeholder counter
- **Config**: `fe/src/config.ts` may need a map-specific config section (center, zoom, style URL constants)
- **Types**: `fe/src/types/map.ts` already has `MapConfig`, `LngLat`, `MapStyle` — may extend with marker-related types
- **Dependencies**: No new npm dependencies — `maplibre-gl` and `zustand` are already installed
