import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapConnectionIndicator } from '../MapConnectionIndicator.tsx'

describe('MapConnectionIndicator', () => {
  describe('aggregate status logic', () => {
    it('should return null when both are connected', () => {
      const { container } = render(
        <MapConnectionIndicator
          basicStatus="connected"
          detailsStatus="connected"
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should show indicator when basic is disconnected', () => {
      render(
        <MapConnectionIndicator
          basicStatus="disconnected"
          detailsStatus="connected"
        />
      )
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })

    it('should show indicator when details is disconnected', () => {
      render(
        <MapConnectionIndicator
          basicStatus="connected"
          detailsStatus="disconnected"
        />
      )
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })

    it('should show reconnecting when basic is connecting', () => {
      render(
        <MapConnectionIndicator
          basicStatus="connecting"
          detailsStatus="connected"
        />
      )
      expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
    })

    it('should show reconnecting when details is connecting', () => {
      render(
        <MapConnectionIndicator
          basicStatus="connected"
          detailsStatus="connecting"
        />
      )
      expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
    })

    it('should show connection lost when one is disconnected and other is connecting (disconnected wins)', () => {
      render(
        <MapConnectionIndicator
          basicStatus="disconnected"
          detailsStatus="connecting"
        />
      )
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })

    it('should show connection lost when both are disconnected', () => {
      render(
        <MapConnectionIndicator
          basicStatus="disconnected"
          detailsStatus="disconnected"
        />
      )
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })

    it('should show reconnecting when both are connecting', () => {
      render(
        <MapConnectionIndicator
          basicStatus="connecting"
          detailsStatus="connecting"
        />
      )
      expect(screen.getByText('Reconnecting…')).toBeInTheDocument()
    })
  })

  describe('visual styling', () => {
    it('should have animated amber pulse for connecting state', () => {
      render(
        <MapConnectionIndicator
          basicStatus="connecting"
          detailsStatus="connected"
        />
      )

      const indicator = screen.getByText('Reconnecting…').previousElementSibling
      expect(indicator).toHaveClass('animate-pulse')
      expect(indicator).toHaveClass('bg-amber-400')
    })

    it('should have static red indicator for disconnected state', () => {
      render(
        <MapConnectionIndicator
          basicStatus="disconnected"
          detailsStatus="connected"
        />
      )

      const indicator =
        screen.getByText('Connection lost').previousElementSibling
      expect(indicator).not.toHaveClass('animate-pulse')
      expect(indicator).toHaveClass('bg-red-400')
    })

    it('should be positioned absolutely at bottom-right', () => {
      const { container } = render(
        <MapConnectionIndicator
          basicStatus="connecting"
          detailsStatus="connected"
        />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('absolute')
      expect(wrapper).toHaveClass('bottom-4')
      expect(wrapper).toHaveClass('right-4')
      expect(wrapper).toHaveClass('z-40')
    })

    it('should have aria-hidden on the visual indicator dot', () => {
      const { container } = render(
        <MapConnectionIndicator
          basicStatus="connecting"
          detailsStatus="connected"
        />
      )

      const dot = container.querySelector('[aria-hidden="true"]')
      expect(dot).toBeInTheDocument()
      expect(dot).toHaveClass('h-2', 'w-2', 'rounded-full')
    })
  })
})
