# test-colocation-pattern Specification

## Purpose
TBD - created by archiving change restructure-fe-file-organization. Update Purpose after archive.
## Requirements
### Requirement: Test files reside in __tests__ subdirectories
All test files (`*.test.ts`, `*.test.tsx`) SHALL be placed inside an `__tests__/` subdirectory within the same parent folder as the production code they test.

#### Scenario: Test file location for a module
- **WHEN** a module exists at `fe/src/<path>/<module>.ts`
- **THEN** its test file SHALL be located at `fe/src/<path>/__tests__/<module>.test.ts`

#### Scenario: Test file location for a component
- **WHEN** a component exists at `fe/src/<path>/<Component>.tsx`
- **THEN** its test file SHALL be located at `fe/src/<path>/__tests__/<Component>.test.tsx`

### Requirement: No test files colocated with production code
No `*.test.ts` or `*.test.tsx` file SHALL exist in the same directory as the production code it tests; all test files SHALL be inside an `__tests__/` subdirectory.

#### Scenario: No test files at production code level
- **WHEN** the `fe/src/` directory tree is scanned
- **THEN** no `*.test.ts` or `*.test.tsx` file SHALL exist outside an `__tests__/` directory

### Requirement: Existing tests continue passing after move
All test cases that existed before the move SHALL continue to pass with identical behavior after relocation to `__tests__/` directories.

#### Scenario: Full test suite passes after restructuring
- **WHEN** `npm run test` is executed after all test files have been moved to `__tests__/` directories
- **THEN** all previously passing tests SHALL still pass
- **AND** no new test failures SHALL be introduced

