/**
 * Parse a numeric environment variable with NaN-safe fallback
 * @param value - The environment variable value (may be undefined)
 * @param defaultValue - The default to use if parsing fails
 * @returns The parsed number or the default value
 */
export function parseNumericEnv(
  value: string | undefined,
  defaultValue: number
): number {
  if (value === undefined || value.trim() === '') {
    return defaultValue
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? defaultValue : parsed
}
