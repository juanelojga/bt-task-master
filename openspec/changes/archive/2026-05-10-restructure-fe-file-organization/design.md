## Context

The frontend (`fe/src/`) currently organizes files by colocating everything — components, hooks, tests, and utility functions — in the same folder. Specifically:

- **Tests**: 10 test files sit alongside their production counterparts (e.g., `useMapMarkers.test.ts` next to `useMapMarkers.ts`).
- **Hooks**: `useMapMarkers.ts` and `useMapSelection.ts` live in `features/map/` alongside the `MapView.tsx` component. Similarly, `useBasicWebSocket.ts`, `useDetailWebSocket.ts` live in `lib/` alongside the non-hook `websocketService.ts`.
- **Utility functions**: Pure functions like `planesToFeatureCollection`, `createSelectedFeature`, `createEmptyFeatureCollection`, and `parseNumericEnv` are defined inline inside hook or config files, making them unreachable for isolated unit testing.

This is a pure structural refactoring — no behavior changes, no new features, no API changes.

## Goals / Non-Goals

**Goals:**
- Establish a consistent `__tests__/` subdirectory pattern for all test files across the frontend.
- Establish a consistent `hooks/` directory pattern — hooks live in a dedicated folder, separate from components and utility code.
- Extract pure auxiliary functions from hook/config files into dedicated `utils/` modules with full unit test coverage.
- Preserve all existing test coverage; all current tests must continue passing after moves.
- Ensure all import paths are updated correctly after file moves.

**Non-Goals:**
- No behavioral or API changes of any kind.
- No new features or capabilities added.
- No changes to the backend (`be/`).
- No refactoring of the logic inside functions — only moving them to new files.
- No changes to the Zustand store structure or WebSocket service class.

## Decisions

### 1. Test directory convention: `__tests__/` subdirectory

**Decision**: Place all test files in an `__tests__/` folder within the same parent directory as the code they test.

**Rationale**: This is a widespread convention in JavaScript/TypeScript projects (Jest's default, Next.js, etc.). It keeps tests near the code they test while separating concerns visually. Vitest's default `include` pattern (`**/*.{test,spec}.{ts,tsx}`) already finds files in `__tests__/` without config changes.

**Alternatives considered**:
- `tests/` (without underscores): Less conventional in the JS ecosystem, more commonly used for integration/e2e tests at the project root.
- Separate top-level `test/` directory: Breaks the "near the code" principle; harder to maintain as the project grows.

### 2. Hooks directory convention: `hooks/` subdirectory

**Decision**: Move all React hooks into `hooks/` folders under their parent feature or top-level directory.

**File mapping**:
- `features/map/useMapMarkers.ts` → `features/map/hooks/useMapMarkers.ts`
- `features/map/useMapSelection.ts` → `features/map/hooks/useMapSelection.ts`
- `features/store/useFlightSelectors.ts` → `features/store/hooks/useFlightSelectors.ts`
- `lib/useBasicWebSocket.ts` → `lib/hooks/useBasicWebSocket.ts`
- `lib/useDetailWebSocket.ts` → `lib/hooks/useDetailWebSocket.ts`

**Rationale**: Separating hooks from components and services improves discoverability. A developer looking for hooks knows to check `hooks/`. This scales well as more hooks are added.

**Alternatives considered**:
- Top-level `hooks/` directory: Loses the feature-scoped context; harder to know which hook belongs to which feature.
- Keep colocated: Current state — works for small projects but becomes confusing as the number of files grows.

### 3. Utility extraction: dedicated `utils/` files

**Decision**: Extract pure auxiliary functions from hook/config files into `utils/` modules with their own unit tests.

**Extraction mapping**:
- `planesToFeatureCollection()` from `useMapMarkers.ts` → `features/map/utils/geojson.ts`
- `createSelectedFeature()` + `createEmptyFeatureCollection()` from `useMapSelection.ts` → `features/map/utils/geojson.ts` (same file — they're all GeoJSON helpers)
- `parseNumericEnv()` from `config.ts` → `utils/env.ts`

**Rationale**: Pure functions are the easiest to unit-test and the most reusable. Extracting them from hooks enables isolated testing without mocking React or MapLibre. Grouping related GeoJSON functions in one `utils/geojson.ts` avoids unnecessary file proliferation.

**Alternatives considered**:
- One util file per function: Too many tiny files; related functions benefit from co-location.
- Keep inline but add exports: Still can't import/test without pulling in the hook's dependencies.

### 4. Vitest configuration

**Decision**: No changes needed. Vitest's default `include: ['**/*.{test,spec}.{ts,tsx}']` already recursively finds tests in `__tests__/` directories.

**Rationale**: Verified by checking the current `vitest.config.ts` — no restrictive include patterns are set.

## Risks / Trade-offs

- **[Import path breakage]** → Mitigation: Move files one module at a time, update imports, run `tsc -b` and `npm run test` after each move to catch broken paths immediately.
- **[Test discovery confusion]** → Mitigation: The `__tests__/` pattern is well-known. Adding a brief note to AGENTS.md or a `CONTRIBUTING.md` section documents the convention.
- **[Merge conflicts during move]** → Mitigation: This is a greenfield project with a single contributor; merge conflicts are unlikely. If they occur, they're purely import-path changes and easy to resolve.
- **[Over-engineering for small project]** → Mitigation: The conventions scale well and cost nothing at this size. Establishing them now is cheaper than retrofitting later.
