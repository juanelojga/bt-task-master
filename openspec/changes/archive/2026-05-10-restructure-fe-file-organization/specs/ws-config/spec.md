## MODIFIED Requirements

### Requirement: Config file location
The `config.ts` module SHALL be located at `fe/src/config.ts`. The `parseNumericEnv` utility function SHALL be extracted to `fe/src/utils/env.ts` and imported by `config.ts`.

#### Scenario: Config module is importable from expected path
- **WHEN** a module imports from `'../config'` or `'@/config'`
- **THEN** the `wsBasicUrl`, `wsDetailsUrl`, `wsReconnectInitialDelay`, `wsReconnectMaxDelay`, and `wsReconnectMaxAttempts` values SHALL be available

#### Scenario: Config imports parseNumericEnv from utils
- **WHEN** `config.ts` needs to parse numeric environment variables
- **THEN** it SHALL import `parseNumericEnv` from `../utils/env.ts`

### Requirement: Config values are parsed as numbers
All numeric configuration values parsed from environment variables SHALL be converted to numbers using the `parseNumericEnv` function exported from `fe/src/utils/env.ts`. If the conversion results in `NaN`, the default value SHALL be used instead.

#### Scenario: Invalid numeric environment variable falls back to default
- **WHEN** `VITE_WS_RECONNECT_MAX_ATTEMPTS` is set to `'abc'`
- **THEN** `wsReconnectMaxAttempts` SHALL be `10` (the default)
