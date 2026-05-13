import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoticeToast } from '../NoticeToast.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('NoticeToast Animation', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
    // Clear any pending timers
    vi.advanceTimersByTime(10000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should have transform transition classes', () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('transform', 'transition-all', 'duration-200')
  })

  it('should slide in from right and fade in (translate-x-0 opacity-100)', () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('translate-x-0', 'opacity-100')
  })

  it('should fade out and slide right when dismissed (translate-x-4 opacity-0)', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const dismissButton = screen.getByLabelText('Dismiss notice')
    await user.click(dismissButton)

    await waitFor(() => {
      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('translate-x-4', 'opacity-0')
    })
  })

  it('should remain in DOM during exit animation', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const dismissButton = screen.getByLabelText('Dismiss notice')
    await user.click(dismissButton)

    // Toast should still be in DOM during exit animation
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Advance past exit animation duration (150ms)
    vi.advanceTimersByTime(150)

    // Now it should be removed
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('should trigger exit animation on auto-dismiss', async () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    // Advance past auto-dismiss timeout (5000ms)
    vi.advanceTimersByTime(5000)

    await waitFor(() => {
      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('translate-x-4', 'opacity-0')
    })
  })

  it('should be removed from DOM after exit animation completes on auto-dismiss', async () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    // Advance past auto-dismiss timeout (5000ms) and exit animation (150ms)
    vi.advanceTimersByTime(5150)

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('should reset to visible state when new notice appears during exit', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({
      notice: { message: 'First notice', severity: 'error' },
    })

    const { rerender } = render(<NoticeToast />)

    // Start exit animation
    const dismissButton = screen.getByLabelText('Dismiss notice')
    await user.click(dismissButton)

    await waitFor(() => {
      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('translate-x-4', 'opacity-0')
    })

    // New notice appears before exit completes
    useFlightStore.setState({
      notice: { message: 'Second notice', severity: 'info' },
    })
    rerender(<NoticeToast />)

    // Should show new notice in visible state
    await waitFor(() => {
      const toast = screen.getByRole('alert')
      expect(toast).toHaveClass('translate-x-0', 'opacity-100')
      expect(screen.getByText('Second notice')).toBeInTheDocument()
    })
  })
})
