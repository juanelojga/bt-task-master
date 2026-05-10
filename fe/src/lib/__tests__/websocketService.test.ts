import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type {
  IncomingWsMessage,
  OutgoingWsMessage,
} from '../../types/domain.ts'

// ============================================================================
// WebSocket Mock Setup
// ============================================================================

/**
 * Individual mock WebSocket instance
 */
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

  close(code = 1000, reason = ''): void {
    this.readyState = 3 // CLOSED
    // Simulate async close event
    queueMicrotask(() => {
      this.onclose?.(new CloseEvent('close', { code, reason }))
    })
  }

  // Test helpers
  simulateOpen(): void {
    this.readyState = 1 // OPEN
    this.onopen?.(new Event('open'))
  }

  simulateMessage(data: unknown): void {
    this.onmessage?.(
      new MessageEvent('message', { data: JSON.stringify(data) })
    )
  }

  simulateError(): void {
    this.onerror?.(new Event('error'))
  }

  simulateClose(code = 1000, reason = ''): void {
    this.readyState = 3 // CLOSED
    this.onclose?.(new CloseEvent('close', { code, reason }))
  }
}

// Store all created instances
const mockWsInstances: MockWsInstance[] = []

/**
 * Mock WebSocket constructor - defined as a proper function (not arrow) for vitest
 */
function MockWebSocket(this: unknown, url: string): WebSocket {
  const instance = new MockWsInstance(url)
  mockWsInstances.push(instance)
  return instance as unknown as WebSocket
}

MockWebSocket.CONNECTING = 0
MockWebSocket.OPEN = 1
MockWebSocket.CLOSING = 2
MockWebSocket.CLOSED = 3

// Apply mock globally before importing the service
vi.stubGlobal('WebSocket', MockWebSocket)

// Import after mock is set up - dynamic import ensures mock is applied
const { WebSocketService } = await import('../websocketService.ts')

// ============================================================================
// Test Suite
// ============================================================================

describe('WebSocketService', () => {
  let service: {
    connect: () => void
    disconnect: () => void
    send: (msg: OutgoingWsMessage) => void
    state: string
  } | null = null

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockWsInstances.length = 0
  })

  afterEach(() => {
    service?.disconnect()
    service = null
    vi.useRealTimers()
  })

  // Helper to get the most recent WebSocket instance
  const getLatestWs = (): MockWsInstance | undefined =>
    mockWsInstances[mockWsInstances.length - 1]

  describe('constructor', () => {
    it('should create service with URL and message handler', () => {
      const onMessage = vi.fn()
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onMessage,
      })
      expect(service).toBeDefined()
      expect(service.state).toBe('disconnected')
    })

    it('should create service with only URL (all callbacks optional)', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })
      expect(service).toBeDefined()
      expect(service.state).toBe('disconnected')
    })

    it('should create service with all callback options', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onMessage: vi.fn(),
        onOpen: vi.fn(),
        onClose: vi.fn(),
        onError: vi.fn(),
      })
      expect(service).toBeDefined()
    })
  })

  describe('connect', () => {
    it('should establish a WebSocket connection', () => {
      const onOpen = vi.fn()
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onOpen,
      })

      service.connect()
      expect(getLatestWs()).toBeDefined()
      expect(service.state).toBe('connecting')

      getLatestWs()?.simulateOpen()
      expect(service.state).toBe('connected')
      expect(onOpen).toHaveBeenCalled()
    })

    it('should be idempotent when already connected', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      getLatestWs()?.simulateOpen()

      const firstInstance = getLatestWs()
      service.connect()

      expect(getLatestWs()).toBe(firstInstance)
    })

    it('should be idempotent when connecting', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      expect(service.state).toBe('connecting')

      const callCount = mockWsInstances.length
      service.connect()
      expect(mockWsInstances.length).toBe(callCount)
    })
  })

  describe('disconnect', () => {
    it('should close an active connection', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      getLatestWs()?.simulateOpen()

      const ws = getLatestWs()
      service.disconnect()
      expect(ws?.readyState).toBe(3) // CLOSED
    })

    it('should be no-op on already disconnected service', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      expect(() => service!.disconnect()).not.toThrow()
      expect(service.state).toBe('disconnected')
    })

    it('should clear reconnection timers', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      getLatestWs()?.simulateClose(1006) // Unexpected close triggers reconnect

      vi.advanceTimersByTime(500) // Halfway through reconnect delay
      service.disconnect()

      // Advance time past the original reconnect time
      vi.advanceTimersByTime(2000)

      // Should not have reconnected
      expect(service.state).toBe('disconnected')
    })
  })

  describe('message parsing', () => {
    it('should parse valid JSON messages and invoke onMessage', () => {
      const onMessage = vi.fn()
      const message: IncomingWsMessage = {
        type: 'planes',
        data: [
          {
            id: 'plane1',
            latitude: 40.7128,
            longitude: -74.006,
            altitude: 1000,
            color: '#ff0000',
          },
        ],
      }

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onMessage,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      getLatestWs()?.simulateMessage(message)

      expect(onMessage).toHaveBeenCalledWith(message)
    })

    it('should invoke onError on parse failure', () => {
      const onError = vi.fn()
      const onMessage = vi.fn()

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onMessage,
        onError,
      })

      service.connect()
      const ws = getLatestWs()
      ws?.simulateOpen()
      ws?.onmessage?.(new MessageEvent('message', { data: 'invalid json' }))

      expect(onError).toHaveBeenCalled()
      expect(onMessage).not.toHaveBeenCalled()
    })
  })

  describe('send', () => {
    it('should send message on open connection', () => {
      const message: OutgoingWsMessage = { type: 'subscribe', planeId: 'abc' }

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      service.send(message)

      expect(getLatestWs()?.sentMessages).toHaveLength(1)
      expect(getLatestWs()?.sentMessages[0]).toBe(JSON.stringify(message))
    })

    it('should be no-op on non-open connection', () => {
      const message: OutgoingWsMessage = { type: 'subscribe', planeId: 'abc' }

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      // Don't open the connection
      service.send(message)

      expect(getLatestWs()?.sentMessages).toHaveLength(0)
    })

    it('should be no-op on disconnected service', () => {
      const message: OutgoingWsMessage = { type: 'subscribe', planeId: 'abc' }

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.send(message)
      expect(service.state).toBe('disconnected')
    })
  })

  describe('state getter', () => {
    it('should return "connecting" when connect() called but not yet open', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      expect(service.state).toBe('connecting')
    })

    it('should return "connected" when onopen fired', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      expect(service.state).toBe('connected')
    })

    it('should return "disconnected" when closed', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      service.disconnect()
      expect(service.state).toBe('disconnected')
    })

    it('should return "disconnected" for new service', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
      })
      expect(service.state).toBe('disconnected')
    })
  })

  describe('reconnection', () => {
    it('should reconnect after unexpected close', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
        reconnectMaxDelay: 30000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()

      const initialCount = mockWsInstances.length
      getLatestWs()?.simulateClose(1006) // Unexpected close

      expect(mockWsInstances.length).toBe(initialCount)

      // Run pending microtasks and advance enough time for reconnect (with jitter max: 1000 * 1.2 = 1200ms)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(1500)

      expect(mockWsInstances.length).toBe(initialCount + 1)
    })

    it('should NOT reconnect after explicit disconnect (code 1000)', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      service.disconnect()

      vi.advanceTimersByTime(5000)

      // No new WebSocket should be created
      expect(mockWsInstances.length).toBe(1)
    })

    it('should NOT reconnect after close code 1008', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      getLatestWs()?.simulateClose(1008)

      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(5000)

      // No new WebSocket should be created
      expect(mockWsInstances.length).toBe(1)
    })

    it('should use exponential backoff', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
        reconnectMaxDelay: 30000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      const initialCount = mockWsInstances.length

      // First close - should reconnect after ~1000ms (with jitter range: 800-1200ms)
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(1500) // Advance enough for max jitter
      expect(mockWsInstances.length).toBe(initialCount + 1)

      getLatestWs()?.simulateOpen()

      // Second close - should reconnect after ~2000ms (doubled, jitter range: 1600-2400ms)
      // Advance just past first reconnect delay to show we haven't reconnected yet
      // But we already advanced 1500ms, so we need to reset and check that delay increased
      const countAfterFirstReconnect = mockWsInstances.length

      // Trigger another close
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      // Advance less than min possible second delay (1600ms)
      vi.advanceTimersByTime(100)
      expect(mockWsInstances.length).toBe(countAfterFirstReconnect) // Not yet
      // Now advance enough for second reconnect (max: 2400ms)
      vi.advanceTimersByTime(2500)
      expect(mockWsInstances.length).toBe(countAfterFirstReconnect + 1)
    })

    it('should cap backoff at maxDelay', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 1000,
        reconnectMaxDelay: 5000,
      })

      service.connect()
      getLatestWs()?.simulateOpen()

      // Trigger multiple reconnects
      for (let i = 0; i < 5; i++) {
        getLatestWs()?.simulateClose(1006)
        vi.advanceTimersByTime(0)
        vi.advanceTimersByTime(5000)
        getLatestWs()?.simulateOpen()
      }

      // Should have created 6 WebSockets total (1 initial + 5 reconnects)
      expect(mockWsInstances.length).toBe(6)
    })

    it('should respect maxAttempts for consecutive failures', () => {
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        reconnectInitialDelay: 100,
        reconnectMaxDelay: 1000,
        reconnectMaxAttempts: 3,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      expect(mockWsInstances.length).toBe(1) // Initial connection

      // Trigger 3 consecutive failures without opening
      // 1st failure -> reconnect
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(1500)
      expect(mockWsInstances.length).toBe(2) // + 1st reconnect

      // 2nd failure -> reconnect
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(1500)
      expect(mockWsInstances.length).toBe(3) // + 2nd reconnect

      // 3rd failure -> reconnect
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(1500)
      expect(mockWsInstances.length).toBe(4) // + 3rd reconnect

      // 4th failure -> NO reconnect (maxAttempts reached)
      getLatestWs()?.simulateClose(1006)
      vi.advanceTimersByTime(0)
      vi.advanceTimersByTime(5000)

      // Should still be 4 WebSockets (no new one created)
      expect(mockWsInstances.length).toBe(4)
    })
  })

  describe('cleanup', () => {
    it('should null out callbacks after disconnect', () => {
      const onMessage = vi.fn()
      const onOpen = vi.fn()
      const onClose = vi.fn()
      const onError = vi.fn()

      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onMessage,
        onOpen,
        onClose,
        onError,
      })

      service.connect()
      getLatestWs()?.simulateOpen()

      // Clear any calls from the initial connection
      onMessage.mockClear()
      onOpen.mockClear()
      onClose.mockClear()
      onError.mockClear()

      service.disconnect()

      // Try to trigger callbacks after disconnect using a new WebSocket instance
      // After disconnect, the callbacks should be cleared
      const ws = getLatestWs()
      if (ws) {
        ws.simulateMessage({ type: 'planes', data: [] })
        ws.simulateOpen()
        ws.simulateClose(1000)
        ws.simulateError()
      }

      expect(onMessage).not.toHaveBeenCalled()
      expect(onOpen).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('onClose callback', () => {
    it('should invoke onClose with code and reason', () => {
      const onClose = vi.fn()
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onClose,
      })

      service.connect()
      getLatestWs()?.simulateOpen()
      getLatestWs()?.simulateClose(1001, 'Going away')

      expect(onClose).toHaveBeenCalledWith(1001, 'Going away')
    })
  })

  describe('onError callback', () => {
    it('should invoke onError on WebSocket error', () => {
      const onError = vi.fn()
      service = new WebSocketService({
        url: 'ws://localhost:4000/ws/planes/basic',
        onError,
      })

      service.connect()
      getLatestWs()?.simulateError()

      expect(onError).toHaveBeenCalled()
    })
  })
})
