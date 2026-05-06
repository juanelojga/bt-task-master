# Product Requirements Document (PRD)

**Flight Radar – Real‑Time Plane Tracking Frontend**

---

## 1. Introduction

### 1.1 Purpose

This document defines the requirements for a web‑based flight radar application. The application will display live aircraft positions on an interactive map and allow users to inspect detailed flight information by selecting individual planes. The frontend consumes data exclusively from a provided WebSocket backend.

### 1.2 Scope

The scope includes:

- Building a single‑page React application with TypeScript.
- Real‑time rendering of simulated aircraft on a map.
- Selection / deselection of planes to view detailed flight data.
- Handling of WebSocket subscriptions and error states.

Out of scope: user authentication, historical data, flight search, or any server‑side logic beyond the existing backend.

### 1.3 Definitions

| Term              | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| **Basic Data**    | Position and altitude of all planes, sent periodically via WS. |
| **Detailed Data** | Full flight information for one subscribed plane.              |
| **WS**            | WebSocket connection to the provided backend.                  |

---

## 2. Product Overview

### 2.1 Vision

Deliver a lightweight, responsive flight radar that visualises live aircraft movements and provides an intuitive way to explore detailed flight details with a single click.

### 2.2 Target Audience

- Flight enthusiasts wanting to observe simulated air traffic.
- Technical interviewers evaluating the candidate’s frontend development skills.

### 2.3 Key Features

1. **Interactive Map** – displays aircraft as coloured markers, updated live.
2. **Real‑Time Updates** – all plane positions refresh every second.
3. **Plane Selection** – clicking a marker reveals detailed flight data in a side panel.
4. **Detailed Info Panel** – shows aircraft model, airline, flight number, route, speed, altitude, status, etc.
5. **Robust Error Handling** – gracefully manages WebSocket disconnections, invalid subscriptions, and bad data.

---

## 3. User Stories

| ID   | As a… | I want to…                                                                                  | So that…                                             |
| ---- | ----- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| US-1 | User  | see all planes moving on a map in real time                                                 | I can track their positions                          |
| US-2 | User  | click on a plane marker                                                                     | that plane is selected and its details are displayed |
| US-3 | User  | see detailed information (speed, heading, route, passengers, status) for the selected plane | I can analyse the flight                             |
| US-4 | User  | click another plane or deselect the current one                                             | I can switch focus or clear the detail view          |
| US-5 | User  | be informed if there is a connection or data error                                          | I understand what went wrong and can retry           |

---

## 4. Functional Requirements

### 4.1 Map & Aircraft Display

- **FR‑1**: The map must be rendered using a provider such as MapLibre, Mapbox, or Leaflet.
- **FR‑2**: Aircraft positions must be plotted as markers on the map.
- **FR‑3**: Each marker colour must correspond to the `color` field received from the backend.
- **FR‑4**: Markers must update their position every time a basic data message is received (every `BASIC_UPDATE_INTERVAL_MS`, default 1000 ms).

### 4.2 Real‑Time Data Consumption

- **FR‑5**: On application load, a WebSocket connection must be established to `ws://localhost:4000/ws/planes/basic`.
- **FR‑6**: The application must listen to messages of type `"planes"` and update the aircraft list accordingly.
- **FR‑7**: Initial plane data must be rendered immediately upon connection (the server sends it straight away).

### 4.3 Plane Selection & Detailed View

- **FR‑8**: Clicking/tapping a plane marker selects that plane.
- **FR‑9**: Upon selection, a `subscribe` message must be sent to `/ws/planes/details` (or the same WebSocket, depending on backend setup – the backend handles subscription on the same WS as described). The payload: `{ "type": "subscribe", "planeId": "<selected plane id>" }`.
- **FR‑10**: Once subscribed, the application must display detailed plane information in a distinct UI panel (side panel, overlay, or modal).
- **FR‑11**: The detailed panel must show all fields returned by the `plane-details` message: model, airline, flight number, registration, position, speed, heading, vertical speed, origin/destination, flight duration, estimated arrival, passengers, status.
- **FR‑12**: Clicking the already selected plane again or clicking a “close” button must deselect it. Deselection stops the detailed subscription (by sending a new `subscribe` with a different ID or by disconnecting the detail socket, whichever the backend requires; per the spec, switching plane sends a new subscribe, so deselection could be handled by the client stopping to listen or sending an unsubscribe – the backend doesn't mention an explicit unsubscribe, so we may switch to a dummy “none” subscription or simply ignore future details. The safest is to send a subscribe to a non‑existent plane which would error and close; better: design client-side to simply discard detail updates when no plane is selected. Or we can use a separate WS for details that gets closed on deselect. The backend expects a single subscription; the PRD can note that deselect will close the details WS or switch to a placeholder. We'll state that the detail view is closed and further detail updates are ignored.)
- **FR‑13**: Selecting a different plane while one is already selected must cancel the previous subscription and start a new one.

### 4.4 Error & Edge Cases

- **FR‑14**: If a `subscribe` message is sent with an invalid plane ID, the backend closes the connection with code 1008. The application must detect this closure, notify the user (e.g. a toast or inline message), and automatically revert to the last valid state (no plane selected) without crashing.
- **FR‑15**: General WebSocket errors (disconnection, network loss) must be handled gracefully: display a non‑blocking error indicator and attempt reconnection (optional, but recommended).
- **FR‑16**: If a `plane-details` message arrives but no plane is selected, the data must be ignored.
- **FR‑17**: If basic data for a previously selected plane is no longer received (plane removed from simulation), the detail panel should close automatically and show a note “Plane no longer available”.

---

## 5. Non‑Functional Requirements

### 5.1 Performance

- **NFR‑1**: Map updates must process and render 20 plane markers within 16 ms to maintain 60 fps (can be achieved with efficient state updates and marker reuse).
- **NFR‑2**: The application must handle WebSocket message bursts without degrading UI responsiveness.

### 5.2 Usability

- **NFR‑3**: The UI must be intuitive: a full‑screen map as the primary element, with a minimal overlay for the info panel.
- **NFR‑4**: The application must be responsive and work on desktop and tablet screens (minimum width 768px).

### 5.3 Reliability

- **NFR‑5**: The frontend should recover from temporary WebSocket disconnections without requiring a manual page refresh (auto‑reconnect with exponential backoff is desirable).
- **NFR‑6**: The map must continue displaying the last known positions if the connection drops temporarily.

### 5.4 Compatibility

- **NFR‑7**: The application must run in the latest versions of Chrome, Firefox, and Edge.
- **NFR‑8**: All third‑party map tile services must be HTTPS and require no API key, or a free public key may be used (e.g., MapLibre free tiles).

---

## 6. UI/UX Design Specifications

### 6.1 Layout

- Full‑screen map canvas occupies 100% width and height.
- A collapsible side panel (right‑side, 350px wide) appears upon plane selection, overlaying the map. On mobile (<768px) the panel pushes the map or becomes a bottom sheet.
- Minimal header or no header; map is the focus.

### 6.2 Map Markers

- Aircraft are represented as coloured circles (16–20px diameter) with the colour taken from the data.
- Markers rotate if heading data is available (basic data does not include heading, but when selected we have heading; we could still rotate the marker for the selected plane using detailed heading).
- On hover, marker scales up slightly and shows a tooltip with flight number (once detailed info is loaded) or plane ID.

### 6.3 Detail Panel

- Header: flight number and airline, colour bar matching plane colour.
- Sections:
  - **Flight Info**: model, registration, airline.
  - **Position**: latitude, longitude, altitude, speed, heading, vertical speed, status.
  - **Route**: origin (airport + city) → destination (airport + city).
  - **Schedule**: flight duration, estimated arrival.
  - **Passengers**: passengers / max capacity.
- A close button (X) at top‑right to deselect.
- Information updates in real time as new `plane-details` arrive.

### 6.4 Interactions

- Click marker → select plane, panel slides in, map pans (optional) to keep marker visible.
- Click marker again, or click outside the panel, or press close → deselect, panel slides out.
- While one plane is selected, other markers remain clickable for switch.

---

## 7. Technical Requirements

### 7.1 Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Map Engine**: MapLibre GL JS (free, no API key) or Leaflet with OpenStreetMap tiles
- **State Management**: React Context or Zustand (lightweight)
- **WebSocket**: native WebSocket API or a small wrapper like `react-use-websocket`
- **Build Tool**: Vite or Create React App (Vite recommended)

### 7.2 Architecture Overview

```
[WebSocket Server]
      |
[WebSocket Service] -- manages connections, dispatches messages
      |
[Global State] -- stores list of planes (basic) and selected plane details
      |
[Map Component] -- renders markers from state
      |
[Detail Panel] -- displays selected plane details
```

### 7.3 Data Flow

1. App initialises, connects to basic WS.
2. Receives `planes` messages → store in state (array of `PlaneBasic`).
3. Map component reads state, creates/updates markers.
4. User clicks marker → action dispatches selected plane ID; subscribe message sent to details WS.
5. Details WS returns `plane-details` → store in `selectedPlane` state.
6. Detail panel maps state to UI.
7. Deselect clears selected ID, ignores further details.

---

## 8. Assumptions and Constraints

- The backend provides two separate WebSocket endpoints as per documentation; the frontend will connect to both (basic on `/ws/planes/basic`, details on `/ws/planes/details`).
- The backend does not support an explicit “unsubscribe” command; the frontend will handle deselection by ignoring subsequent `plane-details` or closing the details WebSocket (and optionally sending a dummy subscribe to a non‑existent plane to stop updates – but this may trigger an error; better to close the details connection on deselect and re‑open on new selection).
- The map library tile set will be free and not require billing (e.g., OpenStreetMap via MapLibre or Leaflet).
- The application is for demonstration/interview purposes; production‑grade scalability is not required.

---

## 9. Out of Scope

- User accounts, login, or personalisation.
- Filtering planes by airline, altitude, etc.
- Playback of historical data.
- Multi‑language support.
- Offline functionality.
- Backend modifications or enhancements.

---

## 10. Success Metrics / Acceptance Criteria

1. All 20 planes appear on the map and move smoothly every second.
2. Clicking a plane marker shows the detail panel with correct, live‑updating information.
3. Switching from one plane to another immediately updates the panel content.
4. Closing the panel removes the detail view and does not leave any orphan subscriptions.
5. An error toast appears when invalid subscribe is sent; the application does not crash.
6. The UI remains responsive (no frame drops) during continuous updates.
7. The application runs without external API keys or paid services.

---
