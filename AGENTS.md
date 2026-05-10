# Flight Radar — AI Agent Instructions

## Project Overview

Flight Radar is a **real-time flight tracking frontend** that consumes simulated aircraft data from a WebSocket backend and renders plane positions on an interactive MapLibre map.

- **`be/`** — Node.js + TypeScript WebSocket server simulating 20 planes. Serves basic plane data (`/ws/planes/basic`) and per-plane detail subscriptions (`/ws/planes/details`). Run with `tsx`.
- **`fe/`** — React 19 + TypeScript + Vite single-page app. Uses Zustand for state, MapLibre GL for the map, and Tailwind CSS v4 for styling.
- **`openspec/`** — Change proposals and specs using the OpenSpec workflow.
- See `README.md` for human-facing docs, `PRD.md` for detailed product requirements, and `PLAN.md` for the implementation plan.

## Directory Structure

```
be/src/             → Backend source (server.ts, simulation.ts, types.ts, websocket-handlers.ts)
fe/
  src/
    features/       → Feature modules (map/, store/)
    types/          → Shared TypeScript types (map.ts)
    lib/            → Reusable utilities/services
  index.html        → Vite entry HTML
```

## Build, Test, and Push

### Backend
```bash
cd be
npm install
npm run dev          # Start dev server (ws://localhost:4000)
npm run build        # Compile TypeScript → dist/
# Note: no tests configured for backend
```

### Frontend
```bash
cd fe
npm install
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Type-check (tsc -b) then Vite build → dist/
npm run lint         # ESLint across all TS/TSX files
npm run test         # Run all tests once (vitest run)
npm run test:watch   # Watch mode for TDD workflow
npm run test:coverage # Test coverage report
npm run preview      # Preview production build locally
```

### Pre-push
- **Linting**: `npm run lint` must pass — all `.ts`/`.tsx` files are linted. `no-explicit-any` and `exhaustive-deps` are enforced.
- **TypeScript**: `tsc -b` runs strict mode with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.
- **Tests**: `npm run test` must pass. Coverage thresholds are not enforced globally but individual feature modules should aim for ≥80% coverage.
- **Formatting**: Prettier runs via lint-staged on staged files.
- **Pre-commit**: Husky runs `lint-staged` (ESLint → Prettier → vitest related) on staged `.ts`/`.tsx` files.

## Development Workflow

### Code Conventions
- **File extensions**: Always use `.ts` for non-JSX and `.tsx` for React components.
- **Imports**: `verbatimModuleSyntax` is enabled — use `import type` for type-only imports.
- **State management**: Zustand stores live in `fe/src/features/store/`. Each store uses `devtools` middleware with named actions. Selector hooks (e.g., `useCount()`) are thin wrappers over `useStore(selector)`.
- **Components**: Functional components only, no class components. Props interfaces defined inline or imported from `types/`.
- **Styling**: Tailwind CSS v4 (utility classes). No CSS modules — keep styles in `index.css` (global resets) and Tailwind classes.
- **Naming**: PascalCase for components, camelCase for functions/variables. Feature folders for component groups.
- **Prettier**: `semi: false`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`.
- **No default exports** except `App.tsx` and Vite entry points.

### TypeScript Types
- Backend types are the canonical source: `be/src/types.ts` defines `PlaneBasic`, `PlaneDetailed`, and WebSocket message types.
- Frontend types go in `fe/src/types/`. Shared domain types should mirror the backend.

### WebSocket Patterns
- Basic connection: `/ws/planes/basic` — receives `{ type: "planes", data: PlaneBasic[] }`.
- Details connection: `/ws/planes/details` — send `{ type: "subscribe", planeId: string }`, receive `{ type: "plane-details", data: PlaneDetailed }`.
- Errors: `{ type: "error", message: string }`. Invalid subscriptions close with code 1008.
- Open details WS on select; close on deselect. Switch planes = send new subscribe on existing connection.

## Common Pitfalls & Prohibited Patterns

- ❌ **Do not modify `be/` code** — the backend is provided as-is for the interview task.
- ❌ **No `any` types** — the lint rule `@typescript-eslint/no-explicit-any: error` is enforced.
- ❌ **No CSS modules or styled-components** — use Tailwind only.
- ❌ **No default exports** in new files — use named exports.
- ❌ **No state outside Zustand stores** — avoid `useState`/`useReducer` for app-global state; prefer selectors in the store.
- ❌ **No inline WebSocket logic in components** — keep WS connection management in `lib/` or a service layer.
- ❌ **No auxiliary/helper functions defined inside hook or component files** — extract them to dedicated `utils/` files within the feature module (e.g., `map/utils/interaction.ts`, `map/utils/selection.ts`). Hooks should compose utilities, not define them.
- ❌ **No hardcoded WebSocket URLs** — use environment variables or a `config.ts`.
- ⚠️ Always handle WebSocket closure code 1008 (invalid subscription) gracefully — show error, deselect plane, do not crash.
- ⚠️ When adding features, consult `PRD.md` for requirements and `PLAN.md` for architecture decisions already made.

## TDD (Test-Driven Development)

All new features and bug fixes must follow the Red-Green-Refactor cycle:

### Workflow
1. **Red** — Write a failing test that defines the expected behavior.
2. **Green** — Write the minimum code to make the test pass.
3. **Refactor** — Clean up the implementation while keeping tests green.

### Test Structure
- **Unit tests** (`*.test.ts`): Pure logic, Zustand stores, utilities, type guards.
- **Component tests** (`*.test.tsx`): React components with `@testing-library/react` and `userEvent`.
- **Integration tests**: WebSocket hooks, store ↔ component interactions.
- **Test file location**: Co-locate tests with the module they test (`lib/websocketService.test.ts` next to `lib/websocketService.ts`).

### Testing Stack
| Concern       | Tool                        |
| ------------- | --------------------------- |
| Test runner   | Vitest                      |
| DOM env       | jsdom                       |
| React testing | @testing-library/react      |
| User events   | @testing-library/user-event |
| Matchers      | @testing-library/jest-dom   |
| Coverage      | @vitest/coverage-v8         |

### Testing Patterns
- **Zustand stores**: Create a fresh store instance for each test (no shared state). Reset between tests with `beforeEach`.
- **WebSocket hooks**: Mock the native `WebSocket` class. Use `vi.fn()` for `send`, `close`, and event handlers.
- **MapLibre**: Mock `maplibre-gl` globally (`vi.mock('maplibre-gl')`). Test map interactions by asserting on the mock.
- **Component tests**: Render with a test store provider or reset the real store. Query by accessible role/text, not by CSS classes or test IDs (prefer `screen.getByRole` over `screen.getByTestId`).
- **Async tests**: Use `waitFor` / `findBy*` for WebSocket message handling and state updates.

### Coverage Guidelines
- Aim for ≥80% branch coverage on new modules.
- Mandatory coverage for: Zustand stores, WebSocket message handling, type guards/validation, error paths.
- Not required but valuable: pure rendering components, map marker helpers.

## SOLID Principles

All code must adhere to SOLID principles. The ESLint config enforces many of these mechanically.

### S — Single Responsibility Principle
> A module/function/class should have one reason to change.

- **Files**: Max 200 lines (`max-lines` rule). If a file grows beyond this, split it.
- **Functions**: Max 50 lines (`max-lines-per-function`). Extract helpers for anything longer.
- **Cyclomatic complexity**: Max 10 (`complexity` rule). Too many branches = too many responsibilities.
- **Zustand stores**: A store should own one domain (e.g., flight data vs. UI state). Split stores if domains diverge.

### O — Open/Closed Principle
> Open for extension, closed for modification.

- Use composition over inheritance. Prefer passing callbacks/children over hardcoding behavior.
- TypeScript discriminated unions make it easy to add new message types without modifying existing handlers.
- WebSocket message handling: a `switch`/`if` on `message.type` with individual functions per type allows adding new types without touching existing ones.

### L — Liskov Substitution Principle
> Subtypes must be substitutable for their base types.

- TypeScript strict mode and `@typescript-eslint/prefer-readonly` prevent accidental mutation of shared state.
- Never use `as` / type assertions to force a type (`@typescript-eslint/no-unnecessary-type-assertion` is enforced). Type guards are the only safe way to narrow.

### I — Interface Segregation Principle
> No client should depend on methods it doesn't use.

- **Small interfaces**: Props interfaces should only include what the component actually uses.
- **`max-params: 3`**: Functions with >3 parameters indicate a bloated interface — refactor into an options object with a typed interface.
- **`no-empty-interface`**: Extending an empty interface is a code smell — use the original type directly.

### D — Dependency Inversion Principle
> Depend on abstractions, not concretions.

- **WebSocket service**: Components depend on the Zustand store, not on the WebSocket directly. The WS layer is injected behind the store interface.
- **MapLibre**: The map instance is scoped to `MapView` via `useRef`. No other component touches it directly.
- **Config**: Environment URLs and intervals come from `config.ts`, never hardcoded.
