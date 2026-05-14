import { useFlightStore } from '../hooks/useFlightStore.ts'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'

// Helper to reset store state between tests
export function resetStore(): void {
  const store = useFlightStore.getState()
  store.deselectPlane()
  store.clearNotice()
  store.setConnectionStatus('basic', 'disconnected')
  store.setConnectionStatus('details', 'disconnected')
  store.updatePlanes([])
}

// Test data factories
export function createPlaneBasic(id: string): PlaneBasic {
  return {
    id,
    latitude: 40.7128,
    longitude: -74.006,
    altitude: 10000,
    color: '#ff0000',
  }
}

export function createPlaneDetailed(id: string): PlaneDetailed {
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
