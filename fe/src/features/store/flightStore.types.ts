import type {
  ConnectionStatus,
  Notice,
  PlaneBasic,
  PlaneDetailed,
} from '../../types/domain.ts'

/**
 * State interface for the flight store
 */
export interface FlightStoreState {
  /** All aircraft from the basic WebSocket */
  planes: PlaneBasic[]
  /** ID of the currently selected plane, or null */
  selectedPlaneId: string | null
  /** Detailed data for the subscribed plane, or null */
  detailedPlane: PlaneDetailed | null
  /** Per-connection status for basic and details WebSockets */
  connectionStatus: {
    basic: ConnectionStatus
    details: ConnectionStatus
  }
  /** Current notice, or null */
  notice: Notice | null
}

/**
 * Actions interface for the flight store
 */
export interface FlightStoreActions {
  /** Replace the planes array with new data, auto-deselect if selected plane disappears */
  updatePlanes: (data: PlaneBasic[]) => void
  /** Set selected plane ID and clear detailed plane data */
  selectPlane: (id: string) => void
  /** Clear selected plane ID and detailed plane data */
  deselectPlane: () => void
  /** Set detailed plane data only if ID matches selected plane */
  setDetailedPlane: (data: PlaneDetailed) => void
  /** Update connection status for basic or details connection */
  setConnectionStatus: (
    conn: 'basic' | 'details',
    status: ConnectionStatus
  ) => void
  /** Set notice with severity */
  setNotice: (notice: Notice) => void
  /** Clear notice */
  clearNotice: () => void
}

/**
 * Combined flight store interface (state + actions)
 */
export interface FlightStore extends FlightStoreState, FlightStoreActions {}
