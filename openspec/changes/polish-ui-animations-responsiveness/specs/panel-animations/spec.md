## ADDED Requirements

### Requirement: Backdrop overlay on panel open
When the `DetailPanel` is open, a semi-transparent backdrop overlay SHALL be displayed covering the map area. The backdrop SHALL have a `bg-black/30` background and fade in with a 200ms `transition-opacity`. Clicking the backdrop SHALL trigger `deselectPlane()`.

#### Scenario: Backdrop appears when panel opens
- **WHEN** a plane is selected and the panel opens
- **THEN** a semi-transparent backdrop overlay SHALL fade in over 200ms covering the map area
- **AND** the backdrop SHALL have `bg-black/30` opacity

#### Scenario: Backdrop disappears when panel closes
- **WHEN** the plane is deselected and the panel closes
- **THEN** the backdrop overlay SHALL fade out over 200ms
- **AND** the backdrop SHALL be removed from the DOM after the transition completes

#### Scenario: Clicking backdrop deselects plane
- **WHEN** the user clicks on the backdrop overlay
- **THEN** `deselectPlane()` SHALL be called
- **AND** the panel and backdrop SHALL animate out

### Requirement: Panel slide transition uses GPU-accelerated properties
All panel slide animations SHALL use `transform` (`translate-x` for desktop, `translate-y` for mobile) and SHALL NOT animate `width`, `height`, `top`, `left`, or `right` properties. The transition duration SHALL be 300ms with `ease-in-out` timing.

#### Scenario: Panel animation uses transform only
- **WHEN** the detail panel opens or closes
- **THEN** the animation SHALL only modify the `transform` CSS property
- **AND** the duration SHALL be 300ms with `ease-in-out` easing

### Requirement: Z-index layering for overlay and panel
The backdrop overlay SHALL have `z-index: 30` and the `DetailPanel` SHALL have `z-index: 40`. This ensures the panel renders above the backdrop, and both render above the map but below the `NoticeToast` (z-index: 50).

#### Scenario: Correct z-index stacking
- **WHEN** both backdrop and panel are visible
- **THEN** the backdrop SHALL render at z-index 30
- **AND** the panel SHALL render at z-index 40
- **AND** the NoticeToast at z-index 50 SHALL render above both
