import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createClickHandler,
  createHoverHandlers,
  createMapClickDeselectHandler,
} from '../interaction.ts'
import { useFlightStore } from '../../../store/hooks/useFlightStore.ts'
import type { Map, MapMouseEvent } from 'maplibre-gl'

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const createMockMap = (
  overrides?: Partial<{
    queryRenderedFeatures: ReturnType<typeof vi.fn>
    canvasStyle: CSSStyleDeclaration
  }>
): Map => {
  const canvasStyle = overrides?.canvasStyle ?? ({} as CSSStyleDeclaration)
  return {
    queryRenderedFeatures: overrides?.queryRenderedFeatures ?? vi.fn(),
    getCanvas: vi.fn(() => ({ style: canvasStyle })),
  } as unknown as Map
}

const createClickEvent = (point = { x: 100, y: 200 }): MapMouseEvent =>
  ({
    point,
    type: 'click',
    target: {} as Map,
    originalEvent: {} as MouseEvent,
    lngLat: { lng: 0, lat: 0 },
  }) as unknown as MapMouseEvent

// ---------------------------------------------------------------------------
// describe: createMapClickDeselectHandler
// ---------------------------------------------------------------------------

describe('createMapClickDeselectHandler', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  afterEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  it('should deselect plane when clicking empty map area with a plane selected', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createMapClickDeselectHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should do nothing when clicking empty map area with no plane selected', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createMapClickDeselectHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should do nothing when clicking on a plane feature', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'plane-1' } }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-2' })

    const handler = createMapClickDeselectHandler(map)
    handler(createClickEvent())

    // Should not deselect when clicking on a plane (layer handler handles that)
    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-2')
  })

  it('should query only the planes layer', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createMapClickDeselectHandler(map)
    handler(createClickEvent())

    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(expect.anything(), {
      layers: ['planes'],
    })
  })

  it('should read current selectedPlaneId from store at event time', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })

    useFlightStore.setState({ selectedPlaneId: null })
    const handler = createMapClickDeselectHandler(map)

    // Change selection before firing click
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })
    handler(createClickEvent())

    // Should deselect because at event time, plane-1 was selected
    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// describe: createClickHandler
// ---------------------------------------------------------------------------

describe('createClickHandler', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  afterEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
  })

  it('should do nothing when no features are under the click point', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(mockQuery).toHaveBeenCalledWith(
      { x: 100, y: 200 },
      {
        layers: ['planes'],
      }
    )
    // Selection should remain unchanged
    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
  })

  it('should select a plane when clicking a feature with a string properties.id', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'plane-2' } }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-2')
    expect(useFlightStore.getState().detailedPlane).toBeNull()
  })

  it('should deselect when clicking the already-selected plane', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'plane-1' } }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
    expect(useFlightStore.getState().detailedPlane).toBeNull()
  })

  it('should fall back to feature.id when properties.id is missing', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: {}, id: 'plane-fallback' }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-fallback')
  })

  it('should prefer properties.id over feature.id when both exist', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'prop-id' }, id: 'feature-id' }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('prop-id')
  })

  it('should not select or deselect when plane id is not a string', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 123 }, id: 999 }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })

  it('should not select or deselect when both properties.id and feature.id are missing', () => {
    const mockQuery = vi.fn().mockReturnValue([{ properties: {} }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-1')
  })

  it('should select from no selection (null → plane)', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'plane-5' } }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-5')
  })

  it('should only consider the first feature when multiple features are under the click', () => {
    const mockQuery = vi
      .fn()
      .mockReturnValue([
        { properties: { id: 'plane-first' } },
        { properties: { id: 'plane-second' } },
      ])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })
    useFlightStore.setState({ selectedPlaneId: null })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(useFlightStore.getState().selectedPlaneId).toBe('plane-first')
  })

  it('should query only the planes layer', () => {
    const mockQuery = vi.fn().mockReturnValue([])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })

    const handler = createClickHandler(map)
    handler(createClickEvent())

    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(expect.anything(), {
      layers: ['planes'],
    })
  })

  it('should read current selectedPlaneId from store at event time', () => {
    // The handler reads getState() at call time, not creation time
    const mockQuery = vi
      .fn()
      .mockReturnValue([{ properties: { id: 'plane-1' } }])
    const map = createMockMap({ queryRenderedFeatures: mockQuery })

    useFlightStore.setState({ selectedPlaneId: null })
    const handler = createClickHandler(map)

    // Change selection before firing click
    useFlightStore.setState({ selectedPlaneId: 'plane-1' })
    handler(createClickEvent())

    // Should deselect because at event time, plane-1 was selected
    expect(useFlightStore.getState().selectedPlaneId).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// describe: createHoverHandlers
// ---------------------------------------------------------------------------

describe('createHoverHandlers', () => {
  it('should set cursor to "pointer" on enter', () => {
    const canvasStyle = {} as CSSStyleDeclaration
    const map = createMockMap({ canvasStyle })

    const handlers = createHoverHandlers(map)
    handlers.enter()

    expect(canvasStyle.cursor).toBe('pointer')
  })

  it('should clear cursor on leave', () => {
    const canvasStyle = { cursor: 'pointer' } as CSSStyleDeclaration
    const map = createMockMap({ canvasStyle })

    const handlers = createHoverHandlers(map)
    handlers.leave()

    expect(canvasStyle.cursor).toBe('')
  })

  it('should toggle cursor correctly through enter → leave cycle', () => {
    const canvasStyle = {} as CSSStyleDeclaration
    const map = createMockMap({ canvasStyle })

    const handlers = createHoverHandlers(map)

    handlers.enter()
    expect(canvasStyle.cursor).toBe('pointer')

    handlers.leave()
    expect(canvasStyle.cursor).toBe('')

    handlers.enter()
    expect(canvasStyle.cursor).toBe('pointer')
  })

  it('should return distinct enter and leave functions', () => {
    const map = createMockMap()
    const handlers = createHoverHandlers(map)

    expect(handlers.enter).toBeInstanceOf(Function)
    expect(handlers.leave).toBeInstanceOf(Function)
    expect(handlers.enter).not.toBe(handlers.leave)
  })
})
