## Why

The frontend currently has no shared state management for flight data. Components need a single source of truth for the list of planes, the selected plane, detailed plane information, and connection status. Without a centralized store, data would be passed via prop drilling or duplicated across components, leading to inconsistent UI and hard-to-maintain code.

## What Changes

- Implement `useFlightStore` — a Zustand store containing all flight-related state and actions
- State slices: `planes`, `selectedPlaneId`, `detailedPlane`, `connectionStatus`, `errorMessage`
- Actions: `updatePlanes`, `selectPlane`, `deselectPlane`, `setDetailedPlane`, `setConnectionStatus`, `setError`, `clearError`
- Configure the store with `devtools` middleware for Redux DevTools integration
- Provide thin selector hooks for each state slice so components subscribe only to what they need
- Handle edge cases: auto-deselect when a selected plane disappears from the basic list, clear detailed data on deselect

## Capabilities

### New Capabilities

- `flight-store`: Implements the Zustand store for flight data — state shape, actions, selectors, and edge-case logic (auto-deselect on plane disappearance)

### Modified Capabilities

- `state-management`: Adds concrete store implementation and selector hooks, extending the existing pattern with flight-specific state and actions

## Impact

- **New files**: `fe/src/store/useFlightStore.ts`, selector hooks co-located or in `fe/src/features/store/`
- **Dependencies**: `zustand` (already specified in `state-management` spec)
- **Consumers**: MapView, PlaneMarkers, DetailPanel, ErrorToast — all will read from this store
- **No breaking changes** — this is a greenfield addition
