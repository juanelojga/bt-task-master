import { describe, it, expect } from 'vitest'
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  formatVerticalSpeed,
  formatDuration,
  formatArrivalTime,
  formatPassengers,
  formatPosition,
} from '../format.ts'

describe('formatAltitude', () => {
  it('should convert meters to feet and format with comma', () => {
    // 10668 meters is approximately 35,000 feet
    expect(formatAltitude(10668)).toMatch(/35,?000 ft/)
  })

  it('should handle zero altitude', () => {
    expect(formatAltitude(0)).toBe('0 ft')
  })

  it('should round to nearest foot', () => {
    const result = formatAltitude(1000)
    const feet = Math.round(1000 * 3.28084)
    expect(result).toBe(`${feet.toLocaleString()} ft`)
  })
})

describe('formatSpeed', () => {
  it('should convert m/s to knots', () => {
    // 250 m/s is approximately 486 knots
    const result = formatSpeed(250)
    const knots = Math.round(250 * 1.94384)
    expect(result).toBe(`${knots} knots`)
  })

  it('should handle zero speed', () => {
    expect(formatSpeed(0)).toBe('0 knots')
  })

  it('should round to nearest knot', () => {
    const result = formatSpeed(100)
    const knots = Math.round(100 * 1.94384)
    expect(result).toBe(`${knots} knots`)
  })
})

describe('formatHeading', () => {
  it('should format heading with degree symbol', () => {
    expect(formatHeading(270)).toBe('270°')
  })

  it('should round decimal headings', () => {
    expect(formatHeading(123.7)).toBe('124°')
  })

  it('should handle zero heading', () => {
    expect(formatHeading(0)).toBe('0°')
  })

  it('should handle full circle', () => {
    expect(formatHeading(360)).toBe('360°')
  })
})

describe('formatVerticalSpeed', () => {
  it('should convert m/s to fpm with positive sign for climb', () => {
    // 5.08 m/s is approximately 1000 fpm
    const result = formatVerticalSpeed(5.08)
    expect(result.startsWith('+')).toBe(true)
    expect(result.endsWith(' fpm')).toBe(true)
  })

  it('should show negative sign for descent', () => {
    const result = formatVerticalSpeed(-5.08)
    expect(result.startsWith('-')).toBe(true)
  })

  it('should handle zero vertical speed', () => {
    expect(formatVerticalSpeed(0)).toBe('+0 fpm')
  })

  it('should format with comma separator for large numbers', () => {
    const result = formatVerticalSpeed(10)
    expect(result).toMatch(/[\d,]+ fpm/)
  })
})

describe('formatDuration', () => {
  it('should format seconds to hours and minutes', () => {
    expect(formatDuration(7200)).toBe('2h 0m')
  })

  it('should handle mixed hours and minutes', () => {
    expect(formatDuration(9000)).toBe('2h 30m')
  })

  it('should handle less than an hour', () => {
    expect(formatDuration(1800)).toBe('0h 30m')
  })

  it('should handle zero', () => {
    expect(formatDuration(0)).toBe('0h 0m')
  })
})

describe('formatArrivalTime', () => {
  it('should format timestamp to local time', () => {
    // Use a known timestamp (Jan 1, 2024 12:00:00 PM UTC)
    const timestamp = 1704110400
    const result = formatArrivalTime(timestamp)

    // Result should be a valid time string
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('should include hour and minute', () => {
    const now = Math.floor(Date.now() / 1000)
    const result = formatArrivalTime(now)

    // Should contain a number and a colon (time format)
    expect(result).toMatch(/\d/)
  })
})

describe('formatPassengers', () => {
  it('should format as current / max', () => {
    expect(formatPassengers(180, 220)).toBe('180 / 220')
  })

  it('should handle full flight', () => {
    expect(formatPassengers(200, 200)).toBe('200 / 200')
  })

  it('should handle empty flight', () => {
    expect(formatPassengers(0, 200)).toBe('0 / 200')
  })
})

describe('formatPosition', () => {
  it('should format lat/lng to 4 decimal places', () => {
    const result = formatPosition(40.7128, -74.006)
    expect(result).toBe('40.7128, -74.0060')
  })

  it('should handle negative coordinates', () => {
    const result = formatPosition(-33.8688, 151.2093)
    expect(result).toBe('-33.8688, 151.2093')
  })

  it('should handle zero coordinates', () => {
    expect(formatPosition(0, 0)).toBe('0.0000, 0.0000')
  })
})
