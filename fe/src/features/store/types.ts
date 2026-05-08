export interface StoreState {
  count: number
}

export interface StoreActions {
  increment: () => void
  decrement: () => void
}

export interface Store extends StoreState, StoreActions {}
