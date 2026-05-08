## 1. Create Domain Type Definitions

- [x] 1.1 Create `fe/src/types/domain.ts` with `PlaneBasic` type (mirrors backend: `id`, `latitude`, `longitude`, `altitude`, `color`)
- [x] 1.2 Add `PlaneDetailed` type to `domain.ts` (all fields including nested `origin`/`destination` objects, `status` string union, `color`)
- [x] 1.3 Add `PlaneStatus` type alias for `"departed" | "enroute" | "cruising" | "landing"` and use it in `PlaneDetailed.status`
- [x] 1.4 Add `BasicPlanesMessage` type (`type: "planes"`, `data: PlaneBasic[]`)
- [x] 1.5 Add `PlaneDetailsMessage` type (`type: "plane-details"`, `data: PlaneDetailed`)
- [x] 1.6 Add `WsErrorMessage` type (`type: "error"`, `message: string`)
- [x] 1.7 Add `SubscribeMessage` type (`type: "subscribe"`, `planeId: string`)
- [x] 1.8 Add `IncomingWsMessage` discriminated union (`BasicPlanesMessage | PlaneDetailsMessage | WsErrorMessage`)
- [x] 1.9 Add `OutgoingWsMessage` discriminated union (`SubscribeMessage`)
- [x] 1.10 Add `ConnectionStatus` type (`"connected" | "connecting" | "disconnected`)

## 2. Update Barrel Exports

- [x] 2.1 Create or update `fe/src/types/index.ts` to re-export all types from `domain.ts` alongside existing `map.ts` exports

## 3. Write Tests

- [x] 3.1 Create `fe/src/types/domain.test.ts` with compile-time type assertions verifying discriminated union narrowing for `IncomingWsMessage`
- [x] 3.2 Add test verifying `PlaneStatus` rejects invalid string literals at compile time (type-level test)
- [x] 3.3 Add test verifying all domain type exports are accessible from `fe/src/types` barrel

## 4. Verify

- [x] 4.1 Run `tsc -b` to confirm no type errors
- [x] 4.2 Run `npm run lint` to confirm no lint violations
- [x] 4.3 Run `npm run test` to confirm all tests pass
