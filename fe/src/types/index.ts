/**
 * Barrel export for all frontend types
 */

// Map types (existing)
export type { LngLat, MapConfig, MapStyle } from './map'

// Domain types (planes, WebSocket messages, connection status)
export type {
  PlaneBasic,
  PlaneDetailed,
  PlaneStatus,
  BasicPlanesMessage,
  PlaneDetailsMessage,
  WsErrorMessage,
  IncomingWsMessage,
  SubscribeMessage,
  OutgoingWsMessage,
  ConnectionStatus,
} from './domain'
