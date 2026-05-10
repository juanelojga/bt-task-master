## MODIFIED Requirements

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
