## ADDED Requirements

### Requirement: Error toast displays non-blocking error messages
The error toast component SHALL display the current `errorMessage` from the flight store as a non-blocking overlay, positioned at the top-right of the viewport.

#### Scenario: Toast appears when errorMessage is set
- **WHEN** `errorMessage` in the flight store changes from null to a non-null string
- **THEN** a toast SHALL appear at the top-right of the viewport displaying the message

#### Scenario: Toast disappears when errorMessage is cleared
- **WHEN** `errorMessage` changes from a non-null string to null
- **THEN** the toast SHALL disappear

### Requirement: Error toast auto-dismisses after timeout
The toast SHALL automatically dismiss after 5 seconds, calling `clearError()` on the flight store.

#### Scenario: Auto-dismiss after 5 seconds
- **WHEN** an error toast has been visible for 5 seconds
- **THEN** `clearError()` SHALL be called on the flight store
- **AND** the toast SHALL disappear

#### Scenario: New error resets dismiss timer
- **WHEN** a new error message arrives while a toast is already visible
- **THEN** the toast SHALL update to show the new message
- **AND** the auto-dismiss timer SHALL restart from 5 seconds

### Requirement: Error toast has a manual dismiss button
The toast SHALL include a dismiss button that immediately calls `clearError()`.

#### Scenario: Manual dismiss
- **WHEN** the user clicks the dismiss button on the error toast
- **THEN** `clearError()` SHALL be called on the flight store
- **AND** the toast SHALL disappear immediately
