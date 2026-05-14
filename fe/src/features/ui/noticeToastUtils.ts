/**
 * Returns Tailwind classes based on notice severity
 */
export function getSeverityClasses(severity: 'error' | 'warning' | 'info'): {
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
