import type { Map } from 'maplibre-gl'
import type { PlaneBasic, PlaneDetailed } from '../../../types/domain.ts'
import { useMapSelectionLayer } from './useMapSelectionLayer.ts'
import { useMapSelectionState } from './useMapSelectionState.ts'
import { useMapInteraction } from './useMapInteraction.ts'

/**
 * Hook that manages map selection interaction by composing three sub-hooks:
 *
 * 1. useMapSelectionLayer — manages the selected-plane GeoJSON source & layer lifecycle
 * 2. useMapSelectionState — updates source data and heading marker based on selection
 * 3. useMapInteraction — handles click-to-select/deselect and cursor hover
 */
export function useMapSelection(
  mapRef: React.RefObject<Map | null>,
  mapLoaded: boolean,
  selectedPlaneId: string | null,
  planes: PlaneBasic[],
  detailedPlane: PlaneDetailed | null
): void {
  const sourceAddedRef = useMapSelectionLayer(mapRef, mapLoaded)
  useMapSelectionState(
    mapRef,
    sourceAddedRef,
    selectedPlaneId,
    planes,
    detailedPlane
  )
  useMapInteraction(mapRef, mapLoaded)
}
