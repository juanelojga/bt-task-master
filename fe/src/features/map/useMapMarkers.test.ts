/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapMarkers } from './useMapMarkers.ts'
import type { Map } from 'maplibre-gl'
import type { PlaneBasic } from '../../types/domain.ts'

describe('useMapMarkers', () => {
  const mockSetData = vi.fn()
  const mockAddSource = vi.fn()
  const mockAddLayer = vi.fn()
  const mockRemoveLayer = vi.fn()
  const mockRemoveSource = vi.fn()
  const mockGetSource = vi.fn()
  const mockGetLayer = vi.fn()

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
    // Return null initially so sources get created
    mockGetSource.mockReturnValue(null)
    mockGetLayer.mockReturnValue(null)
  })

  it('should add source and layer when map is loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = []

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    expect(mockAddSource).toHaveBeenCalledWith(
      'planes',
      expect.objectContaining({
        type: 'geojson',
        data: expect.objectContaining({
          type: 'FeatureCollection',
          features: [],
        }),
      })
    )

    expect(mockAddLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'planes',
        type: 'circle',
        source: 'planes',
      })
    )
  })

  it('should not add source or layer if map is not loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: false }
    const planes: PlaneBasic[] = []

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    expect(mockAddSource).not.toHaveBeenCalled()
    expect(mockAddLayer).not.toHaveBeenCalled()
  })

  it('should convert planes to GeoJSON FeatureCollection', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = [
      {
        id: 'plane-1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
      {
        id: 'plane-2',
        latitude: 51.5074,
        longitude: -0.1278,
        altitude: 15000,
        color: '#00ff00',
      },
    ]

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    const sourceCall: [
      string,
      {
        data: {
          type: string
          features: Array<{
            type: string
            id: string
            geometry: { type: string; coordinates: number[] }
            properties: Record<string, unknown>
          }>
        }
      },
    ] = mockAddSource.mock.calls[0] as unknown as [
      string,
      {
        data: {
          type: string
          features: Array<{
            type: string
            id: string
            geometry: { type: string; coordinates: number[] }
            properties: Record<string, unknown>
          }>
        }
      },
    ]

    const data = sourceCall[1].data

    expect(data.type).toBe('FeatureCollection')
    expect(data.features).toHaveLength(2)
    expect(data.features[0]).toMatchObject({
      type: 'Feature',
      id: 'plane-1',
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128],
      },
      properties: {
        id: 'plane-1',
        color: '#ff0000',
        altitude: 10000,
      },
    })
    expect(data.features[1]).toMatchObject({
      type: 'Feature',
      id: 'plane-2',
      geometry: {
        type: 'Point',
        coordinates: [-0.1278, 51.5074],
      },
      properties: {
        id: 'plane-2',
        color: '#00ff00',
        altitude: 15000,
      },
    })
  })

  it('should update source data when planes change', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }

    // First render with empty planes - source will be created
    const { rerender } = renderHook(
      ({ planes }) => useMapMarkers(mapRef, mapLoadedRef, planes),
      {
        initialProps: { planes: [] as PlaneBasic[] },
      }
    )

    // Now make getSource return the source with setData for updates
    mockGetSource.mockReturnValue({
      setData: mockSetData,
    })

    // Then update with planes
    const newPlanes: PlaneBasic[] = [
      {
        id: 'plane-1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
    ]

    rerender({ planes: newPlanes })

    expect(mockSetData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'FeatureCollection',
        features: expect.arrayContaining([
          expect.objectContaining({
            id: 'plane-1',
            geometry: {
              type: 'Point',
              coordinates: [-74.006, 40.7128],
            },
          }),
        ]),
      })
    )
  })

  it('should handle empty planes array', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = []

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    const sourceCall: [string, { data: { features: unknown[] } }] =
      mockAddSource.mock.calls[0] as unknown as [
        string,
        { data: { features: unknown[] } },
      ]

    const data = sourceCall[1].data

    expect(data.features).toHaveLength(0)
  })

  it('should remove layer and source on unmount', () => {
    const mockMap = createMockMap()
    mockGetLayer.mockReturnValue({})
    mockGetSource.mockReturnValue({})

    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = []

    const { unmount } = renderHook(() =>
      useMapMarkers(mapRef, mapLoadedRef, planes)
    )

    unmount()

    expect(mockRemoveLayer).toHaveBeenCalledWith('planes')
    expect(mockRemoveSource).toHaveBeenCalledWith('planes')
  })

  it('should not add duplicate source or layer if they already exist', () => {
    const mockMap = createMockMap()
    mockGetLayer.mockReturnValue({})

    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = []

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    // addSource should still be called because we check getSource in the hook
    // but addLayer should not be called since layer exists
    expect(mockAddLayer).not.toHaveBeenCalled()
  })

  it('should set feature ID to plane ID for stable rendering', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoadedRef = { current: true }
    const planes: PlaneBasic[] = [
      {
        id: 'abc-123',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
    ]

    renderHook(() => useMapMarkers(mapRef, mapLoadedRef, planes))

    const sourceCall: [string, { data: { features: Array<{ id: string }> } }] =
      mockAddSource.mock.calls[0] as unknown as [
        string,
        { data: { features: Array<{ id: string }> } },
      ]

    const feature = sourceCall[1].data.features[0]

    expect(feature.id).toBe('abc-123')
  })
})
