## 1. Map Configuration

- [x] 1.1 Add map config constants to `fe/src/config.ts` (`VITE_MAP_STYLE_URL`, default center `[0, 20]`, default zoom `2`) with environment variable overrides
- [x] 1.2 Add unit tests for map config defaults and env var overrides in `fe/src/config.test.ts`

## 2. MapView Component Foundation

- [x] 2.1 Create `fe/src/features/map/MapView.tsx` replacing `MapContainer.tsx` — initialize MapLibre map in `useRef`, wait for `load` event, accept `MapConfig` props, clean up on unmount
- [x] 2.2 Delete `fe/src/features/map/MapContainer.tsx`
- [x] 2.3 Update `fe/src/App.tsx` to import `MapView` instead of `MapContainer`, remove placeholder counter UI, use map config from `config.ts`
- [x] 2.4 Add component test for `MapView` rendering and cleanup (`MapView.test.tsx`)

## 3. Plane Markers (useMapMarkers hook)

- [x] 3.1 Create `fe/src/features/map/useMapMarkers.ts` — add `planes` GeoJSON source and circle layer on map load, convert `PlaneBasic[]` to `FeatureCollection` with feature IDs, call `source.setData()` on store changes
- [x] 3.2 Add unit tests for `useMapMarkers` — verify source/layer creation, data updates on planes change, cleanup on unmount, empty planes array behavior
- [x] 3.3 Wire `useMapMarkers` into `MapView` — call the hook with map ref and `usePlanes()` selector

## 4. Map Selection (useMapSelection hook)

- [x] 4.1 Create `fe/src/features/map/useMapSelection.ts` — add `selected-plane` source and circle layer, update highlight on `selectedPlaneId` change, manage click handler (`selectPlane`/`deselectPlane`), manage hover cursor changes
- [x] 4.2 Add rotated HTML Marker logic for selected plane — create/update/remove `maplibregl.Marker` with CSS `transform: rotate(${heading}deg)` based on `detailedPlane.heading`
- [x] 4.3 Add unit tests for `useMapSelection` — verify selection highlight, click interaction dispatches store actions, cursor changes, rotated marker creation/update/removal, cleanup on unmount
- [x] 4.4 Wire `useMapSelection` into `MapView` — call the hook with map ref, `useSelectedPlaneId()`, `usePlanes()`, and `useDetailedPlane()` selectors

## 5. Integration & Polish

- [x] 5.1 Verify full integration: planes render on map, click selects, click again deselects, selected plane highlights and rotates with heading, deselect clears everything
- [x] 5.2 Run lint and type-check (`npm run lint` and `tsc -b`) — fix any issues
- [x] 5.3 Run all tests (`npm run test`) — ensure no regressions and new tests pass
