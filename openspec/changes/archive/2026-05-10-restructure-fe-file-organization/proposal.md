## Why

The frontend source lacks a consistent file organization pattern: test files sit alongside production code, React hooks are colocated with components in feature folders instead of living in dedicated `hooks/` directories, and auxiliary (non-hook) utility functions are embedded inside hook files where they are untestable in isolation. This makes the codebase harder to navigate, complicates test discovery, and prevents unit-testing pure utility functions separately from their hook consumers. Establishing clear conventions now — before the project grows — avoids accumulated technical debt.

## What Changes

- Move all test files (`*.test.ts`, `*.test.tsx`) from their current colocated positions into `__tests__/` subdirectories within the same parent folder. Establish this as a project-wide pattern.
- Move React hooks (`useMapMarkers`, `useMapSelection`, `useBasicWebSocket`, `useDetailWebSocket`, `useFlightSelectors` helpers) from component/lib folders into dedicated `hooks/` folders under each feature or top-level directory. Move their tests to `__tests__/` inside the same `hooks/` folder. Establish this as a project-wide pattern.
- Extract auxiliary pure functions currently embedded in hook files (`planesToFeatureCollection` in `useMapMarkers.ts`, `createSelectedFeature` / `createEmptyFeatureCollection` in `useMapSelection.ts`, `parseNumericEnv` in `config.ts`) into dedicated `utils/` files. Create unit tests for each extracted function in the corresponding `__tests__/` folder.
- Update all import paths across the codebase after file moves.
- Update the vitest configuration if needed to support the `__tests__/` directory pattern.

## Capabilities

### New Capabilities
- `test-colocation-pattern`: Establishes the `__tests__/` subdirectory convention — all test files live inside an `__tests__/` folder within the same directory as the code they test.
- `hooks-folder-pattern`: Establishes the `hooks/` directory convention — React hooks live in a dedicated `hooks/` folder under each feature or top-level directory, separate from components and utilities.
- `utils-extraction`: Extracts auxiliary pure functions from hook files into dedicated `utils/` modules with full unit test coverage.

### Modified Capabilities
- `plane-markers`: `planesToFeatureCollection` moves from `useMapMarkers.ts` to a `utils/` module; hook imports it instead of defining it inline.
- `map-selection`: `createSelectedFeature` and `createEmptyFeatureCollection` move from `useMapSelection.ts` to a `utils/` module; hook imports them.
- `ws-config`: `parseNumericEnv` moves from `config.ts` to a `utils/` module; config imports it.

## Impact

- **File moves**: Every `.test.ts` / `.test.tsx` file, all hook files in `features/map/` and `lib/`, and utility extractions from hook/config files.
- **Import paths**: All files that import moved modules must update their paths (`MapView.tsx`, `App.tsx`, store imports, etc.).
- **Vitest config**: May need `include` pattern adjustment to find `__tests__/` directories.
- **No behavioral changes**: All moves are structural; runtime behavior is identical.
- **No backend changes**: This is frontend-only.
