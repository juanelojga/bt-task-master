## 1. Empty-Map Click Deselection

- [ ] 1.1 Add `createMapClickDeselectHandler` utility to `fe/src/features/map/utils/interaction.ts` — a map-level click handler that calls `deselectPlane()` when no plane feature is found at the click point
- [ ] 1.2 Update `useMapInteraction` hook to register the map-level click deselect handler alongside the existing planes-layer click handler
- [ ] 1.3 Write unit tests for `createMapClickDeselectHandler` in `fe/src/features/map/utils/__tests__/interaction.test.ts`
- [ ] 1.4 Update `useMapInteraction` tests for the new handler registration

## 2. Error Toast Component

- [ ] 2.1 Create `fe/src/features/ui/ErrorToast.tsx` — reads `errorMessage` from flight store, renders a top-right toast with dismiss button, auto-dismisses after 5 seconds via `clearError()`
- [ ] 2.2 Write component tests for `ErrorToast` in `fe/src/features/ui/__tests__/ErrorToast.test.tsx`

## 3. Detail Panel Component

- [ ] 3.1 Create `fe/src/features/detail/DetailPanel.tsx` — slides in from right when `selectedPlaneId` is set, shows loading skeleton when `detailedPlane` is null, renders all PlaneDetailed fields when data is available, includes close button calling `deselectPlane()`
- [ ] 3.2 Create field formatting utilities in `fe/src/features/detail/utils/format.ts` — format altitude, speed, heading, vertical speed, duration, arrival time, passenger count
- [ ] 3.3 Write unit tests for formatting utilities in `fe/src/features/detail/utils/__tests__/format.test.ts`
- [ ] 3.4 Write component tests for `DetailPanel` in `fe/src/features/detail/__tests__/DetailPanel.test.tsx` — covers: slide-in on selection, skeleton loading, field rendering, close button deselect, slide-out on deselection

## 4. Integration — Wire Components into App

- [ ] 4.1 Update `fe/src/App.tsx` to render `DetailPanel` and `ErrorToast` alongside `MapView` with correct layout (map full-screen, panel overlay right, toast top-right)
- [ ] 4.2 Add Tailwind transition classes for panel slide-in/out (`translate-x-0` / `translate-x-full` with `transition-transform`)
- [ ] 4.3 Verify end-to-end selection flow: click plane → panel slides in with skeleton → data loads → data displays → close button → panel slides out → details WS disconnects

## 5. Edge Cases & Error Handling

- [ ] 5.1 Verify that invalid subscription (code 1008) shows error toast, deselects plane, and closes panel
- [ ] 5.2 Verify that switching selected planes sends new subscribe and updates panel content
- [ ] 5.3 Verify that plane disappearing from basic list auto-deselects and closes panel with an info message
- [ ] 5.4 Verify that clicking empty map area deselects the current plane and closes the panel
