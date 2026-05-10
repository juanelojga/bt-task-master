## ADDED Requirements

### Requirement: WebSocketService class constructor
The `WebSocketService` class SHALL accept an options object with `url: string` and optional callback handlers: `onMessage: (data: IncomingWsMessage) => void`, `onOpen: () => void`, `onClose: (code: number, reason: string) => void`, `onError: (error: Event) => void`.

#### Scenario: Create service with URL and message handler
- **WHEN** a `WebSocketService` is constructed with `{ url: 'ws://localhost:4000/ws/planes/basic', onMessage: handler }`
- **THEN** the service SHALL store the URL and handler without immediately connecting

#### Scenario: All callback options are optional
- **WHEN** a `WebSocketService` is constructed with only `{ url: '...' }`
- **THEN** the service SHALL be created without errors and missing callbacks SHALL be treated as no-ops

### Requirement: WebSocketService connect method
The `WebSocketService` SHALL provide a `connect()` method that creates a native `WebSocket` instance targeting the configured URL and registers `onopen`, `onmessage`, `onclose`, and `onerror` handlers.

#### Scenario: Connect establishes a WebSocket connection
- **WHEN** `connect()` is called on a disconnected service
- **THEN** a new `WebSocket` SHALL be created with the configured URL
- **AND** the `onOpen` callback SHALL be invoked when the connection opens

#### Scenario: Connect is idempotent
- **WHEN** `connect()` is called on an already connected or connecting service
- **THEN** no new WebSocket SHALL be created
- **AND** the existing connection SHALL remain unchanged

### Requirement: WebSocketService disconnect method
The `WebSocketService` SHALL provide a `disconnect()` method that closes the WebSocket connection with code 1000 and cleans up reconnection timers.

#### Scenario: Disconnect closes an active connection
- **WHEN** `disconnect()` is called while connected
- **THEN** the WebSocket SHALL be closed with code 1000
- **AND** any pending reconnection timer SHALL be cleared

#### Scenario: Disconnect on already disconnected service is a no-op
- **WHEN** `disconnect()` is called while disconnected
- **THEN** no error SHALL occur
- **AND** no WebSocket close SHALL be attempted

### Requirement: WebSocketService message parsing
When a WebSocket message is received, the service SHALL parse the raw data as JSON and invoke the `onMessage` callback with the parsed `IncomingWsMessage`. If parsing fails, the `onError` callback SHALL be invoked.

#### Scenario: Valid JSON message is parsed and dispatched
- **WHEN** a WebSocket message arrives with `{ "type": "planes", "data": [...] }`
- **THEN** `onMessage` SHALL be called with a `BasicPlanesMessage` object

#### Scenario: Invalid JSON triggers error callback
- **WHEN** a WebSocket message arrives with malformed JSON
- **THEN** `onError` SHALL be invoked with the parse error
- **AND** `onMessage` SHALL NOT be invoked

### Requirement: WebSocketService send method
The `WebSocketService` SHALL provide a `send(message: OutgoingWsMessage)` method that serializes the message to JSON and sends it via the active WebSocket connection. If the connection is not in `OPEN` state, the send SHALL be a no-op.

#### Scenario: Send message on open connection
- **WHEN** `send({ type: 'subscribe', planeId: 'abc' })` is called while connected
- **THEN** the JSON string `'{"type":"subscribe","planeId":"abc"}'` SHALL be sent via the WebSocket

#### Scenario: Send on non-open connection is a no-op
- **WHEN** `send(message)` is called while the WebSocket is not in OPEN state
- **THEN** no data SHALL be sent
- **AND** no error SHALL be thrown

### Requirement: WebSocketService reconnection with exponential backoff
The `WebSocketService` SHALL support automatic reconnection with exponential backoff. After an unexpected close (not initiated by `disconnect()`), the service SHALL schedule a reconnection attempt with a delay starting at `initialDelay` ms, doubling each attempt up to `maxDelay` ms, with random jitter of ±20%.

#### Scenario: Reconnect after unexpected close
- **WHEN** the WebSocket closes unexpectedly (code other than 1000)
- **THEN** a reconnection attempt SHALL be scheduled after the backoff delay
- **AND** `onClose` SHALL be invoked with the close code and reason

#### Scenario: No reconnect after explicit disconnect
- **WHEN** the WebSocket closes after `disconnect()` was called (code 1000)
- **THEN** no reconnection attempt SHALL be scheduled

#### Scenario: Backoff caps at max delay
- **WHEN** multiple reconnection attempts have occurred and the calculated delay exceeds `maxDelay`
- **THEN** the delay SHALL be capped at `maxDelay`

#### Scenario: Reconnect is cancelled on explicit disconnect
- **WHEN** a reconnection is pending and `disconnect()` is called
- **THEN** the pending reconnection timer SHALL be cleared
- **AND** no further reconnection attempts SHALL occur

### Requirement: WebSocketService connection state getter
The `WebSocketService` SHALL provide a `state` getter that returns the current connection state as `"connecting" | "connected" | "disconnected"`.

#### Scenario: State reflects connecting
- **WHEN** `connect()` has been called but `onopen` has not yet fired
- **THEN** `state` SHALL return `"connecting"`

#### Scenario: State reflects connected
- **WHEN** the WebSocket `onopen` event has fired
- **THEN** `state` SHALL return `"connected"`

#### Scenario: State reflects disconnected
- **WHEN** the WebSocket is closed and no reconnection is pending
- **THEN** `state` SHALL return `"disconnected"`

### Requirement: WebSocketService cleanup on disconnect
When `disconnect()` is called, the service SHALL set all callback references to `null` and clear any reconnection timers to prevent memory leaks.

#### Scenario: No callbacks invoked after disconnect
- **WHEN** `disconnect()` has been called
- **THEN** no `onMessage`, `onOpen`, `onClose`, or `onError` callbacks SHALL be invoked for the disconnected instance
