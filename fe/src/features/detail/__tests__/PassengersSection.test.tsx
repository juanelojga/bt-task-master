import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PassengersSection } from '../PassengersSection.tsx'
import { createMockPlane } from './testHelpers.ts'

describe('PassengersSection', () => {
  it('should render the Passengers section heading', () => {
    const plane = createMockPlane()
    render(<PassengersSection plane={plane} />)

    expect(
      screen.getByRole('heading', { name: 'Passengers' })
    ).toBeInTheDocument()
  })

  describe('Onboard label', () => {
    it('should render Onboard label', () => {
      const plane = createMockPlane()
      render(<PassengersSection plane={plane} />)

      expect(screen.getByText('Onboard')).toBeInTheDocument()
    })
  })

  describe('passenger count', () => {
    it('should render passenger count in "current / max" format', () => {
      const plane = createMockPlane({
        numberOfPassengers: 150,
        maxPassengers: 200,
      })
      render(<PassengersSection plane={plane} />)

      expect(screen.getByText('150 / 200')).toBeInTheDocument()
    })

    it('should render full flight passenger count', () => {
      const plane = createMockPlane({
        numberOfPassengers: 200,
        maxPassengers: 200,
      })
      render(<PassengersSection plane={plane} />)

      expect(screen.getByText('200 / 200')).toBeInTheDocument()
    })

    it('should render empty flight passenger count', () => {
      const plane = createMockPlane({
        numberOfPassengers: 0,
        maxPassengers: 200,
      })
      render(<PassengersSection plane={plane} />)

      expect(screen.getByText('0 / 200')).toBeInTheDocument()
    })
  })

  describe('progress bar', () => {
    it('should render a progress bar', () => {
      const plane = createMockPlane({
        numberOfPassengers: 180,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBars = container.querySelectorAll(
        '.rounded-full.bg-blue-500'
      )
      expect(progressBars.length).toBeGreaterThanOrEqual(1)
    })

    it('should render the track (background bar)', () => {
      const plane = createMockPlane()
      const { container } = render(<PassengersSection plane={plane} />)

      const track = container.querySelector('.bg-slate-200.rounded-full')
      expect(track).toBeInTheDocument()
    })

    it('should set progress bar width to 50% for half-full flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 100,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('50%')
    })

    it('should set progress bar width to 100% for full flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 200,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('100%')
    })

    it('should set progress bar width to 0% for empty flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 0,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('0%')
    })

    it('should set progress bar width for a 75% full flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 150,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('75%')
    })

    it('should set progress bar width for a 1-passenger flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 1,
        maxPassengers: 200,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('0.5%')
    })

    it('should have overflow hidden on the track to clip the fill', () => {
      const plane = createMockPlane()
      const { container } = render(<PassengersSection plane={plane} />)

      const track = container.querySelector('.bg-slate-200.rounded-full')
      expect(track).toHaveClass('overflow-hidden')
    })
  })

  describe('edge cases', () => {
    it('should handle large passenger numbers', () => {
      const plane = createMockPlane({
        numberOfPassengers: 850,
        maxPassengers: 853,
      })
      render(<PassengersSection plane={plane} />)

      expect(screen.getByText('850 / 853')).toBeInTheDocument()
    })

    it('should handle progress bar for nearly empty large flight', () => {
      const plane = createMockPlane({
        numberOfPassengers: 5,
        maxPassengers: 500,
      })
      const { container } = render(<PassengersSection plane={plane} />)

      const progressBar = container.querySelector(
        '.rounded-full.bg-blue-500'
      ) as HTMLElement

      expect(progressBar.style.width).toBe('1%')
    })
  })
})
