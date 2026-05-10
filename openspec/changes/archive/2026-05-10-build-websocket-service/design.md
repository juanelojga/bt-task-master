## Context

The frontend has domain types (`fe/src/types/domain.ts`) and a Zustand flight store (`fe/src/features/store/useFlightStore.ts`) fully implemented. The backend exposes two WebSocket endpoints:
- `/ws/planes/basic` — broadcasts `PlaneBasic[]` every ~1 second
- `/ws/planes/details` — accepts `subscribe` messages and returns `PlaneDetailed` updates for a single plane

There is currently no service layer connecting the backend to the store. The app cannot display any data until WebSocket integration is built.

Key constraints from the project:
- No WebSocket logic inside components — must live in `lib/` or service layer
- No hardcoded URLs — must use `config.ts`
- Store is the single source of truth — WS layer dispatches to store, components read from store
- Native `WebSocket` API only (no third-party WS libraries)

## Goals / Non-Goals

**Goals:**
- Establish a WebSocket service that manages two independent connections (basic + details)
- Provide React hooks that integrate the service with component lifecycle and the flight store
- Implement robust reconnection with exponential backoff for the basic connection
- Handle the details subscription lifecycle: open on select, subscribe, switch, close on deselect
- Gracefully handle close code 1008 (invalid subscription) by deselecting and showing an error
- Centralize all WebSocket URLs and timing parameters in `config.ts`

**Non-Goals:**
- No offline persistence or message queuing
- No authentication or token-based WS handshake
- No binary WebSocket frames (all messages are JSON)
- No third-party WebSocket libraries or abstractions
- No server-side changes (backend is provided as-is)

## Decisions

### Decision 1: Class-based WebSocket service vs. standalone functions

**Choice**: A `WebSocketService` class that wraps native `WebSocket` instances and manages lifecycle.

**Rationale**: A class encapsulates connection state, reconnection timers, and message handlers in one place. It allows the React hooks to create/destroy service instances cleanly. Standalone functions would require module-level mutable state, which is harder to test and reason about.

**Alternatives considered**:
- Module-level singleton: harder to reset between tests, couples to module lifecycle
- Factory functions with closures: similar to class but less idiomatic in TypeScript

### Decision 2: Separate `useBasicWebSocket` and `useDetailWebSocket` hooks vs. single `useWebSocket` hook

**Choice**: Two separate hooks.

**Rationale**: The two connections have fundamentally different lifecycles — basic is always-on, details is on-demand. A single hook would need complex conditional logic. Separate hooks make each concern clear, testable, and independently mountable. Each hook manages its own `WebSocketService` instance.

**Alternatives considered**:
- Single `useWebSocket` hook with mode parameter: leads to conditional branching in setup/teardown, harder to reason about
- Context provider: adds unnecessary indirection; hooks are sufficient since the store is already the shared state

### Decision 3: Reconnection strategy

**Choice**: Exponential backoff with jitter for basic WS (1s → 2s → 4s → … → 30s max). No automatic reconnection for details WS on close code 1008. Network-failure reconnection for details WS (same backoff) while a plane is selected.

**Rationale**: Basic connection must always recover — it's the primary data source. Details connection on 1008 means the subscription was invalid, so reconnecting would repeat the error. Network failures are transient and worth retrying while the user still has a plane selected.

**Alternatives considered**:
- Constant interval reconnection: wastes resources when server is down for extended periods
- No reconnection for details WS at all: poor UX on brief network blips

### Decision 4: Message dispatching pattern

**Choice**: The `WebSocketService` accepts handler callbacks (`onMessage`, `onOpen`, `onClose`, `onError`) in its constructor/options. Hooks wire these callbacks to store actions.

**Rationale**: Keeps the service decoupled from the store (Dependency Inversion). The service doesn't import the store — it calls whatever callbacks are provided. This makes the service independently testable.

**Alternatives considered**:
- Service imports store directly: couples service to store, violates DIP
- Event emitter pattern: over-engineered for two connections, adds complexity

### Decision 5: Details WS lifecycle — close on deselect vs. keep open

**Choice**: Close the details WebSocket on deselect. Re-open on next selection.

**Rationale**: The backend doesn't support an explicit unsubscribe message. Keeping the connection open would continue receiving data for a plane the user no longer cares about. Closing is clean and simple.

**Alternatives considered**:
- Keep connection open, ignore messages: wastes server resources, complicates state tracking
- Send subscribe with empty/dummy ID: would trigger a 1008 error from the backend

## Risks / Trade-offs

- **[Risk] Multiple rapid select/deselect cycles could create race conditions with WS open/close** → Mitigation: The `useDetailWebSocket` hook tracks the current `selectedPlaneId` via a ref and ignores stale responses. The service's `connect`/`disconnect` methods are idempotent.
- **[Risk] Reconnection during server restart could flood with attempts** → Mitigation: Exponential backoff caps at 30s. Jitter randomizes timing to prevent thundering herd.
- **[Risk] Message ordering — stale `plane-details` arriving after deselection** → Mitigation: `setDetailedPlane` in the store already checks `selectedPlaneId === data.id`, acting as a no-op for stale data.
- **[Trade-off] Closing details WS on deselect means a fresh connection on each selection** → Acceptable because WebSocket handshakes are fast on localhost and the alternative (keeping open) introduces complexity without clear benefit for 20 planes.
