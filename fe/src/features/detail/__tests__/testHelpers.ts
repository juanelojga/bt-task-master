import type { PlaneDetailed } from '../../../types/domain.ts'

export function createMockPlane(
  overrides: Partial<PlaneDetailed> = {}
): PlaneDetailed {
  return {
    id: 'plane-1',
    model: 'Boeing 737-800',
    airline: 'Test Airlines',
    flightNumber: 'TA123',
    registration: 'N12345',
    latitude: 40.7128,
    longitude: -74.006,
    altitude: 10668,
    speed: 250,
    heading: 270,
    verticalSpeed: 5.08,
    origin: {
      airport: 'JFK',
      city: 'New York',
    },
    destination: {
      airport: 'LAX',
      city: 'Los Angeles',
    },
    flightDuration: 16200,
    estimatedArrival: 1704110400,
    numberOfPassengers: 180,
    maxPassengers: 200,
    status: 'enroute',
    color: '#3b82f6',
    ...overrides,
  }
}

export const mockPlane: PlaneDetailed = createMockPlane()
