import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  FlightInfoSkeleton,
  RouteSkeleton,
  PositionSkeleton,
  FlightTimeSkeleton,
  PassengersSkeleton,
  DetailSectionSkeleton,
  SkeletonRow,
} from '../index.ts'

describe('FlightInfoSkeleton', () => {
  it('should render with Flight Information section title', () => {
    render(<FlightInfoSkeleton />)

    expect(screen.getByText('Flight Information')).toBeInTheDocument()
  })

  it('should have 5 skeleton rows', () => {
    render(<FlightInfoSkeleton />)

    const rows = document.querySelectorAll('.animate-pulse')
    expect(rows.length).toBeGreaterThanOrEqual(5)
  })

  it('should have section border and padding', () => {
    render(<FlightInfoSkeleton />)

    const section = screen.getByText('Flight Information').parentElement
    expect(section).toHaveClass('border-t', 'border-slate-200', 'py-3')
  })
})

describe('RouteSkeleton', () => {
  it('should render with Route section title', () => {
    render(<RouteSkeleton />)

    expect(screen.getByText('Route')).toBeInTheDocument()
  })

  it('should have origin and destination placeholders', () => {
    render(<RouteSkeleton />)

    const pulseElements = document.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThanOrEqual(5)
  })

  it('should have flex layout for route display', () => {
    render(<RouteSkeleton />)

    const section = screen.getByText('Route').parentElement
    const flexContainer = section?.querySelector('.flex')
    expect(flexContainer).toBeInTheDocument()
  })
})

describe('PositionSkeleton', () => {
  it('should render with Position section title', () => {
    render(<PositionSkeleton />)

    expect(screen.getByText('Position')).toBeInTheDocument()
  })

  it('should have 5 skeleton rows for position data', () => {
    render(<PositionSkeleton />)

    const rows = document.querySelectorAll('.animate-pulse')
    expect(rows.length).toBeGreaterThanOrEqual(5)
  })
})

describe('FlightTimeSkeleton', () => {
  it('should render with Flight Time section title', () => {
    render(<FlightTimeSkeleton />)

    expect(screen.getByText('Flight Time')).toBeInTheDocument()
  })

  it('should have 2 skeleton rows for time data', () => {
    render(<FlightTimeSkeleton />)

    const rows = document.querySelectorAll('.animate-pulse')
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })
})

describe('PassengersSkeleton', () => {
  it('should render with Passengers section title', () => {
    render(<PassengersSkeleton />)

    expect(screen.getByText('Passengers')).toBeInTheDocument()
  })

  it('should have onboard row', () => {
    render(<PassengersSkeleton />)

    const rows = document.querySelectorAll('.animate-pulse')
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })

  it('should have progress bar placeholder', () => {
    render(<PassengersSkeleton />)

    const progressBar = document.querySelector('.rounded-full')
    expect(progressBar).toBeInTheDocument()
  })
})

describe('DetailSectionSkeleton', () => {
  it('should render with provided title', () => {
    render(
      <DetailSectionSkeleton title="Test Section">
        <div>Child content</div>
      </DetailSectionSkeleton>
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <DetailSectionSkeleton title="Test Section">
        <div data-testid="child">Child content</div>
      </DetailSectionSkeleton>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('should have section styling', () => {
    render(
      <DetailSectionSkeleton title="Test Section">
        <div>Child</div>
      </DetailSectionSkeleton>
    )

    const section = screen.getByText('Test Section').parentElement
    expect(section).toHaveClass('border-t', 'border-slate-200', 'py-3')
  })

  it('should have uppercase tracking-wide title styling', () => {
    render(
      <DetailSectionSkeleton title="Test Section">
        <div>Child</div>
      </DetailSectionSkeleton>
    )

    const title = screen.getByText('Test Section')
    expect(title).toHaveClass('uppercase', 'tracking-wide', 'text-slate-400')
  })
})

describe('SkeletonRow', () => {
  it('should render with flex layout', () => {
    render(<SkeletonRow />)

    const row = document.querySelector('.flex')
    expect(row).toBeInTheDocument()
  })

  it('should have two animate-pulse elements', () => {
    render(<SkeletonRow />)

    const pulses = document.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBe(2)
  })

  it('should have justify-between class', () => {
    render(<SkeletonRow />)

    const row = document.querySelector('.flex')
    expect(row).toHaveClass('justify-between')
  })
})
