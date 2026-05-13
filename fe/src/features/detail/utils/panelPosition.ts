/**
 * Panel position calculation utility.
 *
 * Determines the optimal screen position for the detail panel so that
 * the selected plane remains visible on the map. Uses the plane's
 * geographic coordinates projected to screen pixels and the available
 * viewport space on each side to pick the best placement.
 */

/**
 * Allowed panel positions.
 * - 'left': panel on the left edge of the viewport (full-height sidebar)
 * - 'right': panel on the right edge of the viewport (full-height sidebar)
 */
export type PanelPosition = 'left' | 'right'

/**
 * Minimum margin around the plane in pixels.
 * Ensures the plane marker is not flush against the panel edge.
 */
const PLANE_MARGIN = 50

/**
 * A MapLibre-compatible project function signature.
 * Accepts [lng, lat] and returns pixel { x, y }.
 */
export type ProjectFn = (lngLat: [number, number]) => { x: number; y: number }

/**
 * Input parameters for calculating panel position.
 */
export interface CalculatePanelPositionInput {
  /** Latitude of the selected plane */
  planeLat: number
  /** Longitude of the selected plane */
  planeLng: number
  /** Current viewport width in pixels */
  viewportWidth: number
  /** Current viewport height in pixels (reserved for future vertical positioning) */
  viewportHeight: number
  /** Width of the detail panel in pixels (default 350) */
  panelWidth: number
  /** MapLibre `map.project` function (or a mock) */
  project: ProjectFn
}

/**
 * Calculates the optimal screen position for the detail panel.
 *
 * The panel is a fixed sidebar that should not obscure the selected plane.
 * This function projects the plane's geographic coordinates to screen pixels
 * and picks the side (left or right) that has enough room for the panel
 * width plus a margin around the plane.
 *
 * @param input - All parameters wrapped in an options object
 * @returns The recommended panel position
 */
export function calculatePanelPosition(
  input: CalculatePanelPositionInput
): PanelPosition {
  const { planeLat, planeLng, viewportWidth, panelWidth, project } = input

  // Project geographic coordinates to screen pixels
  const screenPos = project([planeLng, planeLat])

  // Available horizontal space on each side
  const spaceRight = viewportWidth - screenPos.x
  const spaceLeft = screenPos.x

  // Required space to fit the panel plus margin around the plane
  const requiredSpace = panelWidth + PLANE_MARGIN

  // Prefer the side with more space, but only if it fits the panel
  if (spaceRight >= requiredSpace) {
    return 'right'
  }
  if (spaceLeft >= requiredSpace) {
    return 'left'
  }

  // Neither side has enough room — pick the side with more space
  // so the overlap is minimized
  return spaceRight >= spaceLeft ? 'right' : 'left'
}
