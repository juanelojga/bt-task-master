## ADDED Requirements

### Requirement: Store notice type supports severity levels
The flight store SHALL use a structured `notice` field that includes a `message` string and a `severity` level (`'error'` | `'warning'` | `'info'`), replacing the previous `errorMessage: string | null`.

#### Scenario: Set error notice
- **WHEN** `setNotice({ message: 'Connection lost', severity: 'error' })` is called
- **THEN** `notice` SHALL be `{ message: 'Connection lost', severity: 'error' }`

#### Scenario: Set info notice
- **WHEN** `setNotice({ message: 'Plane no longer available', severity: 'info' })` is called
- **THEN** `notice` SHALL be `{ message: 'Plane no longer available', severity: 'info' }`

#### Scenario: Clear notice
- **WHEN** `clearNotice()` is called
- **THEN** `notice` SHALL be `null`

#### Scenario: New notice replaces existing notice
- **WHEN** a notice is already set and `setNotice` is called with a different message
- **THEN** `notice` SHALL be updated to the new message and severity

### Requirement: Store actions use setNotice instead of setError
All store actions and hooks that previously called `setError(msg)` SHALL call `setNotice({ message: msg, severity })` with the appropriate severity level.

#### Scenario: WebSocket error message produces error notice
- **WHEN** a `WsErrorMessage` is received on either WebSocket connection
- **THEN** `setNotice({ message: <error message>, severity: 'error' })` SHALL be called

#### Scenario: Code 1008 close produces error notice
- **WHEN** the details WebSocket closes with code 1008
- **THEN** `setNotice({ message: 'Plane not found or subscription invalid', severity: 'error' })` SHALL be called

#### Scenario: Reconnection exhaustion produces error notice
- **WHEN** the details WebSocket reconnection attempts are exhausted
- **THEN** `setNotice({ message: 'Unable to reconnect to flight details', severity: 'error' })` SHALL be called

#### Scenario: Successful plane-details clears notice
- **WHEN** a matching `PlaneDetailsMessage` is received
- **THEN** `clearNotice()` SHALL be called
