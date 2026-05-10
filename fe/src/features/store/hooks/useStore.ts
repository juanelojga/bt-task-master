import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Store } from '../types.ts'

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () =>
        set((state) => ({ count: state.count + 1 }), false, 'increment'),
      decrement: () =>
        set((state) => ({ count: state.count - 1 }), false, 'decrement'),
    }),
    { name: 'AppStore' }
  )
)
