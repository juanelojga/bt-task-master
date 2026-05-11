## ADDED Requirements

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
