/**
 * Type-level tests for domain types
 *
 * These tests verify compile-time type behavior.
 * @ts-nocheck is used because type tests intentionally create
 * unused types and interfaces for compile-time verification.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  PlaneBasic,
  PlaneDetailed,
  PlaneStatus,
  BasicPlanesMessage,
  WsErrorMessage,
  IncomingWsMessage,
  SubscribeMessage,
  OutgoingWsMessage,
  ConnectionStatus,
} from '../domain'

// Re-import from barrel to test exports
import type {
  PlaneBasic as BarrelPlaneBasic,
  PlaneDetailed as BarrelPlaneDetailed,
  PlaneStatus as BarrelPlaneStatus,
  BasicPlanesMessage as BarrelBasicPlanesMessage,
  PlaneDetailsMessage as BarrelPlaneDetailsMessage,
  WsErrorMessage as BarrelWsErrorMessage,
  IncomingWsMessage as BarrelIncomingWsMessage,
  SubscribeMessage as BarrelSubscribeMessage,
  OutgoingWsMessage as BarrelOutgoingWsMessage,
  ConnectionStatus as BarrelConnectionStatus,
} from '../index'

import { describe, it, expect } from 'vitest'

// ============================================================================
// Shared test data
// ============================================================================

const samplePlaneDetailed: PlaneDetailed = {
  id: 'plane-1',
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

// ============================================================================
// Runtime Tests
// ============================================================================

describe('domain types runtime', () => {
  it('should allow creating valid PlaneBasic objects', () => {
    const plane: PlaneBasic = {
      id: 'plane-1',
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10000,
      color: '#ff0000',
    }
    expect(plane.id).toBe('plane-1')
    expect(plane.latitude).toBe(40.7128)
  })

  it('should allow creating valid PlaneDetailed objects', () => {
    expect(samplePlaneDetailed.status).toBe('enroute')
    expect(samplePlaneDetailed.origin.city).toBe('New York')
  })

  it('should allow all valid PlaneStatus values', () => {
    const statuses: PlaneStatus[] = [
      'departed',
      'enroute',
      'cruising',
      'landing',
    ]
    expect(statuses).toHaveLength(4)
  })

  it('should allow creating valid WebSocket messages', () => {
    const basicMessage: BasicPlanesMessage = {
      type: 'planes',
      data: [],
    }
    expect(basicMessage.type).toBe('planes')

    const subscribeMessage: SubscribeMessage = {
      type: 'subscribe',
      planeId: 'plane-1',
    }
    expect(subscribeMessage.planeId).toBe('plane-1')

    const errorMessage: WsErrorMessage = {
      type: 'error',
      message: 'Test error',
    }
    expect(errorMessage.message).toBe('Test error')
  })

  it('should handle discriminated union message types', () => {
    const messages: IncomingWsMessage[] = [
      { type: 'planes', data: [] },
      {
        type: 'plane-details',
        data: samplePlaneDetailed,
      },
      { type: 'error', message: 'Error' },
    ]

    // Verify type discrimination
    for (const msg of messages) {
      switch (msg.type) {
        case 'planes':
          expect(Array.isArray(msg.data)).toBe(true)
          break
        case 'plane-details':
          expect(msg.data.id).toBeDefined()
          break
        case 'error':
          expect(typeof msg.message).toBe('string')
          break
      }
    }

    expect(messages).toHaveLength(3)
  })

  it('should allow all valid ConnectionStatus values', () => {
    const statuses: ConnectionStatus[] = [
      'connected',
      'connecting',
      'disconnected',
    ]
    expect(statuses).toHaveLength(3)
  })

  it('should allow outgoing message types', () => {
    const msg: OutgoingWsMessage = {
      type: 'subscribe',
      planeId: 'test',
    }
    expect(msg.type).toBe('subscribe')
  })
})

// ============================================================================
// Type Tests (compile-time only)
// ============================================================================

describe('domain types compile-time', () => {
  it('types should be accessible from barrel exports', () => {
    // These assignments verify the types are exported correctly
    // If any type is missing from the barrel, this will fail to compile
    const _testBarrelPlaneBasic: BarrelPlaneBasic = {
      id: '1',
      latitude: 0,
      longitude: 0,
      altitude: 0,
      color: '',
    }
    const _testBarrelPlaneDetailed: BarrelPlaneDetailed =
      _testBarrelPlaneBasic as unknown as BarrelPlaneDetailed
    const _testBarrelPlaneStatus: BarrelPlaneStatus = 'enroute'
    const _testBarrelBasicMsg: BarrelBasicPlanesMessage = {
      type: 'planes',
      data: [],
    }
    const _testBarrelDetailsMsg: BarrelPlaneDetailsMessage = {
      type: 'plane-details',
      data: _testBarrelPlaneDetailed,
    }
    const _testBarrelErrorMsg: BarrelWsErrorMessage = {
      type: 'error',
      message: '',
    }
    const _testBarrelIncoming: BarrelIncomingWsMessage = _testBarrelBasicMsg
    const _testBarrelSubscribe: BarrelSubscribeMessage = {
      type: 'subscribe',
      planeId: '',
    }
    const _testBarrelOutgoing: BarrelOutgoingWsMessage = _testBarrelSubscribe
    const _testBarrelConnection: BarrelConnectionStatus = 'connected'

    // Suppress unused variable warnings by referencing them
    expect([
      _testBarrelPlaneBasic,
      _testBarrelPlaneDetailed,
      _testBarrelPlaneStatus,
      _testBarrelBasicMsg,
      _testBarrelDetailsMsg,
      _testBarrelErrorMsg,
      _testBarrelIncoming,
      _testBarrelSubscribe,
      _testBarrelOutgoing,
      _testBarrelConnection,
    ]).toBeDefined()
  })
})

// ============================================================================
// Exhaustive Switch Test
// ============================================================================

/**
 * This function verifies that a switch statement on IncomingWsMessage
 * requires handling all cases. If a case is missing, TypeScript
 * will error in the default branch.
 */
function handleMessage(message: IncomingWsMessage): string {
  switch (message.type) {
    case 'planes':
      return `Received ${message.data.length} planes`
    case 'plane-details':
      return `Received details for ${message.data.flightNumber}`
    case 'error':
      return `Error: ${message.message}`
    default:
      // This should never happen if all cases are handled
      // TypeScript will error here if a case is missing
      return exhaustiveCheck(message)
  }
}

function exhaustiveCheck(_value: never): never {
  throw new Error('Exhaustive check failed')
}

describe('exhaustive switch', () => {
  it('should handle all message types exhaustively', () => {
    const planesMsg: IncomingWsMessage = { type: 'planes', data: [] }
    expect(handleMessage(planesMsg)).toBe('Received 0 planes')

    const errorMsg: IncomingWsMessage = { type: 'error', message: 'Test' }
    expect(handleMessage(errorMsg)).toBe('Error: Test')
  })
})
