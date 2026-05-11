import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteSection } from '../RouteSection.tsx'
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

describe('RouteSection', () => {
  it('should render the Route section heading', () => {
    const plane = createMockPlane()
    render(<RouteSection plane={plane} />)

    expect(screen.getByRole('heading', { name: 'Route' })).toBeInTheDocument()
  })

  it('should render origin airport code and city', () => {
    const plane = createMockPlane({
      origin: { airport: 'JFK', city: 'New York' },
    })
    render(<RouteSection plane={plane} />)

    expect(screen.getByText('JFK')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
  })

  it('should render destination airport code and city', () => {
    const plane = createMockPlane({
      destination: { airport: 'LAX', city: 'Los Angeles' },
    })
    render(<RouteSection plane={plane} />)

    expect(screen.getByText('LAX')).toBeInTheDocument()
    expect(screen.getByText('Los Angeles')).toBeInTheDocument()
  })

  it('should render an arrow SVG between origin and destination', () => {
    const plane = createMockPlane()
    const { container } = render(<RouteSection plane={plane} />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()

    const path = svg?.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path?.getAttribute('d')).toBeTruthy()
  })

  it('should render origin and destination airport codes in bold', () => {
    const plane = createMockPlane({
      origin: { airport: 'LHR', city: 'London' },
      destination: { airport: 'CDG', city: 'Paris' },
    })
    render(<RouteSection plane={plane} />)

    const lhr = screen.getByText('LHR')
    const cdg = screen.getByText('CDG')

    expect(lhr).toHaveClass('font-bold', 'text-slate-800')
    expect(cdg).toHaveClass('font-bold', 'text-slate-800')
  })

  it('should render city names in muted text', () => {
    const plane = createMockPlane({
      origin: { airport: 'LHR', city: 'London' },
      destination: { airport: 'CDG', city: 'Paris' },
    })
    render(<RouteSection plane={plane} />)

    expect(screen.getByText('London')).toHaveClass('text-slate-500')
    expect(screen.getByText('Paris')).toHaveClass('text-slate-500')
  })

  it('should render the route layout as a flex row with space-between', () => {
    const plane = createMockPlane()
    const { container } = render(<RouteSection plane={plane} />)

    // The route container is the direct child of the section's flex container
    const routeRow = container.querySelector(
      '.flex.items-center.justify-between'
    )
    expect(routeRow).toBeInTheDocument()
  })

  it('should render different origin/destination combinations', () => {
    const plane = createMockPlane({
      origin: { airport: 'SFO', city: 'San Francisco' },
      destination: { airport: 'NRT', city: 'Tokyo' },
    })
    render(<RouteSection plane={plane} />)

    expect(screen.getByText('SFO')).toBeInTheDocument()
    expect(screen.getByText('San Francisco')).toBeInTheDocument()
    expect(screen.getByText('NRT')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
  })
})
