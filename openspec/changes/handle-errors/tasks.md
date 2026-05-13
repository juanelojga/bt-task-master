## 1. Store: Notice Type System

- [x] 1.1 Define `Notice` type in `fe/src/types/domain.ts` with `message: string` and `severity: 'error' | 'warning' | 'info'` fields
- [x] 1.2 Update `FlightStoreState` in `fe/src/features/store/flightStore.types.ts` — replace `errorMessage: string | null` with `notice: Notice | null`
- [x] 1.3 Update `FlightStoreActions` — replace `setError(msg: string)` and `clearError()` with `setNotice(notice: Notice)` and `clearNotice()`
- [x] 1.4 Implement `setNotice` and `clearNotice` actions in `fe/src/features/store/hooks/useFlightStore.ts`, replacing `setError` / `clearError`
- [x] 1.5 Update `updatePlanes` action to call `setNotice({ message: 'Plane no longer available', severity: 'info' })` instead of silent auto-deselect
- [x] 1.6 Write/update unit tests in `fe/src/features/store/__tests__/useFlightStore.test.ts` for new notice actions and updated `updatePlanes` behavior

## 2. Hooks: Migrate to Notice Actions

- [x] 2.1 Update `useBasicWebSocket` to call `setNotice({ message, severity: 'error' })` instead of `setError(msg)`, and `clearNotice` instead of `clearError`
- [x] 2.2 Update `useDetailWebSocket` to call `setNotice` with appropriate severity (`'error'` for 1008 close and reconnection exhaustion, `'error'` for WS error messages) and `clearNotice` on successful plane-details
- [x] 2.3 Update `fe/src/features/store/hooks/useFlightSelectors.ts` — replace `errorMessage` selector with `notice` selector
- [x] 2.4 Update selector tests in `fe/src/features/store/hooks/__tests__/useFlightSelectors.test.tsx`
- [x] 2.5 Update hook tests in `fe/src/lib/hooks/__tests__/useBasicWebSocket.test.ts` and `fe/src/lib/hooks/__tests__/useDetailWebSocket.test.ts`

## 3. UI: NoticeToast Component (rename from ErrorToast)

- [x] 3.1 Rename `fe/src/features/ui/ErrorToast.tsx` to `fe/src/features/ui/NoticeToast.tsx` and rename the exported component
- [x] 3.2 Update `NoticeToast` to read `notice` from store instead of `errorMessage`, and call `clearNotice` instead of `clearError`
- [x] 3.3 Add severity-based Tailwind styling: red for `'error'`, amber for `'warning'`, blue for `'info'`
- [x] 3.4 Update `fe/src/App.tsx` import from `ErrorToast` to `NoticeToast`
- [x] 3.5 Update component tests in `fe/src/features/ui/__tests__/ErrorToast.test.tsx` → rename and update for notice type + severity styling assertions

## 4. UI: ConnectionBanner Component

- [x] 4.1 Create `fe/src/features/ui/ConnectionBanner.tsx` — reads `connectionStatus.basic` from store, shows banner for `'connecting'` / `'disconnected'` with 1-second display delay
- [x] 4.2 Add "Reconnecting…" text with animated indicator for `'connecting'`, "Connection lost" text for `'disconnected'`
- [x] 4.3 Write component tests in `fe/src/features/ui/__tests__/ConnectionBanner.test.tsx`
- [x] 4.4 Add `ConnectionBanner` to `fe/src/App.tsx` rendering, positioned above the map

## 5. UI: Detail Panel Reconnecting Badge

- [x] 5.1 Update `fe/src/features/detail/DetailPanelHeader.tsx` to read `connectionStatus.details` from store and show a "Reconnecting…" badge when status is `'connecting'` or `'disconnected'` and `selectedPlaneId` is non-null
- [x] 5.2 Update `fe/src/features/detail/__tests__/DetailPanelHeader.test.tsx` to cover the reconnecting badge scenarios

## 6. Cleanup & Integration

- [x] 6.1 Remove any remaining references to `errorMessage`, `setError`, `clearError` across the codebase
- [x] 6.2 Run `npm run lint` and `npm run test` in `fe/` to verify all changes pass
- [x] 6.3 Manual integration test: start backend, verify connection banner appears/disappears, verify notice toast shows different colors, verify reconnecting badge in detail panel
