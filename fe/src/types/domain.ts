/**
 * Domain types for Flight Radar frontend
 * Mirrors backend types from be/src/types.ts
 *
 * @see be/src/types.ts - Canonical source for type definitions
 */

// ============================================================================
// Plane Types
// ============================================================================

/**
 * Basic plane information broadcast to all clients
 */
export type PlaneBasic = {
  id: string
  latitude: number
  longitude: number
  altitude: number
  color: string
}

/**
 * Flight status values for detailed plane information
 */
export type PlaneStatus = 'departed' | 'enroute' | 'cruising' | 'landing'

/**
 * Detailed plane information for subscribed clients
 */
export type PlaneDetailed = {
  id: string

  // Aircraft
  model: string
  airline: string
  flightNumber: string
  registration: string

  // Position
  latitude: number
  longitude: number
  altitude: number // meters
  speed: number // meters per second
  heading: number
  verticalSpeed: number

  // Route
  origin: {
    airport: string
    city: string
  }
  destination: {
    airport: string
    city: string
  }

  // Time
  flightDuration: number
  estimatedArrival: number

  // Load & status
  numberOfPassengers: number
  maxPassengers: number
  status: PlaneStatus

  // UI
  color: string
}

// ============================================================================
// WebSocket Message Types (Incoming)
// ============================================================================

/**
 * Message containing basic plane data for all planes
 */
export type BasicPlanesMessage = {
  type: 'planes'
  data: PlaneBasic[]
}

/**
 * Message containing detailed data for a subscribed plane
 */
export type PlaneDetailsMessage = {
  type: 'plane-details'
  data: PlaneDetailed
}

/**
 * Error message from WebSocket server
 */
export type WsErrorMessage = {
  type: 'error'
  message: string
}

/**
 * Union of all incoming WebSocket messages
 * Discriminated by the `type` field
 */
export type IncomingWsMessage =
  | BasicPlanesMessage
  | PlaneDetailsMessage
  | WsErrorMessage

// ============================================================================
// WebSocket Message Types (Outgoing)
// ============================================================================

/**
 * Message to subscribe to detailed updates for a specific plane
 */
export type SubscribeMessage = {
  type: 'subscribe'
  planeId: string
}

/**
 * Union of all outgoing WebSocket messages
 * Discriminated by the `type` field
 */
export type OutgoingWsMessage = SubscribeMessage

// ============================================================================
// Connection Types
// ============================================================================

/**
 * WebSocket connection status for tracking connection state
 */
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

// ============================================================================
// Notice Types
// ============================================================================

/**
 * Severity level for user-facing notices
 */
export type NoticeSeverity = 'error' | 'warning' | 'info'

/**
 * User-facing notice with message and severity
 */
export type Notice = {
  message: string
  severity: NoticeSeverity
}
