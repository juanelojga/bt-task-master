import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DetailSection } from '../DetailSection.tsx'

describe('DetailSection', () => {
  describe('title rendering', () => {
    it('should render the title as a heading', () => {
      render(
        <DetailSection title="Flight Information">
          <p>Content</p>
        </DetailSection>
      )

      expect(
        screen.getByRole('heading', { name: 'Flight Information' })
      ).toBeInTheDocument()
    })

    it('should render title with uppercase, tracking-wide, and muted styles', () => {
      render(
        <DetailSection title="Flight Information">
          <p>Content</p>
        </DetailSection>
      )

      const title = screen.getByText('Flight Information')
      expect(title).toHaveClass('uppercase', 'tracking-wide', 'text-slate-400')
    })

    it('should render title as h3 element', () => {
      render(
        <DetailSection title="Flight Information">
          <p>Content</p>
        </DetailSection>
      )

      const title = screen.getByText('Flight Information')
      expect(title.tagName).toBe('H3')
    })

    it('should render different titles correctly', () => {
      const { rerender } = render(
        <DetailSection title="Route">
          <p>Content</p>
        </DetailSection>
      )

      expect(screen.getByText('Route')).toBeInTheDocument()

      rerender(
        <DetailSection title="Position">
          <p>Content</p>
        </DetailSection>
      )

      expect(screen.getByText('Position')).toBeInTheDocument()
    })
  })

  describe('children rendering', () => {
    it('should render a single child', () => {
      render(
        <DetailSection title="Section">
          <p>Hello world</p>
        </DetailSection>
      )

      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <DetailSection title="Section">
          <span>Child 1</span>
          <span>Child 2</span>
          <span>Child 3</span>
        </DetailSection>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('should render nested components', () => {
      render(
        <DetailSection title="Section">
          <div>
            <button type="button">Click me</button>
          </div>
        </DetailSection>
      )

      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument()
    })

    it('should render children after the title', () => {
      render(
        <DetailSection title="Section">
          <p data-testid="child">Child content</p>
        </DetailSection>
      )

      const title = screen.getByText('Section')
      const child = title.parentElement?.querySelector('[data-testid="child"]')

      expect(child).toBeInTheDocument()
      // Children should appear after the title in the DOM
      expect(
        title.compareDocumentPosition(child as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })
  })

  describe('styling', () => {
    it('should have a top border separator', () => {
      const { container } = render(
        <DetailSection title="Section">
          <p>Content</p>
        </DetailSection>
      )

      const section = container.firstElementChild as HTMLElement
      expect(section).toHaveClass('border-t', 'border-slate-200')
    })

    it('should have vertical padding', () => {
      const { container } = render(
        <DetailSection title="Section">
          <p>Content</p>
        </DetailSection>
      )

      const section = container.firstElementChild as HTMLElement
      expect(section).toHaveClass('py-3')
    })

    it('should have bottom margin on the title', () => {
      render(
        <DetailSection title="Section">
          <p>Content</p>
        </DetailSection>
      )

      const title = screen.getByText('Section')
      expect(title).toHaveClass('mb-2')
    })

    it('should have small text size on the title', () => {
      render(
        <DetailSection title="Section">
          <p>Content</p>
        </DetailSection>
      )

      const title = screen.getByText('Section')
      expect(title).toHaveClass('text-xs', 'font-semibold')
    })
  })

  describe('empty states', () => {
    it('should render with no children', () => {
      render(<DetailSection title="Empty Section" />)

      expect(screen.getByText('Empty Section')).toBeInTheDocument()
    })

    it('should render with an empty string title', () => {
      render(
        <DetailSection title="">
          <p>Content</p>
        </DetailSection>
      )

      // Title still renders as h3 but empty
      const headings = screen.getAllByRole('heading')
      const emptyHeading = headings.find((h) => h.textContent === '')
      expect(emptyHeading).toBeInTheDocument()
    })
  })
})
