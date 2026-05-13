import React, { useEffect, useCallback, useRef } from 'react'
import { useFlightStore } from '../store/hooks/useFlightStore.ts'

const DISMISS_TIMEOUT_MS = 5000
const EXIT_ANIMATION_DURATION_MS = 150

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

interface ToastState {
  notice: { message: string; severity: 'error' | 'warning' | 'info' } | null
  isExiting: boolean
}

// Module-level state for sync access in callbacks
let toastState: ToastState = { notice: null, isExiting: false }
const listeners = new Set<() => void>()

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot(): ToastState {
  return toastState
}

function setToastState(newState: ToastState): void {
  toastState = newState
  listeners.forEach((cb) => cb())
}

/**
 * NoticeToast component displays non-blocking notices from the flight store.
 * Positioned at top-right, auto-dismisses after 5 seconds, and includes manual dismiss.
 * Supports different severity levels: error (red), warning (amber), info (blue).
 * Animates in with slide-from-right and fade-in, animates out with fade-out.
 */
export function NoticeToast(): React.ReactElement | null {
  const storeNotice = useFlightStore((state) => state.notice)
  const clearNotice = useFlightStore((state) => state.clearNotice)
  const { notice, isExiting } = React.useSyncExternalStore(
    subscribe,
    getSnapshot
  )
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current)
      exitTimerRef.current = null
    }
  }, [])

  const handleExitComplete = useCallback(() => {
    const hadNotice = toastState.notice !== null
    setToastState({ notice: null, isExiting: false })
    if (hadNotice && storeNotice !== null) {
      clearNotice()
    }
  }, [storeNotice, clearNotice])

  const performExit = useCallback(() => {
    if (toastState.isExiting) return

    setToastState({ notice: toastState.notice, isExiting: true })

    exitTimerRef.current = setTimeout(() => {
      handleExitComplete()
    }, EXIT_ANIMATION_DURATION_MS)
  }, [handleExitComplete])

  const handleDismiss = useCallback(() => {
    clearTimers()
    clearNotice()
    performExit()
  }, [clearTimers, clearNotice, performExit])

  useEffect(() => clearTimers, [clearTimers])

  useEffect(() => {
    if (storeNotice === null) {
      // If notice was cleared externally, trigger exit animation
      if (toastState.notice !== null && !toastState.isExiting) {
        clearTimers()
        performExit()
      }
      return
    }

    // New notice - reset exit state and display it
    clearTimers()
    setToastState({ notice: storeNotice, isExiting: false })

    dismissTimerRef.current = setTimeout(() => {
      clearNotice()
      performExit()
    }, DISMISS_TIMEOUT_MS)
  }, [storeNotice, clearTimers, clearNotice, performExit])

  if (notice === null) {
    return null
  }

  const classes = getSeverityClasses(notice.severity)

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex max-w-sm transform items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-200 ${
        isExiting ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
      } ${classes.container}`}
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
