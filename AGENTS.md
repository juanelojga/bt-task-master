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
npm run preview      # Preview production build locally
```

### Pre-push
- **Linting**: `npm run lint` must pass — all `.ts`/`.tsx` files are linted. `no-explicit-any` and `exhaustive-deps` are enforced.
- **TypeScript**: `tsc -b` runs strict mode with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.
- **Formatting**: Prettier runs via lint-staged on staged files.

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
- ❌ **No hardcoded WebSocket URLs** — use environment variables or a `config.ts`.
- ⚠️ Always handle WebSocket closure code 1008 (invalid subscription) gracefully — show error, deselect plane, do not crash.
- ⚠️ When adding features, consult `PRD.md` for requirements and `PLAN.md` for architecture decisions already made.
