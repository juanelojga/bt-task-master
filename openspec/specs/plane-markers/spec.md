# plane-markers Specification

## Purpose
TBD - created by archiving change create-map-view. Update Purpose after archive.
## Requirements
### Requirement: Planes GeoJSON source and circle layer
The map SHALL contain a GeoJSON source named `planes` and a `circle` layer named `planes` that renders all non-selected aircraft as colored circle markers. The `planesToFeatureCollection` function SHALL be exported from `features/map/utils/geojson.ts` and be independently testable.

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
A `useMapMarkers` hook SHALL accept a MapLibre map instance and the `planes` array, and be responsible for adding the source, layer, and keeping the source data in sync. The hook SHALL import `planesToFeatureCollection` from `../utils/geojson.ts` rather than defining it inline.

#### Scenario: Hook adds source and layer on mount
- **WHEN** `useMapMarkers` is called with a loaded map instance
- **THEN** it SHALL add the `planes` source and `planes` circle layer if they do not exist

#### Scenario: Hook updates source on planes change
- **WHEN** the `planes` array passed to `useMapMarkers` changes
- **THEN** the hook SHALL call `source.setData()` on the `planes` source with the updated FeatureCollection

#### Scenario: Hook cleans up on unmount
- **WHEN** the component using `useMapMarkers` unmounts
- **THEN** the hook SHALL remove the `planes` layer and source from the map

#### Scenario: Hook uses imported utility for GeoJSON conversion
- **WHEN** `useMapMarkers` needs to convert planes to a FeatureCollection
- **THEN** it SHALL call `planesToFeatureCollection` imported from `../utils/geojson.ts`

### Requirement: useMapMarkers hook manages source and layer lifecycle
The `useMapMarkers` hook SHALL accept a map reference, a `mapLoaded` boolean, and a `PlaneBasic[]` array. When `mapLoaded` is true, it SHALL add a GeoJSON source named `planes` and a circle layer named `planes` if they do not already exist. It SHALL remove the layer and source on unmount.

#### Scenario: Hook adds source and layer when map loads
- **WHEN** `useMapMarkers` is called with `mapLoaded = true` and a map reference
- **THEN** a GeoJSON source named `planes` SHALL be added to the map with type `geojson`
- **AND** a circle layer named `planes` referencing the `planes` source SHALL be added

#### Scenario: Hook does not add source or layer when map is not loaded
- **WHEN** `useMapMarkers` is called with `mapLoaded = false`
- **THEN** no source or layer SHALL be added to the map

#### Scenario: Hook removes source and layer on unmount
- **WHEN** the component rendering `useMapMarkers` unmounts
- **THEN** the `planes` layer SHALL be removed from the map
- **AND** the `planes` source SHALL be removed from the map

#### Scenario: Hook does not add duplicate source or layer
- **WHEN** `useMapMarkers` is called and the `planes` source and layer already exist on the map
- **THEN** no duplicate source or layer SHALL be added

### Requirement: useMapMarkers updates source data on planes change
After the source is added, `useMapMarkers` SHALL update the `planes` GeoJSON source data whenever the `planes` array changes, using `setData` with the result of `planesToFeatureCollection`.

#### Scenario: Source data updates with new planes
- **WHEN** the `planes` prop changes to a new `PlaneBasic[]` array after the source has been added
- **THEN** the `planes` source SHALL call `setData` with the new `FeatureCollection`

#### Scenario: Source data not updated before source exists
- **WHEN** the `planes` prop changes but the source has not been added yet
- **THEN** `setData` SHALL NOT be called

### Requirement: Circle layer styling with data-driven color
The `planes` circle layer SHALL use a white stroke and data-driven fill color derived from each feature's `color` property via the expression `['get', 'color']`.

#### Scenario: Circle color matches plane color property
- **WHEN** the `planes` circle layer is rendered with features having `color` properties
- **THEN** each circle's fill color SHALL be determined by `['get', 'color']` expression
- **AND** each circle SHALL have a white stroke

### Requirement: Feature IDs enable stable rendering
Each feature in the `planes` GeoJSON source SHALL have its `id` field set to the plane's `id` string, enabling MapLibre to perform efficient feature diffing on `setData` updates.

#### Scenario: Feature ID matches plane ID
- **WHEN** a plane with `id: "abc-123"` is converted to a GeoJSON feature
- **THEN** the feature's `id` field SHALL be `"abc-123"`

