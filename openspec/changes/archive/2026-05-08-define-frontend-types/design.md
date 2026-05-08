## Context

The frontend needs TypeScript type definitions for the flight radar domain. The backend (`be/src/types.ts`) defines the canonical shapes for `PlaneBasic`, `PlaneDetailed`, and WebSocket message types. The frontend must mirror these types as its own contract, since the backend and frontend are separate packages with no shared code.

The current frontend has only `fe/src/types/map.ts` (map config types). There is no `PlaneBasic`, `PlaneDetailed`, or WS message types defined yet, which blocks the implementation of the Zustand store, WebSocket service, and all UI components.

Per `PLAN.md` step 2 and `AGENTS.md`, backend types are the canonical source — frontend types must mirror them but live in `fe/src/types/`.

## Goals / Non-Goals

**Goals:**
- Define frontend types that mirror the backend's `PlaneBasic` and `PlaneDetailed` exactly.
- Define WebSocket message types as discriminated unions for type-safe message handling.
- Add a `ConnectionStatus` type for tracking WS connection states.
- Provide a single barrel export from `fe/src/types/` for easy consumption.
- Ensure all types are pure TypeScript (no runtime code, no new dependencies).

**Non-Goals:**
- Runtime validation or parsing of incoming WS messages (e.g., Zod schemas) — out of scope for this change.
- Generating types automatically from the backend — manual mirroring is acceptable for this project size.
- Refactoring existing `fe/src/types/map.ts` — leave it as-is.

## Decisions

### 1. Consolidate domain types into `fe/src/types/domain.ts`

**Decision**: Create a single `domain.ts` file containing `PlaneBasic`, `PlaneDetailed`, all WS message types, `ConnectionStatus`, and union types.

**Alternatives considered**:
- _Separate files_ (`plane.ts`, `messages.ts`, `connection.ts`): Better separation of concerns, but adds import overhead for types that are always used together and the file would still be well under the 200-line limit.
- _Extend `map.ts`_: Incorrect scope — map types are about MapLibre configuration, not domain data.

**Rationale**: At ~80 lines, a single file keeps all domain types co-located and easy to cross-reference. If it grows past 150 lines, it can be split later.

### 2. Use discriminated unions for WS messages

**Decision**: Define `IncomingWsMessage` as `BasicPlanesMessage | PlaneDetailsMessage | WsErrorMessage` and `OutgoingWsMessage` as `SubscribeMessage`. Each uses a `type` string literal field for discrimination.

**Rationale**: Discriminated unions enable exhaustive `switch`/`if` checking in message handlers. Adding a new message type later requires adding it to the union — TypeScript will flag any unhandled cases (OCP compliance per `AGENTS.md`).

### 3. Add `WsErrorMessage` not present in backend types

**Decision**: Define a `WsErrorMessage` type (`{ type: "error", message: string }`) in the frontend even though the backend exports it implicitly via WebSocket close codes and error messages.

**Rationale**: The PRD (FR-14, FR-15) and AGENTS.md explicitly require handling error messages from the backend. Having this type enables type-safe error handling in the WS message handler.

### 4. Use `type` aliases, not `interface`

**Decision**: Use `export type` for all domain types.

**Rationale**: `verbatimModuleSyntax` is enabled in `tsconfig.json`. Type aliases are preferred for union types and keep the export style consistent. `type` also makes it clear these are pure type definitions with no runtime impact.

### 5. Barrel re-export from `fe/src/types/index.ts`

**Decision**: Create/update `index.ts` to re-export everything from `domain.ts` and `map.ts`.

**Rationale**: Single import path (`fe/src/types`) for consumers. Keeps the public API stable if files are later split.

## Risks / Trade-offs

- **[Drift risk]** Backend types could change without the frontend being updated → Mitigation: The types are a small, focused set; a comment in `domain.ts` references `be/src/types.ts` as the canonical source. Automated checks are overkill for this project.
- **[No runtime validation]** Invalid or unexpected WS message shapes will cause runtime errors if not caught → Mitigation: The WS service layer should validate the `type` field before accessing `data`. Full schema validation can be added later if needed.
- **[Single file coupling]** All domain types in one file means any change touches the same module → Mitigation: At ~80 lines, this is not a concern yet. Split if it exceeds 150 lines.
