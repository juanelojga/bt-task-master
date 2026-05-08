## 1. Create Domain Type Definitions

- [ ] 1.1 Create `fe/src/types/domain.ts` with `PlaneBasic` type (mirrors backend: `id`, `latitude`, `longitude`, `altitude`, `color`)
- [ ] 1.2 Add `PlaneDetailed` type to `domain.ts` (all fields including nested `origin`/`destination` objects, `status` string union, `color`)
- [ ] 1.3 Add `PlaneStatus` type alias for `"departed" | "enroute" | "cruising" | "landing"` and use it in `PlaneDetailed.status`
- [ ] 1.4 Add `BasicPlanesMessage` type (`type: "planes"`, `data: PlaneBasic[]`)
- [ ] 1.5 Add `PlaneDetailsMessage` type (`type: "plane-details"`, `data: PlaneDetailed`)
- [ ] 1.6 Add `WsErrorMessage` type (`type: "error"`, `message: string`)
- [ ] 1.7 Add `SubscribeMessage` type (`type: "subscribe"`, `planeId: string`)
- [ ] 1.8 Add `IncomingWsMessage` discriminated union (`BasicPlanesMessage | PlaneDetailsMessage | WsErrorMessage`)
- [ ] 1.9 Add `OutgoingWsMessage` discriminated union (`SubscribeMessage`)
- [ ] 1.10 Add `ConnectionStatus` type (`"connected" | "connecting" | "disconnected"`)

## 2. Update Barrel Exports

- [ ] 2.1 Create or update `fe/src/types/index.ts` to re-export all types from `domain.ts` alongside existing `map.ts` exports

## 3. Write Tests

- [ ] 3.1 Create `fe/src/types/domain.test.ts` with compile-time type assertions verifying discriminated union narrowing for `IncomingWsMessage`
- [ ] 3.2 Add test verifying `PlaneStatus` rejects invalid string literals at compile time (type-level test)
- [ ] 3.3 Add test verifying all domain type exports are accessible from `fe/src/types` barrel

## 4. Verify

- [ ] 4.1 Run `tsc -b` to confirm no type errors
- [ ] 4.2 Run `npm run lint` to confirm no lint violations
- [ ] 4.3 Run `npm run test` to confirm all tests pass
