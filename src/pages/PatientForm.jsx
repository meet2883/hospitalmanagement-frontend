import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { patientService } from '../services/patientService'

const PatientForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { insurances, fetchInsurances, createPatient, updatePatient } =
    useApp()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    patientName: '',
    gender: '',
    phoneNumber: '',
    bloodGroup: '',
    address: '',
    age: '',
    dateOfBirth: '',
    insuranceId: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchInsurances()
    if (id) {
      fetchPatientData()
    }
  }, [id])

  const fetchPatientData = async () => {
    try {
      const data = await patientService.getPatientById(id)
      setFormData({
        patientName: data.patientName || '',
        gender: data.gender || '',
        phoneNumber: data.phoneNumber || '',
        bloodGroup: data.bloodGroup || '',
        address: data.address || '',
        age: data.age || '',
        dateOfBirth: data.dateOfBirth || '',
        insuranceId: data.insurance?.id || '',
      })
    } catch (error) {
      console.error('Error fetching patient:', error)
    }
  }

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

    // Patient Name validation
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required'
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }

    // Phone Number validation - exactly 10 digits
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits'
    }

    // Age validation - between 1 and 100
    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (formData.age < 1 || formData.age > 100) {
      newErrors.age = 'Age must be between 1 and 100'
    }

    // Blood Group validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required'
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
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
      patientName: formData.patientName,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      age: parseInt(formData.age),
      dateOfBirth: formData.dateOfBirth || null,
      insurance: formData.insuranceId ? { id: formData.insuranceId } : null,
    }

    let success
    if (isEditing) {
      success = await updatePatient(id, payload)
    } else {
      success = await createPatient(payload)
    }

    if (success) {
      navigate('/patients')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          sx={{ mb: 2 }}
        >
          Back to Patients
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? 'Edit Patient' : 'Add New Patient'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="patientName"
                  label="Patient Name"
                  fullWidth
                  value={formData.patientName}
                  onChange={handleChange}
                  error={!!errors.patientName}
                  helperText={errors.patientName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender} required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="age"
                  label="Age"
                  type="number"
                  fullWidth
                  value={formData.age}
                  onChange={handleChange}
                  error={!!errors.age}
                  helperText={errors.age}
                  inputProps={{ min: 1, max: 100 }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.bloodGroup} required>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    label="Blood Group"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                  {errors.bloodGroup && <FormHelperText>{errors.bloodGroup}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Insurance</InputLabel>
                  <Select
                    name="insuranceId"
                    value={formData.insuranceId}
                    onChange={handleChange}
                    label="Insurance"
                  >
                    <MenuItem value="">None</MenuItem>
                    {insurances.map((insurance) => (
                      <MenuItem key={insurance.id} value={insurance.id}>
                        {insurance.policyName} - {insurance.policyProvider}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/patients')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditing ? 'Update Patient' : 'Create Patient'}
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

export default PatientForm
