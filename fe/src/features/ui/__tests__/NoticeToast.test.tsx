import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoticeToast } from '../NoticeToast.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('NoticeToast', () => {
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
    vi.useRealTimers()
  })

  it('should not render when notice is null', () => {
    render(<NoticeToast />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should render when notice is set with error severity', () => {
    useFlightStore.setState({
      notice: { message: 'Connection failed', severity: 'error' },
    })

    render(<NoticeToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })

  it('should render when notice is set with info severity', () => {
    useFlightStore.setState({
      notice: { message: 'Plane no longer available', severity: 'info' },
    })

    render(<NoticeToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Plane no longer available')).toBeInTheDocument()
  })

  it('should render when notice is set with warning severity', () => {
    useFlightStore.setState({
      notice: { message: 'Connection unstable', severity: 'warning' },
    })

    render(<NoticeToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Connection unstable')).toBeInTheDocument()
  })

  it('should display the notice message text', () => {
    const message = 'WebSocket connection error'
    useFlightStore.setState({
      notice: { message, severity: 'error' },
    })

    render(<NoticeToast />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('should have a dismiss button', () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    expect(screen.getByLabelText('Dismiss notice')).toBeInTheDocument()
  })

  it('should call clearNotice when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const dismissButton = screen.getByLabelText('Dismiss notice')
    await user.click(dismissButton)

    expect(useFlightStore.getState().notice).toBeNull()
  })

  it('should auto-dismiss after 5 seconds', () => {
    vi.useFakeTimers()
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)

    expect(useFlightStore.getState().notice).toBeNull()
  })

  it('should reset timer when notice changes', () => {
    vi.useFakeTimers()
    useFlightStore.setState({
      notice: { message: 'First notice', severity: 'error' },
    })

    const { rerender } = render(<NoticeToast />)

    // Advance 3 seconds
    vi.advanceTimersByTime(3000)

    // Change notice
    useFlightStore.setState({
      notice: { message: 'Second notice', severity: 'info' },
    })
    rerender(<NoticeToast />)

    // Advance another 3 seconds (6 seconds total from first notice)
    vi.advanceTimersByTime(3000)

    // Should still be visible because timer was reset
    expect(screen.getByText('Second notice')).toBeInTheDocument()
    expect(useFlightStore.getState().notice).toEqual({
      message: 'Second notice',
      severity: 'info',
    })

    // Advance 2 more seconds to complete the new 5 second timer
    vi.advanceTimersByTime(2000)

    expect(useFlightStore.getState().notice).toBeNull()
  })

  it('should clean up timer on unmount', () => {
    vi.useFakeTimers()
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    const { unmount } = render(<NoticeToast />)

    unmount()

    // Advance time - should not cause any issues or state changes
    vi.advanceTimersByTime(10000)

    // Notice should still be in store (unmount doesn't clear it)
    expect(useFlightStore.getState().notice).toEqual({
      message: 'Test notice',
      severity: 'error',
    })
  })

  it('should be positioned fixed at top-right', () => {
    useFlightStore.setState({
      notice: { message: 'Test notice', severity: 'error' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('fixed', 'top-4', 'right-4')
  })

  it('should have error severity styling (red)', () => {
    useFlightStore.setState({
      notice: { message: 'Test error', severity: 'error' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('border-red-200', 'bg-red-50')
  })

  it('should have warning severity styling (amber)', () => {
    useFlightStore.setState({
      notice: { message: 'Test warning', severity: 'warning' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('border-amber-200', 'bg-amber-50')
  })

  it('should have info severity styling (blue)', () => {
    useFlightStore.setState({
      notice: { message: 'Test info', severity: 'info' },
    })

    render(<NoticeToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('border-blue-200', 'bg-blue-50')
  })

  it('should update displayed message when notice changes', () => {
    useFlightStore.setState({
      notice: { message: 'First notice', severity: 'error' },
    })

    const { rerender } = render(<NoticeToast />)

    expect(screen.getByText('First notice')).toBeInTheDocument()

    useFlightStore.setState({
      notice: { message: 'Second notice', severity: 'info' },
    })
    rerender(<NoticeToast />)

    expect(screen.getByText('Second notice')).toBeInTheDocument()
    expect(screen.queryByText('First notice')).not.toBeInTheDocument()
  })
})
