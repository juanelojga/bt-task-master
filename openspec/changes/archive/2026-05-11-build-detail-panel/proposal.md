## Why

Users need to inspect detailed flight information for a selected aircraft. Without a detail panel, the map only shows basic plane positions — there is no way to view model, route, speed, altitude, passenger count, or real-time status updates. This is a core interaction in the flight radar experience (US-2, US-3, US-4).

## What Changes

- Add a slide-in DetailPanel component that renders all `PlaneDetailed` fields when a plane is selected
- Display a loading skeleton while detailed data is being fetched after selection
- Include a close button that triggers `deselectPlane()`
- Show a header with flight number, airline, and a color bar matching the plane's color
- Render organized sections: Flight Info, Route (with arrow), Position, Flight Time, Passengers (with progress bar)
- Responsive layout: 350px side panel on desktop, full-width on mobile
- Add format utilities for altitude, speed, heading, vertical speed, duration, arrival time, and passenger count

## Capabilities

### New Capabilities
- `detail-panel-ui`: The visual components that render detailed plane information — includes the panel container with slide animation, header, content sections (FlightInfo, Route, Position, FlightTime, Passengers), reusable layout primitives (DetailSection, DetailRow), skeleton loading state, and formatting utilities.

### Modified Capabilities
<!-- No existing capabilities require requirement changes. The detail panel reads from the existing flight-store and types. -->

## Impact

- **New files**: `fe/src/features/detail/` directory with ~10 component/utility files and co-located tests
- **Dependencies**: Reads `selectedPlaneId`, `detailedPlane`, and `deselectPlane` from the existing flight store; depends on `PlaneDetailed` type from `fe/src/types/domain.ts`
- **Integration**: `DetailPanel` is mounted in `App.tsx` alongside `MapView` and `ErrorToast`
- **No breaking changes** to existing APIs or store shape
