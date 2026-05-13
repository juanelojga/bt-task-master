## Why

The core flight radar functionality works, but the UI feels unpolished: the detail panel lacks smooth entry/exit transitions and responsive behavior, there are no loading indicators for map initialization or data fetching, and the mobile layout (below 768px) is not properly handled. These gaps undermine usability and the overall user experience, making the app feel incomplete despite functional correctness.

## What Changes

- Add smooth slide-in/slide-out animation for the detail panel with proper transition timing
- Implement responsive layout: detail panel becomes a bottom sheet on screens < 768px instead of a right-side overlay
- Add a loading overlay/skeleton state while the map initializes (before `mapLoaded` is true)
- Add loading skeleton for detail panel content while waiting for detailed plane data
- Ensure the connection banner and notice toast animate in/out smoothly rather than appearing/disappearing instantly
- Verify and refine cursor feedback on map hover (pointer on markers, default elsewhere)
- Add subtle visual polish: panel shadow, backdrop overlay when panel is open, consistent spacing

## Capabilities

### New Capabilities
- `loading-states`: Loading indicators for map initialization and detail panel data fetching, including skeleton components
- `responsive-layout`: Responsive behavior for detail panel (right-side panel on desktop, bottom sheet on mobile < 768px) and overall layout adaptability
- `panel-animations`: Smooth slide-in/slide-out transitions for detail panel with backdrop overlay

### Modified Capabilities
- `detail-panel-ui`: Add backdrop overlay when panel is open, refine spacing and visual styling for polish

## Impact

- **Components**: `DetailPanel`, `MapView`, `ConnectionBanner`, `NoticeToast` — visual and structural changes
- **CSS**: `index.css` — new animation keyframes, responsive breakpoints, transition classes
- **New files**: Possible new components for loading overlay and backdrop
- **No API or dependency changes** — purely frontend UI/UX polish
- **Tests**: Component tests need updating for new responsive behavior and animation states
