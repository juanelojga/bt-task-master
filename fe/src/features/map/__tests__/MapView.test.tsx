import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup, waitFor } from '@testing-library/react'
import { MapView } from '../MapView.tsx'
import { useMapMarkers } from '../hooks/useMapMarkers.ts'
import { usePlanes } from '../../store/hooks/useFlightSelectors.ts'

// Mock maplibre-gl with inline mock functions
vi.mock('maplibre-gl', () => {
  const mockOn = vi.fn()
  const mockRemove = vi.fn()

  function MockMap() {
    return {
      on: mockOn,
      remove: mockRemove,
    }
  }

  return {
    default: { Map: MockMap },
    Map: MockMap,
    // Export mocks so tests can access them
    __mockOn: mockOn,
    __mockRemove: mockRemove,
  }
})

// Mock the hooks
vi.mock('../hooks/useMapMarkers.ts', () => ({
  useMapMarkers: vi.fn(),
}))

vi.mock('../hooks/useMapSelectionLayer.ts', () => ({
  useMapSelectionLayer: vi.fn(() => ({ current: false })),
}))

vi.mock('../hooks/useMapSelectionState.ts', () => ({
  useMapSelectionState: vi.fn(),
}))

vi.mock('../hooks/useMapInteraction.ts', () => ({
  useMapInteraction: vi.fn(),
}))

// Mock the store selectors
vi.mock('../../store/hooks/useFlightSelectors.ts', () => ({
  usePlanes: vi.fn(() => []),
  useSelectedPlaneId: vi.fn(() => null),
  useDetailedPlane: vi.fn(() => null),
  useConnectionStatus: vi.fn(() => ({
    basic: 'connected',
    details: 'connected',
  })),
}))

describe('MapView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should render a map container div', () => {
    render(
      <MapView
        config={{
          center: { lng: 0, lat: 20 },
          zoom: 2,
          style: { url: 'https://example.com/style.json' },
        }}
      />
    )

    // The div should exist with class w-full h-full
    const container = document.querySelector('.w-full.h-full')
    expect(container).toBeInTheDocument()
  })

  it('should register load event handler', async () => {
    const maplibregl = await import('maplibre-gl')

    render(
      <MapView
        config={{
          center: { lng: 0, lat: 20 },
          zoom: 2,
          style: { url: 'https://example.com/style.json' },
        }}
      />
    )

    // Access the mock through the module
    expect(
      (maplibregl as unknown as { __mockOn: typeof vi.fn }).__mockOn
    ).toHaveBeenCalledWith('load', expect.any(Function))
  })

  it('should remove map on unmount', async () => {
    const maplibregl = await import('maplibre-gl')

    const { unmount } = render(
      <MapView
        config={{
          center: { lng: 0, lat: 20 },
          zoom: 2,
          style: { url: 'https://example.com/style.json' },
        }}
      />
    )

    unmount()

    expect(
      (maplibregl as unknown as { __mockRemove: typeof vi.fn }).__mockRemove
    ).toHaveBeenCalled()
  })

  it('should call useMapMarkers with correct arguments', async () => {
    const mockPlanes = [
      {
        id: 'plane-1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
    ]

    // Mock usePlanes to return test planes
    vi.mocked(usePlanes).mockReturnValue(mockPlanes)

    render(
      <MapView
        config={{
          center: { lng: 0, lat: 20 },
          zoom: 2,
          style: { url: 'https://example.com/style.json' },
        }}
      />
    )

    // Wait for the map to "load" and the effect to run
    await waitFor(() => {
      expect(useMapMarkers).toHaveBeenCalled()
    })

    // Verify useMapMarkers was called with the correct arguments
    const lastCall = vi.mocked(useMapMarkers).mock.lastCall
    expect(lastCall).toBeDefined()

    // First argument should be a ref object with current property
    expect(lastCall![0]).toHaveProperty('current')

    // Second argument should be mapLoaded boolean (false initially, true after load)
    expect(typeof lastCall![1]).toBe('boolean')

    // Third argument should be the planes array from usePlanes
    expect(lastCall![2]).toEqual(mockPlanes)
  })
})
