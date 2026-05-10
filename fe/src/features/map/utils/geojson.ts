import type { FeatureCollection, Feature, Point } from 'geojson'
import type { PlaneBasic } from '../../../types/domain.ts'

/**
 * Converts PlaneBasic array to GeoJSON FeatureCollection
 */
export function planesToFeatureCollection(
  planes: PlaneBasic[]
): FeatureCollection {
  const features: Feature<Point>[] = planes.map((plane) => ({
    type: 'Feature',
    id: plane.id,
    geometry: {
      type: 'Point',
      coordinates: [plane.longitude, plane.latitude],
    },
    properties: {
      id: plane.id,
      color: plane.color,
      altitude: plane.altitude,
    },
  }))

  return {
    type: 'FeatureCollection',
    features,
  }
}

/**
 * Creates a GeoJSON FeatureCollection for a single selected plane
 */
export function createSelectedFeature(plane: PlaneBasic): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: plane.id,
        geometry: {
          type: 'Point',
          coordinates: [plane.longitude, plane.latitude],
        },
        properties: {
          id: plane.id,
          color: plane.color,
          altitude: plane.altitude,
        },
      },
    ],
  }
}

/**
 * Creates an empty FeatureCollection
 */
export function createEmptyFeatureCollection(): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}
