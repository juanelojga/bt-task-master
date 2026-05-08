/**
 * WebSocket configuration module
 * Provides URLs and reconnection timing parameters sourced from environment variables
 */

// ============================================================================
// Environment Variables — destructured at the top of the file
// ============================================================================

const {
  VITE_WS_BASIC_URL,
  VITE_WS_DETAILS_URL,
  VITE_WS_RECONNECT_INITIAL_DELAY,
  VITE_WS_RECONNECT_MAX_DELAY,
  VITE_WS_RECONNECT_MAX_ATTEMPTS,
  VITE_MAP_STYLE_URL,
} = import.meta.env as Record<string, string | undefined>

// ============================================================================
// WebSocket URL Configuration
// ============================================================================

/**
 * WebSocket URL for basic planes endpoint
 * Falls back to localhost default if env var not set
 */
export const wsBasicUrl: string =
  VITE_WS_BASIC_URL ?? 'ws://localhost:4000/ws/planes/basic'

/**
 * WebSocket URL for details endpoint
 * Falls back to localhost default if env var not set
 */
export const wsDetailsUrl: string =
  VITE_WS_DETAILS_URL ?? 'ws://localhost:4000/ws/planes/details'

// ============================================================================
// Reconnection Timing Configuration
// ============================================================================

const DEFAULT_INITIAL_DELAY = 1000
const DEFAULT_MAX_DELAY = 30000
const DEFAULT_MAX_ATTEMPTS = 10

/**
 * Parse a numeric environment variable with NaN-safe fallback
 * @param value - The environment variable value (may be undefined)
 * @param defaultValue - The default to use if parsing fails
 * @returns The parsed number or the default value
 */
function parseNumericEnv(
  value: string | undefined,
  defaultValue: number
): number {
  if (value === undefined || value === '') {
    return defaultValue
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

/**
 * Initial delay for reconnection attempts (milliseconds)
 * Default: 1000ms
 */
export const wsReconnectInitialDelay: number = parseNumericEnv(
  VITE_WS_RECONNECT_INITIAL_DELAY,
  DEFAULT_INITIAL_DELAY
)

/**
 * Maximum delay for reconnection attempts (milliseconds)
 * Backoff caps at this value
 * Default: 30000ms
 */
export const wsReconnectMaxDelay: number = parseNumericEnv(
  VITE_WS_RECONNECT_MAX_DELAY,
  DEFAULT_MAX_DELAY
)

/**
 * Maximum number of reconnection attempts
 * Default: 10
 */
export const wsReconnectMaxAttempts: number = parseNumericEnv(
  VITE_WS_RECONNECT_MAX_ATTEMPTS,
  DEFAULT_MAX_ATTEMPTS
)

// ============================================================================
// Map Configuration
// ============================================================================

/**
 * Map style URL for MapLibre GL
 * Falls back to MapLibre demo tiles if env var not set
 */
export const mapStyleUrl: string =
  VITE_MAP_STYLE_URL ?? 'https://demotiles.maplibre.org/style.json'

/**
 * Default map center coordinates [longitude, latitude]
 * World view centered at [0, 20]
 */
export const mapDefaultCenter: readonly [number, number] = [0, 20]

/**
 * Default map zoom level
 * Zoom 2 shows a world view suitable for viewing all 20 planes
 */
export const mapDefaultZoom = 2
