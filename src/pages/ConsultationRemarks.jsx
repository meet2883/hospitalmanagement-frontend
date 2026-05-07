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
  createFilterOptions
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Notes as NotesIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { patientService } from '../services/patientService'
import { doctorService } from '../services/doctorService'

const ConsultationRemarks = () => {
  const navigate = useNavigate()
  const { showNotification, createConsultationReport } = useApp()

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    patient: {},
    doctor: {},
    remarks: '',
    keypoints: '',
    diagnosis: '',
  })

  const [prescriptions, setPrescriptions] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', status: 'ACTIVE', notes: '' }
  ])

  const [errors, setErrors] = useState({})

  // Fetch patients and doctors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          patientService.getAllPatients(),
          doctorService.getAllDoctors()
        ])
        setPatients(patientsData)
        setDoctors(doctorsData)
      } catch (error) {
        showNotification('Failed to load data', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [showNotification])

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

    const response = await createConsultationReport(payload);
    showNotification('Consultation remarks saved successfully', 'success')

    // TODO: Call API to save consultation remarks
    // await consultationService.createConsultationRemarks(payload)

    // Reset form after successful save
    setFormData({
      patient: {},
      doctor: {},
      remarks: '',
      keypoints: '',
      diagnosis: '',
    })
    setPrescriptions([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', status: 'ACTIVE', notes: '' }])
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
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Consultation Remarks
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Record consultation details and prescriptions
        </Typography>
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
                    options={patients}
                    filterOptions={patientFilterOptions}
                    getOptionLabel={(option) => option.patientName}
                    renderInput={(params) => <TextField {...params} label="Patient" />}
                    onChange={(e, value) => setFormData({...formData, patient: value })}
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
                    options={doctors}
                    filterOptions={filterOptions}
                    getOptionLabel={(option) => `Dr. ${option.name}`}
                    renderInput={(params) => <TextField {...params} label="Doctor" />}
                    onChange={(e, value) => setFormData({ ...formData, doctor: value })}
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
                      <Typography variant="body2" color="text.secondary">
                        ({prescriptions.length} {prescriptions.length === 1 ? 'medication' : 'medications'})
                      </Typography>
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
                    Save Consultation
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
