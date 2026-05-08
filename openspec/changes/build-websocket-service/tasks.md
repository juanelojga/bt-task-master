## 1. Configuration

- [ ] 1.1 Create `fe/src/config.ts` with WebSocket URL constants (`wsBasicUrl`, `wsDetailsUrl`) derived from `VITE_WS_BASIC_URL` and `VITE_WS_DETAILS_URL` environment variables with localhost fallback defaults
- [ ] 1.2 Add reconnection timing constants to `config.ts`: `wsReconnectInitialDelay` (1000), `wsReconnectMaxDelay` (30000), `wsReconnectMaxAttempts` (10), overridable via environment variables with NaN-safe parsing
- [ ] 1.3 Write unit tests for `config.ts` verifying default values, environment variable overrides, and NaN fallback behavior

## 2. WebSocket Service

- [ ] 2.1 Create `fe/src/lib/websocketService.ts` with the `WebSocketService` class: constructor accepting options (`url`, `onMessage`, `onOpen`, `onClose`, `onError`), `connect()`, `disconnect()`, `send()`, and `state` getter
- [ ] 2.2 Implement `connect()` — create native WebSocket, register `onopen`/`onmessage`/`onclose`/`onerror` handlers, idempotent on already-connected service
- [ ] 2.3 Implement `disconnect()` — close with code 1000, clear reconnection timers, idempotent on disconnected service
- [ ] 2.4 Implement message parsing in `onmessage` — parse JSON to `IncomingWsMessage`, invoke `onMessage` callback; invoke `onError` on parse failure
- [ ] 2.5 Implement `send(message: OutgoingWsMessage)` — serialize to JSON and send on OPEN socket; no-op on non-open socket
- [ ] 2.6 Implement `state` getter — return `"connecting" | "connected" | "disconnected"` based on WebSocket readyState
- [ ] 2.7 Implement exponential backoff reconnection — on unexpected close (non-1000), schedule reconnect with delay starting at `initialDelay`, doubling with ±20% jitter up to `maxDelay`; cancel on explicit disconnect; configurable max attempts
- [ ] 2.8 Implement cleanup in `disconnect()` — null out callback references and clear timers to prevent memory leaks
- [ ] 2.9 Write unit tests for `WebSocketService`: mock native `WebSocket`, verify connect/disconnect lifecycle, message parsing, send behavior, reconnection backoff, idempotency, and cleanup

## 3. Basic WebSocket Hook

- [ ] 3.1 Create `fe/src/lib/useBasicWebSocket.ts` — on mount, create `WebSocketService` for basic URL and connect; on unmount, disconnect and clean up
- [ ] 3.2 Wire `onOpen` to `setConnectionStatus('basic', 'connected')`, `onClose` to `setConnectionStatus('basic', 'disconnected')`, and call `setConnectionStatus('basic', 'connecting')` on connect attempt
- [ ] 3.3 Wire `onMessage` to dispatch `BasicPlanesMessage` → `updatePlanes(data)` and `WsErrorMessage` → `setError(message)`
- [ ] 3.4 Pass reconnection config from `config.ts` to the `WebSocketService` constructor
- [ ] 3.5 Write unit tests for `useBasicWebSocket`: verify store updates on connect/disconnect, message dispatching, and cleanup on unmount using mock WebSocket and Zustand test store

## 4. Detail WebSocket Hook

- [ ] 4.1 Create `fe/src/lib/useDetailWebSocket.ts` — subscribe to `selectedPlaneId` from store; open details connection when selected, close when deselected
- [ ] 4.2 On details connection open, send `{ type: "subscribe", planeId: selectedPlaneId }` message
- [ ] 4.3 On `selectedPlaneId` change from one ID to another, send new subscribe on existing connection (reuse, don't reconnect)
- [ ] 4.4 Wire `onMessage`: `PlaneDetailsMessage` with matching `data.id` → `setDetailedPlane(data)` + `clearError()`; non-matching → ignore
- [ ] 4.5 Handle close code 1008 — call `deselectPlane()` and `setError("Plane not found or subscription invalid")`, no reconnection
- [ ] 4.6 Handle network-failure closes (non-1000, non-1008) — attempt reconnection with backoff while `selectedPlaneId` is set; on max attempts exhausted, `deselectPlane()` and `setError("Unable to reconnect to flight details")`
- [ ] 4.7 Wire `onMessage` for `WsErrorMessage` → `setError(message)`
- [ ] 4.8 Write unit tests for `useDetailWebSocket`: verify connect on select, disconnect on deselect, subscribe on open, plane switch reuses connection, code 1008 handling, network reconnection, and message dispatching

## 5. Integration

- [ ] 5.1 Mount `useBasicWebSocket` and `useDetailWebSocket` in `App.tsx` (or appropriate top-level component)
- [ ] 5.2 Verify full integration with running backend: all 20 planes appear, selection works, switching works, error handling is correct
