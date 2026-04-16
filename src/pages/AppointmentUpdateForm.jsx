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
  CircularProgress,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'

const AppointmentUpdateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { patients, doctors, fetchPatients, fetchDoctors, appointments, updateAppointment } =
    useApp()

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentdatetime: '',
    status: 'SCHEDULE',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchPatients(), fetchDoctors()])
      setIsLoading(false)
    }
    loadData()
  }, [fetchPatients, fetchDoctors])

  useEffect(() => {
    // Only proceed if data is loaded
    if (isLoading || patients.length === 0 || doctors.length === 0) {
      return
    }

    console.log('Patients:', patients)
    console.log('Doctors:', doctors)
    console.log('Appointments:', appointments)

    // Find the appointment to edit
    const appointmentToEdit = appointments.find((apt) => apt.id === parseInt(id))
    if (appointmentToEdit) {
      console.log('Appointment to edit:', appointmentToEdit)

      // Match patient by name to find the ID
      const matchedPatient = patients.find(
        (p) => p.patientName === appointmentToEdit.patientName ||
               p.patientName === appointmentToEdit.patient_name
      )

      // Match doctor by name to find the ID
      const matchedDoctor = doctors.find(
        (d) => d.name === appointmentToEdit.doctorName ||
               d.name === appointmentToEdit.doctor_name
      )

      console.log('Matched patient:', matchedPatient)
      console.log('Matched doctor:', matchedDoctor)

      // Handle status - could be string or numeric (from enum ordinal)
      let statusValue = appointmentToEdit.status
      if (typeof statusValue === 'number') {
        // Map numeric status to string
        const statusMap = { 0: 'SCHEDULE', 1: 'DONE', 2: 'CANCEL' }
        statusValue = statusMap[statusValue] || 'SCHEDULE'
      }

      const newFormData = {
        patientId: matchedPatient?.id || '',
        doctorId: matchedDoctor?.id || '',
        appointmentdatetime: appointmentToEdit.appointmentdatetime
          ? new Date(appointmentToEdit.appointmentdatetime)
              .toISOString()
              .slice(0, 16)
          : '',
        status: statusValue || 'SCHEDULE',
      }

      console.log('Setting form data:', newFormData)
      setFormData(newFormData)
    } else {
      console.log('Appointment not found with id:', id)
    }
  }, [id, appointments, patients, doctors, isLoading])

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
      patientId: formData.patientId,
      doctorId: formData.doctorId,
    }

    const success = await updateAppointment(id, payload)

    if (success) {
      navigate('/appointments')
    }
  }

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
          Update Appointment
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.patientId} required>
                    <InputLabel>Patient</InputLabel>
                    <Select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      label="Patient"
                    >
                      <MenuItem value="" disabled>
                        Select Patient
                      </MenuItem>
                      {patients.map((patient) => (
                        <MenuItem key={patient.id} value={patient.id}>
                          {patient.patientName} - {patient.phoneNumber}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.doctorId} required>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      label="Doctor"
                    >
                      <MenuItem value="" disabled>
                        Select Doctor
                      </MenuItem>
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialization}
                        </MenuItem>
                      ))}
                    </Select>
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
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
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
                      Update Appointment
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default AppointmentUpdateForm
