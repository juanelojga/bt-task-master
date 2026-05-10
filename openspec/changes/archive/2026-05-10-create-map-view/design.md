## Context

The frontend currently has a placeholder `MapContainer` component that renders a bare MapLibre GL map with tiles but no aircraft data. The flight store (`useFlightStore`) and WebSocket hooks (`useBasicWebSocket`, `useDetailWebSocket`) are already wired and functional — they populate `planes`, `selectedPlaneId`, and `detailedPlane` state. The gap is connecting this live data to the map visualization.

The existing `MapContainer` accepts a `MapConfig` prop and initializes a `maplibregl.Map` instance. It does not subscribe to any store state and has no marker layers or interaction handlers.

## Goals / Non-Goals

**Goals:**
- Render all planes as colored circle markers on the map, updated in real time from the store
- Highlight the selected plane with a distinct visual treatment (larger ring, rotation based on heading)
- Enable click-to-select and click-to-deselect interaction on the map
- Provide pointer cursor feedback on hover over plane markers
- Keep the map responsive at 60fps with 20 markers updating at ~1Hz

**Non-Goals:**
- Custom aircraft icon images or symbol layers (circles are sufficient for 20 planes)
- Clustering (20 planes don't require it)
- Map panning/flying to the selected plane (can be added later)
- Tooltip on hover (not required by PRD for basic markers)
- Offline map tiles or custom tile sources
- Modifying the Zustand store or WebSocket hooks (they already work)

## Decisions

### 1. GeoJSON circle layer for plane markers (not individual Markers)

**Decision**: Use a single GeoJSON source + `circle` layer for all non-selected planes, updated via `source.setData()`.

**Rationale**: For 20 planes at 1Hz, a GeoJSON circle layer is far more performant than 20 individual `maplibregl.Marker` instances. `setData()` triggers efficient diff-rendering in MapLibre. Circle layers also support data-driven styling (color from feature properties) natively.

**Alternative considered**: Individual `maplibregl.Marker` instances with HTML elements — heavier DOM, harder to batch-update, but would allow easy CSS rotation. Rejected for performance reasons on the general marker set.

### 2. Hybrid approach for selected plane: separate layer + HTML Marker for rotation

**Decision**: Use a separate GeoJSON source + circle layer (`selected-plane`) with a larger radius and ring paint for the selected plane highlight. For rotation based on heading, use a `maplibregl.Marker` with a custom HTML element that rotates via CSS `transform: rotate()` when `detailedPlane` data is available.

**Rationale**: The PRD asks for rotation only on the selected plane. Circle layers cannot rotate. An HTML Marker is appropriate for a single element (not 20). The selected plane's circle-layer highlight provides the visual emphasis; the HTML Marker overlays it with a rotated aircraft indicator when heading data arrives from the details WS.

**Alternative considered**: Symbol layer with an icon rotated via `icon-rotate` — would require creating an icon image and managing a sprite. More complex for a single marker. Rejected for simplicity.

### 3. Custom hooks for map data binding: `useMapMarkers` and `useMapSelection`

**Decision**: Extract plane-to-GeoJSON conversion and source updates into `useMapMarkers(map, planes)`. Extract selection highlight and rotated marker management into `useMapSelection(map, selectedPlaneId, detailedPlane)`.

**Rationale**: Keeps `MapView` as a thin orchestrator. Each hook has a single responsibility (SRP). Hooks are testable in isolation (mock the map instance). This follows the project pattern of custom hooks for data binding (`useBasicWebSocket`, `useDetailWebSocket`).

**Alternative considered**: All logic inside `MapView` via `useEffect` blocks — would exceed 50 lines per function rule and mix concerns.

### 4. Map click interaction via MapLibre event, not React overlay

**Decision**: Use `map.on('click', 'planes', handler)` to detect clicks on the circle layer. Use `map.on('mouseenter', 'planes', ...)` and `map.on('mouseleave', 'planes', ...)` for cursor changes.

**Rationale**: MapLibre provides built-in layer-level click detection with access to feature properties. This is more accurate and performant than overlaying invisible React elements on top of the map canvas.

### 5. Map config with world-view defaults in `config.ts`

**Decision**: Add map configuration constants (`VITE_MAP_STYLE_URL`, default center `[0, 20]`, default zoom `2`) to `config.ts` with environment variable support, and remove the hardcoded `defaultConfig` from `App.tsx`.

**Rationale**: Follows the project rule of no hardcoded URLs. The center/zoom values are appropriate for a world view where 20 planes may be spread globally. Environment variable override allows flexibility for demo/development.

### 6. Replace `MapContainer` with `MapView` (not extend it)

**Decision**: Create a new `MapView` component that handles its own MapLibre initialization, source/layer setup, and store subscriptions. Delete `MapContainer.tsx`.

**Rationale**: `MapContainer` is a minimal stub with no marker logic. Building on top of it would require passing the `map` instance up via callbacks or context, violating the principle that the map instance stays scoped to the component. A clean replacement is simpler and avoids prop/callback complexity.

## Risks / Trade-offs

- **[MapLibre imperative API in React]** → MapLibre is imperative; React is declarative. Mitigation: scope the map instance to a `useRef`, initialize in `useEffect`, and clean up on unmount. Custom hooks bridge the gap by reacting to store changes and calling imperative map methods.

- **[Race condition: map not loaded when store updates]** → Store data may arrive before the map's `load` event fires, so `addSource`/`addLayer` could fail. Mitigation: wait for `map.on('load', ...)` before adding sources/layers, then set data. Use a `mapLoaded` ref to gate source updates.

- **[Selected plane marker flicker during data transition]** → When switching planes, the old selected-plane marker is removed and a new one appears. Mitigation: clear the selected highlight immediately on `selectPlane`, then re-apply when new `detailedPlane` data arrives. The brief gap is acceptable since details arrive within ~1 second.

- **[CSS rotation without heading in basic data]** → Basic plane data has no heading, so non-selected planes cannot rotate. This is expected per PRD. Only the selected plane (which has heading from `PlaneDetailed`) will show rotation. Mitigation: accept this limitation — it matches the PRD requirement.

- **[GeoJSON feature ID for stable rendering]** → Without feature IDs, MapLibre may re-render all features on `setData`. Mitigation: set `feature.id = plane.id` in the GeoJSON features to enable efficient diff-updates.
