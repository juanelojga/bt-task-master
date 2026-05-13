import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapLoadingOverlay } from '../MapLoadingOverlay.tsx'

describe('MapLoadingOverlay', () => {
  it('should render when visible is true', () => {
    render(<MapLoadingOverlay visible={true} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading map…')).toBeInTheDocument()
  })

  it('should not be accessible when visible is false', () => {
    render(<MapLoadingOverlay visible={false} />)

    const overlay = screen.getByRole('status', { hidden: true })
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })

  it('should have opacity-100 class when visible', () => {
    render(<MapLoadingOverlay visible={true} />)

    const overlay = screen.getByRole('status')
    expect(overlay).toHaveClass('opacity-100')
  })

  it('should have opacity-0 and pointer-events-none classes when not visible', () => {
    render(<MapLoadingOverlay visible={false} />)

    const overlay = screen.getByRole('status', { hidden: true })
    expect(overlay).toHaveClass('opacity-0', 'pointer-events-none')
  })

  it('should have transition-opacity duration-200 classes', () => {
    render(<MapLoadingOverlay visible={true} />)

    const overlay = screen.getByRole('status')
    expect(overlay).toHaveClass('transition-opacity', 'duration-200')
  })

  it('should render with correct aria-label', () => {
    render(<MapLoadingOverlay visible={true} />)

    expect(screen.getByLabelText('Loading map')).toBeInTheDocument()
  })

  it('should have pulsing animation elements', () => {
    render(<MapLoadingOverlay visible={true} />)

    const pulseElements = document.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThanOrEqual(2)
  })

  it('should be positioned absolutely covering the container', () => {
    render(<MapLoadingOverlay visible={true} />)

    const overlay = screen.getByRole('status')
    expect(overlay).toHaveClass('absolute', 'inset-0')
  })

  it('should have white background', () => {
    render(<MapLoadingOverlay visible={true} />)

    const overlay = screen.getByRole('status')
    expect(overlay).toHaveClass('bg-white')
  })

  it('should have z-index of 20', () => {
    render(<MapLoadingOverlay visible={true} />)

    const overlay = screen.getByRole('status')
    expect(overlay).toHaveClass('z-20')
  })
})
