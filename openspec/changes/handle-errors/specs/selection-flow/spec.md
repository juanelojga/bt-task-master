## MODIFIED Requirements

### Requirement: Selected plane disappearance triggers auto-deselect
If a selected plane is no longer present in the basic data update, the system SHALL auto-deselect and set an informational notice for the user.

#### Scenario: Plane removed from simulation while selected
- **WHEN** a `planes` message arrives that does not contain the currently selected plane ID
- **THEN** the store SHALL set `selectedPlaneId` to null and `detailedPlane` to null
- **AND** the detail panel SHALL close
- **AND** `setNotice({ message: 'Plane no longer available', severity: 'info' })` SHALL be called
- **AND** the notice toast SHALL be visible with info styling

### Requirement: Invalid subscription (code 1008) triggers auto-deselect and error
If the details WebSocket closes with code 1008, the system SHALL deselect the plane and show an error notice.

#### Scenario: Backend closes with code 1008
- **WHEN** the details WebSocket connection closes with close code 1008
- **THEN** `deselectPlane()` SHALL be called on the flight store
- **AND** `setNotice({ message: 'Plane not found or subscription invalid', severity: 'error' })` SHALL be called
- **AND** the notice toast SHALL be visible with error styling
