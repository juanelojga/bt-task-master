## 1. GeoJSON Utility

- [x] 1.1 Verify `planesToFeatureCollection` in `features/map/utils/geojson.ts` converts `PlaneBasic[]` to a `FeatureCollection<Point>` with correct coordinates `[longitude, latitude]`, properties `id`, `color`, `altitude`, and feature `id` set to plane ID
- [x] 1.2 Verify unit tests in `features/map/utils/__tests__/geojson.test.ts` cover: empty array, single plane, multiple planes, coordinate order, feature ID matching plane ID

## 2. useMapMarkers Hook

- [x] 2.1 Verify `useMapMarkers` in `features/map/hooks/useMapMarkers.ts` adds `planes` GeoJSON source and `planes` circle layer when `mapLoaded` is true
- [x] 2.2 Verify circle layer uses data-driven color (`['get', 'color']`) and white stroke (`circle-stroke-width: 2`, `circle-stroke-color: '#ffffff'`)
- [x] 2.3 Verify hook guards against duplicate source/layer creation (checks `getSource`/`getLayer` before adding)
- [x] 2.4 Verify second `useEffect` calls `setData` on the `planes` source when `planes` array changes, using `planesToFeatureCollection`
- [x] 2.5 Verify cleanup: hook removes `planes` layer and source on unmount
- [x] 2.6 Verify `sourceAddedRef` prevents `setData` calls before source exists

## 3. Hook Tests

- [x] 3.1 Verify `features/map/hooks/__tests__/useMapMarkers.test.ts` covers: source/layer added on map load, no action when map not loaded, data update via `setData` on planes change, no update before source exists, cleanup on unmount, no duplicate source/layer, feature ID set to plane ID, empty planes array produces empty FeatureCollection

## 4. MapView Integration

- [x] 4.1 Verify `MapView.tsx` passes `mapRef`, `mapLoaded`, and `planes` (from `usePlanes` selector) to `useMapMarkers`
- [x] 4.2 Verify `MapView.test.tsx` mocks `useMapMarkers` and asserts it is called with correct arguments

## 5. Lint and Type-Check

- [x] 5.1 Run `npm run lint` in `fe/` — all files pass with no errors
- [x] 5.2 Run `tsc -b` in `fe/` — no type errors
- [x] 5.3 Run `npm run test` in `fe/` — all tests pass
