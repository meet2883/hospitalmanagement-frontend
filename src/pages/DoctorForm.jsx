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
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { doctorService } from '../services/doctorService'

const DoctorForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { createDoctor, updateDoctor } = useApp()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (id) {
      fetchDoctorData()
    }
  }, [id])

  const fetchDoctorData = async () => {
    try {
      const data = await doctorService.getDoctorById(id)
      setFormData({
        name: data.name || '',
        email: data.email || '',
        specialization: data.specialization || '',
      })
    } catch (error) {
      console.error('Error fetching doctor:', error)
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

    if (!formData.name.trim()) {
      newErrors.name = 'Doctor name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required'
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
      name: formData.name,
      email: formData.email,
      specialization: formData.specialization,
    }

    let success
    if (isEditing) {
      success = await updateDoctor(id, payload)
    } else {
      success = await createDoctor(payload)
    }

    if (success) {
      navigate('/doctors')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/doctors')}
          sx={{ mb: 2 }}
        >
          Back to Doctors
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Doctor Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.specialization} required>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    label="Specialization"
                  >
                    <MenuItem value="CARDIOLOGIST">Cardiologist</MenuItem>
                    <MenuItem value="PHISHIYO">Physician</MenuItem>
                    <MenuItem value="PHYCHOLOGIST">Psychologist</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/doctors')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditing ? 'Update Doctor' : 'Create Doctor'}
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

export default DoctorForm
