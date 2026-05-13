import { describe, it, expect, beforeEach } from 'vitest'
import { useFlightStore } from '../hooks/useFlightStore.ts'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'

// Helper to reset store state between tests
function resetStore(): void {
  const store = useFlightStore.getState()
  store.deselectPlane()
  store.clearNotice()
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

describe('Flight Store', () => {
  beforeEach(() => {
    resetStore()
  })

  // ============================================================================
  // 4.1 Initial State Tests
  // ============================================================================
  describe('initial state', () => {
    it('should have empty planes array', () => {
      expect(useFlightStore.getState().planes).toEqual([])
    })

    it('should have null selectedPlaneId', () => {
      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
    })

    it('should have null detailedPlane', () => {
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })

    it('should have disconnected status for both connections', () => {
      expect(useFlightStore.getState().connectionStatus).toEqual({
        basic: 'disconnected',
        details: 'disconnected',
      })
    })

    it('should have null notice', () => {
      expect(useFlightStore.getState().notice).toBeNull()
    })
  })

  // ============================================================================
  // 4.2 updatePlanes Tests
  // ============================================================================
  describe('updatePlanes', () => {
    it('should update planes array with new data', () => {
      const planes = [createPlaneBasic('plane-1'), createPlaneBasic('plane-2')]

      useFlightStore.getState().updatePlanes(planes)

      expect(useFlightStore.getState().planes).toEqual(planes)
    })

    it('should not deselect when selected plane remains in new data', () => {
      const plane1 = createPlaneBasic('plane-1')
      const plane2 = createPlaneBasic('plane-2')

      // Setup: select plane-1
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))

      // Update with both planes still present
      useFlightStore.getState().updatePlanes([plane1, plane2])

      // Should still be selected
      expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
      expect(useFlightStore.getState().detailedPlane).not.toBeNull()
    })

    it('should auto-deselect when selected plane disappears from data', () => {
      const plane2 = createPlaneBasic('plane-2')

      // Setup: select plane-1 and set detailed data
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))

      // Update with only plane-2 (plane-1 disappeared)
      useFlightStore.getState().updatePlanes([plane2])

      // Should be deselected
      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().detailedPlane).toBeNull()
      expect(useFlightStore.getState().planes).toEqual([plane2])
    })

    it('should set info notice when selected plane disappears', () => {
      const plane2 = createPlaneBasic('plane-2')

      // Setup: select plane-1
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))

      // Update with only plane-2 (plane-1 disappeared)
      useFlightStore.getState().updatePlanes([plane2])

      // Should have info notice
      expect(useFlightStore.getState().notice).toEqual({
        message: 'Plane no longer available',
        severity: 'info',
      })
    })

    it('should not auto-deselect when no plane is selected', () => {
      const plane1 = createPlaneBasic('plane-1')

      // No plane selected
      expect(useFlightStore.getState().selectedPlaneId).toBeNull()

      // Update planes
      useFlightStore.getState().updatePlanes([plane1])

      // Should still have no selection
      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().planes).toEqual([plane1])
    })
  })

  // ============================================================================
  // 4.3 selectPlane and deselectPlane Tests
  // ============================================================================
  describe('selectPlane', () => {
    it('should set selectedPlaneId', () => {
      useFlightStore.getState().selectPlane('plane-1')

      expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
    })

    it('should clear detailedPlane when selecting', () => {
      // Setup: have some detailed data
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))
      expect(useFlightStore.getState().detailedPlane).not.toBeNull()

      // Select a different plane
      useFlightStore.getState().selectPlane('plane-2')

      // Detailed data should be cleared
      expect(useFlightStore.getState().selectedPlaneId).toBe('plane-2')
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })

    it('should allow re-selecting same plane (clears detailed)', () => {
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))

      // Re-select same plane
      useFlightStore.getState().selectPlane('plane-1')

      expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })
  })

  describe('deselectPlane', () => {
    it('should clear selectedPlaneId and detailedPlane', () => {
      // Setup: select a plane with detailed data
      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(createPlaneDetailed('plane-1'))

      // Deselect
      useFlightStore.getState().deselectPlane()

      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })

    it('should be idempotent when no plane is selected', () => {
      // Ensure no selection
      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().detailedPlane).toBeNull()

      // Deselect when already deselected
      useFlightStore.getState().deselectPlane()

      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })
  })

  // ============================================================================
  // 4.4 setDetailedPlane Tests
  // ============================================================================
  describe('setDetailedPlane', () => {
    it('should set detailedPlane when ID matches selectedPlaneId', () => {
      const detailed = createPlaneDetailed('plane-1')

      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(detailed)

      expect(useFlightStore.getState().detailedPlane).toEqual(detailed)
    })

    it('should ignore data when ID does not match selectedPlaneId', () => {
      const detailed = createPlaneDetailed('plane-2')

      useFlightStore.getState().selectPlane('plane-1')
      useFlightStore.getState().setDetailedPlane(detailed)

      expect(useFlightStore.getState().detailedPlane).toBeNull()
      expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
    })

    it('should ignore data when no plane is selected', () => {
      const detailed = createPlaneDetailed('plane-1')

      expect(useFlightStore.getState().selectedPlaneId).toBeNull()

      useFlightStore.getState().setDetailedPlane(detailed)

      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })
  })

  // ============================================================================
  // 4.5 setConnectionStatus Tests
  // ============================================================================
  describe('setConnectionStatus', () => {
    it('should update basic connection status independently', () => {
      useFlightStore.getState().setConnectionStatus('basic', 'connecting')

      expect(useFlightStore.getState().connectionStatus.basic).toBe(
        'connecting'
      )
      expect(useFlightStore.getState().connectionStatus.details).toBe(
        'disconnected'
      )
    })

    it('should update details connection status independently', () => {
      useFlightStore.getState().setConnectionStatus('details', 'connected')

      expect(useFlightStore.getState().connectionStatus.details).toBe(
        'connected'
      )
      expect(useFlightStore.getState().connectionStatus.basic).toBe(
        'disconnected'
      )
    })

    it('should allow both statuses to be set independently', () => {
      useFlightStore.getState().setConnectionStatus('basic', 'connected')
      useFlightStore.getState().setConnectionStatus('details', 'connecting')

      expect(useFlightStore.getState().connectionStatus).toEqual({
        basic: 'connected',
        details: 'connecting',
      })
    })

    it('should allow all connection status values', () => {
      const statuses = ['disconnected', 'connecting', 'connected'] as const

      for (const status of statuses) {
        useFlightStore.getState().setConnectionStatus('basic', status)
        expect(useFlightStore.getState().connectionStatus.basic).toBe(status)
      }
    })
  })

  // ============================================================================
  // 4.6 setNotice and clearNotice Tests
  // ============================================================================
  describe('setNotice', () => {
    it('should set notice with error severity', () => {
      useFlightStore.getState().setNotice({
        message: 'Connection lost',
        severity: 'error',
      })

      expect(useFlightStore.getState().notice).toEqual({
        message: 'Connection lost',
        severity: 'error',
      })
    })

    it('should set notice with info severity', () => {
      useFlightStore.getState().setNotice({
        message: 'Plane no longer available',
        severity: 'info',
      })

      expect(useFlightStore.getState().notice).toEqual({
        message: 'Plane no longer available',
        severity: 'info',
      })
    })

    it('should overwrite existing notice', () => {
      useFlightStore.getState().setNotice({
        message: 'First notice',
        severity: 'warning',
      })
      useFlightStore.getState().setNotice({
        message: 'Second notice',
        severity: 'error',
      })

      expect(useFlightStore.getState().notice).toEqual({
        message: 'Second notice',
        severity: 'error',
      })
    })
  })

  describe('clearNotice', () => {
    it('should clear existing notice', () => {
      useFlightStore.getState().setNotice({
        message: 'Test notice',
        severity: 'error',
      })
      expect(useFlightStore.getState().notice).not.toBeNull()

      useFlightStore.getState().clearNotice()

      expect(useFlightStore.getState().notice).toBeNull()
    })

    it('should be safe to call when no notice exists', () => {
      expect(useFlightStore.getState().notice).toBeNull()

      useFlightStore.getState().clearNotice()

      expect(useFlightStore.getState().notice).toBeNull()
    })
  })
})
