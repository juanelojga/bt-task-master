import { useFlightStore } from './useFlightStore.ts'
import type {
  ConnectionStatus,
  PlaneBasic,
  PlaneDetailed,
} from '../../../types/domain.ts'

/**
 * Returns the array of all planes from the flight store.
 * Component will only re-render when the planes array changes.
 */
export function usePlanes(): PlaneBasic[] {
  return useFlightStore((state) => state.planes)
}

/**
 * Returns the ID of the currently selected plane, or null.
 * Component will only re-render when the selected plane ID changes.
 */
export function useSelectedPlaneId(): string | null {
  return useFlightStore((state) => state.selectedPlaneId)
}

/**
 * Returns the detailed plane data for the subscribed plane, or null.
 * Component will only re-render when the detailed plane data changes.
 */
export function useDetailedPlane(): PlaneDetailed | null {
  return useFlightStore((state) => state.detailedPlane)
}

/**
 * Returns the connection status for both basic and details WebSockets.
 * Component will only re-render when the connection status changes.
 */
export function useConnectionStatus(): {
  basic: ConnectionStatus
  details: ConnectionStatus
} {
  return useFlightStore((state) => state.connectionStatus)
}

/**
 * Returns the current error message, or null.
 * Component will only re-render when the error message changes.
 */
export function useErrorMessage(): string | null {
  return useFlightStore((state) => state.errorMessage)
}
