import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ConnectionBanner } from '../ConnectionBanner.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('ConnectionBanner Animation', () => {
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

  it('should have transform transition classes', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass(
        'transform',
        'transition-transform',
        'duration-200'
      )
    })
  })

  it('should slide down when shown (translate-y-0)', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass('translate-y-0')
    })
  })

  it('should slide up when hidden (-translate-y-full)', async () => {
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
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass('-translate-y-full')
    })
  })

  it('should have ease-in-out timing', async () => {
    useFlightStore.setState({
      connectionStatus: { basic: 'connecting', details: 'disconnected' },
    })

    render(<ConnectionBanner />)

    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      const banner = screen.getByRole('status')
      expect(banner).toHaveClass('ease-in-out')
    })
  })

  it('should remain in DOM during exit animation', async () => {
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

    // Banner should still be in DOM during exit animation
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    // After animation completes, it should be removed
    vi.advanceTimersByTime(200)

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})
