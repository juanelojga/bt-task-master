import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { IncomingWsMessage, PlaneBasic } from '../../../types/domain.ts'
import type { FlightStore } from '../../../features/store/flightStore.types.ts'

// ============================================================================
// Mock WebSocket
// ============================================================================

class MockWsInstance {
  url: string
  readyState = 0 // CONNECTING
  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  sentMessages: string[] = []

  constructor(url: string) {
    this.url = url
  }

  send(data: string): void {
    this.sentMessages.push(data)
  }

  close(): void {
    this.readyState = 3
    queueMicrotask(() => {
      this.onclose?.(new CloseEvent('close', { code: 1000 }))
    })
  }

  simulateOpen(): void {
    this.readyState = 1
    this.onopen?.(new Event('open'))
  }

  simulateMessage(data: unknown): void {
    this.onmessage?.(
      new MessageEvent('message', { data: JSON.stringify(data) })
    )
  }

  simulateClose(code = 1000): void {
    this.readyState = 3
    this.onclose?.(new CloseEvent('close', { code }))
  }
}

const mockWsInstances: MockWsInstance[] = []

function MockWebSocket(this: unknown, url: string): WebSocket {
  const instance = new MockWsInstance(url)
  mockWsInstances.push(instance)
  return instance as unknown as WebSocket
}

MockWebSocket.CONNECTING = 0
MockWebSocket.OPEN = 1
MockWebSocket.CLOSING = 2
MockWebSocket.CLOSED = 3

vi.stubGlobal('WebSocket', MockWebSocket)

// ============================================================================
// Mock Store
// ============================================================================

const mockSetConnectionStatus = vi.fn()
const mockUpdatePlanes = vi.fn()
const mockSetNotice = vi.fn()
const mockClearNotice = vi.fn()

vi.mock('../../../features/store/hooks/useFlightStore.ts', () => ({
  useFlightStore: vi.fn((selector: (state: FlightStore) => unknown) =>
    selector({
      setConnectionStatus: mockSetConnectionStatus,
      updatePlanes: mockUpdatePlanes,
      setNotice: mockSetNotice,
      clearNotice: mockClearNotice,
    } as unknown as FlightStore)
  ),
}))

// Import after mocks
const { useBasicWebSocket } = await import('../useBasicWebSocket.ts')

describe('useBasicWebSocket', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
    mockWsInstances.length = 0
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const getLatestWs = (): MockWsInstance | undefined =>
    mockWsInstances[mockWsInstances.length - 1]

  it('should set connecting status on mount', () => {
    renderHook(() => useBasicWebSocket())

    expect(mockSetConnectionStatus).toHaveBeenCalledWith('basic', 'connecting')
  })

  it('should create WebSocket with basic URL', () => {
    renderHook(() => useBasicWebSocket())

    expect(mockWsInstances.length).toBe(1)
    expect(getLatestWs()?.url).toBe('ws://localhost:4000/ws/planes/basic')
  })

  it('should set connected status on open', () => {
    renderHook(() => useBasicWebSocket())

    getLatestWs()?.simulateOpen()

    expect(mockSetConnectionStatus).toHaveBeenCalledWith('basic', 'connected')
  })

  it('should set disconnected status on close', () => {
    renderHook(() => useBasicWebSocket())

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateClose()

    expect(mockSetConnectionStatus).toHaveBeenCalledWith(
      'basic',
      'disconnected'
    )
  })

  it('should dispatch planes message to updatePlanes', () => {
    renderHook(() => useBasicWebSocket())

    const planes: PlaneBasic[] = [
      {
        id: 'plane1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 1000,
        color: '#ff0000',
      },
    ]
    const message: IncomingWsMessage = { type: 'planes', data: planes }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockUpdatePlanes).toHaveBeenCalledWith(planes)
  })

  it('should dispatch error message to setNotice with error severity', () => {
    renderHook(() => useBasicWebSocket())

    const message: IncomingWsMessage = {
      type: 'error',
      message: 'Server error',
    }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockSetNotice).toHaveBeenCalledWith({
      message: 'Server error',
      severity: 'error',
    })
  })

  it('should clear notice on successful connection', () => {
    renderHook(() => useBasicWebSocket())

    getLatestWs()?.simulateOpen()

    expect(mockClearNotice).toHaveBeenCalled()
  })

  it('should ignore non-planes, non-error messages', () => {
    renderHook(() => useBasicWebSocket())

    // Plane details message should be ignored on basic connection
    const message: IncomingWsMessage = {
      type: 'plane-details',
      data: {
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
      },
    }

    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateMessage(message)

    expect(mockUpdatePlanes).not.toHaveBeenCalled()
    expect(mockSetNotice).not.toHaveBeenCalled()
  })

  it('should disconnect on unmount', () => {
    const { unmount } = renderHook(() => useBasicWebSocket())

    expect(mockWsInstances.length).toBe(1)

    unmount()

    // After disconnect, the WebSocket's handlers are removed
    // (close() is not called on CONNECTING sockets to avoid browser warning)
    expect(getLatestWs()?.onopen).toBeNull()
    expect(getLatestWs()?.onclose).toBeNull()
    expect(getLatestWs()?.onerror).toBeNull()
    expect(getLatestWs()?.onmessage).toBeNull()
  })

  it('should pass reconnection config from config.ts', () => {
    renderHook(() => useBasicWebSocket())

    // The service should be created with reconnection enabled
    // We can verify this by triggering a close and checking for reconnect
    getLatestWs()?.simulateOpen()
    getLatestWs()?.simulateClose(1006) // Unexpected close

    vi.advanceTimersByTime(0)
    vi.advanceTimersByTime(1500)

    // Should have created a new WebSocket (reconnect)
    expect(mockWsInstances.length).toBe(2)
  })
})
