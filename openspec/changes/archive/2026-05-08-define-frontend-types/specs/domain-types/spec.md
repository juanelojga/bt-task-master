## ADDED Requirements

### Requirement: PlaneBasic type mirrors backend
The frontend SHALL define a `PlaneBasic` type with fields `id: string`, `latitude: number`, `longitude: number`, `altitude: number`, and `color: string`, matching the backend's `PlaneBasic` type exactly.

#### Scenario: PlaneBasic type is structurally identical to backend
- **WHEN** a developer compares `fe/src/types/domain.ts` `PlaneBasic` with `be/src/types.ts` `PlaneBasic`
- **THEN** every field name and type SHALL match exactly

### Requirement: PlaneDetailed type mirrors backend
The frontend SHALL define a `PlaneDetailed` type with all fields from the backend's `PlaneDetailed` type: `id`, `model`, `airline`, `flightNumber`, `registration`, `latitude`, `longitude`, `altitude`, `speed`, `heading`, `verticalSpeed`, `origin` (object with `airport` and `city`), `destination` (object with `airport` and `city`), `flightDuration`, `estimatedArrival`, `numberOfPassengers`, `maxPassengers`, `status` (union of `"departed" | "enroute" | "cruising" | "landing"`), and `color`.

#### Scenario: PlaneDetailed type is structurally identical to backend
- **WHEN** a developer compares `fe/src/types/domain.ts` `PlaneDetailed` with `be/src/types.ts` `PlaneDetailed`
- **THEN** every field name, nested structure, and type SHALL match exactly

#### Scenario: PlaneDetailed status is a string union
- **WHEN** a developer assigns a value to the `status` field of `PlaneDetailed`
- **THEN** only the string literals `"departed"`, `"enroute"`, `"cruising"`, or `"landing"` SHALL be accepted by the TypeScript compiler

### Requirement: BasicPlanesMessage type for incoming plane data
The frontend SHALL define a `BasicPlanesMessage` type with `type: "planes"` and `data: PlaneBasic[]`.

#### Scenario: BasicPlanesMessage discriminates on type field
- **WHEN** a message with `type: "planes"` is received
- **THEN** TypeScript SHALL narrow the type to `BasicPlanesMessage` and `data` SHALL be typed as `PlaneBasic[]`

### Requirement: PlaneDetailsMessage type for incoming detail data
The frontend SHALL define a `PlaneDetailsMessage` type with `type: "plane-details"` and `data: PlaneDetailed`.

#### Scenario: PlaneDetailsMessage discriminates on type field
- **WHEN** a message with `type: "plane-details"` is received
- **THEN** TypeScript SHALL narrow the type to `PlaneDetailsMessage` and `data` SHALL be typed as `PlaneDetailed`

### Requirement: WsErrorMessage type for error messages
The frontend SHALL define a `WsErrorMessage` type with `type: "error"` and `message: string`.

#### Scenario: WsErrorMessage discriminates on type field
- **WHEN** a message with `type: "error"` is received
- **THEN** TypeScript SHALL narrow the type to `WsErrorMessage` and `message` SHALL be typed as `string`

### Requirement: SubscribeMessage type for outgoing subscriptions
The frontend SHALL define a `SubscribeMessage` type with `type: "subscribe"` and `planeId: string`.

#### Scenario: SubscribeMessage is sent to details WebSocket
- **WHEN** a developer constructs a subscribe message
- **THEN** the object SHALL satisfy `SubscribeMessage` with `type: "subscribe"` and `planeId: string`

### Requirement: IncomingWsMessage union type
The frontend SHALL define an `IncomingWsMessage` type as a discriminated union of `BasicPlanesMessage | PlaneDetailsMessage | WsErrorMessage`, discriminated by the `type` field.

#### Scenario: Exhaustive switch on incoming messages
- **WHEN** a developer writes a `switch` statement on `message.type` for an `IncomingWsMessage`
- **THEN** TypeScript SHALL require handling of all three cases (`"planes"`, `"plane-details"`, `"error"`)

### Requirement: OutgoingWsMessage union type
The frontend SHALL define an `OutgoingWsMessage` type as a discriminated union of `SubscribeMessage`, discriminated by the `type` field.

#### Scenario: Only subscribe messages can be sent
- **WHEN** a developer sends a message via the details WebSocket
- **THEN** the message SHALL satisfy `OutgoingWsMessage`, which only includes `SubscribeMessage`

### Requirement: ConnectionStatus type for WebSocket state tracking
The frontend SHALL define a `ConnectionStatus` type as a union of `"connected" | "connecting" | "disconnected"`.

#### Scenario: ConnectionStatus used for connection state
- **WHEN** the store tracks the state of a WebSocket connection
- **THEN** the value SHALL be one of `"connected"`, `"connecting"`, or `"disconnected"`

### Requirement: All domain types exported from barrel file
All types defined in `domain.ts` SHALL be re-exported from `fe/src/types/index.ts`, alongside existing exports from `map.ts`.

#### Scenario: Single import path for all types
- **WHEN** a consumer imports from `fe/src/types`
- **THEN** `PlaneBasic`, `PlaneDetailed`, `BasicPlanesMessage`, `PlaneDetailsMessage`, `WsErrorMessage`, `SubscribeMessage`, `IncomingWsMessage`, `OutgoingWsMessage`, and `ConnectionStatus` SHALL all be available

### Requirement: No runtime code in type files
The type definition files (`domain.ts`, `index.ts` barrel) SHALL contain only TypeScript type exports — no constants, functions, or runtime values.

#### Scenario: Type files have zero runtime footprint
- **WHEN** the TypeScript compiler emits JavaScript for `domain.ts`
- **THEN** the output SHALL be an empty module (no runtime code)
