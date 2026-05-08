## ADDED Requirements

### Requirement: useBasicWebSocket hook connects on mount
The `useBasicWebSocket` hook SHALL create a `WebSocketService` instance targeting the basic planes endpoint and call `connect()` on mount. It SHALL call `disconnect()` on unmount.

#### Scenario: Hook connects on component mount
- **WHEN** a component rendering `useBasicWebSocket()` mounts
- **THEN** a WebSocket connection SHALL be established to the basic planes URL from config
- **AND** the store's `setConnectionStatus('basic', 'connecting')` SHALL be called

#### Scenario: Hook disconnects on component unmount
- **WHEN** the component rendering `useBasicWebSocket()` unmounts
- **THEN** `disconnect()` SHALL be called on the WebSocketService
- **AND** the store's `setConnectionStatus('basic', 'disconnected')` SHALL be called

### Requirement: useBasicWebSocket dispatches planes messages to store
When a `BasicPlanesMessage` is received, the hook SHALL call the store's `updatePlanes(data)` action with the plane data.

#### Scenario: Planes message updates the store
- **WHEN** the basic WebSocket receives `{ type: "planes", data: [...] }`
- **THEN** `updatePlanes` SHALL be called with the `PlaneBasic[]` data

### Requirement: useBasicWebSocket updates connection status
The hook SHALL update the store's `connectionStatus.basic` to `'connecting'` on connect attempt, `'connected'` when the connection opens, and `'disconnected'` when closed.

#### Scenario: Connection lifecycle updates store
- **WHEN** the basic WebSocket transitions through connecting → connected → disconnected
- **THEN** `setConnectionStatus('basic', ...)` SHALL be called with each corresponding status

### Requirement: useBasicWebSocket handles error messages
When a `WsErrorMessage` is received on the basic connection, the hook SHALL call the store's `setError(message)` action.

#### Scenario: Error message sets store error
- **WHEN** the basic WebSocket receives `{ type: "error", message: "Server error" }`
- **THEN** `setError("Server error")` SHALL be called on the store

### Requirement: useDetailWebSocket hook manages connection lifecycle
The `useDetailWebSocket` hook SHALL open a WebSocket connection to the details endpoint when `selectedPlaneId` changes from `null` to a string, and close it when `selectedPlaneId` changes back to `null`.

#### Scenario: Plane selected opens details connection
- **WHEN** `selectedPlaneId` changes from `null` to a non-null value
- **THEN** a new `WebSocketService` SHALL be created and `connect()` called for the details URL
- **AND** `setConnectionStatus('details', 'connecting')` SHALL be called

#### Scenario: Plane deselected closes details connection
- **WHEN** `selectedPlaneId` changes from a non-null value to `null`
- **THEN** `disconnect()` SHALL be called on the details WebSocketService
- **AND** `setConnectionStatus('details', 'disconnected')` SHALL be called

#### Scenario: Switching selected plane sends new subscribe
- **WHEN** `selectedPlaneId` changes from one non-null value to another
- **THEN** the existing details connection SHALL be reused
- **AND** a `subscribe` message with the new `planeId` SHALL be sent
- **AND** `setDetailedPlane` SHALL NOT be called until new data arrives (previous detailed data is stale)

### Requirement: useDetailWebSocket subscribes after connection opens
When the details WebSocket opens, the hook SHALL send a `{ type: "subscribe", planeId: <selectedPlaneId> }` message.

#### Scenario: Subscribe sent on connection open
- **WHEN** the details WebSocket connection opens and `selectedPlaneId` is set
- **THEN** a subscribe message SHALL be sent with the current `selectedPlaneId`

### Requirement: useDetailWebSocket dispatches plane-details to store
When a `PlaneDetailsMessage` is received and `data.id` matches the current `selectedPlaneId`, the hook SHALL call the store's `setDetailedPlane(data)` action.

#### Scenario: Matching plane-details updates store
- **WHEN** the details WebSocket receives `{ type: "plane-details", data: { id: "abc", ... } }` and `selectedPlaneId` is `"abc"`
- **THEN** `setDetailedPlane(data)` SHALL be called

#### Scenario: Non-matching plane-details is ignored
- **WHEN** the details WebSocket receives `{ type: "plane-details", data: { id: "xyz", ... } }` and `selectedPlaneId` is `"abc"`
- **THEN** `setDetailedPlane` SHALL NOT be called

### Requirement: useDetailWebSocket handles close code 1008
When the details WebSocket closes with code 1008 (invalid subscription), the hook SHALL call `deselectPlane()` and `setError()` on the store. It SHALL NOT attempt to reconnect.

#### Scenario: Code 1008 triggers deselection and error
- **WHEN** the details WebSocket closes with code 1008
- **THEN** `deselectPlane()` SHALL be called on the store
- **AND** `setError("Plane not found or subscription invalid")` SHALL be called
- **AND** no reconnection attempt SHALL be made

### Requirement: useDetailWebSocket handles network-failure disconnects
When the details WebSocket closes with a code other than 1000 or 1008 and `selectedPlaneId` is still set, the hook SHALL attempt reconnection with exponential backoff, up to a configurable maximum number of attempts.

#### Scenario: Network failure triggers reconnection
- **WHEN** the details WebSocket closes unexpectedly (e.g., code 1006) and a plane is still selected
- **THEN** reconnection SHALL be attempted with backoff
- **AND** `setConnectionStatus('details', 'connecting')` SHALL be called

#### Scenario: Reconnection exhausts max attempts
- **WHEN** reconnection attempts exceed the configured maximum and the details connection still fails
- **THEN** `deselectPlane()` SHALL be called
- **AND** `setError("Unable to reconnect to flight details")` SHALL be called

### Requirement: useDetailWebSocket handles error messages
When a `WsErrorMessage` is received on the details connection, the hook SHALL call the store's `setError(message)` action.

#### Scenario: Error message on details connection sets store error
- **WHEN** the details WebSocket receives `{ type: "error", message: "Subscription failed" }`
- **THEN** `setError("Subscription failed")` SHALL be called on the store

### Requirement: useDetailWebSocket clears error on successful data
When a `PlaneDetailsMessage` is successfully received and dispatched, the hook SHALL call `clearError()` on the store.

#### Scenario: Successful plane-details clears error
- **WHEN** a matching `PlaneDetailsMessage` is received and `setDetailedPlane` is called
- **THEN** `clearError()` SHALL also be called on the store
