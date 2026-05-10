# ws-config Specification

## Purpose
TBD - created by archiving change build-websocket-service. Update Purpose after archive.
## Requirements
### Requirement: WebSocket URL configuration
The `config.ts` module SHALL export `wsBasicUrl` and `wsDetailsUrl` string constants derived from the `VITE_WS_BASIC_URL` and `VITE_WS_DETAILS_URL` environment variables respectively, with fallback defaults of `'ws://localhost:4000/ws/planes/basic'` and `'ws://localhost:4000/ws/planes/details'`.

#### Scenario: Default URLs when no environment variables set
- **WHEN** `VITE_WS_BASIC_URL` and `VITE_WS_DETAILS_URL` are not defined
- **THEN** `wsBasicUrl` SHALL be `'ws://localhost:4000/ws/planes/basic'`
- **AND** `wsDetailsUrl` SHALL be `'ws://localhost:4000/ws/planes/details'`

#### Scenario: Custom URLs from environment variables
- **WHEN** `VITE_WS_BASIC_URL` is set to `'wss://production.example.com/ws/planes/basic'`
- **THEN** `wsBasicUrl` SHALL be `'wss://production.example.com/ws/planes/basic'`

### Requirement: Reconnection timing configuration
The `config.ts` module SHALL export `wsReconnectInitialDelay` (default 1000ms), `wsReconnectMaxDelay` (default 30000ms), and `wsReconnectMaxAttempts` (default 10) constants. These SHALL be overridable via `VITE_WS_RECONNECT_INITIAL_DELAY`, `VITE_WS_RECONNECT_MAX_DELAY`, and `VITE_WS_RECONNECT_MAX_ATTEMPTS` environment variables.

#### Scenario: Default reconnection timing
- **WHEN** no reconnection environment variables are set
- **THEN** `wsReconnectInitialDelay` SHALL be `1000`
- **AND** `wsReconnectMaxDelay` SHALL be `30000`
- **AND** `wsReconnectMaxAttempts` SHALL be `10`

#### Scenario: Custom reconnection timing from environment
- **WHEN** `VITE_WS_RECONNECT_INITIAL_DELAY` is set to `'2000'`
- **THEN** `wsReconnectInitialDelay` SHALL be `2000`

### Requirement: Config values are parsed as numbers
All numeric configuration values parsed from environment variables SHALL be converted to numbers using `Number()`. If the conversion results in `NaN`, the default value SHALL be used instead.

#### Scenario: Invalid numeric environment variable falls back to default
- **WHEN** `VITE_WS_RECONNECT_MAX_ATTEMPTS` is set to `'abc'`
- **THEN** `wsReconnectMaxAttempts` SHALL be `10` (the default)

### Requirement: Config file location
The `config.ts` module SHALL be located at `fe/src/config.ts`.

#### Scenario: Config module is importable from expected path
- **WHEN** a module imports from `'../config'` or `'@/config'`
- **THEN** the `wsBasicUrl`, `wsDetailsUrl`, `wsReconnectInitialDelay`, `wsReconnectMaxDelay`, and `wsReconnectMaxAttempts` values SHALL be available

