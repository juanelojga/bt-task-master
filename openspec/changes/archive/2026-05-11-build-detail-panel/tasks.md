## 1. Formatting Utilities

- [ ] 1.1 Create `fe/src/features/detail/utils/format.ts` with pure formatting functions: `formatAltitude`, `formatSpeed`, `formatHeading`, `formatVerticalSpeed`, `formatDuration`, `formatArrivalTime`, `formatPassengers`, `formatPosition`
- [ ] 1.2 Write unit tests in `fe/src/features/detail/utils/__tests__/format.test.ts` covering all formatting functions with known conversion values (including negative vertical speed, zero duration, edge cases)

## 2. Reusable Layout Primitives

- [ ] 2.1 Create `fe/src/features/detail/DetailSection.tsx` — section wrapper with uppercase title and children slot
- [ ] 2.2 Create `fe/src/features/detail/DetailRow.tsx` — label/value flex row component
- [ ] 2.3 Write component tests for `DetailSection` and `DetailRow` in `fe/src/features/detail/__tests__/`

## 3. Section Components

- [ ] 3.1 Create `fe/src/features/detail/FlightInfoSection.tsx` — flight number, airline, model, registration, status (capitalized)
- [ ] 3.2 Create `fe/src/features/detail/RouteSection.tsx` — origin/destination with arrow icon
- [ ] 3.3 Create `fe/src/features/detail/PositionSection.tsx` — coordinates, altitude, speed, heading, vertical speed (using format utilities)
- [ ] 3.4 Create `fe/src/features/detail/FlightTimeSection.tsx` — duration and estimated arrival (using format utilities)
- [ ] 3.5 Create `fe/src/features/detail/PassengersSection.tsx` — count over max with progress bar
- [ ] 3.6 Write component tests for all five section components in `fe/src/features/detail/__tests__/`

## 4. Skeleton and Header

- [ ] 4.1 Create `fe/src/features/detail/SkeletonBlock.tsx` — three animate-pulse bars of varying widths
- [ ] 4.2 Create `fe/src/features/detail/DetailPanelHeader.tsx` — flight number, airline, color bar, close button (X); skeleton placeholder when `plane` is null
- [ ] 4.3 Write component tests for `SkeletonBlock` and `DetailPanelHeader` in `fe/src/features/detail/__tests__/`

## 5. Panel Container and Content

- [ ] 5.1 Create `fe/src/features/detail/DetailPanelContent.tsx` — shows skeleton when `plane` is null, renders all five sections when `plane` is available
- [ ] 5.2 Create `fe/src/features/detail/DetailPanel.tsx` — slide-in/out container (fixed, right-0, translate-x transition), reads `selectedPlaneId`/`detailedPlane`/`deselectPlane` from flight store, responsive width (`w-full sm:w-[350px]`)
- [ ] 5.3 Write integration tests for `DetailPanel` covering slide animation, skeleton → data transition, close button, aria-hidden, responsive classes
- [ ] 5.4 Write component tests for `DetailPanelContent` covering skeleton and populated states

## 6. App Integration

- [ ] 6.1 Mount `DetailPanel` in `fe/src/App.tsx` alongside `MapView` and `ErrorToast`
- [ ] 6.2 Verify all existing tests pass (`npm run test`) and linting passes (`npm run lint`)
