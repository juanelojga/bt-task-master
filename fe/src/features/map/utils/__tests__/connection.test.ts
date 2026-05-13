import { describe, it, expect } from 'vitest'
import { deriveAggregateStatus } from '../connection.ts'
import type { ConnectionStatus } from '../../../../types/domain.ts'

describe('deriveAggregateStatus', () => {
  describe('both connections are connected', () => {
    it('should return connected when both basic and details are connected', () => {
      const result = deriveAggregateStatus('connected', 'connected')
      expect(result).toBe('connected')
    })
  })

  describe('at least one connection is disconnected', () => {
    it('should return disconnected when basic is disconnected and details is connected', () => {
      const result = deriveAggregateStatus('disconnected', 'connected')
      expect(result).toBe('disconnected')
    })

    it('should return disconnected when details is disconnected and basic is connected', () => {
      const result = deriveAggregateStatus('connected', 'disconnected')
      expect(result).toBe('disconnected')
    })

    it('should return disconnected when both are disconnected', () => {
      const result = deriveAggregateStatus('disconnected', 'disconnected')
      expect(result).toBe('disconnected')
    })

    it('should return disconnected when basic is disconnected and details is connecting (disconnected wins)', () => {
      const result = deriveAggregateStatus('disconnected', 'connecting')
      expect(result).toBe('disconnected')
    })

    it('should return disconnected when details is disconnected and basic is connecting (disconnected wins)', () => {
      const result = deriveAggregateStatus('connecting', 'disconnected')
      expect(result).toBe('disconnected')
    })
  })

  describe('at least one is connecting, neither is disconnected', () => {
    it('should return connecting when basic is connecting and details is connected', () => {
      const result = deriveAggregateStatus('connecting', 'connected')
      expect(result).toBe('connecting')
    })

    it('should return connecting when details is connecting and basic is connected', () => {
      const result = deriveAggregateStatus('connected', 'connecting')
      expect(result).toBe('connecting')
    })

    it('should return connecting when both are connecting', () => {
      const result = deriveAggregateStatus('connecting', 'connecting')
      expect(result).toBe('connecting')
    })
  })

  describe('edge cases', () => {
    it('should handle all status values correctly via exhaustive union', () => {
      const allStatuses: ConnectionStatus[] = [
        'connected',
        'connecting',
        'disconnected',
      ]

      for (const basic of allStatuses) {
        for (const details of allStatuses) {
          const result = deriveAggregateStatus(basic, details)

          if (basic === 'disconnected' || details === 'disconnected') {
            expect(result).toBe('disconnected')
          } else if (basic === 'connecting' || details === 'connecting') {
            expect(result).toBe('connecting')
          } else {
            expect(result).toBe('connected')
          }
        }
      }
    })
  })
})
