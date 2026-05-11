import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PositionSection } from '../PositionSection.tsx'
import type { PlaneDetailed } from '../../../types/domain.ts'

const createMockPlane = (
  overrides: Partial<PlaneDetailed> = {}
): PlaneDetailed => ({
  id: 'plane-1',
  model: 'Boeing 737-800',
  airline: 'Test Airlines',
  flightNumber: 'TA123',
  registration: 'N12345',
  latitude: 40.7128,
  longitude: -74.006,
  altitude: 10668,
  speed: 250,
  heading: 270,
  verticalSpeed: 5.08,
  origin: {
    airport: 'JFK',
    city: 'New York',
  },
  destination: {
    airport: 'LAX',
    city: 'Los Angeles',
  },
  flightDuration: 16200,
  estimatedArrival: 1704110400,
  numberOfPassengers: 180,
  maxPassengers: 200,
  status: 'enroute',
  color: '#3b82f6',
  ...overrides,
})

describe('PositionSection', () => {
  it('should render the Position section heading', () => {
    const plane = createMockPlane()
    render(<PositionSection plane={plane} />)

    expect(
      screen.getByRole('heading', { name: 'Position' })
    ).toBeInTheDocument()
  })

  describe('labels', () => {
    it('should render all position labels', () => {
      const plane = createMockPlane()
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('Coordinates')).toBeInTheDocument()
      expect(screen.getByText('Altitude')).toBeInTheDocument()
      expect(screen.getByText('Speed')).toBeInTheDocument()
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Vertical Speed')).toBeInTheDocument()
    })

    it('should render exactly 5 detail rows', () => {
      const plane = createMockPlane()
      const { container } = render(<PositionSection plane={plane} />)

      const rows = container.querySelectorAll('.flex.justify-between')
      expect(rows).toHaveLength(5)
    })
  })

  describe('formatted values', () => {
    it('should render formatted coordinates', () => {
      const plane = createMockPlane({ latitude: 40.7128, longitude: -74.006 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('40.7128, -74.0060')).toBeInTheDocument()
    })

    it('should render formatted coordinates for negative latitude', () => {
      const plane = createMockPlane({
        latitude: -33.8688,
        longitude: 151.2093,
      })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('-33.8688, 151.2093')).toBeInTheDocument()
    })

    it('should render formatted altitude in feet', () => {
      const plane = createMockPlane({ altitude: 10668 })
      render(<PositionSection plane={plane} />)

      // ~35,000 ft
      const altitudeValue = screen.getByText('Altitude').nextElementSibling
      expect(altitudeValue?.textContent).toMatch(/35,?000 ft/)
    })

    it('should render zero altitude', () => {
      const plane = createMockPlane({ altitude: 0 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('0 ft')).toBeInTheDocument()
    })

    it('should render formatted speed in knots', () => {
      const plane = createMockPlane({ speed: 250 })
      render(<PositionSection plane={plane} />)

      // ~486 knots
      const speedValue = screen.getByText('Speed').nextElementSibling
      expect(speedValue?.textContent).toMatch(/486 knots/)
    })

    it('should render zero speed', () => {
      const plane = createMockPlane({ speed: 0 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('0 knots')).toBeInTheDocument()
    })

    it('should render formatted heading with degree symbol', () => {
      const plane = createMockPlane({ heading: 270 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('270°')).toBeInTheDocument()
    })

    it('should render zero heading', () => {
      const plane = createMockPlane({ heading: 0 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('0°')).toBeInTheDocument()
    })

    it('should render heading at 360°', () => {
      const plane = createMockPlane({ heading: 360 })
      render(<PositionSection plane={plane} />)

      expect(screen.getByText('360°')).toBeInTheDocument()
    })

    it('should render formatted vertical speed with positive sign for climb', () => {
      const plane = createMockPlane({ verticalSpeed: 5.08 })
      render(<PositionSection plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling
      expect(vsValue?.textContent).toMatch(/^\+/)
      expect(vsValue?.textContent).toMatch(/fpm$/)
    })

    it('should render negative vertical speed with minus sign for descent', () => {
      const plane = createMockPlane({ verticalSpeed: -3.0 })
      render(<PositionSection plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling
      expect(vsValue?.textContent).toMatch(/^-/)
    })

    it('should render zero vertical speed', () => {
      const plane = createMockPlane({ verticalSpeed: 0 })
      render(<PositionSection plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling
      expect(vsValue?.textContent).toBe('+0 fpm')
    })

    it('should render all position values with non-empty content', () => {
      const plane = createMockPlane()
      render(<PositionSection plane={plane} />)

      const labels = [
        'Coordinates',
        'Altitude',
        'Speed',
        'Heading',
        'Vertical Speed',
      ]

      for (const label of labels) {
        const value = screen.getByText(label).nextElementSibling
        expect(value).toBeInTheDocument()
        expect(value?.textContent?.trim().length).toBeGreaterThan(0)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle very large altitude', () => {
      const plane = createMockPlane({ altitude: 99999 })
      render(<PositionSection plane={plane} />)

      const altitudeValue = screen.getByText('Altitude').nextElementSibling
      expect(altitudeValue?.textContent).toBeTruthy()
    })

    it('should handle very large speed', () => {
      const plane = createMockPlane({ speed: 999 })
      render(<PositionSection plane={plane} />)

      const speedValue = screen.getByText('Speed').nextElementSibling
      expect(speedValue?.textContent).toBeTruthy()
    })

    it('should handle deep descent vertical speed', () => {
      const plane = createMockPlane({ verticalSpeed: -25.0 })
      render(<PositionSection plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling
      expect(vsValue?.textContent).toMatch(/^-/)
    })
  })
})
