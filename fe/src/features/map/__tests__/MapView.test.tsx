import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MapView } from '../MapView.tsx'

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

vi.mock('../hooks/useMapSelection.ts', () => ({
  useMapSelection: vi.fn(),
}))

// Mock the store selectors
vi.mock('../store/hooks/useFlightSelectors.ts', () => ({
  usePlanes: vi.fn(() => []),
  useSelectedPlaneId: vi.fn(() => null),
  useDetailedPlane: vi.fn(() => null),
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
})
