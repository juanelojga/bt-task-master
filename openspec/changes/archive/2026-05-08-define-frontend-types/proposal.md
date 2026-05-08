## Why

The frontend currently has no TypeScript types for the domain data (planes, WebSocket messages). The backend defines canonical types (`PlaneBasic`, `PlaneDetailed`, WS message types) in `be/src/types.ts`, but the frontend must mirror these as its own contract. Without these types, the store, WebSocket service, and components cannot be implemented in a type-safe way. This is a prerequisite for steps 3–8 in `PLAN.md`.

## What Changes

- Add `PlaneBasic` type in the frontend, mirroring the backend's basic plane shape (`id`, `latitude`, `longitude`, `altitude`, `color`).
- Add `PlaneDetailed` type, mirroring the backend's detailed plane shape (aircraft info, position, route, time, load, status, color).
- Add discriminated-union WebSocket message types: `BasicPlanesMessage` (`type: "planes"`), `SubscribeMessage` (`type: "subscribe"`), `PlaneDetailsMessage` (`type: "plane-details"`), and `WSErrorMessage` (`type: "error"`).
- Add a union type `IncomingMessage` covering all messages the frontend can receive, and `OutgoingMessage` for messages the frontend sends.
- Add a `ConnectionStatus` type for tracking WebSocket connection states.
- Export all types from `fe/src/types/` for use by the store, services, and components.

## Capabilities

### New Capabilities
- `domain-types`: Core domain type definitions for planes, WebSocket messages, and connection status — the shared vocabulary for all frontend modules.

### Modified Capabilities
<!-- No existing capability specs need modification — this is a foundational addition. -->

## Impact

- **Files**: New files in `fe/src/types/` (e.g., `plane.ts`, `messages.ts`, `connection.ts` or a consolidated `domain.ts`). Existing `fe/src/types/map.ts` is unaffected.
- **Consumers**: The upcoming Zustand store (`useFlightStore`), WebSocket service, and all UI components will import from these types.
- **Dependencies**: No new npm packages — pure TypeScript type definitions.
- **Backend alignment**: Types must stay in sync with `be/src/types.ts`. Any backend schema change requires a corresponding frontend update.
