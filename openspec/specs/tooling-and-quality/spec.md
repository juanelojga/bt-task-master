## ADDED Requirements

### Requirement: ESLint Flat Config
The project SHALL use ESLint with Flat Config (`eslint.config.js`), including the plugins `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, and `@typescript-eslint/recommended-type-checked`.

#### Scenario: ESLint runs with Flat Config
- **WHEN** a developer runs `npm run lint`
- **THEN** ESLint SHALL execute using `eslint.config.js` and apply rules from all configured plugins

### Requirement: React hooks rules enforced
The `eslint-plugin-react-hooks` plugin SHALL be active, enforcing the Rules of Hooks: hooks SHALL only be called at the top level of functional components, never inside loops, conditions, or nested functions.

#### Scenario: Hook called inside conditional fails lint
- **WHEN** a developer writes a React hook call inside an `if` statement
- **THEN** ESLint SHALL report an error from `eslint-plugin-react-hooks`

### Requirement: React Refresh plugin active
The `eslint-plugin-react-refresh` plugin SHALL be active to ensure components export only valid React components for proper HMR behavior.

#### Scenario: Non-component export flagged in page
- **WHEN** a developer exports a non-component constant from a file that also exports a component
- **THEN** ESLint SHALL report a warning from `eslint-plugin-react-refresh`

### Requirement: TypeScript type-checked rules
The `@typescript-eslint/recommended-type-checked` rule set SHALL be enabled for deeper static analysis that catches type-narrowing issues.

#### Scenario: Unsafe type assertion flagged
- **WHEN** a developer uses an unsafe type assertion that the type-checked rules detect
- **THEN** ESLint SHALL report the issue

### Requirement: Prettier configured
Prettier SHALL be configured with a `.prettierrc` file. `eslint-config-prettier` SHALL be included to disable ESLint rules that conflict with Prettier.

#### Scenario: Prettier formats code on save
- **WHEN** a developer saves a file with Format on Save enabled
- **THEN** the file SHALL be formatted according to `.prettierrc` rules

#### Scenario: No ESLint-Prettier conflicts
- **WHEN** a developer runs ESLint after Prettier formatting
- **THEN** no formatting-related ESLint errors SHALL be reported

### Requirement: Pre-commit hooks with Husky and lint-staged
Husky SHALL be configured with a `pre-commit` hook that runs lint-staged. lint-staged SHALL run ESLint and Prettier on staged files before each commit.

#### Scenario: Bad code blocked from commit
- **WHEN** a developer attempts to commit a file with a lint error
- **THEN** the commit SHALL be rejected by the pre-commit hook

#### Scenario: Staged files auto-formatted
- **WHEN** a developer commits a file with formatting issues
- **THEN** lint-staged SHALL auto-format the file and the commit SHALL proceed

### Requirement: No any usage
The `@typescript-eslint/no-explicit-any` rule SHALL be set to `error`. Developers SHALL use `unknown` instead of `any` for unpredictable data types.

#### Scenario: Usage of any fails lint
- **WHEN** a developer writes a variable typed as `any`
- **THEN** ESLint SHALL report an error requiring `unknown` or a more specific type

### Requirement: Hook dependency arrays enforced
The `react-hooks/exhaustive-deps` rule SHALL be set to `error`, ensuring `useEffect`, `useMemo`, and `useCallback` always have complete dependency arrays.

#### Scenario: Missing dependency in useEffect flagged
- **WHEN** a developer writes a `useEffect` that references a variable not in its dependency array
- **THEN** ESLint SHALL report an error from `react-hooks/exhaustive-deps`
