## ADDED Requirements

### Requirement: Map loading overlay
The system SHALL display a `MapLoadingOverlay` component inside `MapView` when `mapLoaded` is false. The overlay SHALL show a loading indicator and "Loading map…" text, centered over the map container. When `mapLoaded` becomes true, the overlay SHALL fade out and be removed from the DOM.

#### Scenario: Overlay visible during map initialization
- **WHEN** the MapView component mounts and `mapLoaded` is false
- **THEN** a loading overlay SHALL be displayed on top of the map container
- **AND** the overlay SHALL show a spinner or pulse animation and "Loading map…" text

#### Scenario: Overlay disappears after map loads
- **WHEN** `mapLoaded` transitions from false to true
- **THEN** the loading overlay SHALL fade out with a `transition-opacity` of 200ms
- **AND** the overlay SHALL be removed from the DOM after the transition completes

### Requirement: Section-aware detail panel skeleton
The system SHALL display section-aware skeleton placeholders in `DetailPanelContent` when `detailedPlane` is null but `selectedPlaneId` is not null. Each skeleton section SHALL visually mirror the layout of its corresponding content section (Flight Info, Route, Position, Flight Time, Passengers) with pulsing placeholder bars.

#### Scenario: Skeleton sections shown while loading details
- **WHEN** a plane is selected (`selectedPlaneId` is not null) and `detailedPlane` is null
- **THEN** `DetailPanelContent` SHALL render skeleton placeholders for all five sections
- **AND** each skeleton SHALL display a section title placeholder and row placeholders matching the real section layout

#### Scenario: Skeleton replaced by real content
- **WHEN** `detailedPlane` transitions from null to a `PlaneDetailed` object
- **THEN** the skeleton placeholders SHALL be replaced by the actual section components
- **AND** the transition SHALL be immediate with no flash of empty content

### Requirement: ConnectionBanner slide-down animation
The `ConnectionBanner` SHALL animate into view with a slide-down transition when it appears and slide-up when it disappears. The transition SHALL use `transform: translateY` with a duration of 200ms.

#### Scenario: Banner slides in when connection drops
- **WHEN** the basic WebSocket status changes from `connected` to `connecting` or `disconnected` (after the 1s delay)
- **THEN** the banner SHALL slide down from above the viewport into view over 200ms

#### Scenario: Banner slides out when connection restored
- **WHEN** the basic WebSocket status changes to `connected`
- **THEN** the banner SHALL slide up out of view over 200ms

### Requirement: NoticeToast entry and exit animation
The `NoticeToast` SHALL animate into view with a slide-in and fade-in transition when a notice appears, and animate out with a fade-out when dismissed. The entry animation SHALL slide from right with opacity 0→1 over 200ms. The exit animation SHALL fade opacity 1→0 over 150ms.

#### Scenario: Toast animates in when notice appears
- **WHEN** a notice is set in the store
- **THEN** the toast SHALL slide in from the right and fade in over 200ms

#### Scenario: Toast animates out when dismissed
- **WHEN** the notice is cleared (manually or after timeout)
- **THEN** the toast SHALL fade out over 150ms
- **AND** the toast element SHALL be removed from the DOM after the animation completes
