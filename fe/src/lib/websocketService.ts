import type { IncomingWsMessage, OutgoingWsMessage } from '../types/domain.ts'

/**
 * Connection state for WebSocketService
 */
export type WsConnectionState = 'connecting' | 'connected' | 'disconnected'

/**
 * Options for WebSocketService constructor
 */
export interface WebSocketServiceOptions {
  /** WebSocket URL to connect to */
  url: string
  /** Called when a message is received */
  onMessage?: (data: IncomingWsMessage) => void
  /** Called when connection opens */
  onOpen?: () => void
  /** Called when connection closes */
  onClose?: (code: number, reason: string) => void
  /** Called on error */
  onError?: (error: Event) => void
  /** Initial delay for reconnection (ms) */
  reconnectInitialDelay?: number
  /** Maximum delay for reconnection (ms) */
  reconnectMaxDelay?: number
  /** Maximum number of reconnection attempts */
  reconnectMaxAttempts?: number
}

/**
 * WebSocket connection manager with lifecycle control and reconnection logic
 */
export class WebSocketService {
  private readonly url: string
  private onMessage: ((data: IncomingWsMessage) => void) | null
  private onOpen: (() => void) | null
  private onClose: ((code: number, reason: string) => void) | null
  private onError: ((error: Event) => void) | null
  private ws: WebSocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectAttempts = 0
  private readonly reconnectInitialDelay: number
  private readonly reconnectMaxDelay: number
  private readonly reconnectMaxAttempts: number
  private explicitDisconnect = false

  constructor(options: WebSocketServiceOptions) {
    this.url = options.url
    this.onMessage = options.onMessage ?? null
    this.onOpen = options.onOpen ?? null
    this.onClose = options.onClose ?? null
    this.onError = options.onError ?? null
    this.reconnectInitialDelay = options.reconnectInitialDelay ?? 1000
    this.reconnectMaxDelay = options.reconnectMaxDelay ?? 30000
    this.reconnectMaxAttempts = options.reconnectMaxAttempts ?? 10
  }

  /**
   * Get current connection state
   */
  get state(): WsConnectionState {
    if (this.ws === null) {
      return 'disconnected'
    }
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      default:
        return 'disconnected'
    }
  }

  /**
   * Establish WebSocket connection
   * Idempotent - does nothing if already connected or connecting
   */
  connect(): void {
    if (
      this.ws !== null &&
      (this.ws.readyState === WebSocket.CONNECTING ||
        this.ws.readyState === WebSocket.OPEN)
    ) {
      // Already connecting or connected
      return
    }

    this.explicitDisconnect = false

    try {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
    } catch {
      // If WebSocket creation fails, trigger error handling
      this.scheduleReconnect()
    }
  }

  /**
   * Close WebSocket connection with code 1000
   * Idempotent - safe to call on disconnected service
   */
  disconnect(): void {
    this.explicitDisconnect = true

    // Clear any pending reconnection
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // Close the WebSocket if it exists
    if (this.ws !== null) {
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close(1000)
      }
      this.ws = null
    }

    // Reset reconnection state
    this.reconnectAttempts = 0

    // Clear callbacks to prevent memory leaks
    this.onMessage = null
    this.onOpen = null
    this.onClose = null
    this.onError = null
  }

  /**
   * Send a message on the WebSocket
   * No-op if connection is not open
   */
  send(message: OutgoingWsMessage): void {
    if (this.ws === null || this.ws.readyState !== WebSocket.OPEN) {
      return
    }
    this.ws.send(JSON.stringify(message))
  }

  private handleOpen(): void {
    this.reconnectAttempts = 0
    this.onOpen?.()
  }

  private handleMessage(event: MessageEvent): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed: IncomingWsMessage = JSON.parse(event.data as string)
      this.onMessage?.(parsed)
    } catch {
      this.onError?.(
        new ErrorEvent('error', {
          message: 'Failed to parse WebSocket message',
        })
      )
    }
  }

  private handleClose(event: CloseEvent): void {
    this.onClose?.(event.code, event.reason)

    // Don't reconnect if this was an explicit disconnect
    if (this.explicitDisconnect) {
      return
    }

    // Don't reconnect on 1008 (invalid subscription) - let caller handle it
    if (event.code === 1008) {
      return
    }

    // Schedule reconnection for other close codes
    this.scheduleReconnect()
  }

  private handleError(event: Event): void {
    this.onError?.(event)
  }

  private scheduleReconnect(): void {
    if (
      this.reconnectMaxAttempts > 0 &&
      this.reconnectAttempts >= this.reconnectMaxAttempts
    ) {
      // Max attempts reached
      return
    }

    const delay = this.calculateBackoffDelay()
    this.reconnectAttempts += 1

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private calculateBackoffDelay(): number {
    // Exponential backoff: initialDelay * 2^attempts
    let delay = this.reconnectInitialDelay * Math.pow(2, this.reconnectAttempts)

    // Cap at max delay
    if (delay > this.reconnectMaxDelay) {
      delay = this.reconnectMaxDelay
    }

    // Apply ±20% jitter to prevent thundering herd
    const jitter = delay * 0.2 * (Math.random() * 2 - 1)
    return Math.max(0, Math.floor(delay + jitter))
  }
}
