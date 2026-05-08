## Context

The frontend has a minimal Zustand store (`useStore`) with a counter example, demonstrating the `devtools` middleware pattern and selector hook pattern. The domain types (`PlaneBasic`, `PlaneDetailed`, `ConnectionStatus`, etc.) are already defined in `fe/src/types/domain.ts`. There is no flight-specific store yet — components have no way to share plane data, selection state, or connection status.

The existing store lives at `fe/src/features/store/` with `useStore.ts`, `useCount.ts`, and `types.ts` following the project convention of co-located stores with selector hooks.

## Goals / Non-Goals

**Goals:**
- Implement `useFlightStore` with all state slices and actions described in PLAN.md §3
- Provide selector hooks for each state slice so components subscribe minimally
- Handle the auto-deselect edge case (selected plane disappears from basic list)
- Configure `devtools` middleware with named actions for debuggability
- Follow the existing store pattern (types file, store file, selector hooks)

**Non-Goals:**
- WebSocket connection management (separate change)
- Map rendering or marker logic (separate change)
- Detail panel UI (separate change)
- Reconnection / resilience logic (lives in WebSocket service layer)
- Persisting store state to localStorage or other storage

## Decisions

### 1. Separate store file vs extending the existing store

**Decision**: Create a new `useFlightStore` in `fe/src/features/store/`, keeping the existing counter store untouched.

**Rationale**: The counter store is a scaffold/example. Flight data is a distinct domain concern. Per SRP and the existing `state-management` spec, each store should own one domain. Merging would couple unrelated state and make both harder to test independently.

**Alternatives considered**:
- Merge into `useStore`: couples flight state with scaffold code, harder to remove the counter later.

### 2. Store file structure

**Decision**: Three files in `fe/src/features/store/`:
- `flightStore.types.ts` — `FlightStoreState`, `FlightStoreActions`, `FlightStore` interfaces
- `useFlightStore.ts` — `create<FlightStore>()(devtools(...))`
- `useFlightSelectors.ts` — thin selector hooks (`usePlanes`, `useSelectedPlaneId`, etc.)

**Rationale**: Matches the existing pattern (`types.ts` + `useStore.ts` + `useCount.ts`) but with a `flight` prefix to avoid name collisions. Separate types file keeps the store file focused on implementation. Selector hooks file prevents the store directory from growing unbounded with one file per hook.

**Alternatives considered**:
- One selector hook per file: too many tiny files for 6+ selectors.
- Inline selectors in components: violates the `state-management` spec requirement for custom hooks.

### 3. Auto-deselect on plane disappearance

**Decision**: The `updatePlanes` action checks whether `selectedPlaneId` is still present in the incoming plane list. If not, it calls `deselectPlane()` logic inline (clears `selectedPlaneId` and `detailedPlane`).

**Rationale**: This keeps the store self-consistent without requiring external orchestration. The WebSocket service just calls `updatePlanes` and the store handles the edge case internally.

**Alternatives considered**:
- Let the component detect disappearance: scatters edge-case logic, risks stale `detailedPlane`.
- Emit a separate event: over-engineering for an internal state transition.

### 4. Connection status shape

**Decision**: `connectionStatus: { basic: ConnectionStatus, details: ConnectionStatus }` using the existing `ConnectionStatus` type.

**Rationale**: Two independent WebSocket connections need independent status tracking. A flat union would lose granularity.

### 5. Error message as single string

**Decision**: `errorMessage: string | null` — only one error at a time.

**Rationale**: For this scale (two connections), a single error string is sufficient. If multiple errors could coexist, we'd need a list or map, but the UX (toast) only shows one error at a time anyway.

## Risks / Trade-offs

- **Risk**: `updatePlanes` runs on every basic WS message (~1 Hz). The auto-deselect check adds O(n) scan per update. → **Mitigation**: With 20 planes this is trivially fast. If scale grew, use a `Set<string>` for plane IDs.
- **Risk**: Stale `detailedPlane` if the details WS sends data after deselect. → **Mitigation**: The store's `setDetailedPlane` action ignores data when `selectedPlaneId` is null or doesn't match. (This guard will be implemented in the WebSocket service layer, but the store can also validate.)
- **Trade-off**: Separate `flightStore.types.ts` adds a file, but keeps type and implementation concerns cleanly separated for testability and documentation.
