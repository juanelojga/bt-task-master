/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapSelection } from '../useMapSelection.ts'
import { useFlightStore } from '../../../store/hooks/useFlightStore.ts'
import type { Map } from 'maplibre-gl'

// Mock functions
const mockSetData = vi.fn()
const mockAddSource = vi.fn()
const mockAddLayer = vi.fn()
const mockRemoveLayer = vi.fn()
const mockRemoveSource = vi.fn()
const mockGetSource = vi.fn()
const mockGetLayer = vi.fn()
const mockOn = vi.fn()
const mockOff = vi.fn()
const mockQueryRenderedFeatures = vi.fn()
const mockCanvasStyle: { cursor?: string } = {}
const mockGetCanvas = vi.fn(() => ({ style: mockCanvasStyle }))

// Mock maplibre-gl
vi.mock('maplibre-gl', () => ({
  Marker: vi.fn(() => ({
    setLngLat: vi.fn(),
    getElement: () => ({
      innerHTML: '',
      querySelector: () => ({ style: { setProperty: vi.fn() } }),
    }),
    remove: vi.fn(),
    addTo: vi.fn(),
  })),
}))

describe('useMapSelection', () => {
  const createMockMap = (): Map =>
    ({
      addSource: mockAddSource,
      addLayer: mockAddLayer,
      removeLayer: mockRemoveLayer,
      removeSource: mockRemoveSource,
      getSource: mockGetSource,
      getLayer: mockGetLayer,
      on: mockOn,
      off: mockOff,
      queryRenderedFeatures: mockQueryRenderedFeatures,
      getCanvas: mockGetCanvas,
    }) as unknown as Map

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSource.mockReturnValue(null)
    mockGetLayer.mockReturnValue(null)
  })

  afterEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      errorMessage: null,
    })
  })

  it('should add selected-plane source and layer when map is loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoaded = true

    renderHook(() => useMapSelection(mapRef, mapLoaded, null, [], null))

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

    expect(mockAddLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'selected-plane',
        type: 'circle',
        source: 'selected-plane',
      })
    )
  })

  it('should register click and hover handlers on planes layer', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoaded = true

    renderHook(() => useMapSelection(mapRef, mapLoaded, null, [], null))

    expect(mockOn).toHaveBeenCalledWith('click', 'planes', expect.any(Function))
    expect(mockOn).toHaveBeenCalledWith(
      'mouseenter',
      'planes',
      expect.any(Function)
    )
    expect(mockOn).toHaveBeenCalledWith(
      'mouseleave',
      'planes',
      expect.any(Function)
    )
  })

  it('should change cursor on hover', () => {
    mockCanvasStyle.cursor = undefined

    const mockMap = createMockMap()
    const mapRef = { current: mockMap }
    const mapLoaded = true

    renderHook(() => useMapSelection(mapRef, mapLoaded, null, [], null))

    const mouseenterCall = mockOn.mock.calls.find(
      (call) => call[0] === 'mouseenter'
    )!
    const mouseleaveCall = mockOn.mock.calls.find(
      (call) => call[0] === 'mouseleave'
    )!

    const mouseenterHandler = mouseenterCall[2] as () => void

    const mouseleaveHandler = mouseleaveCall[2] as () => void

    mouseenterHandler()
    expect(mockCanvasStyle.cursor).toBe('pointer')

    mouseleaveHandler()
    expect(mockCanvasStyle.cursor).toBe('')
  })

  it('should handle click to select plane', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([{ id: 'plane-2' }])

    const mapRef = { current: mockMap }
    const mapLoaded = true

    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    renderHook(() => useMapSelection(mapRef, mapLoaded, 'plane-1', [], null))

    const clickCall = mockOn.mock.calls.find((call) => call[0] === 'click')!

    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void

    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-2')
  })

  it('should handle click to deselect plane', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([{ id: 'plane-1' }])

    const mapRef = { current: mockMap }
    const mapLoaded = true

    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    renderHook(() => useMapSelection(mapRef, mapLoaded, 'plane-1', [], null))

    const clickCall = mockOn.mock.calls.find((call) => call[0] === 'click')!

    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void

    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should cleanup on unmount', () => {
    const mockMap = createMockMap()
    mockGetLayer.mockReturnValue({})
    mockGetSource.mockReturnValue({ setData: mockSetData })

    const mapRef = { current: mockMap }
    const mapLoaded = true

    const { unmount } = renderHook(() =>
      useMapSelection(mapRef, mapLoaded, null, [], null)
    )

    unmount()

    expect(mockOff).toHaveBeenCalledWith(
      'click',
      'planes',
      expect.any(Function)
    )
    expect(mockOff).toHaveBeenCalledWith(
      'mouseenter',
      'planes',
      expect.any(Function)
    )
    expect(mockOff).toHaveBeenCalledWith(
      'mouseleave',
      'planes',
      expect.any(Function)
    )
    expect(mockRemoveLayer).toHaveBeenCalledWith('selected-plane')
    expect(mockRemoveSource).toHaveBeenCalledWith('selected-plane')
  })
})
