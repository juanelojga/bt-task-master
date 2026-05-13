## ADDED Requirements

### Requirement: DetailPanel component tree structure
The detail panel SHALL be composed of a `DetailPanel` container that renders `DetailPanelHeader` and `DetailPanelContent`. `DetailPanelContent` SHALL render five section components: `FlightInfoSection`, `RouteSection`, `PositionSection`, `FlightTimeSection`, and `PassengersSection`. Reusable `DetailSection` (section wrapper with title) and `DetailRow` (label-value pair) primitives SHALL be used across sections.

#### Scenario: Component tree renders all sections
- **WHEN** `detailedPlane` is not null
- **THEN** `DetailPanel` SHALL render `DetailPanelHeader` followed by `DetailPanelContent`
- **AND** `DetailPanelContent` SHALL render `FlightInfoSection`, `RouteSection`, `PositionSection`, `FlightTimeSection`, and `PassengersSection` in that order

### Requirement: FlightInfoSection displays flight identification fields
`FlightInfoSection` SHALL display flight number, airline, aircraft model, registration, and status (capitalized first letter) using `DetailRow` primitives inside a `DetailSection` titled "Flight Information".

#### Scenario: Flight info section renders all fields
- **WHEN** `FlightInfoSection` receives a `PlaneDetailed` object
- **THEN** it SHALL display rows for Flight Number, Airline, Aircraft Model, Registration, and Status
- **AND** the Status value SHALL have its first character capitalized

### Requirement: RouteSection displays origin and destination with arrow
`RouteSection` SHALL display origin airport code and city on the left, a right-arrow icon in the center, and destination airport code and city on the right, inside a `DetailSection` titled "Route".

#### Scenario: Route section renders origin and destination
- **WHEN** `RouteSection` receives a `PlaneDetailed` object with origin `{ airport: 'JFK', city: 'New York' }` and destination `{ airport: 'LAX', city: 'Los Angeles' }`
- **THEN** it SHALL display "JFK" and "New York" on the left
- **AND** display a right-arrow icon in the center
- **AND** display "LAX" and "Los Angeles" on the right

### Requirement: PositionSection displays formatted navigation data
`PositionSection` SHALL display coordinates (lat/lng to 4 decimal places), altitude (meters→feet with comma separator), speed (m/s→knots), heading (degrees with ° symbol), and vertical speed (m/s→fpm with +/− prefix) using `DetailRow` primitives inside a `DetailSection` titled "Position".

#### Scenario: Position section renders formatted values
- **WHEN** `PositionSection` receives a `PlaneDetailed` object with altitude 10668, speed 250, heading 270, verticalSpeed 5.08, latitude 40.7128, longitude -74.006
- **THEN** it SHALL display altitude as "35,000 ft"
- **AND** display speed as "486 knots"
- **AND** display heading as "270°"
- **AND** display vertical speed as "+1,000 fpm"
- **AND** display coordinates as "40.7128, -74.006"

### Requirement: FlightTimeSection displays duration and estimated arrival
`FlightTimeSection` SHALL display flight duration (seconds→hours and minutes) and estimated arrival (Unix timestamp→local time string) using `DetailRow` primitives inside a `DetailSection` titled "Flight Time".

#### Scenario: Flight time section renders formatted values
- **WHEN** `FlightTimeSection` receives a `PlaneDetailed` object with flightDuration 7200
- **THEN** it SHALL display duration as "2h 0m"

### Requirement: PassengersSection displays count and capacity progress bar
`PassengersSection` SHALL display the passenger count as "current / max" and a progress bar whose width is `(current/max)*100%`, inside a `DetailSection` titled "Passengers".

#### Scenario: Passengers section renders count and progress bar
- **WHEN** `PassengersSection` receives a `PlaneDetailed` object with numberOfPassengers 180 and maxPassengers 200
- **THEN** it SHALL display "180 / 200"
- **AND** the progress bar width SHALL be 90%

### Requirement: DetailSection and DetailRow reusable layout primitives
`DetailSection` SHALL render a section title (uppercase, small, tracking-wide) and children. `DetailRow` SHALL render a label (left-aligned, muted) and value (right-aligned, medium weight) in a flex row.

#### Scenario: DetailSection renders title and children
- **WHEN** `DetailSection` receives title "Position" and child content
- **THEN** it SHALL render the title as an uppercase heading
- **AND** render the children below

#### Scenario: DetailRow renders label and value
- **WHEN** `DetailRow` receives label "Altitude" and value "35,000 ft"
- **THEN** it SHALL render "Altitude" left-aligned and "35,000 ft" right-aligned

### Requirement: Formatting utilities are pure functions
All formatting functions (`formatAltitude`, `formatSpeed`, `formatHeading`, `formatVerticalSpeed`, `formatDuration`, `formatArrivalTime`, `formatPassengers`, `formatPosition`) SHALL be pure functions exported from `fe/src/features/detail/utils/format.ts`. Each SHALL accept numeric inputs and return a formatted string.

#### Scenario: formatAltitude converts meters to feet
- **WHEN** `formatAltitude(10668)` is called
- **THEN** it SHALL return "35,000 ft"

#### Scenario: formatSpeed converts m/s to knots
- **WHEN** `formatSpeed(250)` is called
- **THEN** it SHALL return "486 knots"

#### Scenario: formatHeading adds degree symbol
- **WHEN** `formatHeading(270)` is called
- **THEN** it SHALL return "270°"

#### Scenario: formatVerticalSpeed converts m/s to fpm with sign
- **WHEN** `formatVerticalSpeed(5.08)` is called
- **THEN** it SHALL return "+1,000 fpm"

#### Scenario: formatVerticalSpeed shows negative for descent
- **WHEN** `formatVerticalSpeed(-2.54)` is called
- **THEN** it SHALL return "-500 fpm"

#### Scenario: formatDuration converts seconds to hours and minutes
- **WHEN** `formatDuration(7200)` is called
- **THEN** it SHALL return "2h 0m"

#### Scenario: formatPassengers formats current over max
- **WHEN** `formatPassengers(180, 200)` is called
- **THEN** it SHALL return "180 / 200"

#### Scenario: formatPosition formats coordinates to 4 decimal places
- **WHEN** `formatPosition(40.7128, -74.006)` is called
- **THEN** it SHALL return "40.7128, -74.006"

### Requirement: SkeletonBlock loading placeholder
`SkeletonBlock` SHALL render a group of three `animate-pulse` bars of varying widths (3/4, 1/2, 2/3) as a loading placeholder.

#### Scenario: SkeletonBlock renders pulsing bars
- **WHEN** `SkeletonBlock` is rendered
- **THEN** it SHALL display three `animate-pulse` elements with widths 75%, 50%, and 66%

### Requirement: DetailPanel responsive width
The DetailPanel container SHALL have width `w-full` on screens below the `sm` breakpoint (640px) and `w-[350px]` on `sm` and above.

#### Scenario: Full width on mobile
- **WHEN** the viewport width is below 640px
- **THEN** the panel SHALL occupy full width

#### Scenario: 350px on desktop
- **WHEN** the viewport width is 640px or above
- **THEN** the panel SHALL be 350px wide
