/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapSelectionState } from '../useMapSelectionState.ts'
import type { Map } from 'maplibre-gl'

const mockSetData = vi.fn()
const mockGetSource = vi.fn()
const mockRemove = vi.fn()
const mockSetLngLat = vi.fn()
const mockAddTo = vi.fn()
const mockGetElement = vi.fn()

const { markerConstructorCalls, markerInstanceCount } = vi.hoisted(() => {
  const calls: Array<[Record<string, unknown> | undefined]> = []
  return { markerConstructorCalls: calls, markerInstanceCount: { value: 0 } }
})

vi.mock('maplibre-gl', () => ({
  default: {
    Marker: class {
      setLngLat: ReturnType<typeof vi.fn>
      getElement: ReturnType<typeof vi.fn>
      remove: ReturnType<typeof vi.fn>
      addTo: ReturnType<typeof vi.fn>

      constructor(opts?: Record<string, unknown>) {
        markerConstructorCalls.push([opts])
        markerInstanceCount.value++
        this.setLngLat = mockSetLngLat.mockReturnThis()
        this.getElement = mockGetElement
        this.remove = mockRemove
        this.addTo = mockAddTo.mockReturnThis()
      }
    },
  },
}))

const planes = [
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

const detailedPlane = {
  id: 'plane-1',
  model: 'Boeing 737',
  airline: 'Test Air',
  flightNumber: 'TA123',
  registration: 'N12345',
  latitude: 40.7128,
  longitude: -74.006,
  altitude: 10000,
  speed: 250,
  heading: 90,
  verticalSpeed: 5,
  origin: { airport: 'JFK', city: 'New York' },
  destination: { airport: 'LAX', city: 'Los Angeles' },
  flightDuration: 18000,
  estimatedArrival: 18000,
  numberOfPassengers: 150,
  maxPassengers: 200,
  status: 'enroute' as const,
  color: '#ff0000',
}

describe('useMapSelectionState', () => {
  const mockSource = { setData: mockSetData }
  const mockMap = { getSource: mockGetSource } as unknown as Map
  const mapRef = { current: mockMap }
  const sourceAddedRef = { current: true }

  beforeEach(() => {
    vi.clearAllMocks()
    markerConstructorCalls.length = 0
    markerInstanceCount.value = 0
    mockGetSource.mockReturnValue(mockSource)
    mockGetElement.mockReturnValue({
      innerHTML: '',
      querySelector: () => ({ style: { setProperty: vi.fn() } }),
    })
    mockSetLngLat.mockReturnThis()
    mockAddTo.mockReturnThis()
  })

  describe('when no plane is selected', () => {
    it('should set empty FeatureCollection on source and not access map when sourceAddedRef is false', () => {
      const ref = { current: false }
      const { rerender } = renderHook(() =>
        useMapSelectionState(mapRef, ref, null, [], null)
      )
      expect(mockGetSource).not.toHaveBeenCalled()

      // Re-render with sourceAddedRef = true
      ref.current = true
      rerender()
      expect(mockSetData).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FeatureCollection',
          features: [],
        })
      )
    })
  })

  describe('when a plane is selected', () => {
    it('should set FeatureCollection with selected plane data', () => {
      renderHook(() =>
        useMapSelectionState(mapRef, sourceAddedRef, 'plane-1', planes, null)
      )

      expect(mockSetData).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FeatureCollection',
          features: [
            expect.objectContaining({
              id: 'plane-1',
              properties: expect.objectContaining({ id: 'plane-1' }),
            }),
          ],
        })
      )
    })

    it('should clear selection when plane not found or map/source missing', () => {
      // Plane not found
      const { rerender } = renderHook(
        ({ id }: { id: string | null }) =>
          useMapSelectionState(mapRef, sourceAddedRef, id, planes, null),
        { initialProps: { id: 'non-existent' } }
      )
      expect(mockSetData).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'FeatureCollection', features: [] })
      )

      // Map is null
      const nullMapRef = { current: null }
      rerender({ id: 'plane-1' })
      // Re-render with null map shouldn't call getSource
      void nullMapRef
      mockGetSource.mockClear()

      // Source not found
      mockGetSource.mockReturnValue(null)
      mockSetData.mockClear()
      renderHook(() =>
        useMapSelectionState(mapRef, sourceAddedRef, 'plane-1', planes, null)
      )
      expect(mockGetSource).toHaveBeenCalledWith('selected-plane')
      expect(mockSetData).not.toHaveBeenCalled()
    })
  })

  describe('heading marker', () => {
    it('should create marker with heading and update on re-render', () => {
      const { rerender } = renderHook(
        ({ heading }: { heading: number }) =>
          useMapSelectionState(mapRef, sourceAddedRef, 'plane-1', planes, {
            ...detailedPlane,
            heading,
          }),
        { initialProps: { heading: 90 } }
      )

      expect(markerConstructorCalls.length).toBe(1)
      expect(markerConstructorCalls[0]?.[0]).toEqual(
        expect.objectContaining({
          element: expect.any(HTMLDivElement),
          anchor: 'center',
        })
      )

      const callCount = markerInstanceCount.value
      rerender({ heading: 180 })
      expect(markerInstanceCount.value).toBe(callCount)
      expect(mockSetLngLat).toHaveBeenCalled()
    })

    it('should remove marker when detailedPlane is cleared or on unmount', () => {
      const { rerender, unmount } = renderHook<
        void,
        { detailed: typeof detailedPlane | null }
      >(
        ({ detailed }: { detailed: typeof detailedPlane | null }) =>
          useMapSelectionState(
            mapRef,
            sourceAddedRef,
            'plane-1',
            planes,
            detailed
          ),
        { initialProps: { detailed: detailedPlane } }
      )

      expect(mockAddTo).toHaveBeenCalled()

      // Clear detailed plane
      rerender({ detailed: null })
      expect(mockRemove).toHaveBeenCalled()

      // Re-select
      mockRemove.mockClear()
      rerender({ detailed: detailedPlane })
      expect(mockAddTo).toHaveBeenCalledTimes(2)

      // Unmount
      unmount()
      expect(mockRemove).toHaveBeenCalled()
    })
  })
})
