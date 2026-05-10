# map-selection Specification

## Purpose
TBD - created by archiving change create-map-view. Update Purpose after archive.
## Requirements
### Requirement: Click on plane marker selects the plane
Clicking a circle marker in the `planes` layer SHALL dispatch `selectPlane(id)` to the flight store, where `id` is the plane's feature ID.

#### Scenario: Click unselected plane selects it
- **WHEN** the user clicks a plane marker in the `planes` layer that is not currently selected
- **THEN** `selectPlane(planeId)` SHALL be called on the flight store with the clicked feature's ID

#### Scenario: Click already-selected plane deselects it
- **WHEN** the user clicks a plane marker whose ID matches the current `selectedPlaneId`
- **THEN** `deselectPlane()` SHALL be called on the flight store

### Requirement: Selected plane highlighted with distinct circle layer
The map SHALL contain a separate `selected-plane` GeoJSON source and circle layer that renders a larger, highlighted circle for the currently selected plane.

#### Scenario: Selected plane circle appears
- **WHEN** a plane is selected (`selectedPlaneId` is not null)
- **THEN** a `selected-plane` source SHALL contain a single feature for the selected plane
- **AND** a `selected-plane` circle layer SHALL render with a larger radius and a distinct stroke compared to the `planes` layer

#### Scenario: Selected plane circle updates position
- **WHEN** the selected plane's position changes in the `planes` array
- **THEN** the `selected-plane` source SHALL update to reflect the new coordinates

#### Scenario: Selected plane circle removed on deselect
- **WHEN** the user deselects a plane (`selectedPlaneId` becomes null)
- **THEN** the `selected-plane` source SHALL be cleared and the highlight circle SHALL disappear

### Requirement: Selected plane marker rotates based on heading
When `detailedPlane` data is available for the selected plane, an HTML Marker SHALL be rendered at the selected plane's position and rotated via CSS `transform: rotate(headingDeg)` based on the `heading` field.

#### Scenario: Rotated marker appears when detailed data arrives
- **WHEN** `detailedPlane` is not null and contains a `heading` value
- **THEN** an HTML Marker SHALL be positioned at the selected plane's coordinates
- **AND** the marker's element SHALL have `transform: rotate(${heading}deg)` applied

#### Scenario: Rotated marker updates on heading change
- **WHEN** a new `plane-details` message arrives with an updated `heading`
- **THEN** the marker element's rotation SHALL update to the new heading value

#### Scenario: Rotated marker removed on deselect
- **WHEN** the user deselects a plane
- **THEN** the HTML Marker SHALL be removed from the map

#### Scenario: No rotated marker without detailed data
- **WHEN** a plane is selected but `detailedPlane` is still null (data not yet received)
- **THEN** no rotated HTML Marker SHALL be rendered; only the circle highlight layer is visible

### Requirement: Cursor changes to pointer on plane hover
The map cursor SHALL change to `pointer` when the mouse enters a plane marker in the `planes` layer, and revert to the default cursor when the mouse leaves.

#### Scenario: Pointer cursor on hover
- **WHEN** the mouse enters a feature in the `planes` circle layer
- **THEN** the map canvas cursor SHALL be set to `pointer`

#### Scenario: Default cursor on leave
- **WHEN** the mouse leaves a feature in the `planes` circle layer
- **THEN** the map canvas cursor SHALL be set to the default cursor

### Requirement: useMapSelection hook manages selection visuals
A `useMapSelection` hook SHALL accept the map instance, `selectedPlaneId`, `planes` array, and `detailedPlane`, and manage the selected-plane source/layer and rotated HTML Marker. The hook SHALL import `createSelectedFeature` and `createEmptyFeatureCollection` from `../utils/geojson.ts` rather than defining them inline.

#### Scenario: Hook adds selection layer on mount
- **WHEN** `useMapSelection` is called with a loaded map instance
- **THEN** it SHALL add the `selected-plane` source and layer if they do not exist

#### Scenario: Hook updates selection highlight on selectedPlaneId change
- **WHEN** `selectedPlaneId` changes to a non-null value
- **THEN** the hook SHALL update the `selected-plane` source with a feature for that plane
- **AND** the hook SHALL register click and hover event handlers on the `planes` layer

#### Scenario: Hook clears selection on deselect
- **WHEN** `selectedPlaneId` becomes null
- **THEN** the hook SHALL clear the `selected-plane` source data
- **AND** the hook SHALL remove any HTML Marker for the selected plane

#### Scenario: Hook cleans up on unmount
- **WHEN** the component using `useMapSelection` unmounts
- **THEN** the hook SHALL remove the `selected-plane` layer, source, click handler, hover handlers, and any HTML Marker

#### Scenario: Hook uses imported utility for GeoJSON helpers
- **WHEN** `useMapSelection` needs to create a selected feature or empty feature collection
- **THEN** it SHALL call `createSelectedFeature` or `createEmptyFeatureCollection` imported from `../utils/geojson.ts`

