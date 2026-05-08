# Test Cases for ConsultationRemarks.jsx

---

## **ConsultationRemarks.jsx Test Cases**

### **1. Page Load & Mode Detection Tests**

- **TC_CR_001**: Load page with appointmentId (SCHEDULE status)
  - Navigate to /consultation/{appointmentId} where appointment.status = SCHEDULE
  - Expected: Page loads in CREATE mode, form pre-filled with patient/doctor

- **TC_CR_002**: Load page with appointmentId (DONE status) with existing record
  - Navigate to /consultation/{appointmentId} where appointment.status = DONE and medical record exists
  - Expected: Page loads in EDIT mode, form pre-filled with existing data

- **TC_CR_003**: Load page with appointmentId (DONE status) without existing record
  - Navigate to /consultation/{appointmentId} where appointment.status = DONE but no medical record
  - Expected: Warning notification shown, CREATE mode enabled

- **TC_CR_004**: Load standalone consultation remarks page
  - Navigate to /consultation-remarks
  - Expected: Page loads in CREATE mode, patient/doctor fields enabled

- **TC_CR_005**: Loading state displayed
  - While fetching initial data
  - Expected: "Loading..." message displayed

---

### **2. Form Mode & Title Tests**

- **TC_CR_006**: Verify title in CREATE mode
  - consultationMode = 'create'
  - Expected: Title shows "Consultation Remarks"

- **TC_CR_007**: Verify title in EDIT mode
  - consultationMode = 'edit'
  - Expected: Title shows "View/Update Consultation Remarks"

- **TC_CR_008**: Verify subtitle in CREATE mode
  - consultationMode = 'create'
  - Expected: "Record consultation details and prescriptions for this appointment"

- **TC_CR_009**: Verify subtitle in EDIT mode
  - consultationMode = 'edit'
  - Expected: "View and update consultation details and prescriptions for this completed appointment"

- **TC_CR_010**: Verify submit button text in CREATE mode
  - Expected: Button shows "Save Consultation"

- **TC_CR_011**: Verify submit button text in EDIT mode
  - Expected: Button shows "Update Consultation"

---

### **3. Appointment Info Display Tests**

- **TC_CR_012**: Display appointment date/time chip
  - In appointment mode
  - Expected: Chip shows "Appointment: {date}" in localized format

- **TC_CR_013**: Display appointment type chip (NEW_PATIENT)
  - Appointment type = NEW_PATIENT
  - Expected: Chip shows "Type: New Patient", color="info"

- **TC_CR_014**: Display appointment type chip (FOLLOW_UP)
  - Appointment type = FOLLOW_UP
  - Expected: Chip shows "Type: Follow Up", color="success"

- **TC_CR_015**: Display appointment type chip (NEW_DIAGNOSIS)
  - Appointment type = NEW_DIAGNOSIS
  - Expected: Chip shows "Type: New Diagnosis", color="info"

- **TC_CR_016**: Display appointment type chip (EMERGENCY)
  - Appointment type = EMERGENCY
  - Expected: Chip shows "Type: Emergency", color="error"

- **TC_CR_017**: Display appointment status chip (SCHEDULE)
  - Appointment status = SCHEDULE or 0
  - Expected: Chip shows "Status: Scheduled", color="info"

- **TC_CR_018**: Display appointment status chip (DONE)
  - Appointment status = DONE or 1
  - Expected: Chip shows "Status: Completed", color="success"

- **TC_CR_019**: Display appointment status chip (CANCEL)
  - Appointment status = CANCEL or 2
  - Expected: Chip shows "Status: Cancelled", color="error"

- **TC_CR_020**: Display "Viewing Existing Record" chip
  - In EDIT mode
  - Expected: Chip with "Viewing Existing Record", color="info", with NotesIcon

- **TC_CR_021**: Display "Creating New Record" chip
  - In CREATE mode
  - Expected: Chip with "Creating New Record", color="success"

- **TC_CR_022**: Display patient name from appointment
  - In appointment mode with patientName
  - Expected: Shows "Patient: {name}" in caption

---

### **4. Patient Selection Tests**

- **TC_CR_023**: Patient field disabled in appointment mode
  - isAppointmentMode = true
  - Expected: Patient autocomplete disabled, label shows "Patient (from appointment)"

- **TC_CR_024**: Patient field enabled in standalone mode
  - isAppointmentMode = false
  - Expected: Patient autocomplete enabled, label shows "Patient"

- **TC_CR_025**: Patient pre-filled from appointment
  - In appointment mode
  - Expected: Patient field pre-populated with appointment's patient

- **TC_CR_026**: Search patient by name
  - Type in patient autocomplete
  - Expected: Filter options matching input

- **TC_CR_027**: Select patient
  - Click patient option
  - Expected: Patient selected, patientId populated

- **TC_CR_028**: Clear patient selection
  - Select patient then clear field
  - Expected: Selection cleared, patientId empty

---

### **5. Doctor Selection Tests**

- **TC_CR_029**: Doctor field disabled in appointment mode
  - isAppointmentMode = true
  - Expected: Doctor autocomplete disabled, label shows "Doctor (from appointment)"

- **TC_CR_030**: Doctor field enabled in standalone mode
  - isAppointmentMode = false
  - Expected: Doctor autocomplete enabled, label shows "Doctor"

- **TC_CR_031**: Doctor pre-filled from appointment
  - In appointment mode
  - Expected: Doctor field pre-populated with appointment's doctor

- **TC_CR_032**: Doctor autocomplete shows "Dr." prefix
  - Expected: Options display "Dr. {doctor.name}"

---

### **6. Remarks Field Tests**

- **TC_CR_033**: Remarks field is required
  - Submit form without remarks
  - Expected: Error message "Remarks are required"

- **TC_CR_034**: Remarks field accepts multiline input
  - Type multiple lines
  - Expected: Field displays 3 rows, expands as needed

- **TC_CR_035**: Trim whitespace validation
  - Enter only spaces in remarks
  - Submit form
  - Expected: Error message "Remarks are required"

- **TC_CR_036**: Pre-fill remarks in EDIT mode
  - In EDIT mode with existing remarks
  - Expected: Remarks field pre-filled with existing value

- **TC_CR_037**: Clear remarks error on input
  - Trigger validation error
  - Start typing in remarks field
  - Expected: Error clears

---

### **7. Keypoints Field Tests**

- **TC_CR_038**: Keypoints field is required
  - Submit form without keypoints
  - Expected: Error message "Keypoints are required"

- **TC_CR_039**: Keypoints field accepts multiline input
  - Type multiple lines
  - Expected: Field displays 2 rows, expands as needed

- **TC_CR_040**: Trim whitespace validation
  - Enter only spaces in keypoints
  - Submit form
  - Expected: Error message "Keypoints are required"

- **TC_CR_041**: Pre-fill keypoints in EDIT mode
  - In EDIT mode with existing keypoints
  - Expected: Keypoints field pre-filled with existing value

---

### **8. Diagnosis Field Tests**

- **TC_CR_042**: Diagnosis field is required
  - Submit form without diagnosis
  - Expected: Error message "Diagnosis is required"

- **TC_CR_043**: Diagnosis field accepts multiline input
  - Type multiple lines
  - Expected: Field displays 2 rows, expands as needed

- **TC_CR_044**: Trim whitespace validation
  - Enter only spaces in diagnosis
  - Submit form
  - Expected: Error message "Diagnosis are required"

- **TC_CR_045**: Pre-fill diagnosis in EDIT mode
  - In EDIT mode with existing diagnosis
  - Expected: Diagnosis field pre-filled with existing value

---

### **9. Prescription Management Tests**

- **TC_CR_046**: Default prescription on load
  - Load form
  - Expected: One empty prescription card displayed

- **TC_CR_047**: Add new prescription
  - Click "Add Medication" button
  - Expected: New prescription card added to list

- **TC_CR_048**: Prescription card numbering
  - Add 3 prescriptions
  - Expected: Cards numbered 1, 2, 3

- **TC_CR_049**: Remove prescription (multiple exist)
  - Add 2 prescriptions
  - Click delete on second prescription
  - Expected: Prescription removed, one prescription remains

- **TC_CR_050**: Remove prescription (only one exists)
  - Try to delete single prescription
  - Expected: Warning notification "At least one prescription is required"

- **TC_CR_051**: Delete button hidden for single prescription
  - Only one prescription exists
  - Expected: Delete button not visible

- **TC_CR_052**: Prescription count display in CREATE mode
  - Add 3 prescriptions
  - Expected: Shows "(3 medications)" in subtitle

- **TC_CR_053**: Prescription count display in EDIT mode
  - Load with 2 existing prescriptions
  - Expected: Shows "2 medications prescribed" chip

---

### **10. Prescription Field Tests - Medicine Name**

- **TC_CR_054**: Medicine name is required
  - Submit form with empty medicine name
  - Expected: Error message "Medicine name is required"

- **TC_CR_055**: Clear medicine name error on input
  - Trigger validation error
  - Start typing in medicine name field
  - Expected: Error clears

- **TC_CR_056**: Pre-fill medicine name in EDIT mode
  - In EDIT mode with existing prescription
  - Expected: Medicine name pre-filled with existing value

---

### **11. Prescription Field Tests - Dosage**

- **TC_CR_057**: Dosage is required
  - Submit form with empty dosage
  - Expected: Error message "Dosage is required"

- **TC_CR_058**: Placeholder text for dosage
  - Expected: "e.g., 1 tablet, 5ml, 2 capsules"

---

### **12. Prescription Field Tests - Frequency**

- **TC_CR_059**: Frequency is required
  - Submit form with empty frequency
  - Expected: Error message "Frequency is required"

- **TC_CR_060**: Verify all frequency options
  - Expected options:
    - Once daily
    - Twice daily
    - Three times daily
    - Four times daily
    - Every 4 hours
    - Every 6 hours
    - Every 8 hours
    - Every 12 hours
    - As needed (PRN)
    - Before meals
    - After meals
    - At bedtime

- **TC_CR_061**: Normalize frequency from snake_case
  - API returns "once_daily"
  - Expected: Displayed/selected as "Once daily"

- **TC_CR_062**: Normalize frequency from UPPER_CASE
  - API returns "ONCE_DAILY"
  - Expected: Displayed/selected as "Once daily"

- **TC_CR_063**: Normalize frequency from kebab-case
  - API returns "once-daily"
  - Expected: Displayed/selected as "Once daily"

- **TC_CR_064**: Normalize PRN frequency
  - API returns "PRN" or "as_needed"
  - Expected: Displayed/selected as "As needed"

---

### **13. Prescription Field Tests - Duration**

- **TC_CR_065**: Duration is required
  - Submit form with empty duration
  - Expected: Error message "Duration is required"

- **TC_CR_066**: Helper text for duration
  - Expected: "e.g., 5 days, 2 weeks, 1 month"

---

### **14. Prescription Field Tests - Instructions**

- **TC_CR_067**: Instructions is required
  - Submit form with empty instructions
  - Expected: Error message "Instructions is required"

- **TC_CR_068**: Instructions multiline input
  - Type multiple lines
  - Expected: Field displays 2 rows

- **TC_CR_069**: Placeholder text for instructions
  - Expected: "e.g., Take with food, Swallow whole, Do not crush"

---

### **15. Prescription Field Tests - Status**

- **TC_CR_070**: Status is required
  - Submit form with empty status
  - Expected: Error message "Status is required"

- **TC_CR_071**: Status options with color indicators
  - Expected options:
    - Active (green dot)
    - Done (blue dot)
    - Stopped (red dot)

- **TC_CR_072**: Default status for new prescription
  - Add new prescription
  - Expected: Status defaults to "ACTIVE"

- **TC_CR_073**: Normalize status from lowercase
  - API returns "active" or "done" or "stopped"
  - Expected: Normalized to "ACTIVE", "DONE", "STOPPED"

- **TC_CR_074**: Normalize status from numeric
  - API returns 0, 1, or 2
  - Expected: Mapped to "ACTIVE", "DONE", "STOPPED"

---

### **16. Prescription Field Tests - Notes**

- **TC_CR_075**: Notes field is optional
  - Submit form with empty notes
  - Expected: Form submits successfully

- **TC_CR_076**: Notes multiline input
  - Type multiple lines
  - Expected: Field displays 2 rows, gray background

- **TC_CR_077**: Pre-fill notes in EDIT mode
  - In EDIT mode with existing notes
  - Expected: Notes pre-filled

---

### **17. Prescription Section Header Tests**

- **TC_CR_078**: Section header displays "Prescriptions"
  - Expected: "Prescriptions" heading visible

- **TC_CR_079**: "Add Medication" button visible
  - Expected: Button with add icon visible

- **TC_CR_080**: Section has bottom border
  - Expected: Border line under header

---

### **18. Prescription Card Layout Tests**

- **TC_CR_081**: Card shows medication number badge
  - Expected: Circular badge with number (1, 2, 3...)

- **TC_CR_082**: Card shows medication title
  - Expected: "Medication #1", "Medication #2", etc.

- **TC_CR_083**: Card has border and hover effect
  - Hover over card
  - Expected: Border color changes to primary, shadow appears

- **TC_CR_084**: Section subheadings display
  - Expected subheadings:
    - Medicine Details
    - Schedule Information
    - Instructions & Status
    - Additional Information

---

### **19. Form Validation Tests (All Fields)**

- **TC_CR_085**: Validate all required fields are empty
  - Submit form with all fields empty
  - Expected: Errors for patient, doctor, remarks, keypoints, diagnosis, and all prescription fields

- **TC_CR_086**: Validate with only patient selected
  - Select patient only
  - Submit form
  - Expected: Errors for all other required fields

- **TC_CR_087**: Validate with partial prescription data
  - Fill medicine name only
  - Submit form
  - Expected: Errors for dosage, frequency, duration, instructions, status

---

### **20. Submit Tests - CREATE Mode**

- **TC_CR_088**: Submit valid consultation in CREATE mode
  - Fill all required fields
  - Submit form
  - Expected:
    - API called to create consultation
    - Success notification "Consultation remarks saved successfully"
    - Form resets
    - Navigates to /appointments

- **TC_CR_089**: Update appointment status after CREATE
  - Submit new consultation in appointment mode
  - Expected: Appointment status updated to DONE, notification "Appointment marked as completed"

- **TC_CR_090**: Submit payload structure
  - Expected payload:
    ```json
    {
      "patient": { "id": 1 },
      "doctor": { "id": 2 },
      "remarks": "Patient remarks...",
      "keypoints": "Key points...",
      "diagnosis": "Diagnosis...",
      "prescriptions": [
        {
          "medicineName": "Paracetamol",
          "dosage": "1 tablet",
          "frequency": "Twice daily",
          "duration": "5 days",
          "instructions": "Take with food",
          "status": "ACTIVE",
          "notes": "Additional notes"
        }
      ]
    }
    ```

- **TC_CR_091**: Trim whitespace in payload
  - Enter text with leading/trailing spaces
  - Submit form
  - Expected: Payload values trimmed

---

### **21. Submit Tests - EDIT Mode**

- **TC_CR_092**: Submit valid consultation in EDIT mode
  - Modify existing consultation
  - Submit form
  - Expected:
    - API called to update consultation (PUT with medicalRecordId)
    - Success notification "Consultation remarks updated successfully"
    - Form resets
    - Navigates to /appointments

- **TC_CR_093**: EDIT mode does not update appointment status
  - Submit in EDIT mode
  - Expected: Appointment status NOT updated (already DONE)

- **TC_CR_094**: API endpoint for EDIT mode
  - Expected: PUT to consultation report endpoint with medicalRecordId

---

### **22. API Error Handling Tests**

- **TC_CR_095**: Handle create API error
  - Create API returns error
  - Expected: Error notification shown, form doesn't reset

- **TC_CR_096**: Handle update API error
  - Update API returns error
  - Expected: Error notification shown, form doesn't reset

- **TC_CR_097**: Handle appointment update error
  - Consultation created but appointment update fails
  - Expected: Warning notification "Failed to update appointment status"

---

### **23. Data Pre-fill Tests (EDIT Mode)**

- **TC_CR_098**: Pre-fill remarks from API
  - API returns remarks field
  - Expected: remarks field populated

- **TC_CR_099**: Pre-fill keyPoints from API (camelCase)
  - API returns keyPoints
  - Expected: keypoints field populated (mapped)

- **TC_CR_100**: Pre-fill keypoint from API (snake_case)
  - API returns keypoint
  - Expected: keypoints field populated (mapped)

- **TC_CR_101**: Pre-fill diagnosis from API
  - API returns diagnosis
  - Expected: diagnosis field populated

- **TC_CR_102**: Pre-fill remark from API (alternate field)
  - API returns remark (not remarks)
  - Expected: remarks field populated

---

### **24. Prescription Pre-fill Tests (EDIT Mode)**

- **TC_CR_103**: Pre-fill existing prescriptions
  - API returns 2 prescriptions
  - Expected: 2 prescription cards created with data

- **TC_CR_104**: Pre-fill medicineName variations
  - API returns medicinename or medicine_name
  - Expected: Mapped to medicineName field

- **TC_CR_105**: Pre-fill prescription notes variations
  - API returns note (not notes)
  - Expected: Mapped to notes field

- **TC_CR_106**: Handle empty prescriptions array
  - API returns prescriptions: []
  - Expected: One empty prescription card shown

- **TC_CR_107**: Handle missing prescriptions field
  - API response doesn't include prescriptions
  - Expected: One empty prescription card shown

---

### **25. Navigation Tests**

- **TC_CR_108**: Back button navigation
  - Click "Back to Appointment List" button
  - Expected: Navigates to /appointments

- **TC_CR_109**: Cancel button navigation
  - Click Cancel button
  - Expected: Navigates to /dashboard

- **TC_CR_110**: Post-submit navigation (appointment mode)
  - Submit consultation successfully
  - Expected: Navigates to /appointments

- **TC_CR_111**: Post-submit navigation (standalone mode)
  - Submit consultation without appointment
  - Expected: Form resets, stays on page

---

### **26. Follow-Up Detection Tests**

- **TC_CR_112**: Detect follow-up appointment type
  - Appointment type = FOLLOW_UP
  - Expected: isFollowUp state set to true

- **TC_CR_113**: Non-follow-up appointment
  - Appointment type = NEW_PATIENT
  - Expected: isFollowUp state set to false

---

### **27. Field Key Mapping Tests**

- **TC_CR_114**: Map patient.id from API
  - API returns appointment.patient.id
  - Expected: Correctly extracted for payload

- **TC_CR_115**: Map doctor.id from API
  - API returns appointment.doctor.id
  - Expected: Correctly extracted for payload

- **TC_CR_116**: Handle missing patient.id
  - API returns patientId directly (not nested)
  - Expected: Correctly extracted

- **TC_CR_117**: Handle missing doctor.id
  - API returns doctorId directly (not nested)
  - Expected: Correctly extracted

---

### **28. Notification Tests**

- **TC_CR_118**: Success notification on CREATE
  - Submit new consultation
  - Expected: "Consultation remarks saved successfully" (success)

- **TC_CR_119**: Success notification on EDIT
  - Update existing consultation
  - Expected: "Consultation remarks updated successfully" (success)

- **TC_CR_120**: Appointment status updated notification
  - New consultation created in appointment mode
  - Expected: "Appointment marked as completed" (success)

- **TC_CR_121**: Failed to load data notification
  - API fetch fails on mount
  - Expected: "Failed to load data" (error)

- **TC_CR_122**: No medical record warning
  - DONE appointment without medical record
  - Expected: "No consultation record found for completed appointment. Creating new record." (warning)

- **TC_CR_123**: No medical record error (handled gracefully)
  - No record found for SCHEDULED appointment
  - Expected: "No medical record found yet for this appointment" (error)

- **TC_CR_124**: At least one prescription warning
  - Try to delete last prescription
  - Expected: "At least one prescription is required" (warning)

---

### **29. State Reset Tests**

- **TC_CR_125**: Reset form after successful CREATE
  - Submit valid consultation
  - Expected:
    - formData reset to initial state
    - prescriptions reset to single empty card
    - medicalRecordId set to null
    - isEditMode set to false
    - isFollowUp set to false
    - consultationMode set to 'create'

- **TC_CR_126**: Reset form after successful EDIT
  - Update consultation
  - Expected: Same reset behavior as CREATE

---

### **30. Responsive Design Tests**

- **TC_CR_127**: Mobile view (xs)
  - View on small screen
  - Expected: Patient/Doctor fields stack (1 column), prescription fields stack (1 column)

- **TC_CR_128**: Small screen (sm)
  - View on small-medium screen
  - Expected: Patient/Doctor fields show 2 columns

- **TC_CR_129**: Medium+ screen (md+)
  - View on larger screen
  - Expected: Medicine name/dosage show 2 columns, frequency/duration show 2 columns, instructions/status show 8/4 split

---

### **31. Edge Case Tests**

- **TC_CR_130**: Very long remarks
  - Enter 1000+ character remarks
  - Expected: Field accepts input, saves correctly

- **TC_CR_131**: Very long diagnosis
  - Enter 500+ character diagnosis
  - Expected: Field accepts input, saves correctly

- **TC_CR_132**: Special characters in prescription fields
  - Enter special characters in instructions
  - Expected: Saves correctly

- **TC_CR_133**: Multiple prescriptions (10+)
  - Add 10 prescriptions
  - Expected: All cards rendered correctly, numbering accurate

- **TC_CR_134**: Rapid add/remove prescriptions
  - Add and remove prescriptions rapidly
  - Expected: State updates correctly, no errors

- **TC_CR_135**: Submit with untouched default prescription
  - Leave default prescription empty
  - Submit form
  - Expected: Validation errors for empty fields

---

### **32. Field Focus & Tab Order Tests**

- **TC_CR_136**: Tab order in main form
  - Press Tab through form
  - Expected: Patient → Doctor → Remarks → Keypoints → Diagnosis → Prescription fields

- **TC_CR_137**: Tab order within prescription card
  - Press Tab through prescription
  - Expected: Medicine Name → Dosage → Frequency → Duration → Instructions → Status → Notes → Next card

---

### **33. Accessibility Tests**

- **TC_CR_138**: Required field indicators
  - Expected: All required fields marked with asterisk

- **TC_CR_139**: Error message visibility
  - Trigger validation error
  - Expected: Error messages visible with appropriate color

- **TC_CR_140**: Placeholder text for guidance
  - Expected: All text fields have descriptive placeholders

- **TC_CR_141**: Color contrast for status indicators
  - Expected: Status dots have sufficient contrast

---

### **34. API Integration Tests**

- **TC_CR_142**: Fetch patients on mount
  - Component mounts
  - Expected: patientService.getAllPatients() called

- **TC_CR_143**: Fetch doctors on mount
  - Component mounts
  - Expected: doctorService.getAllDoctors() called

- **TC_CR_144**: Fetch appointment when appointmentId exists
  - Navigate with appointmentId
  - Expected: appointmentService.getAppointmentById(appointmentId) called

- **TC_CR_145**: Fetch medical record for DONE appointment
  - Appointment status = DONE
  - Expected: consultationRemarksService.getReportByAppointmentId(appointmentId) called

- **TC_CR_146**: Create consultation API call
  - Submit in CREATE mode
  - Expected: createConsultationReport(payload) called

- **TC_CR_147**: Update consultation API call
  - Submit in EDIT mode
  - Expected: consultationRemarksService.updateReport(medicalRecordId, payload) called

- **TC_CR_148**: Update appointment status API call
  - Create consultation in appointment mode
  - Expected: appointmentService.updateAppointment(appointmentId, { status: 'DONE' }) called

---

### **35. Field Placeholder Tests**

- **TC_CR_149**: Remarks placeholder
  - Expected: "Enter consultation remarks..."

- **TC_CR_150**: Keypoints placeholder
  - Expected: "Enter key points from consultation..."

- **TC_CR_151**: Diagnosis placeholder
  - Expected: "Enter diagnosis..."

- **TC_CR_152**: Medicine name placeholder
  - Expected: "e.g., Paracetamol 500mg"

- **TC_CR_153**: Duration placeholder
  - Expected: "Duration of treatment"

- **TC_CR_154**: Instructions placeholder
  - Expected: "e.g., Take with food, Swallow whole, Do not crush"

- **TC_CR_155**: Notes placeholder
  - Expected: "Any additional notes, warnings, or comments..."

---

### **36. Chip Styling Tests**

- **TC_CR_156**: Appointment info chips are outlined
  - Expected: variant="outlined" for appointment, type, and status chips

- **TC_CR_157**: Mode chips are filled
  - Expected: variant="filled" for "Viewing Existing Record" and "Creating New Record" chips

- **TC_CR_158**: Type chip color for FOLLOW_UP
  - Expected: color="success"

- **TC_CR_159**: Type chip color for EMERGENCY
  - Expected: color="error"

- **TC_CR_160**: Status chip color for DONE
  - Expected: color="success"

- **TC_CR_161**: Status chip color for CANCEL
  - Expected: color="error"

---

### **37. Prescription Card Styling Tests**

- **TC_CR_162**: Card background color
  - Expected: bgcolor="background.paper"

- **TC_CR_163**: Card border
  - Expected: Border with borderColor="divider"

- **TC_CR_164**: Card border radius
  - Expected: borderRadius=2

- **TC_CR_165**: Card hover effect
  - Hover over card
  - Expected: borderColor="primary.main", boxShadow=2

- **TC_CR_166**: Notes field background
  - Expected: bgcolor="grey.50"

---

## **Integration Test Cases**

- **TC_INT_CR_001**: Create consultation from SCHEDULED appointment
  - From AppointmentList, click consultation on SCHEDULED appointment
  - Fill form and submit
  - Expected: Consultation created, appointment marked as DONE

- **TC_INT_CR_002**: View consultation from DONE appointment
  - From AppointmentList, click consultation on DONE appointment
  - Expected: Form pre-filled with existing data, EDIT mode

- **TC_INT_CR_003**: Update existing consultation
  - Load EDIT mode
  - Modify diagnosis
  - Submit form
  - Expected: Consultation updated, success notification

- **TC_INT_CR_004**: Standalone consultation creation
  - Navigate to /consultation-remarks
  - Select patient and doctor
  - Fill form and submit
  - Expected: Consultation created, form resets

- **TC_INT_CR_005**: Follow-up consultation
  - Load from FOLLOW_UP appointment type
  - Expected: isFollowUp flag set appropriately

---

## **Data Persistence Tests**

- **TC_DATA_CR_001**: Form data persistence on validation error
  - Fill form with invalid data
  - Submit (validation fails)
  - Expected: All entered data remains in fields

- **TC_DATA_CR_002**: Prescription data persistence on validation error
  - Add 2 prescriptions, fill first, leave second empty
  - Submit
  - Expected: Both prescriptions remain, errors shown for empty fields

---

## **Performance Tests**

- **TC_PERF_CR_001**: Large number of prescriptions
  - Add 20 prescriptions
  - Expected: Form remains responsive, no lag

- **TC_PERF_CR_002**: Rapid field updates
  - Type quickly in remarks field
  - Expected: No input lag

- **TC_PERF_CR_003**: Multiple prescription updates
  - Modify multiple prescription fields rapidly
  - Expected: State updates correctly without lag
