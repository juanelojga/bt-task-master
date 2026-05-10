## Why

The map and WebSocket infrastructure is in place, but there is no end-to-end selection flow: clicking a plane marker on the map does not yet trigger the details WebSocket subscription, display a detail panel, or handle deselection interactions. Users cannot inspect any flight details. This change wires together the store actions, map click handlers, and detail WebSocket to deliver the core selection/deselection experience described in PLAN.md step 7.

## What Changes

- Wire the map click handler so that `selectPlane` in the flight store triggers the details WebSocket subscription via `useDetailWebSocket`, and clicking the already-selected plane calls `deselectPlane`.
- Add deselection triggers: close button on the detail panel, and clicking empty map area (outside any marker).
- Build a `DetailPanel` component that reads `detailedPlane` from the store and renders all flight information fields, with a loading skeleton while awaiting data.
- Add an `ErrorToast` component to surface WebSocket errors (invalid subscription code 1008, general errors).
- Handle the "plane disappears from basic list" edge case: auto-deselect is already implemented in the store (`updatePlanes`), but the UI must react (close panel, show note).
- Add visual feedback: selected-plane highlight layer already exists; ensure the panel slide-in/out animation works.

## Capabilities

### New Capabilities
- `selection-flow`: End-to-end selection/deselection interaction — map click → store action → details WS subscription → detail panel display → deselection via close/outside-click/re-click
- `detail-panel`: Side panel UI that renders `PlaneDetailed` fields with loading state and slide-in animation
- `error-toast`: Non-blocking toast component for surfacing WebSocket and subscription errors

### Modified Capabilities
- `map-selection`: Add deselection on empty-map click (clicking outside any plane marker triggers `deselectPlane`)
- `flight-store`: No spec-level requirement changes — auto-deselect on plane disappearance is already specified; this change relies on existing actions

## Impact

- **Components**: New `DetailPanel`, `ErrorToast` components in `fe/src/features/`
- **Hooks**: `useDetailWebSocket` already exists; `useMapInteraction` already dispatches `selectPlane`/`deselectPlane` — minor updates to `interaction.ts` for empty-map click
- **Store**: Uses existing `selectPlane`, `deselectPlane`, `setDetailedPlane`, `setError`, `clearError` actions — no store changes needed
- **App.tsx**: Will render `DetailPanel` and `ErrorToast` alongside `MapView`
- **Styling**: Tailwind classes for panel layout, animation, toast positioning
- **Tests**: Unit tests for new utilities, component tests for `DetailPanel` and `ErrorToast`, integration tests for selection flow
