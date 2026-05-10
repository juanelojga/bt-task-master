import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMapInteraction } from '../useMapInteraction.ts'
import { useFlightStore } from '../../../store/hooks/useFlightStore.ts'
import type { Map } from 'maplibre-gl'

const mockOn = vi.fn()
const mockOff = vi.fn()
const mockQueryRenderedFeatures = vi.fn()
const mockCanvasStyle: { cursor?: string } = {}
const mockGetCanvas = vi.fn(() => ({ style: mockCanvasStyle }))

describe('useMapInteraction', () => {
  const createMockMap = (): Map =>
    ({
      on: mockOn,
      off: mockOff,
      queryRenderedFeatures: mockQueryRenderedFeatures,
      getCanvas: mockGetCanvas,
    }) as unknown as Map

  beforeEach(() => {
    vi.clearAllMocks()
    delete mockCanvasStyle.cursor
    mockQueryRenderedFeatures.mockReturnValue([])
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

  it('should not register handlers when map is not loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapInteraction(mapRef, false))

    expect(mockOn).not.toHaveBeenCalled()
  })

  it('should register click and hover handlers when map is loaded', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapInteraction(mapRef, true))

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

  it('should change cursor to pointer on mouseenter', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapInteraction(mapRef, true))

    const mouseenterCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'mouseenter'
    )!
    const handler = mouseenterCall[2] as () => void
    handler()

    expect(mockCanvasStyle.cursor).toBe('pointer')
  })

  it('should reset cursor on mouseleave', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    renderHook(() => useMapInteraction(mapRef, true))

    mockCanvasStyle.cursor = 'pointer'

    const mouseleaveCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'mouseleave'
    )!
    const handler = mouseleaveCall[2] as () => void
    handler()

    expect(mockCanvasStyle.cursor).toBe('')
  })

  it('should select a plane on click when a feature is present', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([
      { properties: { id: 'plane-2' } },
    ])

    const mapRef = { current: mockMap }
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    renderHook(() => useMapInteraction(mapRef, true))

    const clickCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'click'
    )!
    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void
    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-2')
  })

  it('should deselect when clicking the already-selected plane', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([
      { properties: { id: 'plane-2' } },
    ])

    const mapRef = { current: mockMap }
    useFlightStore.setState({ selectedPlaneId: 'plane-2' })

    renderHook(() => useMapInteraction(mapRef, true))

    const clickCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'click'
    )!
    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void
    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should not select when plane id is not a string', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([
      { properties: { id: 123 }, id: 999 },
    ])

    const mapRef = { current: mockMap }
    useFlightStore.setState({ selectedPlaneId: null })

    renderHook(() => useMapInteraction(mapRef, true))

    const clickCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'click'
    )!
    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void
    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should fall back to feature.id when properties.id is missing', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([
      { properties: {}, id: 'plane-fallback' },
    ])

    const mapRef = { current: mockMap }
    useFlightStore.setState({ selectedPlaneId: null })

    renderHook(() => useMapInteraction(mapRef, true))

    const clickCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'click'
    )!
    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void
    clickHandler({ point: { x: 100, y: 100 } })

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-fallback')
  })

  it('should do nothing when clicking on empty area', () => {
    const mockMap = createMockMap()
    mockQueryRenderedFeatures.mockReturnValue([])

    const mapRef = { current: mockMap }
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    renderHook(() => useMapInteraction(mapRef, true))

    const clickCall = mockOn.mock.calls.find(
      (call: unknown[]) => call[0] === 'click'
    )!
    const clickHandler = clickCall[2] as (e: {
      point: { x: number; y: number }
    }) => void
    clickHandler({ point: { x: 100, y: 100 } })

    // Selection should not change
    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
  })

  it('should unregister handlers on unmount', () => {
    const mockMap = createMockMap()
    const mapRef = { current: mockMap }

    const { unmount } = renderHook(() => useMapInteraction(mapRef, true))
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
  })
})
