## Context

The Flight Radar frontend has a working map with plane markers, a flight store with selection actions, a detail WebSocket hook, and map selection highlight visuals. However, there is no UI for displaying detailed flight data and no end-to-end selection flow visible to the user. The store actions (`selectPlane`, `deselectPlane`) and WebSocket hooks (`useDetailWebSocket`) exist but nothing renders the results. The map click handler in `interaction.ts` already dispatches `selectPlane`/`deselectPlane`, but there is no way to deselect by clicking empty map area, and no visual feedback beyond the highlight circle.

## Goals / Non-Goals

**Goals:**
- Deliver a complete selection/deselection loop: click plane → see detail panel → close/deselect → panel disappears
- Surface `detailedPlane` data in a dedicated side panel with real-time updates
- Show non-blocking error toasts for WebSocket errors (code 1008, general errors)
- Support deselection via: close button, clicking already-selected plane, clicking empty map area
- Handle edge case where selected plane disappears from the basic list

**Non-Goals:**
- Responsive bottom-sheet layout for mobile (<768px) — deferred to a future change
- Map panning/flyTo on selection — nice-to-have, not in scope
- Tooltip on marker hover — deferred
- Keyboard accessibility for selection — deferred

## Decisions

### 1. DetailPanel as a separate feature module

**Decision**: Create `fe/src/features/detail/` with `DetailPanel.tsx`, its hooks, and utils.

**Rationale**: Follows the existing feature-folder convention (`map/`, `store/`). The detail panel has its own rendering concerns (field formatting, loading skeleton) and should not live inside the map module. The store is the shared interface between map and detail panel.

**Alternative considered**: Put DetailPanel in `fe/src/components/DetailPanel/`. Rejected because the project uses feature-based organization, not component-type folders.

### 2. ErrorToast as a shared component in `fe/src/features/ui/`

**Decision**: Create `fe/src/features/ui/ErrorToast.tsx` as a small, reusable toast component.

**Rationale**: Error toasts are not specific to one feature — both WebSocket connections can emit errors. A shared UI module keeps it accessible from `App.tsx` without coupling to map or detail.

### 3. Empty-map click deselection via map-level click handler

**Decision**: Add a click handler on the map (not the planes layer) that calls `deselectPlane()` when the click does not hit a plane feature. This will be added to `interaction.ts` as `createMapClickDeselectHandler`.

**Rationale**: MapLibre's `map.on('click')` fires for all clicks. We check `queryRenderedFeatures` — if empty, the user clicked empty space. This is simpler than tracking click-outside on the panel DOM.

**Alternative considered**: A `useClickOutside` hook on the panel. Rejected because the map canvas intercepts pointer events; a DOM-based outside-click approach would not work reliably.

### 4. Panel slide-in with Tailwind transitions

**Decision**: Use `transform: translateX(0)` / `translateX(100%)` with `transition-transform` for the panel slide animation. Conditionally render content but keep the panel container always mounted to allow exit animation.

**Rationale**: Pure Tailwind, no extra dependencies. CSS transitions are simpler than `framer-motion` for a single-axis slide. Keeping the container mounted avoids unmount-before-animation issues.

### 5. Loading skeleton while awaiting detailed data

**Decision**: Show a pulsing skeleton placeholder in the detail panel when `selectedPlaneId` is set but `detailedPlane` is null.

**Rationale**: The detail WS may take a moment to connect and return the first message. A skeleton avoids layout shift and gives immediate feedback that data is loading.

### 6. No changes to the flight store

**Decision**: The existing store actions and state shape are sufficient. `selectPlane` clears `detailedPlane`, `deselectPlane` clears both, `setDetailedPlane` guards on ID match, `setError`/`clearError` manage the message. No new actions needed.

**Rationale**: The store was designed for this flow. Adding selectors or actions would be over-engineering.

## Risks / Trade-offs

- **[Risk] Panel covers map area on narrow screens** → Mitigation: For now, the panel overlays with a fixed 350px width. Mobile layout is a non-goal; a future change adds responsive bottom-sheet behavior.
- **[Risk] Empty-map click could interfere with map drag/pan** → Mitigation: MapLibre's `click` event only fires on true clicks (mousedown + mouseup at same point), not on drag. No conflict.
- **[Risk] Toast auto-dismiss timing could hide important errors** → Mitigation: Use a 5-second auto-dismiss with a manual dismiss button. Critical errors (code 1008) also trigger deselection, so the user isn't stuck.
