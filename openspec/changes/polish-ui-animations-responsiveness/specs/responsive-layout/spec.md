## ADDED Requirements

### Requirement: Detail panel bottom sheet on mobile
On viewports narrower than 768px (below the `md` Tailwind breakpoint), the `DetailPanel` SHALL render as a bottom sheet: positioned at the bottom of the screen, full width, with a maximum height of 50% of the viewport. The panel SHALL slide up from below the viewport when opening and slide down when closing.

#### Scenario: Bottom sheet layout on mobile viewport
- **WHEN** the viewport width is below 768px and a plane is selected
- **THEN** the `DetailPanel` SHALL be positioned at the bottom of the screen
- **AND** the panel SHALL span the full width
- **AND** the panel height SHALL not exceed 50vh
- **AND** the panel SHALL overflow-y scroll for content that exceeds the height

#### Scenario: Bottom sheet animation on mobile
- **WHEN** a plane is selected on a viewport below 768px
- **THEN** the panel SHALL slide up from below the viewport using `translate-y` transition over 300ms
- **WHEN** the plane is deselected
- **THEN** the panel SHALL slide down below the viewport over 300ms

### Requirement: Detail panel right-side panel on desktop
On viewports 768px or wider (the `md` Tailwind breakpoint and above), the `DetailPanel` SHALL render as a right-side panel: positioned on the right edge, 350px wide, full height. The panel SHALL slide in from the right when opening and slide out when closing.

#### Scenario: Right-side panel layout on desktop viewport
- **WHEN** the viewport width is 768px or above and a plane is selected
- **THEN** the `DetailPanel` SHALL be positioned on the right edge of the screen
- **AND** the panel SHALL be 350px wide and full height

#### Scenario: Right-side panel animation on desktop
- **WHEN** a plane is selected on a viewport 768px or above
- **THEN** the panel SHALL slide in from the right using `translate-x` transition over 300ms
- **WHEN** the plane is deselected
- **THEN** the panel SHALL slide out to the right over 300ms

### Requirement: Responsive breakpoint at 768px
The layout switch between bottom sheet and right-side panel SHALL occur at the `md` (768px) Tailwind breakpoint. No intermediate layouts SHALL exist.

#### Scenario: Layout switches at breakpoint
- **WHEN** the viewport is resized from 767px to 768px
- **THEN** the `DetailPanel` SHALL switch from bottom-sheet layout to right-side panel layout
- **WHEN** the viewport is resized from 768px to 767px
- **THEN** the `DetailPanel` SHALL switch from right-side panel layout to bottom-sheet layout
