import React, { useEffect, useCallback } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'

const DISMISS_TIMEOUT_MS = 5000

/**
 * ErrorToast component displays non-blocking error messages from the flight store.
 * Positioned at top-right, auto-dismisses after 5 seconds, and includes manual dismiss.
 */
export function ErrorToast(): React.ReactElement | null {
  const errorMessage = useFlightStore((state) => state.errorMessage)
  const clearError = useFlightStore((state) => state.clearError)

  const handleDismiss = useCallback(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    if (errorMessage === null) return

    const timer = setTimeout(() => {
      clearError()
    }, DISMISS_TIMEOUT_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [errorMessage, clearError])

  if (errorMessage === null) {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-2 inline-flex items-center justify-center rounded-md p-1 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Dismiss error"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
