/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapSelectionLayer } from '../useMapSelectionLayer.ts'
import type { Map } from 'maplibre-gl'

const mockAddSource = vi.fn()
const mockAddLayer = vi.fn()
const mockRemoveLayer = vi.fn()
const mockRemoveSource = vi.fn()
const mockGetSource = vi.fn()
const mockGetLayer = vi.fn()

describe('useMapSelectionLayer', () => {
  const createMockMap = (): Map =>
    ({
      addSource: mockAddSource,
      addLayer: mockAddLayer,
      removeLayer: mockRemoveLayer,
      removeSource: mockRemoveSource,
      getSource: mockGetSource,
      getLayer: mockGetLayer,
    }) as unknown as Map

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSource.mockReturnValue(null)
    mockGetLayer.mockReturnValue(null)
  })

  it('should not add source or layer when map is not loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapSelectionLayer(mapRef, false))

    expect(mockAddSource).not.toHaveBeenCalled()
    expect(mockAddLayer).not.toHaveBeenCalled()
  })

  it('should add selected-plane source when map is loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapSelectionLayer(mapRef, true))

    expect(mockAddSource).toHaveBeenCalledWith(
      'selected-plane',
      expect.objectContaining({
        type: 'geojson',
        data: expect.objectContaining({
          type: 'FeatureCollection',
          features: [],
        }),
      })
    )
  })

  it('should add selected-plane layer when map is loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapSelectionLayer(mapRef, true))

    expect(mockAddLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'selected-plane',
        type: 'circle',
        source: 'selected-plane',
        paint: expect.objectContaining({
          'circle-radius': 20,
          'circle-stroke-color': '#FFD700',
        }),
      })
    )
  })

  it('should not add source if it already exists', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    mockGetSource.mockReturnValue({})

    renderHook(() => useMapSelectionLayer(mapRef, true))

    expect(mockAddSource).not.toHaveBeenCalled()
  })

  it('should not add layer if it already exists', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    mockGetLayer.mockReturnValue({})

    renderHook(() => useMapSelectionLayer(mapRef, true))

    expect(mockAddLayer).not.toHaveBeenCalled()
  })

  it('should return sourceAddedRef that is true after source is added', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    const { result } = renderHook(() => useMapSelectionLayer(mapRef, true))

    expect(result.current.current).toBe(true)
  })

  it('should return sourceAddedRef that is false when map is not loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    const { result } = renderHook(() => useMapSelectionLayer(mapRef, false))

    expect(result.current.current).toBe(false)
  })

  it('should clean up layer and source on unmount', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    mockGetLayer.mockReturnValue({})
    mockGetSource.mockReturnValue({})

    const { unmount } = renderHook(() => useMapSelectionLayer(mapRef, true))
    unmount()

    expect(mockRemoveLayer).toHaveBeenCalledWith('selected-plane')
    expect(mockRemoveSource).toHaveBeenCalledWith('selected-plane')
  })

  it('should set sourceAddedRef to false on unmount', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    mockGetLayer.mockReturnValue({})
    mockGetSource.mockReturnValue({})

    const { result, unmount } = renderHook(() =>
      useMapSelectionLayer(mapRef, true)
    )
    unmount()

    expect(result.current.current).toBe(false)
  })
})
