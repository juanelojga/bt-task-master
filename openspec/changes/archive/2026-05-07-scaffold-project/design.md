## Context

This is a greenfield project with no existing codebase. The goal is to establish a modern React application using Vite and TypeScript as the foundation for a map-centric web application. The project will use maplibre-gl for interactive map rendering and zustand for lightweight client-side state management. Developer experience and code quality are prioritized from day one.

## Goals / Non-Goals

**Goals:**
- Bootstrap a production-ready Vite + React + TypeScript project
- Configure strict TypeScript enforcement to catch bugs at compile time
- Set up automated code quality (lint, format, pre-commit hooks)
- Integrate maplibre-gl as the map rendering engine
- Integrate zustand for predictable, minimal state management
- Establish a feature-based folder structure that scales
- Configure Tailwind CSS for utility-first styling

**Non-Goals:**
- Building specific UI features or pages (that comes in future changes)
- Server-side rendering or backend setup
- CI/CD pipeline configuration
- Deployment infrastructure
- Custom map layers or data sources

## Decisions

### D1: Vite over Create React App / Next.js
**Choice**: Vite with the `react-ts` template
**Rationale**: Vite provides near-instant HMR via esbuild, lightweight config, and no opinionated framework overhead. CRA is deprecated. Next.js adds SSR complexity unnecessary for a client-side map application.
**Alternatives considered**: Next.js (too heavy for SPA), CRA (deprecated)

### D2: TypeScript Strict Mode
**Choice**: Enable `strict: true` in tsconfig.json; enforce `unknown` over `any` via ESLint
**Rationale**: Strict mode catches null/undefined bugs at compile time. Banning `any` ensures type safety across the codebase.
**Alternatives considered**: Loose TypeScript (defeats the purpose of using TypeScript)

### D3: ESLint Flat Config
**Choice**: `eslint.config.js` with Flat Config format
**Rationale**: Flat Config is the new standard, simpler to manage, and avoids `.eslintrc` legacy issues. Includes `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, and `@typescript-eslint/recommended-type-checked`.
**Alternatives considered**: Legacy `.eslintrc` (deprecated approach)

### D4: Prettier with eslint-config-prettier
**Choice**: Prettier for formatting, `eslint-config-prettier` to disable conflicting ESLint rules
**Rationale**: Separation of concerns — ESLint catches bugs, Prettier enforces style. `eslint-config-prettier` prevents rule conflicts.
**Alternatives considered**: ESLint-only formatting (inferior formatting, more config)

### D5: Husky + lint-staged
**Choice**: Husky for git hooks, lint-staged to run lint/format only on staged files
**Rationale**: Pre-commit hooks prevent bad code from entering the repo. lint-staged keeps commits fast by only checking changed files.
**Alternatives considered**: CI-only linting (bugs caught too late), pre-push hooks (still slow)

### D6: Tailwind CSS
**Choice**: Tailwind CSS for utility-first styling
**Rationale**: Scales without large CSS files, consistent design tokens, excellent editor support. Avoids class name collisions by default.
**Alternatives considered**: CSS Modules (more boilerplate), styled-components (runtime overhead)

### D7: zustand over Redux / Context
**Choice**: zustand for global state management
**Rationale**: Minimal boilerplate, no providers, built-in selectors for re-render optimization, excellent TypeScript support. Redux is overkill for this project's scope.
**Alternatives considered**: Redux Toolkit (too much boilerplate), React Context (re-render issues at scale)

### D8: Feature-based folder structure
**Choice**: Group by feature domain (`src/features/<name>/`) rather than by file type
**Rationale**: Co-locating components, hooks, and utilities by feature improves discoverability and reduces merge conflicts as the project grows.
**Alternatives considered**: Type-based grouping (`src/components/`, `src/hooks/`) — doesn't scale well

## Risks / Trade-offs

- **Tailwind CSS class proliferation** → Use consistent component abstractions and consider `@apply` for repeated patterns
- **ESLint type-checked rules require full TypeScript program** → May slow linting on large codebases; acceptable at project start
- **Flat Config ecosystem maturity** → Some older plugins may not yet support Flat Config; use compatibility utilities if needed
- **zustand lack of devtools by default** → Add `zustand/middleware` devtools integration from the start
