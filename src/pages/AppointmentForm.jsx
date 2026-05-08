import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  createFilterOptions
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'

const AppointmentForm = () => {
  const navigate = useNavigate()
  const { patients, doctors, fetchPatients, fetchDoctors, createAppointment } =
    useApp()

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentdatetime: '',
    status: 'SCHEDULE',
    type: 'NEW_PATIENT',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
  }, [fetchPatients, fetchDoctors])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Doctor is required'
    }
    if (!formData.appointmentdatetime) {
      newErrors.appointmentdatetime = 'Appointment date and time is required'
    } else {
      const appointmentDate = new Date(formData.appointmentdatetime)
      if (appointmentDate < new Date()) {
        newErrors.appointmentdatetime =
          'Appointment date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      appointmentdatetime: formData.appointmentdatetime,
      status: formData.status,
      type: formData.type,
    }

    const success = await createAppointment(
      payload,
      formData.patientId,
      formData.doctorId
    )

    if (success) {
      navigate('/appointments')
    }
  }

  // Get today's date and time in ISO format for min attribute
  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  const filterOptions = createFilterOptions({ matchFrom: 'any', stringify: (option) => option.name })
  const patientFilterOptions = createFilterOptions({ matchFrom: 'any', stringify: (option) => option.patientName })

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/appointments')}
          sx={{ mb: 2 }}
        >
          Back to Appointments
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Schedule New Appointment
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.patientId} required>
                  <Autocomplete
                    disablePortal
                    // disabled={isAppointmentMode}
                    options={patients}
                    filterOptions={patientFilterOptions}
                    getOptionLabel={(option) => option.patientName}
                    value={formData.patient}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient"
                        placeholder="Select patient"
                      />
                    )}
                    onChange={(e, value) => setFormData({...formData, patient: value, patientId: value?.id || ''})}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.doctorId} required>
                  <Autocomplete
                    disablePortal
                    options={doctors}
                    filterOptions={filterOptions}
                    getOptionLabel={(option) => `Dr. ${option.name}`}
                    value={formData.doctor}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Doctor"}
                        placeholder={"Select doctor"}
                      />
                    )}
                    onChange={(e, value) => setFormData({ ...formData, doctor: value, doctorId: value?.id || '' })}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="appointmentdatetime"
                  label="Appointment Date & Time"
                  type="datetime-local"
                  fullWidth
                  value={formData.appointmentdatetime}
                  onChange={handleChange}
                  error={!!errors.appointmentdatetime}
                  helperText={errors.appointmentdatetime}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: getMinDateTime(),
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="SCHEDULE">Scheduled</MenuItem>
                    <MenuItem value="DONE">Completed</MenuItem>
                    <MenuItem value="CANCEL">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="NEW_PATIENT">New Patient</MenuItem>
                    <MenuItem value="FOLLOW_UP">Follow Up</MenuItem>
                    <MenuItem value="NEW_DIAGNOSIS">New Diagnosis</MenuItem>
                    <MenuItem value="EMERGENCY">Emergency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/appointments')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Schedule Appointment
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

export default AppointmentForm
