/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clearMarker, syncMarker } from '../selection.ts'
import type { Map, Marker } from 'maplibre-gl'
import type { PlaneBasic, PlaneDetailed } from '../../../../types/domain.ts'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockMarkerRemove = vi.fn()
const mockMarkerSetLngLat = vi.fn()
const mockMarkerGetElement = vi.fn()
const mockMarkerAddTo = vi.fn()

const { markerConstructors } = vi.hoisted(() => ({
  markerConstructors: [] as Array<[Record<string, unknown> | undefined]>,
}))

vi.mock('maplibre-gl', () => ({
  default: {
    Marker: class {
      setLngLat = mockMarkerSetLngLat.mockReturnThis()
      getElement = mockMarkerGetElement
      remove = mockMarkerRemove
      addTo = mockMarkerAddTo.mockReturnThis()
      constructor(opts?: Record<string, unknown>) {
        markerConstructors.push([opts])
      }
    },
  },
}))

const mockCreateMarkerElement =
  vi.fn<(color: string, heading: number) => HTMLDivElement>()
const mockUpdateMarkerHeading =
  vi.fn<(el: HTMLElement, heading: number) => void>()

vi.mock('../marker.ts', () => ({
  createMarkerElement: (color: string, heading: number) =>
    mockCreateMarkerElement(color, heading),
  updateMarkerHeading: (el: HTMLElement, heading: number) =>
    mockUpdateMarkerHeading(el, heading),
}))

// ---------------------------------------------------------------------------
// Helpers & fixtures
// ---------------------------------------------------------------------------

function createRef<T>(current: T): React.MutableRefObject<T> {
  return { current }
}

const plane: PlaneBasic = {
  id: 'plane-1',
  latitude: 40.7128,
  longitude: -74.006,
  altitude: 10000,
  color: '#ff0000',
}

const detailedPlane: PlaneDetailed = {
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
  status: 'enroute',
  color: '#ff0000',
}

// ---------------------------------------------------------------------------
// clearMarker
// ---------------------------------------------------------------------------

describe('clearMarker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call remove() and nullify the ref when a marker exists', () => {
    const ref = createRef<Marker | null>({
      remove: mockMarkerRemove,
    } as unknown as Marker)

    clearMarker(ref)

    expect(mockMarkerRemove).toHaveBeenCalledTimes(1)
    expect(ref.current).toBeNull()
  })

  it('should be a no-op when ref.current is null', () => {
    const ref = createRef<Marker | null>(null)

    expect(() => clearMarker(ref)).not.toThrow()
    expect(mockMarkerRemove).not.toHaveBeenCalled()
    expect(ref.current).toBeNull()
  })

  it('should not call remove again after ref is exhausted', () => {
    const ref = createRef<Marker | null>({
      remove: mockMarkerRemove,
    } as unknown as Marker)

    clearMarker(ref)
    expect(mockMarkerRemove).toHaveBeenCalledTimes(1)

    mockMarkerRemove.mockClear()
    clearMarker(ref)
    expect(mockMarkerRemove).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// syncMarker
// ---------------------------------------------------------------------------

describe('syncMarker', () => {
  const map = {} as Map

  beforeEach(() => {
    vi.clearAllMocks()
    markerConstructors.length = 0
    mockCreateMarkerElement.mockImplementation(
      (color: string, heading: number) => {
        const div = document.createElement('div')
        div.innerHTML = `<svg fill="${color}" transform="rotate(${heading}deg)"></svg>`
        return div
      }
    )
  })

  describe('when no marker exists', () => {
    it('should create a new Marker with element, anchor, position and add to map', () => {
      const ref = createRef<Marker | null>(null)

      syncMarker(map, ref, plane, detailedPlane)

      expect(markerConstructors.length).toBe(1)
      expect(markerConstructors[0]?.[0]).toMatchObject({
        element: expect.any(HTMLDivElement),
        anchor: 'center',
      })
      expect(mockMarkerSetLngLat).toHaveBeenCalledWith([
        plane.longitude,
        plane.latitude,
      ])
      expect(mockMarkerAddTo).toHaveBeenCalledWith(map)
      expect(ref.current).not.toBeNull()
    })

    it('should create marker element with correct color and heading', () => {
      const ref = createRef<Marker | null>(null)

      syncMarker(map, ref, plane, detailedPlane)

      expect(mockCreateMarkerElement).toHaveBeenCalledWith('#ff0000', 90)
    })
  })

  describe('when a marker already exists', () => {
    function createExistingMarker(el = document.createElement('div')): Marker {
      el.innerHTML = '<svg></svg>'
      return {
        setLngLat: mockMarkerSetLngLat.mockReturnThis(),
        getElement: mockMarkerGetElement.mockReturnValue(el),
        remove: mockMarkerRemove,
      } as unknown as Marker
    }

    it('should update position via setLngLat without creating a new marker', () => {
      const ref = createRef<Marker | null>(createExistingMarker())
      markerConstructors.length = 0

      syncMarker(map, ref, plane, detailedPlane)

      expect(mockMarkerSetLngLat).toHaveBeenCalledWith([
        plane.longitude,
        plane.latitude,
      ])
      expect(markerConstructors.length).toBe(0)
    })

    it('should replace innerHTML and update heading on existing element', () => {
      const el = document.createElement('div')
      const ref = createRef<Marker | null>(createExistingMarker(el))
      const originalMarker = ref.current

      syncMarker(map, ref, plane, detailedPlane)

      expect(el.innerHTML).toContain('svg')
      expect(mockCreateMarkerElement).toHaveBeenCalled()
      expect(mockUpdateMarkerHeading).toHaveBeenCalledWith(el, 90)
      expect(ref.current).toBe(originalMarker)
    })
  })

  describe('edge cases', () => {
    it.each([270, 0, -45])(
      'should handle heading value %i',
      (heading: number) => {
        const ref = createRef<Marker | null>(null)

        syncMarker(map, ref, plane, { ...detailedPlane, heading })

        expect(mockCreateMarkerElement).toHaveBeenCalledWith('#ff0000', heading)
      }
    )
  })
})
