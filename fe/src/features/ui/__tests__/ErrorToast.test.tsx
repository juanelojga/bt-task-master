import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorToast } from '../ErrorToast.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'

describe('ErrorToast', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      errorMessage: null,
    })
  })

  afterEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      errorMessage: null,
    })
    vi.useRealTimers()
  })

  it('should not render when errorMessage is null', () => {
    render(<ErrorToast />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should render when errorMessage is set', () => {
    useFlightStore.setState({ errorMessage: 'Connection failed' })

    render(<ErrorToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })

  it('should display the error message text', () => {
    const errorText = 'WebSocket connection error'
    useFlightStore.setState({ errorMessage: errorText })

    render(<ErrorToast />)

    expect(screen.getByText(errorText)).toBeInTheDocument()
  })

  it('should have a dismiss button', () => {
    useFlightStore.setState({ errorMessage: 'Test error' })

    render(<ErrorToast />)

    expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument()
  })

  it('should call clearError when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    useFlightStore.setState({ errorMessage: 'Test error' })

    render(<ErrorToast />)

    const dismissButton = screen.getByLabelText('Dismiss error')
    await user.click(dismissButton)

    expect(useFlightStore.getState().errorMessage).toBeNull()
  })

  it('should auto-dismiss after 5 seconds', () => {
    vi.useFakeTimers()
    useFlightStore.setState({ errorMessage: 'Test error' })

    render(<ErrorToast />)

    expect(screen.getByRole('alert')).toBeInTheDocument()

    vi.advanceTimersByTime(5000)

    expect(useFlightStore.getState().errorMessage).toBeNull()
  })

  it('should reset timer when error message changes', () => {
    vi.useFakeTimers()
    useFlightStore.setState({ errorMessage: 'First error' })

    const { rerender } = render(<ErrorToast />)

    // Advance 3 seconds
    vi.advanceTimersByTime(3000)

    // Change error message
    useFlightStore.setState({ errorMessage: 'Second error' })
    rerender(<ErrorToast />)

    // Advance another 3 seconds (6 seconds total from first error)
    vi.advanceTimersByTime(3000)

    // Should still be visible because timer was reset
    expect(screen.getByText('Second error')).toBeInTheDocument()
    expect(useFlightStore.getState().errorMessage).toBe('Second error')

    // Advance 2 more seconds to complete the new 5 second timer
    vi.advanceTimersByTime(2000)

    expect(useFlightStore.getState().errorMessage).toBeNull()
  })

  it('should clean up timer on unmount', () => {
    vi.useFakeTimers()
    useFlightStore.setState({ errorMessage: 'Test error' })

    const { unmount } = render(<ErrorToast />)

    unmount()

    // Advance time - should not cause any issues or state changes
    vi.advanceTimersByTime(10000)

    // Error message should still be in store (unmount doesn't clear it)
    expect(useFlightStore.getState().errorMessage).toBe('Test error')
  })

  it('should be positioned fixed at top-right', () => {
    useFlightStore.setState({ errorMessage: 'Test error' })

    render(<ErrorToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('fixed', 'top-4', 'right-4')
  })

  it('should have appropriate styling classes', () => {
    useFlightStore.setState({ errorMessage: 'Test error' })

    render(<ErrorToast />)

    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass(
      'z-50',
      'rounded-lg',
      'border',
      'border-red-200',
      'bg-red-50',
      'shadow-lg'
    )
  })

  it('should update displayed message when errorMessage changes', () => {
    useFlightStore.setState({ errorMessage: 'First error' })

    const { rerender } = render(<ErrorToast />)

    expect(screen.getByText('First error')).toBeInTheDocument()

    useFlightStore.setState({ errorMessage: 'Second error' })
    rerender(<ErrorToast />)

    expect(screen.getByText('Second error')).toBeInTheDocument()
    expect(screen.queryByText('First error')).not.toBeInTheDocument()
  })
})
