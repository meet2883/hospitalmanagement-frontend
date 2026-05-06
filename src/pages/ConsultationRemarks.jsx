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
  const { showNotification } = useApp()

  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    remarks: '',
    keypoints: '',
    diagnosis: '',
  })

  const [prescriptions, setPrescriptions] = useState([
    { instructions: '', status: 'ACTIVE', notes: '' }
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
      { instructions: '', status: 'ACTIVE', notes: '' }
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

    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Doctor is required'
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
      patient: { id: formData.patientId },
      doctor: { id: formData.doctorId },
      remarks: formData.remarks.trim(),
      keypoints: formData.keypoints.trim(),
      diagnosis: formData.diagnosis.trim(),
      prescriptions: prescriptions.map(p => ({
        instructions: p.instructions.trim(),
        status: p.status,
        notes: p.notes.trim()
      }))
    }

    console.log('Consultation Remarks Payload:', payload)
    showNotification('Consultation remarks saved successfully', 'success')

    // TODO: Call API to save consultation remarks
    // await consultationService.createConsultationRemarks(payload)

    // Reset form after successful save
    setFormData({
      patientId: '',
      doctorId: '',
      remarks: '',
      keypoints: '',
      diagnosis: '',
    })
    setPrescriptions([{ instructions: '', status: 'ACTIVE', notes: '' }])
  }

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
                <FormControl fullWidth error={!!errors.patientId} required>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    label="Patient"
                  >
                    <MenuItem value="">Select Patient</MenuItem>
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.patientName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.patientId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.patientId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Doctor Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.doctorId} required>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    label="Doctor"
                  >
                    <MenuItem value="">Select Doctor</MenuItem>
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.doctorName}
                      </MenuItem>
                    ))}
                  </Select>
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
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Prescriptions
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddPrescription}
                      variant="outlined"
                      size="small"
                    >
                      Add Prescription
                    </Button>
                  </Box>

                  {prescriptions.map((prescription, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          Prescription #{index + 1}
                        </Typography>
                        {prescriptions.length > 1 && (
                          <IconButton
                            onClick={() => handleRemovePrescription(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>

                      <Grid container spacing={2}>
                        {/* Instructions */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Instructions"
                            fullWidth
                            multiline
                            rows={2}
                            value={prescription.instructions}
                            onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                            error={!!errors[`prescription_${index}_instructions`]}
                            helperText={errors[`prescription_${index}_instructions`]}
                            required
                            placeholder="Medication instructions..."
                          />
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors[`prescription_${index}_status`]} required>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={prescription.status}
                              onChange={(e) => handlePrescriptionChange(index, 'status', e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="ACTIVE">Active</MenuItem>
                              <MenuItem value="DONE">Done</MenuItem>
                              <MenuItem value="STOPPED">Stopped</MenuItem>
                            </Select>
                            {errors[`prescription_${index}_status`] && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {errors[`prescription_${index}_status`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        {/* Notes */}
                        <Grid item xs={12}>
                          <TextField
                            label="Notes"
                            fullWidth
                            multiline
                            rows={2}
                            value={prescription.notes}
                            onChange={(e) => handlePrescriptionChange(index, 'notes', e.target.value)}
                            placeholder="Additional notes..."
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
