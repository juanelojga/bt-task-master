## Why

The project needs a solid foundation before any feature development can begin. Currently there is no project scaffold, no build tooling, no linting/formatting setup, and no core libraries installed. Establishing these best practices from the start prevents technical debt and ensures consistent, type-safe code across the entire codebase.

## What Changes

- Bootstrap a new React + TypeScript project using the official Vite template
- Install and configure `maplibre-gl` as the map rendering library
- Install and configure `zustand` for lightweight state management
- Enable TypeScript strict mode (`strict: true`) and enforce `unknown` over `any`
- Set up ESLint with Flat Config (`eslint.config.js`), including `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, and `@typescript-eslint/recommended-type-checked`
- Set up Prettier with `eslint-config-prettier` to avoid rule conflicts
- Add Husky + lint-staged for automated pre-commit linting and formatting
- Add Tailwind CSS for utility-first styling
- Establish a feature-based folder structure

## Capabilities

### New Capabilities
- `project-scaffold`: Vite + React + TypeScript project bootstrap, folder structure, and core dependencies
- `tooling-and-quality`: ESLint (Flat Config), Prettier, Husky, lint-staged, and TypeScript strict mode configuration
- `map-integration`: maplibre-gl integration as the map rendering foundation
- `state-management`: zustand store setup and patterns for application state

### Modified Capabilities
<!-- No existing capabilities to modify -->

## Impact

- **Dependencies**: New project with `react`, `react-dom`, `typescript`, `vite`, `maplibre-gl`, `zustand`, `tailwindcss`, `eslint`, `prettier`, `husky`, `lint-staged`, and related plugins
- **Tooling**: All developer tooling (lint, format, type-check, pre-commit hooks) configured from scratch
- **Folder structure**: Feature-based directory layout established as the standard pattern
- **No breaking changes**: Greenfield project, no existing code affected
