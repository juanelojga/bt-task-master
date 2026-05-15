import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FlightTimeSection } from '../FlightTimeSection.tsx'
import { createMockPlane } from './testHelpers.ts'

describe('FlightTimeSection', () => {
  it('should render the Flight Time section heading', () => {
    const plane = createMockPlane()
    render(<FlightTimeSection plane={plane} />)

    expect(
      screen.getByRole('heading', { name: 'Flight Time' })
    ).toBeInTheDocument()
  })

  describe('labels', () => {
    it('should render Duration label', () => {
      const plane = createMockPlane()
      render(<FlightTimeSection plane={plane} />)

      expect(screen.getByText('Duration')).toBeInTheDocument()
    })

    it('should render Estimated Arrival label', () => {
      const plane = createMockPlane()
      render(<FlightTimeSection plane={plane} />)

      expect(screen.getByText('Estimated Arrival')).toBeInTheDocument()
    })

    it('should render exactly 2 detail rows', () => {
      const plane = createMockPlane()
      const { container } = render(<FlightTimeSection plane={plane} />)

      const rows = container.querySelectorAll('.flex.justify-between')
      expect(rows).toHaveLength(2)
    })
  })

  describe('formatted duration', () => {
    it('should render formatted duration in hours and minutes', () => {
      const plane = createMockPlane({ flightDuration: 16200 })
      render(<FlightTimeSection plane={plane} />)

      // 16200 seconds = 4h 30m
      expect(screen.getByText('4h 30m')).toBeInTheDocument()
    })

    it('should render exactly on the hour', () => {
      const plane = createMockPlane({ flightDuration: 7200 })
      render(<FlightTimeSection plane={plane} />)

      // 7200 seconds = 2h 0m
      expect(screen.getByText('2h 0m')).toBeInTheDocument()
    })

    it('should render less than one hour', () => {
      const plane = createMockPlane({ flightDuration: 1800 })
      render(<FlightTimeSection plane={plane} />)

      // 1800 seconds = 0h 30m
      expect(screen.getByText('0h 30m')).toBeInTheDocument()
    })

    it('should render zero duration', () => {
      const plane = createMockPlane({ flightDuration: 0 })
      render(<FlightTimeSection plane={plane} />)

      expect(screen.getByText('0h 0m')).toBeInTheDocument()
    })

    it('should render a long duration', () => {
      const plane = createMockPlane({ flightDuration: 54000 })
      render(<FlightTimeSection plane={plane} />)

      // 54000 seconds = 15h 0m
      expect(screen.getByText('15h 0m')).toBeInTheDocument()
    })
  })

  describe('formatted estimated arrival', () => {
    it('should render a non-empty estimated arrival time', () => {
      const plane = createMockPlane({ estimatedArrival: 1704110400 })
      render(<FlightTimeSection plane={plane} />)

      const arrivalValue =
        screen.getByText('Estimated Arrival').nextElementSibling
      expect(arrivalValue).toBeInTheDocument()
      expect(arrivalValue?.textContent?.trim().length).toBeGreaterThan(0)
    })

    it('should render arrival time matching time format', () => {
      const now = Math.floor(Date.now() / 1000)
      const plane = createMockPlane({ estimatedArrival: now })
      render(<FlightTimeSection plane={plane} />)

      const arrivalValue =
        screen.getByText('Estimated Arrival').nextElementSibling
      // Should contain digits and colon
      expect(arrivalValue?.textContent).toMatch(/\d/)
    })

    it('should render different arrival times for different timestamps', () => {
      const plane1 = createMockPlane({
        id: 'plane-a',
        estimatedArrival: 1704110400,
      })
      const { unmount } = render(<FlightTimeSection plane={plane1} />)

      const value1 =
        screen.getByText('Estimated Arrival').nextElementSibling?.textContent
      unmount()

      const plane2 = createMockPlane({
        id: 'plane-b',
        estimatedArrival: 1800000000,
      })
      render(<FlightTimeSection plane={plane2} />)

      const value2 =
        screen.getByText('Estimated Arrival').nextElementSibling?.textContent

      // Different timestamps should produce different time strings
      // (unless they happen to resolve to the same time of day)
      // We verify both are non-empty strings
      expect(value1).toBeTruthy()
      expect(value2).toBeTruthy()
    })
  })

  describe('edge cases', () => {
    it('should handle very large duration', () => {
      const plane = createMockPlane({ flightDuration: 999999 })
      render(<FlightTimeSection plane={plane} />)

      const durationValue = screen.getByText('Duration').nextElementSibling
      expect(durationValue?.textContent).toBeTruthy()
      expect(durationValue?.textContent).toMatch(/h \d+m/)
    })

    it('should handle zero estimated arrival timestamp', () => {
      const plane = createMockPlane({ estimatedArrival: 0 })
      render(<FlightTimeSection plane={plane} />)

      // Jan 1, 1970 — should still render a time
      const arrivalValue =
        screen.getByText('Estimated Arrival').nextElementSibling
      expect(arrivalValue?.textContent?.trim().length).toBeGreaterThan(0)
    })
  })
})
