## Context

The flight radar app needs to render real-time aircraft positions on a MapLibre map. The backend simulates 20 planes and pushes position updates via a basic WebSocket endpoint at approximately 1 Hz. The frontend already has the flight store (Zustand) receiving `PlaneBasic[]` updates and the `MapView` component hosting a MapLibre map instance. What's missing is the visual layer that turns plane data into map markers.

The existing `plane-markers` spec defines the requirements for the GeoJSON source, circle layer, and store-driven updates. This change implements those requirements.

**Current state**: The `useMapMarkers` hook, `geojson.ts` utilities, and corresponding tests already exist in the codebase. This change formalizes the implementation, closes any spec gaps, and ensures full test coverage.

## Goals / Non-Goals

**Goals:**
- Render all planes as colored circle markers on the map using a GeoJSON source + circle layer
- Update marker positions in real time by calling `setData` on the GeoJSON source whenever the flight store's `planes` array changes
- Use data-driven styling so each circle's color matches the plane's `color` property
- Provide a well-tested, independently testable `planesToFeatureCollection` utility
- Ensure proper cleanup of source and layer on component unmount
- Handle the edge case of an empty planes array (clear the source)

**Non-Goals:**
- Selected plane highlighting (covered by `map-selection` spec)
- Click interaction on markers (covered by `map-selection` spec)
- Rotation/heading-based marker orientation (future enhancement)
- Symbol layer with flight number labels (future enhancement)
- Altitude-based circle sizing (future enhancement)

## Decisions

### Decision 1: GeoJSON source + circle layer over individual Markers

**Choice**: Use a MapLibre GeoJSON source with a `circle` layer instead of creating individual `maplibregl.Marker` instances.

**Rationale**: A GeoJSON source with `setData` is significantly more performant than managing 20 individual Marker DOM elements. MapLibre renders circle layers via WebGL, and `setData` triggers efficient diff-based updates. With 20 planes at 1 Hz updates, this is trivial for the rendering pipeline. Individual Markers would create 20 DOM nodes that need manual lifecycle management.

**Alternative considered**: Individual `maplibregl.Marker` instances — rejected because of DOM overhead, manual position updates, and lack of data-driven styling support.

### Decision 2: Dedicated `useMapMarkers` hook for source/layer lifecycle

**Choice**: Encapsulate source creation, layer addition, data updates, and cleanup in a `useMapMarkers` hook.

**Rationale**: Separates map data binding concerns from the `MapView` component. The hook owns the entire lifecycle: it adds the source and layer on mount (when `mapLoaded` is true), updates source data on `planes` changes, and removes the layer and source on unmount. This follows the single-responsibility principle and keeps `MapView` as a composition root.

**Alternative considered**: Inline logic in `MapView` — rejected because it would bloat the component and make testing harder.

### Decision 3: `planesToFeatureCollection` as a pure, exported utility

**Choice**: Extract the `PlaneBasic[]` → `FeatureCollection` conversion into `features/map/utils/geojson.ts` as an exported pure function.

**Rationale**: Pure functions are independently testable, reusable, and free of side effects. The hook calls this function to produce GeoJSON data, but the conversion logic itself has no dependency on MapLibre or React. This satisfies the spec requirement for independent testability and follows the project convention of extracting utilities from hooks.

**Alternative considered**: Inline conversion in the hook — rejected per AGENTS.md rule "No auxiliary/helper functions defined inside hook or component files".

### Decision 4: Feature ID set to plane ID for stable rendering

**Choice**: Set each GeoJSON feature's `id` to the plane's `id` string.

**Rationale**: MapLibre uses feature IDs for stable feature state and efficient re-rendering. Without stable IDs, `setData` may cause visual flickering because MapLibre cannot diff old vs. new features. Using the plane ID ensures that the same plane always maps to the same feature across updates.

### Decision 5: Separate useEffect for source creation vs. data updates

**Choice**: Use two `useEffect` hooks — one for source/layer creation (depends on `mapLoaded`), one for data updates (depends on `planes`).

**Rationale**: The source and layer should be created once when the map loads. Data updates should happen independently whenever `planes` changes. Combining them into one effect would cause the source to be removed and re-added on every data change, which is inefficient and causes visual flickering. The `sourceAddedRef` flag ensures data updates only run after the source exists.

**Trade-off**: The first `useEffect` intentionally omits `planes` from its dependency array (suppressed via eslint-disable comment) to avoid re-creating the source. The initial `planes` value is captured at creation time and subsequent updates flow through the second effect.

## Risks / Trade-offs

- **[Stale source ref]** → The `sourceAddedRef` flag could become stale if the map is removed and re-created without the hook unmounting. Mitigated by the `MapView` component resetting `mapLoaded` to `false` and unmounting the hook on map removal.
- **[Missing planes dependency in first effect]** → The eslint-disable for `react-hooks/exhaustive-deps` suppresses a legitimate warning. Mitigated by the second effect handling all subsequent data updates; the initial value is baked into the source at creation time.
- **[20 planes at 1 Hz]** → Not a performance risk — GeoJSON `setData` for 20 points is well within MapLibre's capabilities. Could become a concern at 1000+ planes, but that's out of scope.
