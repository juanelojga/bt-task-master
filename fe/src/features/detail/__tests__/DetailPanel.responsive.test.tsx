import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DetailPanel } from '../DetailPanel.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('DetailPanel Responsive Layout', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  afterEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  it('should have dialog role and aria-modal when open', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-modal', 'true')
  })

  it('should have z-index of 40 on panel', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('z-40')
  })

  it('should have desktop panel classes (md:)', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass(
      'md:right-0',
      'md:top-0',
      'md:h-full',
      'md:w-[350px]'
    )
  })

  it('should have mobile bottom-sheet classes', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass(
      'bottom-0',
      'left-0',
      'right-0',
      'max-h-[50vh]',
      'w-full'
    )
  })

  it('should have translate-x off-screen when closed (desktop)', () => {
    render(<DetailPanel />)

    const panel = screen.getByRole('dialog', { hidden: true })
    expect(panel).toHaveClass('md:translate-x-full')
  })

  it('should have translate-y off-screen when closed (mobile)', () => {
    render(<DetailPanel />)

    const panel = screen.getByRole('dialog', { hidden: true })
    expect(panel).toHaveClass('translate-y-full')
  })

  it('should have transition classes for animation', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('transition-all', 'duration-300', 'ease-in-out')
  })

  it('should have white background and shadow', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('bg-white', 'shadow-xl')
  })

  it('should have fixed positioning', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('fixed')
  })

  it('should slide in on desktop when opened', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('md:translate-x-0')
  })

  it('should slide up on mobile when opened', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const panel = screen.getByRole('dialog')
    expect(panel).toHaveClass('translate-y-0')
  })
})
