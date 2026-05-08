## ADDED Requirements

### Requirement: Vite React TypeScript project
The system SHALL be bootstrapped using the Vite `react-ts` template, producing a working development server with HMR.

#### Scenario: Project bootstraps and runs
- **WHEN** a developer runs `npm run dev`
- **THEN** the Vite dev server starts and the default React application renders in the browser with HMR enabled

### Requirement: TypeScript strict mode enabled
The project SHALL have `strict: true` enabled in `tsconfig.json`, ensuring all strict type-checking options are active.

#### Scenario: Strict mode catches null/undefined errors
- **WHEN** a developer writes code that accesses a potentially null value without a null check
- **THEN** the TypeScript compiler emits a compile-time error

### Requirement: Explicit interfaces for props and state
All React component props and state objects SHALL be defined with explicit TypeScript interfaces or types. The use of `any` SHALL be prohibited by ESLint rule.

#### Scenario: Component with untyped props fails lint
- **WHEN** a developer defines a React component without typed props
- **THEN** the ESLint `@typescript-eslint/no-explicit-any` rule reports an error

### Requirement: Feature-based folder structure
The project SHALL organize source code under `src/features/<feature-name>/`, with each feature directory containing its own components, hooks, and utilities.

#### Scenario: Feature directory layout
- **WHEN** a developer creates a new feature
- **THEN** the feature directory SHALL contain co-located component, hook, and utility files within `src/features/<feature-name>/`

### Requirement: Core dependencies installed
The project SHALL have `react`, `react-dom`, `typescript`, and `vite` as core dependencies in `package.json`.

#### Scenario: Dependencies are present
- **WHEN** a developer inspects `package.json`
- **THEN** `react`, `react-dom`, `typescript`, and `vite` SHALL be listed with compatible versions

### Requirement: Tailwind CSS configured
The project SHALL have Tailwind CSS installed and configured with its content paths set to scan `src/` for class usage.

#### Scenario: Tailwind utility classes work
- **WHEN** a developer applies a Tailwind utility class to a JSX element
- **THEN** the class SHALL be present in the compiled CSS output
