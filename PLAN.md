# Implementation plan

## 1. Project Structure (inside `fe/`)

```
fe/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                     // entry point
│   ├── App.tsx
│   ├── config.ts                    // WS URLs, intervals, etc.
│   ├── types.ts                     // PlaneBasic, PlaneDetailed, WS messages
│   ├── services/
│   │   ├── websocketService.ts      // WS connection manager (reconnect, dispatch)
│   │   └── useWebSocket.ts          // custom hook for consuming messages
│   ├── store/
│   │   └── useFlightStore.ts        // Zustand (or Context) - global state
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.tsx          // MapLibre map container
│   │   │   ├── PlaneMarkers.tsx     // updates markers on map
│   │   │   └── SelectedMarker.tsx   // highlighting / rotation for selected plane
│   │   ├── DetailPanel/
│   │   │   ├── DetailPanel.tsx      // slide-in panel
│   │   │   └── PlaneInfo.tsx        // full details display
│   │   └── common/
│   │       ├── ErrorToast.tsx       // connection / subscription errors
│   │       └── LoadingOverlay.tsx
│   └── utils/
│       └── mapHelpers.ts           // creating GeoJSON source, layer defs
```

---

## 2. Technology & Library Choices

| Concern          | Choice                                      | Reason                                                                                     |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Map engine       | `maplibre-gl`                               | Free vector tiles, high performance, no API key required.                                  |
| React wrapper    | manual integration (no `react-map-gl`)      | Full control, no extra abstraction; MapLibre’s imperative API is simple.                   |
| State management | **Zustand**                                 | Lightweight, works outside React, easy to subscribe to partial state (prevents re‑renders) |
| WebSocket        | native `WebSocket` with custom hooks        | Full control over reconnection and subscriptions.                                          |
| Styling          | Tailwind CSS or plain CSS modules           | Quick and responsive, minimal setup.                                                       |
| Tile source      | `https://demotiles.maplibre.org/style.json` | Free, no API key (raster tiles). Alternatively OpenStreetMap raster tiles via custom style |

---

## 3. State Management (Zustand Store)

**`useFlightStore`** contains:

- `planes: PlaneBasic[]` – all aircraft from basic WS.
- `selectedPlaneId: string | null`
- `detailedPlane: PlaneDetailed | null` – data for the subscribed plane.
- `connectionStatus: { basic: 'connected' | 'connecting' | 'disconnected', details: ... }`
- `errorMessage: string | null`
- Actions:
  - `updatePlanes(data: PlaneBasic[])`
  - `selectPlane(id: string)`
  - `deselectPlane()`
  - `setDetailedPlane(data: PlaneDetailed)`
  - `setConnectionStatus(conn: string, status: ...)`
  - `setError(msg: string)`
  - `clearError()`

The store is the single source of truth: map reads `planes` and `selectedPlaneId`; detail panel reads `detailedPlane`. No prop drilling.

---

## 4. WebSocket Integration Plan

### 4.1 Two Separate Connections

- **Basic** endpoint: `ws://localhost:4000/ws/planes/basic`
- **Details** endpoint: `ws://localhost:4000/ws/planes/details`

The details connection is opened **only** when a plane is selected, and closed when deselected.

### 4.2 Message Handling (inside `useWebSocket` hook)

- On **basic** message `{ type: "planes", data: PlaneBasic[] }` → `store.updatePlanes(data)`.
- On **details** message `{ type: "plane-details", data: PlaneDetailed }` → if `store.selectedPlaneId` equals `data.id`, call `store.setDetailedPlane(data)`; else ignore.
- On **error** `{ type: "error", message }`: show toast, if it’s due to invalid subscription (plane ID not found) the backend will close with code 1008 – we must handle that gracefully.

### 4.3 Subscription Lifecycle

- When user **selects** a plane:
  1. Open details WS if not open (or reconnect if previously closed).
  2. Once open, send `{ "type": "subscribe", "planeId": id }`.
  3. The store sets `selectedPlaneId = id`.
- When user **deselects**:
  1. Close the details WebSocket (to stop receiving updates).
  2. Clear `selectedPlaneId` and `detailedPlane`.
- When user **switches** to another plane:
  1. Just send a new `subscribe` on the existing details WS (the backend allows switching subscriptions).
  2. Update `selectedPlaneId` and clear previous detailed data until new data arrives.

### 4.4 Reconnection & Resilience

- Basic WS: always reconnect with exponential backoff (1s, 2s, 4s… max 30s). On disconnect, keep last known `planes` displayed.
- Details WS: if closed unexpectedly (e.g., invalid subscription), **do not reconnect automatically** (the error is user‑triggered). Show an error toast and deselect the plane, falling back to basic view. If details WS fails due to network, attempt reconnection while the plane is still selected.

---

## 5. Map Integration with MapLibre

### 5.1 Map Setup

- Use `MapLibre GL JS` imperative API in a `MapView` component.
- On component mount, create map with:
  ```typescript
  const map = new maplibregl.Map({
    container: "map",
    style: "https://demotiles.maplibre.org/style.json", // or custom OSM raster style
    center: [0, 20],
    zoom: 2,
  });
  ```
- Add a geoJSON source for planes:
  ```typescript
  map.addSource("planes", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  ```
- Add a symbol layer that renders circles with colour from a data‑driven property.
  - Use `type: 'circle'` for markers, set `circle-color` to `['get', 'color']`.
  - Optionally add a `text-field` for flight number / ID when selected.

### 5.2 Efficient Marker Updates

- On every store `planes` change, build a new GeoJSON `FeatureCollection`:
  ```typescript
  features = planes.map((p) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
    properties: { id: p.id, color: p.color, altitude: p.altitude },
  }));
  ```
- Update the source data with `map.getSource('planes').setData(geojson)`.
- MapLibre renders only the changed geometries efficiently; 20 points at 1 Hz is trivial.

### 5.3 Selected Plane Highlight

- When `selectedPlaneId` changes, we update a separate `selected-plane` layer (or filter) to highlight it (ring around marker, larger size).
- Rotation (heading) can only be applied if using a **symbol layer with icon**; with circles it’s not native. Alternative: use a custom HTML marker for the selected plane that can be rotated via CSS. Since the PRD asks for rotated markers _if heading available_, a pragmatic solution:
  - Represent selected plane with a div‑icon via `maplibregl.Marker` (HTML element), rotate it using CSS `transform: rotate(...)`. This marker is updated every time detailed data arrives. All other planes remain as circle layer features.
  - Non‑selected planes remain as circles (no rotation needed). This hybrid approach keeps performance (20 markers) and gives rotation for the selected plane.

### 5.4 Click Interaction

- Add a click listener on the `planes` layer:
  ```typescript
  map.on("click", "planes", (e) => {
    const id = e.features[0].properties.id;
    store.selectPlane(id);
  });
  ```
- Change cursor to pointer on hover.

---

## 6. Detail Panel

- Slide in from right on selection, slide out on deselection. Use a simple CSS transition (`transform: translateX(0)` / `translateX(100%)`).
- Panel reads `detailedPlane` from store. Show loading skeleton while `detailedPlane` is null but `selectedPlaneId` is set.
- Display all fields as per PRD, with origin → destination arrow.
- Update automatically because the store updates on each `plane-details` message.
- Close button calls `store.deselectPlane()`.

---

## 7. Error Handling & Edge Cases

| Scenario                                | Handling                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| Invalid subscribe (backend closes 1008) | Details WS `onclose` with code 1008: show toast “Plane not found”, deselect.           |
| Backend sends error message             | Show non‑blocking toast for user; do not change selection unless connection closes.    |
| Basic WS disconnects                    | Show “reconnecting…” indicator; continue displaying last known positions.              |
| Details WS disconnects (network)        | Attempt reconnection with backoff while selected; if fails after N attempts, deselect. |
| Detailed data arrives after deselection | Ignored (checked against `selectedPlaneId`).                                           |
| Plane disappears from basic list        | If it was selected, automatically deselect and show note “Plane no longer available”.  |

---

## 8. Responsiveness & Styling

- The map takes full viewport height/width.
- Detail panel: 350px wide on desktop; on screen <768px it becomes a bottom sheet (full width, 50% height). Use media queries / conditional rendering.
- Error toasts fixed at top‑right.
- Use Tailwind for quick responsive layout: `h-screen w-screen relative`, map absolute, panel absolute `right-0 top-0 h-full w-[350px]`.

---

## 9. Implementation Steps (Ordered)

1. **Scaffold project** with Vite, TypeScript, install `maplibre-gl`, `zustand`.
2. **Define types** in `types.ts` (PlaneBasic, PlaneDetailed, WS message types).
3. **Implement store** with Zustand: basic state plus actions.
4. **Build WebSocket service**:
   - Hook `useBasicWebSocket` that connects to basic endpoint, parses messages, updates store.
   - Hook `useDetailWebSocket` that opens on demand, sends subscribe, handles responses.
5. **Create MapView component** with MapLibre instance.
6. **Add plane markers layer**:
   - GeoJSON source + circle layer.
   - Subscribe to store `planes` and call `setData`.
7. **Implement selection logic**:
   - Map click handler dispatches `selectPlane`.
   - `selectPlane` action triggers the details WS connection.
   - Deselection triggered via close button, double‑click, or outside click.
8. **Build DetailPanel** that reads `detailedPlane` and renders sections.
9. **Handle errors**: toast component, reconnect logic, edge cases (disappearing plane, invalid subscribe).
10. **Polish**: loading indicators, smooth panel animations, responsive design.
11. **Test** with backend: verify all 20 planes move, selection works, switching and error handling behave correctly.

---

## 10. Additional Notes

- **MapLibre style**: The free demo tiles are raster; if you prefer vector tiles, you can use ORS‑free tiles or a self‑hosted OSM vector tile server, but the demo style is simplest to start with.
- **Performance**: Using a GeoJSON source for 20 markers and updating via `setData` is extremely performant; it easily stays within 16ms.
- **Auto‑reconnect**: Implement a small class or hook that wraps `WebSocket`, listens to `onclose` and schedules reconnection with backoff. Keep it generic so it works for both basic and details sockets.

---
