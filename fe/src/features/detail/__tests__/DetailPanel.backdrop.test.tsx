import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailPanel } from '../DetailPanel.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('DetailPanel Backdrop', () => {
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

  it('should show backdrop when panel is open', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveClass('opacity-100')
  })

  it('should hide backdrop when panel is closed', () => {
    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toHaveClass('opacity-0', 'pointer-events-none')
  })

  it('should trigger deselectPlane when backdrop is clicked', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    await user.click(backdrop)

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
    expect(useFlightStore.getState().detailedPlane).toBeNull()
  })

  it('should have correct backdrop styling', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black/30')
  })

  it('should have transition-opacity duration-200 classes', () => {
    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toHaveClass('transition-opacity', 'duration-200')
  })

  it('should have z-index of 30', () => {
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toHaveClass('z-30')
  })

  it('should have aria-hidden attribute', () => {
    render(<DetailPanel />)

    const backdrop = screen.getByTestId('detail-panel-backdrop')
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
  })
})
