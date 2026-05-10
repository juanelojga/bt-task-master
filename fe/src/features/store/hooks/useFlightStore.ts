import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FlightStore } from '../flightStore.types.ts'

export const useFlightStore = create<FlightStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: {
        basic: 'disconnected',
        details: 'disconnected',
      },
      errorMessage: null,

      // Actions
      updatePlanes: (data) => {
        const { selectedPlaneId } = get()

        // Check if selected plane is still in the new data
        const selectedPlaneStillExists =
          selectedPlaneId !== null &&
          data.some((plane) => plane.id === selectedPlaneId)

        if (selectedPlaneId !== null && !selectedPlaneStillExists) {
          // Auto-deselect: selected plane disappeared from the list
          set(
            {
              planes: data,
              selectedPlaneId: null,
              detailedPlane: null,
            },
            false,
            'updatePlanes/auto-deselect'
          )
        } else {
          // Normal update
          set({ planes: data }, false, 'updatePlanes')
        }
      },

      selectPlane: (id) => {
        set(
          {
            selectedPlaneId: id,
            detailedPlane: null,
          },
          false,
          'selectPlane'
        )
      },

      deselectPlane: () => {
        set(
          {
            selectedPlaneId: null,
            detailedPlane: null,
          },
          false,
          'deselectPlane'
        )
      },

      setDetailedPlane: (data) => {
        const { selectedPlaneId } = get()

        // Only set if IDs match
        if (selectedPlaneId !== null && data.id === selectedPlaneId) {
          set({ detailedPlane: data }, false, 'setDetailedPlane')
        }
        // Otherwise: no-op (ignore data for non-selected plane)
      },

      setConnectionStatus: (conn, status) => {
        set(
          (state) => ({
            connectionStatus: {
              ...state.connectionStatus,
              [conn]: status,
            },
          }),
          false,
          `setConnectionStatus/${conn}`
        )
      },

      setError: (msg) => {
        set({ errorMessage: msg }, false, 'setError')
      },

      clearError: () => {
        set({ errorMessage: null }, false, 'clearError')
      },
    }),
    { name: 'FlightStore' }
  )
)
