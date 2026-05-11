# selection-flow Specification

## Purpose
TBD - created by archiving change implement-selection-logic. Update Purpose after archive.
## Requirements
### Requirement: Clicking a plane marker triggers details WebSocket subscription
When a user clicks an unselected plane marker on the map, the system SHALL dispatch `selectPlane(id)` to the flight store, which SHALL cause `useDetailWebSocket` to open a details WebSocket connection (if not already open) and send a `{ type: "subscribe", planeId: id }` message.

#### Scenario: Selecting a plane opens details subscription
- **WHEN** the user clicks a plane marker that is not currently selected
- **THEN** `selectPlane(planeId)` SHALL be called on the flight store
- **AND** the details WebSocket SHALL send a subscribe message for that plane ID

#### Scenario: Switching selected plane sends new subscribe
- **WHEN** the user clicks a different plane marker while one is already selected
- **THEN** `selectPlane(newPlaneId)` SHALL be called on the flight store
- **AND** the details WebSocket SHALL send a subscribe message for the new plane ID on the existing connection

### Requirement: Deselecting a plane closes details WebSocket and clears data
When a plane is deselected, the system SHALL close the details WebSocket connection and clear `detailedPlane` from the store.

#### Scenario: Deselecting via close button closes details connection
- **WHEN** the user clicks the close button on the detail panel
- **THEN** `deselectPlane()` SHALL be called on the flight store
- **AND** the details WebSocket SHALL disconnect
- **AND** `detailedPlane` SHALL be set to null

#### Scenario: Deselecting via clicking already-selected plane
- **WHEN** the user clicks the currently selected plane marker again
- **THEN** `deselectPlane()` SHALL be called on the flight store
- **AND** the details WebSocket SHALL disconnect

#### Scenario: Deselecting via clicking empty map area
- **WHEN** the user clicks on the map but not on any plane marker
- **THEN** `deselectPlane()` SHALL be called on the flight store
- **AND** the details WebSocket SHALL disconnect

### Requirement: Invalid subscription (code 1008) triggers auto-deselect and error
If the details WebSocket closes with code 1008, the system SHALL deselect the plane and show an error toast.

#### Scenario: Backend closes with code 1008
- **WHEN** the details WebSocket connection closes with close code 1008
- **THEN** `deselectPlane()` SHALL be called on the flight store
- **AND** `setError()` SHALL be called with a message indicating invalid subscription
- **AND** the error toast SHALL be visible

### Requirement: Selected plane disappearance triggers auto-deselect
If a selected plane is no longer present in the basic data update, the system SHALL auto-deselect and notify the user.

#### Scenario: Plane removed from simulation while selected
- **WHEN** a `planes` message arrives that does not contain the currently selected plane ID
- **THEN** the store SHALL set `selectedPlaneId` to null and `detailedPlane` to null
- **AND** the detail panel SHALL close
- **AND** an error or info message SHALL indicate the plane is no longer available

