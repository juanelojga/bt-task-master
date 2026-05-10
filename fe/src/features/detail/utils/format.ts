/**
 * Format altitude from meters to feet with comma separator.
 * Example: 10668 -> "35,000 ft"
 */
export function formatAltitude(meters: number): string {
  const feet = Math.round(meters * 3.28084)
  return `${feet.toLocaleString()} ft`
}

/**
 * Format speed from meters per second to knots.
 * Example: 250 -> "486 knots"
 */
export function formatSpeed(mps: number): string {
  const knots = Math.round(mps * 1.94384)
  return `${knots} knots`
}

/**
 * Format heading in degrees (0-360) with degree symbol.
 * Example: 270 -> "270°"
 */
export function formatHeading(degrees: number): string {
  return `${Math.round(degrees)}°`
}

/**
 * Format vertical speed from meters per second to feet per minute.
 * Shows + for climb, - for descent.
 * Example: 5.08 -> "+1,000 fpm"
 */
export function formatVerticalSpeed(mps: number): string {
  const fpm = Math.round(mps * 196.85)
  const sign = fpm >= 0 ? '+' : ''
  return `${sign}${fpm.toLocaleString()} fpm`
}

/**
 * Format duration in seconds to hours and minutes.
 * Example: 7200 -> "2h 0m"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

/**
 * Format Unix timestamp (seconds) to local time string.
 * Example: 1699999999 -> "3:33:19 PM" (locale-dependent)
 */
export function formatArrivalTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/**
 * Format passenger count as "current / max".
 * Example: 180, 220 -> "180 / 220"
 */
export function formatPassengers(current: number, max: number): string {
  return `${current} / ${max}`
}

/**
 * Format position coordinates (latitude, longitude) to fixed decimal places.
 * Example: 40.7128, -74.0060 -> "40.7128, -74.0060"
 */
export function formatPosition(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}
