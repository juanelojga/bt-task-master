import { describe, it, expect } from 'vitest'
import { parseNumericEnv } from '../env.ts'

describe('parseNumericEnv', () => {
  it('should return default value when value is undefined', () => {
    const result = parseNumericEnv(undefined, 100)
    expect(result).toBe(100)
  })

  it('should return default value when value is empty string', () => {
    const result = parseNumericEnv('', 100)
    expect(result).toBe(100)
  })

  it('should parse valid numeric string', () => {
    const result = parseNumericEnv('500', 100)
    expect(result).toBe(500)
  })

  it('should parse zero correctly', () => {
    const result = parseNumericEnv('0', 100)
    expect(result).toBe(0)
  })

  it('should parse negative numbers', () => {
    const result = parseNumericEnv('-50', 100)
    expect(result).toBe(-50)
  })

  it('should parse decimal numbers', () => {
    const result = parseNumericEnv('3.14', 100)
    expect(result).toBe(3.14)
  })

  it('should return default when value is not a number', () => {
    const result = parseNumericEnv('abc', 100)
    expect(result).toBe(100)
  })

  it('should return default when value is mixed alphanumeric', () => {
    const result = parseNumericEnv('123abc', 100)
    expect(result).toBe(100)
  })

  it('should return default when value is NaN string', () => {
    const result = parseNumericEnv('NaN', 100)
    expect(result).toBe(100)
  })

  it('should handle whitespace-only string as default', () => {
    const result = parseNumericEnv('   ', 100)
    expect(result).toBe(100)
  })

  it('should parse numbers with leading/trailing whitespace', () => {
    const result = parseNumericEnv('  42  ', 100)
    expect(result).toBe(42)
  })
})
