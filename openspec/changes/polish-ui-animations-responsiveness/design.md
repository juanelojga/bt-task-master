## Context

The Flight Radar frontend has all core features implemented: map with plane markers, WebSocket integration, detail panel, connection banner, and error toast. However, the UI lacks polish in three key areas: (1) the detail panel uses a basic `translate-x` transition but no backdrop overlay or refined animation, (2) there's no loading indicator for the map while MapLibre initializes, and (3) the responsive layout is incomplete — the panel uses `sm:w-[350px]` but there's no bottom-sheet behavior for mobile, and the existing SkeletonBlock only shows inside the detail panel content, not during map load.

Current state:
- `DetailPanel`: `translate-x-0` / `translate-x-full` transition with `duration-300`, no backdrop overlay
- `MapView`: no loading state shown to user while map tiles load
- `SkeletonBlock`: exists but only used inside `DetailPanelContent`
- `ConnectionBanner`: appears/disappears with a 1s delay but no transition
- `NoticeToast`: no entry/exit animation

## Goals / Non-Goals

**Goals:**
- Add smooth slide-in/slide-out animation for the detail panel with a semi-transparent backdrop overlay that dims the map
- Implement a bottom-sheet layout for the detail panel on screens < 768px (md breakpoint), replacing the right-side panel
- Add a loading overlay on the map while MapLibre initializes
- Enhance the detail panel loading state with skeleton sections that mirror the actual content layout
- Add entry/exit animations for ConnectionBanner and NoticeToast
- Ensure cursor feedback is correct (pointer on plane markers, default elsewhere)

**Non-Goals:**
- Re-architecting existing components or state management
- Adding new features (filtering, search, settings)
- Changing WebSocket or store logic
- Supporting screen sizes below 320px width
- Adding map pan-to-selected-plane behavior

## Decisions

### Decision 1: Use Tailwind CSS transitions and animations exclusively
**Choice**: Pure Tailwind classes (`transition-*`, `animate-*`, custom `@keyframes` in `index.css`)
**Alternative**: Framer Motion library for animation orchestration
**Rationale**: The project explicitly prohibits additional CSS libraries beyond Tailwind. Framer Motion would add a dependency for marginal benefit when our animations are simple slides and fades. Custom `@keyframes` in `index.css` handle the few cases Tailwind utilities don't cover.

### Decision 2: Bottom sheet via CSS-only breakpoint switch
**Choice**: Use Tailwind responsive prefixes (`md:`) to switch between right-side panel and bottom-sheet layout within the same `DetailPanel` component. On `<768px`, the panel positions at bottom with `translate-y`; on `≥768px`, positions at right with `translate-x`.
**Alternative**: Separate `MobileDetailSheet` and `DesktopDetailPanel` components
**Rationale**: The content is identical; only position and slide direction differ. A single component with responsive classes avoids duplication and keeps the animation logic centralized. The `md` breakpoint (768px) matches the PRD's mobile threshold.

### Decision 3: Backdrop overlay as a sibling element in `DetailPanel`
**Choice**: Render a `<div>` with `fixed inset-0 bg-black/30` before the panel div, with its own `transition-opacity` for fade in/out. Click on backdrop triggers `deselectPlane()`.
**Alternative**: Render backdrop from `App.tsx` or a portal
**Rationale**: Keeping it co-located with `DetailPanel` makes the open/close lifecycle self-contained. The backdrop and panel share the same `isOpen` condition, so they animate in unison without prop drilling.

### Decision 4: Map loading overlay controlled by `mapLoaded` state
**Choice**: Add a `MapLoadingOverlay` component inside `MapView` that shows when `mapLoaded` is false. Uses a spinner or pulsing plane icon with "Loading map…" text. Fades out when `mapLoaded` becomes true.
**Alternative**: Show loading at the `App` level before mounting `MapView`
**Rationale**: The map container must be in the DOM for MapLibre to initialize. The overlay sits on top of the empty container and disappears once the map's `load` event fires. This avoids layout shift and keeps loading concern inside `MapView`.

### Decision 5: Enhanced skeleton with section-aware placeholders
**Choice**: Replace the single `SkeletonBlock` in `DetailPanelContent` with section-specific skeleton components (e.g., `FlightInfoSkeleton`, `RouteSkeleton`) that mirror the real content layout, giving users a preview of the incoming data structure.
**Alternative**: Keep the generic `SkeletonBlock` as-is
**Rationale**: Section-aware skeletons reduce perceived latency and look more professional. They're simple to implement since we already know the section structure.

### Decision 6: Entry/exit animations for toast and banner using CSS transitions
**Choice**: For `NoticeToast`, add `opacity` and `translate-y` transitions with a mounting pattern (render always, toggle visibility classes). For `ConnectionBanner`, add a slide-down transition.
**Alternative**: Use `framer-motion` `AnimatePresence`
**Rationale**: Consistent with Decision 1 — pure CSS/Tailwind. The mounting pattern requires keeping the element in the DOM with `pointer-events-none` and `opacity-0` when hidden, transitioning to visible. Alternatively, use `@starting-style` for entry animations in CSS, but browser support is still evolving. The simplest approach: toggle classes and use `transition-all duration-200`.

## Risks / Trade-offs

- **[Risk] Bottom-sheet gesture support** → We're using CSS-only layout switching, not a drag-to-dismiss gesture library. The bottom sheet will have a close button but no swipe-down dismiss. This is acceptable for the interview scope and avoids a touch gesture library dependency.

- **[Risk] Animation performance on low-end devices** → Multiple simultaneous CSS transitions (backdrop + panel + skeleton pulse) could cause jank on very low-end devices. Mitigation: Use `transform` and `opacity` only (GPU-accelerated properties), avoid animating `width`/`height`.

- **[Risk] Responsive testing complexity** → Two layout modes double the visual regression surface. Mitigation: Component tests should render at both breakpoints using `@testing-library/react` with custom viewport mocks.

- **[Trade-off] Keeping backdrop in DetailPanel vs App** → Co-locating keeps the component self-contained but means `DetailPanel` renders two root-level fixed elements. This is fine since they're siblings and z-index is managed consistently.
