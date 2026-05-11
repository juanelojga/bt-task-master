import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DetailRow } from '../DetailRow.tsx'

describe('DetailRow', () => {
  describe('rendering', () => {
    it('should render the label text', () => {
      render(<DetailRow label="Altitude" value="35,000 ft" />)

      expect(screen.getByText('Altitude')).toBeInTheDocument()
    })

    it('should render the value text', () => {
      render(<DetailRow label="Altitude" value="35,000 ft" />)

      expect(screen.getByText('35,000 ft')).toBeInTheDocument()
    })

    it('should render both label and value in the same row', () => {
      render(<DetailRow label="Altitude" value="35,000 ft" />)

      const label = screen.getByText('Altitude')
      const value = screen.getByText('35,000 ft')

      // Both should be in the same parent flex container
      expect(label.parentElement).toBe(value.parentElement)
    })
  })

  describe('value types', () => {
    it('should render numeric values as strings', () => {
      render(<DetailRow label="Heading" value={270} />)

      expect(screen.getByText('270')).toBeInTheDocument()
    })

    it('should render number zero correctly', () => {
      render(<DetailRow label="Count" value={0} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should render falsy string value "0" correctly', () => {
      render(<DetailRow label="Count" value="0" />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should render as a flex row with justify-between', () => {
      const { container } = render(<DetailRow label="Label" value="Value" />)

      const row = container.firstElementChild as HTMLElement
      expect(row).toHaveClass('flex', 'justify-between')
    })

    it('should apply muted text style to the label', () => {
      render(<DetailRow label="Label" value="Value" />)

      const label = screen.getByText('Label')
      expect(label).toHaveClass('text-slate-500')
    })

    it('should apply medium font weight to the value', () => {
      render(<DetailRow label="Label" value="Value" />)

      const value = screen.getByText('Value')
      expect(value).toHaveClass('font-medium', 'text-slate-700')
    })
  })

  describe('edge cases', () => {
    it('should render empty string value', () => {
      render(<DetailRow label="Notes" value="" />)

      const row = screen.getByText('Notes').parentElement as HTMLElement
      expect(row).toBeInTheDocument()
    })

    it('should render long values without truncation', () => {
      const longValue = 'Very long value that should not be truncated'
      render(<DetailRow label="Info" value={longValue} />)

      expect(screen.getByText(longValue)).toBeInTheDocument()
    })

    it('should render special characters in values', () => {
      render(<DetailRow label="Symbol" value="+1,000 fpm" />)

      expect(screen.getByText('+1,000 fpm')).toBeInTheDocument()
    })
  })
})
