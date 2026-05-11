## MODIFIED Requirements

### Requirement: Click on plane marker selects the plane
Clicking a circle marker in the `planes` layer SHALL dispatch `selectPlane(id)` to the flight store, where `id` is the plane's feature ID. Clicking on the map outside any plane marker SHALL dispatch `deselectPlane()` to the flight store.

#### Scenario: Click unselected plane selects it
- **WHEN** the user clicks a plane marker in the `planes` layer that is not currently selected
- **THEN** `selectPlane(planeId)` SHALL be called on the flight store with the clicked feature's ID

#### Scenario: Click already-selected plane deselects it
- **WHEN** the user clicks a plane marker whose ID matches the current `selectedPlaneId`
- **THEN** `deselectPlane()` SHALL be called on the flight store

#### Scenario: Click empty map area deselects
- **WHEN** the user clicks on the map and no plane feature is found at the click point
- **THEN** `deselectPlane()` SHALL be called on the flight store

#### Scenario: Click empty map area with no selection is a no-op
- **WHEN** the user clicks on the map with no plane feature at the click point and no plane is currently selected
- **THEN** no store action SHALL be dispatched
