import { describe, it, expect } from 'vitest'
import {
  planesToFeatureCollection,
  createSelectedFeature,
  createEmptyFeatureCollection,
} from '../geojson.ts'
import type { PlaneBasic } from '../../../../types/domain.ts'
import type { Point } from 'geojson'

describe('planesToFeatureCollection', () => {
  it('should convert empty planes array to empty FeatureCollection', () => {
    const result = planesToFeatureCollection([])

    expect(result.type).toBe('FeatureCollection')
    expect(result.features).toHaveLength(0)
  })

  it('should convert single plane to FeatureCollection with one feature', () => {
    const planes: PlaneBasic[] = [
      {
        id: 'plane-1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
    ]

    const result = planesToFeatureCollection(planes)

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toMatchObject({
      type: 'Feature',
      id: 'plane-1',
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128],
      },
      properties: {
        id: 'plane-1',
        color: '#ff0000',
        altitude: 10000,
      },
    })
  })

  it('should convert multiple planes to FeatureCollection with multiple features', () => {
    const planes: PlaneBasic[] = [
      {
        id: 'plane-1',
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 10000,
        color: '#ff0000',
      },
      {
        id: 'plane-2',
        latitude: 51.5074,
        longitude: -0.1278,
        altitude: 15000,
        color: '#00ff00',
      },
    ]

    const result = planesToFeatureCollection(planes)

    expect(result.features).toHaveLength(2)
    expect(result.features[0].id).toBe('plane-1')
    expect(result.features[1].id).toBe('plane-2')
  })

  it('should use plane id as feature id for stable rendering', () => {
    const planes: PlaneBasic[] = [
      {
        id: 'abc-123-xyz',
        latitude: 0,
        longitude: 0,
        altitude: 5000,
        color: '#0000ff',
      },
    ]

    const result = planesToFeatureCollection(planes)

    expect(result.features[0].id).toBe('abc-123-xyz')
  })

  it('should set coordinates as [longitude, latitude]', () => {
    const planes: PlaneBasic[] = [
      {
        id: 'plane-1',
        latitude: 35.6762,
        longitude: 139.6503,
        altitude: 20000,
        color: '#ffff00',
      },
    ]

    const result = planesToFeatureCollection(planes)
    const geometry = result.features[0].geometry as Point

    expect(geometry.coordinates).toEqual([139.6503, 35.6762])
  })
})

describe('createSelectedFeature', () => {
  it('should create FeatureCollection for a single plane', () => {
    const plane: PlaneBasic = {
      id: 'selected-plane',
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10000,
      color: '#ff0000',
    }

    const result = createSelectedFeature(plane)

    expect(result.type).toBe('FeatureCollection')
    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toMatchObject({
      type: 'Feature',
      id: 'selected-plane',
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128],
      },
      properties: {
        id: 'selected-plane',
        color: '#ff0000',
        altitude: 10000,
      },
    })
  })

  it('should use plane id as feature id', () => {
    const plane: PlaneBasic = {
      id: 'special-id',
      latitude: 0,
      longitude: 0,
      altitude: 0,
      color: '#ffffff',
    }

    const result = createSelectedFeature(plane)

    expect(result.features[0].id).toBe('special-id')
  })
})

describe('createEmptyFeatureCollection', () => {
  it('should return empty FeatureCollection', () => {
    const result = createEmptyFeatureCollection()

    expect(result.type).toBe('FeatureCollection')
    expect(result.features).toHaveLength(0)
    expect(result.features).toEqual([])
  })

  it('should return new empty array on each call', () => {
    const result1 = createEmptyFeatureCollection()
    const result2 = createEmptyFeatureCollection()

    expect(result1.features).not.toBe(result2.features)
    expect(result1.features).toEqual(result2.features)
  })
})
