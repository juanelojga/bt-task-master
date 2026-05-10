# plane-markers Specification

## Purpose
TBD - created by archiving change create-map-view. Update Purpose after archive.
## Requirements
### Requirement: Planes GeoJSON source and circle layer
The map SHALL contain a GeoJSON source named `planes` and a `circle` layer named `planes` that renders all non-selected aircraft as colored circle markers.

#### Scenario: Source and layer added on map load
- **WHEN** the MapView component mounts and the MapLibre map fires the `load` event
- **THEN** a GeoJSON source named `planes` SHALL be added with type `geojson`
- **AND** a circle layer named `planes` SHALL be added referencing the `planes` source

#### Scenario: Circle color matches plane color property
- **WHEN** the `planes` circle layer is rendered
- **THEN** each circle's color SHALL be driven by the `color` property of the corresponding GeoJSON feature using a data-driven expression (`['get', 'color']`)

### Requirement: Plane positions update from store
The `planes` GeoJSON source data SHALL be updated whenever the flight store's `planes` array changes, converting each `PlaneBasic` to a GeoJSON `Feature` with the plane's position and properties.

#### Scenario: Planes rendered after store update
- **WHEN** the flight store receives a new `planes` array from the basic WebSocket
- **THEN** the `planes` GeoJSON source SHALL be updated with a `FeatureCollection` containing one `Feature` per plane
- **AND** each feature SHALL have `geometry.coordinates` set to `[longitude, latitude]`
- **AND** each feature SHALL have `properties.id`, `properties.color`, and `properties.altitude`

#### Scenario: Empty planes array clears source
- **WHEN** the flight store's `planes` array is empty
- **THEN** the `planes` GeoJSON source SHALL be set to an empty `FeatureCollection`

### Requirement: GeoJSON features use plane ID for stable diff-updates
Each GeoJSON feature in the `planes` source SHALL set its `id` field to the plane's `id` string, enabling MapLibre's efficient feature diffing on `setData` calls.

#### Scenario: Feature IDs match plane IDs
- **WHEN** the `planes` GeoJSON source is updated with plane data
- **THEN** each feature's `id` SHALL equal the corresponding `PlaneBasic.id` value

### Requirement: useMapMarkers hook converts planes to GeoJSON
A `useMapMarkers` hook SHALL accept a MapLibre map instance and the `planes` array, and be responsible for adding the source, layer, and keeping the source data in sync.

#### Scenario: Hook adds source and layer on mount
- **WHEN** `useMapMarkers` is called with a loaded map instance
- **THEN** it SHALL add the `planes` source and `planes` circle layer if they do not exist

#### Scenario: Hook updates source on planes change
- **WHEN** the `planes` array passed to `useMapMarkers` changes
- **THEN** the hook SHALL call `source.setData()` on the `planes` source with the updated FeatureCollection

#### Scenario: Hook cleans up on unmount
- **WHEN** the component using `useMapMarkers` unmounts
- **THEN** the hook SHALL remove the `planes` layer and source from the map

