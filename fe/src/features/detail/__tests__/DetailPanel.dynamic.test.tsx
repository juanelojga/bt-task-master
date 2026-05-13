import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DetailPanel } from '../DetailPanel.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'
import { MapContext, type MapContextValue } from '../../map/MapContext.tsx'
import type { PlaneDetailed } from '../../../types/domain.ts'

const mockPlane: PlaneDetailed = {
  id: 'plane-1',
  model: 'Boeing 737-800',
  airline: 'Test Airlines',
  flightNumber: 'TA123',
  registration: 'N12345',
  latitude: 40.7128,
  longitude: -74.006,
  altitude: 10668,
  speed: 250,
  heading: 270,
  verticalSpeed: 5.08,
  origin: { airport: 'JFK', city: 'New York' },
  destination: { airport: 'LAX', city: 'Los Angeles' },
  flightDuration: 16200,
  estimatedArrival: 1704110400,
  numberOfPassengers: 180,
  maxPassengers: 200,
  status: 'enroute',
  color: '#3b82f6',
}

interface MockMapInstance {
  project: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
}

interface MockMapContext extends MapContextValue {
  _eventHandlers: Map<string, () => void>
}

/**
 * Creates a mock MapContextValue with a fake map instance.
 * Tracks event handler registrations so tests can fire 'move' events.
 */
function createMockMapContext(projectX = 200, projectY = 400): MockMapContext {
  const eventHandlers = new Map<string, () => void>()
  const mockMap: MockMapInstance = {
    project: vi.fn().mockReturnValue({ x: projectX, y: projectY }),
    on: vi.fn((event: string, handler: () => void) => {
      eventHandlers.set(event, handler)
    }),
    off: vi.fn((event: string) => {
      eventHandlers.delete(event)
    }),
  }

  return {
    mapRef: { current: mockMap },
    mapLoaded: true,
    _eventHandlers: eventHandlers,
  }
}

/** Renders DetailPanel wrapped in MapContext.Provider */
function renderWithMapContext(
  ui: React.ReactElement,
  mapContext: MapContextValue
) {
  return render(
    <MapContext.Provider value={mapContext}>{ui}</MapContext.Provider>
  )
}

function setDesktopViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1280,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 800,
  })
}

describe('DetailPanel Dynamic Positioning', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      notice: null,
    })
    setDesktopViewport()
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

  describe('without MapContext', () => {
    it('should default to right-side panel', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      const panel = screen.getByRole('dialog')
      expect(panel).toHaveClass('md:right-0')
      expect(panel).not.toHaveClass('md:left-0')
    })
  })

  describe('with MapContext — plane on left side', () => {
    it('should place panel on the right', async () => {
      const mapCtx = createMockMapContext(200, 400)

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      renderWithMapContext(<DetailPanel />, mapCtx)

      await waitFor(() => {
        const panel = screen.getByRole('dialog')
        expect(panel).toHaveClass('md:right-0')
        expect(panel).not.toHaveClass('md:left-0')
      })
    })
  })

  describe('with MapContext — plane on right side', () => {
    it('should place panel on the left', async () => {
      // Plane at x=1000 on 1280-wide viewport — right space (280) < required (400)
      const mapCtx = createMockMapContext(1000, 400)

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      renderWithMapContext(<DetailPanel />, mapCtx)

      await waitFor(() => {
        const panel = screen.getByRole('dialog')
        expect(panel).toHaveClass('md:left-0')
        expect(panel).not.toHaveClass('md:right-0')
      })
    })
  })

  describe('slide animation when panel is on the left', () => {
    it('should use -translate-x-full when closed', async () => {
      const mapCtx = createMockMapContext(1000, 400)

      // First open to calculate position → 'left'
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      const { rerender } = renderWithMapContext(<DetailPanel />, mapCtx)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('md:left-0')
      })

      // Close — position stays 'left' but panel slides off-screen
      useFlightStore.setState({
        selectedPlaneId: null,
        detailedPlane: null,
      })

      rerender(
        <MapContext.Provider value={mapCtx}>
          <DetailPanel />
        </MapContext.Provider>
      )

      const panel = screen.getByRole('dialog', { hidden: true })
      expect(panel).toHaveClass('md:-translate-x-full')
    })

    it('should use -translate-x-0 when open (slides left in)', async () => {
      const mapCtx = createMockMapContext(1000, 400)

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      renderWithMapContext(<DetailPanel />, mapCtx)

      await waitFor(() => {
        const panel = screen.getByRole('dialog')
        expect(panel).toHaveClass('md:-translate-x-0')
      })
    })
  })

  describe('map move event', () => {
    it('should register a move listener on the map', () => {
      const mapCtx = createMockMapContext(200, 400)

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      renderWithMapContext(<DetailPanel />, mapCtx)

      const map = mapCtx.mapRef.current!
      // eslint-disable-next-line @typescript-eslint/unbound-method -- vitest expect.any(Function) is safe
      expect(map.on).toHaveBeenCalledWith('move', expect.any(Function))
    })

    it('should unregister move listener on unmount', () => {
      const mapCtx = createMockMapContext(200, 400)

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      const { unmount } = renderWithMapContext(<DetailPanel />, mapCtx)

      unmount()

      const map = mapCtx.mapRef.current!
      // eslint-disable-next-line @typescript-eslint/unbound-method -- vitest expect.any(Function) is safe
      expect(map.off).toHaveBeenCalledWith('move', expect.any(Function))
    })
  })

  describe('edge cases', () => {
    it('should not recalculate position when detailedPlane is null', () => {
      const mapCtx = createMockMapContext(1000, 400)

      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      renderWithMapContext(<DetailPanel />, mapCtx)

      const panel = screen.getByRole('dialog')
      expect(panel).toHaveClass('md:right-0')
    })

    it('should default to right when map is not loaded', () => {
      const mapCtx: MapContextValue = {
        ...createMockMapContext(1000, 400),
        mapLoaded: false,
      }

      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      renderWithMapContext(<DetailPanel />, mapCtx)

      const panel = screen.getByRole('dialog')
      expect(panel).toHaveClass('md:right-0')
    })
  })
})
