## 1. Extract Utility Functions

- [ ] 1.1 Create `fe/src/features/map/utils/geojson.ts` with `planesToFeatureCollection`, `createSelectedFeature`, and `createEmptyFeatureCollection` extracted from their current hook files
- [ ] 1.2 Create `fe/src/features/map/utils/__tests__/geojson.test.ts` with unit tests for all three extracted GeoJSON utility functions
- [ ] 1.3 Create `fe/src/utils/env.ts` with `parseNumericEnv` extracted from `config.ts`
- [ ] 1.4 Create `fe/src/utils/__tests__/env.test.ts` with unit tests for `parseNumericEnv`
- [ ] 1.5 Update `fe/src/features/map/hooks/useMapMarkers.ts` to import `planesToFeatureCollection` from `../utils/geojson.ts` and remove the inline definition
- [ ] 1.6 Update `fe/src/features/map/hooks/useMapSelection.ts` to import `createSelectedFeature` and `createEmptyFeatureCollection` from `../utils/geojson.ts` and remove the inline definitions
- [ ] 1.7 Update `fe/src/config.ts` to import `parseNumericEnv` from `./utils/env.ts` and remove the inline definition
- [ ] 1.8 Run `npm run test` and `tsc -b` to verify utilities work correctly after extraction

## 2. Move Hooks to Dedicated hooks/ Directories

- [ ] 2.1 Create `fe/src/features/map/hooks/` directory and move `useMapMarkers.ts` from `features/map/` to `features/map/hooks/`
- [ ] 2.2 Move `useMapSelection.ts` from `features/map/` to `features/map/hooks/`
- [ ] 2.3 Create `fe/src/features/store/hooks/` directory and move `useFlightSelectors.ts` from `features/store/` to `features/store/hooks/`
- [ ] 2.4 Create `fe/src/lib/hooks/` directory and move `useBasicWebSocket.ts` from `lib/` to `lib/hooks/`
- [ ] 2.5 Move `useDetailWebSocket.ts` from `lib/` to `lib/hooks/`
- [ ] 2.6 Update all import paths in `MapView.tsx` to reference `./hooks/useMapMarkers.ts` and `./hooks/useMapSelection.ts`
- [ ] 2.7 Update all import paths in moved hooks (e.g., `useMapMarkers` imports from store, `useMapSelection` imports from store and utils, `useBasicWebSocket` and `useDetailWebSocket` imports from config, store, and websocketService)
- [ ] 2.8 Update any other files that import the moved hooks (e.g., `App.tsx` or other consumers)
- [ ] 2.9 Run `tsc -b` and `npm run test` to verify all imports resolve correctly after hook moves

## 3. Move Test Files to __tests__ Directories

- [ ] 3.1 Create `fe/src/features/map/hooks/__tests__/` and move `useMapMarkers.test.ts` and `useMapSelection.test.ts` there
- [ ] 3.2 Create `fe/src/features/map/__tests__/` and move `MapView.test.tsx` there
- [ ] 3.3 Create `fe/src/features/store/hooks/__tests__/` and move `useFlightSelectors.test.tsx` there
- [ ] 3.4 Create `fe/src/features/store/__tests__/` and move `useFlightStore.test.ts` there
- [ ] 3.5 Create `fe/src/lib/hooks/__tests__/` and move `useBasicWebSocket.test.ts` and `useDetailWebSocket.test.ts` there
- [ ] 3.6 Create `fe/src/lib/__tests__/` and move `websocketService.test.ts` there
- [ ] 3.7 Create `fe/src/__tests__/` and move `config.test.ts` there
- [ ] 3.8 Create `fe/src/types/__tests__/` and move `domain.test.ts` there
- [ ] 3.9 Update all import paths inside moved test files to account for the extra `__tests__/` directory depth
- [ ] 3.10 Run `npm run test` to verify all tests pass in their new locations

## 4. Final Verification & Cleanup

- [ ] 4.1 Delete any empty directories left behind after file moves
- [ ] 4.2 Run `npm run lint` to ensure no lint errors
- [ ] 4.3 Run `npm run test` to verify full test suite passes
- [ ] 4.4 Run `tsc -b` to verify type-checking passes with no errors
- [ ] 4.5 Verify no `*.test.ts` or `*.test.tsx` files exist outside `__tests__/` directories
- [ ] 4.6 Verify no `use*.ts` hook files exist outside `hooks/` directories
