import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  setupWebSocketMock,
  mockWsInstances,
  getLatestWs,
} from '../../__tests__/mockWebSocket.ts'
import type { IncomingWsMessage, PlaneDetailed } from '../../../types/domain.ts'
import type { FlightStore } from '../../../features/store/flightStore.types.ts'

// ============================================================================
// Mock Store
// ============================================================================

let mockSelectedPlaneId: string | null = null
const mockSetConnectionStatus = vi.fn()
const mockSetDetailedPlane = vi.fn()
const mockDeselectPlane = vi.fn()
const mockSetNotice = vi.fn()
const mockClearNotice = vi.fn()

vi.mock('../../../features/store/hooks/useFlightStore.ts', () => ({
  useFlightStore: vi.fn((selector: (state: FlightStore) => unknown) =>
    selector({
      get selectedPlaneId() {
        return mockSelectedPlaneId
      },
      setConnectionStatus: mockSetConnectionStatus,
      setDetailedPlane: mockSetDetailedPlane,
      deselectPlane: mockDeselectPlane,
      setNotice: mockSetNotice,
      clearNotice: mockClearNotice,
    } as unknown as FlightStore)
  ),
}))

setupWebSocketMock()

// Import after mocks
const { useDetailWebSocket } = await import('../useDetailWebSocket.ts')

describe('useDetailWebSocket', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
    mockWsInstances.length = 0
    mockSelectedPlaneId = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not connect when no plane is selected', () => {
    mockSelectedPlaneId = null
    renderHook(() => useDetailWebSocket())

    expect(mockWsInstances.length).toBe(0)
  })

  it('should connect when a plane is selected', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    expect(mockWsInstances.length).toBe(1)
    expect(getLatestWs()?.url).toBe('ws://localhost:4000/ws/planes/details')
    expect(mockSetConnectionStatus).toHaveBeenCalledWith(
      'details',
      'connecting'
    )
  })

  it('should send subscribe message on connection open', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()

    expect(getLatestWs()?.sentMessages).toHaveLength(1)
    expect(JSON.parse(getLatestWs()?.sentMessages[0] ?? '{}')).toEqual({
      type: 'subscribe',
      planeId: 'plane1',
    })
  })

  it('should disconnect on deselect', () => {
    // Start with a plane selected
    mockSelectedPlaneId = 'plane1'
    const { rerender } = renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()
    expect(mockWsInstances.length).toBe(1)
    expect(getLatestWs()?.readyState).toBe(1) // OPEN

    // Deselect by setting to null and rerendering
    mockSelectedPlaneId = null
    rerender()

    // After deselect, the WebSocket should be closed
    expect(getLatestWs()?.readyState).toBe(3) // CLOSED
  })

  it('should reuse connection and send new subscribe when switching planes', () => {
    mockSelectedPlaneId = 'plane1'
    const { rerender } = renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()
    expect(mockWsInstances.length).toBe(1)
    expect(getLatestWs()?.sentMessages).toHaveLength(1)

    // Switch to different plane
    mockSelectedPlaneId = 'plane2'
    rerender()

    // Should reuse the same WebSocket
    expect(mockWsInstances.length).toBe(1)
    // Should send new subscribe
    expect(getLatestWs()?.sentMessages).toHaveLength(2)
    expect(JSON.parse(getLatestWs()?.sentMessages[1] ?? '{}')).toEqual({
      type: 'subscribe',
      planeId: 'plane2',
    })
  })

  it('should dispatch plane-details to setDetailedPlane when IDs match', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    const planeDetails: PlaneDetailed = {
      id: 'plane1',
      model: 'Boeing 737',
      airline: 'Test Air',
      flightNumber: 'TA123',
      registration: 'N12345',
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 1000,
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
    const message: IncomingWsMessage = {
      type: 'plane-details',
      data: planeDetails,
    }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockSetDetailedPlane).toHaveBeenCalledWith(planeDetails)
    expect(mockClearNotice).toHaveBeenCalled()
  })

  it('should ignore plane-details when IDs do not match', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    const planeDetails: PlaneDetailed = {
      id: 'plane2', // Different ID
      model: 'Boeing 737',
      airline: 'Test Air',
      flightNumber: 'TA123',
      registration: 'N12345',
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 1000,
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
    const message: IncomingWsMessage = {
      type: 'plane-details',
      data: planeDetails,
    }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockSetDetailedPlane).not.toHaveBeenCalled()
  })

  it('should handle close code 1008 by deselecting and setting error notice', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateClose(1008)

    expect(mockDeselectPlane).toHaveBeenCalled()
    expect(mockSetNotice).toHaveBeenCalledWith({
      message: 'Plane not found or subscription invalid',
      severity: 'error',
    })
  })

  it('should attempt reconnection on network failure (non-1000, non-1008)', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateClose(1006) // Abnormal closure

    vi.advanceTimersByTime(0)
    vi.advanceTimersByTime(1500)

    // Should have created a new WebSocket (reconnect)
    expect(mockWsInstances.length).toBe(2)
  })

  it('should dispatch error messages to setNotice with error severity', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    const message: IncomingWsMessage = {
      type: 'error',
      message: 'Subscription failed',
    }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockSetNotice).toHaveBeenCalledWith({
      message: 'Subscription failed',
      severity: 'error',
    })
  })

  it('should set connected status on open', () => {
    mockSelectedPlaneId = 'plane1'
    renderHook(() => useDetailWebSocket())

    getLatestWs()?.simulateOpen()

    expect(mockSetConnectionStatus).toHaveBeenCalledWith('details', 'connected')
  })
})
