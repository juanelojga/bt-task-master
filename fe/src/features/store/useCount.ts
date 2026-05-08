import { useStore } from './useStore.ts'

export function useCount(): number {
  return useStore((state) => state.count)
}
