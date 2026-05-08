# Test Cases for AppointmentForm.jsx and AppointmentList.jsx

---

## **AppointmentForm.jsx Test Cases**

### **1. Form Validation Tests**

- **TC_AF_001**: Verify patient is required
  - Submit form without selecting patient
  - Expected: Error message "Patient is required"

- **TC_AF_002**: Verify doctor is required
  - Submit form without selecting doctor
  - Expected: Error message "Doctor is required"

- **TC_AF_003**: Verify appointment date/time is required
  - Submit form without selecting date/time
  - Expected: Error message "Appointment date and time is required"

- **TC_AF_004**: Verify appointment date must be in future
  - Select past date/time
  - Submit form
  - Expected: Error message "Appointment date must be in the future"

- **TC_AF_005**: Verify appointment date cannot be current past time
  - Select today's date but time already passed
  - Submit form
  - Expected: Error message "Appointment date must be in the future"

### **2. Create Appointment Tests**

- **TC_AF_006**: Create appointment with all fields
  - Select patient, doctor, date/time, status, type
  - Submit form
  - Expected: Appointment created successfully, navigates to /appointments

- **TC_AF_007**: Create appointment with default status
  - Fill patient, doctor, date/time
  - Leave status as default (SCHEDULE)
  - Submit form
  - Expected: Appointment created with status=SCHEDULE

- **TC_AF_008**: Create appointment with default type
  - Fill patient, doctor, date/time
  - Leave type as default (NEW_PATIENT)
  - Submit form
  - Expected: Appointment created with type=NEW_PATIENT

- **TC_AF_009**: Verify status options
  - Click status dropdown
  - Expected: Options: "Scheduled", "Completed", "Cancelled"

- **TC_AF_010**: Verify type options
  - Click type dropdown
  - Expected: Options: "New Patient", "Follow Up", "New Diagnosis", "Emergency"

### **3. Patient Selection Tests**

- **TC_AF_011**: Search patient by name
  - Type in patient autocomplete
  - Expected: Filter options matching input

- **TC_AF_012**: Select patient from dropdown
  - Click patient option
  - Expected: Patient selected, patientId populated

- **TC_AF_013**: Clear patient selection
  - Select patient then clear field
  - Expected: Selection cleared, patientId empty

- **TC_AF_014**: Patient autocomplete shows patientName
  - Expected: Options display patient.patientName

### **4. Doctor Selection Tests**

- **TC_AF_015**: Search doctor by name
  - Type in doctor autocomplete
  - Expected: Filter options matching input

- **TC_AF_016**: Select doctor from dropdown
  - Click doctor option
  - Expected: Doctor selected, doctorId populated

- **TC_AF_017**: Doctor autocomplete shows "Dr." prefix
  - Expected: Options display "Dr. {doctor.name}"

- **TC_AF_018**: Clear doctor selection
  - Select doctor then clear field
  - Expected: Selection cleared, doctorId empty

### **5. Date/Time Selection Tests**

- **TC_AF_019**: Verify datetime-local input
  - Click date/time field
  - Expected: Browser datetime picker opens

- **TC_AF_020**: Verify min attribute enforcement
  - Try to select past date
  - Expected: Browser prevents selection of past dates

- **TC_AF_021**: Select valid future date/time
  - Select tomorrow 10:00 AM
  - Expected: Date accepted and stored

### **6. Status Selection Tests**

- **TC_AF_022**: Select "Scheduled" status
  - Expected: Value stored as "SCHEDULE"

- **TC_AF_023**: Select "Completed" status
  - Expected: Value stored as "DONE"

- **TC_AF_024**: Select "Cancelled" status
  - Expected: Value stored as "CANCEL"

### **7. Type Selection Tests**

- **TC_AF_025**: Select "New Patient" type
  - Expected: Value stored as "NEW_PATIENT"

- **TC_AF_026**: Select "Follow Up" type
  - Expected: Value stored as "FOLLOW_UP"

- **TC_AF_027**: Select "New Diagnosis" type
  - Expected: Value stored as "NEW_DIAGNOSIS"

- **TC_AF_028**: Select "Emergency" type
  - Expected: Value stored as "EMERGENCY"

### **8. Form Submit Tests**

- **TC_AF_029**: Submit with all required fields
  - Fill: patient, doctor, date/time
  - Submit form
  - Expected: API called with correct payload

- **TC_AF_030**: Submit payload structure
  - Expected payload:
    ```json
    {
      "appointmentdatetime": "2026-05-09T10:00",
      "status": "SCHEDULE",
      "type": "NEW_PATIENT"
    }
    ```

- **TC_AF_031**: Submit includes patientId and doctorId in URL
  - Expected: POST to /appointment/create/{patientId}/{doctorId}

### **9. Navigation Tests**

- **TC_AF_032**: Back button navigation
  - Click "Back to Appointments" button
  - Expected: Navigates to /appointments

- **TC_AF_033**: Cancel button navigation
  - Click Cancel button
  - Expected: Navigates to /appointments without saving

- **TC_AF_034**: Post-submit navigation on success
  - Submit valid form successfully
  - Expected: Navigates to /appointments

### **10. Clear Error Tests**

- **TC_AF_035**: Clear patient error on selection
  - Submit without patient (error shows)
  - Select patient
  - Expected: Error clears

- **TC_AF_036**: Clear doctor error on selection
  - Submit without doctor (error shows)
  - Select doctor
  - Expected: Error clears

- **TC_AF_037**: Clear date error on input
  - Submit without date (error shows)
  - Select valid date
  - Expected: Error clears

### **11. Page Display Tests**

- **TC_AF_038**: Verify page title
  - Navigate to /appointments/new
  - Expected: Title shows "Schedule New Appointment"

- **TC_AF_039**: Verify submit button text
  - Expected: Button shows "Schedule Appointment"

- **TC_AF_040**: Verify required field indicators
  - Expected: Patient, Doctor, Date/Time, Type marked with asterisk

### **12. Data Fetch Tests**

- **TC_AF_041**: Fetch patients on mount
  - Load form
  - Expected: fetchPatients() called

- **TC_AF_042**: Fetch doctors on mount
  - Load form
  - Expected: fetchDoctors() called

- **TC_AF_043**: Handle empty patients list
  - No patients available
  - Expected: Autocomplete shows no options

- **TC_AF_044**: Handle empty doctors list
  - No doctors available
  - Expected: Autocomplete shows no options

---

## **AppointmentList.jsx Test Cases**

### **1. Page Load & Role-Based Tests**

- **TC_AL_001**: Verify page loads successfully
  - Navigate to /appointments
  - Expected: Page loads with appointment list table

- **TC_AL_002**: Verify "Schedule Appointment" button for ADMIN
  - Login as ADMIN
  - Expected: Button visible and enabled

- **TC_AL_003**: Verify "Schedule Appointment" button hidden for non-ADMIN
  - Login as EMPLOYEE or DOCTOR
  - Expected: "Schedule Appointment" button NOT visible

- **TC_AL_004**: Verify table columns for ADMIN
  - Login as ADMIN
  - Expected: Date & Time, Patient, Doctor, Type, Status, Actions

- **TC_AL_005**: Verify table columns for DOCTOR
  - Login as DOCTOR
  - Expected: All columns including Actions (can edit)

- **TC_AL_006**: Verify table columns for EMPLOYEE
  - Login as EMPLOYEE
  - Expected: Date & Time, Patient, Doctor, Type, Status (no Actions)

### **2. Doctor-Specific Filter Tests**

- **TC_AL_007**: DOCTOR role auto-filters on load
  - Login as DOCTOR
  - Load /appointments
  - Expected: Filter set with doctorName=user.name, API called with filter

- **TC_AL_008**: DOCTOR sees only their appointments
  - Login as DOCTOR "Dr. Smith"
  - Expected: Only appointments where doctorName="Dr. Smith" displayed

- **TC_AL_009**: ADMIN sees all appointments on load
  - Login as ADMIN
  - Expected: All appointments loaded without doctor filter

### **3. Server-Side Filtering Tests**

- **TC_AL_010**: Filter by date
  - Select date from date picker
  - Expected: API called with date parameter in YYYY/MM/DD format

- **TC_AL_011**: Filter by status
  - Select "Scheduled" from status dropdown
  - Expected: Immediate API call with status="SCHEDULE"

- **TC_AL_012**: Filter by type
  - Select "New Patient" from type dropdown
  - Expected: Immediate API call with type="NEW_PATIENT"

- **TC_AL_013**: Filter by patient name (debounced)
  - Type "John" in patient name field
  - Wait 500ms
  - Expected: API called with patientName="John"

- **TC_AL_014**: Filter by doctor name (debounced)
  - Type "Smith" in doctor name field
  - Wait 500ms
  - Expected: API called with doctorName="Smith"

- **TC_AL_015**: Multiple filters combination
  - Set date AND status AND patientName
  - Wait for debounce
  - Expected: API called with all three parameters

- **TC_AL_016**: Date format for API
  - Select January 5, 2026
  - Expected: API receives date="2026/01/05"

- **TC_AL_017**: Clear all filters
  - Apply multiple filters
  - Click "Clear All" button
  - Expected: API called without parameters, all filters reset

- **TC_AL_018**: Clear filters resets page to 0
  - Apply filters on page 3
  - Clear filters
  - Expected: Page resets to 0

### **4. Debounce Tests**

- **TC_AL_019**: Verify debounce on patient name input
  - Type quickly in patient name field
  - Stop typing
  - Expected: API call only after 500ms of no typing

- **TC_AL_020**: Verify debounce on doctor name input
  - Type quickly in doctor name field
  - Stop typing
  - Expected: API call only after 500ms of no typing

- **TC_AL_021**: Multiple keystrokes before debounce
  - Type "John" then delete and type "Jane"
  - Expected: Only final value "Jane" sent after 500ms

- **TC_AL_022**: Dropdown immediate execution
  - Select status option
  - Expected: API call immediately (no debounce)

- **TC_AL_023**: Date picker immediate execution
  - Select date
  - Expected: API call immediately (no debounce)

### **5. Active Filter Indicators Tests**

- **TC_AL_024**: Active filter count badge
  - Apply 3 filters
  - Expected: Badge shows "3 active"

- **TC_AL_025**: Clear button appears with active filters
  - Apply any filter
  - Expected: "Clear All" button becomes visible

- **TC_AL_026**: Clear button hidden with no filters
  - Clear all filters
  - Expected: "Clear All" button disappears

- **TC_AL_027**: Filter results summary
  - Apply filters
  - Expected: Alert shows "Found X appointment(s) matching your filters"

### **6. Table Display & Sorting Tests**

- **TC_AL_028**: Verify default sort
  - Expected: Sorted by appointmentdatetime ascending

- **TC_AL_029**: Sort by date ascending
  - Click "Date & Time" column header
  - Expected: Appointments sorted oldest to newest

- **TC_AL_030**: Sort by date descending
  - Click "Date & Time" column header twice
  - Expected: Appointments sorted newest to oldest

- **TC_AL_031**: Sort by patient name
  - Click "Patient" column header
  - Expected: Appointments sorted A-Z by patient name

- **TC_AL_032**: Sort by doctor name
  - Click "Doctor" column header
  - Expected: Appointments sorted A-Z by doctor name

- **TC_AL_033**: Handle null values in sort
  - Sort column with some null values
  - Expected: Null values appear at end (ascending) or beginning (descending)

- **TC_AL_034**: Date format in table
  - View appointment
  - Expected: Displayed as "MMM dd, yyyy HH:mm" (e.g., "May 08, 2026 14:30")

### **7. Status Display Tests**

- **TC_AL_035**: Status "SCHEDULE" (0) displays correctly
  - Expected: Chip with label "Scheduled", color="info"

- **TC_AL_036**: Status "DONE" (1) displays correctly
  - Expected: Chip with label "Completed", color="success"

- **TC_AL_037**: Status "CANCEL" (2) displays correctly
  - Expected: Chip with label "Cancelled", color="error"

- **TC_AL_038**: Unknown status displays
  - Status value other than 0/1/2/SCHEDULE/DONE/CANCEL
  - Expected: Displays raw value, color="default"

### **8. Type Display Tests**

- **TC_AL_039**: Type "NEW_PATIENT" displays correctly
  - Expected: Chip with label "New Patient", color="info"

- **TC_AL_040**: Type "FOLLOW_UP" displays correctly
  - Expected: Chip with label "Follow Up", color="success"

- **TC_AL_041**: Type "NEW_DIAGNOSIS" displays correctly
  - Expected: Chip with label "New Diagnosis", color="warning"

- **TC_AL_042**: Type "EMERGENCY" displays correctly
  - Expected: Chip with label "Emergency", color="error"

- **TC_AL_043**: Unknown/empty type displays
  - Type is null or unknown
  - Expected: Shows "N/A"

### **9. Pagination Tests**

- **TC_AL_044**: Default pagination
  - Expected: 5 rows per page, page 0

- **TC_AL_045**: Change rows per page to 10
  - Select 10 from dropdown
  - Expected: Shows 10 rows, page resets to 0

- **TC_AL_046**: Change rows per page to 25
  - Select 25 from dropdown
  - Expected: Shows 25 rows, page resets to 0

- **TC_AL_047**: Change rows per page to 50
  - Select 50 from dropdown
  - Expected: Shows 50 rows, page resets to 0

- **TC_AL_048**: Navigate to next page
  - Click next page button
  - Expected: Page increments, shows next 5/10/25/50 rows

- **TC_AL_049**: Navigate to previous page
  - Click previous page button
  - Expected: Page decrements, shows previous rows

- **TC_AL_050**: Pagination works with filters
  - Apply filters
  - Change page
  - Expected: Pagination applies to filtered results

### **10. Action Buttons Tests**

- **TC_AL_051**: Consultation button for ADMIN
  - Login as ADMIN
  - Expected: Consultation icon visible

- **TC_AL_052**: Consultation button for DOCTOR
  - Login as DOCTOR
  - Expected: Consultation icon visible

- **TC_AL_053**: Consultation button hidden for EMPLOYEE
  - Login as EMPLOYEE
  - Expected: Consultation icon NOT visible

- **TC_AL_054**: Edit button for ADMIN
  - Login as ADMIN
  - Expected: Edit icon visible

- **TC_AL_055**: Edit button for DOCTOR
  - Login as DOCTOR
  - Expected: Edit icon visible

- **TC_AL_056**: Delete button for ADMIN
  - Login as ADMIN
  - Expected: Delete icon visible

- **TC_AL_057**: Delete button hidden for DOCTOR
  - Login as DOCTOR
  - Expected: Delete icon NOT visible

### **11. Consultation Navigation Tests**

- **TC_AL_058**: Click consultation on SCHEDULED appointment
  - Appointment status = SCHEDULE or 0
  - Click consultation icon
  - Expected: Navigates to /consultation/{appointmentId}

- **TC_AL_059**: Click consultation on DONE appointment
  - Appointment status = DONE or 1
  - Click consultation icon
  - Expected: Navigates to /consultation/{appointmentId} (view/edit mode)

- **TC_AL_060**: Click consultation on CANCELLED appointment
  - Appointment status = CANCEL or 2
  - Click consultation icon
  - Expected: Error notification "Cannot create consultation for cancelled appointment"

- **TC_AL_061**: Consultation button tooltip for SCHEDULED
  - Hover over consultation icon on SCHEDULED appointment
  - Expected: Tooltip shows "Start Consultation"

- **TC_AL_062**: Consultation button tooltip for DONE
  - Hover over consultation icon on DONE appointment
  - Expected: Tooltip shows "View Consultation"

### **12. Edit Navigation Tests**

- **TC_AL_063**: Click edit button
  - Click edit icon
  - Expected: Navigates to /appointments/{id}/edit

### **13. Delete Dialog Tests**

- **TC_AL_064**: Open delete dialog
  - Click delete icon
  - Expected: Dialog opens with confirmation message

- **TC_AL_065**: Delete dialog content
  - Expected: Title "Delete Appointment", message "Are you sure...", Cancel and Delete buttons

- **TC_AL_066**: Confirm delete
  - Click Delete button in dialog
  - Expected: deleteAppointment called, dialog closes on success

- **TC_AL_067**: Cancel delete
  - Click Cancel button in dialog
  - Expected: Dialog closes, appointment not deleted

- **TC_AL_068**: Close delete dialog with X
  - Click X or outside dialog
  - Expected: Dialog closes, appointment not deleted

### **14. Empty State Tests**

- **TC_AL_069**: No appointments found with filters
  - Apply filters that match nothing
  - Expected: "No appointments match your filters"

- **TC_AL_070**: No appointments in system
  - No appointments exist
  - Expected: "No appointments found"

- **TC_AL_071**: Loading state
  - While data is fetching
  - Expected: "Loading..." message in table

### **15. Patient/Doctor Name Display Tests**

- **TC_AL_072**: Patient name with patient_name field
  - Appointment has patient_name
  - Expected: Displays patient_name value

- **TC_AL_073**: Patient name with patientName field
  - Appointment has patientName (from nested object)
  - Expected: Displays patientName value

- **TC_AL_074**: Missing patient name
  - No patient data
  - Expected: Shows "N/A"

- **TC_AL_075**: Doctor name with doctor_name field
  - Appointment has doctor_name
  - Expected: Displays doctor_name value

- **TC_AL_076**: Doctor name with doctorName field
  - Appointment has doctorName (from nested object)
  - Expected: Displays doctorName value

- **TC_AL_077**: Missing doctor name
  - No doctor data
  - Expected: Shows "N/A"

### **16. Count Display Tests**

- **TC_AL_078**: Count in subtitle for ADMIN
  - Login as ADMIN
  - Expected: "Manage appointments (X of Y)"

- **TC_AL_079**: Count in subtitle for DOCTOR
  - Login as DOCTOR
  - Expected: "View & Update appointments (X of Y)"

- **TC_AL_080**: Count in subtitle for EMPLOYEE
  - Login as EMPLOYEE
  - Expected: "View appointments (X of Y)"

### **17. Responsive Design Tests**

- **TC_AL_081**: Mobile view filters
  - View on small screen (xs)
  - Expected: Filters stack vertically (1 column)

- **TC_AL_082**: Small screen filters
  - View on small screen (sm)
  - Expected: Filters show 2 columns

- **TC_AL_083**: Desktop view filters
  - View on large screen (md+)
  - Expected: Filters show 5 columns (2.4 each)

---

## **Integration Test Cases**

- **TC_INT_APPT_001**: Create appointment through list
  - From AppointmentList, click "Schedule Appointment"
  - Fill form and submit
  - Expected: Returns to AppointmentList with new appointment visible

- **TC_INT_APPT_002**: Edit appointment through list
  - From AppointmentList, click edit icon
  - Modify date/time
  - Submit form
  - Expected: Returns to AppointmentList with updated date visible

- **TC_INT_APPT_003**: Start consultation from SCHEDULED appointment
  - Click consultation icon on SCHEDULED appointment
  - Fill consultation form
  - Expected: Creates new consultation record

- **TC_INT_APPT_004**: View consultation from DONE appointment
  - Click consultation icon on DONE appointment
  - Expected: Shows existing consultation in view/edit mode

- **TC_INT_APPT_005**: Filter then edit appointment
  - Apply date filter
  - Click edit on filtered result
  - Modify and save
  - Expected: Returns to filtered list with updated data

- **TC_INT_APPT_006**: Delete appointment
  - From AppointmentList, click delete icon
  - Confirm deletion
  - Expected: Appointment removed from list, success notification

- **TC_INT_APPT_007**: DOCTOR filters own appointments
  - Login as DOCTOR
  - Apply additional filters
  - Expected: Filters apply within DOCTOR's own appointments only

---

## **Edge Case Tests**

- **TC_EDGE_APPT_001**: Very long patient/doctor name in table
  - Patient or doctor name is 100+ characters
  - Expected: Table handles gracefully (may truncate or wrap)

- **TC_EDGE_APPT_002**: Clear filters while loading
  - Apply filter
  - Clear before API returns
  - Expected: Latest clear request takes precedence

- **TC_EDGE_APPT_003**: Rapid filter changes
  - Change multiple filters quickly
  - Expected: Each change triggers appropriate debounce/immediate call

- **TC_EDGE_APPT_004**: Filter with no matching results
  - Apply filters with no matches
  - Change one filter
  - Expected: API called with new filters, results update

- **TC_EDGE_APPT_005**: Appointment at exact current time
  - Try to schedule appointment for current time
  - Expected: Validation fails if time has passed

- **TC_EDGE_APPT_006**: All appointments on same day
  - Multiple appointments on same date
  - Expected: Sort by time works correctly

- **TC_EDGE_APPT_007**: Date filter across month boundary
  - Select date on 31st then navigate to month with 30 days
  - Expected: Date picker handles correctly

---

## **Performance Tests**

- **TC_PERF_APPT_001**: Large appointment list
  - Load 1000+ appointments
  - Expected: Page renders without lag

- **TC_PERF_APPT_002**: Fast typing in filter
  - Type quickly in patient name filter
  - Expected: No UI lag, debounce works correctly

- **TC_PERF_APPT_003**: Multiple rapid filter changes
  - Change filters 10 times rapidly
  - Expected: Only final filters trigger API call (for text inputs)

- **TC_PERF_APPT_004**: Sorting large dataset
  - Sort 1000+ appointments by date
  - Expected: Sort completes without blocking UI

---

## **Accessibility Tests**

- **TC_A11Y_APPT_001**: Tab navigation
  - Use Tab key through filters
  - Expected: Logical tab order, all fields accessible

- **TC_A11Y_APPT_002**: Table header sorting indication
  - Expected: Sorted column indicated visually

- **TC_A11Y_APPT_003**: Icon button accessibility
  - Expected: All icon buttons have title/tooltip

- **TC_A11Y_APPT_004**: Status chip accessibility
  - Expected: Status text announced, color not sole indicator

---

## **Date Handling Tests**

- **TC_DATE_APPT_001**: Date format conversion
  - API returns "appointmentdatetime": "2026-05-08T14:30:00"
  - Expected: Displayed as "May 08, 2026 14:30"

- **TC_DATE_APPT_002**: Invalid date from API
  - API returns invalid date string
  - Expected: Shows "N/A" or handles gracefully

- **TC_DATE_APPT_003**: Null date from API
  - API returns null appointmentdatetime
  - Expected: Shows "N/A"

- **TC_DATE_APPT_004**: Date picker clear action
  - Select date then click "Clear" in date picker
  - Expected: Filter removed, API called without date parameter

- **TC_DATE_APPT_005**: Date picker today action
  - Click "Today" in date picker
  - Expected: Date set to today, API called with today's date

---

## **API Integration Tests**

- **TC_API_APPT_001**: Fetch appointments on mount (ADMIN)
  - Load page as ADMIN
  - Expected: GET /appointment/filter with no params (or fetchAppointments())

- **TC_API_APPT_002**: Fetch appointments on mount (DOCTOR)
  - Load page as DOCTOR
  - Expected: GET /appointment/filter with doctorName={user.name}

- **TC_API_APPT_003**: Filter API call structure
  - Apply date filter
  - Expected: GET /appointment/filter?date=2026/05/08

- **TC_API_APPT_004**: Multiple filter API call
  - Apply date, status, patientName filters
  - Expected: GET /appointment/filter?date=2026/05/08&status=SCHEDULE&patientName=John

- **TC_API_APPT_005**: Delete API call
  - Confirm delete appointment ID 123
  - Expected: DELETE /appointment/123

- **TC_API_APPT_006**: Create appointment API call
  - Submit form with patientId=1, doctorId=2
  - Expected: POST /appointment/create/1/2 with appointment data

- **TC_API_APPT_007**: Update appointment API call
  - Edit appointment ID 123
  - Expected: PUT /appointment/update/123 with updated data

---

## **Error Handling Tests**

- **TC_ERR_APPT_001**: API error on fetch
  - Appointment API returns error
  - Expected: Error notification shown

- **TC_ERR_APPT_002**: API error on delete
  - Delete API returns error
  - Expected: Error notification shown, dialog stays open

- **TC_ERR_APPT_003**: Network error handling
  - Network connection lost
  - Expected: Appropriate error message displayed

- **TC_ERR_APPT_004**: Empty response from API
  - API returns empty array
  - Expected: Shows "No appointments found"

---

## **Data Key Conversion Tests**

- **TC_KEY_APPT_001**: Patient name from nested object
  - API returns { patient: { patientName: "John" } }
  - Expected: Displays "John"

- **TC_KEY_APPT_002**: Patient name from snake_case
  - API returns { patient_name: "John" }
  - Expected: Displays "John"

- **TC_KEY_APPT_003**: Patient name from camelCase
  - API returns { patientName: "John" }
  - Expected: Displays "John"

- **TC_KEY_APPT_004**: Doctor name from nested object
  - API returns { doctor: { name: "Smith" } }
  - Expected: Displays "Smith"

- **TC_KEY_APPT_005**: Doctor name from snake_case
  - API returns { doctor_name: "Smith" }
  - Expected: Displays "Smith"

- **TC_KEY_APPT_006**: Doctor name from camelCase
  - API returns { doctorName: "Smith" }
  - Expected: Displays "Smith"

- **TC_KEY_APPT_007**: All fields preserved
  - API returns appointment with various field formats
  - Expected: Both original and mapped fields available in data
