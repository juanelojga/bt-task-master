import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailPanel } from '../DetailPanel.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'
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
  origin: {
    airport: 'JFK',
    city: 'New York',
  },
  destination: {
    airport: 'LAX',
    city: 'Los Angeles',
  },
  flightDuration: 16200,
  estimatedArrival: 1704110400,
  numberOfPassengers: 180,
  maxPassengers: 200,
  status: 'enroute',
  color: '#3b82f6',
}

describe('DetailPanel', () => {
  beforeEach(() => {
    useFlightStore.setState({
      planes: [],
      selectedPlaneId: null,
      detailedPlane: null,
      connectionStatus: { basic: 'disconnected', details: 'disconnected' },
      errorMessage: null,
    })
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

  describe('slide-in/slide-out animation', () => {
    it('should be positioned off-screen when no plane is selected', () => {
      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveClass('translate-x-full')
    })

    it('should slide in when a plane is selected', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveClass('translate-x-0')
    })

    it('should have transition classes for animation', () => {
      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveClass(
        'transition-transform',
        'duration-300',
        'ease-in-out'
      )
    })
  })

  describe('loading skeleton', () => {
    it('should show skeleton when selectedPlaneId is set but detailedPlane is null', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      // Should have skeleton elements (animate-pulse divs)
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should not show skeleton when detailedPlane is available', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      // Should show unique values from detailedPlane
      expect(screen.getByText('Boeing 737-800')).toBeInTheDocument()
      expect(screen.getByText('N12345')).toBeInTheDocument()
      // Skeleton elements should not be present when data is available
      const skeletonBlocks = document.querySelectorAll('.animate-pulse')
      // The header has a single skeleton that gets replaced, but content skeletons should be gone
      expect(skeletonBlocks.length).toBeLessThan(3)
    })
  })

  describe('field rendering', () => {
    it('should render flight information section', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Flight Information')).toBeInTheDocument()
      // Check for unique values in flight info section
      expect(screen.getByText('Boeing 737-800')).toBeInTheDocument()
      expect(screen.getByText('N12345')).toBeInTheDocument()
      // Flight Number label should be in the details section
      expect(screen.getByText('Flight Number')).toBeInTheDocument()
      // Airline label should be in the details section
      expect(screen.getByText('Airline')).toBeInTheDocument()
    })

    it('should render route with origin and destination', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Route')).toBeInTheDocument()
      expect(screen.getByText('JFK')).toBeInTheDocument()
      expect(screen.getByText('New York')).toBeInTheDocument()
      expect(screen.getByText('LAX')).toBeInTheDocument()
      expect(screen.getByText('Los Angeles')).toBeInTheDocument()
    })

    it('should render position section with formatted values', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Position')).toBeInTheDocument()
      expect(screen.getByText('Coordinates')).toBeInTheDocument()
      expect(screen.getByText('Altitude')).toBeInTheDocument()
      expect(screen.getByText('Speed')).toBeInTheDocument()
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Vertical Speed')).toBeInTheDocument()
    })

    it('should render flight time section', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Flight Time')).toBeInTheDocument()
      expect(screen.getByText('Duration')).toBeInTheDocument()
      expect(screen.getByText('Estimated Arrival')).toBeInTheDocument()
    })

    it('should render passengers section with progress bar', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Passengers')).toBeInTheDocument()
      expect(screen.getByText('Onboard')).toBeInTheDocument()
    })

    it('should render status with capitalized first letter', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByText('Enroute')).toBeInTheDocument()
    })
  })

  describe('close button', () => {
    it('should call deselectPlane when close button is clicked', async () => {
      const user = userEvent.setup()
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      const closeButton = screen.getByLabelText('Close detail panel')
      await user.click(closeButton)

      expect(useFlightStore.getState().selectedPlaneId).toBeNull()
      expect(useFlightStore.getState().detailedPlane).toBeNull()
    })

    it('should have a close button with correct aria-label', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      expect(screen.getByLabelText('Close detail panel')).toBeInTheDocument()
    })
  })

  describe('header', () => {
    it('should show flight number and airline in header when data is available', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      // Flight number appears in header (h2) and in details - use role to distinguish
      const headings = screen.getAllByRole('heading')
      const flightNumberHeading = headings.find(
        (h) => h.textContent === 'TA123'
      )
      expect(flightNumberHeading).toBeInTheDocument()
      expect(
        screen.getAllByText('Test Airlines').length
      ).toBeGreaterThanOrEqual(1)
    })

    it('should show color bar matching plane color', () => {
      useFlightStore.setState({
        selectedPlaneId: 'plane-1',
        detailedPlane: mockPlane,
      })

      render(<DetailPanel />)

      const colorBar = document.querySelector(
        '[style*="background-color"]'
      ) as HTMLElement
      expect(colorBar).toBeInTheDocument()
      expect(colorBar.style.backgroundColor).toBe('rgb(59, 130, 246)')
    })

    it('should show skeleton header when detailedPlane is null', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      // Should have animate-pulse for header skeleton
      const headerSkeleton = document.querySelector(
        '.animate-pulse'
      ) as HTMLElement
      expect(headerSkeleton).toBeInTheDocument()
    })
  })

  describe('panel visibility', () => {
    it('should have aria-hidden true when closed', () => {
      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveAttribute('aria-hidden', 'true')
    })

    it('should have aria-hidden false when open', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveAttribute('aria-hidden', 'false')
    })

    it('should have fixed positioning with correct width', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      const panel = screen
        .getByLabelText('Close detail panel')
        .closest('div[class*="fixed"]') as HTMLElement
      expect(panel).toHaveClass(
        'fixed',
        'right-0',
        'top-0',
        'h-full',
        'w-full',
        'sm:w-[350px]'
      )
    })
  })

  describe('scrollable content', () => {
    it('should have scrollable content area', () => {
      useFlightStore.setState({ selectedPlaneId: 'plane-1' })

      render(<DetailPanel />)

      const contentArea = document.querySelector(
        '.overflow-y-auto'
      ) as HTMLElement
      expect(contentArea).toBeInTheDocument()
    })
  })
})
