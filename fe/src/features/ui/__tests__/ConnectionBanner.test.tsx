import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ConnectionBanner } from '../ConnectionBanner.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('ConnectionBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'connected', details: 'disconnected' },
      notice: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not render when basic connection is connected', () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connected', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should not render immediately when connection becomes connecting', () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    // Should not show immediately (delay is 1 second)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should show reconnecting banner after 1 second delay when connecting', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
    expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
  })

  it('should show connection lost banner after 1 second delay when disconnected', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
    expect(screen.getByText('Connection lost')).toBeInTheDocument()
  })

  it('should not show banner if reconnection happens within 1 second', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    const { rerender } = render(<ConnectionBanner />)

    // Advance 500ms (halfway through delay)
    vi.advanceTimersByTime(500)

    // Connection restored
    useFlightStore.setState({
      connectionStatus: { basic: 'connected', details: 'disconnected' },
    })
    rerender(<ConnectionBanner />)

    // Advance past the original delay
    vi.advanceTimersByTime(600)

    // Banner should not appear
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('should hide banner immediately when connection is restored', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    const { rerender } = render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    // Restore connection
    useFlightStore.setState({
      connectionStatus: { basic: 'connected', details: 'disconnected' },
    })
    rerender(<ConnectionBanner />)

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('should have appropriate styling classes', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass(
        'absolute',
        'top-0',
        'left-0',
        'right-0',
        'z-40',
        'bg-slate-800',
        'text-white'
      )
    })
  })

  it('should have pulsing indicator for reconnecting state', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const indicator = document.querySelector('.animate-pulse')
      expect(indicator).toBeInTheDocument()
      expect(indicator).toHaveClass('bg-green-400')
    })
  })

  it('should have static indicator for disconnected state', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const indicator = document.querySelector('.bg-red-400')
      expect(indicator).toBeInTheDocument()
      expect(indicator).not.toHaveClass('animate-pulse')
    })
  })

  it('should have correct aria-label for reconnecting state', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByLabelText('Reconnecting')).toBeInTheDocument()
    })
  })

  it('should have correct aria-label for disconnected state', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByLabelText('Connection lost')).toBeInTheDocument()
    })
  })

  it('should update banner text when status changes from connecting to disconnected', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    const { rerender } = render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
    })

    // Change to disconnected
    useFlightStore.setState({
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
    })
    rerender(<ConnectionBanner />)

    await waitFor(() => {
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })
  })
})
