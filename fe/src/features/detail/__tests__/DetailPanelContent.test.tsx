import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DetailPanelContent } from '../DetailPanelContent.tsx'
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

describe('DetailPanelContent', () => {
  describe('Flight Information section', () => {
    it('should render the Flight Information section heading', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Flight Information')).toBeInTheDocument()
    })

    it('should render flight number', () => {
      const plane = createMockPlane({ flightNumber: 'TA123' })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Flight Number')).toBeInTheDocument()
      expect(screen.getByText('TA123')).toBeInTheDocument()
    })

    it('should render airline', () => {
      const plane = createMockPlane({ airline: 'Test Airlines' })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Airline')).toBeInTheDocument()
      expect(screen.getByText('Test Airlines')).toBeInTheDocument()
    })

    it('should render aircraft model', () => {
      const plane = createMockPlane({ model: 'Airbus A320' })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Aircraft Model')).toBeInTheDocument()
      expect(screen.getByText('Airbus A320')).toBeInTheDocument()
    })

    it('should render registration', () => {
      const plane = createMockPlane({ registration: 'G-EUPT' })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Registration')).toBeInTheDocument()
      expect(screen.getByText('G-EUPT')).toBeInTheDocument()
    })

    it('should render status with capitalized first letter', () => {
      const plane = createMockPlane({ status: 'enroute' })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Enroute')).toBeInTheDocument()
    })

    it('should capitalize status for all status types', () => {
      const statuses: Array<PlaneDetailed['status']> = [
        'departed',
        'enroute',
        'cruising',
        'landing',
      ]

      for (const status of statuses) {
        const plane = createMockPlane({ status })
        const { unmount } = render(<DetailPanelContent plane={plane} />)

        const expected = status.charAt(0).toUpperCase() + status.slice(1)
        expect(screen.getByText(expected)).toBeInTheDocument()
        unmount()
      }
    })
  })

  describe('Route section', () => {
    it('should render the Route section heading', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Route')).toBeInTheDocument()
    })

    it('should render origin airport and city', () => {
      const plane = createMockPlane({
        origin: { airport: 'JFK', city: 'New York' },
      })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('JFK')).toBeInTheDocument()
      expect(screen.getByText('New York')).toBeInTheDocument()
    })

    it('should render destination airport and city', () => {
      const plane = createMockPlane({
        destination: { airport: 'LAX', city: 'Los Angeles' },
      })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('LAX')).toBeInTheDocument()
      expect(screen.getByText('Los Angeles')).toBeInTheDocument()
    })

    it('should render an arrow icon between origin and destination', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      // The arrow is an SVG inside the route section
      const routeSection = screen.getByText('Route').closest('div')
      const svg = routeSection?.querySelector('svg')
      expect(svg).toBeInTheDocument()

      // The SVG should contain a path element (the arrow)
      const path = svg?.querySelector('path')
      expect(path).toBeInTheDocument()
    })

    it('should render different origin/destination combinations', () => {
      const plane = createMockPlane({
        origin: { airport: 'LHR', city: 'London' },
        destination: { airport: 'CDG', city: 'Paris' },
      })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('LHR')).toBeInTheDocument()
      expect(screen.getByText('London')).toBeInTheDocument()
      expect(screen.getByText('CDG')).toBeInTheDocument()
      expect(screen.getByText('Paris')).toBeInTheDocument()
    })
  })

  describe('Position section', () => {
    it('should render the Position section heading', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Position')).toBeInTheDocument()
    })

    it('should render all position labels', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Coordinates')).toBeInTheDocument()
      expect(screen.getByText('Altitude')).toBeInTheDocument()
      expect(screen.getByText('Speed')).toBeInTheDocument()
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Vertical Speed')).toBeInTheDocument()
    })

    it('should render all position values', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      // Check that formatted values rendered (non-empty text besides labels)
      const positionValues = [
        screen.getByText('Coordinates').nextElementSibling,
        screen.getByText('Altitude').nextElementSibling,
        screen.getByText('Speed').nextElementSibling,
        screen.getByText('Heading').nextElementSibling,
        screen.getByText('Vertical Speed').nextElementSibling,
      ]

      for (const value of positionValues) {
        expect(value).toBeInTheDocument()
        expect(value?.textContent?.trim().length).toBeGreaterThan(0)
      }
    })

    it('should format position for negative coordinates', () => {
      const plane = createMockPlane({
        latitude: -33.8688,
        longitude: 151.2093,
      })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('-33.8688, 151.2093')).toBeInTheDocument()
    })
  })

  describe('Flight Time section', () => {
    it('should render the Flight Time section heading', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Flight Time')).toBeInTheDocument()
    })

    it('should render duration label', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Duration')).toBeInTheDocument()
    })

    it('should render estimated arrival label', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Estimated Arrival')).toBeInTheDocument()
    })

    it('should render formatted duration', () => {
      const plane = createMockPlane({ flightDuration: 16200 })
      render(<DetailPanelContent plane={plane} />)

      // 16200 seconds = 4h 30m
      expect(screen.getByText('4h 30m')).toBeInTheDocument()
    })

    it('should render formatted estimated arrival', () => {
      const plane = createMockPlane({ estimatedArrival: 1704110400 })
      render(<DetailPanelContent plane={plane} />)

      const estimatedArrival =
        screen.getByText('Estimated Arrival').nextElementSibling

      expect(estimatedArrival).toBeInTheDocument()
      // Should contain a time-like string
      expect(estimatedArrival?.textContent).toBeTruthy()
    })

    it('should render zero duration', () => {
      const plane = createMockPlane({ flightDuration: 0 })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('0h 0m')).toBeInTheDocument()
    })
  })

  describe('Passengers section', () => {
    it('should render the Passengers section heading', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Passengers')).toBeInTheDocument()
    })

    it('should render Onboard label', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('Onboard')).toBeInTheDocument()
    })

    it('should render passenger count in "current / max" format', () => {
      const plane = createMockPlane({
        numberOfPassengers: 150,
        maxPassengers: 200,
      })
      render(<DetailPanelContent plane={plane} />)

      expect(screen.getByText('150 / 200')).toBeInTheDocument()
    })

    it('should render passenger progress bar', () => {
      const plane = createMockPlane({
        numberOfPassengers: 180,
        maxPassengers: 200,
      })
      const { container } = render(<DetailPanelContent plane={plane} />)

      // Find the progress bar fill element
      const progressBars = container.querySelectorAll(
        '.rounded-full.bg-blue-500'
      )

      expect(progressBars.length).toBeGreaterThanOrEqual(1)
    })

    it('should set progress bar width based on passenger ratio', () => {
      const plane = createMockPlane({
        numberOfPassengers: 100,
        maxPassengers: 200,
      })
      const { container } = render(<DetailPanelContent plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('50%')
    })

    it('should set progress bar to 100% for full flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 200,
        maxPassengers: 200,
      })
      const { container } = render(<DetailPanelContent plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('100%')
    })

    it('should set progress bar to 0% for empty flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 0,
        maxPassengers: 200,
      })
      const { container } = render(<DetailPanelContent plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('0%')
    })

    it('should render progress bar track', () => {
      const plane = createMockPlane()
      const { container } = render(<DetailPanelContent plane={plane} />)

      const track = container.querySelector('.bg-slate-200.rounded-full')
      expect(track).toBeInTheDocument()
    })
  })

  describe('section order', () => {
    it('should render sections in the correct order', () => {
      const plane = createMockPlane()
      const { container } = render(<DetailPanelContent plane={plane} />)

      const headings = container.querySelectorAll('h3')
      const headingTexts = Array.from(headings).map((h) => h.textContent)

      expect(headingTexts).toEqual([
        'Flight Information',
        'Route',
        'Position',
        'Flight Time',
        'Passengers',
      ])
    })
  })

  describe('formatting delegation', () => {
    it('should delegate altitude formatting to formatAltitude', () => {
      const plane = createMockPlane({ altitude: 10668 })
      render(<DetailPanelContent plane={plane} />)

      const altitudeValue = screen.getByText('Altitude').nextElementSibling

      // ~35,000 ft (may vary slightly with locale formatting)
      expect(altitudeValue?.textContent).toMatch(/35,?000 ft/)
    })

    it('should delegate speed formatting to formatSpeed', () => {
      const plane = createMockPlane({ speed: 250 })
      render(<DetailPanelContent plane={plane} />)

      const speedValue = screen.getByText('Speed').nextElementSibling

      // ~486 knots
      expect(speedValue?.textContent).toMatch(/486 knots/)
    })

    it('should delegate heading formatting to formatHeading', () => {
      const plane = createMockPlane({ heading: 270 })
      render(<DetailPanelContent plane={plane} />)

      const headingValue = screen.getByText('Heading').nextElementSibling

      expect(headingValue?.textContent).toBe('270°')
    })

    it('should delegate vertical speed formatting to formatVerticalSpeed', () => {
      const plane = createMockPlane({ verticalSpeed: 5.08 })
      render(<DetailPanelContent plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling

      // Should start with + for climb
      expect(vsValue?.textContent).toMatch(/^\+/)
      expect(vsValue?.textContent).toMatch(/fpm$/)
    })

    it('should show negative vertical speed for descent', () => {
      const plane = createMockPlane({ verticalSpeed: -3.0 })
      render(<DetailPanelContent plane={plane} />)

      const vsValue = screen.getByText('Vertical Speed').nextElementSibling

      expect(vsValue?.textContent).toMatch(/^-/)
    })
  })

  describe('edge cases', () => {
    it('should handle zero values across all numeric fields', () => {
      const plane = createMockPlane({
        altitude: 0,
        speed: 0,
        heading: 0,
        verticalSpeed: 0,
        flightDuration: 0,
        numberOfPassengers: 0,
      })
      render(<DetailPanelContent plane={plane} />)

      // Should render without errors
      expect(screen.getByText('Flight Information')).toBeInTheDocument()
      expect(screen.getByText('Passengers')).toBeInTheDocument()

      // Zero heading should show "0°"
      expect(screen.getByText('0°')).toBeInTheDocument()

      // Zero duration
      expect(screen.getByText('0h 0m')).toBeInTheDocument()

      // Zero passengers / max
      expect(screen.getByText('0 / 200')).toBeInTheDocument()
    })

    it('should handle very large numbers', () => {
      const plane = createMockPlane({
        altitude: 999999,
        speed: 999,
        numberOfPassengers: 999,
        maxPassengers: 999,
      })
      render(<DetailPanelContent plane={plane} />)

      // Should render without errors - check sections exist
      expect(screen.getByText('Flight Information')).toBeInTheDocument()
      expect(screen.getByText('Position')).toBeInTheDocument()
      expect(screen.getByText('Passengers')).toBeInTheDocument()
    })

    it('should not render any section headings more than once', () => {
      const plane = createMockPlane()
      render(<DetailPanelContent plane={plane} />)

      const sections = [
        'Flight Information',
        'Route',
        'Position',
        'Flight Time',
        'Passengers',
      ]

      for (const section of sections) {
        const matches = screen.getAllByText(section)
        expect(matches).toHaveLength(1)
      }
    })
  })
})
