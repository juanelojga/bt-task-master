import React, { useEffect, useCallback } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'

const DISMISS_TIMEOUT_MS = 5000

/**
 * Returns Tailwind classes based on notice severity
 */
function getSeverityClasses(severity: 'error' | 'warning' | 'info'): {
  container: string
  text: string
  button: string
  buttonHover: string
} {
  switch (severity) {
    case 'error':
      return {
        container: 'border-red-200 bg-red-50',
        text: 'text-red-800',
        button: 'text-red-500',
        buttonHover: 'hover:bg-red-100 hover:text-red-700 focus:ring-red-500',
      }
    case 'warning':
      return {
        container: 'border-amber-200 bg-amber-50',
        text: 'text-amber-800',
        button: 'text-amber-500',
        buttonHover:
          'hover:bg-amber-100 hover:text-amber-700 focus:ring-amber-500',
      }
    case 'info':
      return {
        container: 'border-blue-200 bg-blue-50',
        text: 'text-blue-800',
        button: 'text-blue-500',
        buttonHover:
          'hover:bg-blue-100 hover:text-blue-700 focus:ring-blue-500',
      }
  }
}

/**
 * NoticeToast component displays non-blocking notices from the flight store.
 * Positioned at top-right, auto-dismisses after 5 seconds, and includes manual dismiss.
 * Supports different severity levels: error (red), warning (amber), info (blue).
 */
export function NoticeToast(): React.ReactElement | null {
  const notice = useFlightStore((state) => state.notice)
  const clearNotice = useFlightStore((state) => state.clearNotice)

  const handleDismiss = useCallback(() => {
    clearNotice()
  }, [clearNotice])

  useEffect(() => {
    if (notice === null) return

    const timer = setTimeout(() => {
      clearNotice()
    }, DISMISS_TIMEOUT_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [notice, clearNotice])

  if (notice === null) {
    return null
  }

  const classes = getSeverityClasses(notice.severity)

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${classes.container}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        <p className={`text-sm font-medium ${classes.text}`}>
          {notice.message}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className={`ml-2 inline-flex items-center justify-center rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${classes.button} ${classes.buttonHover}`}
        aria-label="Dismiss notice"
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
