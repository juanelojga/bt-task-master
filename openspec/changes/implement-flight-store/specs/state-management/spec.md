## MODIFIED Requirements

### Requirement: Zustand store pattern established
The project SHALL include a store creation pattern using zustand's `create` function, with TypeScript generic typing for the store state and actions. The flight store (`useFlightStore`) SHALL follow this pattern with a dedicated types file (`flightStore.types.ts`) separating the `FlightStoreState`, `FlightStoreActions`, and `FlightStore` interfaces.

#### Scenario: Store created with typed state and actions
- **WHEN** a developer creates a new zustand store
- **THEN** the store SHALL define an explicit TypeScript interface for both state properties and action functions

#### Scenario: Flight store types are separated from implementation
- **WHEN** a developer inspects `fe/src/features/store/flightStore.types.ts`
- **THEN** it SHALL export `FlightStoreState`, `FlightStoreActions`, and `FlightStore` interfaces

### Requirement: Custom hooks for store access
The project SHALL provide custom hooks that encapsulate zustand store access, keeping components focused on rendering rather than store implementation details. For the flight store, selector hooks SHALL be co-located in `useFlightSelectors.ts`.

#### Scenario: Custom hook wraps store selector
- **WHEN** a component needs to read or update store state
- **THEN** it SHALL use a custom hook rather than directly calling the zustand store

#### Scenario: Flight selector hooks are co-located
- **WHEN** a developer inspects `fe/src/features/store/useFlightSelectors.ts`
- **THEN** it SHALL export `usePlanes`, `useSelectedPlaneId`, `useDetailedPlane`, `useConnectionStatus`, and `useErrorMessage` hooks
