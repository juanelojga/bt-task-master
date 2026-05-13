## Context

The Flight Radar app currently has a basic error handling foundation: an `ErrorToast` component, `errorMessage` / `setError` / `clearError` in the Zustand store, and close-code 1008 handling in `useDetailWebSocket`. However, several gaps remain:

- The basic WS connection status (`connecting` / `disconnected`) is stored but never surfaced to the user. If the backend goes down, the map just freezes with no indication.
- When a selected plane disappears from the basic data, the store auto-deselects silently (the `updatePlanes` action sets `selectedPlaneId` to `null` without any user-facing message).
- All errors flow through a single `errorMessage: string | null` field, meaning there's no way to distinguish a critical connection failure from an informational notice (e.g., "Plane no longer available"). The toast always renders with the same red styling.
- The detail panel has no "reconnecting" state — if the details WS drops due to network issues, the user sees stale data with no indication that it's outdated.

The relevant PRD requirements are FR-14 through FR-17 and NFR-5/NFR-6.

## Goals / Non-Goals

**Goals:**
- Surface basic WS connection status visually so users know when the app is reconnecting or disconnected
- Categorize user-facing messages by severity (error / warning / info) so the toast can render context-appropriate styling
- Show an informational notice when a plane disappears and auto-deselects, so the user isn't confused by the panel closing
- Add a reconnecting indicator on the detail panel when the details WS drops mid-subscription

**Non-Goals:**
- Retry buttons or manual reconnect UI — the app auto-reconnects; no user action needed
- Offline mode / service worker caching
- Logging or telemetry for errors
- Changing the WebSocketService reconnection algorithm (already works correctly)

## Decisions

### Decision 1: Expand store notice type from `string | null` to structured object

**Choice**: Replace `errorMessage: string | null` with `notice: { message: string; severity: 'error' | 'warning' | 'info' } | null`.

**Rationale**: A flat string loses severity information. Using a discriminated object lets the toast and other UI render differently per severity (red for errors, amber for warnings, blue for info). This is a minimal change — same shape as before but with an extra field.

**Alternative considered**: Keep `errorMessage` and add a separate `infoMessage` field. Rejected because only one message should be visible at a time and having two fields creates ambiguity about which takes priority.

### Decision 2: Connection banner component overlays the map

**Choice**: Add a `ConnectionBanner` component that renders above the map when `connectionStatus.basic` is `'connecting'` or `'disconnected'`. It shows "Reconnecting…" or "Connection lost" respectively, with a subtle animated indicator.

**Rationale**: The map already fills the viewport. A non-intrusive top banner is the standard pattern for connection status in real-time apps (similar to Gmail's "Connecting…" bar). It doesn't block interaction — users can still pan/zoom the map while reconnecting.

**Alternative considered**: A full-screen overlay. Rejected because it blocks map interaction and the last-known positions are still valid to display (NFR-6).

### Decision 3: Detail panel shows "Reconnecting" label in header

**Choice**: When `connectionStatus.details` is `'connecting'` or `'disconnected'` and `selectedPlaneId` is still set, the `DetailPanelHeader` shows a small "Reconnecting…" badge next to the flight number.

**Rationale**: The detail panel is the only UI context for the selected plane. Adding a badge in the header is unobtrusive and informs the user that data may be stale. Once reconnected, the badge disappears and fresh data flows in.

**Alternative considered**: Disable the entire panel with an overlay. Rejected because the user may still want to read the last-known data.

### Decision 4: Plane disappearance triggers info notice via store action

**Choice**: In the `updatePlanes` store action, when auto-deselecting due to plane disappearance, call the new `setNotice` action with severity `'info'` and message `"Plane no longer available"`.

**Rationale**: This satisfies FR-17 and makes the auto-deselect visible. The info toast auto-dismisses after 5 seconds (existing toast behavior).

**Alternative considered**: Show the message inline in the detail panel. Rejected because the panel is closing, so the user wouldn't see it.

### Decision 5: ErrorToast renders severity-aware styling

**Choice**: The `ErrorToast` component reads `notice.severity` and applies Tailwind color classes accordingly — red for `error`, amber for `warning`, blue for `info`. Renamed to `NoticeToast` to reflect the broader scope.

**Rationale**: Visual differentiation helps users understand severity at a glance. The component otherwise behaves identically (auto-dismiss, manual dismiss).

**Alternative considered**: Keep `ErrorToast` name and just add conditional styling. Renaming is clearer since it handles more than errors.

## Risks / Trade-offs

- **[Breaking change to store shape]** → The `errorMessage` field is replaced by `notice`. All consumers (`ErrorToast`, hooks) must be updated in lockstep. Migration is straightforward since only a few files reference it.
- **[Multiple rapid notices could overwrite each other]** → The store holds only one `notice` at a time. If two errors fire in quick succession, the second replaces the first. This is acceptable because the toast auto-dismisses quickly and showing one at a time avoids clutter. If needed later, a queue can be added.
- **[Connection banner flickering on brief disconnects]** → If the basic WS drops and reconnects in under 1 second, the banner would flash. Mitigation: delay showing the banner by 1 second — only show if the connection has been non-connected for ≥1s.
