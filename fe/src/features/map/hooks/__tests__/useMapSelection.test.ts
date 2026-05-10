import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapSelection } from '../useMapSelection.ts'

// Mock the sub-hooks so each is tested independently
const mockSourceAddedRef = { current: true }

vi.mock('../useMapSelectionLayer.ts', () => ({
  useMapSelectionLayer: vi.fn(() => mockSourceAddedRef),
}))

vi.mock('../useMapSelectionState.ts', () => ({
  useMapSelectionState: vi.fn(),
}))

vi.mock('../useMapInteraction.ts', () => ({
  useMapInteraction: vi.fn(),
}))

import { useMapSelectionLayer } from '../useMapSelectionLayer.ts'
import { useMapSelectionState } from '../useMapSelectionState.ts'
import { useMapInteraction } from '../useMapInteraction.ts'

const mockUseMapSelectionLayer = useMapSelectionLayer as ReturnType<
  typeof vi.fn
>
const mockUseMapSelectionState = useMapSelectionState as ReturnType<
  typeof vi.fn
>
const mockUseMapInteraction = useMapInteraction as ReturnType<typeof vi.fn>

describe('useMapSelection (composition)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMapSelectionLayer.mockReturnValue(mockSourceAddedRef)
  })

  it('should compose useMapSelectionLayer, useMapSelectionState, and useMapInteraction', () => {
    renderHook(() => useMapSelection({ current: null }, false, null, [], null))

    expect(mockUseMapSelectionLayer).toHaveBeenCalledTimes(1)
    expect(mockUseMapSelectionState).toHaveBeenCalledTimes(1)
    expect(mockUseMapInteraction).toHaveBeenCalledTimes(1)
  })

  it('should pass mapRef and mapLoaded to useMapSelectionLayer', () => {
    const mapRef = { current: null }

    renderHook(() => useMapSelection(mapRef, true, null, [], null))

    expect(mockUseMapSelectionLayer).toHaveBeenCalledWith(mapRef, true)
  })

  it('should pass correct args to useMapSelectionState including sourceAddedRef', () => {
    const mapRef = { current: null }
    const planes = [
      {
        id: 'p1',
        latitude: 0,
        longitude: 0,
        altitude: 0,
        color: '#000',
      },
    ]

    renderHook(() => useMapSelection(mapRef, true, 'p1', planes, null))

    expect(mockUseMapSelectionState).toHaveBeenCalledWith(
      mapRef,
      mockSourceAddedRef,
      'p1',
      planes,
      null
    )
  })

  it('should pass mapRef and mapLoaded to useMapInteraction', () => {
    const mapRef = { current: null }

    renderHook(() => useMapSelection(mapRef, false, null, [], null))

    expect(mockUseMapInteraction).toHaveBeenCalledWith(mapRef, false)
  })
})
