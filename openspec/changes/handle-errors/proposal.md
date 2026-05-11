## Why

The application currently has basic error handling (toast component, store actions, WS close-code handling), but several error scenarios from the PRD (FR-14 through FR-17) are not fully addressed in the UI or are handled inconsistently. Users have no visibility into connection status, the "reconnecting" state is invisible, and the "plane no longer available" auto-deselect happens silently. A cohesive error handling layer is needed so users always understand what went wrong and can trust the app to recover gracefully.

## What Changes

- Add a **connection status indicator** to the map UI showing basic WS state (connected / reconnecting / disconnected)
- Improve the **auto-deselect "plane disappeared" scenario** to show an informational toast instead of silently closing the detail panel
- Add a **reconnecting overlay/banner** on the map when the basic WS is in `connecting` or `disconnected` state
- Ensure the **detail panel shows a "lost connection" state** when the details WS disconnects mid-subscription (before reconnection succeeds or fails)
- Consolidate error message types in the store to distinguish **connection errors** from **subscription errors** from **informational notices**, so the toast can style them differently (error vs. warning vs. info)

## Capabilities

### New Capabilities
- `connection-status-ui`: Visual indicator for WebSocket connection health (basic WS reconnecting banner, details WS status in panel)
- `error-type-system`: Categorized error/notice system in the store (error, warning, info) so the toast and other UI can render appropriately per severity

### Modified Capabilities
- `error-toast`: Add support for different severity levels (error/warning/info) with distinct styling per level
- `selection-flow`: Plane disappearance auto-deselect now surfaces an informational notice to the user instead of silently closing the panel

## Impact

- **Store** (`flightStore.types.ts`, `useFlightStore.ts`): `errorMessage: string | null` expands to a structured error/notice type with severity; new actions `setNotice` / `clearNotice` or enhanced `setError` with severity
- **UI components**: `ErrorToast.tsx` needs severity-aware styling; new `ConnectionBanner.tsx` or similar component for map overlay
- **Detail panel**: May show a "Reconnecting…" state when details WS drops mid-subscription
- **Hooks**: `useBasicWebSocket` and `useDetailWebSocket` may need to dispatch notices with severity instead of plain error strings
- **Tests**: All new behavior requires test coverage (store, components, hooks)
