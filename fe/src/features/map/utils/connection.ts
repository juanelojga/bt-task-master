import type { ConnectionStatus } from '../../../types/domain.ts'

/**
 * Derives the aggregate connection state from both WebSocket connections.
 * Returns 'connected' if both are connected, otherwise the most severe state.
 */
export function deriveAggregateStatus(
  basic: ConnectionStatus,
  details: ConnectionStatus
): ConnectionStatus {
  if (basic === 'disconnected' || details === 'disconnected') {
    return 'disconnected'
  }
  if (basic === 'connecting' || details === 'connecting') {
    return 'connecting'
  }
  return 'connected'
}
