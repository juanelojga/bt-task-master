## ADDED Requirements

### Requirement: Flight store state shape
The flight store SHALL maintain the following state properties:
- `planes: PlaneBasic[]` — all aircraft from the basic WebSocket
- `selectedPlaneId: string | null` — ID of the currently selected plane, or null
- `detailedPlane: PlaneDetailed | null` — detailed data for the subscribed plane, or null
- `connectionStatus: { basic: ConnectionStatus, details: ConnectionStatus }` — per-connection status
- `errorMessage: string | null` — current error message, or null

#### Scenario: Initial store state
- **WHEN** the flight store is first created
- **THEN** `planes` SHALL be an empty array
- **AND** `selectedPlaneId` SHALL be `null`
- **AND** `detailedPlane` SHALL be `null`
- **AND** `connectionStatus` SHALL be `{ basic: 'disconnected', details: 'disconnected' }`
- **AND** `errorMessage` SHALL be `null`

### Requirement: updatePlanes action
The flight store SHALL provide an `updatePlanes(data: PlaneBasic[])` action that replaces the `planes` array with the provided data. If `selectedPlaneId` is set and the selected plane ID is not present in the new data, the store SHALL clear `selectedPlaneId` and `detailedPlane`.

#### Scenario: Update planes with selected plane still present
- **WHEN** `updatePlanes` is called with a list containing the currently selected plane ID
- **THEN** `planes` SHALL be updated to the new list
- **AND** `selectedPlaneId` and `detailedPlane` SHALL remain unchanged

#### Scenario: Update planes with selected plane no longer present
- **WHEN** `updatePlanes` is called with a list that does NOT contain the currently selected plane ID
- **THEN** `planes` SHALL be updated to the new list
- **AND** `selectedPlaneId` SHALL be set to `null`
- **AND** `detailedPlane` SHALL be set to `null`

### Requirement: selectPlane action
The flight store SHALL provide a `selectPlane(id: string)` action that sets `selectedPlaneId` to the given ID and sets `detailedPlane` to `null` (awaiting fresh detailed data from the WebSocket).

#### Scenario: Select a plane
- **WHEN** `selectPlane('abc123')` is called
- **THEN** `selectedPlaneId` SHALL be `'abc123'`
- **AND** `detailedPlane` SHALL be `null`

### Requirement: deselectPlane action
The flight store SHALL provide a `deselectPlane()` action that sets `selectedPlaneId` to `null` and `detailedPlane` to `null`.

#### Scenario: Deselect the current plane
- **WHEN** `deselectPlane()` is called while a plane is selected
- **THEN** `selectedPlaneId` SHALL be `null`
- **AND** `detailedPlane` SHALL be `null`

#### Scenario: Deselect when no plane is selected
- **WHEN** `deselectPlane()` is called while `selectedPlaneId` is already `null`
- **THEN** `selectedPlaneId` SHALL remain `null`
- **AND** `detailedPlane` SHALL remain `null`

### Requirement: setDetailedPlane action
The flight store SHALL provide a `setDetailedPlane(data: PlaneDetailed)` action that sets `detailedPlane` to the provided data only if `selectedPlaneId` matches `data.id`. If the IDs do not match, the action SHALL be a no-op.

#### Scenario: Set detailed plane with matching selectedPlaneId
- **WHEN** `setDetailedPlane` is called with data where `data.id` equals `selectedPlaneId`
- **THEN** `detailedPlane` SHALL be set to the provided data

#### Scenario: Set detailed plane with non-matching selectedPlaneId
- **WHEN** `setDetailedPlane` is called with data where `data.id` does NOT equal `selectedPlaneId`
- **THEN** `detailedPlane` SHALL remain unchanged

#### Scenario: Set detailed plane when no plane is selected
- **WHEN** `setDetailedPlane` is called while `selectedPlaneId` is `null`
- **THEN** `detailedPlane` SHALL remain unchanged

### Requirement: setConnectionStatus action
The flight store SHALL provide a `setConnectionStatus(conn: 'basic' | 'details', status: ConnectionStatus)` action that updates the corresponding property in `connectionStatus`.

#### Scenario: Update basic connection status
- **WHEN** `setConnectionStatus('basic', 'connected')` is called
- **THEN** `connectionStatus.basic` SHALL be `'connected'`
- **AND** `connectionStatus.details` SHALL remain unchanged

#### Scenario: Update details connection status
- **WHEN** `setConnectionStatus('details', 'connecting')` is called
- **THEN** `connectionStatus.details` SHALL be `'connecting'`
- **AND** `connectionStatus.basic` SHALL remain unchanged

### Requirement: setError action
The flight store SHALL provide an `setError(msg: string)` action that sets `errorMessage` to the provided string.

#### Scenario: Set an error message
- **WHEN** `setError('Connection lost')` is called
- **THEN** `errorMessage` SHALL be `'Connection lost'`

### Requirement: clearError action
The flight store SHALL provide a `clearError()` action that sets `errorMessage` to `null`.

#### Scenario: Clear an existing error
- **WHEN** `clearError()` is called while `errorMessage` is set
- **THEN** `errorMessage` SHALL be `null`

### Requirement: Flight store devtools integration
The flight store SHALL be created with `devtools` middleware and named `'FlightStore'`. Every action dispatched via `set` SHALL include a human-readable action label.

#### Scenario: Actions appear in Redux DevTools
- **WHEN** any store action is dispatched in development mode
- **THEN** the action SHALL appear in Redux DevTools with the action label (e.g., `'updatePlanes'`, `'selectPlane'`, `'deselectPlane'`)

### Requirement: Flight store selector hooks
The project SHALL provide the following custom hooks that wrap `useFlightStore` selectors:
- `usePlanes()` — returns `PlaneBasic[]`
- `useSelectedPlaneId()` — returns `string | null`
- `useDetailedPlane()` — returns `PlaneDetailed | null`
- `useConnectionStatus()` — returns `{ basic: ConnectionStatus, details: ConnectionStatus }`
- `useErrorMessage()` — returns `string | null`

#### Scenario: Selector hook returns correct state slice
- **WHEN** a component calls `usePlanes()`
- **THEN** it SHALL return the current `planes` array from the flight store
- **AND** the component SHALL re-render only when `planes` changes, not when other state slices change

### Requirement: Flight store file structure
The flight store SHALL be organized as three files in `fe/src/features/store/`:
- `flightStore.types.ts` — TypeScript interfaces for state, actions, and combined store type
- `useFlightStore.ts` — Zustand store creation with devtools middleware
- `useFlightSelectors.ts` — selector hooks for each state slice

#### Scenario: Store files exist in expected location
- **WHEN** a developer navigates to `fe/src/features/store/`
- **THEN** `flightStore.types.ts`, `useFlightStore.ts`, and `useFlightSelectors.ts` SHALL be present
