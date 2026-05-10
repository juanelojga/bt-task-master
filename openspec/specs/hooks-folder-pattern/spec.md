# hooks-folder-pattern Specification

## Purpose
TBD - created by archiving change restructure-fe-file-organization. Update Purpose after archive.
## Requirements
### Requirement: React hooks reside in hooks subdirectories
All React hook modules (files exporting functions named `use*`) SHALL be placed inside a `hooks/` subdirectory within their parent feature or top-level directory.

#### Scenario: Map feature hooks location
- **WHEN** a hook belongs to the map feature (e.g., `useMapMarkers`, `useMapSelection`)
- **THEN** the hook file SHALL be located at `fe/src/features/map/hooks/<hookName>.ts`

#### Scenario: Store feature hooks location
- **WHEN** a hook belongs to the store feature (e.g., `useFlightSelectors`)
- **THEN** the hook file SHALL be located at `fe/src/features/store/hooks/<hookName>.ts`

#### Scenario: Lib hooks location
- **WHEN** a hook belongs to the lib layer (e.g., `useBasicWebSocket`, `useDetailWebSocket`)
- **THEN** the hook file SHALL be located at `fe/src/lib/hooks/<hookName>.ts`

### Requirement: Hook tests follow __tests__ pattern within hooks folder
Test files for hooks SHALL reside in `__tests__/` directories within the same `hooks/` folder as the hook they test.

#### Scenario: Hook test file location
- **WHEN** a hook exists at `fe/src/<path>/hooks/useSomething.ts`
- **THEN** its test file SHALL be located at `fe/src/<path>/hooks/__tests__/useSomething.test.ts`

### Requirement: No hooks colocated with components or non-hook modules
No React hook file SHALL exist in a directory that also contains components or non-hook modules; hooks SHALL be in their own `hooks/` subdirectory.

#### Scenario: No hook files in component directories
- **WHEN** the `fe/src/features/map/` directory is scanned
- **THEN** no `use*.ts` hook file SHALL exist directly in that directory (only in `hooks/` subdirectory)

#### Scenario: No hook files in lib root
- **WHEN** the `fe/src/lib/` directory is scanned
- **THEN** no `use*.ts` hook file SHALL exist directly in that directory (only in `hooks/` subdirectory)

