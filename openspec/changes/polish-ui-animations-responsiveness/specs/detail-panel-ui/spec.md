## MODIFIED Requirements

### Requirement: DetailPanel responsive width
The DetailPanel container SHALL have width `w-full` and position as a bottom sheet (max height 50vh) on screens below the `md` breakpoint (768px), and `w-[350px]` as a right-side panel (full height) on `md` and above.

#### Scenario: Bottom sheet on mobile
- **WHEN** the viewport width is below 768px
- **THEN** the panel SHALL occupy full width at the bottom of the screen
- **AND** the panel SHALL have a maximum height of 50vh

#### Scenario: 350px right-side panel on desktop
- **WHEN** the viewport width is 768px or above
- **THEN** the panel SHALL be 350px wide and positioned on the right edge
- **AND** the panel SHALL be full height
