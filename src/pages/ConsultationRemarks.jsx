import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Paper,
  Autocomplete,
  createFilterOptions,
  Chip
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Notes as NotesIcon,
  Event as EventIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { patientService } from '../services/patientService'
import { doctorService } from '../services/doctorService'
import { appointmentService } from '../services/appointmentService'
import { consultationRemarksService } from '../services/consultationRemarkService'
import { get } from 'lodash'

const ConsultationRemarks = () => {
  const navigate = useNavigate()
  const { appointmentId } = useParams()
  const { showNotification, createConsultationReport, user } = useApp()

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState(null)
  const [isAppointmentMode, setIsAppointmentMode] = useState(false)
  const [isFollowUp, setIsFollowUp] = useState(false)
  const [existingMedicalRecord, setExistingMedicalRecord] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [medicalRecordId, setMedicalRecordId] = useState(null)
  const [consultationMode, setConsultationMode] = useState('create') // 'create' or 'edit'

  const [formData, setFormData] = useState({
    patient: null,
    doctor: null,
    patientId: '',
    doctorId: '',
    remarks: '',
    keypoints: '',
    diagnosis: '',
  })

  const [prescriptions, setPrescriptions] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', status: 'ACTIVE', notes: '' }
  ])

  const [errors, setErrors] = useState({})

  // Fetch patients, doctors, and appointment (if appointmentId exists) on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          patientService.getAllPatients(),
          doctorService.getAllDoctors()
        ])
        setPatients(patientsData)
        setDoctors(doctorsData)

        // If appointmentId exists, fetch appointment details and pre-fill form
        if (appointmentId) {
          setIsAppointmentMode(true)

          // Fetch appointment details for display (date, type, status, etc.)
          const appointmentData = await appointmentService.getAppointmentById(appointmentId)
          setAppointment(appointmentData)

          // Also fetch medical record - this might return null if no consultation exists yet
          let medicalRecord = null
          try {
            medicalRecord = await consultationRemarksService.getReportByAppointmentId(appointmentId)
          } catch (error) {
            // 404 is expected for new consultations - not an actual error
            if (error.response?.status !== 404) {
              console.error('Error fetching medical record:', error)
            }
            // medicalRecord stays null, which is expected for new consultations
          }

          // Check appointment status and determine consultation mode
          const isAppointmentDone = appointmentData.status === 'DONE' || appointmentData.status === 1

          // Pre-fill patient and doctor - find actual objects from arrays
          const selectedPatient = patientsData.data.find(p => p.id === appointmentData?.patient?.id)
          const selectedDoctor = doctorsData.find(d => d.id === appointmentData?.doctor?.id)

          if (isAppointmentDone && medicalRecord && medicalRecord.id) {
            // DONE status with existing medical record - edit mode
            setConsultationMode('edit')
            setIsEditMode(true)
            setExistingMedicalRecord(medicalRecord)
            setMedicalRecordId(medicalRecord.id)

            setFormData(prev => ({
              ...prev,
              patient: selectedPatient || null,
              doctor: selectedDoctor || null,
              patientId: appointmentData.patientId || '',
              doctorId: appointmentData.doctorId || '',
              remarks: medicalRecord.remarks || medicalRecord.remark || '',
              keypoints: medicalRecord.keyPoints || medicalRecord.keypoint || '',
              diagnosis: medicalRecord.diagnosis || '',
            }))

            // Pre-fill prescriptions if they exist
            if (medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0) {
              const mappedPrescriptions = medicalRecord.prescriptions.map(presc => ({
                medicineName: presc.medicineName || presc.medicinename || presc.medicine_name || '',
                dosage: presc.dosage || '',
                frequency: normalizeFrequency(presc.frequency || ''),
                duration: presc.duration || '',
                instructions: presc.instructions || '',
                status: normalizeStatus(presc.status),
                notes: presc.notes || presc.note || ''
              }))
              setPrescriptions(mappedPrescriptions)
            }
          } else if (isAppointmentDone && !medicalRecord) {
            // DONE status but no medical record - data integrity issue
            showNotification('No consultation record found for completed appointment. Creating new record.', 'warning')
            setConsultationMode('create')
            setIsEditMode(false)

            const selectedPatient = patientsData.data.find(p => p.id === appointmentData?.patient?.id)
            const selectedDoctor = doctorsData.find(d => d.id === appointmentData?.doctor?.id)

            setFormData(prev => ({
              ...prev,
              patient: selectedPatient || null,
              doctor: selectedDoctor || null,
              patientId: appointmentData.patientId || '',
              doctorId: appointmentData.doctorId || '',
            }))
          } else {
            // SCHEDULE status - create new consultation
            setConsultationMode('create')
            setIsEditMode(false)

            const selectedPatient = patientsData.data.find(p => p.id === appointmentData?.patient?.id)
            const selectedDoctor = doctorsData.find(d => d.id === appointmentData?.doctor?.id)

            setFormData(prev => ({
              ...prev,
              patient: selectedPatient || null,
              doctor: selectedDoctor || null,
              patientId: appointmentData.patientId || '',
              doctorId: appointmentData.doctorId || '',
            }))
          }

          // Check if this is a follow-up appointment type
          if (appointmentData.type === 'FOLLOW_UP') {
            setIsFollowUp(true)
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error)
        // Show specific error message based on what failed
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load data'
        showNotification(errorMessage, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [appointmentId, showNotification])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Add new prescription
  const handleAddPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', status: 'ACTIVE', notes: '' }
    ])
  }

  // Remove prescription
  const handleRemovePrescription = (index) => {
    if (prescriptions.length > 1) {
      const newPrescriptions = prescriptions.filter((_, i) => i !== index)
      setPrescriptions(newPrescriptions)
    } else {
      showNotification('At least one prescription is required', 'warning')
    }
  }

  // Helper function to map various frequency formats to standard format
  const normalizeFrequency = (frequency) => {
    if (!frequency) return ''

    const frequencyMapping = {
      // Various formats of "Once daily"
      'once_daily': 'Once daily',
      'ONCE_DAILY': 'Once daily',
      'Once-Daily': 'Once daily',
      'once-daily': 'Once daily',
      'Once Daily': 'Once daily',

      // Various formats of "Twice daily"
      'twice_daily': 'Twice daily',
      'TWICE_DAILY': 'Twice daily',
      'Twice-Daily': 'Twice daily',
      'twice-daily': 'Twice daily',
      'Twice Daily': 'Twice daily',

      // Various formats of "Three times daily"
      'three_times_daily': 'Three times daily',
      'THREE_TIMES_DAILY': 'Three times daily',
      'Three-Times-Daily': 'Three times daily',
      'three-times-daily': 'Three times daily',
      'Three Times Daily': 'Three times daily',

      // Various formats of "Four times daily"
      'four_times_daily': 'Four times daily',
      'FOUR_TIMES_DAILY': 'Four times daily',
      'Four-Times-Daily': 'Four times daily',
      'four-times-daily': 'Four times daily',
      'Four Times Daily': 'Four times daily',

      // Various formats of "Every X hours"
      'every_4_hours': 'Every 4 hours',
      'EVERY_4_HOURS': 'Every 4 hours',
      'Every-4-Hours': 'Every 4 hours',
      'every-4-hours': 'Every 4 hours',
      'Every 4 Hours': 'Every 4 hours',

      'every_6_hours': 'Every 6 hours',
      'EVERY_6_HOURS': 'Every 6 hours',
      'Every-6-Hours': 'Every 6 hours',
      'every-6-hours': 'Every 6 hours',
      'Every 6 Hours': 'Every 6 hours',

      'every_8_hours': 'Every 8 hours',
      'EVERY_8_HOURS': 'Every 8 hours',
      'Every-8-Hours': 'Every 8 hours',
      'every-8-hours': 'Every 8 hours',
      'Every 8 Hours': 'Every 8 hours',

      'every_12_hours': 'Every 12 hours',
      'EVERY_12_HOURS': 'Every 12 hours',
      'Every-12-Hours': 'Every 12 hours',
      'every-12-hours': 'Every 12 hours',
      'Every 12 Hours': 'Every 12 hours',

      // Various formats of "As needed"
      'as_needed': 'As needed',
      'AS_NEEDED': 'As needed',
      'As-Needed': 'As needed',
      'as-needed': 'As needed',
      'As Needed': 'As needed',
      'PRN': 'As needed',

      // Various formats of "Before meals"
      'before_meals': 'Before meals',
      'BEFORE_MEALS': 'Before meals',
      'Before-Meals': 'Before meals',
      'before-meals': 'Before meals',
      'Before Meals': 'Before meals',

      // Various formats of "After meals"
      'after_meals': 'After meals',
      'AFTER_MEALS': 'After meals',
      'After-Meals': 'After meals',
      'after-meals': 'After meals',
      'After Meals': 'After meals',

      // Various formats of "At bedtime"
      'at_bedtime': 'At bedtime',
      'AT_BEDTIME': 'At bedtime',
      'At-Bedtime': 'At bedtime',
      'at-bedtime': 'At bedtime',
      'At Bedtime': 'At bedtime',
    }

    // Return mapped value or original if not found
    return frequencyMapping[frequency] || frequency
  }

  // Helper function to normalize status values
  const normalizeStatus = (status) => {
    if (!status) return 'ACTIVE'

    const statusMapping = {
      'active': 'ACTIVE',
      'ACTIVE': 'ACTIVE',
      'done': 'DONE',
      'DONE': 'DONE',
      'stopped': 'STOPPED',
      'STOPPED': 'STOPPED',
      0: 'ACTIVE',
      1: 'DONE',
      2: 'STOPPED',
    }

    return statusMapping[status] || status
  }

  // Handle prescription field changes
  const handlePrescriptionChange = (index, field, value) => {
    const newPrescriptions = [...prescriptions]
    newPrescriptions[index][field] = value
    setPrescriptions(newPrescriptions)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.patient) {
      newErrors.patient = 'Patient is required'
    }
    if (!formData.doctor) {
      newErrors.doctor = 'Doctor is required'
    }
    if (!formData.remarks.trim()) {
      newErrors.remarks = 'Remarks are required'
    }
    if (!formData.keypoints.trim()) {
      newErrors.keypoints = 'Keypoints are required'
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required'
    }

    // Validate prescriptions
    prescriptions.forEach((prescription, index) => {
      if (!prescription.medicineName.trim()) {
        newErrors[`prescription_${index}_medicineName`] = 'Medicine name is required'
      }
      if (!prescription.dosage.trim()) {
        newErrors[`prescription_${index}_dosage`] = 'Dosage is required'
      }
      if (!prescription.frequency.trim()) {
        newErrors[`prescription_${index}_frequency`] = 'Frequency is required'
      }
      if (!prescription.duration.trim()) {
        newErrors[`prescription_${index}_duration`] = 'Duration is required'
      }
      if (!prescription.instructions.trim()) {
        newErrors[`prescription_${index}_instructions`] = 'Instructions are required'
      }
      if (!prescription.status) {
        newErrors[`prescription_${index}_status`] = 'Status is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // Prepare payload
    const payload = {
      patient: { id: formData.patient.id },
      doctor: { id: formData.doctor.id },
      remarks: formData.remarks.trim(),
      keypoints: formData.keypoints.trim(),
      diagnosis: formData.diagnosis.trim(),
      prescriptions: prescriptions.map(p => ({
        medicineName: p.medicineName.trim(),
        dosage: p.dosage.trim(),
        frequency: p.frequency.trim(),
        duration: p.duration.trim(),
        instructions: p.instructions.trim(),
        status: p.status,
        notes: p.notes.trim()
      }))
    }

    // Show appropriate notification based on mode
    if (consultationMode === 'edit') {
      const response = await consultationRemarksService.updateReport(medicalRecordId, payload);
      showNotification('Consultation remarks updated successfully', 'success')
    } else {
      const response = await createConsultationReport(payload);
      showNotification('Consultation remarks saved successfully', 'success')
    }

    // If in appointment mode and creating new consultation, update appointment status to DONE
    if (isAppointmentMode && appointmentId && consultationMode === 'create') {
      try {
        await appointmentService.updateAppointment(appointmentId, { status: 'DONE' })
        showNotification('Appointment marked as completed', 'success')
      } catch (error) {
        showNotification('Failed to update appointment status', 'error')
      }
    }

    // Reset form after successful save
    setFormData({
      patient: null,
      doctor: null,
      patientId: '',
      doctorId: '',
      remarks: '',
      keypoints: '',
      diagnosis: '',
    })
    setPrescriptions([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', status: 'ACTIVE', notes: '' }])
    setMedicalRecordId(null)
    setIsEditMode(false)
    setIsFollowUp(false)
    setExistingMedicalRecord(null)
    setConsultationMode('create')

    // Navigate back to appointments if in appointment mode
    if (isAppointmentMode) {
      navigate('/appointments')
    }
  }

  const filterOptions = createFilterOptions({ matchFrom: 'any', stringify: (option) => option.name })
  const patientFilterOptions = createFilterOptions({ matchFrom: 'any', stringify: (option) => option.patientName })

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/appointments')}
          sx={{ mb: 2 }}
        >
          Back to Appointment List
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {consultationMode === 'edit' ? 'View/Update Consultation Remarks' : 'Consultation Remarks'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {consultationMode === 'edit'
              ? 'View and update consultation details and prescriptions for this completed appointment'
              : 'Record consultation details and prescriptions for this appointment'}
          </Typography>
          {isAppointmentMode && appointment && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <EventIcon fontSize="small" color="primary" />
              {appointment.appointmentdatetime && (
                <Chip
                  label={`Appointment: ${new Date(appointment.appointmentdatetime).toLocaleString()}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {appointment.type && (
                <Chip
                  label={`Type: ${appointment.type === 'FOLLOW_UP' ? 'Follow Up' : appointment.type === 'NEW_PATIENT' ? 'New Patient' : appointment.type === 'NEW_DIAGNOSIS' ? 'New Diagnosis' : 'Emergency'}`}
                  size="small"
                  color={appointment.type === 'FOLLOW_UP' ? 'success' : appointment.type === 'EMERGENCY' ? 'error' : 'info'}
                  variant="outlined"
                />
              )}
              {appointment.status && (
                <Chip
                  label={`Status: ${appointment.status === 'DONE' || appointment.status === 1 ? 'Completed' : appointment.status === 'CANCEL' || appointment.status === 2 ? 'Cancelled' : 'Scheduled'}`}
                  size="small"
                  color={appointment.status === 'DONE' || appointment.status === 1 ? 'success' : appointment.status === 'CANCEL' || appointment.status === 2 ? 'error' : 'info'}
                  variant="outlined"
                />
              )}
              {consultationMode === 'edit' && (
                <Chip
                  label="Viewing Existing Record"
                  size="small"
                  color="info"
                  variant="filled"
                  icon={<NotesIcon fontSize="small" />}
                />
              )}
              {consultationMode === 'create' && (
                <Chip
                  label="Creating New Record"
                  size="small"
                  color="success"
                  variant="filled"
                />
              )}
              {appointment.patientName && (
                <Typography variant="caption" color="text.secondary">
                  Patient: <strong>{appointment.patientName}</strong>
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.patient} required>
                  <Autocomplete
                    disablePortal
                    disabled={isAppointmentMode}
                    options={patients}
                    filterOptions={patientFilterOptions}
                    getOptionLabel={(option) => option.patientName}
                    value={formData.patient}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={isAppointmentMode ? "Patient (from appointment)" : "Patient"}
                        placeholder={isAppointmentMode ? "Pre-filled from appointment" : "Select patient"}
                      />
                    )}
                    onChange={(e, value) => setFormData({...formData, patient: value, patientId: value?.id || ''})}
                  />
                  {errors.patientId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.patientId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Doctor Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.doctor} required>
                  <Autocomplete
                    disablePortal
                    disabled={isAppointmentMode}
                    options={doctors}
                    filterOptions={filterOptions}
                    getOptionLabel={(option) => `Dr. ${option.name}`}
                    value={formData.doctor}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={isAppointmentMode ? "Doctor (from appointment)" : "Doctor"}
                        placeholder={isAppointmentMode ? "Pre-filled from appointment" : "Select doctor"}
                      />
                    )}
                    onChange={(e, value) => setFormData({ ...formData, doctor: value, doctorId: value?.id || '' })}
                  />
                  {errors.doctorId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.doctorId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Remarks */}
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!errors.remarks}
                  helperText={errors.remarks}
                  required
                  placeholder="Enter consultation remarks..."
                />
              </Grid>

              {/* Keypoints */}
              <Grid item xs={12}>
                <TextField
                  name="keypoints"
                  label="Keypoints"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.keypoints}
                  onChange={handleChange}
                  error={!!errors.keypoints}
                  helperText={errors.keypoints}
                  required
                  placeholder="Enter key points from consultation..."
                />
              </Grid>

              {/* Diagnosis */}
              <Grid item xs={12}>
                <TextField
                  name="diagnosis"
                  label="Diagnosis"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.diagnosis}
                  onChange={handleChange}
                  error={!!errors.diagnosis}
                  helperText={errors.diagnosis}
                  required
                  placeholder="Enter diagnosis..."
                />
              </Grid>

              {/* Prescriptions Section */}
              <Grid item xs={12}>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Prescriptions
                      </Typography>
                      {consultationMode === 'edit' && prescriptions.length > 0 && (
                        <Chip
                          label={`${prescriptions.length} medication${prescriptions.length !== 1 ? 's' : ''} prescribed`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      {consultationMode === 'create' && (
                        <Typography variant="body2" color="text.secondary">
                          ({prescriptions.length} {prescriptions.length === 1 ? 'medication' : 'medications'})
                        </Typography>
                      )}
                    </Box>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddPrescription}
                      variant="outlined"
                      size="small"
                    >
                      Add Medication
                    </Button>
                  </Box>

                  {prescriptions.map((prescription, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        mb: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                            {index + 1}
                          </Box>
                          <Typography variant="h6" fontWeight={600}>
                            Medication #{index + 1}
                          </Typography>
                        </Box>
                        {prescriptions.length > 1 && (
                          <IconButton
                            onClick={() => handleRemovePrescription(index)}
                            color="error"
                            size="small"
                            sx={{ bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light' } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>

                      <Grid container spacing={2.5}>
                        {/* Medicine Details Section */}
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ mb: 2, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
                          >
                            Medicine Details
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Medicine Name"
                                fullWidth
                                value={prescription.medicineName}
                                onChange={(e) => handlePrescriptionChange(index, 'medicineName', e.target.value)}
                                error={!!errors[`prescription_${index}_medicineName`]}
                                helperText={errors[`prescription_${index}_medicineName`]}
                                required
                                placeholder="e.g., Paracetamol 500mg"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Dosage"
                                fullWidth
                                value={prescription.dosage}
                                onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                                error={!!errors[`prescription_${index}_dosage`]}
                                helperText={errors[`prescription_${index}_dosage`]}
                                required
                                placeholder="e.g., 1 tablet, 5ml, 2 capsules"
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Schedule Information Section */}
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ mb: 2, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
                          >
                            Schedule Information
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth error={!!errors[`prescription_${index}_frequency`]} required>
                                <InputLabel>Frequency</InputLabel>
                                <Select
                                  value={prescription.frequency}
                                  onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                  label="Frequency"
                                >
                                  <MenuItem value="Once daily">Once daily</MenuItem>
                                  <MenuItem value="Twice daily">Twice daily</MenuItem>
                                  <MenuItem value="Three times daily">Three times daily</MenuItem>
                                  <MenuItem value="Four times daily">Four times daily</MenuItem>
                                  <MenuItem value="Every 4 hours">Every 4 hours</MenuItem>
                                  <MenuItem value="Every 6 hours">Every 6 hours</MenuItem>
                                  <MenuItem value="Every 8 hours">Every 8 hours</MenuItem>
                                  <MenuItem value="Every 12 hours">Every 12 hours</MenuItem>
                                  <MenuItem value="As needed">As needed (PRN)</MenuItem>
                                  <MenuItem value="Before meals">Before meals</MenuItem>
                                  <MenuItem value="After meals">After meals</MenuItem>
                                  <MenuItem value="At bedtime">At bedtime</MenuItem>
                                </Select>
                                {errors[`prescription_${index}_frequency`] && (
                                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                    {errors[`prescription_${index}_frequency`]}
                                  </Typography>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Duration"
                                fullWidth
                                value={prescription.duration}
                                onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                error={!!errors[`prescription_${index}_duration`]}
                                helperText={errors[`prescription_${index}_duration`] || 'e.g., 5 days, 2 weeks, 1 month'}
                                required
                                placeholder="Duration of treatment"
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Instructions & Status Section */}
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ mb: 2, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
                          >
                            Instructions & Status
                          </Typography>
                          <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12} md={8}>
                              <TextField
                                label="Instructions"
                                fullWidth
                                multiline
                                rows={2}
                                value={prescription.instructions}
                                onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                                error={!!errors[`prescription_${index}_instructions`]}
                                helperText={errors[`prescription_${index}_instructions`] || 'Special instructions for taking this medication'}
                                required
                                placeholder="e.g., Take with food, Swallow whole, Do not crush"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: 'auto'
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <FormControl fullWidth error={!!errors[`prescription_${index}_status`]} required>
                                <InputLabel>Status</InputLabel>
                                <Select
                                  value={prescription.status}
                                  onChange={(e) => handlePrescriptionChange(index, 'status', e.target.value)}
                                  label="Status"
                                  sx={{
                                    '& .MuiOutlinedInput-input': {
                                                                      py: 2.5
                                    }
                                  }}
                                >
                                  <MenuItem value="ACTIVE">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                                      Active
                                    </Box>
                                  </MenuItem>
                                  <MenuItem value="DONE">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                                      Done
                                    </Box>
                                  </MenuItem>
                                  <MenuItem value="STOPPED">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                                      Stopped
                                    </Box>
                                  </MenuItem>
                                </Select>
                                {errors[`prescription_${index}_status`] && (
                                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                    {errors[`prescription_${index}_status`]}
                                  </Typography>
                                )}
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Additional Notes Section */}
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 2, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}
                          >
                            Additional Information
                          </Typography>
                          <TextField
                            label="Notes"
                            fullWidth
                            multiline
                            rows={2}
                            value={prescription.notes}
                            onChange={(e) => handlePrescriptionChange(index, 'notes', e.target.value)}
                            placeholder="Any additional notes, warnings, or comments..."
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'grey.50'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<NotesIcon />}
                  >
                    {consultationMode === 'edit' ? 'Update Consultation' : 'Save Consultation'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ConsultationRemarks
