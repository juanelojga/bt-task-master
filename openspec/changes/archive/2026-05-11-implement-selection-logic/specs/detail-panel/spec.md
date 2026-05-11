## ADDED Requirements

### Requirement: Detail panel displays detailed plane information
The detail panel SHALL render all fields from `detailedPlane` when available: model, airline, flight number, registration, position (latitude, longitude, altitude), speed, heading, vertical speed, origin/destination, flight duration, estimated arrival, passengers, and status.

#### Scenario: Panel shows all detailed fields
- **WHEN** `detailedPlane` is not null and `selectedPlaneId` is not null
- **THEN** the panel SHALL display all PlaneDetailed fields in organized sections

#### Scenario: Panel updates on new detailed data
- **WHEN** a new `plane-details` message arrives for the selected plane
- **THEN** the panel SHALL re-render with updated values without closing or resetting scroll position

### Requirement: Detail panel shows loading skeleton while awaiting data
When a plane is selected but `detailedPlane` is still null, the panel SHALL display a loading skeleton placeholder.

#### Scenario: Skeleton shown after selection before data arrives
- **WHEN** `selectedPlaneId` is not null and `detailedPlane` is null
- **THEN** the panel SHALL display a pulsing skeleton placeholder in place of the detail fields

#### Scenario: Skeleton replaced by data
- **WHEN** `detailedPlane` transitions from null to a value while `selectedPlaneId` is still set
- **THEN** the skeleton SHALL be replaced by the actual detail content

### Requirement: Detail panel slides in on selection and out on deselection
The panel SHALL use a slide-in animation from the right when a plane is selected, and a slide-out animation when deselected.

#### Scenario: Panel slides in on selection
- **WHEN** `selectedPlaneId` changes from null to a non-null value
- **THEN** the panel SHALL animate from off-screen right to its visible position

#### Scenario: Panel slides out on deselection
- **WHEN** `selectedPlaneId` changes from a non-null value to null
- **THEN** the panel SHALL animate from its visible position to off-screen right

### Requirement: Detail panel has a close button
The panel SHALL include a close button that calls `deselectPlane()`.

#### Scenario: Close button deselects plane
- **WHEN** the user clicks the close button on the detail panel
- **THEN** `deselectPlane()` SHALL be called on the flight store

### Requirement: Detail panel displays flight route with arrow
The origin and destination SHALL be displayed with an arrow between them (e.g., "JFK (New York) → LAX (Los Angeles").

#### Scenario: Route displayed with arrow
- **WHEN** `detailedPlane` has origin and destination data
- **THEN** the panel SHALL display origin airport code and city, followed by an arrow, followed by destination airport code and city

### Requirement: Detail panel displays header with flight number and airline
The panel header SHALL show the flight number and airline name, with a color bar matching the plane's color.

#### Scenario: Header shows flight number and color
- **WHEN** `detailedPlane` is available
- **THEN** the panel header SHALL display the flight number and airline
- **AND** a color bar SHALL be rendered matching the plane's `color` field
