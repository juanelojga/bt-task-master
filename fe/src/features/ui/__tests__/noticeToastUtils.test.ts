import { describe, it, expect } from 'vitest'
import { getSeverityClasses } from '../noticeToastUtils.ts'

describe('getSeverityClasses', () => {
  it('should return error classes for error severity', () => {
    const result = getSeverityClasses('error')

    expect(result).toEqual({
      container: 'border-red-200 bg-red-50',
      text: 'text-red-800',
      button: 'text-red-500',
      buttonHover: 'hover:bg-red-100 hover:text-red-700 focus:ring-red-500',
    })
  })

  it('should return warning classes for warning severity', () => {
    const result = getSeverityClasses('warning')

    expect(result).toEqual({
      container: 'border-amber-200 bg-amber-50',
      text: 'text-amber-800',
      button: 'text-amber-500',
      buttonHover:
        'hover:bg-amber-100 hover:text-amber-700 focus:ring-amber-500',
    })
  })

  it('should return info classes for info severity', () => {
    const result = getSeverityClasses('info')

    expect(result).toEqual({
      container: 'border-blue-200 bg-blue-50',
      text: 'text-blue-800',
      button: 'text-blue-500',
      buttonHover: 'hover:bg-blue-100 hover:text-blue-700 focus:ring-blue-500',
    })
  })

  it('should return all expected keys in result object', () => {
    const result = getSeverityClasses('error')

    expect(result).toHaveProperty('container')
    expect(result).toHaveProperty('text')
    expect(result).toHaveProperty('button')
    expect(result).toHaveProperty('buttonHover')
  })

  it('should return non-empty strings for each property', () => {
    const result = getSeverityClasses('info')

    expect(result.container).toBeTruthy()
    expect(result.text).toBeTruthy()
    expect(result.button).toBeTruthy()
    expect(result.buttonHover).toBeTruthy()
  })
})
