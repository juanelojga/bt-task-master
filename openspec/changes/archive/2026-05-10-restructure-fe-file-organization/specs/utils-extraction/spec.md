## ADDED Requirements

### Requirement: Pure utility functions extracted to utils modules
All auxiliary pure functions that are not hooks, components, or config constants SHALL be extracted into dedicated `utils/` modules within the same parent directory as the code that uses them.

#### Scenario: GeoJSON helper functions extracted
- **WHEN** pure functions exist that convert domain objects to GeoJSON structures (e.g., `planesToFeatureCollection`, `createSelectedFeature`, `createEmptyFeatureCollection`)
- **THEN** those functions SHALL reside in `fe/src/features/map/utils/geojson.ts`

#### Scenario: Environment parsing function extracted
- **WHEN** a pure function exists that parses environment variables (e.g., `parseNumericEnv`)
- **THEN** that function SHALL reside in `fe/src/utils/env.ts`

### Requirement: Extracted utility functions have unit tests
Every function extracted into a `utils/` module SHALL have corresponding unit tests in an `__tests__/` directory within the same `utils/` folder.

#### Scenario: GeoJSON utils have unit tests
- **WHEN** `geojson.ts` exists at `fe/src/features/map/utils/geojson.ts`
- **THEN** its test file SHALL exist at `fe/src/features/map/utils/__tests__/geojson.test.ts`
- **AND** each exported function SHALL have at least one test case

#### Scenario: Env utils have unit tests
- **WHEN** `env.ts` exists at `fe/src/utils/env.ts`
- **THEN** its test file SHALL exist at `fe/src/utils/__tests__/env.test.ts`
- **AND** each exported function SHALL have at least one test case

### Requirement: Hooks import extracted utilities rather than defining them inline
After extraction, hook files SHALL import utility functions from the `utils/` module instead of defining them locally.

#### Scenario: useMapMarkers imports planesToFeatureCollection
- **WHEN** `useMapMarkers` needs `planesToFeatureCollection`
- **THEN** it SHALL import it from `../utils/geojson.ts` (or the appropriate relative path)

#### Scenario: useMapSelection imports GeoJSON helpers
- **WHEN** `useMapSelection` needs `createSelectedFeature` or `createEmptyFeatureCollection`
- **THEN** it SHALL import them from `../utils/geojson.ts`

#### Scenario: config imports parseNumericEnv
- **WHEN** `config.ts` needs `parseNumericEnv`
- **THEN** it SHALL import it from `../utils/env.ts` (or the appropriate relative path)
