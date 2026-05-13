## MODIFIED Requirements

### Requirement: Error toast displays non-blocking error messages
The toast component (renamed `NoticeToast`) SHALL display the current `notice` from the flight store as a non-blocking overlay, positioned at the top-right of the viewport. The styling SHALL vary by `notice.severity`: red for `'error'`, amber for `'warning'`, blue for `'info'`.

#### Scenario: Toast appears when notice is set with error severity
- **WHEN** `notice` in the flight store changes from null to `{ message: 'Connection lost', severity: 'error' }`
- **THEN** a toast SHALL appear at the top-right of the viewport displaying the message with red styling

#### Scenario: Toast appears when notice is set with info severity
- **WHEN** `notice` in the flight store changes from null to `{ message: 'Plane no longer available', severity: 'info' }`
- **THEN** a toast SHALL appear at the top-right of the viewport displaying the message with blue styling

#### Scenario: Toast disappears when notice is cleared
- **WHEN** `notice` changes from a non-null object to null
- **THEN** the toast SHALL disappear

### Requirement: Error toast auto-dismisses after timeout
The toast SHALL automatically dismiss after 5 seconds, calling `clearNotice()` on the flight store.

#### Scenario: Auto-dismiss after 5 seconds
- **WHEN** a notice toast has been visible for 5 seconds
- **THEN** `clearNotice()` SHALL be called on the flight store
- **AND** the toast SHALL disappear

#### Scenario: New error resets dismiss timer
- **WHEN** a new notice arrives while a toast is already visible
- **THEN** the toast SHALL update to show the new message and severity styling
- **AND** the auto-dismiss timer SHALL restart from 5 seconds

### Requirement: Error toast has a manual dismiss button
The toast SHALL include a dismiss button that immediately calls `clearNotice()`.

#### Scenario: Manual dismiss
- **WHEN** the user clicks the dismiss button on the notice toast
- **THEN** `clearNotice()` SHALL be called on the flight store
- **AND** the toast SHALL disappear immediately
