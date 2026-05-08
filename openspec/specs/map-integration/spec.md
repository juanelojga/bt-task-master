## ADDED Requirements

### Requirement: maplibre-gl dependency installed
The project SHALL have `maplibre-gl` installed as a runtime dependency in `package.json`.

#### Scenario: maplibre-gl is available
- **WHEN** a developer inspects `package.json`
- **THEN** `maplibre-gl` SHALL be listed in `dependencies` with a compatible version

### Requirement: MapLibre GL CSS included
The `maplibre-gl` base stylesheet SHALL be imported in the application entry point so that map controls and popups render correctly.

#### Scenario: Map renders with correct styling
- **WHEN** a MapLibre GL map instance is rendered in the browser
- **THEN** the map controls, popups, and tile layers SHALL display with proper styling from the included CSS

### Requirement: Map container component
The project SHALL provide a React component that renders a MapLibre GL map instance, accepting configuration props (initial center, zoom, style URL) via a typed interface.

#### Scenario: Map component renders with config
- **WHEN** the map container component is mounted with `center`, `zoom`, and `style` props
- **THEN** a MapLibre GL map SHALL initialize at the specified center and zoom level using the given style

#### Scenario: Map cleanup on unmount
- **WHEN** the map container component is unmounted
- **THEN** the MapLibre GL map instance SHALL be properly removed and its resources released

### Requirement: TypeScript types for map configuration
All map configuration objects (center coordinates, zoom bounds, style URLs) SHALL be defined with explicit TypeScript interfaces.

#### Scenario: Invalid map config caught at compile time
- **WHEN** a developer passes a map configuration object with incorrect shape
- **THEN** the TypeScript compiler SHALL emit a type error
