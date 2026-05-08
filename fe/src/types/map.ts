export interface LngLat {
  lng: number
  lat: number
}

export interface MapStyle {
  url: string
}

export interface MapConfig {
  center: LngLat
  zoom: number
  style: MapStyle
}
