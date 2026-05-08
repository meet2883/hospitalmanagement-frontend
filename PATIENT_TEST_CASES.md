# Test Cases for PatientForm.jsx and PatientList.jsx

---

## **PatientForm.jsx Test Cases**

### **1. Form Validation Tests**

- **TC_PF_001**: Verify patient name is required
  - Submit form without patient name
  - Expected: Error message "Patient name is required"

- **TC_PF_002**: Verify gender is required
  - Submit form without selecting gender
  - Expected: Error message "Gender is required"

- **TC_PF_003**: Verify phone number validation
  - Enter phone number with less than 10 digits
  - Submit form
  - Expected: Error message "Please enter a valid 10-digit phone number"

- **TC_PF_004**: Verify phone number validation with non-digits
  - Enter "abcdefghij" as phone number
  - Submit form
  - Expected: Error message "Please enter a valid 10-digit phone number"

- **TC_PF_005**: Verify age is required
  - Submit form without age
  - Expected: Error message "Age is required"

- **TC_PF_006**: Verify age range validation (negative)
  - Enter age = -5
  - Submit form
  - Expected: Error message "Please enter a valid age"

- **TC_PF_007**: Verify age range validation (too high)
  - Enter age = 200
  - Submit form
  - Expected: Error message "Please enter a valid age"

- **TC_PF_008**: Verify age boundary (0)
  - Enter age = 0
  - Submit form
  - Expected: Form accepts and saves

- **TC_PF_009**: Verify age boundary (150)
  - Enter age = 150
  - Submit form
  - Expected: Form accepts and saves

---

### **2. Create Patient Tests**

- **TC_PF_010**: Create new patient with all fields
  - Fill all required and optional fields
  - Submit form
  - Expected: Patient created successfully, navigates to /patients

- **TC_PF_011**: Create patient with only required fields
  - Fill: patientName, gender, phoneNumber, age
  - Leave optional fields empty
  - Submit form
  - Expected: Patient created successfully

- **TC_PF_012**: Create patient with insurance
  - Select insurance from dropdown
  - Submit form
  - Expected: Patient created with insurance association

- **TC_PF_013**: Create patient with date of birth
  - Select date from date picker
  - Submit form
  - Expected: Date saved in correct format

- **TC_PF_014**: Create patient with address
  - Enter address in multiline field
  - Submit form
  - Expected: Address saved correctly

---

### **3. Edit Patient Tests**

- **TC_PF_015**: Load existing patient data
  - Navigate to /patients/:id/edit
  - Expected: Form pre-filled with existing patient data

- **TC_PF_016**: Verify edit mode title
  - Navigate to /patients/:id/edit
  - Expected: Title shows "Edit Patient"

- **TC_PF_017**: Update patient information
  - Modify patient name
  - Submit form
  - Expected: Patient updated successfully

- **TC_PF_018**: Update patient and change insurance
  - Change insurance selection
  - Submit form
  - Expected: Patient updated with new insurance

- **TC_PF_019**: Verify submit button text in edit mode
  - Navigate to /patients/:id/edit
  - Expected: Button shows "Update Patient"

---

### **4. Blood Group Selection Tests**

- **TC_PF_020**: Select blood group A+
  - Select "A+" from dropdown
  - Submit form
  - Expected: Blood group saved as "A+"

- **TC_PF_021**: Select blood group A-
  - Select "A-" from dropdown
  - Submit form
  - Expected: Blood group saved as "A-"

- **TC_PF_022**: Select blood group B+
  - Select "B+" from dropdown
  - Submit form
  - Expected: Blood group saved as "B+"

- **TC_PF_023**: Select blood group B-
  - Select "B-" from dropdown
  - Submit form
  - Expected: Blood group saved as "B-"

- **TC_PF_024**: Select blood group AB+
  - Select "AB+" from dropdown
  - Submit form
  - Expected: Blood group saved as "AB+"

- **TC_PF_025**: Select blood group AB-
  - Select "AB-" from dropdown
  - Submit form
  - Expected: Blood group saved as "AB-"

- **TC_PF_026**: Select blood group O+
  - Select "O+" from dropdown
  - Submit form
  - Expected: Blood group saved as "O+"

- **TC_PF_027**: Select blood group O-
  - Select "O-" from dropdown
  - Submit form
  - Expected: Blood group saved as "O-"

- **TC_PF_028**: Leave blood group empty
  - Leave blood group field as "None"
  - Submit form
  - Expected: Form submits, blood group saved as null or empty

---

### **5. Gender Selection Tests**

- **TC_PF_029**: Select Male gender
  - Select "Male" from radio button
  - Submit form
  - Expected: Gender saved as "Male"

- **TC_PF_030**: Select Female gender
  - Select "Female" from radio button
  - Submit form
  - Expected: Gender saved as "Female"

- **TC_PF_031**: Select Other gender
  - Select "Other" from radio button
  - Submit form
  - Expected: Gender saved as "Other"

---

### **6. Date of Birth Tests**

- **TC_PF_032**: Enter date of birth via date picker
  - Click date picker
  - Select date
  - Submit form
  - Expected: Date saved in correct format

- **TC_PF_033**: Clear date of birth
  - Select date then clear
  - Submit form
  - Expected: Form submits without date of birth

- **TC_PF_034**: Verify date format on edit
  - Create patient with date of birth
  - Edit patient
  - Expected: Date picker shows correct date

---

### **7. Insurance Selection Tests**

- **TC_PF_035**: Select insurance from dropdown
  - Click insurance dropdown
  - Select an option
  - Submit form
  - Expected: Patient associated with selected insurance

- **TC_PF_036**: Clear insurance selection
  - Select insurance then clear
  - Submit form
  - Expected: Patient saved without insurance

- **TC_PF_037**: Insurance autocomplete filtering
  - Type in insurance autocomplete
  - Expected: Options filtered based on input

---

### **8. Address Field Tests**

- **TC_PF_038**: Enter single line address
  - Type address without line breaks
  - Submit form
  - Expected: Address saved correctly

- **TC_PF_039**: Enter multiline address
  - Type address with line breaks
  - Submit form
  - Expected: Address saved with line breaks preserved

- **TC_PF_040**: Leave address empty
  - Leave address field empty
  - Submit form
  - Expected: Form submits successfully

---

### **9. Navigation Tests**

- **TC_PF_041**: Back button navigation
  - Click "Back to Patients" button
  - Expected: Navigates to /patients page

- **TC_PF_042**: Cancel button navigation
  - Click Cancel button
  - Expected: Navigates to /patients page without saving

- **TC_PF_043**: Post-submit navigation (create)
  - Submit valid form for new patient
  - Expected: Navigates to /patients page

- **TC_PF_044**: Post-submit navigation (update)
  - Submit valid form for existing patient
  - Expected: Navigates to /patients page

---

### **10. Clear Error Tests**

- **TC_PF_045**: Clear patient name error on input
  - Submit without patient name (error shows)
  - Start typing in patient name field
  - Expected: Error clears immediately

- **TC_PF_046**: Clear gender error on selection
  - Submit without gender (error shows)
  - Select gender option
  - Expected: Error clears

- **TC_PF_047**: Clear phone error on valid input
  - Enter invalid phone number (error shows)
  - Enter valid 10-digit phone number
  - Expected: Error clears

- **TC_PF_048**: Clear age error on valid input
  - Enter invalid age (error shows)
  - Enter valid age
  - Expected: Error clears

---

### **11. Form Display Tests**

- **TC_PF_049**: Verify create mode title
  - Navigate to /patients/new
  - Expected: Title shows "Add New Patient"

- **TC_PF_050**: Verify required field indicators
  - View form
  - Expected: Required fields marked with asterisk

- **TC_PF_051**: Verify field labels
  - Expected labels: Patient Name, Gender, Phone Number, Age, Blood Group, Date of Birth, Address, Insurance

---

### **12. Data Persistence Tests**

- **TC_PF_052**: Form data persistence on error
  - Fill form with invalid data (missing required fields)
  - Submit (validation fails)
  - Expected: All entered data remains in fields

- **TC_PF_053**: Reset after successful save (create)
  - Submit valid form successfully
  - Expected: Form redirects to patient list

- **TC_PF_054**: Reset after successful save (update)
  - Edit and submit valid form
  - Expected: Form redirects to patient list

---

### **13. API Integration Tests**

- **TC_PF_055**: Create patient API call
  - Submit valid form for new patient
  - Expected: POST to patient create endpoint with patient data

- **TC_PF_056**: Update patient API call
  - Submit valid form for existing patient
  - Expected: PUT to patient update endpoint with patient data and ID

- **TC_PF_057**: Fetch patient on edit load
  - Navigate to /patients/:id/edit
  - Expected: GET to patient endpoint to fetch patient data

- **TC_PF_058**: Fetch insurance options
  - Load form
  - Expected: Insurance options loaded for dropdown

---

### **14. Error Handling Tests**

- **TC_PF_059**: Handle create API error
  - Create API returns error
  - Expected: Error notification shown, form doesn't clear

- **TC_PF_060**: Handle update API error
  - Update API returns error
  - Expected: Error notification shown

- **TC_PF_061**: Handle fetch patient error
  - Navigate to edit but API fails
  - Expected: Error notification shown

- **TC_PF_062**: Handle network error
  - Network connection lost during submit
  - Expected: Appropriate error message displayed

---

### **15. Responsive Design Tests**

- **TC_PF_063**: Mobile view layout
  - View on small screen (xs)
  - Expected: Fields stack in single column

- **TC_PF_064**: Tablet view layout
  - View on medium screen (sm/md)
  - Expected: Fields show in 2 columns

- **TC_PF_065**: Desktop view layout
  - View on large screen
  - Expected: Fields show in 2 columns with proper spacing

---

### **16. Edge Case Tests**

- **TC_PF_066**: Very long patient name
  - Enter 200+ character name
  - Submit form
  - Expected: Field accepts input, saves correctly

- **TC_PF_067**: Special characters in name
  - Enter name with apostrophes, hyphens, spaces
  - Submit form
  - Expected: Name saved correctly

- **TC_PF_068**: Special characters in address
  - Enter address with special characters, commas, line breaks
  - Submit form
  - Expected: Address saves correctly

- **TC_PF_069**: Phone number with spaces
  - Enter "99887 76655" (with space)
  - Submit form
  - Expected: Validation fails (not 10 continuous digits)

- **TC_PF_070**: Phone number with special characters
  - Enter "+91-9988776655"
  - Submit form
  - Expected: Validation fails (not exactly 10 digits)

---

### **17. Accessibility Tests**

- **TC_PF_071**: Tab navigation
  - Use Tab key through form
  - Expected: Logical tab order, all fields accessible

- **TC_PF_072**: Required field indicators
  - Expected: All required fields marked with asterisk

- **TC_PF_073**: Error message association
  - Trigger validation error
  - Expected: Error message displayed with field

- **TC_PF_074**: Gender radio group accessibility
  - Use arrow keys in radio group
  - Expected: Can navigate between options

---

## **PatientList.jsx Test Cases**

### **1. Page Load Tests**

- **TC_PL_001**: Verify page loads successfully
  - Navigate to /patients
  - Expected: Page loads with patient list table

- **TC_PL_002**: Verify loading state
  - While data is fetching
  - Expected: Loading indicator or "Loading..." message displayed

- **TC_PL_003**: Verify table columns
  - View patient list table
  - Expected columns: Name, Age, Gender, Phone, Blood Group, Insurance, Actions

---

### **2. Role-Based Access Control Tests**

- **TC_PL_004**: Verify "Add Patient" button for ADMIN
  - Login as ADMIN
  - Expected: "Add Patient" button visible and enabled

- **TC_PL_005**: Verify "Add Patient" button hidden for non-ADMIN
  - Login as EMPLOYEE or DOCTOR
  - Expected: "Add Patient" button NOT visible

- **TC_PL_006**: Verify Edit button for ADMIN
  - Login as ADMIN
  - View patient list
  - Expected: Edit icon visible in actions column

- **TC_PL_007**: Verify Edit button for DOCTOR
  - Login as DOCTOR
  - View patient list
  - Expected: Edit icon visible in actions column

- **TC_PL_008**: Verify Edit button hidden for EMPLOYEE
  - Login as EMPLOYEE
  - View patient list
  - Expected: Edit icon NOT visible

- **TC_PL_009**: Verify Delete button for ADMIN
  - Login as ADMIN
  - View patient list
  - Expected: Delete icon visible in actions column

- **TC_PL_010**: Verify Delete button hidden for DOCTOR
  - Login as DOCTOR
  - View patient list
  - Expected: Delete icon NOT visible

- **TC_PL_011**: Verify Actions column for EMPLOYEE
  - Login as EMPLOYEE
  - View patient list
  - Expected: Actions column NOT visible

---

### **3. Server-Side Filtering Tests**

- **TC_PL_012**: Filter by patient name (debounced)
  - Type "John" in patient name filter
  - Wait 500ms (debounce)
  - Expected: API called with name parameter

- **TC_PL_013**: Filter by phone number (debounced)
  - Enter phone number in filter
  - Wait 500ms (debounce)
  - Expected: API called with phoneNumber parameter

- **TC_PL_014**: Filter by gender
  - Select "Male" from gender dropdown
  - Expected: Immediate API call with gender parameter

- **TC_PL_015**: Filter by blood group
  - Select "A+" from blood group dropdown
  - Expected: Immediate API call with bloodgroup parameter

- **TC_PL_016**: Multiple filters combination
  - Set patient name AND gender
  - Wait 500ms
  - Expected: API called with both parameters

- **TC_PL_017**: Filter with all four filters
  - Set name, phone, gender, blood group
  - Wait for debounce
  - Expected: API called with all four parameters

- **TC_PL_018**: Clear all filters
  - Apply multiple filters
  - Click "Clear All" button
  - Expected: API called without parameters, all patients shown

- **TC_PL_019**: Clear filters resets page to 0
  - Apply filters on page 3
  - Clear filters
  - Expected: Page resets to 0

---

### **4. Debounce Tests**

- **TC_PL_020**: Verify debounce on name input
  - Type quickly in patient name field
  - Stop typing
  - Expected: API call only after 500ms of no typing

- **TC_PL_021**: Verify debounce on phone input
  - Type quickly in phone field
  - Stop typing
  - Expected: API call only after 500ms of no typing

- **TC_PL_022**: Multiple keystrokes before debounce completes
  - Type "John" quickly
  - Delete and type "Jane" before debounce
  - Expected: Only final value "Jane" sent after 500ms

- **TC_PL_023**: Dropdown immediate execution
  - Select gender option
  - Expected: API call immediately (no debounce)

- **TC_PL_024**: Blood group dropdown immediate execution
  - Select blood group option
  - Expected: API call immediately (no debounce)

---

### **5. Active Filter Indicators Tests**

- **TC_PL_025**: Active filter count badge (1 filter)
  - Apply 1 filter
  - Expected: Badge shows "1 active"

- **TC_PL_026**: Active filter count badge (multiple filters)
  - Apply 3 filters
  - Expected: Badge shows "3 active"

- **TC_PL_027**: Clear button appears with active filters
  - Apply any filter
  - Expected: "Clear All" button becomes visible

- **TC_PL_028**: Clear button hidden with no filters
  - Clear all filters
  - Expected: "Clear All" button disappears

- **TC_PL_029**: Filter results summary
  - Apply filters
  - Expected: Alert shows "Found X patient(s) matching your criteria"

- **TC_PL_030**: No filters applied
  - View without filters
  - Expected: No badge, no Clear button, no summary alert

---

### **6. Table Display Tests**

- **TC_PL_031**: Verify patient name column
  - View table
  - Expected: Patient names displayed correctly

- **TC_PL_032**: Verify age column
  - View table
  - Expected: Ages displayed as numbers

- **TC_PL_033**: Verify gender column
  - View table
  - Expected: Gender displayed as "Male", "Female", or "Other"

- **TC_PL_034**: Verify phone column
  - View table
  - Expected: Phone numbers displayed correctly

- **TC_PL_035**: Verify blood group column (with value)
  - View patient with blood group "A+"
  - Expected: Displayed as colored chip with "A+"

- **TC_PL_036**: Verify blood group column (empty)
  - View patient without blood group
  - Expected: Shows "N/A" (not a chip)

---

### **7. Sorting Tests**

- **TC_PL_037**: Sort by name ascending
  - Click "Name" column header
  - Expected: Patients sorted A-Z

- **TC_PL_038**: Sort by name descending
  - Click "Name" column header twice
  - Expected: Patients sorted Z-A

- **TC_PL_039**: Sort by age ascending
  - Click "Age" column header
  - Expected: Patients sorted youngest to oldest

- **TC_PL_040**: Sort by age descending
  - Click "Age" column header twice
  - Expected: Patients sorted oldest to youngest

- **TC_PL_041**: Sort by gender
  - Click "Gender" column header
  - Expected: Patients sorted by gender alphabetically

- **TC_PL_042**: Sort indicator display
  - Click column header
  - Expected: Sort arrow indicator shows direction

---

### **8. Pagination Tests**

- **TC_PL_043**: Default pagination
  - View patient list
  - Expected: 5 rows per page, page 0

- **TC_PL_044**: Change rows per page to 10
  - Select 10 from dropdown
  - Expected: Shows 10 rows, page resets to 0

- **TC_PL_045**: Change rows per page to 25
  - Select 25 from dropdown
  - Expected: Shows 25 rows, page resets to 0

- **TC_PL_046**: Change rows per page to 50
  - Select 50 from dropdown
  - Expected: Shows 50 rows, page resets to 0

- **TC_PL_047**: Navigate to next page
  - Click next page button
  - Expected: Page increments, shows next set of rows

- **TC_PL_048**: Navigate to previous page
  - Click previous page button
  - Expected: Page decrements, shows previous rows

- **TC_PL_049**: Pagination with filters
  - Apply filters
  - Change page
  - Expected: Pagination applies to filtered results

- **TC_PL_050**: Pagination with sorting
  - Sort by name
  - Change page
  - Expected: Sort maintained across pages

---

### **9. Insurance Display Tests**

- **TC_PL_051**: Patient with insurance
  - View patient with insurance
  - Expected: Shows "{policyName} - {policyProvider}"

- **TC_PL_052**: Patient without insurance
  - View patient without insurance
  - Expected: Shows "None"

- **TC_PL_053**: Insurance with null policy name
  - View patient with insurance but no policy name
  - Expected: Shows "None" or handles gracefully

---

### **10. Action Buttons Tests**

- **TC_PL_054**: Click edit button
  - Click edit icon
  - Expected: Navigates to /patients/{id}/edit

- **TC_PL_055**: Click delete button
  - Click delete icon
  - Expected: Delete confirmation dialog opens

- **TC_PL_056**: Delete dialog content
  - Open delete dialog
  - Expected: Shows "Are you sure..." message, Cancel and Delete buttons

- **TC_PL_057**: Confirm delete
  - Click Delete button in dialog
  - Expected: Delete API called, patient removed from list on success

- **TC_PL_058**: Cancel delete
  - Click Cancel button in dialog
  - Expected: Dialog closes, patient not deleted

- **TC_PL_059**: Close delete dialog with X
  - Click X or outside dialog
  - Expected: Dialog closes, patient not deleted

---

### **11. Empty State Tests**

- **TC_PL_060**: No patients found with filters
  - Apply filters that match no patients
  - Expected: "No patients match your filters"

- **TC_PL_061**: No patients in system
  - No patients exist
  - Expected: "No patients found"

- **TC_PL_062**: Empty state with action button (ADMIN)
  - No patients exist, logged in as ADMIN
  - Expected: May show "Add Patient" call to action

---

### **12. Blood Group Color Tests**

- **TC_PL_063**: Blood group A+ color
  - Patient with blood group A+
  - Expected: Chip color red or predefined color for A+

- **TC_PL_064**: Blood group B+ color
  - Patient with blood group B+
  - Expected: Chip color appropriate for B+

- **TC_PL_065**: Blood group O+ color
  - Patient with blood group O+
  - Expected: Chip color appropriate for O+

- **TC_PL_066**: Blood group AB+ color
  - Patient with blood group AB+
  - Expected: Chip color appropriate for AB+

---

### **13. Filter Input Tests**

- **TC_PL_067**: Patient name filter placeholder
  - Expected: "Search patient..." or similar

- **TC_PL_068**: Phone number filter placeholder
  - Expected: "Search phone..." or similar

- **TC_PL_069**: Gender filter options
  - Expected: "All", "Male", "Female", "Other"

- **TC_PL_070**: Blood group filter options
  - Expected: "All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"

---

### **14. Count Display Tests**

- **TC_PL_071**: Count in header
  - View patient list
  - Expected: Shows total patient count

- **TC_PL_072**: Count updates with filters
  - Apply filters
  - Expected: Count shows filtered result count

- **TC_PL_073**: Count format
  - Expected: "Patients (X)" or similar format

---

### **15. Responsive Design Tests**

- **TC_PL_074**: Mobile view filters
  - View on small screen (xs)
  - Expected: Filters stack vertically (1 column)

- **TC_PL_075**: Tablet view filters
  - View on medium screen (sm)
  - Expected: Filters show in 2 columns

- **TC_PL_076**: Desktop view filters
  - View on large screen
  - Expected: Filters show in 4 columns

- **TC_PL_077**: Table responsive behavior
  - View on small screen
  - Expected: Table may scroll horizontally or stack

---

### **16. Error Handling Tests**

- **TC_PL_078**: API error handling
  - Simulate API failure
  - Expected: Error notification shown

- **TC_PL_079**: Network error handling
  - Simulate network failure
  - Expected: Appropriate error message displayed

- **TC_PL_080**: Delete error handling
  - Delete API returns error
  - Expected: Error notification shown, patient remains in list

---

### **17. Performance Tests**

- **TC_PL_081**: Large patient list
  - Load 1000+ patients
  - Expected: Page renders without lag

- **TC_PL_082**: Fast typing in filter
  - Type quickly in name filter
  - Expected: No UI lag, debounce works correctly

- **TC_PL_083**: Multiple rapid filter changes
  - Change filters 10 times rapidly
  - Expected: Only final filters trigger API call (for text inputs)

- **TC_PL_084**: Sorting large dataset
  - Sort 1000+ patients
  - Expected: Sort completes without blocking UI

---

### **18. Accessibility Tests**

- **TC_PL_085**: Tab navigation
  - Use Tab key through filters and table
  - Expected: Logical tab order, all interactive elements accessible

- **TC_PL_086**: Filter label association
  - Expected: All filter inputs have associated labels

- **TC_PL_087**: Table header accessibility
  - Expected: Column headers properly marked as headers

- **TC_PL_088**: Sort button accessibility
  - Expected: Sort controls are keyboard accessible

---

## **Integration Test Cases**

### **Patient Management Integration**

- **TC_INT_001**: Create patient through list
  - From PatientList, click "Add Patient"
  - Fill form and submit
  - Expected: Returns to PatientList with new patient visible

- **TC_INT_002**: Edit patient through list
  - From PatientList, click edit icon
  - Modify patient name
  - Submit form
  - Expected: Returns to PatientList with updated name visible

- **TC_INT_003**: Filter then edit patient
  - Apply patient name filter
  - Click edit on filtered result
  - Modify and save
  - Expected: Returns to filtered list with updated data

- **TC_INT_004**: Delete patient
  - From PatientList, click delete icon
  - Confirm deletion
  - Expected: Patient removed from list, success notification

- **TC_INT_005**: Filter then delete patient
  - Apply filters
  - Delete patient from filtered results
  - Expected: Patient removed, list refreshes with updated filters

- **TC_INT_006**: Create with insurance
  - Create patient with insurance
  - View in list
  - Expected: Insurance displayed correctly

- **TC_INT_007**: Edit insurance
  - Edit patient
  - Change insurance
  - Expected: Insurance updated in list

---

## **Edge Case Tests**

- **TC_EDGE_001**: Very long patient name
  - Enter 200+ character name
  - Expected: Field accepts input, saves correctly

- **TC_EDGE_002**: Special characters in name
  - Enter name with special characters
  - Expected: Saves correctly

- **TC_EDGE_003**: Special characters in address
  - Enter address with special characters
  - Expected: Address saves correctly

- **TC_EDGE_004**: Age boundary (0)
  - Enter age = 0
  - Expected: Form accepts and saves

- **TC_EDGE_005**: Age boundary (150)
  - Enter age = 150
  - Expected: Form accepts and saves

- **TC_EDGE_006**: Phone number with spaces
  - Enter "99887 76655"
  - Expected: Validation fails (not 10 continuous digits)

- **TC_EDGE_007**: Clear filters while loading
  - Apply filter
  - Clear before API returns
  - Expected: Latest clear request takes precedence

- **TC_EDGE_008**: Rapid filter changes
  - Change multiple filters quickly
  - Expected: Each change triggers appropriate debounce/immediate call

- **TC_EDGE_009**: Duplicate patient names
  - Create multiple patients with same name
  - Expected: All displayed correctly in list

- **TC_EDGE_010**: Empty database
  - No patients in database
  - Expected: Appropriate empty state shown

---

## **Data Persistence Tests**

- **TC_DATA_001**: Form data persistence on error
  - Fill form with invalid data
  - Submit (validation fails)
  - Expected: All entered data remains in fields

- **TC_DATA_002**: Reset after successful save
  - Submit valid form successfully
  - Expected: Form redirects to list page

- **TC_DATA_003**: Edit preserves existing data
  - Load edit form
  - Expected: All fields pre-filled with existing data

- **TC_DATA_004**: Cancel discards changes
  - Edit patient, make changes, click Cancel
  - Expected: Changes discarded, returns to list

---

## **Security Tests**

- **TC_SEC_001**: Role-based create access
  - Login as non-ADMIN
  - Try to create patient via URL
  - Expected: Access denied or button hidden

- **TC_SEC_002**: Role-based delete access
  - Login as DOCTOR
  - Try to delete patient
  - Expected: Delete button not visible or access denied

- **TC_SEC_003**: Role-based edit access
  - Login as EMPLOYEE
  - Try to edit patient
  - Expected: Edit button not visible or access denied

---

## **API Integration Tests**

- **TC_API_001**: Fetch all patients on load
  - Load patient list
  - Expected: GET to patient endpoint

- **TC_API_002**: Fetch with filters
  - Apply filters
  - Expected: GET with query parameters for filters

- **TC_API_003**: Create patient
  - Submit create form
  - Expected: POST to patient endpoint with patient data

- **TC_API_004**: Update patient
  - Submit edit form
  - Expected: PUT to patient endpoint with ID and updated data

- **TC_API_005**: Delete patient
  - Confirm delete
  - Expected: DELETE to patient endpoint with ID

- **TC_API_006**: Fetch insurance options
  - Load form
  - Expected: GET to insurance endpoint for options

---

## **Field Validation Tests**

- **TC_VAL_001**: Patient name required
  - Submit without name
  - Expected: "Patient name is required"

- **TC_VAL_002**: Patient name max length
  - Enter 500+ character name
  - Expected: Either accepts or shows max length error

- **TC_VAL_003**: Phone number exact 10 digits
  - Enter 9 digits
  - Expected: Validation error

- **TC_VAL_004**: Phone number exact 10 digits (excess)
  - Enter 11 digits
  - Expected: Validation error

- **TC_VAL_005**: Age numeric only
  - Enter "abc" in age
  - Expected: Validation error or prevents input

- **TC_VAL_006**: Age range validation
  - Enter -5 or 200
  - Expected: "Please enter a valid age"

---

## **Test Data Examples**

### **Valid Patient Data**
```json
{
  "patientName": "John Doe",
  "gender": "Male",
  "phoneNumber": "9876543210",
  "age": 35,
  "bloodGroup": "A+",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main Street\nCity, State - 12345",
  "insurance": {
    "id": 1,
    "policyName": "Health Plus",
    "policyProvider": "ABC Insurance"
  }
}
```

### **Minimal Valid Patient Data**
```json
{
  "patientName": "Jane Smith",
  "gender": "Female",
  "phoneNumber": "9876543210",
  "age": 28
}
```

### **Invalid Patient Data Examples**
- Missing patientName
- Missing gender
- phoneNumber with 9 digits
- phoneNumber with letters
- age = -1
- age = 200
- Empty gender selection

---

## **Test Execution Checklist**

### **Pre-Test Setup**
- [ ] Test database configured
- [ ] Test users created (ADMIN, DOCTOR, EMPLOYEE)
- [ ] Sample patient data seeded
- [ ] Sample insurance data seeded

### **PatientForm Testing**
- [ ] All validation rules tested
- [ ] Create flow tested
- [ ] Edit flow tested
- [ ] Error handling tested
- [ ] Responsive design tested

### **PatientList Testing**
- [ ] Filter functionality tested
- [ ] Sorting tested
- [ ] Pagination tested
- [ ] Role-based access tested
- [ ] Action buttons tested

### **Integration Testing**
- [ ] Create → List flow tested
- [ ] Edit → List flow tested
- [ ] Delete flow tested
- [ ] Filter → Edit flow tested

---

## **Bug Tracking Template**

| Bug ID | Test Case | Description | Severity | Status |
|--------|-----------|-------------|----------|--------|
| BUG-001 | TC_PF_003 | Phone validation accepts 11 digits | High | Open |
| BUG-002 | TC_PL_015 | Filters don't reset on clear | Medium | Fixed |
| | | | | |

---

## **Notes**

- All date fields should use consistent format (ISO or local)
- Phone number validation should be exactly 10 digits
- Blood group chips should have consistent color coding
- Role-based access should be tested for all user types
- Debounce timing is 500ms for text inputs
- Dropdown filters trigger immediate API calls
