import { describe, it, expect } from 'vitest'
import { calculatePanelPosition, type ProjectFn } from '../panelPosition.ts'
import type { PanelPosition } from '../panelPosition.ts'

/**
 * Creates a mock project function that returns the given screen coordinates.
 * Mirrors the MapLibre `map.project(lngLat)` signature.
 */
function mockProject(x: number, y: number): ProjectFn {
  return () => ({ x, y })
}

const BASE_INPUT = {
  planeLat: 40,
  planeLng: -74,
  viewportWidth: 1280,
  viewportHeight: 800,
  panelWidth: 350,
}

describe('calculatePanelPosition', () => {
  describe('when plane is on the left side of the screen', () => {
    it('should return "right" (enough space on right)', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(200, 400),
      })
      expect(position).toBe<PanelPosition>('right')
    })

    it('should return "right" even when plane is near left edge', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(10, 400),
      })
      expect(position).toBe<PanelPosition>('right')
    })
  })

  describe('when plane is on the right side of the screen', () => {
    it('should return "left" (not enough space on right)', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(1000, 400),
      })
      expect(position).toBe<PanelPosition>('left')
    })

    it('should return "left" when plane is near right edge', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(1270, 400),
      })
      expect(position).toBe<PanelPosition>('left')
    })
  })

  describe('when plane is in the center of the screen', () => {
    it('should prefer "right" when both sides have enough space', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(640, 400),
      })
      expect(position).toBe<PanelPosition>('right')
    })
  })

  describe('when neither side has enough space', () => {
    it('should pick the side with more space to minimize overlap', () => {
      // Plane at x=500, right space = 780, left space = 500 → pick right
      const positionRight = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(500, 400),
      })
      expect(positionRight).toBe<PanelPosition>('right')

      // Plane at x=900, right space = 380, left space = 900 → pick left
      const positionLeft = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(900, 400),
      })
      expect(positionLeft).toBe<PanelPosition>('left')
    })
  })

  describe('when margin is exactly at threshold', () => {
    it('should place panel on right when space equals panel + margin', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(0, 400),
      })
      expect(position).toBe<PanelPosition>('right')
    })

    it('should place panel on left when right space equals panel + margin exactly', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(880, 400),
      })
      expect(position).toBe<PanelPosition>('right')
    })

    it('should fall back to left when right space < required and left space >= required', () => {
      const position = calculatePanelPosition({
        ...BASE_INPUT,
        project: mockProject(881, 400),
      })
      expect(position).toBe<PanelPosition>('left')
    })
  })

  describe('with different viewport sizes', () => {
    it('should work with smaller viewport (tablet)', () => {
      const position = calculatePanelPosition({
        planeLat: 40,
        planeLng: -74,
        viewportWidth: 768,
        viewportHeight: 1024,
        panelWidth: 350,
        project: mockProject(200, 500),
      })
      expect(position).toBe<PanelPosition>('right')
    })

    it('should fall back to left on narrow viewport when plane is on right', () => {
      const position = calculatePanelPosition({
        planeLat: 40,
        planeLng: -74,
        viewportWidth: 768,
        viewportHeight: 1024,
        panelWidth: 350,
        project: mockProject(600, 500),
      })
      expect(position).toBe<PanelPosition>('left')
    })
  })

  describe('project function receives correct coordinates', () => {
    it('should pass lat/lng to the project function', () => {
      let captured: [number, number] | null = null
      const project: ProjectFn = (lngLat: [number, number]) => {
        captured = lngLat
        return { x: 500, y: 400 }
      }

      calculatePanelPosition({
        ...BASE_INPUT,
        project,
      })

      expect(captured).toEqual([-74, 40])
    })
  })
})
