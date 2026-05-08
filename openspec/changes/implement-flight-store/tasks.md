## 1. Type Definitions

- [ ] 1.1 Create `fe/src/features/store/flightStore.types.ts` with `FlightStoreState` interface (planes, selectedPlaneId, detailedPlane, connectionStatus, errorMessage)
- [ ] 1.2 Add `FlightStoreActions` interface to `flightStore.types.ts` (updatePlanes, selectPlane, deselectPlane, setDetailedPlane, setConnectionStatus, setError, clearError)
- [ ] 1.3 Add `FlightStore` combined interface (extends FlightStoreState & FlightStoreActions) and export all types

## 2. Store Implementation

- [ ] 2.1 Create `fe/src/features/store/useFlightStore.ts` with `create<FlightStore>()(devtools(...))` and initial state
- [ ] 2.2 Implement `updatePlanes` action with auto-deselect logic (clear selectedPlaneId and detailedPlane if selected plane missing from new data)
- [ ] 2.3 Implement `selectPlane` action (set selectedPlaneId, clear detailedPlane)
- [ ] 2.4 Implement `deselectPlane` action (clear selectedPlaneId and detailedPlane)
- [ ] 2.5 Implement `setDetailedPlane` action with guard (only set if data.id matches selectedPlaneId)
- [ ] 2.6 Implement `setConnectionStatus` action (update basic or details status)
- [ ] 2.7 Implement `setError` and `clearError` actions
- [ ] 2.8 Ensure all actions use devtools action labels (third argument to `set`)

## 3. Selector Hooks

- [ ] 3.1 Create `fe/src/features/store/useFlightSelectors.ts` with `usePlanes`, `useSelectedPlaneId`, `useDetailedPlane`, `useConnectionStatus`, `useErrorMessage` hooks

## 4. Tests

- [ ] 4.1 Write unit tests for initial store state (all default values correct)
- [ ] 4.2 Write unit tests for `updatePlanes` — basic update, auto-deselect when selected plane disappears, no-deselect when selected plane remains
- [ ] 4.3 Write unit tests for `selectPlane` and `deselectPlane` — state transitions, idempotent deselect
- [ ] 4.4 Write unit tests for `setDetailedPlane` — matching ID accepted, non-matching ID ignored, null selectedPlaneId ignored
- [ ] 4.5 Write unit tests for `setConnectionStatus` — basic and details independently updatable
- [ ] 4.6 Write unit tests for `setError` and `clearError`
- [ ] 4.7 Write unit tests for selector hooks — return correct slices, no re-render on unrelated state changes
