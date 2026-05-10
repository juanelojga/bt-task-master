import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createMarkerElement, updateMarkerHeading } from '../marker.ts'

describe('createMarkerElement', () => {
  let originalCreateElement: typeof document.createElement

  beforeEach(() => {
    originalCreateElement = document.createElement.bind(document)
  })

  afterEach(() => {
    document.createElement = originalCreateElement
  })

  it('should return an HTMLDivElement', () => {
    const el = createMarkerElement('#ff0000', 45)
    expect(el).toBeInstanceOf(HTMLDivElement)
  })

  it('should set the plane-marker class', () => {
    const el = createMarkerElement('#ff0000', 45)
    expect(el.className).toBe('plane-marker')
  })

  it('should set width and height to 24px', () => {
    const el = createMarkerElement('#ff0000', 45)
    expect(el.style.width).toBe('24px')
    expect(el.style.height).toBe('24px')
  })

  it('should set pointer-events to none', () => {
    const el = createMarkerElement('#ff0000', 45)
    expect(el.style.pointerEvents).toBe('none')
  })

  it('should set transform-origin to center', () => {
    const el = createMarkerElement('#ff0000', 45)
    expect(el.style.transformOrigin).toBe('center')
  })

  it('should apply heading rotation to the container', () => {
    const el = createMarkerElement('#ff0000', 90)
    expect(el.style.transform).toBe('rotate(90deg)')
  })

  it('should include the provided color in the SVG fill', () => {
    const el = createMarkerElement('#00ff00', 0)
    expect(el.innerHTML).toContain('fill="#00ff00"')
  })

  it('should contain an SVG element', () => {
    const el = createMarkerElement('#ff0000', 0)
    const svg = el.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('width')).toBe('24')
    expect(svg!.getAttribute('height')).toBe('24')
  })

  it('should handle zero heading', () => {
    const el = createMarkerElement('#ff0000', 0)
    expect(el.style.transform).toBe('rotate(0deg)')
  })

  it('should handle negative heading', () => {
    const el = createMarkerElement('#ff0000', -45)
    expect(el.style.transform).toBe('rotate(-45deg)')
  })
})

describe('updateMarkerHeading', () => {
  it('should update the SVG transform with the new heading', () => {
    const el = document.createElement('div')
    el.innerHTML = '<svg></svg>'

    updateMarkerHeading(el, 180)

    const svg = el.querySelector('svg')
    expect(svg!.style.transform).toBe('rotate(180deg)')
  })

  it('should be a no-op when no SVG child exists', () => {
    const el = document.createElement('div')

    expect(() => updateMarkerHeading(el, 45)).not.toThrow()
  })

  it('should override previous heading', () => {
    const el = document.createElement('div')
    el.innerHTML = '<svg></svg>'

    updateMarkerHeading(el, 90)
    expect(el.querySelector('svg')!.style.transform).toBe('rotate(90deg)')

    updateMarkerHeading(el, 270)
    expect(el.querySelector('svg')!.style.transform).toBe('rotate(270deg)')
  })
})
