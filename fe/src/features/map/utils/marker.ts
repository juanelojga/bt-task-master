/**
 * Pure DOM utilities for creating and updating heading marker elements.
 */

/**
 * Creates a plane-shaped heading marker element.
 * The element is a rotated div containing an SVG triangle.
 */
export function createMarkerElement(
  color: string,
  heading: number
): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'plane-marker'
  el.innerHTML = [
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
    `<path d="M12 2L4.5 20.29L12 17L19.5 20.29L12 2Z" fill="${color}" stroke="white" stroke-width="2"/>`,
    '</svg>',
  ].join('')
  el.style.width = '24px'
  el.style.height = '24px'
  el.style.transform = `rotate(${heading}deg)`
  el.style.transformOrigin = 'center'
  el.style.pointerEvents = 'none'
  return el
}

/**
 * Updates the heading rotation on an existing marker element's inner SVG.
 */
export function updateMarkerHeading(el: HTMLElement, heading: number): void {
  const svg = el.querySelector('svg')
  if (svg) {
    svg.style.transform = `rotate(${heading}deg)`
  }
}
