import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailPanelHeader } from '../DetailPanelHeader.tsx'
import { useFlightStore } from '../../store/hooks/useFlightStore.ts'
import { mockPlane } from './testHelpers.ts'

// Helper to reset store state between tests
function resetStore(): void {
  const store = useFlightStore.getState()
  store.deselectPlane()
  store.clearNotice()
  store.setConnectionStatus('basic', 'disconnected')
  store.setConnectionStatus('details', 'disconnected')
  store.updatePlanes([])
}

describe('DetailPanelHeader', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('with plane data', () => {
    it('should render flight number as a heading', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      const heading = screen.getByRole('heading', { name: 'TA123' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H2')
    })

    it('should render airline name', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      expect(screen.getByText('Test Airlines')).toBeInTheDocument()
    })

    it('should render a color bar matching plane color', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      const colorBar = document.querySelector(
        '[style*="background-color"]'
      ) as HTMLElement
      expect(colorBar).toBeInTheDocument()
      expect(colorBar.style.backgroundColor).toBe('rgb(59, 130, 246)')
    })

    it('should not render a skeleton', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      expect(document.querySelector('.animate-pulse')).toBeNull()
    })
  })

  describe('without plane data', () => {
    it('should render a skeleton placeholder', () => {
      render(<DetailPanelHeader plane={null} onClose={vi.fn()} />)

      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('h-8', 'w-24', 'rounded', 'bg-slate-200')
    })

    it('should not render a heading or airline', () => {
      render(<DetailPanelHeader plane={null} onClose={vi.fn()} />)

      expect(screen.queryByRole('heading')).toBeNull()
      expect(screen.queryByText('Test Airlines')).not.toBeInTheDocument()
    })
  })

  describe('close button', () => {
    it('should render a close button with correct aria-label', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      const closeButton = screen.getByRole('button', {
        name: 'Close detail panel',
      })
      expect(closeButton).toBeInTheDocument()
    })

    it('should call onClose when clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()

      render(<DetailPanelHeader plane={mockPlane} onClose={onClose} />)

      const closeButton = screen.getByRole('button', {
        name: 'Close detail panel',
      })
      await user.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('styling', () => {
    it('should have border-bottom separator', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      const button = screen.getByRole('button', {
        name: 'Close detail panel',
      })
      const header = button.closest('div') as HTMLElement

      expect(header).toHaveClass('border-b', 'border-slate-200')
    })

    it('should have flex layout with space-between alignment', () => {
      render(<DetailPanelHeader plane={mockPlane} onClose={vi.fn()} />)

      const button = screen.getByRole('button', {
        name: 'Close detail panel',
      })
      const header = button.closest('div') as HTMLElement

      expect(header).toHaveClass('flex', 'items-center', 'justify-between')
    })
  })
})
