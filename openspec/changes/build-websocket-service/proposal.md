## Why

The frontend has no mechanism to consume real-time data from the backend WebSocket server. Domain types and the Zustand flight store are already defined, but there is no service layer connecting them to the backend. Without WebSocket integration, the app cannot display live aircraft positions or subscribe to detailed flight data — the core value proposition of Flight Radar.

## What Changes

- Add a `websocketService.ts` module that manages two WebSocket connections (basic and details) with lifecycle control, reconnection logic, and message dispatching.
- Add `useBasicWebSocket` hook that connects to `/ws/planes/basic` on mount, parses incoming `planes` messages, and updates the flight store.
- Add `useDetailWebSocket` hook that opens/closes the details connection on demand, sends `subscribe` messages on plane selection, handles `plane-details` and `error` messages, and gracefully handles close code 1008.
- Add a `config.ts` module for WebSocket URLs and reconnection parameters (no hardcoded URLs).
- Implement exponential backoff reconnection for the basic connection; selective reconnection for the details connection based on close code.

## Capabilities

### New Capabilities
- `websocket-service`: Core WebSocket connection manager handling two connections (basic + details), message parsing, reconnection with exponential backoff, and error dispatching to the flight store.
- `websocket-hooks`: React hooks (`useBasicWebSocket`, `useDetailWebSocket`) that integrate the WebSocket service with the component lifecycle and the Zustand flight store.
- `ws-config`: Configuration module for WebSocket URLs, reconnection timing, and other connection parameters sourced from environment variables with sensible defaults.

### Modified Capabilities
<!-- No existing spec-level behavior changes required. The flight store actions already defined (updatePlanes, selectPlane, etc.) are the integration points — no requirement changes needed. -->

## Impact

- **New files**: `fe/src/lib/websocketService.ts`, `fe/src/lib/useBasicWebSocket.ts`, `fe/src/lib/useDetailWebSocket.ts`, `fe/src/config.ts`
- **Dependencies**: No new npm packages — uses native `WebSocket` API.
- **Store integration**: Calls existing flight store actions (`updatePlanes`, `setDetailedPlane`, `setConnectionStatus`, `setError`, `clearError`, `selectPlane`, `deselectPlane`).
- **App component**: `App.tsx` will need to mount `useBasicWebSocket` and `useDetailWebSocket` hooks.
- **Test mocks**: Native `WebSocket` must be mocked in tests; existing store tests remain unchanged.
