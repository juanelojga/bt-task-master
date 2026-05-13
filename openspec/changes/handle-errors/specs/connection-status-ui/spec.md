## ADDED Requirements

### Requirement: Connection banner shows basic WS status on the map
A `ConnectionBanner` component SHALL render above the map when `connectionStatus.basic` is `'connecting'` or `'disconnected'`, showing a contextual message and indicator.

#### Scenario: Basic WS is reconnecting
- **WHEN** `connectionStatus.basic` transitions to `'connecting'`
- **THEN** a banner SHALL appear at the top of the map viewport
- **AND** it SHALL display the text "Reconnecting…"
- **AND** it SHALL include a subtle animated indicator (e.g., pulsing dot)

#### Scenario: Basic WS is disconnected
- **WHEN** `connectionStatus.basic` transitions to `'disconnected'`
- **THEN** the banner SHALL display the text "Connection lost"
- **AND** the indicator SHALL reflect a disconnected state

#### Scenario: Basic WS reconnects
- **WHEN** `connectionStatus.basic` transitions to `'connected'`
- **THEN** the banner SHALL disappear

#### Scenario: Banner delayed on brief disconnects
- **WHEN** `connectionStatus.basic` transitions to `'connecting'` and then back to `'connected'` within 1 second
- **THEN** the banner SHALL NOT be shown at all

#### Scenario: Banner appears after sustained disconnect
- **WHEN** `connectionStatus.basic` transitions to `'connecting'` and remains non-connected for at least 1 second
- **THEN** the banner SHALL appear

### Requirement: Detail panel shows reconnecting badge for details WS
When `connectionStatus.details` is `'connecting'` or `'disconnected'` and a plane is selected, the `DetailPanelHeader` SHALL display a "Reconnecting…" badge.

#### Scenario: Details WS drops mid-subscription
- **WHEN** `connectionStatus.details` transitions to `'connecting'` while `selectedPlaneId` is non-null
- **THEN** a "Reconnecting…" badge SHALL appear in the detail panel header

#### Scenario: Details WS reconnects successfully
- **WHEN** `connectionStatus.details` transitions to `'connected'` while a plane is still selected
- **THEN** the "Reconnecting…" badge SHALL disappear

#### Scenario: No badge when no plane is selected
- **WHEN** `selectedPlaneId` is `null`
- **THEN** no reconnecting badge SHALL be shown regardless of details connection status

#### Scenario: No badge when details WS is connected
- **WHEN** `connectionStatus.details` is `'connected'`
- **THEN** no reconnecting badge SHALL be shown
