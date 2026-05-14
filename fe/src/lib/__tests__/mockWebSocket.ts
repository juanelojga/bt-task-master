import { vi } from 'vitest'

// ============================================================================
// Shared Mock WebSocket for tests
// ============================================================================

export class MockWsInstance {
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
    this.readyState = 3
    queueMicrotask(() => {
      this.onclose?.(new CloseEvent('close', { code, reason }))
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

  simulateClose(code = 1000, reason = ''): void {
    this.readyState = 3
    this.onclose?.(new CloseEvent('close', { code, reason }))
  }

  simulateError(): void {
    this.onerror?.(new Event('error'))
  }
}

export const mockWsInstances: MockWsInstance[] = []

export function createMockWebSocket(this: unknown, url: string): WebSocket {
  const instance = new MockWsInstance(url)
  mockWsInstances.push(instance)
  return instance as unknown as WebSocket
}

createMockWebSocket.CONNECTING = 0
createMockWebSocket.OPEN = 1
createMockWebSocket.CLOSING = 2
createMockWebSocket.CLOSED = 3

export function setupWebSocketMock(): void {
  vi.stubGlobal('WebSocket', createMockWebSocket)
}

export function getLatestWs(): MockWsInstance | undefined {
  return mockWsInstances[mockWsInstances.length - 1]
}
