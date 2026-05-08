## Purpose
Define the state management architecture using Zustand, including store creation patterns, selector hooks, and integration with devtools for debugging.
## Requirements
### Requirement: zustand dependency installed
The project SHALL have `zustand` installed as a runtime dependency in `package.json`.

#### Scenario: zustand is available
- **WHEN** a developer inspects `package.json`
- **THEN** `zustand` SHALL be listed in `dependencies` with a compatible version

### Requirement: Zustand store pattern established
The project SHALL include a store creation pattern using zustand's `create` function, with TypeScript generic typing for the store state and actions. The flight store (`useFlightStore`) SHALL follow this pattern with a dedicated types file (`flightStore.types.ts`) separating the `FlightStoreState`, `FlightStoreActions`, and `FlightStore` interfaces.

#### Scenario: Store created with typed state and actions
- **WHEN** a developer creates a new zustand store
- **THEN** the store SHALL define an explicit TypeScript interface for both state properties and action functions

#### Scenario: Flight store types are separated from implementation
- **WHEN** a developer inspects `fe/src/features/store/flightStore.types.ts`
- **THEN** it SHALL export `FlightStoreState`, `FlightStoreActions`, and `FlightStore` interfaces

### Requirement: Zustand devtools middleware configured
The project SHALL configure zustand with the `devtools` middleware from `zustand/middleware` to enable Redux DevTools integration in development mode.

#### Scenario: Store actions visible in DevTools
- **WHEN** a developer dispatches a store action in development mode
- **THEN** the action SHALL appear in the Redux DevTools extension with the store name and action label

### Requirement: Selective store subscriptions
Store consumers SHALL use zustand selectors to subscribe only to the specific state slices they need, preventing unnecessary re-renders.

#### Scenario: Component re-renders only on relevant state change
- **WHEN** a component subscribes to a specific slice of store state via a selector
- **THEN** the component SHALL re-render only when that specific slice changes, not when unrelated state updates

### Requirement: Custom hooks for store access
The project SHALL provide custom hooks that encapsulate zustand store access, keeping components focused on rendering rather than store implementation details. For the flight store, selector hooks SHALL be co-located in `useFlightSelectors.ts`.

#### Scenario: Custom hook wraps store selector
- **WHEN** a component needs to read or update store state
- **THEN** it SHALL use a custom hook rather than directly calling the zustand store

#### Scenario: Flight selector hooks are co-located
- **WHEN** a developer inspects `fe/src/features/store/useFlightSelectors.ts`
- **THEN** it SHALL export `usePlanes`, `useSelectedPlaneId`, `useDetailedPlane`, `useConnectionStatus`, and `useErrorMessage` hooks

