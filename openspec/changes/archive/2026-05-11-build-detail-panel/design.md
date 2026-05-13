## Context

The flight radar app already has a working map with plane markers, a Zustand flight store with `selectedPlaneId` and `detailedPlane` state, WebSocket hooks for basic and detail data, and an error toast component. The missing piece is the visual DetailPanel that users see when they select a plane — PLAN.md step 8. The existing `detail-panel` spec defines the behavioral requirements (slide animation, skeleton, close button, route arrow, header). This change implements the UI components, layout, and formatting utilities.

## Goals / Non-Goals

**Goals:**
- Build the DetailPanel component tree that renders all `PlaneDetailed` fields in organized, readable sections
- Provide formatting utilities for domain values (altitude → feet, speed → knots, heading → degrees, vertical speed → fpm, etc.)
- Implement responsive layout: 350px side panel on ≥640px (sm breakpoint), full-width on mobile
- Support loading skeleton state between selection and first `plane-details` message
- Ensure all components are testable with co-located unit/component tests

**Non-Goals:**
- Map marker rotation for selected planes (separate concern)
- Auto-pan map to keep selected marker visible (optional in PRD, not required)
- Offline caching or persistence of detailed data
- Animations beyond the slide-in/out CSS transition

## Decisions

### 1. Component decomposition into small, single-responsibility sections

**Decision**: Split the panel into `DetailPanel` → `DetailPanelHeader` + `DetailPanelContent` → five section components (`FlightInfoSection`, `RouteSection`, `PositionSection`, `FlightTimeSection`, `PassengersSection`), plus reusable `DetailSection` and `DetailRow` primitives.

**Rationale**: Each section handles one domain concern. This keeps files under the 200-line limit, makes each section independently testable, and follows SRP. The `DetailSection`/`DetailRow` primitives avoid duplication across sections.

**Alternatives considered**:
- Single monolithic `DetailPanel` component: would exceed 200 lines, hard to test, poor SRP
- One component per field: too granular, excessive prop drilling

### 2. Formatting utilities in a dedicated `utils/format.ts`

**Decision**: Extract all value formatting (altitude, speed, heading, vertical speed, duration, arrival time, passengers, coordinates) into pure functions in `fe/src/features/detail/utils/format.ts`.

**Rationale**: Pure functions are easy to unit test, follow the project rule of no helper functions inside components. Separating formatting from rendering keeps section components focused on layout.

**Alternatives considered**:
- Inline formatting in JSX: violates "no auxiliary functions inside components" rule
- A shared `utils/` at `fe/src/utils/`: formatting is specific to the detail panel domain, co-location is preferred

### 3. CSS transition with Tailwind for slide animation

**Decision**: Use `transform: translateX()` with `transition-transform duration-300 ease-in-out` Tailwind classes. Toggle between `translate-x-0` (open) and `translate-x-full` (closed) based on `selectedPlaneId !== null`.

**Rationale**: Simple, performant (GPU-accelerated transform), no JS animation library needed. Matches the PLAN.md guidance.

**Alternatives considered**:
- Framer Motion: overkill for a single slide transition, adds bundle size
- CSS `@keyframes`: more complex, harder to toggle with state

### 4. Skeleton using Tailwind `animate-pulse`

**Decision**: Use a `SkeletonBlock` component with `animate-pulse` divs of varying widths. Show 3 skeleton blocks when `detailedPlane` is null but `selectedPlaneId` is set.

**Rationale**: Minimal, accessible, no extra dependency. Matches the existing `detail-panel` spec requirement for pulsing skeleton placeholder.

### 5. Responsive via Tailwind breakpoints

**Decision**: `w-full sm:w-[350px]` on the panel container. On mobile it covers full width; on sm+ it's 350px as per PRD 6.1.

**Rationale**: Simple breakpoint, no JavaScript needed. PRD specifies 350px on desktop and a different layout on <768px; using `sm` (640px) is close enough and the full-width approach works well on tablets too.

## Risks / Trade-offs

- **[Panel obscures map on mobile]** → Full-width panel hides the map entirely on small screens. Mitigation: acceptable for MVP; a bottom-sheet pattern can be added later if needed.
- **[Rapid select/deselect can flash skeleton]** → If the user quickly selects and deselects, skeleton briefly appears. Mitigation: the CSS transition (300ms) smooths this; the panel slides in and then slides out.
- **[Format functions are unit-conversion-heavy]** → Altitude (m→ft), speed (m/s→knots), vertical speed (m/s→fpm) all convert from metric. Mitigation: comprehensive unit tests with known conversion values.
