## 1. Map Loading Overlay

- [x] 1.1 Create `MapLoadingOverlay` component in `fe/src/features/map/MapLoadingOverlay.tsx` with centered spinner/pulse and "Loading map…" text
- [x] 1.2 Integrate `MapLoadingOverlay` into `MapView`, visible when `mapLoaded` is false, with fade-out transition on `mapLoaded` becoming true
- [x] 1.3 Write tests for `MapLoadingOverlay`: renders when `mapLoaded=false`, fades out when `mapLoaded=true`

## 2. Detail Panel Backdrop Overlay

- [x] 2.1 Add backdrop overlay `<div>` to `DetailPanel` component with `fixed inset-0 bg-black/30 z-30`, toggled by `isOpen`, with `transition-opacity duration-200`
- [x] 2.2 Add click handler on backdrop that calls `deselectPlane()`
- [x] 2.3 Write tests for backdrop: appears when panel is open, triggers deselect on click, fades out on close

## 3. Detail Panel Responsive Layout

- [x] 3.1 Update `DetailPanel` to use `md:` breakpoint (768px) for switching between bottom-sheet and right-side panel layouts
- [x] 3.2 Implement bottom-sheet layout: full width, `bottom-0`, max height `50vh`, `overflow-y-auto`, slide with `translate-y` on `<md`
- [x] 3.3 Implement right-side panel layout: `w-[350px]`, `right-0`, full height, slide with `translate-x` on `md:`
- [x] 3.4 Ensure z-index stacking: backdrop z-30, panel z-40, toast z-50
- [x] 3.5 Write tests for responsive layout: verify correct classes at mobile and desktop viewports

## 4. Section-Aware Detail Panel Skeletons

- [x] 4.1 Create skeleton section components in `fe/src/features/detail/skeletons/` (one per section: `FlightInfoSkeleton`, `RouteSkeleton`, `PositionSkeleton`, `FlightTimeSkeleton`, `PassengersSkeleton`)
- [x] 4.2 Update `DetailPanelContent` to render skeleton sections instead of `SkeletonBlock` when `detailedPlane` is null and `selectedPlaneId` is not null
- [x] 4.3 Write tests for section-aware skeletons: each skeleton renders with correct section title and row placeholders

## 5. ConnectionBanner Animation

- [x] 5.1 Add slide-down entry and slide-up exit animation to `ConnectionBanner` using `translate-y` with `transition duration-200`
- [x] 5.2 Write tests for banner animation: verify transition classes are applied on show/hide

## 6. NoticeToast Animation

- [x] 6.1 Add slide-in-from-right and fade-in entry animation to `NoticeToast` using `translate-x` + `opacity` with `transition duration-200`
- [x] 6.2 Add fade-out exit animation when notice is dismissed, with element removal after transition
- [x] 6.3 Write tests for toast animation: verify entry/exit transition classes

## 7. Cursor Feedback on Map

- [x] 7.1 Verify cursor changes to pointer when hovering over plane markers and reverts to default on mouse leave (check `useMapInteraction` hook)
- [x] 7.2 Add test for cursor pointer behavior on marker hover if not already covered

## 8. Final Verification

- [x] 8.1 Run `npm run lint` and `npm run test` in `fe/` — all must pass
- [x] 8.2 Manually verify: panel opens/closes smoothly on desktop and mobile viewports, backdrop dims map, loading overlay appears on first load, skeletons show correct layout, toast and banner animate in/out
