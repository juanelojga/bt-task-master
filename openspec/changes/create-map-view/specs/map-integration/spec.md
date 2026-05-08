## MODIFIED Requirements

### Requirement: Map container component
The project SHALL provide a `MapView` React component that renders a MapLibre GL map instance with integrated plane markers and selection interaction. The component SHALL accept configuration props (initial center, zoom, style URL) via a typed interface, subscribe to the flight store for planes and selection state, and use custom hooks (`useMapMarkers`, `useMapSelection`) to bind data to the map. The previous `MapContainer` component is replaced entirely.

#### Scenario: MapView renders with config
- **WHEN** the `MapView` component is mounted with `center`, `zoom`, and `style` props
- **THEN** a MapLibre GL map SHALL initialize at the specified center and zoom level using the given style
- **AND** the `planes` GeoJSON source and circle layer SHALL be added after the map loads

#### Scenario: Map cleanup on unmount
- **WHEN** the `MapView` component is unmounted
- **THEN** the MapLibre GL map instance SHALL be properly removed, along with all sources, layers, markers, and event handlers

#### Scenario: MapView displays planes from store
- **WHEN** the flight store's `planes` array contains data
- **THEN** the `MapView` SHALL render colored circle markers for each plane on the map

#### Scenario: MapView handles selection interaction
- **WHEN** the user clicks a plane marker in the `MapView`
- **THEN** the flight store's `selectPlane` or `deselectPlane` action SHALL be dispatched accordingly

## ADDED Requirements

### Requirement: Map configuration in config module
Map configuration constants (style URL, default center, default zoom) SHALL be defined in the config module with environment variable overrides.

#### Scenario: Map style URL from environment
- **WHEN** the `VITE_MAP_STYLE_URL` environment variable is set
- **THEN** the map style URL SHALL use that value

#### Scenario: Map style URL fallback
- **WHEN** the `VITE_MAP_STYLE_URL` environment variable is not set
- **THEN** the map style URL SHALL default to `https://demotiles.maplibre.org/style.json`

### Requirement: MapView wired in App component
The `App` component SHALL render `MapView` as the primary content, removing the placeholder counter UI.

#### Scenario: App renders MapView
- **WHEN** the application loads
- **THEN** `MapView` SHALL be rendered as the main content area
- **AND** no placeholder counter buttons SHALL be visible

## REMOVED Requirements

### Requirement: Map container component
**Reason**: Replaced by `MapView` which integrates store subscriptions, plane markers, and selection interaction. The basic `MapContainer` that only renders tiles without data is superseded.
**Migration**: Use `MapView` instead of `MapContainer`. The `MapConfig` interface is unchanged and continues to be accepted as a prop.
