import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FlightInfoSection } from '../FlightInfoSection.tsx'
import { createMockPlane } from './testHelpers.ts'
import type { PlaneDetailed } from '../../../types/domain.ts'

describe('FlightInfoSection', () => {
  it('should render the Flight Information section heading', () => {
    const plane = createMockPlane()
    render(<FlightInfoSection plane={plane} />)

    expect(
      screen.getByRole('heading', { name: 'Flight Information' })
    ).toBeInTheDocument()
  })

  it('should render flight number label and value', () => {
    const plane = createMockPlane({ flightNumber: 'TA123' })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('Flight Number')).toBeInTheDocument()
    expect(screen.getByText('TA123')).toBeInTheDocument()
  })

  it('should render airline label and value', () => {
    const plane = createMockPlane({ airline: 'Test Airlines' })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('Airline')).toBeInTheDocument()
    expect(screen.getByText('Test Airlines')).toBeInTheDocument()
  })

  it('should render aircraft model label and value', () => {
    const plane = createMockPlane({ model: 'Airbus A320' })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('Aircraft Model')).toBeInTheDocument()
    expect(screen.getByText('Airbus A320')).toBeInTheDocument()
  })

  it('should render registration label and value', () => {
    const plane = createMockPlane({ registration: 'G-EUPT' })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('Registration')).toBeInTheDocument()
    expect(screen.getByText('G-EUPT')).toBeInTheDocument()
  })

  it('should render status with capitalized first letter', () => {
    const plane = createMockPlane({ status: 'enroute' })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Enroute')).toBeInTheDocument()
  })

  it('should capitalize each status type correctly', () => {
    const statuses: Array<PlaneDetailed['status']> = [
      'departed',
      'enroute',
      'cruising',
      'landing',
    ]

    for (const status of statuses) {
      const plane = createMockPlane({ status })
      const { unmount } = render(<FlightInfoSection plane={plane} />)

      const expected = status.charAt(0).toUpperCase() + status.slice(1)
      expect(screen.getByText(expected)).toBeInTheDocument()
      unmount()
    }
  })

  it('should render exactly 5 detail rows', () => {
    const plane = createMockPlane()
    const { container } = render(<FlightInfoSection plane={plane} />)

    // DetailRow renders flex + justify-between containers inside the section
    const rows = container.querySelectorAll('.flex.justify-between')
    expect(rows).toHaveLength(5)
  })

  it('should render unique labels and values for different planes', () => {
    const plane = createMockPlane({
      flightNumber: 'XY999',
      airline: 'Global Airways',
      model: 'Boeing 787',
      registration: 'PH-BVA',
    })
    render(<FlightInfoSection plane={plane} />)

    expect(screen.getByText('XY999')).toBeInTheDocument()
    expect(screen.getByText('Global Airways')).toBeInTheDocument()
    expect(screen.getByText('Boeing 787')).toBeInTheDocument()
    expect(screen.getByText('PH-BVA')).toBeInTheDocument()
  })
})
