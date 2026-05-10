import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  usePlanes,
  useSelectedPlaneId,
  useDetailedPlane,
  useConnectionStatus,
  useErrorMessage,
} from '../useFlightSelectors.ts'
import { useFlightStore } from '../useFlightStore.ts'
import type { PlaneBasic, PlaneDetailed } from '../../../../types/domain.ts'

// Helper to reset store state between tests
function resetStore(): void {
  const store = useFlightStore.getState()
  store.deselectPlane()
  store.clearError()
  store.setConnectionStatus('basic', 'disconnected')
  store.setConnectionStatus('details', 'disconnected')
  store.updatePlanes([])
}

// Test data factories
function createPlaneBasic(id: string): PlaneBasic {
  return {
    id,
    latitude: 40.7128,
    longitude: -74.006,
    altitude: 10000,
    color: '#ff0000',
  }
}

function createPlaneDetailed(id: string): PlaneDetailed {
  return {
    id,
    model: 'Boeing 737',
    airline: 'Test Airlines',
    flightNumber: 'TA123',
    registration: 'N12345',
    latitude: 40.7128,
    longitude: -74.006,
    altitude: 10000,
    speed: 250,
    heading: 90,
    verticalSpeed: 0,
    origin: { airport: 'JFK', city: 'New York' },
    destination: { airport: 'LAX', city: 'Los Angeles' },
    flightDuration: 3600,
    estimatedArrival: Date.now() + 3600000,
    numberOfPassengers: 150,
    maxPassengers: 180,
    status: 'enroute',
    color: '#ff0000',
  }
}

describe('Flight Store Selectors', () => {
  beforeEach(() => {
    resetStore()
  })

  // ============================================================================
  // 4.7 Selector Hooks Tests
  // ============================================================================
  describe('usePlanes', () => {
    it('should return planes array', () => {
      const planes = [createPlaneBasic('plane-1'), createPlaneBasic('plane-2')]
      useFlightStore.getState().updatePlanes(planes)

      const { result } = renderHook(() => usePlanes())

      expect(result.current).toEqual(planes)
    })

    it('should return empty array initially', () => {
      const { result } = renderHook(() => usePlanes())

      expect(result.current).toEqual([])
    })

    it('should update when planes change', () => {
      const { result, rerender } = renderHook(() => usePlanes())

      expect(result.current).toEqual([])

      const planes = [createPlaneBasic('plane-1')]
      useFlightStore.getState().updatePlanes(planes)
      rerender()

      expect(result.current).toEqual(planes)
    })
  })

  describe('useSelectedPlaneId', () => {
    it('should return null initially', () => {
      const { result } = renderHook(() => useSelectedPlaneId())

      expect(result.current).toBeNull()
    })

    it('should return selected plane ID', () => {
      useFlightStore.getState().selectPlane('plane-1')

      const { result } = renderHook(() => useSelectedPlaneId())

      expect(result.current).toBe('plane-1')
    })

    it('should update when selection changes', () => {
      const { result, rerender } = renderHook(() => useSelectedPlaneId())

      expect(result.current).toBeNull()

      useFlightStore.getState().selectPlane('plane-1')
      rerender()

      expect(result.current).toBe('plane-1')

      useFlightStore.getState().deselectPlane()
      rerender()

      expect(result.current).toBeNull()
    })
  })

  describe('useDetailedPlane', () => {
    it('should return null initially', () => {
      const { result } = renderHook(() => useDetailedPlane())

      expect(result.current).toBeNull()
    })

    it('should return detailed plane data when set', () => {
      const detailed = createPlaneDetailed('plane-1')
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(detailed)

      const { result } = renderHook(() => useDetailedPlane())

      expect(result.current).toEqual(detailed)
    })

    it('should update when detailed plane changes', () => {
      const { result, rerender } = renderHook(() => useDetailedPlane())

      expect(result.current).toBeNull()

      const detailed = createPlaneDetailed('plane-1')
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(detailed)
      rerender()

      expect(result.current).toEqual(detailed)
    })
  })

  describe('useConnectionStatus', () => {
    it('should return initial disconnected status', () => {
      const { result } = renderHook(() => useConnectionStatus())

      expect(result.current).toEqual({
        basic: 'disconnected',
        details: 'disconnected',
      })
    })

    it('should return updated basic status', () => {
      useFlightStore.getState().setConnectionStatus('basic', 'connected')

      const { result } = renderHook(() => useConnectionStatus())

      expect(result.current.basic).toBe('connected')
      expect(result.current.details).toBe('disconnected')
    })

    it('should return updated details status', () => {
      useFlightStore.getState().setConnectionStatus('details', 'connecting')

      const { result } = renderHook(() => useConnectionStatus())

      expect(result.current.details).toBe('connecting')
      expect(result.current.basic).toBe('disconnected')
    })

    it('should update when status changes', () => {
      const { result, rerender } = renderHook(() => useConnectionStatus())

      expect(result.current.basic).toBe('disconnected')

      useFlightStore.getState().setConnectionStatus('basic', 'connected')
      rerender()

      expect(result.current.basic).toBe('connected')
    })
  })

  describe('useErrorMessage', () => {
    it('should return null initially', () => {
      const { result } = renderHook(() => useErrorMessage())

      expect(result.current).toBeNull()
    })

    it('should return error message when set', () => {
      useFlightStore.getState().setError('Test error')

      const { result } = renderHook(() => useErrorMessage())

      expect(result.current).toBe('Test error')
    })

    it('should update when error changes', () => {
      const { result, rerender } = renderHook(() => useErrorMessage())

      expect(result.current).toBeNull()

      useFlightStore.getState().setError('First error')
      rerender()

      expect(result.current).toBe('First error')

      useFlightStore.getState().clearError()
      rerender()

      expect(result.current).toBeNull()
    })
  })

  // ============================================================================
  // Selector function tests (verify selectors extract correct slices)
  // ============================================================================
  describe('selector functions', () => {
    it('usePlanes selector extracts planes array from state', () => {
      const planes = [createPlaneBasic('plane-1')]
      useFlightStore.getState().updatePlanes(planes)

      const { result } = renderHook(() => usePlanes())

      expect(result.current).toBe(planes)
    })

    it('useSelectedPlaneId selector extracts selectedPlaneId from state', () => {
      useFlightStore.getState().selectPlane('plane-1')

      const { result } = renderHook(() => useSelectedPlaneId())

      expect(result.current).toBe('plane-1')
    })

    it('useDetailedPlane selector extracts detailedPlane from state', () => {
      const detailed = createPlaneDetailed('plane-1')
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(detailed)

      const { result } = renderHook(() => useDetailedPlane())

      expect(result.current).toBe(detailed)
    })

    it('useConnectionStatus selector extracts connectionStatus from state', () => {
      useFlightStore.getState().setConnectionStatus('basic', 'connected')

      const { result } = renderHook(() => useConnectionStatus())

      expect(result.current).toEqual({
        basic: 'connected',
        details: 'disconnected',
      })
    })

    it('useErrorMessage selector extracts errorMessage from state', () => {
      useFlightStore.getState().setError('Test error')

      const { result } = renderHook(() => useErrorMessage())

      expect(result.current).toBe('Test error')
    })
  })
})
