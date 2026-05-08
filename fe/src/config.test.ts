import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Test suite for config module
 * Verifies default values, environment variable overrides, and NaN fallback behavior
 */

describe('config', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset modules before each test to re-evaluate env var logic
    vi.resetModules()
    // Clear any existing env vars

    const env = import.meta.env as Record<string, string | undefined>
    delete env.VITE_WS_BASIC_URL
    delete env.VITE_WS_DETAILS_URL
    delete env.VITE_WS_RECONNECT_INITIAL_DELAY
    delete env.VITE_WS_RECONNECT_MAX_DELAY
    delete env.VITE_WS_RECONNECT_MAX_ATTEMPTS
    delete env.VITE_MAP_STYLE_URL
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('wsBasicUrl', () => {
    it('should use default value when env var is not set', async () => {
      const config = await import('./config')
      expect(config.wsBasicUrl).toBe('ws://localhost:4000/ws/planes/basic')
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_WS_BASIC_URL =
        'wss://production.example.com/ws/planes/basic'
      const config = await import('./config')
      expect(config.wsBasicUrl).toBe(
        'wss://production.example.com/ws/planes/basic'
      )
    })
  })

  describe('wsDetailsUrl', () => {
    it('should use default value when env var is not set', async () => {
      const config = await import('./config')
      expect(config.wsDetailsUrl).toBe('ws://localhost:4000/ws/planes/details')
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_WS_DETAILS_URL =
        'wss://production.example.com/ws/planes/details'
      const config = await import('./config')
      expect(config.wsDetailsUrl).toBe(
        'wss://production.example.com/ws/planes/details'
      )
    })
  })

  describe('wsReconnectInitialDelay', () => {
    it('should use default value (1000) when env var is not set', async () => {
      const config = await import('./config')
      expect(config.wsReconnectInitialDelay).toBe(1000)
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_WS_RECONNECT_INITIAL_DELAY = '2000'
      const config = await import('./config')
      expect(config.wsReconnectInitialDelay).toBe(2000)
    })

    it('should fall back to default when env var is NaN', async () => {
      import.meta.env.VITE_WS_RECONNECT_INITIAL_DELAY = 'abc'
      const config = await import('./config')
      expect(config.wsReconnectInitialDelay).toBe(1000)
    })

    it('should fall back to default when env var is empty string', async () => {
      import.meta.env.VITE_WS_RECONNECT_INITIAL_DELAY = ''
      const config = await import('./config')
      expect(config.wsReconnectInitialDelay).toBe(1000)
    })
  })

  describe('wsReconnectMaxDelay', () => {
    it('should use default value (30000) when env var is not set', async () => {
      const config = await import('./config')
      expect(config.wsReconnectMaxDelay).toBe(30000)
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_WS_RECONNECT_MAX_DELAY = '60000'
      const config = await import('./config')
      expect(config.wsReconnectMaxDelay).toBe(60000)
    })

    it('should fall back to default when env var is NaN', async () => {
      import.meta.env.VITE_WS_RECONNECT_MAX_DELAY = 'invalid'
      const config = await import('./config')
      expect(config.wsReconnectMaxDelay).toBe(30000)
    })
  })

  describe('wsReconnectMaxAttempts', () => {
    it('should use default value (10) when env var is not set', async () => {
      const config = await import('./config')
      expect(config.wsReconnectMaxAttempts).toBe(10)
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_WS_RECONNECT_MAX_ATTEMPTS = '5'
      const config = await import('./config')
      expect(config.wsReconnectMaxAttempts).toBe(5)
    })

    it('should fall back to default when env var is NaN', async () => {
      import.meta.env.VITE_WS_RECONNECT_MAX_ATTEMPTS = 'xyz'
      const config = await import('./config')
      expect(config.wsReconnectMaxAttempts).toBe(10)
    })

    it('should handle zero as valid value', async () => {
      import.meta.env.VITE_WS_RECONNECT_MAX_ATTEMPTS = '0'
      const config = await import('./config')
      expect(config.wsReconnectMaxAttempts).toBe(0)
    })
  })

  describe('mapStyleUrl', () => {
    it('should use default value when env var is not set', async () => {
      const config = await import('./config')
      expect(config.mapStyleUrl).toBe(
        'https://demotiles.maplibre.org/style.json'
      )
    })

    it('should use custom value from env var', async () => {
      import.meta.env.VITE_MAP_STYLE_URL =
        'https://custom.example.com/style.json'
      const config = await import('./config')
      expect(config.mapStyleUrl).toBe('https://custom.example.com/style.json')
    })
  })

  describe('mapDefaultCenter', () => {
    it('should be [0, 20] (world view)', async () => {
      const config = await import('./config')
      expect(config.mapDefaultCenter).toEqual([0, 20])
    })
  })

  describe('mapDefaultZoom', () => {
    it('should be 2 (world view)', async () => {
      const config = await import('./config')
      expect(config.mapDefaultZoom).toBe(2)
    })
  })
})
