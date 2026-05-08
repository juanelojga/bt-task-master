## 1. Type Definitions

- [x] 1.1 Create `fe/src/features/store/flightStore.types.ts` with `FlightStoreState` interface (planes, selectedPlaneId, detailedPlane, connectionStatus, errorMessage)
- [x] 1.2 Add `FlightStoreActions` interface to `flightStore.types.ts` (updatePlanes, selectPlane, deselectPlane, setDetailedPlane, setConnectionStatus, setError, clearError)
- [x] 1.3 Add `FlightStore` combined interface (extends FlightStoreState & FlightStoreActions) and export all types

## 2. Store Implementation

- [x] 2.1 Create `fe/src/features/store/useFlightStore.ts` with `create<FlightStore>()(devtools(...))` and initial state
- [x] 2.2 Implement `updatePlanes` action with auto-deselect logic (clear selectedPlaneId and detailedPlane if selected plane missing from new data)
- [x] 2.3 Implement `selectPlane` action (set selectedPlaneId, clear detailedPlane)
- [x] 2.4 Implement `deselectPlane` action (clear selectedPlaneId and detailedPlane)
- [x] 2.5 Implement `setDetailedPlane` action with guard (only set if data.id matches selectedPlaneId)
- [x] 2.6 Implement `setConnectionStatus` action (update basic or details status)
- [x] 2.7 Implement `setError` and `clearError` actions
- [x] 2.8 Ensure all actions use devtools action labels (third argument to `set`)

## 3. Selector Hooks

- [x] 3.1 Create `fe/src/features/store/useFlightSelectors.ts` with `usePlanes`, `useSelectedPlaneId`, `useDetailedPlane`, `useConnectionStatus`, `useErrorMessage` hooks

## 4. Tests

- [x] 4.1 Write unit tests for initial store state (all default values correct)
- [x] 4.2 Write unit tests for `updatePlanes` — basic update, auto-deselect when selected plane disappears, no-deselect when selected plane remains
- [x] 4.3 Write unit tests for `selectPlane` and `deselectPlane` — state transitions, idempotent deselect
- [x] 4.4 Write unit tests for `setDetailedPlane` — matching ID accepted, non-matching ID ignored, null selectedPlaneId ignored
- [x] 4.5 Write unit tests for `setConnectionStatus` — basic and details independently updatable
- [x] 4.6 Write unit tests for `setError` and `clearError`
- [x] 4.7 Write unit tests for selector hooks — return correct slices, no re-render on unrelated state changes
